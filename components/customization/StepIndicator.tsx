
import React from 'react';
import { Upload, Brain, Settings, Layout, Users, CheckCircle2, ClipboardList } from 'lucide-react';
import { CustomStep } from '../../pages/CustomizationPage';

interface StepIndicatorProps {
  step: CustomStep;
  isDevMode?: boolean;
  onStepClick?: (step: CustomStep) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step, isDevMode, onStepClick }) => {
  const steps = [
    { id: CustomStep.UPLOAD, label: '上传材料', icon: <Upload size={18}/> },
    { id: CustomStep.CURRICULUM, label: '教学要点', icon: <Brain size={18}/> },
    { id: CustomStep.SCHEME, label: '大纲设计', icon: <Layout size={18}/> },
    { id: CustomStep.ROLES, label: '角色矩阵', icon: <Users size={18}/> },
    { id: CustomStep.REVIEW, label: '剧本预览', icon: <CheckCircle2 size={18}/> },
    { id: CustomStep.QUIZ_GEN, label: '配套习题', icon: <ClipboardList size={18}/> },
  ];
  
  const activeIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="flex items-center justify-between mb-12 w-full max-w-6xl mx-auto px-4">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div 
            onClick={() => isDevMode && onStepClick?.(s.id)}
            className={`flex flex-col items-center gap-2 relative z-10 shrink-0 ${isDevMode ? 'cursor-pointer hover:opacity-80 transition-all active:scale-95' : ''}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500
              ${step === s.id ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-[0_10px_20px_rgba(245,158,11,0.3)] scale-110' : 
                activeIndex > i ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-stone-100 text-stone-300'}`}>
              {activeIndex > i ? <CheckCircle2 size={24}/> : s.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step === s.id ? 'text-amber-600' : 'text-stone-300'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-1 mx-1 bg-stone-100 rounded-full relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-emerald-500 transition-all duration-700 ease-in-out" 
                  style={{ width: activeIndex > i ? '100%' : '0%' }}
                ></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
