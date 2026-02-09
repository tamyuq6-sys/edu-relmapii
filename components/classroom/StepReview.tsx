import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, ArrowLeft, ChevronRight, Map, Sparkles, 
  Image as ImageIcon, Video, BookOpen, Target, Wand2, 
  BrainCircuit, Loader2, PlayCircle, Puzzle, Zap,
  Dices, LayoutTemplate, MonitorPlay, Award, Settings2,
  KeyRound, Lightbulb, KeyRound as KeyIcon, HelpCircle,
  Search, ScrollText, FileSearch
} from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import Avatar from '../Avatar';
import { ScriptScene, Clue } from '../../types';
import { refineScriptText, generateImageWithAi, modifySceneWithAi } from '../../services/customizationService';
import AiModifyModal from '../customization/AiModifyModal';

interface StepReviewProps {
  gameplay: any; 
  onUpdateGameplay: (updated: any) => void;
  onBack: () => void;
  onFinalize: () => void;
}

const StepReview: React.FC<StepReviewProps> = ({ gameplay, onUpdateGameplay, onBack, onFinalize }) => {
  const [scenes, setScenes] = useState<ScriptScene[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  
  const [isRefining, setIsRefining] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [showAssetTip, setShowAssetTip] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [selectedStyle, setSelectedStyle] = useState('写实厚重');
  const [selectedRes, setSelectedRes] = useState('1080P');

  useEffect(() => {
    if (gameplay?.scenes && Array.isArray(gameplay.scenes) && gameplay.scenes.length > 0) {
      setScenes(gameplay.scenes);
    }
  }, [gameplay]);

  const activeScene = scenes[activeIdx];

  const handleModifyScene = async (instruction: string) => {
    setIsRefining(true);
    const updatedScene = await modifySceneWithAi(activeScene, instruction);
    const newScenes = [...scenes];
    newScenes[activeIdx] = updatedScene;
    const updatedGameplay = { ...gameplay, scenes: newScenes };
    onUpdateGameplay(updatedGameplay);
    setIsRefining(false);
  };

  const handleGenerateAsset = async () => {
    if (!activeScene || !activeScene.assetPrompt) return;
    setIsGeneratingImg(true);
    const fullPrompt = `Style: ${selectedStyle}, Resolution: ${selectedRes}. ${activeScene.assetPrompt}`;
    const imgData = await generateImageWithAi(fullPrompt);
    if (imgData) {
      const newScenes = [...scenes];
      newScenes[activeIdx] = { ...newScenes[activeIdx], assetUrl: imgData };
      onUpdateGameplay({ ...gameplay, scenes: newScenes });
      setShowAssetTip(true);
      setTimeout(() => setShowAssetTip(false), 4000);
    }
    setIsGeneratingImg(false);
  };

  const handleGenerateClueImg = async (clueIdx: number) => {
    if (!activeScene.clues || !activeScene.clues[clueIdx].assetPrompt) return;
    setIsGeneratingImg(true);
    const imgData = await generateImageWithAi(activeScene.clues[clueIdx].assetPrompt!);
    if (imgData) {
      const newScenes = [...scenes];
      newScenes[activeIdx].clues![clueIdx].image = imgData;
      onUpdateGameplay({ ...gameplay, scenes: newScenes });
    }
    setIsGeneratingImg(false);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in relative min-h-[800px]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 shrink-0 gap-6 border-b-2 border-stone-100/50 pb-8">
         <div className="flex items-center gap-6">
            <Button variant="secondary" onClick={onBack} className="px-5 py-3 text-sm border-stone-200 bg-white hover:bg-stone-50">
               <ArrowLeft size={16}/> 返回修改角色
            </Button>
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">剧本构想已达成</span>
                  <div className="h-px w-8 bg-stone-200"></div>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">正在进行内容预览</span>
               </div>
               <h2 className="text-3xl font-black text-stone-800 tracking-tight">剧本创作预览与精修</h2>
            </div>
         </div>
         <Button 
            onClick={onFinalize} 
            disabled={scenes.length === 0}
            variant="accent" 
            className="px-12 py-4 text-xl shadow-2xl shadow-amber-200/50 font-black"
         >
            生成配套习题 <ChevronRight size={24} className="ml-1"/>
         </Button>
      </div>

      <div className="flex-1 flex gap-8 min-h-0 overflow-hidden">
        <div className="w-[300px] shrink-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar p-6">
            <div className="flex items-center gap-2 mb-2 px-2">
                <Map size={16} className="text-stone-400"/>
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">剧本脉络节点</span>
            </div>
            <div className="space-y-4 relative pb-10">
                {scenes.length > 0 ? (
                    <>
                        <div className="absolute left-[1.375rem] top-6 bottom-6 w-0.5 bg-stone-100 z-0"></div>
                        {scenes.map((scene, i) => (
                            <button 
                                key={scene.id || i}
                                onClick={() => setActiveIdx(i)}
                                className={`w-full text-left relative z-10 p-4 rounded-[2rem] border-2 transition-all flex flex-col gap-3 group
                                    ${activeIdx === i 
                                        ? 'bg-white border-amber-400 shadow-xl scale-[1.03]' 
                                        : 'bg-white/40 border-stone-100 hover:border-amber-200 hover:bg-white'}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0
                                        ${activeIdx === i ? 'bg-amber-400 text-amber-950' : 
                                          scene.isCompleted ? 'bg-emerald-50 text-white' : 'bg-stone-100 text-stone-400'}`}>
                                        {scene.isCompleted ? <Award size={14}/> : i + 1}
                                    </div>
                                    <h4 className={`font-black text-xs truncate flex-1 ${activeIdx === i ? 'text-stone-800' : 'text-stone-400'}`}>
                                        {scene.title}
                                    </h4>
                                </div>
                                <div className={`text-[10px] font-bold leading-relaxed pl-9 border-l-2 ml-3.5 ${activeIdx === i ? 'text-stone-500 border-amber-200' : 'text-stone-300 border-transparent'}`}>
                                    {scene.summary}
                                </div>
                            </button>
                        ))}
                    </>
                ) : (
                    <div className="text-center py-10 opacity-30 font-black text-xs">暂无流程数据</div>
                )}
            </div>
        </div>

        <div className="flex-1 bg-white/40 backdrop-blur-md rounded-[4rem] border-2 border-white shadow-2xl overflow-hidden flex flex-col relative">
            {showAssetTip && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[300] bg-amber-400 text-amber-950 px-8 py-3 rounded-full font-black shadow-2xl animate-bounce flex items-center gap-2">
                    <Sparkles size={18}/> 视觉元素已点亮！该场景包含关键教学线索。
                </div>
            )}

            {(isRefining || isGeneratingImg) && (
                <div className="absolute inset-0 z-[200] bg-white/60 backdrop-blur-md flex items-center justify-center animate-fade-in">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-2 border-amber-100">
                        <Avatar char="🐹" size="md" isSpeaking />
                        <div className="flex items-center gap-3">
                           <Loader2 className="animate-spin text-amber-500" size={24}/>
                           <span className="font-black text-xl text-stone-700">{isGeneratingImg ? '正在进行视觉渲染创作...' : '球球正在同步设计...'}</span>
                        </div>
                    </div>
                </div>
            )}
            
            {activeScene ? (
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-20">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <div className="w-3 h-10 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
                                <h3 className="text-3xl font-black text-stone-800 tracking-tight">第 {activeIdx + 1} 幕：{activeScene.title}</h3>
                            </div>
                            <Button 
                              onClick={() => setIsAiModalOpen(true)}
                              variant="secondary" 
                              className="px-4 py-2 text-xs bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100 transition-all"
                            >
                               <Sparkles size={14} /> AI 调优本幕内容
                            </Button>
                        </div>
                        <div className="relative group">
                            <div className="text-lg font-bold text-stone-700 leading-loose text-justify bg-white/95 p-10 md:px-14 md:py-12 rounded-[2.5rem] border-2 border-stone-100 shadow-sm whitespace-pre-wrap select-text selection:bg-amber-200 transition-all group-hover:shadow-md">
                                {activeScene.narrative}
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center justify-between ml-4">
                            <div className="flex items-center gap-3 text-stone-400">
                                <LayoutTemplate size={20}/>
                                <h4 className="text-sm font-black uppercase tracking-[0.3em]">场景视觉素材方案 (Visual Assets)</h4>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8 h-[480px] bg-stone-900 rounded-[3.5rem] relative overflow-hidden group/viz shadow-2xl border-4 border-white flex items-center justify-center">
                                {activeScene.assetUrl ? (
                                    <img src={activeScene.assetUrl} className="w-full h-full object-cover animate-fade-in" alt="Generated Scene"/>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-center p-12">
                                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-2 animate-pulse">
                                           {activeScene.assetType === 'video' ? <MonitorPlay className="text-stone-700" size={40}/> : <ImageIcon className="text-stone-700" size={40}/>}
                                        </div>
                                        <p className="text-stone-600 font-bold text-sm max-w-sm leading-relaxed italic">
                                           "{activeScene.assetDescription || "等待视觉提示词渲染..."}"
                                        </p>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/viz:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button onClick={handleGenerateAsset} className="bg-amber-400 text-amber-950 px-10 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-2 hover:bg-amber-500 transition-all active:scale-95 group">
                                        <Wand2 size={24} className="group-hover:rotate-12 transition-transform"/>
                                        渲染本幕场景图
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-stone-50 p-8 rounded-[3rem] border border-stone-100 h-full flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div>
                                            <h6 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Dices size={14}/> 生成参数配置
                                            </h6>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <span className="text-[10px] font-black text-stone-300">艺术风格</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {activeScene.generationOptions?.styles?.map(s => (
                                                            <button 
                                                                key={s} 
                                                                onClick={() => setSelectedStyle(s)}
                                                                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all border ${selectedStyle === s ? 'bg-amber-400 border-amber-500 text-amber-950' : 'bg-white border-stone-200 text-stone-400'}`}
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <span className="text-[10px] font-black text-stone-300">规格</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {activeScene.generationOptions?.resolutions?.map(r => (
                                                            <button 
                                                                key={r}
                                                                onClick={() => setSelectedRes(r)}
                                                                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all border ${selectedRes === r ? 'bg-blue-500 border-blue-600 text-white' : 'bg-white border-stone-200 text-stone-400'}`}
                                                            >
                                                                {r}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h6 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">AI 提示词详情</h6>
                                            <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-inner max-h-40 overflow-y-auto custom-scrollbar">
                                                <p className="text-[10px] font-mono text-stone-500 italic leading-relaxed break-words">
                                                    {activeScene.assetPrompt}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-stone-400 font-bold italic text-center mt-4">
                                        基于创作大纲美学同步。吱！
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8 pb-10">
                        <div className="flex items-center gap-3 text-stone-400 ml-4">
                            <BrainCircuit size={20}/>
                            <h4 className="text-sm font-black uppercase tracking-[0.3em]">本幕任务方案 (Interaction)</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-8">
                            {activeScene.tasks?.map((task, tIdx) => (
                                <Card key={task.id || tIdx} className={`bg-white p-12 rounded-[4rem] border-2 shadow-xl relative overflow-hidden group/task transition-all border-stone-100 hover:border-blue-200`}>
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/30 rounded-bl-full -mr-16 -mt-16 opacity-40 z-0"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200 group-hover/task:rotate-6 transition-transform">
                                                    <Puzzle size={32}/>
                                                </div>
                                                <div>
                                                    <h5 className="text-2xl font-black text-stone-800">{task.title}</h5>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="bg-blue-50 text-blue-500 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">{task.type}</span>
                                                        <div className="w-1 h-1 rounded-full bg-stone-200"></div>
                                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                                                            <Zap size={10} className="fill-amber-500"/> {task.funPoint}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 px-1">
                                                    <HelpCircle size={16} className="text-blue-500"/>
                                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">探险任务详情</span>
                                                </div>
                                                <div className="bg-stone-50/50 p-8 rounded-[3rem] border-2 border-stone-100 min-h-[200px] flex items-center justify-center">
                                                    <p className="text-xl font-bold text-stone-600 leading-relaxed italic text-center whitespace-pre-wrap select-text selection:bg-amber-200">
                                                        "{task.description}"
                                                    </p>
                                                </div>
                                                {task.options && task.options.length > 0 && (
                                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                                        {task.options.map((opt, i) => (
                                                            <div key={i} className="px-5 py-3 bg-white border border-stone-100 rounded-xl text-xs font-bold text-stone-500 flex items-center gap-3">
                                                                <span className="w-6 h-6 rounded bg-stone-100 flex items-center justify-center text-[10px] font-black">{['A','B','C','D'][i]}</span>
                                                                {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 px-1">
                                                    <KeyIcon size={16} className="text-amber-500"/>
                                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">预设正确答案</span>
                                                </div>
                                                <div className="bg-amber-50/50 p-8 rounded-[3rem] border-2 border-amber-200 min-h-[100px] flex items-center justify-center">
                                                    <p className="text-xl font-black text-amber-900 leading-relaxed text-center select-text">
                                                        {task.correctAnswer || "讨论产出型任务"}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 px-1 mt-4">
                                                    <Lightbulb size={16} className="text-emerald-500"/>
                                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">关联知识与逻辑解析</span>
                                                </div>
                                                <div className="bg-emerald-50/30 p-8 rounded-[3rem] border-2 border-emerald-100">
                                                    <div className="bg-white/50 px-3 py-1 rounded-lg text-[10px] font-black mb-4 inline-block border border-emerald-100 text-emerald-700">知识点：{task.knowledgePoint}</div>
                                                    <p className="text-stone-600 font-bold text-sm leading-relaxed text-justify whitespace-pre-wrap select-text">
                                                        {task.explanation || "引导学生建立逻辑联系，深入理解教材核心内涵。通过对情境的推理，将零散知识点转化为系统性的历史理解。"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-8 pb-20 relative min-h-[400px]">
                        <div className={`transition-all duration-500 ${isGeneratingImg ? 'blur-md pointer-events-none' : ''}`}>
                            <div className="flex items-center gap-3 text-stone-400 ml-4">
                                <FileSearch size={20}/>
                                <h4 className="text-sm font-black uppercase tracking-[0.3em]">本幕线索获取 (Clues Discovery)</h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {activeScene.clues?.map((clue, cIdx) => (
                                    <div key={clue.id || cIdx} className="bg-[#FAF7F0] border-2 border-[#E8DCC4] rounded-[3rem] p-1 shadow-sm group/clue hover:shadow-xl transition-all relative overflow-hidden flex flex-col h-full">
                                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>
                                        
                                        <div className="p-8 flex-1 flex flex-col relative z-10">
                                            <div className="flex items-start gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-[#E8DCC4] text-[#8B4513] flex items-center justify-center shadow-inner group-hover/clue:rotate-3 transition-transform shrink-0">
                                                    {clue.type === 'history' ? <ScrollText size={24}/> : <Map size={24}/>}
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="text-xl font-black text-[#5D4037] leading-tight mb-1 whitespace-pre-wrap">
                                                    {clue.title}
                                                    </h5>
                                                    <span className="text-[10px] font-black text-[#8B4513]/40 uppercase tracking-[0.2em]">{clue.type === 'history' ? '史实碎片 · 真实史料' : '剧情核心 · 关键情报'}</span>
                                                </div>
                                            </div>

                                            <div className="bg-white/40 p-6 rounded-[2rem] border-2 border-[#E8DCC4]/30 mb-6 flex-1 flex items-center justify-center min-h-[140px]">
                                                <p className="text-base font-bold text-[#5D4037] leading-relaxed italic text-center whitespace-pre-wrap select-text">
                                                    “{clue.content}”
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3 px-2">
                                                    <Avatar char="🐹" size="xs" className="mt-1 grayscale opacity-50 shrink-0"/>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-[#8B4513]/60 leading-relaxed select-text">
                                                            <span className="font-black text-[#8B4513]">球球笔记：</span>{clue.knowledgeDetail || "这条线索隐藏着通往下一关的钥匙，请务必留意其中的细节描述。"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-48 bg-[#E8DCC4]/20 border-t-2 border-[#E8DCC4]/30 relative overflow-hidden group/clueviz">
                                            {clue.image ? (
                                                <img src={clue.image} className="w-full h-full object-cover transition-transform duration-[10s] group-hover/clueviz:scale-110" alt="Clue Detail"/>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-[#8B4513]/30 gap-2">
                                                    <ImageIcon size={32} className="opacity-40 animate-pulse"/>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">线索视觉待渲染</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-[#8B4513]/40 opacity-0 group-hover/clueviz:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    onClick={() => handleGenerateClueImg(cIdx)}
                                                    className="bg-white text-[#8B4513] px-6 py-2.5 rounded-xl font-black text-xs shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    <Wand2 size={14}/> 渲染线索插图
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isGeneratingImg && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in bg-white/20 rounded-[4rem] backdrop-blur-sm">
                                <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-2 border-amber-100 scale-90 md:scale-100 transition-transform">
                                    <Avatar char="🐹" size="md" isSpeaking />
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="animate-spin text-amber-500" size={24}/>
                                        <span className="font-black text-xl text-stone-700">正在进行视觉渲染创作...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-pulse">
                    <Loader2 className="animate-spin text-stone-300 mb-6" size={48}/>
                    <h3 className="text-3xl font-black text-stone-300">正在装载剧本世界...</h3>
                </div>
            )}
        </div>
      </div>

      {isAiModalOpen && (
        <AiModifyModal 
            title="AI 本幕重塑"
            placeholder="例如：增加更多悬念，或者针对知识点设计更巧妙的对话..."
            onClose={() => setIsAiModalOpen(false)} 
            onModify={handleModifyScene}
        />
      )}
    </div>
  );
};

export default StepReview;