
import React, { useState } from 'react';
import { Scroll, Users, Bot, Sparkles, X, Mail, Lock, User } from 'lucide-react';
import Button from '../components/Button';
import ImageWithFallback from '../components/ImageWithFallback';

interface LandingPageProps {
  onStart: () => void;
  onSimulateLogin: (username: string) => void;
}

const LandingPage = ({ onStart, onSimulateLogin }: LandingPageProps) => {
  const [showAuth, setShowAuth] = useState<'login' | 'signup' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); 
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 模拟网络延迟
    setTimeout(() => {
        onSimulateLogin(username || email.split('@')[0]);
        setShowAuth(null);
        setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FEF9E7] font-nunito overflow-x-hidden relative">
      <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-3">
           <div className="w-14 h-14 flex items-center justify-center">
              <img 
                src="https://www.imgur.la/images/2025/12/23/kou-78c16aa6b8bf268e.png" 
                alt="EduRealm IP" 
                className="w-full h-full object-contain drop-shadow-sm" 
              />
           </div>
           <span className="text-3xl font-extrabold text-stone-700 tracking-tight hidden md:block">EduRealm</span>
        </div>
        
        <div className="flex items-center gap-2">
             <Button onClick={() => setShowAuth('login')} variant="ghost" className="text-stone-600 font-extrabold shadow-none border-none">登录</Button>
             <Button onClick={() => setShowAuth('signup')} variant="secondary" className="px-6 py-2 text-sm shadow-sm border-stone-200">免费注册</Button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8 gap-8">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6 order-2 md:order-1 z-20 max-w-2xl">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-amber-600 rounded-full font-black text-sm mb-2 border-2 border-amber-100 shadow-sm animate-fade-in-up">
              <span className="animate-pulse">✨</span> 学习不是背诵 · 是沉浸与推理
           </div>
           <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-stone-800 leading-[1.1] tracking-tight">
             进入知识的 <br/>
             <span className="text-amber-500 inline-block transform -rotate-2 origin-bottom-left decoration-wavy underline decoration-4 decoration-amber-200">故事世界</span>
           </h1>
           <p className="text-xl text-stone-500 font-bold max-w-lg leading-relaxed">
             把课堂变成一场冒险剧场！带上你的AI伙伴球球，在沉浸式的剧情中探索真理，用推理化解难题。
           </p>
           
           <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto pt-4">
               <Button onClick={onStart} variant="accent" className="w-full md:w-auto text-xl py-5 px-12 uppercase tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                  开启冒险之旅
               </Button>
           </div>

           <div className="grid grid-cols-3 gap-6 pt-8 w-full border-t-2 border-amber-100 mt-8">
               {[
                   {icon: <Scroll size={28}/>, txt: '沉浸剧情', sub: '全学科情境'},
                   {icon: <Sparkles size={28}/>, txt: '逻辑推理', sub: '拒绝死记硬背'},
                   {icon: <Bot size={28}/>, txt: 'AI 球球', sub: '首席探险搭子'}
               ].map((f, i) => (
                   <div key={i} className="flex flex-col items-center md:items-start gap-2 text-stone-500 group cursor-pointer hover:text-amber-600 transition-colors">
                       <div className="w-14 h-14 rounded-2xl bg-white border-2 border-stone-100 flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-110 transition-transform group-hover:border-amber-200 group-hover:bg-amber-50">
                           {f.icon}
                       </div>
                       <div className="flex flex-col items-center md:items-start">
                            <span className="text-sm font-black text-stone-700">{f.txt}</span>
                            <span className="text-[10px] font-bold text-stone-400 hidden md:block">{f.sub}</span>
                       </div>
                   </div>
               ))}
           </div>
        </div>

        <div className="flex-1 flex justify-center md:justify-end order-1 md:order-2 relative w-full h-[400px] md:h-[600px] select-none pointer-events-none">
           <div className="absolute top-1/2 left-1/2 md:left-[60%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-amber-200 rounded-full opacity-20 blur-[80px] animate-pulse"></div>
           <ImageWithFallback 
              src="https://www.imgur.la/images/2025/12/23/kou-_20251222204439_656_105.png"
              alt="EduRealm IP Hamster" 
              className="relative z-10 h-[80%] w-auto object-contain drop-shadow-2xl animate-float"
           />
           <div className="absolute top-[10%] right-[10%] md:right-[20%] bg-white p-4 rounded-3xl rounded-bl-none shadow-xl border-4 border-amber-100 animate-bounce z-20 max-w-[200px] transform rotate-3 origin-bottom-left">
                <p className="text-sm font-black text-amber-800 text-center leading-tight">
                    我是学伴球球，咱们去故事里“历险”吧！吱！
                </p>
           </div>
        </div>
      </main>

      {/* Auth Modal (Mocked) */}
      {showAuth && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-md animate-fade-in">
              <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border-4 border-amber-100 overflow-hidden animate-scale-up">
                  <div className="p-8">
                      <div className="flex justify-between items-center mb-8">
                          <h3 className="text-2xl font-black text-stone-800 tracking-tight">
                              {showAuth === 'login' ? '欢迎回来' : '开启新冒险'}
                          </h3>
                          <button onClick={() => setShowAuth(null)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                              <X size={24} className="text-stone-300" />
                          </button>
                      </div>
                      <form onSubmit={handleAuth} className="space-y-6">
                          <div className="space-y-4">
                              {showAuth === 'signup' && (
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                                    <input 
                                      type="text" 
                                      required
                                      placeholder="你的探险昵称"
                                      value={username}
                                      onChange={(e) => setUsername(e.target.value)}
                                      className="w-full pl-12 pr-6 py-4 bg-stone-50 border-2 border-stone-100 rounded-2xl outline-none focus:border-amber-400 focus:bg-white transition-all font-bold"
                                    />
                                </div>
                              )}
                              <div className="relative">
                                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                                  <input 
                                    type="email" 
                                    required
                                    placeholder="电子邮箱"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-stone-50 border-2 border-stone-100 rounded-2xl outline-none focus:border-amber-400 focus:bg-white transition-all font-bold"
                                  />
                              </div>
                              <div className="relative">
                                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                                  <input 
                                    type="password" 
                                    required
                                    minLength={6}
                                    placeholder="密码 (至少6位)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-stone-50 border-2 border-stone-100 rounded-2xl outline-none focus:border-amber-400 focus:bg-white transition-all font-bold"
                                  />
                              </div>
                          </div>
                          <Button 
                            disabled={loading}
                            className="w-full py-4 text-lg font-black shadow-lg"
                          >
                              {loading ? '同步中...' : (showAuth === 'login' ? '立即登录' : '立即注册')}
                          </Button>
                      </form>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default LandingPage;
