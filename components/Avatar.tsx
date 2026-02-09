
import React from 'react';

const IP_ICON_URL = "https://www.imgur.la/images/2025/12/23/kou-_20251222210737_658_105.png";

const Avatar = ({ char, src, size = 'md', className='', isSpeaking = false }: any) => {
  const sizes = { xs: 'w-8 h-8', sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-20 h-20' };
  
  // Use image if src provided, or if char is the hamster emoji, or if no char provided (default)
  const showImage = src || char === '🐹' || !char;
  const imageSrc = src || IP_ICON_URL;

  return (
    <div className={`relative inline-block ${className}`}>
        {isSpeaking && (
            <>
                <div className="absolute inset-0 rounded-full bg-amber-400 opacity-30 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-2 border-amber-400 opacity-50 animate-pulse"></div>
            </>
        )}
        {/* 
            - rounded-full: ensures circle 
            - border-2 border-white: keeps the white ring as requested 
            - overflow-hidden: clips the square image to circle
            - No bg-white on outer container to prevent square corners 
        */}
        <div className={`${sizes[size as keyof typeof sizes] || sizes.md} rounded-full flex items-center justify-center relative z-10 transition-transform duration-300 ${isSpeaking ? 'scale-110' : ''} overflow-hidden shadow-sm border-2 border-white`}>
            {showImage ? (
                <img src={imageSrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold">
                    {char}
                </div>
            )}
        </div>
    </div>
  );
};

export default Avatar;
