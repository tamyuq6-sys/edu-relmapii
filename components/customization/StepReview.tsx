
import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, ArrowLeft, ChevronRight, Map, Sparkles, 
  Image as ImageIcon, Video, BookOpen, Target, Wand2, 
  BrainCircuit, Loader2, PlayCircle, Puzzle, Zap,
  Dices, LayoutTemplate, MonitorPlay, Award, Settings2,
  KeyRound, Lightbulb, KeyRound as KeyIcon, HelpCircle,
  Search, ScrollText, FileSearch, X, BookMarked,
  MessageSquareQuote, Edit3, Upload, RefreshCw, Layers, ListTodo, AlertTriangle
} from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import Avatar from '../Avatar';
import { ScriptScene, Clue, Task } from '../../types';
import { refineScriptText, generateImageWithAi, modifySceneWithAi } from '../../services/customizationService';
import AiRefinePopover from './AiRefinePopover';

interface StepReviewProps {
  gameplay: any; 
  onUpdateGameplay: (updated: any) => void;
  onBack: () => void;
  onFinalize: () => void;
}

const StepReview: React.FC<StepReviewProps> = ({ gameplay, onUpdateGameplay, onBack, onFinalize }) => {
  const [scenes, setScenes] = useState<ScriptScene[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeClueIdx, setActiveClueIdx] = useState(0);
  
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [generatingClueIdx, setGeneratingClueIdx] = useState<number | null>(null);
  
  const [showAiPopover, setShowAiPopover] = useState(false);
  const [showSceneRedraw, setShowSceneRedraw] = useState(false);
  const [showClueRedraw, setShowClueRedraw] = useState(false);

  const [errorState, setErrorState] = useState<{message: string, type: 'scene' | 'clue' | null}>({message: '', type: null});

  const sceneFileRef = useRef<HTMLInputElement>(null);
  const clueFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameplay?.scenes && Array.isArray(gameplay.scenes) && gameplay.scenes.length > 0) {
      setScenes(gameplay.scenes);
    }
  }, [gameplay]);

  useEffect(() => {
    setActiveClueIdx(0);
  }, [activeIdx]);

  const activeScene = scenes[activeIdx];
  const activeClue = activeScene?.clues?.[activeClueIdx];

  // --- Auto Generation Logic ---
  useEffect(() => {
    if (activeScene && !activeScene.assetUrl && !isGeneratingScene && !errorState.type) {
      handleGenerateAsset();
    }
  }, [activeIdx, activeScene?.assetUrl]);

  useEffect(() => {
    if (activeClue && !activeClue.image && generatingClueIdx === null && !errorState.type) {
      handleGenerateClueImg(activeClueIdx);
    }
  }, [activeIdx, activeClueIdx, activeClue?.image]);

  const handleModifyScene = async (instruction: string) => {
    setIsRefining(true);
    try {
        const updatedScene = await modifySceneWithAi(activeScene, instruction);
        const newScenes = [...scenes];
        newScenes[activeIdx] = updatedScene;
        const updatedGameplay = { ...gameplay, scenes: newScenes };
        onUpdateGameplay(updatedGameplay);
    } finally {
        setIsRefining(false);
    }
  };

  const handleGenerateAsset = async (instruction?: string) => {
    if (!activeScene) return;
    setIsGeneratingScene(true);
    setErrorState({message: '', type: null});
    try {
      const prompt = instruction ? `${activeScene.assetPrompt} (要求: ${instruction})` : activeScene.assetPrompt;
      const imgData = await generateImageWithAi(prompt);
      if (imgData) {
        const newScenes = [...scenes];
        newScenes[activeIdx] = { ...newScenes[activeIdx], assetUrl: imgData };
        onUpdateGameplay({ ...gameplay, scenes: newScenes });
      }
    } catch (e: any) {
        if (e.message === 'QUOTA_EXHAUSTED') {
            setErrorState({message: 'API 生成配额已耗尽，请稍后再试或手动上传图片。', type: 'scene'});
        } else {
            setErrorState({message: '视觉生成异常，请检查网络。', type: 'scene'});
        }
    } finally {
      setIsGeneratingScene(false);
      setShowSceneRedraw(false);
    }
  };

  const handleGenerateClueImg = async (clueIdx: number, instruction?: string) => {
    const clue = activeScene.clues?.[clueIdx];
    if (!clue) return;
    setGeneratingClueIdx(clueIdx);
    setErrorState({message: '', type: null});
    try {
      const prompt = instruction ? `${clue.assetPrompt || clue.content} (要求: ${instruction})` : (clue.assetPrompt || clue.content);
      const imgData = await generateImageWithAi(prompt);
      if (imgData) {
        const newScenes = [...scenes];
        const updatedClues = [...(newScenes[activeIdx].clues || [])];
        updatedClues[clueIdx] = { ...updatedClues[clueIdx], image: imgData };
        newScenes[activeIdx] = { ...newScenes[activeIdx], clues: updatedClues };
        onUpdateGameplay({ ...gameplay, scenes: newScenes });
      }
    } catch (e: any) {
        if (e.message === 'QUOTA_EXHAUSTED') {
            setErrorState({message: '配额已耗尽，请手动上传图片。', type: 'clue'});
        }
    } finally {
      setGeneratingClueIdx(null);
      setShowClueRedraw(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'scene' | 'clue') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgData = event.target?.result as string;
      if (target === 'scene') {
        const newScenes = [...scenes];
        newScenes[activeIdx] = { ...newScenes[activeIdx], assetUrl: imgData };
        onUpdateGameplay({ ...gameplay, scenes: newScenes });
      } else {
        const newScenes = [...scenes];
        const updatedClues = [...(newScenes[activeIdx].clues || [])];
        updatedClues[activeClueIdx] = { ...updatedClues[activeClueIdx], image: imgData };
        newScenes[activeIdx] = { ...newScenes[activeIdx], clues: updatedClues };
        onUpdateGameplay({ ...gameplay, scenes: newScenes });
      }
      setErrorState({message: '', type: null});
    };
    reader.readAsDataURL(file);
  };

  const getTaskTypeBadge = (type: string) => {
    switch(type) {
        case 'discussion': return { label: '开放讨论', color: 'bg-orange-50 text-orange-600', icon: <MessageSquareQuote size={12}/> };
        case 'matching': return { label: '趣味连线', color: 'bg-purple-50 text-purple-600', icon: <Zap size={12}/> };
        case 'puzzle': return { label: '逻辑填空', color: 'bg-blue-50 text-blue-600', icon: <Edit3 size={12}/> };
        case 'choice': return { label: '知识选择', color: 'bg-emerald-50 text-emerald-600', icon: <CheckCircle2 size={12}/> };
        default: return { label: '互动任务', color: 'bg-stone-50 text-stone-500', icon: <Puzzle size={12}/> };
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in relative min-h-[800px]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 shrink-0 gap-6 border-b-2 border-stone-100/50 pb-6">
         <div className="flex items-center gap-5">
            <Button variant="secondary" onClick={onBack} className="px-4 py-2 text-xs border-stone-200 bg-white hover:bg-stone-50 shadow-none">
               <ArrowLeft size={14}/> 返回修改角色
            </Button>
            <div>
               <h2 className="text-2xl font-black text-stone-800 tracking-tight">剧本内容预览与微调</h2>
               <p className="text-stone-400 text-[11px] font-bold mt-0.5">场景图与线索图已根据剧情自动生成，鼠标悬浮即可重绘或替换</p>
            </div>
         </div>
         <Button onClick={onFinalize} disabled={scenes.length === 0} variant="accent" className="px-10 py-3.5 text-lg shadow-xl font-black">
            生成配套习题 <ChevronRight size={20}/>
         </Button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden pb-4">
        <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
            <div className="flex items-center gap-2 px-2 opacity-40">
                <Map size={14}/>
                <span className="text-[10px] font-black uppercase tracking-widest">剧本脉络节点</span>
            </div>
            <div className="space-y-3">
                {scenes.map((scene, i) => (
                    <button 
                        key={i}
                        onClick={() => {setActiveIdx(i); setErrorState({message: '', type: null});}}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all group relative
                            ${activeIdx === i ? 'bg-white border-amber-400 shadow-md translate-x-1' : 'bg-stone-50 border-transparent hover:bg-stone-100/60 hover:translate-x-1'}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${activeIdx === i ? 'bg-amber-400 text-amber-950' : 'bg-stone-200 text-stone-500'}`}>{i + 1}</span>
                            <h4 className={`font-black text-xs truncate ${activeIdx === i ? 'text-stone-800' : 'text-stone-400'}`}>{scene.title}</h4>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-[2.5rem] border-2 border-white shadow-xl overflow-hidden flex flex-col relative">
            {isRefining && (
                <div className="absolute inset-0 z-[200] bg-white/40 flex items-center justify-center">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-2 border-amber-100">
                        <Loader2 className="animate-spin text-amber-500" size={32} />
                        <span className="font-black text-lg text-stone-700">正在重塑剧情维度...</span>
                    </div>
                </div>
            )}

            {activeScene ? (
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-16">
                    <section className="space-y-5">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black text-stone-800">第 {activeIdx + 1} 幕：{activeScene.title}</h3>
                            <div className="relative">
                                <button 
                                    onClick={() => setShowAiPopover(!showAiPopover)} 
                                    className={`flex items-center gap-2 text-[11px] font-black px-4 py-2 rounded-full transition-all border-2
                                        ${showAiPopover ? 'bg-amber-100 border-amber-300 text-amber-900' : 'text-amber-600 border-amber-100 hover:bg-amber-50'}
                                    `}
                                >
                                    <Sparkles size={14}/> AI 重塑剧情
                                </button>
                                {showAiPopover && (
                                    <AiRefinePopover 
                                        onRefine={handleModifyScene}
                                        onAutoRefine={() => handleModifyScene("增强本幕情境的代入感与文学性")}
                                        onClose={() => setShowAiPopover(false)}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border-2 border-stone-50 shadow-sm leading-relaxed text-stone-700 text-base font-medium italic">
                            {activeScene.narrative}
                        </div>
                    </section>

                    <section className="space-y-5">
                        <div className="flex items-center gap-3 text-stone-400 ml-2">
                            <BrainCircuit size={18}/>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">本幕互动任务预览</h4>
                        </div>
                        
                        <div className="space-y-6">
                            {activeScene.tasks?.map((task, tIdx) => {
                                const type = getTaskTypeBadge(task.type);
                                return (
                                    <div key={tIdx} className="bg-white rounded-[2.5rem] border-2 border-stone-50 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col animate-slide-up">
                                        <div className="p-8 space-y-6 relative">
                                            <div className="flex items-center justify-between">
                                                <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest ${type.color}`}>
                                                    {type.icon}
                                                    <span>{type.label}</span>
                                                </div>
                                                <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest">QUESTION {tIdx + 1}</span>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <p className="text-2xl font-black text-stone-800 leading-snug tracking-tight">
                                                    {task.description}
                                                </p>

                                                {task.type === 'matching' && task.matchingData && (
                                                    <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 flex flex-col gap-4">
                                                        <div className="flex items-center gap-2 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                                                            <Layers size={14}/> 连线项与分类预览
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <p className="text-[9px] font-black text-purple-300 uppercase">待连线项 (Items)</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {task.matchingData.items.map((it, i) => (
                                                                        <span key={i} className="px-3 py-1.5 bg-white border border-purple-100 rounded-lg text-xs font-bold text-purple-700">{it}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <p className="text-[9px] font-black text-purple-300 uppercase">分类目标 (Categories)</p>
                                                                <div className="space-y-2">
                                                                    {task.matchingData.categories.map((cat, i) => (
                                                                        <div key={i} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-black text-center">{cat}</div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {task.type === 'choice' && task.options && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                                        {task.options.map((opt, i) => (
                                                            <div key={i} className="px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-600 flex items-center gap-4">
                                                                <span className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-xs font-black text-stone-400 shrink-0">
                                                                    {['A','B','C','D'][i]}
                                                                </span>
                                                                {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-8 py-5 bg-amber-50/40 border-y border-stone-50 flex items-start md:items-center gap-4">
                                            <div className="flex items-center gap-1.5 shrink-0 opacity-40">
                                                <KeyIcon size={14} className="text-amber-600"/>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">参考答案</span>
                                            </div>
                                            <p className="text-lg font-black text-amber-900/80">
                                                {task.correctAnswer || "开放性讨论，需引导得出一致结论"}
                                            </p>
                                        </div>

                                        <div className="p-8 bg-emerald-50/10">
                                            <div className="flex flex-col md:flex-row gap-10">
                                                <div className="md:w-1/4 shrink-0">
                                                    <div className="bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm h-full flex flex-col justify-center">
                                                        <div className="flex items-center gap-1.5 opacity-30 mb-2">
                                                            <BookMarked size={12} className="text-emerald-500"/>
                                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">核心知识</span>
                                                        </div>
                                                        <p className="font-black text-emerald-700 text-sm leading-tight">{task.knowledgePoint || "综合学科素养应用"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-2 opacity-30">
                                                        <Lightbulb size={14} className="text-emerald-600"/>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">教学解析</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-emerald-900/50 leading-relaxed text-justify">
                                                        {task.explanation || "本环节旨在引导学生结合情境中的关键信息，运用学科核心知识进行逻辑推导，不仅考察对事实的记忆，更侧重于对历史规律或科学原理的深度理解。"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-stone-400 ml-2">
                            <FileSearch size={18}/>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">本幕线索清单</h4>
                        </div>
                        
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3 bg-white/40 p-3 rounded-2xl border-2 border-white shadow-inner overflow-x-auto scrollbar-hide">
                                {activeScene.clues?.map((clue, cIdx) => (
                                    <button 
                                        key={cIdx}
                                        onClick={() => setActiveClueIdx(cIdx)}
                                        className={`shrink-0 w-16 h-16 rounded-xl border-4 transition-all overflow-hidden flex items-center justify-center relative
                                            ${activeClueIdx === cIdx 
                                                ? 'border-amber-400 shadow-md scale-105 z-10' 
                                                : 'border-white/80 hover:border-amber-200 grayscale opacity-60'}`}
                                    >
                                        {clue.image ? (
                                            <img src={clue.image} className="w-full h-full object-cover" alt={clue.title} />
                                        ) : (
                                            <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                                                {clue.type === 'history' ? <ScrollText size={20}/> : <ImageIcon size={20}/>}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {activeClue ? (
                                <div className="max-w-2xl mx-auto w-full animate-scale-up">
                                    <div className="bg-[#FAF7F0] border-2 border-[#E8DCC4] rounded-[2rem] shadow-lg overflow-hidden flex flex-col">
                                        <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-[#E8DCC4]/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#E8DCC4] text-[#8B4513] flex items-center justify-center shadow-inner">
                                                    {activeClue.type === 'history' ? <ScrollText size={20}/> : <Search size={20}/>}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-[#8B4513]/50 uppercase tracking-[0.2em]">
                                                        {activeClue.type === 'history' ? '真实史实线索' : '核心剧情情报'}
                                                    </span>
                                                    <h5 className="text-xl font-black text-[#5D4037] leading-tight">{activeClue.title}</h5>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-8 py-6">
                                            <div className="bg-stone-950 rounded-xl h-56 relative overflow-hidden group shadow-inner border-2 border-white flex items-center justify-center">
                                                <div className={`w-full h-full transition-all duration-700 ${generatingClueIdx === activeClueIdx ? 'blur-md grayscale opacity-50' : ''}`}>
                                                    {activeClue.image ? (
                                                        <img src={activeClue.image} className="w-full h-full object-cover" alt="Clue Detail"/>
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 gap-2">
                                                            {errorState.type === 'clue' ? (
                                                                <div className="flex flex-col items-center gap-3 p-4 text-center">
                                                                    <AlertTriangle className="text-amber-500" size={32}/>
                                                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{errorState.message}</p>
                                                                    <button onClick={() => handleGenerateClueImg(activeClueIdx)} className="text-white text-[10px] font-black underline">点击重试</button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <Loader2 size={32} className="animate-spin text-white/20"/>
                                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">AI 正在进行绘画创作...</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {!generatingClueIdx && activeClue.image && (
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                                        <div className="relative">
                                                            <button 
                                                                onClick={() => setShowClueRedraw(!showClueRedraw)} 
                                                                className="bg-white text-[#8B4513] px-6 py-2.5 rounded-xl font-black text-xs shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
                                                            >
                                                                <RefreshCw size={14}/> AI 重绘线索图
                                                            </button>
                                                            {showClueRedraw && (
                                                                <AiRefinePopover 
                                                                    onRefine={(inst) => handleGenerateClueImg(activeClueIdx, inst)}
                                                                    onAutoRefine={() => handleGenerateClueImg(activeClueIdx, "增强质感与艺术美感")}
                                                                    onClose={() => setShowClueRedraw(false)}
                                                                />
                                                            )}
                                                        </div>
                                                        <button 
                                                            onClick={() => clueFileRef.current?.click()}
                                                            className="bg-white/20 hover:bg-white/30 text-white border border-white/40 px-6 py-2.5 rounded-xl font-black text-xs shadow-xl flex items-center gap-2 hover:scale-105 transition-all backdrop-blur-md"
                                                        >
                                                            <Upload size={14}/> 本地替换
                                                        </button>
                                                        <input type="file" ref={clueFileRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'clue')} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-8 pb-6">
                                            <div className="bg-white/60 p-6 rounded-2xl border border-[#E8DCC4]/30 min-h-[100px] flex items-center justify-center">
                                                <p className="text-lg font-bold text-[#5D4037] leading-relaxed italic text-center whitespace-pre-wrap select-text">
                                                    “ {activeClue.content} ”
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-8 pb-8">
                                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100/50 shadow-sm relative overflow-hidden group/insight">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Avatar char="🐹" size="xs" className="shrink-0 ring-2 ring-white shadow-sm"/>
                                                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
                                                        <BookOpen size={12}/> 球球的解读 (教学洞察)
                                                    </span>
                                                </div>
                                                <p className="text-xs font-bold text-blue-900/60 leading-relaxed text-justify">
                                                    {activeClue.knowledgeDetail || "通过分析这一线索，学生能够建立起情境逻辑与学科知识的直接映射，从而强化对教学背景的认知深度。"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-48 bg-stone-50/50 rounded-[2rem] border-2 border-dashed border-stone-100 flex items-center justify-center opacity-30 text-[11px] font-black uppercase tracking-widest">
                                    请选择左侧线索节点进行预览
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="space-y-5">
                        <div className="flex items-center gap-3 text-stone-400 ml-2">
                            <LayoutTemplate size={18}/>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">本幕视觉意境图</h4>
                        </div>
                        <div className="h-[400px] bg-stone-900 rounded-[2.5rem] relative overflow-hidden group border-4 border-white shadow-xl flex items-center justify-center">
                            {isGeneratingScene ? (
                                <div className="flex flex-col items-center gap-4 animate-pulse">
                                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
                                        <Loader2 size={32} className="text-stone-600 animate-spin"/>
                                    </div>
                                    <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">AI 正在描绘宏大场景...</span>
                                </div>
                            ) : activeScene.assetUrl ? (
                                <>
                                    <img src={activeScene.assetUrl} className="w-full h-full object-cover animate-fade-in" alt="Scene"/>
                                    
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6">
                                        <div className="relative">
                                            <button 
                                                onClick={() => setShowSceneRedraw(!showSceneRedraw)}
                                                className="bg-amber-400 text-amber-950 px-10 py-4 rounded-[1.5rem] font-black shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"
                                            >
                                                <RefreshCw size={20}/> 指令重绘全景
                                            </button>
                                            {showSceneRedraw && (
                                                <AiRefinePopover 
                                                    onRefine={handleGenerateAsset}
                                                    onAutoRefine={() => handleGenerateAsset("增强环境氛围与电影级光影对比")}
                                                    onClose={() => setShowSceneRedraw(false)}
                                                />
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => sceneFileRef.current?.click()}
                                            className="bg-white/10 hover:bg-white/20 text-white border border-white/40 px-10 py-4 rounded-[1.5rem] font-black shadow-2xl flex items-center gap-3 hover:scale-105 transition-all backdrop-blur-md"
                                        >
                                            <Upload size={20}/> 上传自定义背景图
                                        </button>
                                        <input type="file" ref={sceneFileRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'scene')} />
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-8 bg-stone-950 w-full h-full flex flex-col items-center justify-center gap-4">
                                    {errorState.type === 'scene' ? (
                                        <div className="max-w-xs space-y-4 animate-scale-up">
                                            <AlertTriangle className="text-amber-500 mx-auto" size={48}/>
                                            <p className="text-white font-black text-sm uppercase tracking-widest">{errorState.message}</p>
                                            <div className="flex gap-4 justify-center">
                                                <button onClick={() => handleGenerateAsset()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-black transition-all">尝试重试</button>
                                                <button onClick={() => sceneFileRef.current?.click()} className="bg-amber-400 text-amber-950 px-4 py-2 rounded-xl text-xs font-black transition-all">手动上传</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <ImageIcon className="text-white/20 mx-auto mb-3" size={40}/>
                                            <p className="text-white/20 font-bold text-xs uppercase tracking-[0.3em]">等待视觉渲染任务排队中...</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="space-y-5 pb-10">
                        <div className="flex items-center gap-3 text-stone-400 ml-2">
                            <PlayCircle size={18}/>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">转场与氛围渲染</h4>
                        </div>
                        <div className="bg-stone-950 rounded-[2rem] p-8 border-2 border-stone-800 shadow-xl text-center">
                             <textarea 
                                value={activeScene.transition || ''}
                                onChange={(e) => {
                                    const newScenes = [...scenes];
                                    newScenes[activeIdx].transition = e.target.value;
                                    onUpdateGameplay({ ...gameplay, scenes: newScenes });
                                }}
                                placeholder="输入用于衔接下一幕的转场旁白文字..."
                                className="w-full bg-transparent border-none outline-none font-black text-lg text-amber-100/80 leading-relaxed text-center min-h-[80px] resize-none"
                            />
                            <div className="mt-2 text-[8px] font-black text-stone-600 uppercase tracking-widest">
                                转场内容将在剧本场景切换时以滚动字幕形式播放
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-20 opacity-20">
                    <Loader2 className="animate-spin mb-4" size={32}/>
                    <span className="text-xs font-black uppercase tracking-widest">正在启动创作预览模块...</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StepReview;
