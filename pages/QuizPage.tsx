import React, { useState } from 'react';
import { ArrowRight, CheckCircle, XCircle, LayoutGrid, BookOpen, Calendar, Rocket, Settings, LogOut, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import Button from '../components/Button';
import { QuizQuestion } from '../types';

const QuizPage = ({ questions, onComplete }: { questions: QuizQuestion[], onComplete: (score: number) => void }) => {
  const [answers, setAnswers] = useState<{[key: number]: number | string}>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiFeedbacks, setAiFeedbacks] = useState<{[key: number]: { isCorrect: boolean; feedback: string }}>({});

  const handleSelectOption = (qId: number, answer: number | string) => {
    if (showResult || isEvaluating) return;
    setAnswers(prev => ({...prev, [qId]: answer}));
  };

  const isQuotaError = (error: any) => {
    const msg = error?.message?.toLowerCase() || "";
    const status = error?.status || error?.code || error?.error?.code || 0;
    const statusStr = typeof status === 'string' ? status : '';
    return status === 429 || statusStr.includes('429') || msg.includes('429') || msg.includes('quota');
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const evaluateShortAnswersWithAI = async (shortQuestions: QuizQuestion[]) => {
    const feedbacks: {[key: number]: { isCorrect: boolean; feedback: string }} = {};
    let correctCount = 0;

    for (const q of shortQuestions) {
      const userAnswer = String(answers[q.id] || "").trim();
      if (!userAnswer) {
        feedbacks[q.id] = { isCorrect: false, feedback: "未作答。" };
        continue;
      }

      const executeWithRetry = async (retries = 2): Promise<{ isCorrect: boolean; feedback: string }> => {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `问题: ${q.question}\n背景材料: ${q.material || "无"}\n学生回答: ${userAnswer}\n评分要点: ${q.explanation}`,
            config: {
              systemInstruction: "你是一个公正的阅卷老师。请用中文评估学生的回答是否正确，并给出简洁的鼓励或建议。输出格式必须为 JSON。",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  isCorrect: { type: Type.BOOLEAN },
                  feedback: { type: Type.STRING }
                },
                required: ["isCorrect", "feedback"]
              }
            }
          });
          const text = response.text || "";
          return JSON.parse(text.includes('```') ? text.replace(/```json/g, '').replace(/```/g, '').trim() : text);
        } catch (error) {
          if (isQuotaError(error) && retries > 0) {
            await sleep(3000 * (3 - retries));
            return executeWithRetry(retries - 1);
          }
          console.error("Quiz evaluation error:", error);
          return { isCorrect: false, feedback: "阅卷服务暂时不可用，请稍后。" };
        }
      };

      const result = await executeWithRetry();
      feedbacks[q.id] = result;
      if (result.isCorrect) correctCount++;
    }
    return { feedbacks, correctCount };
  };

  const handleSubmit = async () => {
    setIsEvaluating(true);
    let finalScore = 0;
    const choiceQuestions = questions.filter(q => q.type !== 'short');
    choiceQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) finalScore++;
    });
    const shortQuestions = questions.filter(q => q.type === 'short');
    if (shortQuestions.length > 0) {
      const { feedbacks, correctCount } = await evaluateShortAnswersWithAI(shortQuestions);
      setAiFeedbacks(feedbacks);
      finalScore += correctCount;
    }
    setScore(finalScore);
    setShowResult(true);
    setIsEvaluating(false);
  };

  return (
    <div className="min-h-screen bg-[#FEF9E7] font-nunito flex overflow-hidden selection:bg-amber-200">
      <aside className="w-24 bg-[#FFC107] flex flex-col items-center py-8 gap-8 shrink-0 rounded-r-[2.5rem] my-4 ml-4 shadow-xl z-10 hidden md:flex border-r-4 border-[#e6ad00]">
         <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white/90 mb-4 border-2 border-white/10 shadow-inner">
            <LayoutGrid size={24} />
         </div>
         <nav className="flex flex-col gap-6 w-full items-center">
            <button className="p-3 text-amber-900 bg-white/30 rounded-2xl shadow-sm border border-white/20"><Calendar size={24}/></button>
            <button className="p-3 text-amber-900/60 hover:text-amber-900 hover:bg-white/20 rounded-2xl transition-all"><Rocket size={24}/></button>
         </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
             <div>
                <h2 className="text-4xl font-extrabold text-stone-800 mb-2 tracking-tight">课后小测</h2>
                <p className="text-stone-500 font-bold text-base flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    检验一下你在剧本中学到的历史知识吧！
                </p>
             </div>
             <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border-2 border-amber-100 flex items-center gap-4">
                 <div className="flex flex-col items-end">
                     <span className="text-xs font-black text-stone-400 uppercase tracking-wider">答题进度</span>
                     <span className="text-xl font-black text-amber-500">{Object.keys(answers).length} <span className="text-stone-300 text-sm">/ {questions.length}</span></span>
                 </div>
                 <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border-4 border-white shadow-sm">
                    <Rocket size={20} className="fill-current"/>
                 </div>
             </div>
        </header>

        <div className="grid gap-8 max-w-5xl mx-auto pb-12">
            {questions.map((q, idx) => {
                const isShort = q.type === 'short';
                const userAnswer = answers[q.id];
                const aiResult = aiFeedbacks[q.id];
                const isCorrect = isShort ? aiResult?.isCorrect : userAnswer === q.correctAnswer;
                
                return (
                  <div key={q.id} className="bg-white rounded-[2rem] p-8 shadow-sm border-2 border-stone-100 hover:border-amber-200 hover:shadow-md transition-all group relative">
                    {showResult && (
                        <div className={`absolute top-6 right-8 flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-widest ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                           {isCorrect ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                           {isCorrect ? '判定合格' : '仍需努力'}
                        </div>
                    )}
                    <div className="flex items-start gap-6 mb-8">
                        <span className="bg-amber-100 text-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 text-xl border-2 border-white shadow-sm">
                            {idx + 1}
                        </span>
                        <div className="flex-1 pr-24">
                            <h3 className="text-2xl font-bold text-stone-700 leading-relaxed pt-1 whitespace-pre-line">{q.question}</h3>
                        </div>
                    </div>
                    {isShort ? (
                      <div className="space-y-4">
                        <textarea
                          disabled={showResult || isEvaluating}
                          value={userAnswer as string || ''}
                          onChange={(e) => handleSelectOption(q.id, e.target.value)}
                          placeholder="请输入你的探究见解..."
                          className={`w-full p-6 rounded-[1.5rem] border-2 font-bold outline-none h-40 resize-none transition-all text-lg ${showResult ? 'bg-stone-50 border-stone-100' : 'bg-white border-stone-100'}`}
                        />
                        {showResult && aiResult && (
                          <div className={`p-4 rounded-xl border ${aiResult.isCorrect ? 'bg-green-50 border-green-100 text-green-800' : 'bg-amber-50 border-amber-100 text-amber-800'} font-bold animate-fade-in`}>
                             <div className="flex items-center gap-2 mb-1">
                                <Sparkles size={16}/>
                                <span className="text-xs uppercase tracking-widest font-black">球球评语</span>
                             </div>
                             {aiResult.feedback}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options?.map((opt, oIdx) => {
                          const isSelected = userAnswer === oIdx;
                          const isThisCorrect = showResult && q.correctAnswer === oIdx;
                          const isThisWrong = showResult && isSelected && !isThisCorrect;
                          return (
                            <button
                              key={oIdx}
                              disabled={showResult || isEvaluating}
                              onClick={() => handleSelectOption(q.id, oIdx)}
                              className={`p-5 rounded-2xl border-2 font-bold text-left flex items-center gap-4 transition-all ${isThisCorrect ? 'bg-green-50 border-green-500' : isThisWrong ? 'bg-red-50 border-red-500' : isSelected ? 'bg-amber-100 border-amber-400' : 'bg-white'}`}
                            >
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-amber-400 text-white' : 'bg-stone-100 text-stone-400'}`}>
                                {['A', 'B', 'C', 'D'][oIdx]}
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
            })}
            <div className="mt-8 flex justify-center">
              {!showResult ? (
                <Button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length || isEvaluating} variant="accent" className="px-16 py-5 text-xl">
                  {isEvaluating ? <div className="flex items-center gap-3"><Loader2 className="animate-spin" size={24}/>球球正在阅卷中...</div> : '提交答卷'}
                </Button>
              ) : (
                <Button onClick={() => onComplete(score)} variant="primary" className="px-16 py-5 text-xl">
                  查看探险报告 <ArrowRight className="ml-2"/>
                </Button>
              )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;