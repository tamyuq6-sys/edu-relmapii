
import React, { useRef, useState } from 'react';
import { FileUp, FileText, ChevronRight, Layers, Users, GraduationCap, MessageSquarePlus, Clock } from 'lucide-react';
import Button from '../Button';

interface StepUploadProps {
  metadata: { subject: string, grade: string, version: string };
  setMetadata: (val: any) => void;
  materialText: string;
  setMaterialText: (val: string) => void;
  onAnalyze: (userInstructions: string) => void;
  config: { style: string, duration: number, notes: string };
  setConfig: (val: any) => void;
}

const StepUpload: React.FC<StepUploadProps> = ({ 
  metadata, setMetadata, materialText, setMaterialText, onAnalyze, config, setConfig
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const subjects = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '道德与法治'];
  const grades = ['七年级', '八年级', '九年级'];
  const versions = ['人教版', '北师大版', '苏教版', '鲁教版', '统编版'];
  const durations = [20, 30, 45, 60, 75, 90];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setMaterialText(text);
      };
      if (file.type.includes("text") || file.name.endsWith(".txt")) {
        reader.readAsText(file);
      } else {
        setMaterialText(`[文件已上传: ${file.name}]`);
      }
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="border-b-2 border-stone-50 pb-6">
         <h2 className="text-3xl font-black text-stone-800 tracking-tight">1. 确立教学基准</h2>
         <p className="text-stone-500 font-bold mt-1">上传材料进行解析，并输入你的创作要求。</p>
      </div>
      
      <div className="space-y-8 bg-stone-50/50 p-8 rounded-[2.5rem] border border-stone-100">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <GraduationCap size={14} className="text-amber-500"/> ① 学科选择
          </label>
          <div className="flex flex-wrap gap-2.5">
            {subjects.map(s => (
              <button 
                key={s} 
                onClick={() => setMetadata({...metadata, subject: s})} 
                className={`px-6 py-2.5 rounded-xl border-2 font-black text-sm transition-all transform active:scale-95 ${metadata.subject === s ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md scale-105' : 'bg-white border-stone-100 text-stone-400 hover:border-stone-200'}`}
              >
                {s === '道德与法治' ? '道法' : s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <Users size={14} className="text-blue-500"/> ② 年级选择
          </label>
          <div className="flex flex-wrap gap-2.5">
            {grades.map(g => (
              <button 
                key={g} 
                onClick={() => setMetadata({...metadata, grade: g})} 
                className={`px-8 py-2.5 rounded-xl border-2 font-black text-sm transition-all transform active:scale-95 ${metadata.grade === g ? 'bg-blue-500 border-blue-600 text-white shadow-md scale-105' : 'bg-white border-stone-100 text-stone-400 hover:border-stone-200'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <Layers size={14} className="text-emerald-500"/> ③ 教材版本
          </label>
          <div className="flex flex-wrap gap-2.5">
            {versions.map(v => (
              <button 
                key={v} 
                onClick={() => setMetadata({...metadata, version: v})} 
                className={`px-6 py-2.5 rounded-xl border-2 font-black text-sm transition-all transform active:scale-95 ${metadata.version === v ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-105' : 'bg-white border-stone-100 text-stone-400 hover:border-stone-200'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* 新增探险时长选择行 */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
            <Clock size={14} className="text-orange-500"/> ④ 探险时长 (分钟)
          </label>
          <div className="flex flex-wrap gap-2.5">
            {durations.map(d => (
              <button 
                key={d} 
                onClick={() => setConfig({...config, duration: d})} 
                className={`px-8 py-2.5 rounded-xl border-2 font-black text-sm transition-all transform active:scale-95 ${config.duration === d ? 'bg-orange-500 border-orange-600 text-white shadow-md scale-105' : 'bg-white border-stone-100 text-stone-400 hover:border-stone-200'}`}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
         <div className="space-y-3">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <FileUp size={14}/> 核心材料解析 (支持 .txt / .pdf / .docx)
            </label>
            <div 
                onClick={() => fileInputRef.current?.click()}
                className={`h-56 border-4 border-dashed rounded-[2.5rem] transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center group ${fileName ? 'bg-green-50/50 border-green-200' : 'bg-white/60 border-stone-100 hover:border-amber-400'}`}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.pdf,.doc,.docx" onChange={handleFileChange} />
                {fileName ? (
                  <div className="animate-scale-up">
                    <FileText size={48} className="text-green-500 mb-2 mx-auto"/>
                    <p className="text-base font-black text-stone-800">{fileName}</p>
                    <p className="text-xs text-green-600/60 mt-2 font-bold italic">解析已就绪</p>
                  </div>
                ) : (
                  <>
                    <FileUp size={40} className="text-stone-300 group-hover:text-amber-500 mb-3"/>
                    <p className="text-sm font-black text-stone-500">点击上传教案或课件材料</p>
                    <p className="text-[10px] text-stone-300 mt-2 font-bold uppercase">AI 解析模式已启用</p>
                  </>
                )}
            </div>
         </div>

         <div className="space-y-3">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <MessageSquarePlus size={14}/> 你的创作要求 (选填)
            </label>
            <textarea 
              value={config.notes}
              onChange={(e) => setConfig({...config, notes: e.target.value})}
              placeholder="在此输入你对剧本的特殊期待..."
              className="w-full h-56 p-6 rounded-[2.5rem] border-2 border-stone-100 bg-white outline-none focus:border-amber-400 transition-all font-bold text-base shadow-sm resize-none"
            />
         </div>
      </div>

      <div className="flex justify-center pt-6">
         <Button 
            onClick={() => onAnalyze(config.notes)} 
            disabled={!materialText.trim() && !fileName} 
            className="px-24 py-6 text-2xl shadow-2xl"
          >
            开始解析 <ChevronRight size={28}/>
         </Button>
      </div>
    </div>
  );
};

export default StepUpload;
