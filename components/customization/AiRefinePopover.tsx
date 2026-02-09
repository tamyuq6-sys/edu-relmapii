import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';

interface AiRefinePopoverProps {
  onRefine: (instruction: string) => Promise<void>;
  onAutoRefine: () => Promise<void>;
  onClose: () => void;
}

const AiRefinePopover: React.FC<AiRefinePopoverProps> = ({ onRefine, onAutoRefine, onClose }) => {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!instruction.trim()) return;
    setLoading(true);
    await onRefine(instruction);
    setLoading(false);
    onClose();
  };

  const handleQuickOption = async (type: 'auto' | 'debug') => {
    setLoading(true);
    if (type === 'auto') {
      await onAutoRefine();
    } else {
      await onRefine("根据调试结果优化");
    }
    setLoading(false);
    onClose();
  };

  return (
    <div className="absolute top-0 right-[calc(100%+12px)] z-[60] w-[450px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-stone-100 p-6 animate-scale-up origin-right">
      <div className="flex gap-2.5 mb-5">
        <button 
          onClick={() => handleQuickOption('auto')}
          className="px-5 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#5D4037] text-sm font-black rounded-full transition-colors flex items-center gap-2"
        >
          自动优化
        </button>
        <button 
          onClick={() => handleQuickOption('debug')}
          className="px-5 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#5D4037] text-sm font-black rounded-full transition-colors flex items-center gap-2"
        >
          根据调试结果优化
        </button>
      </div>

      <div className={`relative flex items-center bg-[#F9FAFB] rounded-2xl border-2 transition-all px-4 ${loading ? 'opacity-50 pointer-events-none' : 'focus-within:border-[#8B5CF6] focus-within:bg-white focus-within:shadow-md border-[#F3F4F6]'}`}>
        <Sparkles size={20} className="text-[#8B5CF6] mr-3 shrink-0" />
        <input 
          autoFocus
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="你希望如何编写或优化提示词？"
          className="flex-1 py-4 bg-transparent border-none outline-none font-bold text-sm text-stone-700 placeholder:text-stone-300"
        />
        <button 
          onClick={handleSubmit}
          className="p-2 text-stone-300 hover:text-[#8B5CF6] transition-colors"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={22} />}
        </button>
      </div>
      
      {/* Popover Arrow */}
      <div className="absolute top-7 -right-2 w-4 h-4 bg-white rotate-45 border-r border-t border-stone-100 shadow-[2px_-2px_5px_rgba(0,0,0,0.02)]"></div>
    </div>
  );
};

export default AiRefinePopover;