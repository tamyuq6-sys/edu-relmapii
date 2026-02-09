
import React from 'react';
import { Target, X, ScrollText, ShieldCheck, Map, BookOpen, Fingerprint } from 'lucide-react';
import Card from '../Card';
import Button from '../Button';
import { Role, ThemeConfig } from '../../types';
import ImageWithFallback from '../ImageWithFallback';

interface RoleCardModalProps {
  role: Role;
  theme: ThemeConfig;
  onClose?: () => void;
  onAccept?: () => void;
  isInitial?: boolean;
}

const RoleCardModal: React.FC<RoleCardModalProps> = ({ role, theme, onClose, onAccept, isInitial }) => {
  const t = theme;

  // Dossier style classes based on theme
  const getDossierClass = () => {
    if (t.id === 'qin') return 'bg-stone-900 text-stone-100 border-red-900';
    if (t.id === 'qing') return 'bg-[#f4f1ea] text-emerald-950 border-stone-400';
    if (t.id === 'soviet') return 'bg-zinc-800 text-zinc-100 border-red-600';
    return 'bg-[#F9F4E8] text-stone-800 border-[#D4C3A3]'; // Silk Road / Default
  };

  return (
    <div className={`max-w-6xl w-full mx-auto relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] ${t.borderRadius} border-[12px] ${t.panelBorder} ${getDossierClass()} flex flex-col md:flex-row min-h-[85vh] max-h-[95vh] animate-scale-up`}>
      
      {/* Background Textures */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

      {/* Left Sidebar: Hero Portrait (Large) */}
      <div className="w-full md:w-5/12 shrink-0 relative flex flex-col items-center justify-end overflow-hidden bg-[#1a1a1a]">
        {role.portraitLarge ? (
          <ImageWithFallback 
            src={role.portraitLarge} 
            alt={role.name} 
            className="absolute inset-0 w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-1000" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">
            {role.avatar}
          </div>
        )}
        
        {/* Bottom Gradient for Name Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        <div className="relative z-10 w-full p-8 text-center pb-12">
           <div className="inline-flex items-center gap-2 mb-2">
              <div className="h-px w-8 bg-amber-400/50"></div>
              <span className="text-amber-400 font-black text-xs uppercase tracking-[0.3em]">汉家边臣 · 命定之人</span>
              <div className="h-px w-8 bg-amber-400/50"></div>
           </div>
           <h2 className="text-6xl font-black text-white mb-2 drop-shadow-2xl tracking-tighter">
             {role.name}
           </h2>
           <div className="flex justify-center gap-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-white/60 text-xs font-bold border border-white/10">西汉 · 丝绸之路</span>
              <span className="px-3 py-1 bg-amber-400 text-amber-950 rounded-lg text-xs font-black">角色编号: {role.id.toUpperCase()}</span>
           </div>
        </div>

        {/* Floating Seal in bottom left corner */}
        <div className="absolute bottom-6 left-6 z-20 opacity-40">
           <div className="w-16 h-16 border-4 border-red-700/60 rounded flex items-center justify-center text-red-700/80 font-black text-xs rotate-[-15deg] transform">
              <span className="text-center">大汉<br/>兵部</span>
           </div>
        </div>
      </div>

      {/* Right Content: Detailed Dossier (Parchment Style) */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-transparent overflow-hidden">
        {!isInitial && (
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-3 hover:bg-black/5 rounded-full transition-all z-20 group"
          >
            <X size={28} className="text-stone-400 group-hover:rotate-90 transition-transform"/>
          </button>
        )}

        <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar flex-1 relative z-10">
          
          {/* Header Section */}
          <div className="flex items-center justify-between mb-12 border-b-2 border-stone-200 pb-8">
             <div>
                <p className="text-stone-400 font-black text-xs uppercase tracking-widest mb-1">Dossier / 人物卷宗</p>
                <h3 className="text-4xl font-black text-stone-800 tracking-tight">平生记 · 绝密档案</h3>
             </div>
             <div className="text-right">
                <Fingerprint size={48} className="text-stone-200 ml-auto mb-1" />
                <p className="text-[10px] font-mono text-stone-300">CONFIDENTIAL ACCESS ONLY</p>
             </div>
          </div>

          {/* Section 1: Intro */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <ScrollText size={24} className="text-amber-600"/>
              <h4 className="text-xl font-black text-stone-700 uppercase tracking-wider">身份摘要</h4>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400 rounded-full"></div>
              <p className="text-2xl md:text-3xl font-black leading-relaxed italic text-stone-800">
                “ {role.description} ”
              </p>
            </div>
          </section>

          {/* Section 2: Bio */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={24} className="text-blue-600"/>
              <h4 className="text-xl font-black text-stone-700 uppercase tracking-wider">生平秘闻</h4>
            </div>
            <div className="bg-white/60 p-10 rounded-[2.5rem] border-2 border-stone-100 shadow-inner leading-8 text-lg font-medium text-stone-600 text-justify relative group">
              <Map className="absolute -top-6 -right-6 text-blue-500/5 w-48 h-48 pointer-events-none group-hover:rotate-12 transition-transform duration-1000"/>
              <div className="relative z-10 whitespace-pre-wrap first-letter:text-5xl first-letter:font-black first-letter:text-stone-800 first-letter:mr-2 first-letter:float-left">
                {role.detailedProfile || "该角色暂时没有更详细的背景档案记录。"}
              </div>
            </div>
          </section>

          {/* Section 3: Objectives */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Target size={24} className="text-red-600"/>
              <h4 className="text-xl font-black text-stone-700 uppercase tracking-wider">此行使命</h4>
            </div>
            <div className="bg-[#FFF4F2] p-10 rounded-[2.5rem] border-2 border-red-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-110 transition-transform"></div>
              
              <div className="flex items-start gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
                   <ShieldCheck className="text-red-600" size={32} />
                </div>
                <div>
                   <p className="text-xl md:text-2xl font-black text-red-900 leading-relaxed">
                     {role.objective}
                   </p>
                   <div className="mt-6 flex items-center gap-3">
                      <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded tracking-widest uppercase animate-pulse">Top Secret</span>
                      <div className="h-px flex-1 bg-red-100"></div>
                      <span className="text-[10px] font-bold text-red-400 italic">若泄密，全族连坐</span>
                   </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Action Footer */}
        <div className="p-10 bg-white/40 border-t border-stone-200 backdrop-blur-md">
           {isInitial ? (
             <Button 
                variant="primary" 
                onClick={onAccept}
                className={`w-full py-6 text-3xl font-black ${t.borderRadius} bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-[0_20px_40px_-10px_rgba(245,158,11,0.4)] transform active:scale-[0.98] transition-all group`}
             >
                领命 · 开启大汉征程 <Target className="ml-3 group-hover:rotate-45 transition-transform" size={32}/>
             </Button>
           ) : (
             <div className="flex justify-center">
                <Button 
                  variant="secondary" 
                  onClick={onClose} 
                  className="px-20 py-4 text-xl font-black rounded-2xl border-2 border-stone-200 hover:bg-white transition-all"
                >
                  合上卷轴
                </Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RoleCardModal;
