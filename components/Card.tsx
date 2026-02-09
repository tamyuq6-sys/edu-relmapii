import React from 'react';

const Card = ({ children, className = '', title, icon }: any) => (
  <div className={`bg-white rounded-3xl p-6 shadow-sm border-2 border-stone-100 ${className}`}>
    {(title || icon) && (
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-amber-500">{icon}</span>}
        {title && <h3 className="text-xl font-bold text-stone-700">{title}</h3>}
      </div>
    )}
    {children}
  </div>
);

export default Card;