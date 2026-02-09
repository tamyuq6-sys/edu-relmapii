import React from 'react';
import { ChevronRight, ArrowLeft, Clock, Timer, Sparkles, MessageSquarePlus } from 'lucide-react';
import Button from '../Button';

interface StepConfigProps {
  config: { style: string, duration: number, notes: string };
  setConfig: (val: any) => void;
  onBack: () => void;
  onGenerate: () => void;
}

const StepConfig: React.FC<StepConfigProps> = ({ config, setConfig, onBack, onGenerate }) => {
  const markers = [20, 30, 45, 60, 75, 90];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-end border-b-2 border-stone-50 pb-6">
         <div>
            <h2 className="text-3xl font-black text-stone-800 tracking-tight flex items-center gap-3">
              <Timer className="text-amber-500" size={32}/> 3. 剧本参数设定
            </h2>
            <p className="text-stone-500 font-bold mt-1">告诉球球，你希望这场历险以何种节奏展开？</p>
         </div>
         <div className="flex gap-3">
            <Button variant="secondary" onClick={onBack} className="px-6 py-2.5 rounded-xl text-sm border-stone-200">
               <ArrowLeft size={16} /> 返回重传
            </Button>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
         {/* 核心时长设定卡片 */}
         <div className="md:col-span-7 space-y-4">
            <label className="text-[11px] font-black text-stone-400 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
                <Clock size={14} className="text-blue-500"/> ① 设定预期时长 (分钟)
            </label>
            
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-stone-100 shadow-sm relative overflow-hidden h-full flex flex-col justify-center">
                <div className="flex items-center justify-between mb-10">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Selected Time</span>
                      <div className="flex items-baseline gap-1">
                         <span className="text-6xl font-black text-amber-500 tracking-tighter tabular-nums">{config.duration}</span>
                         <span className="text-sm font-black text-amber-300 uppercase tracking-widest">分钟</span>
                      </div>
                   </div>
                   <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-center justify-center text-amber-500 shadow-inner">
                      <Timer size={32} className={config.duration > 60 ? 'animate-pulse' : ''} />
                   </div>
                </div>

                <div className="relative px-2">
                    <input 
                      type="range" 
                      min="20" max="90" step="5"
                      value={config.duration}
                      onChange={(e) => setConfig({...config, duration: parseInt(e.target.value)})}
                      className="custom-slider"
                    />

                    <div className="flex justify-between mt-6 px-1">
                        {markers.map(m => (
                            <div key={m} className="flex flex-col items-center gap-2">
                                <div className={`w-1 h-1 rounded-full transition-all duration-300 ${config.duration >= m ? 'bg-amber-400 scale-150' : 'bg-stone-200'}`}></div>
                                <span className={`text-[10px] font-black transition-colors duration-300 ${config.duration === m ? 'text-amber-600' : 'text-stone-300'}`}>{m}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-3">
                   <Sparkles size={16} className="text-amber-400 shrink-0"/>
                   <p className="text-[11px] text-stone-400 font-bold italic leading-relaxed">
                      时长设定会直接影响 AI 生成的关卡深度与互动频率。吱！
                   </p>
                </div>
            </div>
         </div>

         {/* 备注要求卡片 */}
         <div className="md:col-span-5 space-y-4">
            <label className="text-[11px] font-black text-stone-400 uppercase tracking-[0.25em] ml-1 flex items-center gap-2">
              <MessageSquarePlus size={14} className="text-emerald-500"/> ② 方案特别嘱托 (选填)
            </label>
            <div className="relative h-[calc(100%-2rem)]">
              <textarea 
                value={config.notes}
                onChange={(e) => setConfig({...config, notes: e.target.value})}
                placeholder="例如：增加更多关于汉匈关系的史料辩论环节..."
                className="w-full h-full p-8 rounded-[2.5rem] border-2 border-stone-100 outline-none focus:border-amber-400 focus:bg-white transition-all font-bold text-lg shadow-sm bg-white placeholder:text-stone-200 resize-none"
              />
              <div className="absolute bottom-6 right-8 text-[10px] font-black text-stone-200 uppercase tracking-widest pointer-events-none">
                AI Prompting
              </div>
            </div>
         </div>
      </div>

      <div className="flex justify-center pt-10 border-t-2 border-stone-50">
         <Button onClick={onGenerate} className="px-20 py-6 text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all group">
            开始生成剧本大纲 <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform"/>
         </Button>
      </div>
    </div>
  );
};

export default StepConfig;