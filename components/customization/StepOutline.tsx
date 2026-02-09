
import React, { useState } from 'react';
import { ChevronRight, Sparkles, Edit3 } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import AiModifyModal from './AiModifyModal';
import { modifySchemeWithAi } from '../../services/customizationService';

interface StepOutlineProps {
  outline: { title: string, description: string, initialScenario: string };
  onUpdate: (updated: any) => void;
  onNext: () => void;
}

const StepOutline: React.FC<StepOutlineProps> = ({ outline, onUpdate, onNext }) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAiModify = async (instruction: string) => {
    const updated = await modifySchemeWithAi(outline as any, instruction);
    if (updated) onUpdate(updated);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black text-stone-800">4. 剧本构思预览</h2>
         <div className="flex gap-4">
            <button onClick={() => setIsEditing(!isEditing)} className="text-amber-600 font-bold flex items-center gap-1">
              <Edit3 size={16}/> {isEditing ? '预览' : '手动精修'}
            </button>
            <button onClick={() => setIsAiModalOpen(true)} className="text-stone-400 font-bold flex items-center gap-1">
              <Sparkles size={16}/> AI 调优
            </button>
         </div>
      </div>

      <Card className="bg-amber-50/50 border-amber-100 p-8">
         {isEditing ? (
           <input 
            value={outline.title} 
            onChange={(e) => onUpdate({...outline, title: e.target.value})}
            className="text-3xl font-black text-amber-900 mb-4 bg-white/50 border-b-2 border-amber-200 outline-none w-full" 
           />
         ) : (
           <h3 className="text-3xl font-black text-amber-900 mb-4">{outline.title}</h3>
         )}
         
         <div className="space-y-6">
            <div>
               <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2">背景故事 (冲突需服务于知识点)</p>
               {isEditing ? (
                 <textarea 
                  value={outline.description} 
                  onChange={(e) => onUpdate({...outline, description: e.target.value})}
                  className="w-full p-4 rounded-xl border-2 border-amber-100 h-32 font-bold text-stone-600 outline-none"
                 />
               ) : (
                 <p className="text-stone-600 font-bold leading-relaxed">{outline.description}</p>
               )}
            </div>
            <div>
               <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-2">初始危机 (沉浸式导入)</p>
               {isEditing ? (
                 <textarea 
                  value={outline.initialScenario} 
                  onChange={(e) => onUpdate({...outline, initialScenario: e.target.value})}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-amber-200 h-24 font-black italic text-stone-700 outline-none"
                 />
               ) : (
                 <p className="text-stone-700 font-black italic bg-white p-6 rounded-2xl border-2 border-dashed border-amber-100">
                    {outline.initialScenario}
                 </p>
               )}
            </div>
         </div>
      </Card>

      <div className="flex justify-end pt-4">
         <Button onClick={onNext} className="px-12 py-5 text-xl">确认大纲，设计角色 <ChevronRight size={24}/></Button>
      </div>

      {isAiModalOpen && (
        <AiModifyModal 
            title="AI 大纲改良"
            placeholder="例如：增加更多的侦探感，或者让历史冲突更激烈..."
            onClose={() => setIsAiModalOpen(false)} 
            onModify={handleAiModify}
        />
      )}
    </div>
  );
};

export default StepOutline;
