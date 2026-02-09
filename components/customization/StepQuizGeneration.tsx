import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ChevronRight, Sparkles, CheckCircle, XCircle, 
  HelpCircle, Loader2, Trash2, Plus, FileText, AlertCircle,
  ListTodo, MessageSquareQuote
} from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import { QuizQuestion } from '../../types';
import { modifyQuizzesWithAi, modifyQuizzesWithAi as modifySingleQuizWithAi } from '../../services/customizationService';
import AiRefinePopover from './AiRefinePopover';

interface StepQuizGenerationProps {
  questions: QuizQuestion[];
  onBack: () => void;
  onPublish: (finalQuiz: QuizQuestion[]) => void;
}

const StepQuizGeneration: React.FC<StepQuizGenerationProps> = ({ questions, onBack, onPublish }) => {
  const [localQuestions, setLocalQuestions] = useState<QuizQuestion[]>([]);
  const [showGlobalAiPopover, setShowGlobalAiPopover] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeRefineIdx, setActiveRefineIdx] = useState<number | null>(null);

  useEffect(() => {
    if (questions) setLocalQuestions(questions);
  }, [questions]);

  const handleAiModify = async (instruction: string) => {
    setIsProcessing(true);
    const updated = await modifyQuizzesWithAi(localQuestions, instruction);
    setLocalQuestions(updated);
    setIsProcessing(false);
    setShowGlobalAiPopover(false);
  };

  const handleGlobalAutoRefine = async () => {
    await handleAiModify("自动优化整个题组的难度梯度、史实准确性及解析连贯性");
  };

  const handleSingleRefine = async (idx: number, instruction: string) => {
    setIsProcessing(true);
    const currentQ = localQuestions[idx];
    const updated = await modifySingleQuizWithAi([currentQ], instruction);
    if (updated && updated.length > 0) {
      const newList = [...localQuestions];
      newList[idx] = updated[0];
      setLocalQuestions(newList);
    }
    setIsProcessing(false);
  };

  const handleAutoRefine = async (idx: number) => {
    await handleSingleRefine(idx, "自动优化题目清晰度、干扰项逻辑以及解析深度");
  };

  const handleUpdateQuestion = (idx: number, fields: Partial<QuizQuestion>) => {
    const newList = [...localQuestions];
    newList[idx] = { ...newList[idx], ...fields };
    setLocalQuestions(newList);
  };

  const handleRemoveQuestion = (idx: number) => {
    setLocalQuestions(localQuestions.filter((_, i) => i !== idx));
  };

  const addNewQuestion = (type: 'choice' | 'short') => {
    const newQ: QuizQuestion = {
      id: Date.now(),
      type: type,
      question: type === 'choice' ? '请在这里输入单项选择题的题目内容' : '请在这里输入简答题的探究问题',
      explanation: '请在这里输入参考解析内容...',
      ...(type === 'choice' ? {
        options: ['选项 A', '选项 B', '选项 C', '选项 D'],
        correctAnswer: 0
      } : {})
    };
    setLocalQuestions([...localQuestions, newQ]);
    
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const getTypeName = (type: string) => {
    switch(type) {
      case 'choice': return '单项选择题';
      case 'short': return '思维简答题';
      case 'boolean': return '史实判断题';
      case 'material-analysis': return '情境材料题';
      default: return '测评习题';
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 shrink-0 gap-6 border-b-2 border-stone-100/50 pb-6">
         <div className="flex items-center gap-5">
            <Button variant="secondary" onClick={onBack} className="px-4 py-2 text-xs border-stone-200 bg-white hover:bg-stone-50 shadow-none">
               <ArrowLeft size={14}/> 返回剧本预览
            </Button>
            <div>
               <div className="flex items-center gap-2 mb-0.5">
                  <span className="bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">最终测评阶段</span>
                  <div className="h-px w-8 bg-stone-200"></div>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">支持多样化题型联动</span>
               </div>
               <h2 className="text-2xl font-black text-stone-800 tracking-tight">多元化教学习题组</h2>
            </div>
         </div>
         <div className="flex gap-4 items-center">
            {/* Global AI Refine Button Container - Unified Sizing */}
            <div className="relative">
                <button 
                    onClick={() => setShowGlobalAiPopover(!showGlobalAiPopover)} 
                    className={`px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 border-2 transition-all shadow-sm
                        ${showGlobalAiPopover ? 'bg-blue-100 border-blue-300 text-[#5D4037]' : 'bg-blue-50 text-[#5D4037] border-blue-200 hover:bg-blue-100'}
                    `}
                >
                   <Sparkles size={18} className="text-[#8B5CF6]" />
                   <span>AI 优化题组</span>
                </button>

                {showGlobalAiPopover && (
                    <AiRefinePopover 
                        onRefine={handleAiModify}
                        onAutoRefine={handleGlobalAutoRefine}
                        onClose={() => setShowGlobalAiPopover(false)}
                    />
                )}
            </div>

            <Button 
                onClick={() => onPublish(localQuestions)} 
                variant="accent" 
                className="px-10 py-3.5 text-lg shadow-xl font-black"
            >
               确认并发布剧本 <ChevronRight size={20} className="ml-1"/>
            </Button>
         </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative">
        {isProcessing && (
           <div className="fixed inset-0 z-[200] bg-white/40 flex items-center justify-center">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-2 border-blue-100">
                 <Loader2 className="animate-spin text-blue-500" size={48} />
                 <span className="font-black text-xl text-stone-700">球球正在重组思维维度...</span>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 gap-6">
            {localQuestions.map((q, idx) => (
                <Card key={q.id || idx} className="bg-white p-8 rounded-[3rem] border-2 border-stone-100 shadow-sm relative group hover:border-blue-300 transition-all overflow-visible animate-slide-up">
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                        {/* Individual AI Refine Button */}
                        <div className="relative">
                            <button 
                                onClick={() => setActiveRefineIdx(activeRefineIdx === idx ? null : idx)}
                                className={`p-2.5 rounded-xl transition-all shadow-sm border-2 ${activeRefineIdx === idx ? 'bg-[#8B5CF6] text-white border-[#7C3AED]' : 'bg-white text-[#8B5CF6] border-stone-100 hover:border-[#DDD6FE]'}`}
                                title="AI 优化此题"
                            >
                                <Sparkles size={20}/>
                            </button>
                            
                            {activeRefineIdx === idx && (
                                <AiRefinePopover 
                                    onRefine={(inst) => handleSingleRefine(idx, inst)}
                                    onAutoRefine={() => handleAutoRefine(idx)}
                                    onClose={() => setActiveRefineIdx(null)}
                                />
                            )}
                        </div>

                        <button 
                            onClick={() => handleRemoveQuestion(idx)}
                            className="p-2.5 bg-white text-stone-300 hover:text-red-500 transition-all border-2 border-stone-50 hover:border-red-100 rounded-xl"
                        >
                            <Trash2 size={20}/>
                        </button>
                    </div>

                    <div className="flex items-start gap-6 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-lg">
                            {idx + 1}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                    q.type === 'choice' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    q.type === 'material-analysis' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                    q.type === 'boolean' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                    {getTypeName(q.type || '')}
                                </span>
                                {q.type === 'material-analysis' && <span className="text-[10px] font-bold text-stone-400">含有背景史料</span>}
                            </div>
                            <textarea 
                                value={q.question}
                                onChange={(e) => handleUpdateQuestion(idx, { question: e.target.value })}
                                className="w-full text-2xl font-black text-stone-800 bg-transparent border-b-2 border-transparent focus:border-blue-100 outline-none resize-none leading-snug"
                                rows={2}
                            />
                        </div>
                    </div>

                    {q.material && (
                        <div className="mb-6 ml-12 p-6 bg-stone-50 rounded-[2rem] border-2 border-dashed border-stone-200 relative group/material">
                             <div className="flex items-center gap-2 mb-3">
                                <FileText size={16} className="text-stone-400"/>
                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">情境材料区</span>
                             </div>
                             <textarea 
                                value={q.material}
                                onChange={(e) => handleUpdateQuestion(idx, { material: e.target.value })}
                                className="w-full text-base font-bold text-stone-600 bg-transparent outline-none italic resize-none leading-relaxed"
                                rows={4}
                             />
                        </div>
                    )}

                    <div className="ml-12">
                        {q.type === 'choice' || q.type === 'material-analysis' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options?.map((opt, oIdx) => (
                                    <div key={oIdx} className="flex items-center gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-100 focus-within:border-blue-200 transition-all hover:bg-white">
                                        <button 
                                            onClick={() => handleUpdateQuestion(idx, { correctAnswer: oIdx })}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all
                                                ${q.correctAnswer === oIdx ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-stone-300 border border-stone-200'}`}
                                        >
                                            {String.fromCharCode(65 + oIdx)}
                                        </button>
                                        <input 
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...(q.options || [])];
                                                newOpts[oIdx] = e.target.value;
                                                handleUpdateQuestion(idx, { options: newOpts });
                                            }}
                                            className="flex-1 bg-transparent border-none outline-none font-bold text-stone-600 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : q.type === 'boolean' ? (
                            <div className="flex gap-6">
                                {['正确', '错误'].map((label, bIdx) => (
                                    <button 
                                        key={label}
                                        onClick={() => handleUpdateQuestion(idx, { correctAnswer: bIdx })}
                                        className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 flex items-center justify-center gap-3 ${
                                            q.correctAnswer === bIdx ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-stone-100 text-stone-400'
                                        }`}
                                    >
                                        {bIdx === 0 ? <CheckCircle size={20}/> : <XCircle size={20}/>}
                                        {label}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 bg-blue-50/20 rounded-[2.5rem] border-2 border-dashed border-blue-100 flex flex-col items-center text-center gap-3">
                                <AlertCircle size={32} className="text-blue-300"/>
                                <p className="text-sm font-bold text-blue-400">此题为开放式思维题。球球将在课程完成后根据学生发言的逻辑深度进行AI判分。</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 ml-12 p-6 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-100 flex gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                           <HelpCircle size={24}/>
                        </div>
                        <div className="flex-1">
                           <div className="text-[10px] font-black text-emerald-500 uppercase mb-2 tracking-widest flex items-center gap-2">
                              <span>官方参考解析 (Solution Analysis)</span>
                           </div>
                           <textarea 
                              value={q.explanation}
                              onChange={(e) => handleUpdateQuestion(idx, { explanation: e.target.value })}
                              className="w-full bg-transparent border-none outline-none font-bold text-stone-600 text-sm leading-relaxed resize-none"
                              rows={3}
                           />
                        </div>
                    </div>
                </Card>
            ))}
            
            <div className="w-full bg-stone-50/50 border-4 border-dashed border-stone-200 rounded-[3.5rem] p-10 flex flex-col items-center gap-8 group/add-section">
                <div className="flex flex-col items-center gap-2 opacity-40 group-hover/add-section:opacity-100 transition-opacity">
                    <Plus size={32} className="text-stone-400 group-hover/add-section:rotate-90 transition-transform duration-500"/>
                    <span className="font-black uppercase tracking-[0.3em] text-xs text-stone-500">手动新增不同维度的习题</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    <button 
                        onClick={() => addNewQuestion('choice')}
                        className="bg-white p-8 rounded-[2.5rem] border-2 border-stone-100 shadow-sm hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-4 group/btn"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-colors">
                            <ListTodo size={32}/>
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-stone-800">单项选择题</h4>
                            <p className="text-xs font-bold text-stone-400 mt-1">考察核心知识点的识记与理解</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => addNewQuestion('short')}
                        className="bg-white p-8 rounded-[2.5rem] border-2 border-stone-100 shadow-sm hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-4 group/btn"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover/btn:bg-amber-500 group-hover/btn:text-white transition-colors">
                            <MessageSquareQuote size={32}/>
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-stone-800">思维简答题</h4>
                            <p className="text-xs font-bold text-stone-400 mt-1">通过开放式提问启发高阶思维</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StepQuizGeneration;