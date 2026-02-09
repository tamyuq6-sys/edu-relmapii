import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, ArrowLeft, BookOpen, Clock, AlertCircle, Plus, Trash2, Layout, BookText, Target } from 'lucide-react';
import Button from '../Button';
import { DesignScheme } from '../../types';
import AiRefinePopover from './AiRefinePopover';
import { modifySchemeWithAi } from '../../services/customizationService';

interface StepDesignSchemeProps {
  scheme: DesignScheme;
  onUpdate: (updated: DesignScheme) => void;
  onBack: () => void;
  onNext: (confirmedScheme: DesignScheme) => void;
}

const StepDesignScheme: React.FC<StepDesignSchemeProps> = ({ scheme, onUpdate, onBack, onNext }) => {
  const [localScheme, setLocalScheme] = useState<DesignScheme>({
    positioning: scheme?.positioning || '正在构思标题...',
    teacherInstructions: scheme?.teacherInstructions || '正在生成教师执行逻辑...',
    acts: Array.isArray(scheme?.acts) ? scheme.acts : [],
    overallLogic: scheme?.overallLogic || '',
    cognitiveRoles: scheme?.cognitiveRoles || []
  });
  
  const [showAiPopover, setShowAiPopover] = useState(false);

  useEffect(() => {
    if (scheme) {
      setLocalScheme({
        positioning: scheme.positioning || '未命名剧本',
        teacherInstructions: scheme.teacherInstructions || '正在生成中...',
        acts: Array.isArray(scheme.acts) ? scheme.acts : [],
        overallLogic: scheme.overallLogic || '',
        cognitiveRoles: scheme.cognitiveRoles || []
      });
    }
  }, [scheme]);

  const handleAiModify = async (instruction: string) => {
    const updated = await modifySchemeWithAi(localScheme, instruction);
    if (updated) {
      setLocalScheme(updated);
      onUpdate(updated);
    }
  };

  const handleUpdateAct = (idx: number, fields: any) => {
    const newActs = [...localScheme.acts];
    newActs[idx] = { ...newActs[idx], ...fields };
    const updated = { ...localScheme, acts: newActs };
    setLocalScheme(updated);
    onUpdate(updated);
  };

  const handleAddAct = () => {
    const newAct = {
      id: `act_${Date.now()}`,
      title: "新环节",
      plotLogic: "此处应有详细剧情描述...",
      knowledgePoint: "绑定具体知识点",
      assessmentContent: "针对本环节的考察指标",
      duration: 10
    };
    const updated = { ...localScheme, acts: [...localScheme.acts, newAct] };
    setLocalScheme(updated);
    onUpdate(updated);
  };

  const handleRemoveAct = (idx: number) => {
    const newActs = localScheme.acts.filter((_, i) => i !== idx);
    const updated = { ...localScheme, acts: newActs };
    setLocalScheme(updated);
    onUpdate(updated);
  };

  const totalTime = localScheme.acts.reduce((acc, act) => acc + (act?.duration || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-stone-50 pb-6 gap-6">
         <div className="flex-1 space-y-2 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">第一阶段：剧本大纲设计</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black ${totalTime <= 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    <Clock size={12}/> 总时长: {totalTime} min
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[11px] font-black text-amber-600 uppercase tracking-widest ml-1">剧本正式名称 (Final Script Title)</label>
                <input 
                  value={localScheme.positioning} 
                  onChange={(e) => {
                    const updated = {...localScheme, positioning: e.target.value};
                    setLocalScheme(updated);
                    onUpdate(updated);
                  }}
                  className="text-3xl font-black text-stone-800 bg-transparent border-b-2 border-transparent focus:border-amber-400 outline-none w-full py-1 hover:bg-stone-50/50 rounded-lg transition-all"
                  placeholder="例如：虎门硝烟、丝路奇缘..."
                />
            </div>
         </div>
         <div className="flex gap-3 shrink-0">
            <Button variant="secondary" onClick={onBack} className="px-6 py-2.5 rounded-xl text-sm border-stone-200 shadow-none">
              返回
            </Button>
            
            <div className="relative">
                <Button 
                    variant="primary" 
                    onClick={() => setShowAiPopover(!showAiPopover)} 
                    className={`px-6 py-2.5 rounded-xl text-sm transition-all ${showAiPopover ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                >
                    <Sparkles size={16} /> AI 调优
                </Button>
                {showAiPopover && (
                    <AiRefinePopover 
                        onRefine={handleAiModify}
                        onAutoRefine={() => handleAiModify("优化剧情逻辑的连贯性与互动密度")}
                        onClose={() => setShowAiPopover(false)}
                    />
                )}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-stone-50/50 p-6 rounded-[2rem] border-2 border-dashed border-stone-100">
            <div className="flex items-center gap-2 mb-2 opacity-60">
                <AlertCircle size={16} className="text-amber-500"/>
                <h4 className="text-[10px] font-black text-stone-600 uppercase tracking-widest">教师执行逻辑与整体设计理念</h4>
            </div>
            <textarea 
              value={localScheme.teacherInstructions}
              onChange={(e) => {
                const updated = {...localScheme, teacherInstructions: e.target.value};
                setLocalScheme(updated);
                onUpdate(updated);
              }}
              className="w-full text-sm font-bold text-stone-600 leading-relaxed italic bg-white p-4 rounded-xl border border-stone-100 focus:border-amber-200 outline-none h-24 resize-none shadow-sm"
              placeholder="描述剧本的背景冲突及教学引导思路..."
            />
        </div>

        <div className="space-y-6">
            {localScheme.acts.length > 0 ? (
                localScheme.acts.map((act, idx) => (
                    <div key={act?.id || idx} className="bg-white rounded-[2.5rem] p-8 border-2 border-stone-50 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <input 
                                        value={act?.title || ''}
                                        onChange={(e) => handleUpdateAct(idx, {title: e.target.value})}
                                        className="text-2xl font-black text-stone-800 bg-transparent border-b-2 border-transparent focus:border-amber-300 outline-none w-full hover:bg-stone-50 rounded px-1 transition-all"
                                        placeholder="环节标题"
                                    />
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 rounded-lg text-[10px] font-black text-stone-400 border border-stone-100 focus-within:border-amber-200 focus-within:bg-white transition-all">
                                            <Clock size={12}/> 
                                            <input 
                                              type="number"
                                              value={act?.duration || 10}
                                              onChange={(e) => handleUpdateAct(idx, {duration: parseInt(e.target.value) || 0})}
                                              className="w-8 bg-transparent border-none outline-none font-black text-center"
                                            />
                                            min
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-lg text-[10px] font-black text-amber-600 border border-amber-100 focus-within:bg-white transition-all">
                                            <BookOpen size={12}/>
                                            <input 
                                              value={act?.knowledgePoint || ''}
                                              onChange={(e) => handleUpdateAct(idx, {knowledgePoint: e.target.value})}
                                              className="bg-transparent border-none outline-none font-black min-w-[80px]"
                                              placeholder="知识点"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleRemoveAct(idx)} className="text-stone-200 hover:text-red-500 transition-colors p-2 shrink-0">
                                <Trash2 size={20}/>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 ml-1 opacity-40">
                                    <BookText size={14}/>
                                    <span className="text-[10px] font-black uppercase tracking-widest">剧情与操作逻辑</span>
                                </div>
                                <div className="bg-stone-50 p-5 rounded-[1.8rem] border border-stone-100 focus-within:border-amber-200 focus-within:bg-white transition-all h-full shadow-inner">
                                    <textarea 
                                        value={act?.plotLogic || ''}
                                        onChange={(e) => handleUpdateAct(idx, {plotLogic: e.target.value})}
                                        className="w-full text-sm font-bold text-stone-600 leading-relaxed bg-transparent border-none outline-none h-32 resize-none"
                                        placeholder="描述本环节的剧情走向与核心玩法..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 ml-1 opacity-40">
                                    <Target size={14}/>
                                    <span className="text-[10px] font-black uppercase tracking-widest">考核指标</span>
                                </div>
                                <div className="bg-amber-50/30 p-5 rounded-[1.8rem] border border-amber-100 focus-within:border-amber-300 focus-within:bg-white transition-all h-full shadow-inner">
                                    <textarea 
                                        value={act?.assessmentContent || ''}
                                        onChange={(e) => handleUpdateAct(idx, {assessmentContent: e.target.value})}
                                        className="w-full text-sm font-black text-amber-900/60 leading-relaxed bg-transparent border-none outline-none h-32 resize-none"
                                        placeholder="定义如何衡量学生在本环节的掌握度..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white/40 rounded-[3rem] border-4 border-dashed border-stone-100">
                    <Layout size={48} className="text-stone-200 mb-4 animate-pulse"/>
                    <h3 className="text-lg font-black text-stone-400">球球正在构思主线逻辑...</h3>
                </div>
            )}

            <button 
              onClick={handleAddAct}
              className="w-full py-8 border-4 border-dashed border-stone-50 rounded-[2.5rem] text-stone-300 flex flex-col items-center justify-center gap-2 hover:border-amber-200 hover:text-amber-400 transition-all group"
            >
              <Plus size={32} className="group-hover:scale-110 transition-transform"/>
              <span className="font-black uppercase tracking-widest text-[10px]">手动新增剧本环节</span>
            </button>
        </div>

        <div className="flex justify-center pt-10 border-t-2 border-stone-50">
            <Button 
                onClick={() => onNext(localScheme)} 
                disabled={localScheme.acts.length === 0}
                className="px-20 py-6 text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
                确认大纲 · 进入角色设计 <ChevronRight size={28}/>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default StepDesignScheme;