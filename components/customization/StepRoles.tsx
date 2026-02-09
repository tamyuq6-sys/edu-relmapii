
import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Users, BookOpen, Target, ArrowLeft, Layout, Lightbulb, Handshake, ScrollText, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../Button';
import { DesignScheme } from '../../types';
import AiRefinePopover from './AiRefinePopover';
import { modifyRolesWithAi } from '../../services/customizationService';

interface StepRolesProps {
  scheme: DesignScheme;
  onUpdate: (updatedRoles: any[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const StepRoles: React.FC<StepRolesProps> = ({ scheme, onUpdate, onBack, onNext }) => {
  const [showAiPopover, setShowAiPopover] = useState(false);
  const [localRoles, setLocalRoles] = useState<any[]>([]);

  // 关键修复：解除对 length > 0 的限制，确保 API 即使返回空也能同步并显示对应的 UI
  useEffect(() => {
    setLocalRoles(scheme?.cognitiveRoles || []);
  }, [scheme?.cognitiveRoles]);

  const handleAiModify = async (instruction: string) => {
    const updated = await modifyRolesWithAi(localRoles, instruction);
    if (updated && Array.isArray(updated)) {
      setLocalRoles(updated);
      onUpdate(updated);
    }
  };

  const handleUpdateRole = (idx: number, fields: any) => {
    const newRoles = [...localRoles];
    newRoles[idx] = { ...newRoles[idx], ...fields };
    setLocalRoles(newRoles);
    onUpdate(newRoles);
  };

  const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-stone-50 pb-8 gap-6">
         <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">第二阶段：角色矩阵设计</span>
            </div>
            <h2 className="text-3xl font-black text-stone-800 tracking-tight flex items-center gap-3">
                <Users className="text-purple-500" size={32}/> 构建角色认知矩阵
            </h2>
            <p className="text-stone-400 font-bold text-sm italic">赋予每个角色独特的灵魂与认知视角。</p>
         </div>
         <div className="flex gap-3 shrink-0">
            <Button variant="secondary" onClick={onBack} className="px-6 py-2.5 rounded-xl text-sm border-stone-200 shadow-none bg-white">
              返回
            </Button>
            
            <div className="relative">
                <Button 
                    variant="primary" 
                    onClick={() => setShowAiPopover(!showAiPopover)} 
                    className={`px-6 py-2.5 rounded-xl text-sm transition-all shadow-none hover:bg-amber-100 ${showAiPopover ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                >
                    <Sparkles size={16} /> AI 调优
                </Button>
                {showAiPopover && (
                    <AiRefinePopover 
                        onRefine={handleAiModify}
                        onAutoRefine={() => handleAiModify("增强角色性格特征的多样性与冲突深度")}
                        onClose={() => setShowAiPopover(false)}
                    />
                )}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-[2rem] border-2 border-stone-50 shadow-sm">
                <div className="flex items-center gap-2 mb-6 px-1">
                    <BookOpen size={16} className="text-stone-300"/>
                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">剧本环节脉络</h3>
                </div>
                <div className="space-y-4">
                    {scheme?.acts?.map((act, idx) => (
                        <div key={act?.id || idx} className="p-4 bg-stone-50/50 rounded-2xl border border-stone-100 transition-all hover:bg-white hover:border-purple-200 shadow-none">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="text-[9px] font-black bg-purple-500 text-white px-1.5 py-0.5 rounded-md">ACT {idx + 1}</div>
                                <h5 className="font-black text-stone-700 text-sm truncate">{act?.title}</h5>
                            </div>
                            <p className="text-[11px] text-stone-500 font-bold leading-relaxed italic line-clamp-3">
                                {act?.plotLogic}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="lg:col-span-8">
            {localRoles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {localRoles.map((role, idx) => (
                        <div key={role?.id || idx} className="bg-white p-6 rounded-[2.5rem] border-2 border-stone-50 shadow-sm relative group hover:border-purple-100 transition-all flex flex-col animate-scale-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white group-hover:rotate-3 transition-transform shrink-0">
                                    {role?.emoji || '👤'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <input 
                                        value={role?.roleName || ''}
                                        onChange={(e) => handleUpdateRole(idx, {roleName: e.target.value})}
                                        className="text-xl font-black text-stone-800 bg-transparent border-b border-transparent focus:border-purple-300 outline-none w-full"
                                        placeholder="角色名称"
                                    />
                                    <div className="text-[9px] font-black text-stone-300 uppercase tracking-widest mt-1">Character Dossier</div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-stone-300 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                        <ScrollText size={10}/> 角色传记 (背景设定)
                                    </label>
                                    <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-100 group-hover:bg-white transition-colors">
                                        <textarea 
                                            value={role?.roleDescription || ''}
                                            onChange={(e) => handleUpdateRole(idx, {roleDescription: e.target.value})}
                                            onInput={autoResize}
                                            className="w-full text-[11px] font-bold text-stone-500 leading-relaxed bg-transparent outline-none resize-none overflow-hidden italic"
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-purple-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                                        <Layout size={10}/> 认知功能 (视角独特性)
                                    </label>
                                    <div className="bg-purple-50/20 p-4 rounded-2xl border border-purple-100/30">
                                        <textarea 
                                            value={role?.cognitiveFunction || ''}
                                            onChange={(e) => handleUpdateRole(idx, {cognitiveFunction: e.target.value})}
                                            onInput={autoResize}
                                            className="w-full text-sm font-black text-stone-700 leading-tight bg-transparent outline-none resize-none overflow-hidden"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <div className="bg-stone-50 p-3 rounded-xl border border-stone-50 group-hover:border-stone-100 transition-colors">
                                    <div className="flex items-center gap-1.5 mb-1.5 opacity-40">
                                        <Lightbulb size={10}/>
                                        <span className="text-[8px] font-black uppercase tracking-widest">知识职责</span>
                                    </div>
                                    <textarea 
                                        value={role?.knowledgeResponsibility || ''}
                                        onChange={(e) => handleUpdateRole(idx, {knowledgeResponsibility: e.target.value})}
                                        onInput={autoResize}
                                        className="w-full text-[10px] font-bold text-stone-500 bg-transparent outline-none resize-none overflow-hidden leading-tight"
                                        rows={1}
                                    />
                                </div>
                                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 group-hover:border-stone-100 transition-colors">
                                    <div className="flex items-center gap-1.5 mb-1.5 opacity-40">
                                        <Handshake size={10}/>
                                        <span className="text-[8px] font-black uppercase tracking-widest">团队价值</span>
                                    </div>
                                    <textarea 
                                        value={role?.collaborationValue || ''}
                                        onChange={(e) => handleUpdateRole(idx, {collaborationValue: e.target.value})}
                                        onInput={autoResize}
                                        className="w-full text-[10px] font-bold text-stone-500 bg-transparent outline-none resize-none overflow-hidden leading-tight"
                                        rows={1}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white/40 rounded-[3rem] border-4 border-dashed border-stone-100 text-center px-10">
                    <AlertCircle size={48} className="text-amber-300 mb-4"/>
                    <h3 className="text-xl font-black text-stone-600 mb-2">生成异常或正在排队</h3>
                    <p className="text-sm font-bold text-stone-400 max-w-xs mb-8">Gemini 3 Pro 在处理复杂需求时偶尔会响应延迟。请尝试点击“AI 调优”重新激活，或返回大纲页重新生成。</p>
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 px-8 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl font-black text-sm transition-all active:scale-95"
                    >
                        <RefreshCw size={16}/> 返回重试
                    </button>
                </div>
            )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12 bg-amber-50/50 backdrop-blur-md rounded-[2.5rem] p-8 text-center relative overflow-hidden border-2 border-amber-100 shadow-sm animate-slide-up">
          <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-black text-stone-800 tracking-tight">角色分工已全部锁定</h3>
              <p className="text-stone-500 font-bold text-sm max-w-lg mx-auto">
                  角色矩阵已构建。球球将以此为基准，渲染包含插画、对话及谜题的完整剧本内容。
              </p>
              <div className="flex justify-center pt-2">
                  <Button 
                      onClick={onNext} 
                      disabled={localRoles.length === 0}
                      className="px-16 py-4 text-xl font-black hover:scale-105 active:scale-95 transition-all group"
                  >
                      开始渲染剧本全文内容 <ChevronRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform"/>
                  </Button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default StepRoles;
