
import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed bottom-6 left-6 z-[999]">
      <button 
        onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
        className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-md border-2 border-amber-200 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-amber-700 font-black text-sm"
      >
        <Languages size={18} />
        <span>{language === 'zh' ? 'English' : '中文'}</span>
      </button>
    </div>
  );
};

export default LanguageToggle;
