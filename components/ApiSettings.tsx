
import React, { useState, useRef, useEffect } from 'react';
import { FastForward, Play, Sparkles } from 'lucide-react';
import { Script, ThemeConfig } from '../../types';
import ImageWithFallback from '../ImageWithFallback';

interface IntroStageProps {
  script: Script;
  currentSlide: number;
  onNext: () => void;
  onFinish: () => void;
  theme: ThemeConfig;
}

const IntroStage: React.FC<IntroStageProps> = ({ script, currentSlide, onNext, onFinish, theme }) => {
  const [localStage, setLocalStage] = useState<'SPLASH' | 'SLIDES'>('SPLASH');
  const slide = script.introSlides[currentSlide];
  const t = theme;
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    if (currentSlide < script.introSlides.length - 1) {
      onNext();
    } else {
      onFinish();
    }
  };

  useEffect(() => {
    if (localStage === 'SLIDES' && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("Auto-play blocked:", error);
      });
    }
  }, [currentSlide, localStage]);

  if (localStage === 'SPLASH') {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => setLocalStage('SLIDES')}
      >
        <div className="absolute inset-0 z-0">
          <ImageWithFallback src={script.backgroundImage} className="w-full h-full object-cover scale-110 blur-sm brightness-[0.3]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center animate-scale-up text-center px-6">
           <div className="mb-6 opacity-80 animate-bounce">
              <Sparkles size={48} className="text-amber-400" />
           </div>
           <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
              {script.title}
           </h1>
           <p className="text-amber-200/60 text-xl font-bold tracking-[0.5em] mb-12 uppercase">
              EduRealm AI 互动剧场
           </p>
           
           <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center animate-pulse">
                <Play className="text-white fill-current ml-1" size={24} />
              </div>
              <span className="text-white/40 font-bold text-sm tracking-widest animate-pulse">点击屏幕 开启历险</span>
           </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-amber-200 rounded-full animate-ping [animation-delay:1s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black ${t.fontFamily} overflow-hidden`}>
      <div className="absolute inset-0 z-0 opacity-40 blur-3xl scale-110">
        <ImageWithFallback src={slide.image} className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center">
        
        {slide.video ? (
          <div className="w-full aspect-video bg-stone-900 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border-4 border-white/10 relative group animate-fade-in-up">
            <video 
              ref={videoRef}
              src={slide.video} 
              className="w-full h-full object-cover" 
              autoPlay 
              muted
              playsInline
              referrerPolicy="no-referrer"
              onEnded={handleEnded}
            />
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.4)_100%)]"></div>
          </div>
        ) : (
          <div className="w-full flex flex-col md:flex-row gap-12 items-center animate-fade-in-up">
             <div className="w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/20">
                <ImageWithFallback src={slide.image} className="w-full h-full object-cover" />
             </div>
             <div className="w-full md:w-1/2 flex flex-col">
                <div className="inline-flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-widest mb-6">
                   <div className="w-8 h-[2px] bg-amber-400"></div> 情境导入
                </div>
                <div className="relative">
                   <div className="absolute -left-6 top-0 bottom-0 w-1 bg-amber-400/30 rounded-full"></div>
                   <p className="text-3xl md:text-4xl font-black text-white leading-[1.6] pl-2 drop-shadow-lg text-justify">
                      {slide.text}
                   </p>
                </div>
                <button 
                  onClick={handleEnded}
                  className="mt-12 self-start flex items-center gap-3 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-amber-950 rounded-2xl font-black text-lg shadow-xl shadow-amber-400/20 transition-all active:scale-95 group"
                >
                  进入驿站 <Play className="fill-current group-hover:translate-x-1 transition-transform" size={18} />
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 right-8 z-20">
        <button 
          onClick={onFinish} 
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md text-white/40 hover:text-white rounded-full border border-white/10 transition-all text-xs font-bold uppercase tracking-widest active:scale-95"
        >
          <span>跳过剧情</span>
          <FastForward size={14} />
        </button>
      </div>
      
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-3 z-10 opacity-40">
        {script.introSlides.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-amber-400' : 'w-4 bg-white/20'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};
