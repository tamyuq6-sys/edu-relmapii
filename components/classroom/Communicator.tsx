
import React from 'react';
import { Users, MicOff, Mic, Send, Sparkles, LogOut, History, Lightbulb } from 'lucide-react';
import Avatar from '../Avatar';
import { Message, Participant, TimelineEvent, ThemeConfig } from '../../types';

interface CommunicatorProps {
  participants: Participant[];
  rightTab: 'chat' | 'timeline';
  setRightTab: (tab: 'chat' | 'timeline') => void;
  messages: Message[];
  timeline: TimelineEvent[];
  theme: ThemeConfig;
  input: string;
  setInput: (val: string) => void;
  onSendMessage: () => void;
  onToggleRecording: () => void;
  isRecording: boolean;
  isLoadingAI: boolean;
  speakingParticipantId: string | null;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  timelineEndRef: React.RefObject<HTMLDivElement | null>;
  roleAvatar: string;
  roleName: string;
  onExit: () => void;
}

const Communicator: React.FC<CommunicatorProps> = ({ 
  participants, rightTab, setRightTab, messages, timeline, theme, 
  input, setInput, onSendMessage, onToggleRecording, isRecording, 
  isLoadingAI, speakingParticipantId, chatEndRef, timelineEndRef,
  roleAvatar, roleName, onExit
}) => {
  const t = theme;

  return (
    <div className={`w-[360px] shrink-0 flex flex-col ${t.panelBg} ${t.panelBorder} border ${t.borderRadius} shadow-2xl overflow-hidden`}>
        {/* 1. Teammates Row */}
        <div className="h-20 shrink-0 border-b border-stone-200/50 bg-white/40 backdrop-blur-md flex items-center px-4 gap-3 overflow-x-auto scrollbar-hide">
             <div className="shrink-0 flex flex-col items-center justify-center mr-2">
                 <Users size={18} className="text-stone-400 mb-1"/>
                 <span className="text-[10px] font-black text-stone-400 uppercase">队友</span>
             </div>
             {participants.map(p => (
                 <div key={p.id} className="relative group shrink-0 cursor-help">
                     <Avatar 
                        char={p.avatar} 
                        size="sm" 
                        isSpeaking={speakingParticipantId === p.id}
                        className="border-2 border-white shadow-sm w-10 h-10"
                     />
                     {p.isAi && <span className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-[8px] font-black px-1 rounded border border-white">AI</span>}
                     <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-stone-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                         {p.name}
                     </div>
                 </div>
             ))}
        </div>

        {/* 2. Tabs */}
        <div className="flex border-b border-stone-200/50 bg-white/20 shrink-0">
            <button 
              onClick={() => setRightTab('chat')}
              className={`flex-1 py-3 text-sm font-black transition-colors border-b-2 
                  ${rightTab === 'chat' ? `border-amber-400 ${t.textPrimary}` : 'border-transparent text-stone-400 hover:bg-white/30'}`}
            >
                讨论
            </button>
            <button 
              onClick={() => setRightTab('timeline')}
              className={`flex-1 py-3 text-sm font-black transition-colors border-b-2 
                  ${rightTab === 'timeline' ? `border-amber-400 ${t.textPrimary}` : 'border-transparent text-stone-400 hover:bg-white/30'}`}
            >
                日志
            </button>
        </div>

        {/* 3. Content Area */}
        <div className="flex-1 relative bg-white/40 min-h-0">
            {rightTab === 'chat' ? (
                <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                         {messages.map((msg) => {
                             const isMe = msg.sender === 'user';
                             const isSystem = msg.sender === 'system';
                             if (isSystem) return (
                                 <div key={msg.id} className="text-center my-4">
                                     <span className="bg-stone-200/50 text-stone-500 text-[10px] font-bold px-3 py-1 rounded-full">{msg.content}</span>
                                 </div>
                             );
                             return (
                                 <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} group animate-slide-up`}>
                                     <Avatar char={msg.avatar || (msg.sender === 'ai' ? '🐹' : roleAvatar)} size="xs" className="mt-1 shadow-sm"/>
                                     <div className={`max-w-[85%]`}>
                                          <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                              <span className="text-[10px] font-black text-stone-500">{msg.senderName}</span>
                                          </div>
                                          <div className={`p-3 rounded-2xl text-sm font-bold shadow-sm ${isMe ? `${t.chatUserBg} ${t.chatUserText} rounded-tr-none` : `${t.chatAiBg} ${t.chatAiText} border border-stone-100 rounded-tl-none`}`}>
                                              {msg.content}
                                          </div>
                                     </div>
                                 </div>
                             );
                         })}
                         {isLoadingAI && (
                             <div className="flex items-center gap-2 text-xs text-stone-400 ml-12 animate-pulse">
                                 <Sparkles size={12}/> 思考中...
                             </div>
                         )}
                         <div ref={chatEndRef} />
                    </div>
                    <div className="p-3 bg-white/60 border-t border-stone-200/50 backdrop-blur-sm shrink-0">
                         <div className="flex items-end gap-2 bg-white p-1.5 rounded-xl border border-stone-200 focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-100 transition-all shadow-sm">
                              <button onClick={onToggleRecording} className={`p-2 rounded-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-stone-400 hover:bg-stone-100'}`}>
                                  {isRecording ? <MicOff size={18}/> : <Mic size={18}/>}
                              </button>
                              <textarea 
                                 value={input}
                                 onChange={(e) => setInput(e.target.value)}
                                 onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSendMessage(); } }}
                                 placeholder="输入消息..."
                                 className="flex-1 bg-transparent border-none outline-none resize-none text-stone-800 text-sm font-bold h-9 py-2 custom-scrollbar"
                              />
                              <button onClick={onSendMessage} className={`p-2 rounded-lg text-white shadow-sm transition-transform active:scale-95 ${t.buttonPrimary}`}>
                                  <Send size={16}/>
                              </button>
                         </div>
                    </div>
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <div className="flex items-center gap-2">
                            <History size={16} className="text-stone-400"/>
                            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">探险日志</span>
                        </div>
                        <button 
                            onClick={onExit}
                            className="flex items-center gap-1 text-[10px] font-black text-red-500 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded-xl border border-red-100 shadow-sm active:scale-95"
                        >
                            <LogOut size={12}/> 退出剧本
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        <div className="relative border-l-2 border-stone-300/30 ml-2 space-y-6 pb-4">
                            {timeline.map((event) => (
                                <div key={event.id} className="relative pl-6 group">
                                    <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#fdfbf7]/50 z-10 
                                        ${event.type === 'plot' ? 'bg-purple-500' : event.type === 'task' ? 'bg-green-500' : event.type === 'insight' ? 'bg-amber-400' : 'bg-blue-500'}
                                    `}></div>
                                    <span className="text-[10px] font-mono text-stone-400 mb-1 block">{event.time}</span>
                                    
                                    {event.type === 'insight' ? (
                                        <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl shadow-sm animate-scale-up">
                                            <h4 className="text-[10px] font-black text-amber-600 uppercase mb-1 flex items-center gap-1">
                                                <Lightbulb size={10} className="fill-current"/> 思路火花
                                            </h4>
                                            <p className="text-xs font-black text-amber-900 leading-relaxed italic">“ {event.description} ”</p>
                                        </div>
                                    ) : (
                                        <>
                                            <h4 className={`text-sm font-black ${t.textPrimary} mb-1`}>{event.title}</h4>
                                            <p className="text-xs text-stone-500 bg-white/50 p-2 rounded border border-stone-100/50">{event.description}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div ref={timelineEndRef} />
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Communicator;
