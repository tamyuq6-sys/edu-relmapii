
import { GoogleGenAI, Type } from "@google/genai";
import { CurriculumInfo, DesignScheme, Role, Task, ScriptScene, CognitiveRole, QuizQuestion } from "../types";
import { RULE_CORE, RULE_STRUCTURE, RULE_SUBJECTS, RULE_STEPS } from "../data/promptRules";
import { getApiConfig } from "./apiConfig";

const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.includes('```')) {
    cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
  }
  const jsonStartIndex = cleaned.indexOf('{');
  const jsonEndIndex = cleaned.lastIndexOf('}');
  if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
    cleaned = cleaned.substring(jsonStartIndex, jsonEndIndex + 1);
  }
  return cleaned;
};

const isQuotaError = (error: any) => {
  const msg = error?.message?.toLowerCase() || "";
  const status = error?.status || error?.code || error?.error?.code || 0;
  return status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('limit');
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callGeminiWithRetry = async (config: any, engineId: string, retries = 3) => {
  let lastError: any;
  const apiConfig = getApiConfig();
  
  if (!apiConfig.apiKey) {
    throw new Error("API KEY MISSING");
  }

  // 这里的 engineId 是界面传进来的，我们优先使用用户全局设置的模型，除非特别指定
  const targetModel = apiConfig.model;
  
  for (let i = 0; i <= retries; i++) {
    try {
      const ai = new GoogleGenAI({ apiKey: apiConfig.apiKey });
      const response = await ai.models.generateContent({
        model: targetModel,
        ...config
      });
      return response;
    } catch (error) {
      lastError = error;
      if (isQuotaError(error) && i < retries) {
        const delay = 4000 * Math.pow(2, i);
        console.warn(`API Rate limit, retrying in ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

const getDynamicInstruction = (step: string, subject?: string, needStructure: boolean = true) => {
    let prompt = RULE_CORE + "\n\n";
    if (RULE_STEPS[step]) prompt += RULE_STEPS[step] + "\n\n";
    if (needStructure) prompt += RULE_STRUCTURE + "\n\n";
    if (subject && RULE_SUBJECTS[subject]) prompt += RULE_SUBJECTS[subject] + "\n\n";
    prompt += `【输出纪律】必须严格使用中文。生成的 JSON 必须符合 schema。`;
    return prompt;
};

export const analyzeCurriculumMaterial = async (
  rawContent: string, 
  userInstructions: string,
  metadata: { subject: string, grade: string, version: string },
  engineId: string = 'gemini-3-flash'
): Promise<CurriculumInfo> => {
  try {
    const prompt = `任务：基于《${metadata.subject}》解析教材。内容：${rawContent}。要求：${userInstructions}。`;
    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction: getDynamicInstruction('analysis', metadata.subject, false),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            unit: { type: Type.STRING },
            knowledgePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            coreCompetencies: { type: Type.ARRAY, items: { type: Type.STRING } },
            teachingFocus: { type: Type.STRING },
            teachingDifficulty: { type: Type.STRING }
          },
          required: ["unit", "knowledgePoints", "teachingFocus"]
        }
      }
    }, engineId);
    return JSON.parse(cleanJsonResponse(response.text || "{}"));
  } catch (error) {
    console.error("Analyze Error:", error);
    return { ...metadata, unit: "解析异常，请检查配置", knowledgePoints: ["点此手动输入"], coreCompetencies: ["点此手动输入"] };
  }
};

export const generateOutline = async (
  curriculum: CurriculumInfo,
  config: { style: string, duration: number, notes: string },
  engineId: string = 'gemini-3-flash'
): Promise<DesignScheme> => {
  try {
    const prompt = `为《${curriculum.unit}》设计大纲。风格：${config.style}。时长：${config.duration}min。知识点：${curriculum.knowledgePoints.join('、')}。`;
    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction: getDynamicInstruction('outline', curriculum.subject, true),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            positioning: { type: Type.STRING },
            teacherInstructions: { type: Type.STRING },
            acts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  plotLogic: { type: Type.STRING },
                  knowledgePoint: { type: Type.STRING },
                  assessmentContent: { type: Type.STRING },
                  duration: { type: Type.INTEGER }
                },
                required: ["id", "title", "plotLogic", "knowledgePoint", "assessmentContent", "duration"]
              }
            },
            overallLogic: { type: Type.STRING }
          },
          required: ["positioning", "acts", "overallLogic"]
        }
      }
    }, engineId);
    return JSON.parse(cleanJsonResponse(response.text || "{}"));
  } catch (error) { 
    return { positioning: `生成失败`, teacherInstructions: "", overallLogic: "", acts: [], cognitiveRoles: [] }; 
  }
};

export const finalizeScriptFromScheme = async (curriculum: CurriculumInfo, scheme: DesignScheme, engineId: string = 'gemini-3-flash'): Promise<any> => {
  try {
    const limitedActs = scheme.acts.slice(0, 10);
    const prompt = `渲染剧本正文。《${scheme.positioning}》。按大纲生成 ${limitedActs.length} 幕。`;
    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction: getDynamicInstruction('finalize', curriculum.subject, true),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  actId: { type: Type.STRING },
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  narrative: { type: Type.STRING },
                  assetType: { type: Type.STRING, enum: ["image", "video"] },
                  assetPrompt: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ["discussion", "matching", "puzzle", "choice"] }
                      },
                      required: ["id", "title", "description", "type"]
                    }
                  },
                  clues: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        content: { type: Type.STRING }
                      }
                    }
                  }
                },
                required: ["id", "title", "narrative", "tasks"]
              }
            }
          },
          required: ["scenes"]
        }
      }
    }, engineId);
    return JSON.parse(cleanJsonResponse(response.text || "{}"));
  } catch (error) { 
    return { scenes: [] }; 
  }
};

export const generateRoleFunctions = async (c: CurriculumInfo, s: DesignScheme, engineId: string) => {
  try {
    const prompt = `设计4-6个角色。剧本：${s.positioning}。`;
    const resp = await callGeminiWithRetry({
        contents: { parts: [{ text: prompt }] },
        config: { 
          systemInstruction: getDynamicInstruction('roles', c.subject, false), 
          responseMimeType: "application/json"
        }
    }, engineId);
    const result = JSON.parse(cleanJsonResponse(resp.text || "{}"));
    return { ...s, cognitiveRoles: result.cognitiveRoles || [], isOutlineConfirmed: true };
  } catch (error) {
    return { ...s, cognitiveRoles: [], isOutlineConfirmed: true };
  }
};

export const generateQuizzesForScript = async (c: CurriculumInfo, g: any, e: string) => {
  try {
    const resp = await callGeminiWithRetry({
        contents: `为剧本《${c.unit}》生成习题。`,
        config: { 
          systemInstruction: getDynamicInstruction('quiz', c.subject, true), 
          responseMimeType: "application/json"
        }
    }, e);
    const result = JSON.parse(cleanJsonResponse(resp.text || "{}"));
    return result.quiz || [];
  } catch (error) {
    return [];
  }
};

export const generateImageWithAi = async (p: string): Promise<string | null> => {
  const apiConfig = getApiConfig();
  if (!apiConfig.apiKey) return null;
  
  try {
    const ai = new GoogleGenAI({ apiKey: apiConfig.apiKey });
    const resp = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: p }] },
    });
    for (const part of resp.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (e) {
    console.error("Image Gen Error", e);
    return null;
  }
};

export const modifyCurriculumWithAi = async (curr: any, inst: string) => {
  try {
    const response = await callGeminiWithRetry({
      contents: `修改指令：${inst}`,
      config: { systemInstruction: getDynamicInstruction('analysis', curr.subject, false), responseMimeType: "application/json" }
    }, 'gemini-3-flash');
    return JSON.parse(cleanJsonResponse(response.text || "{}"));
  } catch (e) { return curr; }
};

export const modifySchemeWithAi = async (scheme: any, inst: string) => {
  try {
    const response = await callGeminiWithRetry({
      contents: `修改指令：${inst}`,
      config: { systemInstruction: getDynamicInstruction('outline', '', true), responseMimeType: "application/json" }
    }, 'gemini-3-flash');
    return JSON.parse(cleanJsonResponse(response.text || "{}"));
  } catch (e) { return scheme; }
};

export const modifyRolesWithAi = async (roles: any, inst: string) => {
  try {
    const response = await callGeminiWithRetry({
      contents: `修改指令：${inst}`,
      config: { systemInstruction: getDynamicInstruction('roles', '', false), responseMimeType: "application/json" }
    }, 'gemini-3-flash');
    const res = JSON.parse(cleanJsonResponse(response.text || "{}"));
    return res.cognitiveRoles || res;
  } catch (e) { return roles; }
};

export const modifySceneWithAi = async (scene: any, inst: string) => {
  try {
    const response = await callGeminiWithRetry({
      contents: `修改指令：${inst}`,
      config: { systemInstruction: getDynamicInstruction('finalize', '', true), responseMimeType: "application/json" }
    }, 'gemini-3-flash');
    return JSON.parse(cleanJsonResponse(response.text || "{}"));
  } catch (e) { return scene; }
};

export const modifyQuizzesWithAi = async (quiz: any, inst: string) => {
  try {
    const response = await callGeminiWithRetry({
      contents: `修改指令：${inst}`,
      config: { systemInstruction: getDynamicInstruction('quiz', '', true), responseMimeType: "application/json" }
    }, 'gemini-3-flash');
    const res = JSON.parse(cleanJsonResponse(response.text || "{}"));
    return res.quiz || res;
  } catch (e) { return quiz; }
};

export const refineScriptText = async (text: string, inst: string) => text;
