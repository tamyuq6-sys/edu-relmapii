
import React, { useEffect, useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { Clue } from '../../types';

interface ClueUnlockToastProps {
  clue: Clue;
  onClose: () => void;
}

const ClueUnlockToast: React.FC<ClueUnlockToastProps> = ({ clue, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // 等待淡出动画
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-amber-900/40 backdrop-blur-[2px]"></div>
      
      <div className={`relative flex flex-col items-center transform transition-all duration-700 ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>
        {/* 光效 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-400 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
        
        <div className="relative z-10 bg-white p-1 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-amber-400">
           <div className="bg-stone-900 rounded-[2.3rem] px-12 py-8 flex flex-col items-center overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="text-amber-400 animate-spin-slow" size={24}/>
                  <span className="text-amber-400 font-black tracking-[0.3em] text-sm uppercase">发现新线索</span>
                  <Sparkles className="text-amber-400 animate-spin-slow" size={24}/>
              </div>
              
              <div className="w-24 h-24 bg-amber-400 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.5)] transform -rotate-3">
                  <Search size={48} className="text-amber-950" />
              </div>

              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">「 {clue.title} 」</h3>
              <p className="text-stone-400 font-bold text-sm">已存入证物架，请务必仔细研读。吱！</p>
           </div>
        </div>
        
        <div className="mt-8 text-white/40 font-black text-xs uppercase tracking-[0.5em] animate-pulse">
            New Clue Discovered
        </div>
      </div>
    </div>
  );
};

export default ClueUnlockToast;
