import React, { useState, useEffect, useRef } from 'react';
import { Target, CheckCircle, Sparkles, HelpCircle, MessageSquareQuote, MousePointer2, Move, ArrowRight } from 'lucide-react';
import Button from '../Button';
import ImageWithFallback from '../ImageWithFallback';
import { Task, ThemeConfig } from '../../types';

interface TaskBoardProps {
  activeMainTask: Task | undefined;
  theme: ThemeConfig;
  puzzleAnswer: string;
  setPuzzleAnswer: (val: string) => void;
  onTaskSubmit: (taskId: string, answer?: string) => void;
  onStartQuiz: () => void;
}

const MatchingGame: React.FC<{
  task: Task;
  setPuzzleAnswer: (val: string) => void;
  theme: ThemeConfig;
}> = ({ task, setPuzzleAnswer, theme }) => {
  const [links, setLinks] = useState<Record<number, number>>({});
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const data = task.matchingData || { items: [], categories: [] };

  const handleItemClick = (idx: number) => {
    setSelectedItemIdx(idx);
  };

  const handleCategoryClick = (catIdx: number) => {
    if (selectedItemIdx === null) return;
    const newLinks = { ...links, [selectedItemIdx]: catIdx };
    setLinks(newLinks);
    setSelectedItemIdx(null);

    const group1 = Object.entries(newLinks)
      .filter(([_, cat]) => cat === 0)
      .map(([itemIdx]) => itemIdx).sort().join('');
    const group2 = Object.entries(newLinks)
      .filter(([_, cat]) => cat === 1)
      .map(([itemIdx]) => itemIdx).sort().join('');
    
    setPuzzleAnswer(`1-${group1}|2-${group2}`);
  };

  return (
    <div className="flex-1 flex flex-col relative h-full min-h-0" ref={containerRef}>
      {/* Items Grid - Compact "Wood Block" Style */}
      <div className="grid grid-cols-4 gap-x-8 gap-y-3 mb-6 relative z-20">
        {data.items.map((item, idx) => (
          <button
            key={idx}
            id={`item-${idx}`}
            onClick={() => handleItemClick(idx)}
            className={`
              relative h-12 flex items-center justify-center rounded-lg border-b-4 font-black text-xs transition-all transform active:translate-y-1 active:border-b-0
              ${selectedItemIdx === idx 
                ? 'bg-amber-500 border-amber-700 text-white shadow-[0_4px_15px_rgba(245,158,11,0.4)] scale-105 z-30' 
                : links[idx] !== undefined
                  ? 'bg-stone-200 border-stone-300 text-stone-400 opacity-60'
                  : 'bg-[#EADBC8] border-[#B89F81] text-[#5D4037] hover:bg-[#DBC1A5] hover:border-[#967E64] shadow-sm'}
            `}
          >
            {item}
            {links[idx] !== undefined && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
          </button>
        ))}
      </div>

      {/* Connection SVG Layer */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <svg className="w-full h-full">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {Object.entries(links).map(([itemIdx, catIdx]) => {
            const itemEl = document.getElementById(`item-${itemIdx}`);
            const catEl = document.getElementById(`cat-${catIdx}`);
            if (!itemEl || !catEl || !containerRef.current) return null;
            const rect = containerRef.current.getBoundingClientRect();
            const itemRect = itemEl.getBoundingClientRect();
            const catRect = catEl.getBoundingClientRect();
            
            // Bezier Path for more "fluid" connection
            const startX = itemRect.left + itemRect.width / 2 - rect.left;
            const startY = itemRect.top + itemRect.height - rect.top;
            const endX = catRect.left + catRect.width / 2 - rect.left;
            const endY = catRect.top - rect.top;
            const cpY = (startY + endY) / 2;

            return (
              <path
                key={`${itemIdx}-${catIdx}`}
                d={`M ${startX} ${startY} C ${startX} ${cpY}, ${endX} ${cpY}, ${endX} ${endY}`}
                stroke="url(#lineGrad)"
                strokeWidth="3"
                fill="none"
                filter="url(#glow)"
                className="opacity-60 animate-pulse"
              />
            );
          })}
        </svg>
      </div>

      {/* Categories - Compact "Artifact" Containers */}
      <div className="grid grid-cols-2 gap-10 mt-auto mb-2 relative z-20">
        {data.categories.map((cat, idx) => (
          <button
            key={idx}
            id={`cat-${idx}`}
            onClick={() => handleCategoryClick(idx)}
            className={`
              relative py-0.5 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 group
              ${selectedItemIdx !== null 
                ? 'bg-amber-50/80 border-amber-400 ring-4 ring-amber-100 animate-pulse' 
                : 'bg-white/90 border-stone-200 shadow-sm hover:border-amber-200'}
            `}
          >
             <Move size={14} className={`text-amber-400 mb-0.5 ${selectedItemIdx !== null ? 'animate-bounce' : 'opacity-20'}`} />
             <span className="text-lg font-black text-stone-800">{cat}</span>
             
             {/* Counting dots inside category */}
             <div className="flex gap-1 mt-1">
                {Object.values(links).filter(v => v === idx).map((_, i) => (
                   <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm"></div>
                ))}
             </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const TaskBoard: React.FC<TaskBoardProps> = ({ activeMainTask, theme, puzzleAnswer, setPuzzleAnswer, onTaskSubmit, onStartQuiz }) => {
  const t = theme;
  const [multiAnswers, setMultiAnswers] = useState<string[]>(['', '', '']);
  const isMultiPart = (activeMainTask?.id === 't1' || activeMainTask?.id === 't4') && activeMainTask?.type === 'puzzle';

  useEffect(() => {
    if (isMultiPart) setPuzzleAnswer(multiAnswers.join('|'));
  }, [multiAnswers, isMultiPart]);

  useEffect(() => {
    setMultiAnswers(['', '', '']);
    setPuzzleAnswer('');
  }, [activeMainTask?.id]);

  const handleMultiChange = (idx: number, val: string) => {
    const newAns = [...multiAnswers];
    newAns[idx] = val;
    setMultiAnswers(newAns);
  };

  return (
    <div className={`flex-1 ${t.panelBg} ${t.panelBorder} border ${t.borderRadius} shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col md:flex-row min-h-0 group/board`}>
        {/* Artifact Decorative Edge */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-500/50 via-amber-500 to-amber-500/50 opacity-40"></div>

        {activeMainTask ? (
            <>
                {/* Left Visual Presentation - 40% Width for better balance */}
                <div className="md:w-[40%] h-48 md:h-auto relative shrink-0 overflow-hidden border-r border-stone-100">
                    <ImageWithFallback src={activeMainTask.image} className="w-full h-full object-cover transition-transform duration-[5s] group-hover/board:scale-105"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40"></div>
                    
                    <div className="absolute top-6 left-6 animate-slide-up">
                        <div className="flex items-center gap-2 mb-1">
                           <div className="w-1 h-3 bg-amber-500"></div>
                           <span className="text-white/50 text-[10px] font-black tracking-[0.3em] uppercase">Current Objective</span>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight drop-shadow-lg tracking-tighter">
                           {activeMainTask.title}
                        </h2>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-white/80 text-xs font-bold leading-relaxed shadow-2xl">
                        <MessageSquareQuote size={14} className="text-amber-400 mb-1" />
                        {activeMainTask.mission}
                    </div>
                </div>

                {/* Right Interaction Zone */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#FBF9F4] relative">
                    {/* Subtle Paper Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>

                    <div className="flex-1 p-6 md:p-8 flex flex-col overflow-hidden">
                        <div className="mb-6 relative">
                            <p className="text-lg md:text-xl font-black text-stone-700 leading-snug text-justify">
                                {activeMainTask.description}
                            </p>
                            <div className="mt-4 h-0.5 w-12 bg-amber-400/30"></div>
                        </div>

                        {/* Question Input Area - Optimized for Height */}
                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                            {activeMainTask.type === 'choice' && (
                                <div className="grid grid-cols-1 gap-2 pb-4">
                                    {activeMainTask.options?.map((opt, i) => (
                                        <button 
                                          key={i}
                                          onClick={() => onTaskSubmit(activeMainTask.id, i.toString())}
                                          className="group relative w-full p-4 bg-white border border-stone-200 rounded-xl hover:border-amber-400 hover:shadow-lg transition-all text-left flex items-center gap-4 active:scale-[0.98]"
                                        >
                                            <div className="w-10 h-10 shrink-0 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center font-black text-stone-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                                {['甲','乙','丙','丁'][i] || i + 1}
                                            </div>
                                            <span className="flex-1 font-bold text-stone-600 group-hover:text-stone-900 leading-tight">
                                                {opt}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {activeMainTask.type === 'matching' && (
                                <MatchingGame task={activeMainTask} setPuzzleAnswer={setPuzzleAnswer} theme={t} />
                            )}

                            {activeMainTask.type === 'puzzle' && (
                                <div className="space-y-3 pb-4">
                                    {isMultiPart ? (
                                        <div className="space-y-2">
                                            {(activeMainTask.id === 't1' ? [
                                                { label: '出发时间', placeholder: '例：公元前138' },
                                                { label: '联络民族', placeholder: '哪个民族？' },
                                                { label: '被谁扣留', placeholder: '哪个政权？' }
                                            ] : [
                                                { label: '路线起点', placeholder: '长安' },
                                                { label: '经新疆至', placeholder: '目的地' },
                                                { label: '咽喉要塞', placeholder: '敦煌' }
                                            ]).map((item, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded-xl border border-stone-200 flex items-center gap-4 focus-within:border-amber-400 transition-all shadow-sm">
                                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest shrink-0 w-16">{item.label}</span>
                                                    <input 
                                                        className="flex-1 bg-transparent border-none outline-none font-black text-stone-800 placeholder:text-stone-300" 
                                                        placeholder={item.placeholder}
                                                        value={multiAnswers[idx]} 
                                                        onChange={(e) => handleMultiChange(idx, e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-stone-200 focus-within:border-amber-400 transition-all">
                                            <input 
                                                type="text" 
                                                value={puzzleAnswer}
                                                onChange={(e) => setPuzzleAnswer(e.target.value)}
                                                placeholder="请在此输入你的推论..."
                                                className="w-full bg-transparent border-none outline-none font-black text-xl text-center text-stone-800"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeMainTask.type === 'discussion' && (
                                <div className="h-full flex flex-col items-center justify-center p-6 bg-amber-50/30 rounded-2xl border border-amber-100 border-dashed animate-pulse">
                                    <HelpCircle size={40} className="text-amber-500 mb-3 opacity-60"/>
                                    <h5 className="text-lg font-black text-amber-800 mb-1 tracking-tight">商议决策</h5>
                                    <p className="text-amber-900/50 font-bold text-xs text-center leading-relaxed">
                                        此环节需集思广益。请在右侧交流区<br/>讨论得出一致结论后提交。
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Footer Action */}
                        <div className="mt-4 shrink-0">
                            <Button 
                                onClick={() => onTaskSubmit(activeMainTask.id, puzzleAnswer)} 
                                variant="primary" 
                                className="w-full py-5 text-xl font-black rounded-2xl shadow-[0_15px_35px_-5px_rgba(245,158,11,0.3)] transform transition-all active:scale-[0.98]"
                            >
                                <Sparkles size={20} className="mr-2"/> 确认提交
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-white relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(252,211,77,0.1)_0%,transparent_70%)]"></div>
                <div className="relative animate-fade-in-up flex flex-col items-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-8 mx-auto animate-bounce shadow-lg">
                        <CheckCircle size={48} strokeWidth={2.5}/>
                    </div>
                    <h2 className="text-4xl font-black text-stone-800 mb-4 tracking-tighter">历险大获全胜！</h2>
                    <p className="text-stone-500 font-bold text-base max-w-sm mx-auto mb-10 leading-relaxed">
                        你的智慧赢得了守将的尊重。前方玉门关已隐约可见，历史的真相正待你亲手揭开。现在，请开始最终测试，检验你在时空历险中的斩获！
                    </p>
                    <Button variant="accent" onClick={onStartQuiz} className="px-20 py-6 text-2xl font-black shadow-2xl rounded-[2rem] hover:scale-105 active:scale-95 transition-all">
                      开始课后测试 <ArrowRight className="ml-3" size={28}/>
                    </Button>
                </div>
            </div>
        )}
    </div>
  );
};

export default TaskBoard;
