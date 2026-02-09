
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { getApiConfig } from "./apiConfig";

const SYSTEM_INSTRUCTION = `你现在的身份是“学伴球球”（Qiuqiu）。
核心原则：启发式引导，减少剧情描述，语气友好好奇。`;

const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned;
};

// 动态获取模型
const getModelName = () => getApiConfig().model;

const isQuotaError = (error: any) => {
  const msg = error?.message?.toLowerCase() || "";
  const status = error?.status || error?.code || error?.error?.code || 0;
  const statusStr = typeof status === 'string' ? status : '';
  
  return status === 429 || 
         statusStr.includes('429') ||
         statusStr.includes('RESOURCE_EXHAUSTED') || 
         msg.includes('429') || 
         msg.includes('quota') || 
         msg.includes('limit') ||
         msg.includes('exhausted');
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callWithRetry = async <T>(
  fn: (ai: any) => Promise<T>,
  retries = 3,
  baseDelay = 10000 // 增加基础延迟，给予 429 错误更多的恢复时间
): Promise<T> => {
  let lastError: any;
  const config = getApiConfig();
  
  if (!config.apiKey) {
    throw new Error("API KEY MISSING: 请在右下角设置中心配置 API Key");
  }

  for (let i = 0; i <= retries; i++) {
    try {
      const ai = new GoogleGenAI({ apiKey: config.apiKey });
      return await fn(ai);
    } catch (error) {
      lastError = error;
      if (isQuotaError(error) && i < retries) {
        const delay = baseDelay * Math.pow(2, i);
        console.warn(`Quota exceeded, retrying in ${delay}ms... (Attempt ${i + 1}/${retries + 1})`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

export const generateDMResponse = async (
  context: string,
  userMessage: string,
  history: { role: string; text: string }[]
): Promise<string> => {
  try {
    return await callWithRetry(async (ai) => {
      let prompt = `场景: ${context}\n`;
      history.forEach(h => {
          prompt += `${h.role === 'user' ? '队友' : '球球'}: ${h.text}\n`;
      });
      prompt += `队友: ${userMessage}\n回复：`;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: getModelName(),
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });
      return response.text || "吱！咱们继续加油呀！";
    });
  } catch (error: any) {
    console.error("Gemini DM Error:", error);
    if (error.message?.includes("API KEY MISSING")) return error.message;
    return "吱吱... 额度好像用完啦，请稍微等一分钟或者在侧边设置里换个模型再试。吱！";
  }
};

export const generateDiscussionHighlight = async (
  userMessage: string,
  aiResponse: string
): Promise<string | null> => {
  try {
    return await callWithRetry(async (ai) => {
      const prompt = `分析对话并总结逻辑火花：\n用户: ${userMessage}\nAI: ${aiResponse}`;
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: getModelName(),
        contents: prompt,
        config: {
          systemInstruction: "总结学生的思考亮点，15字以内。",
          temperature: 0.3,
        },
      });
      return response.text?.trim() || null;
    }, 1, 1000);
  } catch (error) {
    return null;
  }
};

export const generateLearningReport = async (
  scriptTitle: string,
  knowledgePoints: string[],
  transcript: string[],
  quizScore: number,
  totalQuestions: number
): Promise<any> => {
  try {
    return await callWithRetry(async (ai) => {
      const prompt = `生成${scriptTitle}的报告。得分: ${quizScore}/${totalQuestions}`;
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: getModelName(),
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plotReview: { type: Type.STRING },
              teacherSuggestion: { type: Type.STRING },
              knowledgeMap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    point: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ['mastered', 'weak'] }
                  },
                  required: ['point', 'status']
                }
              },
              abilities: {
                type: Type.OBJECT,
                properties: {
                  history: { type: Type.INTEGER },
                  logic: { type: Type.INTEGER },
                  collaboration: { type: Type.INTEGER },
                  spaceTime: { type: Type.INTEGER },
                  values: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      });
      return JSON.parse(cleanJsonResponse(response.text || "{}"));
    });
  } catch (error) {
    console.error("Report Generation Error:", error);
    return {
      plotReview: "今天的历险很精彩！由于配置波动，报告部分内容为预设方案。",
      teacherSuggestion: "继续保持这种状态，请确保 API 配置正确以解锁全量分析。",
      knowledgeMap: knowledgePoints.map(p => ({ point: p, status: 'mastered' })),
      abilities: { history: 85, logic: 80, collaboration: 90, spaceTime: 75, values: 85 }
    };
  }
};
