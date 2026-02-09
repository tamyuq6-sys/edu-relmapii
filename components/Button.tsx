import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "font-extrabold py-3 px-6 rounded-2xl transform transition flex items-center justify-center gap-2 select-none";
  const variants = {
    primary: "bg-[#FCD34D] hover:bg-[#fbbf24] text-amber-900 border-b-4 border-amber-500 active:border-b-0 active:translate-y-1", 
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 border-b-4 active:border-b-2 active:translate-y-0.5",
    accent: "bg-[#58CC02] hover:bg-[#46a302] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1",
    danger: "bg-red-400 hover:bg-red-500 text-white border-b-4 border-red-600 active:border-b-0 active:translate-y-1",
    ghost: "bg-transparent hover:bg-stone-100 text-stone-500"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed active:border-b-4 active:translate-y-0' : 'active:scale-95'}`}
    >
      {children}
    </button>
  );
};

export default Button;