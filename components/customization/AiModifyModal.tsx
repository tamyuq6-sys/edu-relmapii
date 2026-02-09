import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import Avatar from '../Avatar';

interface AiModifyModalProps {
  title: string;
  placeholder: string;
  onClose: () => void;
  onModify: (instruction: string) => Promise<void>;
}

const AiModifyModal: React.FC<AiModifyModalProps> = ({ title, placeholder, onClose, onModify }) => {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleModify = async () => {
    if (!instruction.trim()) return;
    setLoading(true);
    await onModify(instruction);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up border-[6px] border-[#FEF3C7]">
        {/* Header - Image 1 Style */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center relative">
          <div className="flex items-center gap-3">
             <Sparkles className="text-[#D97706] w-7 h-7" />
             <h3 className="text-2xl font-black text-[#5D4037] tracking-tight">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400">
            <X size={24}/>
          </button>
        </div>

        <div className="px-10 pb-10 space-y-8">
          {/* Qiuqiu Speech Section - Image 1 Style */}
          <div className="flex items-start gap-5 pt-4">
             <Avatar char="🐹" size="md" className="shrink-0 mt-1 shadow-md border-2 border-white ring-2 ring-stone-50" />
             <div className="bg-[#F9FAFB] p-6 rounded-[1.8rem] rounded-tl-none border border-[#E5E7EB] relative shadow-sm">
                <p className="text-base font-bold text-[#5D4037] leading-relaxed relative z-10 italic">
                  “告诉我你的修改想法，我会努力让它更贴合教材标准！”
                </p>
             </div>
          </div>

          {/* Requirements Input - Image 1 Style */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 ml-1">
                <div className="w-4 h-4 border-2 border-stone-300 rounded flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-stone-300 rounded-sm"></div>
                </div>
                <label className="text-sm font-black text-stone-500 uppercase tracking-widest">
                   修改需求
                </label>
             </div>
             
             <div className="relative">
                <textarea 
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder={placeholder}
                  className="w-full h-44 p-8 bg-[#F9FAFB] rounded-[2.5rem] border-2 border-[#F3F4F6] focus:border-[#FCD34D] focus:bg-white focus:shadow-xl outline-none transition-all font-bold text-lg resize-none placeholder:text-stone-300"
                />
             </div>
          </div>
        </div>

        {/* Footer Buttons - Image 1 Style */}
        <div className="px-10 py-8 border-t border-stone-50 flex gap-6">
           <button 
             onClick={onClose} 
             className="flex-1 py-5 rounded-2xl font-black text-xl text-stone-500 border-2 border-stone-100 hover:bg-stone-50 transition-all active:scale-95"
           >
             取消
           </button>
           <button 
            onClick={handleModify} 
            disabled={!instruction.trim() || loading}
            className="flex-[1.5] py-5 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#5D4037] rounded-2xl font-black text-xl shadow-lg shadow-amber-100 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
           >
             {loading ? <Loader2 size={24} className="animate-spin" /> : <><Send size={20}/> 立即修改</>}
           </button>
        </div>
      </div>
    </div>
  );
};

export default AiModifyModal;