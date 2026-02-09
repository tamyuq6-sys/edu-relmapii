
import React, { useState } from 'react';
import { BookOpen, Target, Star, Clock, Users, ArrowRight, CheckCircle2, Sparkles, UserCircle } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Button from '../components/Button';
import { Script } from '../types';

interface SelectionPageProps {
  scripts: Script[];
  onSelectScript: (s: Script) => void;
  completedScriptIds: Set<string>;
  onStartCustomization: () => void;
  userProfile?: any;
}

const SelectionPage = ({ scripts, onSelectScript, completedScriptIds, onStartCustomization, userProfile }: SelectionPageProps) => {
  const [filter, setFilter] = useState({ subject: '全部', version: '全部', grade: '全部' });
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'all' | 'mine'>('all');

  const subjects = [
    { label: '全部', value: '全部' },
    { label: '语文', value: '语文' },
    { label: '数学', value: '数学' },
    { label: '英语', value: '英语' },
    { label: '物理', value: '物理' },
    { label: '化学', value: '化学' },
    { label: '生物', value: '生物' },
    { label: '历史', value: '历史' },
    { label: '地理', value: '地理' },
    { label: '道法', value: '道德与法治' }
  ];
  
  const grades = [
    { label: '全部', value: '全部' },
    { label: '七年级', value: '七年级' },
    { label: '八年级', value: '八年级' },
    { label: '九年级', value: '九年级' }
  ];

  const versions = [
    { label: '全部', value: '全部' },
    { label: '人教版', value: '人教版' },
    { label: '北师大版', value: '北师大版' },
    { label: '苏教版', value: '苏教版' },
    { label: '鲁教版', value: '鲁教版' },
    { label: '统编版', value: '统编版' }
  ];

  const filteredScripts = scripts.filter(script => {
      const isCustom = script.id.startsWith('custom_');
      if (viewMode === 'mine' && !isCustom) return false;
      const isCompleted = completedScriptIds.has(script.id);
      if (completionFilter === 'completed' && !isCompleted) return false;
      
      const curriculum = script.curriculum;
      if (filter.subject !== '全部') {
          const s = curriculum?.subject || "";
          if (!s.includes(filter.subject) && !filter.subject.includes(s)) return false;
      }
      if (filter.grade !== '全部') {
          const g = curriculum?.grade || "";
          if (!g.includes(filter.grade)) return false;
      }
      if (filter.version !== '全部') {
          const v = curriculum?.version || "";
          if (!v.includes(filter.version)) return false;
      }
      return true;
  });

  return (
    <div className="min-h-screen bg-[#FEF9E7] font-nunito">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10">
                <img 
                  src="https://www.imgur.la/images/2025/12/23/kou-78c16aa6b8bf268e.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-2xl font-black text-stone-800 tracking-tight">EduRealm</span>
            </div>
            <div className="flex items-center gap-8">
              <button onClick={() => setViewMode('all')} className={`${viewMode === 'all' ? 'text-amber-500 border-amber-500' : 'text-stone-400 border-transparent'} font-black text-base border-b-2 pb-1 transition-all`}>
                课程剧本库
              </button>
              <button onClick={() => setViewMode('mine')} className={`${viewMode === 'mine' ? 'text-amber-500 border-amber-500' : 'text-stone-400 border-transparent'} font-black text-base border-b-2 pb-1 transition-all`}>
                我的剧本
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button onClick={onStartCustomization} variant="primary" className="px-6 py-2.5 rounded-xl text-sm">
              <span className="flex items-center gap-2"><Sparkles size={16} /> AI 剧本创作</span>
            </Button>
            <div className="h-8 w-px bg-stone-100"></div>
            <div className="flex items-center gap-3 group">
              <div className="text-right hidden md:block">
                <p className="text-xs font-black text-stone-800 leading-tight">{userProfile?.username || '访客'}</p>
                <p className="text-[10px] font-bold text-stone-400">Lv.{userProfile?.level || 1}</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-amber-100 overflow-hidden shadow-sm group-hover:border-amber-400 transition-colors bg-stone-50 flex items-center justify-center">
                {userProfile?.avatar_url ? (
                  <img 
                    src={userProfile.avatar_url} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserCircle size={24} className="text-stone-300" />
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-10 bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border-2 border-white shadow-sm">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-6">
              <span className="text-sm font-black text-stone-600 uppercase tracking-widest w-24 shrink-0">选择学科</span>
              <div className="flex flex-wrap gap-2.5">
                {subjects.map(sub => (
                  <button key={sub.value} onClick={() => setFilter({ ...filter, subject: sub.value })} className={`px-7 py-2.5 rounded-xl font-black text-sm transition-all border-2 ${filter.subject === sub.value ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md scale-105' : 'bg-white border-stone-100 text-stone-400'}`}>
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px w-full bg-stone-100/60"></div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-black text-stone-600 uppercase tracking-widest w-24 shrink-0">选择年级</span>
              <div className="flex flex-wrap gap-2.5">
                {grades.map(grade => (
                  <button key={grade.value} onClick={() => setFilter({ ...filter, grade: grade.value })} className={`px-7 py-2.5 rounded-xl font-black text-sm transition-all border-2 ${filter.grade === grade.value ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md scale-105' : 'bg-white border-stone-100 text-stone-400'}`}>
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px w-full bg-stone-100/60"></div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-black text-stone-600 uppercase tracking-widest w-24 shrink-0">选择教材</span>
              <div className="flex flex-wrap gap-2.5">
                {versions.map(v => (
                  <button key={v.value} onClick={() => setFilter({ ...filter, version: v.value })} className={`px-7 py-2.5 rounded-xl font-black text-sm transition-all border-2 ${filter.version === v.value ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md scale-105' : 'bg-white border-stone-100 text-stone-400'}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-6 ml-2">
            <h3 className="text-2xl font-black text-stone-800 flex items-center gap-2">
              <Target className="text-red-400" size={28}/> {viewMode === 'all' ? '课程剧本库' : '我的剧本'}
            </h3>
            <div className="flex bg-white p-1 rounded-2xl border-2 border-stone-100 shadow-sm">
              <button onClick={() => setCompletionFilter('all')} className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${completionFilter === 'all' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400'}`}>
                全部
              </button>
              <button onClick={() => setCompletionFilter('completed')} className={`px-6 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${completionFilter === 'completed' ? 'bg-green-500 text-white shadow-md' : 'text-stone-400'}`}>
                已完成
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
                {filteredScripts.length > 0 ? filteredScripts.map((script) => {
                    const isCompleted = completedScriptIds.has(script.id);
                    return (
                        <div key={script.id} className={`group bg-white rounded-[2.5rem] p-2 border-2 shadow-[0_4px_0_0_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-amber-300 transition-all ${isCompleted ? 'border-green-100' : 'border-stone-100'}`}>
                            <div className="flex flex-col md:flex-row gap-8 p-4">
                            <div className="w-full md:w-72 h-56 bg-stone-200 rounded-[2rem] overflow-hidden relative shadow-inner shrink-0">
                                <ImageWithFallback src={script.coverImage} className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${isCompleted ? 'grayscale-[0.3]' : ''}`} alt={script.title} />
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                  <div className="bg-stone-900/60 text-white text-[10px] px-3 py-1.5 rounded-full font-black backdrop-blur-md uppercase tracking-widest self-start">
                                    {script.curriculum?.unit}
                                  </div>
                                  <div className="bg-amber-50/90 text-amber-950 text-[10px] px-3 py-1.5 rounded-full font-black backdrop-blur-md uppercase tracking-widest self-start shadow-sm border border-amber-400/50">
                                    {script.curriculum?.subject} · {script.curriculum?.grade}
                                  </div>
                                </div>
                                {isCompleted && (
                                    <div className="absolute inset-0 bg-green-900/10 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
                                            <CheckCircle2 size={24} className="text-green-500"/>
                                            <span className="text-green-700 font-black text-sm uppercase tracking-wider">Done</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-center py-2 min-w-0">
                                <div className="flex justify-between items-start mb-3">
                                <h4 className="text-3xl font-black text-stone-800 group-hover:text-amber-600 transition-colors tracking-tight truncate pr-4">{script.title}</h4>
                                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 shrink-0">
                                    <Star size={16} className="text-yellow-400 fill-current"/>
                                    <span className="text-xs font-black text-amber-700">难度 {script.difficulty}</span>
                                </div>
                                </div>
                                <div className="flex gap-6 mb-6 text-xs font-black text-stone-400">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-lg"><Clock size={16} className="text-amber-400"/> {script.duration}分钟</div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-lg"><Users size={16} className="text-blue-400"/> {script.minPlayers}-{script.maxPlayers}人</div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100"><BookOpen size={16} className="text-green-400"/> {script.curriculum?.subject}</div>
                                </div>
                                <p className="text-stone-500 font-bold mb-6 line-clamp-2 leading-relaxed text-base">{script.description}</p>
                                <div className="mt-auto flex items-end justify-between">
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">核心素养发展目标</p>
                                        <div className="flex flex-wrap gap-2">
                                            {script.curriculum?.coreCompetencies?.map((c, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black border border-blue-100">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => onSelectScript(script)} className="text-amber-500 font-black text-sm flex items-center gap-2 group-hover:gap-3 transition-all bg-amber-50 px-6 py-2 rounded-xl border border-amber-100 hover:bg-amber-100">
                                            {isCompleted ? '查看荣誉报告' : '开启探险详情'} <ArrowRight size={18}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    );
                }) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white/50 rounded-[4rem] border-4 border-dashed border-stone-200">
                    <Target size={48} className="text-stone-300 mb-6"/>
                    <p className="text-2xl font-black text-stone-400">暂无匹配内容</p>
                </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;
