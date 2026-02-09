
import React from 'react';
import { MapPin, History, Eye, UserCircle2 } from 'lucide-react';
import Avatar from '../Avatar';
import { Role, ThemeConfig } from '../../types';

interface AgentHeaderProps {
  role: Role;
  currentPlotText: string;
  theme: ThemeConfig;
  onShowRoleCard: () => void;
  onShowPlotHistory: () => void;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({ role, currentPlotText, theme, onShowRoleCard, onShowPlotHistory }) => {
  const t = theme;
  return (
    <div className="flex gap-4 h-24 shrink-0">
        {/* Agent Card */}
        <div 
            onClick={onShowRoleCard}
            className={`${t.panelBg} ${t.panelBorder} border ${t.borderRadius} px-6 py-2 flex items-center gap-4 cursor-pointer hover:bg-white/95 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] group relative overflow-hidden`}
        >
            <div className="absolute top-0 left-0 w-1 bg-amber-400 h-full"></div>
            <div className="relative">
                <Avatar char={role.avatar} size="md" className="ring-4 ring-white shadow-lg"/>
            </div>
            <div className="flex flex-col">
                <div className="flex items-center gap-1.5 opacity-50">
                    <UserCircle2 size={12}/>
                    <span className="text-[10px] font-black uppercase tracking-widest">当前扮演</span>
                </div>
                <p className={`font-black ${t.textPrimary} text-xl tracking-tight`}>{role.name}</p>
            </div>
        </div>

        {/* Plot Context */}
        <div className={`${t.panelBg} ${t.panelBorder} border ${t.borderRadius} flex-1 px-8 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.1)] flex flex-col relative overflow-hidden group`}>
             <div className="flex justify-between items-center mb-1 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">实时探险进展</span>
                </div>
                <button onClick={onShowPlotHistory} className="flex items-center gap-2 px-3 py-1 hover:bg-black/5 rounded-full transition-all text-xs font-black text-stone-400 hover:text-stone-800">
                    <History size={14}/>
                    <span>回忆录</span>
                </button>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                <p className={`${t.textPrimary} font-bold text-sm leading-relaxed text-justify opacity-80 italic`}>
                    {currentPlotText}
                </p>
             </div>
        </div>
    </div>
  );
};

export default AgentHeader;
