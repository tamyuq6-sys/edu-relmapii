
import React from 'react';
import { X, Network } from 'lucide-react';

interface KnowledgePoint {
  point: string;
  status: 'mastered' | 'weak';
}

interface KnowledgeGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  knowledgeMap: KnowledgePoint[];
  title: string;
}

const KnowledgeGraphModal: React.FC<KnowledgeGraphModalProps> = ({ isOpen, onClose, knowledgeMap, title }) => {
  if (!isOpen) return null;

  const centerX = 450; 
  const centerY = 300;
  const radius = 200;
  
  const graphNodes = knowledgeMap.map((k, i) => {
      const total = knowledgeMap.length;
      const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
      return {
          ...k,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
      };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-[#FEF9E7] w-full max-w-6xl h-[90vh] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative flex flex-col animate-scale-up border-8 border-amber-200">
            <div className="flex justify-between items-start mb-6">
                <div>
                        <h3 className="text-4xl font-extrabold text-stone-800 flex items-center gap-3">
                        <Network className="text-amber-500" size={40} strokeWidth={3}/> 你的知识探险图谱
                    </h3>
                    <p className="text-stone-500 font-bold mt-2 ml-1 text-base">基于剧本「{title}」的核心知识点梳理</p>
                </div>
                <button onClick={onClose} className="p-3 bg-white hover:bg-stone-100 rounded-full transition-colors shadow-sm">
                        <X size={28} className="text-stone-500"/>
                </button>
            </div>

            <div className="flex-1 mt-2 bg-white rounded-[2rem] border-4 border-amber-100 relative overflow-hidden flex items-center justify-center shadow-inner">
                    <svg className="w-full h-full" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid meet">
                        {graphNodes.map((node, i) => (
                            <line 
                                key={`line-${i}`}
                                x1={centerX} 
                                y1={centerY} 
                                x2={node.x} 
                                y2={node.y} 
                                stroke={node.status === 'mastered' ? '#d1fae5' : '#fee2e2'} 
                                strokeWidth="3" 
                                strokeDasharray="8 6"
                                className="animate-pulse"
                            />
                        ))}
                        
                        <g className="cursor-pointer hover:scale-110 transition-transform duration-300">
                            <circle cx={centerX} cy={centerY} r="70" fill="#FCD34D" stroke="#F59E0B" strokeWidth="8" className="drop-shadow-xl"/>
                            <text x={centerX} y={centerY} dy=".3em" textAnchor="middle" className="text-xl font-black fill-amber-900 pointer-events-none select-none">{title}</text>
                        </g>

                        {graphNodes.map((node, i) => (
                            <g key={i} className="cursor-pointer hover:scale-110 transition-transform duration-300 group">
                                <foreignObject x={node.x - 100} y={node.y + 40} width="200" height="60">
                                    <div className={`w-full h-full flex items-center justify-center bg-white rounded-2xl border-2 ${node.status === 'mastered' ? 'border-green-500' : 'border-red-500'} shadow-md px-3 py-1`}>
                                        <span className={`text-sm font-black text-center leading-tight line-clamp-2 ${node.status === 'mastered' ? 'text-green-700' : 'text-red-700'}`}>
                                            {node.point}
                                        </span>
                                    </div>
                                </foreignObject>
                                
                                <circle 
                                    cx={node.x} 
                                    cy={node.y} 
                                    r="36" 
                                    fill={node.status === 'mastered' ? '#10B981' : '#EF4444'} 
                                    stroke="white"
                                    strokeWidth="5"
                                    className="shadow-lg drop-shadow-md"
                                />
                                <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" className="text-white text-2xl font-black select-none">
                                    {node.status === 'mastered' ? 'A' : 'C'}
                                </text>
                            </g>
                        ))}
                    </svg>
                    
                    <div className="absolute bottom-8 left-8 flex gap-6 bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-stone-200 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-[#10B981] shadow-sm"></div>
                                <span className="text-sm font-black text-stone-600">已掌握</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-[#EF4444] shadow-sm"></div>
                                <span className="text-sm font-black text-stone-600">需补强</span>
                            </div>
                    </div>
            </div>
        </div>
    </div>
  );
};

export default KnowledgeGraphModal;
