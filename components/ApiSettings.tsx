
import React, { useState, useEffect } from 'react';
import { Settings, X, ShieldCheck, Zap, Globe, CheckCircle2, AlertCircle, Loader2, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { getApiConfig, saveApiConfig, ApiConfig, STORAGE_KEY } from '../services/apiConfig';
import Button from './Button';

const ApiSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopped, setIsPopped] = useState(false);
  const [config, setConfig] = useState<ApiConfig>(getApiConfig());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const models = [
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (推荐/极速)' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (深度逻辑)' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (高限额)' },
    { id: 'gemini-2.5-flash-lite-latest', name: 'Gemini 2.5 Flash Lite' },
    { id: 'gemini-2.5-pro-preview-09-2025', name: 'Gemini 2.5 Pro' }
  ];

  const handleSave = () => {
    saveApiConfig(config);
    setIsOpen(false);
    window.location.reload(); // 刷新以应用配置
  };

  const testConnection = async () => {
    if (!config.apiKey) {
      setErrorMessage('请输入 API Key');
      setTestStatus('error');
      return;
    }

    setTestStatus('testing');
    try {
      const ai = new GoogleGenAI({ apiKey: config.apiKey });
      const response = await ai.models.generateContent({
        model: config.model,
        contents: "Hi",
        config: { maxOutputTokens: 5 }
      });
      
      if (response.text) {
        setTestStatus('success');
      } else {
        throw new Error('未收到响应');
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || '';
      
      // 优化 429 错误提示
      if (msg.includes('429') || msg.includes('quota') || msg.includes('limit')) {
        setErrorMessage('API 额度已耗尽或请求太频繁。请稍等一分钟再试，或切换到 1.5 系列模型。');
      } else if (msg.includes('API_KEY_INVALID')) {
        setErrorMessage('API Key 无效，请检查是否输入正确。');
      } else {
        setErrorMessage('连接失败：' + (msg.length > 50 ? msg.substring(0, 50) + '...' : msg));
      }
      
      setTestStatus('error');
    }
  };

  return (
    <>
      {/* Side-hidden Toggle Button */}
      <div className="fixed top-32 right-0 z-[999] flex items-center pointer-events-none">
        <div className={`flex items-center transition-all duration-500 ease-in-out transform pointer-events-auto ${isPopped ? 'translate-x-0' : 'translate-x-[calc(100%-48px)]'}`}>
          
          {/* Popped State Close Tab */}
          {isPopped && (
            <button 
              onClick={() => setIsPopped(false)}
              className="bg-stone-900/80 hover:bg-stone-900 p-2 rounded-l-xl text-stone-400 hover:text-white transition-all border-y-2 border-l-2 border-white/10 shadow-lg mr-[-2px]"
            >
              <X size={16} />
            </button>
          )}

          {/* Main Button Pill */}
          <button 
            onClick={() => isPopped ? setIsOpen(true) : setIsPopped(true)}
            className={`flex items-center gap-3 pl-4 pr-6 py-3.5 bg-stone-800 text-white rounded-l-full shadow-2xl hover:bg-stone-700 transition-all border-2 border-r-0 border-white/20 backdrop-blur-md group ${!isPopped ? 'rounded-r-none' : ''}`}
          >
            <Settings size={20} className={`${isPopped ? 'rotate-90 text-amber-400' : 'animate-spin-slow'} transition-transform duration-700`} />
            <span className={`font-black text-sm whitespace-nowrap transition-all duration-500 ease-in-out overflow-hidden ${isPopped ? 'opacity-100 max-w-[120px] ml-1' : 'opacity-0 max-w-0'}`}>
              API 配置
            </span>
            {!isPopped && (
               <ChevronLeft size={14} className="text-stone-500 group-hover:text-amber-400 transition-colors animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border-4 border-amber-100 overflow-hidden animate-scale-up">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight flex items-center gap-2">
                    <ShieldCheck className="text-amber-500" /> AI 核心动力设置
                  </h3>
                  <p className="text-xs font-bold text-stone-400 mt-1">确保您的探险球球能够顺畅沟通</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-300">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* API Key */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" /> Gemini API Key
                  </label>
                  <input 
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                    placeholder="在此粘贴您的 API Key"
                    className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-100 rounded-2xl outline-none focus:border-amber-400 focus:bg-white transition-all font-bold"
                  />
                </div>

                {/* Model Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Globe size={14} className="text-blue-500" /> 探险模型引擎
                  </label>
                  <select 
                    value={config.model}
                    onChange={(e) => setConfig({...config, model: e.target.value})}
                    className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-100 rounded-2xl outline-none focus:border-blue-400 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                  >
                    {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                {/* Test Connection Result */}
                {testStatus !== 'idle' && (
                  <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 animate-fade-in ${
                    testStatus === 'testing' ? 'bg-stone-50 border-stone-100 text-stone-500' :
                    testStatus === 'success' ? 'bg-green-50 border-green-100 text-green-600' :
                    'bg-red-50 border-red-100 text-red-600'
                  }`}>
                    {testStatus === 'testing' ? <Loader2 size={18} className="animate-spin" /> :
                     testStatus === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="text-sm font-black leading-tight">
                      {testStatus === 'testing' ? '正在连接时空隧道...' :
                       testStatus === 'success' ? '连接成功！球球已就绪。' : errorMessage}
                    </span>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button 
                    variant="secondary" 
                    onClick={testConnection}
                    disabled={testStatus === 'testing'}
                    className="flex-1 py-4"
                  >
                    测试连接
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleSave}
                    className="flex-[1.5] py-4"
                  >
                    保存配置
                  </Button>
                </div>
              </div>
              
              <p className="mt-8 text-center text-[10px] text-stone-300 font-bold uppercase tracking-[0.2em]">
                EduRealm AI Engine Configuration Center
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiSettings;
