
import React from 'react';
import { Search, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';
import { Clue, ThemeConfig } from '../../types';

interface EvidenceRackProps {
  clues: Clue[];
  theme: ThemeConfig;
  onOpenPersonalTasks: () => void;
  onOpenClue: (clue: Clue) => void;
  incompletePersonalCount: number;
}

const EvidenceRack: React.FC<EvidenceRackProps> = ({ clues, theme, onOpenPersonalTasks, onOpenClue, incompletePersonalCount }) => {
  const t = theme;
  const newCluesCount = clues.filter(c => c.isFound && c.isNew).length;

  return (
    <div className="flex gap-4 h-24 shrink-0">
        <button 
            onClick={onOpenPersonalTasks}
            className={`${t.panelBg} ${t.panelBorder} border ${t.borderRadius} w-40 flex flex-col items-center justify-center gap-1 hover:bg-purple-50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative group overflow-hidden active:scale-95`}
        >
            <div className="absolute top-0 right-0 w-8 h-8 bg-purple-500/10 rounded-bl-full group-hover:bg-purple-500/20 transition-colors"></div>
            {incompletePersonalCount > 0 && (
                <div className="absolute top-3 right-3 flex items-center justify-center">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </div>
            )}
            <ShieldAlert size={28} className="text-purple-600 group-hover:rotate-12 transition-transform"/>
            <span className="text-xs font-black text-purple-800 uppercase tracking-tighter">绝密密函</span>
        </button>

        <div className={`${t.panelBg} ${t.panelBorder} border ${t.borderRadius} flex-1 px-8 flex items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-x-auto custom-scrollbar`}>
            <div className="flex flex-col items-center gap-1 opacity-30 shrink-0 relative">
                <Search size={20}/>
                <span className="text-[10px] font-black uppercase tracking-widest">已获证物</span>
                {newCluesCount > 0 && (
                   <div className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white text-[8px] font-black text-white items-center justify-center">
                         {newCluesCount}
                      </span>
                   </div>
                )}
            </div>
            
            <div className="h-px w-8 bg-stone-200 shrink-0"></div>

            {clues.map(clue => (
                 <div 
                    key={clue.id} 
                    onClick={() => clue.isFound && onOpenClue(clue)}
                    className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all cursor-pointer relative group overflow-hidden
                        ${clue.isFound 
                            ? 'bg-white border-amber-300 shadow-lg hover:-translate-y-1 hover:border-amber-500' 
                            : 'bg-black/5 border-dashed border-stone-200 grayscale opacity-40'
                        }
                    `}
                 >
                    {clue.isFound ? (
                        <>
                            <ImageWithFallback src={clue.image} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors"></div>
                            {clue.isNew && (
                               <div className="absolute top-1 right-1 bg-amber-500 text-white text-[8px] font-black px-1 py-0.5 rounded shadow-sm z-10 animate-pulse border border-white">
                                  NEW
                               </div>
                            )}
                        </>
                    ) : (
                        <Lock size={18} className="text-stone-300"/>
                    )}
                 </div>
             ))}
        </div>
    </div>
  );
};

export default EvidenceRack;
