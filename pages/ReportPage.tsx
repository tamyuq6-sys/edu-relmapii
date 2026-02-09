
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Calendar, Rocket, Settings, LogOut, Award, RefreshCcw, AlertTriangle, Lightbulb, GraduationCap, Target, Brain, Network, Loader2 } from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { AiSummary, Script } from '../types';
import { generateLearningReport } from '../services/geminiService';
import Avatar from '../components/Avatar';

interface ReportPageProps {
  onRestart: () => void;
  script: Script;
  transcript: string[];
  quizScore: number;
  totalQuestions: number;
  cachedReport?: any;
  onSaveReport?: (data: any) => void;
}

const ReportPage = ({ onRestart, script, transcript, quizScore, totalQuestions, cachedReport, onSaveReport }: ReportPageProps) => {
    const [loading, setLoading] = useState(!cachedReport);
    const [aiData, setAiData] = useState<any>(cachedReport || null);

    useEffect(() => {
        if (cachedReport) {
            setAiData(cachedReport);
            setLoading(false);
            return;
        }

        const loadReport = async () => {
            setLoading(true);
            const data = await generateLearningReport(
                script.title, 
                script.curriculum.knowledgePoints,
                transcript, 
                quizScore, 
                totalQuestions
            );
            
            const reportResult = data || {
                plotReview: "由于时空波动，未能生成详细知识回顾。但在这次探险中，我努力尝试运用了历史知识去应对每一个挑战。",
                teacherSuggestion: "继续保持好奇心！你在某些环节的表现证明了你对历史有独特的见解。",
                knowledgeMap: script.curriculum.knowledgePoints.map((p, i) => ({
                    point: p,
                    status: i % 2 === 0 ? 'mastered' : 'weak'
                })),
                abilities: { history: 80, logic: 80, collaboration: 80, spaceTime: 80, values: 80 }
            };

            setAiData(reportResult);
            if (onSaveReport) {
                onSaveReport(reportResult);
            }
            setLoading(false);
        };

        loadReport();
    }, [script.id, cachedReport]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FEF9E7] flex flex-col items-center justify-center p-8 text-center font-nunito">
                <div className="relative mb-8">
                     <Avatar char="🐹" size="lg" isSpeaking />
                     <div className="absolute -top-4 -right-4 bg-white p-2 rounded-xl shadow-xl border-2 border-amber-100">
                        <Loader2 className="animate-spin text-amber-500" />
                     </div>
                </div>
                <h2 className="text-3xl font-black text-stone-800 mb-4 tracking-tight">正在提取你的探险印记...</h2>
                <p className="text-stone-500 font-bold max-w-md animate-pulse">
                    球球正在深度分析你在历史现场对知识的运用情况，<br/>这份笔记将是你成长的见证。吱！
                </p>
            </div>
        );
    }

    const radarData = [
        { subject: '史实敏锐度', A: aiData.abilities.history, fullMark: 100 },
        { subject: '逻辑推理', A: aiData.abilities.logic, fullMark: 100 },
        { subject: '团队协作', A: aiData.abilities.collaboration, fullMark: 100 },
        { subject: '时空观念', A: aiData.abilities.spaceTime, fullMark: 100 },
        { subject: '价值认同', A: aiData.abilities.values, fullMark: 100 },
    ];

    const treeNodes = [
        { id: 'root', label: '沟通中外文明的“丝绸之路”', x: 800, y: 450, level: 0 },
        { id: 'bg', label: '开通背景', x: 480, y: 250, level: 1, parent: 'root', kp: '汉匈关系' },
        { id: 'proc', label: '开通过程', x: 480, y: 650, level: 1, parent: 'root', kp: '张骞通西域' },
        { id: 'bg1', label: '汉初形势：威胁与和亲', x: 180, y: 120, level: 2, parent: 'bg' },
        { id: 'bg2', label: '武帝雄心：反击匈奴', x: 180, y: 380, level: 2, parent: 'bg' },
        { id: 'p1', label: '张骞首使：联络大月氏', x: 180, y: 520, level: 2, parent: 'proc' },
        { id: 'p2', label: '张骞再使：联合乌孙', x: 180, y: 780, level: 2, parent: 'proc' },
        { id: 'cont', label: '交流内容', x: 1120, y: 250, level: 1, parent: 'root', kp: '中外物种交流' },
        { id: 'mng', label: '有效管理', x: 1120, y: 650, level: 1, parent: 'root', kp: '西域都护' },
        { id: 'c1', label: '中原输出：丝绸、技术', x: 1420, y: 120, level: 2, parent: 'cont' },
        { id: 'c2', label: '西域传入：葡萄、良马', x: 1420, y: 380, level: 2, parent: 'cont' },
        { id: 'm1', label: '设立西域都护府', x: 1420, y: 520, level: 2, parent: 'mng' },
        { id: 'm2', label: '正式归属中央政权', x: 1420, y: 780, level: 2, parent: 'mng' },
        { id: 'imp', label: '历史影响', x: 800, y: 210, level: 1, parent: 'root', kp: '丝绸之路的路线' },
        { id: 'imp1', label: '东西方文明交流桥梁', x: 800, y: 60, level: 2, parent: 'imp' },
    ];

    const getStatusForNode = (node: any) => {
        if (node.level === 0) return 'mastered';
        const targetKp = node.kp || treeNodes.find(p => p.id === node.parent)?.kp;
        const kpStatus = aiData.knowledgeMap.find((k: any) => targetKp && k.point.includes(targetKp))?.status;
        return kpStatus || 'mastered';
    };

    const masteredCount = aiData.knowledgeMap.filter((k: any) => k.status === 'mastered').length;

    const renderKnowledgeGraph = () => {
        const rootSize = 85; 
        const boxW = 170; 
        const boxH = 65;  
        const indicatorR = 14;

        return (
            <svg className="w-full h-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet">
                {treeNodes.map((node: any) => {
                    if (node.id === 'root') return null;
                    const parent = treeNodes.find(p => p.id === node.parent);
                    if (!parent) return null;
                    const status = getStatusForNode(node);
                    return (
                        <line 
                            key={`line-${node.id}`} 
                            x1={parent.x} y1={parent.y} 
                            x2={node.x} y2={node.y} 
                            stroke={status === 'mastered' ? '#d1fae5' : '#fee2e2'} 
                            strokeWidth="3" 
                            strokeDasharray="10 8"
                        />
                    );
                })}

                {treeNodes.map((node: any) => {
                    const status = getStatusForNode(node);
                    const isRoot = node.level === 0;
                    const isL1 = node.level === 1;

                    const fontSizeClass = isRoot ? 'text-xl' : (isL1 ? 'text-[14px]' : 'text-[12px]');

                    return (
                        <g key={node.id} className="cursor-pointer hover:scale-105 transition-transform duration-300">
                            {isRoot ? (
                                <g>
                                    <circle cx={node.x} cy={node.y} r={rootSize} fill="#FCD34D" stroke="#F59E0B" strokeWidth="7" className="drop-shadow-2xl"/>
                                    <foreignObject 
                                        x={node.x - rootSize * 0.9} 
                                        y={node.y - rootSize * 0.9} 
                                        width={rootSize * 1.8} 
                                        height={rootSize * 1.8}
                                    >
                                        <div className="w-full h-full flex items-center justify-center text-center">
                                            <span className={`${fontSizeClass} font-black text-amber-900 leading-tight px-4`}>
                                                {node.label}
                                            </span>
                                        </div>
                                    </foreignObject>
                                </g>
                            ) : (
                                <g>
                                    <foreignObject 
                                        x={node.x - boxW / 2} 
                                        y={node.y - boxH / 2} 
                                        width={boxW} 
                                        height={boxH}
                                    >
                                        <div className={`w-full h-full flex items-center justify-center bg-white rounded-[2rem] border-[5px] ${status === 'mastered' ? 'border-green-400 shadow-[0_8px_25px_rgba(16,185,129,0.3)]' : 'border-red-400 shadow-[0_8px_25px_rgba(239,68,68,0.3)]'} px-5 py-2 transition-all`}>
                                            <span className={`font-black text-center leading-tight break-words ${fontSizeClass} ${status === 'mastered' ? 'text-green-800' : 'text-red-800'}`}>
                                                {node.label}
                                            </span>
                                        </div>
                                    </foreignObject>
                                    <circle cx={node.x + boxW / 2} cy={node.y - boxH / 2} r={indicatorR} fill={status === 'mastered' ? '#10B981' : '#EF4444'} stroke="white" strokeWidth="3" className="shadow-sm"/>
                                    <text x={node.x + boxW / 2} y={node.y - boxH / 2} dy=".35em" textAnchor="middle" fill="white" className="text-[11px] font-black pointer-events-none">{status === 'mastered' ? '✓' : '!'}</text>
                                </g>
                            )}
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-[#FEF9E7] font-nunito flex overflow-hidden selection:bg-amber-200">
            <aside className="w-24 bg-[#FFC107] flex flex-col items-center py-8 gap-8 shrink-0 rounded-r-[2.5rem] my-4 ml-4 shadow-xl z-10 hidden md:flex border-r-4 border-[#e6ad00]">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white/90 mb-4 border-2 border-white/10 shadow-inner">
                    <LayoutGrid size={24} />
                </div>
                <nav className="flex flex-col gap-6 w-full items-center">
                    <button className="p-3 text-amber-900/60 hover:text-amber-900 hover:bg-white/20 rounded-2xl transition-all"><Calendar size={24}/></button>
                    <button className="p-3 text-amber-900 bg-white/30 rounded-2xl shadow-sm border border-white/20"><Rocket size={24}/></button>
                </nav>
                <div className="mt-auto flex flex-col gap-6 items-center">
                    <button className="p-3 text-amber-900/60 hover:text-amber-900 hover:bg-white/20 rounded-2xl transition-all"><Settings size={24}/></button>
                    <button className="p-3 text-amber-900/60 hover:text-red-600 hover:bg-white/20 rounded-2xl transition-all"><LogOut size={24}/></button>
                </div>
            </aside>

            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-black uppercase mb-2">
                             <Target size={16}/> {script.title} · 荣誉探险笔记
                        </div>
                        <h1 className="text-5xl font-extrabold text-stone-800 tracking-tight">你的探险笔记</h1>
                        <p className="text-lg text-stone-500 mt-2 font-bold">每一个知识点的点亮，都是你在这个时空的成长足迹。</p>
                    </div>
                    <button onClick={onRestart} className="bg-stone-800 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-stone-700 shadow-xl shadow-stone-200 transition-all flex items-center gap-2 active:scale-95 group">
                        <RefreshCcw size={24} className="group-hover:rotate-180 transition-transform duration-500"/> 返回课程库
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-stone-100 relative overflow-hidden group hover:border-amber-200 transition-colors">
                            <img 
                                 src="https://www.imgur.la/images/2025/12/23/kou-_20251222204439_656_105.png" 
                                className="absolute bottom-0 right-0 w-44 h-44 object-contain z-0 transition-transform group-hover:scale-105 pointer-events-none" 
                                alt="学识认证伙伴" 
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 z-[-1] opacity-40"></div>
                            
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="relative w-36 h-36 shrink-0">
                                    <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 128 128">
                                        <circle cx="64" cy="64" r="56" className="stroke-stone-100" strokeWidth="12" fill="none"/>
                                        <circle 
                                            cx="64" cy="64" r="56" className="stroke-amber-400" strokeWidth="12" fill="none" 
                                            strokeDasharray="351.86" strokeDashoffset={351.86 * (1 - (quizScore/totalQuestions))} strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                                        <span className="text-5xl font-black text-stone-800 leading-none tracking-tighter">{Math.round((quizScore/totalQuestions)*100)}</span>
                                        <span className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-1">知识达标</span>
                                    </div>
                                </div>
                                <div className="pr-12 md:pr-0">
                                    <h3 className="text-3xl font-extrabold text-stone-800 mb-2">学识认证：{masteredCount >= aiData.knowledgeMap.length ? '博古通今' : '初窥门径'}</h3>
                                    <div className="flex gap-2 mb-3">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-black">历史守护者</span>
                                        <span className="px-3 py-1 bg-stone-100 text-stone-500 rounded-lg text-sm font-bold">{masteredCount}/{aiData.knowledgeMap.length} 知识点已点亮</span>
                                    </div>
                                    <p className="text-stone-400 font-bold text-sm max-w-[18rem] md:max-w-none">这些点亮的星火，将指引你在未来的历史课上更加自信。</p>
                                </div>
                            </div>
                        </div>

                         <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-amber-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300"></div>
                            <div className="flex items-center gap-4 mb-6 pt-2">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border-2 border-white shadow-sm">
                                    <Brain size={24}/>
                                </div>
                                <h3 className="text-2xl font-extrabold text-stone-800">知识应用与探险回顾</h3>
                            </div>
                            <div className="bg-[#FFFBEB] p-8 rounded-3xl border border-amber-100 mb-8 relative group">
                                <Rocket className="absolute top-4 right-4 text-amber-200 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={48}/>
                                <p className="text-amber-900 font-bold leading-relaxed relative z-10 text-base md:text-lg">
                                    <span className="font-black text-amber-700 block mb-3 border-b border-amber-200 pb-2">「我」在历史现场的表现：</span>
                                    {aiData.plotReview}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col">
                                    <h4 className="text-sm font-black text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Lightbulb size={18} className="text-yellow-400 fill-yellow-400"/> 球球的悄悄话
                                    </h4>
                                    <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 flex-1 shadow-sm">
                                        <p className="text-amber-900 font-bold text-base leading-relaxed">
                                            {aiData.teacherSuggestion}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-stone-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <AlertTriangle size={18} className="text-orange-500 fill-orange-500"/> 需强化的历史记忆
                                    </h4>
                                    <div className="space-y-3">
                                        {aiData.knowledgeMap.filter((k: any) => k.status === 'weak').map((wp: any, i: number) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-orange-50 text-orange-900 rounded-2xl text-sm font-bold border border-orange-100">
                                                <div className="w-2 h-2 rounded-full bg-orange-400 shrink-0"></div>
                                                {wp.point}
                                            </div>
                                        ))}
                                        {aiData.knowledgeMap.filter((k: any) => k.status === 'weak').length === 0 && (
                                            <div className="p-5 bg-green-50 text-green-800 rounded-2xl text-base font-bold border border-green-100 flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"></div>
                                                {aiData.knowledgeMap[0]?.point}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-stone-100 relative overflow-hidden">
                             <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-extrabold text-stone-800 flex items-center gap-3">
                                        <Network className="text-amber-500" size={32} strokeWidth={3}/> 核心知识图谱
                                    </h3>
                                    <p className="text-stone-500 font-bold mt-2 ml-1 text-sm">完全还原历史逻辑的放射状结构，文字已极致放大</p>
                                </div>
                            </div>
                            <div className="w-full aspect-[16/9] bg-white rounded-[2rem] border-4 border-amber-50 relative overflow-hidden flex items-center justify-center shadow-inner group">
                                {renderKnowledgeGraph()}
                                
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row gap-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-amber-100 shadow-xl whitespace-nowrap z-20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                                        <span className="text-sm font-black text-stone-600">知识核心已稳固</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div>
                                        <span className="text-sm font-black text-stone-600">仍需跨时空复习</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-amber-400 rounded-[2.5rem] p-8 shadow-lg shadow-amber-100 text-amber-900 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                             <div className="absolute -right-6 -bottom-6 bg-white/20 w-44 h-44 rounded-full blur-2xl"></div>
                             <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="bg-white/25 p-4 rounded-2xl backdrop-blur-md"><Award size={32} className="text-amber-900"/></div>
                                    <span className="text-sm font-black bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">探险等级</span>
                                </div>
                                <h3 className="text-6xl font-black mb-2">LV.9 <span className="text-2xl font-bold opacity-80">时空行者</span></h3>
                                <p className="font-bold opacity-90 text-base max-w-[70%]">你通过知识的力量守护了历史的真相</p>
                             </div>
                        </div>

                         <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-stone-100">
                            <h3 className="text-xl font-extrabold text-stone-800 mb-4">探险者素养模型</h3>
                            <div className="h-72 relative -ml-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#E7E5E4" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#A8A29E', fontSize: 12, fontWeight: '800' }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Ability" dataKey="A" stroke="#F59E0B" strokeWidth={4} fill="#FCD34D" fillOpacity={0.5} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border-2 border-stone-100 flex-1">
                            <h3 className="text-xl font-extrabold text-stone-800 mb-6 flex items-center gap-3">
                                <GraduationCap size={24} className="text-stone-400"/> 掌握度清单
                            </h3>
                            <div className="space-y-4">
                                {aiData.knowledgeMap.map((k: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between group p-3 hover:bg-stone-50 rounded-2xl transition-colors -mx-2">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-colors border-2 shrink-0
                                                ${k.status === 'mastered' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}
                                            `}>
                                                {k.status === 'mastered' ? 'A' : 'C'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-stone-700 text-base line-clamp-1">{k.point}</p>
                                                <p className="text-xs text-stone-400 font-bold uppercase tracking-wide mt-1">{k.status === 'mastered' ? '掌握牢固' : '需加强练习'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportPage;
