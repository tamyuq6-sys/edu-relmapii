import React, { useState } from 'react';
import { Book, Brain, Target, ChevronRight, ArrowLeft, Plus, X, Sparkles, AlertCircle } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import { CurriculumInfo } from '../../types';
import AiRefinePopover from './AiRefinePopover';
import { modifyCurriculumWithAi } from '../../services/customizationService';

interface StepCurriculumProps {
  curriculum: CurriculumInfo;
  onBack: () => void;
  onNext: (updatedCurriculum: CurriculumInfo) => void;
}

const StepCurriculum: React.FC<StepCurriculumProps> = ({ curriculum, onBack, onNext }) => {
  const [localCurriculum, setLocalCurriculum] = useState<CurriculumInfo>({ 
    ...curriculum,
    knowledgePoints: Array.isArray(curriculum?.knowledgePoints) ? curriculum.knowledgePoints : [],
    coreCompetencies: Array.isArray(curriculum?.coreCompetencies) ? curriculum.coreCompetencies : []
  });
  const [showAiPopover, setShowAiPopover] = useState(false);

  const handleAiModify = async (instruction: string) => {
    const updated = await modifyCurriculumWithAi(localCurriculum, instruction);
    if (updated) {
      setLocalCurriculum({
        ...updated,
        knowledgePoints: Array.isArray(updated.knowledgePoints) ? updated.knowledgePoints : [],
        coreCompetencies: Array.isArray(updated.coreCompetencies) ? updated.coreCompetencies : []
      });
    }
  };

  const handleUpdateItem = (key: 'knowledgePoints' | 'coreCompetencies', index: number, val: string) => {
    const newList = [...(localCurriculum[key] || [])];
    newList[index] = val;
    setLocalCurriculum({ ...localCurriculum, [key]: newList });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      <div className="flex justify-between items-end border-b-2 border-stone-50 pb-6">
         <div>
            <h2 className="text-3xl font-black text-stone-800">2. 确认教学要点</h2>
            <p className="text-stone-500 font-bold text-sm mt-1 italic">这些解析内容将作为后续“剧本方案”设计的核心依据。</p>
         </div>
         <div className="flex gap-3">
             <Button variant="secondary" onClick={onBack} className="px-6 py-2.5 rounded-xl text-sm">
                <ArrowLeft size={16} /> 返回重传
             </Button>
             
             {/* AI Refine Popover Container */}
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
                        onAutoRefine={() => handleAiModify("根据教学材料深度优化知识点提取与素养导向")}
                        onClose={() => setShowAiPopover(false)}
                    />
                )}
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="核心知识点 (完整提取)" icon={<Book size={18}/>} className="bg-white/80 p-5">
              <div className="flex flex-col gap-2">
                 {localCurriculum.knowledgePoints?.map((kp, i) => (
                   <div key={i} className="group flex items-start gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                      <span className="w-5 h-5 rounded-md bg-amber-400 text-amber-900 flex items-center justify-center font-black text-[10px] shrink-0 mt-1">{i+1}</span>
                      <textarea 
                        value={kp}
                        rows={Math.max(1, Math.ceil(kp.length / 25))}
                        onChange={(e) => handleUpdateItem('knowledgePoints', i, e.target.value)}
                        className="flex-1 bg-transparent text-amber-900 font-bold text-sm outline-none w-full resize-none py-0 overflow-hidden"
                      />
                      <button onClick={() => {
                        const newList = [...localCurriculum.knowledgePoints];
                        newList.splice(i, 1);
                        setLocalCurriculum({...localCurriculum, knowledgePoints: newList});
                      }} className="opacity-0 group-hover:opacity-100 p-1 text-amber-300 hover:text-red-500 transition-all shrink-0"><X size={14}/></button>
                   </div>
                 ))}
                 <button onClick={() => setLocalCurriculum({...localCurriculum, knowledgePoints: [...(localCurriculum.knowledgePoints || []), "新增知识项"]})} className="py-2.5 border-2 border-dashed border-stone-100 text-stone-300 rounded-xl text-xs font-black hover:border-amber-200 hover:text-amber-400 transition-all">
                    + 增加关键知识点
                 </button>
              </div>
            </Card>

            <Card title="核心素养导向" icon={<Brain size={18}/>} className="bg-white/80 p-5">
              <div className="flex flex-col gap-2">
                 {localCurriculum.coreCompetencies?.map((cc, i) => (
                   <div key={i} className="group flex items-start gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                      <span className="w-5 h-5 rounded-md bg-blue-500 text-white flex items-center justify-center font-black text-[10px] shrink-0 mt-1">{i+1}</span>
                      <textarea 
                        value={cc}
                        rows={Math.max(1, Math.ceil(cc.length / 25))}
                        onChange={(e) => handleUpdateItem('coreCompetencies', i, e.target.value)}
                        className="flex-1 bg-transparent text-blue-900 font-bold text-sm outline-none w-full resize-none py-0 overflow-hidden"
                      />
                      <button onClick={() => {
                        const newList = [...localCurriculum.coreCompetencies];
                        newList.splice(i, 1);
                        setLocalCurriculum({...localCurriculum, coreCompetencies: newList});
                      }} className="opacity-0 group-hover:opacity-100 p-1 text-blue-300 hover:text-red-500 transition-all shrink-0"><X size={14}/></button>
                   </div>
                 ))}
                 <button onClick={() => setLocalCurriculum({...localCurriculum, coreCompetencies: [...(localCurriculum.coreCompetencies || []), "新增素养项"]})} className="py-2.5 border-2 border-dashed border-stone-100 text-stone-300 rounded-xl text-xs font-black hover:border-blue-200 hover:text-blue-500 transition-all">
                    + 增加核心素养
                 </button>
              </div>
            </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
                <label className="text-xl font-bold text-stone-700 flex items-center gap-2 ml-2">
                    <Target size={20} className="text-amber-500"/> 教学重点 (基于材料深度解析)
                </label>
                <textarea 
                    value={localCurriculum.teachingFocus || ''}
                    onChange={(e) => setLocalCurriculum({...localCurriculum, teachingFocus: e.target.value})}
                    className="w-full p-6 rounded-[2.5rem] bg-white border-2 border-amber-100 font-black text-lg h-56 resize-none shadow-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all leading-relaxed"
                    placeholder="重点内容将显性化展示在剧本核心任务中..."
                />
            </div>
            <div className="space-y-3">
                <label className="text-xl font-bold text-stone-700 flex items-center gap-2 ml-2">
                    <AlertCircle size={20} className="text-red-500"/> 教学难点 (推理关键突破口)
                </label>
                <textarea 
                    value={localCurriculum.teachingDifficulty || ''}
                    onChange={(e) => setLocalCurriculum({...localCurriculum, teachingDifficulty: e.target.value})}
                    className="w-full p-6 rounded-[2.5rem] bg-white border-2 border-red-100 font-black text-lg h-56 resize-none shadow-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all leading-relaxed"
                    placeholder="难点将转化为剧本中的高阶思维挑战..."
                />
            </div>
        </div>
      </div>

      <div className="flex justify-center pt-8 border-t-2 border-stone-50">
         <Button onClick={() => onNext(localCurriculum)} className="px-24 py-6 text-2xl shadow-xl">
            确认要点并生成大纲 <ChevronRight size={28}/>
         </Button>
      </div>
    </div>
  );
};

export default StepCurriculum;