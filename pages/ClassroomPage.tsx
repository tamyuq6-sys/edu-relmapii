import React, { useState, useEffect, useRef } from 'react';
import { X, History, Shield, BookOpen, CheckCircle } from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import { Script, Role, Message, Clue, Task, Participant, TimelineEvent } from '../types';
import { generateDMResponse, generateDiscussionHighlight } from '../services/geminiService';

// 子组件引入
import IntroStage from '../components/classroom/IntroStage';
import RoleCardModal from '../components/classroom/RoleCardModal';
import AgentHeader from '../components/classroom/AgentHeader';
import TaskBoard from '../components/classroom/TaskBoard';
import EvidenceRack from '../components/classroom/EvidenceRack';
import Communicator from '../components/classroom/Communicator';

enum ClassroomStage {
    INTRO = 'INTRO',
    ROLE_REVIEW = 'ROLE_REVIEW',
    GAMEPLAY = 'GAMEPLAY',
    PLOT_PLAYBACK = 'PLOT_PLAYBACK'
}

export const ClassroomPage = ({ script, role, participants, onFinish, onExit }: { script: Script, role: Role, participants: Participant[], onFinish: (transcript: string[]) => void, onExit: () => void }) => {
  const [stage, setStage] = useState<ClassroomStage>(script.introSlides?.length ? ClassroomStage.INTRO : ClassroomStage.ROLE_REVIEW);
  
  // Theme Helper
  const t = script.theme;
  
  // Game State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [clues, setClues] = useState<Clue[]>(script.clues.map(c => ({...c, isNew: false})));
  const [tasks, setTasks] = useState<Task[]>(script.tasks);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [rightTab, setRightTab] = useState<'chat' | 'timeline'>('chat');
  const [currentIntroSlide, setCurrentIntroSlide] = useState(0);

  // Plot State
  const [currentPlotText, setCurrentPlotText] = useState(script.initialScenario);
  const [plotOverlayText, setPlotOverlayText] = useState('');
  const [plotOverlayVideo, setPlotOverlayVideo] = useState<string | undefined>(undefined);
  const [plotHistory, setPlotHistory] = useState<string[]>([script.initialScenario]);
  const [showPlotHistory, setShowPlotHistory] = useState(false);
  
  // Modals
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [showRoleCard, setShowRoleCard] = useState(false);
  const [showPersonalTasks, setShowPersonalTasks] = useState(false);

  // Task Inputs
  const [puzzleAnswer, setPuzzleAnswer] = useState('');

  // Audio & Animation State
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [speakingParticipantId, setSpeakingParticipantId] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timelineEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const mainTasks = tasks.filter(task => task.category === 'main');
  const activeMainTask = mainTasks.find(t => !t.isCompleted);
  const personalTasks = tasks.filter(task => task.category === 'personal' && task.assigneeId === role.id);
  const incompletePersonalCount = personalTasks.filter(t => !t.isCompleted).length;

  // --- Logic Initialization ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'zh-CN';
        recognitionRef.current.onresult = (event: any) => {
            setInput(prev => prev + event.results[0][0].transcript);
            setIsRecording(false);
        };
        recognitionRef.current.onerror = () => setIsRecording(false);
    }
  }, []);

  useEffect(() => {
    if (stage === ClassroomStage.GAMEPLAY && messages.length === 0) {
      setMessages([{ id: 'init', sender: 'system', senderName: '探险日志', content: script.initialScenario, timestamp: new Date() }]);
      addToTimeline('plot', '新的开始', script.initialScenario);
    }
  }, [stage]);

  // --- Handlers ---
  const addToTimeline = (type: TimelineEvent['type'], title: string, description: string) => {
      setTimeline(prev => [...prev, { id: Date.now().toString(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), type, title, description }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userText = input;
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', senderName: role.name, content: userText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setSpeakingParticipantId('user-me');
    setInput('');
    setIsLoadingAI(true);
    
    try {
        const historyForAI = messages.slice(-5).map(m => ({ role: m.sender === 'user' ? 'user' : 'model', text: `[${m.senderName}]: ${m.content}` }));
        const context = `当前探险场景: ${currentPlotText}. 你的身份: 学伴球球. 当前扮演队友: ${role.name}.`;
        const aiResponseText = await generateDMResponse(context, userText, historyForAI);
        
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', senderName: '学伴球球', content: aiResponseText, timestamp: new Date() }]);
        setSpeakingParticipantId('dm-hamster');

        // 异步提取思路火花，记录到日志区
        generateDiscussionHighlight(userText, aiResponseText).then(highlight => {
            if (highlight) {
                addToTimeline('insight', '思路火花', highlight);
            }
        });

    } finally {
        setIsLoadingAI(false);
        setTimeout(() => setSpeakingParticipantId(null), 3000);
    }
  };

  const handleTaskSubmit = (taskId: string, answer?: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      if (task.type !== 'discussion') {
          if (task.correctAnswer && answer !== task.correctAnswer && !answer?.includes(task.correctAnswer)) {
              alert("吱！好像不对劲，咱们再翻翻手头的线索？");
              return;
          }
      }

      const updatedTasks = tasks.map(t => t.id === taskId ? {...t, isCompleted: true} : t);
      setTasks(updatedTasks);
      addToTimeline('task', '解决难题', `成功：${task.title}`);
      
      if (task.rewardClueId) {
          const rewardIds = task.rewardClueId.split(',').map(id => id.trim());
          const newlyFoundClues = clues.filter(c => rewardIds.includes(c.id) && !c.isFound);
          newlyFoundClues.forEach(nc => addToTimeline('clue', '获得线索', nc.title));
          setClues(prev => prev.map(c => rewardIds.includes(c.id) ? {...c, isFound: true, isNew: !c.isFound} : c));
      }

      const hasPlotUpdate = task.plotUpdate !== undefined || !!task.video;

      if (hasPlotUpdate) {
          setPlotOverlayText(task.plotUpdate || '');
          setPlotOverlayVideo(task.video);
          setStage(ClassroomStage.PLOT_PLAYBACK);
          if (task.plotUpdate) {
              setCurrentPlotText(task.plotUpdate);
              setPlotHistory(prev => [...prev, task.plotUpdate!]);
          }
          if (task.category === 'personal') setShowPersonalTasks(false);
      }
  };

  const handleOpenClue = (clue: Clue) => {
     setActiveClue(clue);
     setClues(prev => prev.map(c => c.id === clue.id ? {...c, isNew: false} : c));
  };

  const dismissPlotPlayback = () => {
    setStage(ClassroomStage.GAMEPLAY);
    setPlotOverlayText('');
    setPlotOverlayVideo(undefined);
  };

  const handleStartQuiz = () => {
    const transcript = messages.map(m => `[${m.senderName}]: ${m.content}`);
    onFinish(transcript);
  };

  // --- Render ---
  if (stage === ClassroomStage.INTRO) return <IntroStage script={script} currentSlide={currentIntroSlide} onNext={() => setCurrentIntroSlide(s => s + 1)} onFinish={() => setStage(ClassroomStage.ROLE_REVIEW)} theme={t} />;
  
  if (stage === ClassroomStage.ROLE_REVIEW) return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{backgroundImage: `url(${script.backgroundImage})`, backgroundSize: 'cover'}}>
           <div className={`absolute inset-0 ${t.appBgOverlay} backdrop-blur-[5px]`}></div>
           <RoleCardModal role={role} theme={t} isInitial onAccept={() => setStage(ClassroomStage.GAMEPLAY)} />
      </div>
  );

  return (
    <div className={`h-screen w-screen flex ${t.fontFamily} overflow-hidden bg-stone-900 relative`}>
      <div className="fixed inset-0 z-0"><ImageWithFallback src={script.backgroundImage} className="w-full h-full object-cover scale-105"/><div className={`absolute inset-0 ${t.appBgOverlay} backdrop-blur-[20px]`}></div></div>

      <div className="relative z-10 flex w-full h-full p-4 md:p-6 gap-6">
        <div className="flex-1 flex flex-col min-w-0 gap-4">
            <AgentHeader role={role} currentPlotText={currentPlotText} theme={t} onShowRoleCard={() => setShowRoleCard(true)} onShowPlotHistory={() => setShowPlotHistory(true)} />
            <TaskBoard 
              activeMainTask={activeMainTask} 
              theme={t} 
              puzzleAnswer={puzzleAnswer} 
              setPuzzleAnswer={setPuzzleAnswer} 
              onTaskSubmit={handleTaskSubmit} 
              onStartQuiz={handleStartQuiz}
            />
            <EvidenceRack clues={clues} theme={t} onOpenPersonalTasks={() => setShowPersonalTasks(true)} onOpenClue={handleOpenClue} incompletePersonalCount={incompletePersonalCount} />
        </div>

        <Communicator 
            participants={participants} rightTab={rightTab} setRightTab={setRightTab} messages={messages} timeline={timeline} theme={t} 
            input={input} setInput={setInput} onSendMessage={handleSendMessage} onToggleRecording={() => { if(isRecording) recognitionRef.current?.stop(); else { setIsRecording(true); recognitionRef.current?.start(); } }} 
            isRecording={isRecording} isLoadingAI={isLoadingAI} speakingParticipantId={speakingParticipantId} chatEndRef={chatEndRef} timelineEndRef={timelineEndRef} 
            roleAvatar={role.avatar} roleName={role.name} onExit={onExit}
        />
      </div>

      {showPersonalTasks && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowPersonalTasks(false)}>
              <div className={`w-full max-w-lg ${t.panelBg} ${t.borderRadius} ${t.panelBorder} border-2 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-up relative`} onClick={e => e.stopPropagation()}>
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                  <div className="p-5 border-b border-black/5 flex justify-between items-center"><h3 className="text-xl font-black text-purple-900">你的专属密函</h3><button onClick={() => setShowPersonalTasks(false)}><X/></button></div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white/80">
                      {personalTasks.length > 0 ? personalTasks.map(task => (
                          <div key={task.id} className={`p-4 rounded-xl border-2 ${task.isCompleted ? 'bg-stone-50 border-stone-200' : 'bg-white border-purple-200 shadow-md'}`}>
                               <h4 className={`font-extrabold mb-2 ${task.isCompleted ? 'text-stone-400' : 'text-stone-800'}`}>{task.title}</h4>
                               <p className={`text-sm mb-4 ${task.isCompleted ? 'text-stone-300' : 'text-stone-600'}`}>{task.description}</p>
                               {!task.isCompleted ? (
                                   <div className="space-y-3">
                                       {task.type === 'choice' && task.options ? (
                                           <div className="grid grid-cols-1 gap-2">
                                               {task.options.map((opt, i) => (
                                                   <button 
                                                       key={i} 
                                                       onClick={() => handleTaskSubmit(task.id, i.toString())}
                                                       className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 border-2 border-purple-100 text-purple-800 text-sm font-bold rounded-xl transition-all active:scale-95"
                                                   >
                                                       <span className="inline-block w-6 h-6 rounded-lg bg-purple-200 text-purple-700 text-center text-xs mr-3 leading-6">{['A','B','C','D'][i]}</span>
                                                       {opt}
                                                   </button>
                                               ))}
                                           </div>
                                       ) : (
                                           <button onClick={() => handleTaskSubmit(task.id)} className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-black rounded-xl shadow-lg shadow-purple-200 transition-all active:scale-95">确认执行</button>
                                       )}
                                   </div>
                               ) : (
                                   <div className="flex items-center gap-2 text-green-500 font-black text-sm pt-2">
                                       <CheckCircle size={16}/> 秘密任务达成
                                   </div>
                               )}
                          </div>
                      )) : <div className="text-center py-12 opacity-50"><Shield size={48} className="mx-auto mb-2"/>暂无专属任务</div>}
                  </div>
              </div>
          </div>
      )}

      {activeClue && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setActiveClue(null)}>
              <div className={`bg-white w-full max-w-md ${t.borderRadius} overflow-hidden shadow-2xl animate-scale-up border-4 border-white`} onClick={e => e.stopPropagation()}>
                  <div className="p-6">
                      <div className="flex justify-between items-start mb-4"><h3 className="text-xl font-extrabold">{activeClue.type === 'history' ? '📜 历史碎片' : '🔍 线索细节'}</h3><button onClick={() => setActiveClue(null)}><X/></button></div>
                      {activeClue.image && <ImageWithFallback src={activeClue.image} className="w-full h-48 object-cover rounded-xl mb-4"/>}
                      <h4 className="text-lg font-black text-amber-600 mb-2">{activeClue.title}</h4>
                      <p className="text-stone-600 font-bold text-sm bg-stone-50 p-4 rounded-xl mb-4">{activeClue.content}</p>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <h5 className="text-xs font-black text-blue-500 mb-2 flex items-center gap-1"><BookOpen size={14}/> 球球的解读</h5>
                          <p className="text-blue-900/80 font-bold text-sm">{activeClue.knowledgeDetail}</p>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {showRoleCard && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"><RoleCardModal role={role} theme={t} onClose={() => setShowRoleCard(false)} /></div>}

      {showPlotHistory && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPlotHistory(false)}>
              <div className={`bg-white w-full max-w-lg ${t.borderRadius} p-6 shadow-2xl animate-scale-up max-h-[80vh] flex flex-col`} onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-extrabold"><History/> 探险回忆</h3><button onClick={() => setShowPlotHistory(false)}><X/></button></div>
                  <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                      {plotHistory.map((text, i) => <div key={i} className="bg-stone-50 p-4 rounded-xl border border-stone-100 text-stone-600 font-bold text-sm leading-relaxed">{text}</div>)}
                  </div>
              </div>
          </div>
      )}

      {stage === ClassroomStage.PLOT_PLAYBACK && (
          <div 
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-pointer overflow-hidden" 
            onClick={dismissPlotPlayback}
          >
              {plotOverlayVideo ? (
                  <div className="w-full h-full relative">
                      <video 
                        src={plotOverlayVideo} 
                        autoPlay 
                        className="w-full h-full object-cover"
                        onEnded={dismissPlotPlayback}
                      />
                      {plotOverlayText && (
                        <div className="absolute inset-x-0 bottom-0 p-12 md:p-16 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col items-center">
                            <p className="text-2xl md:text-4xl font-black text-white leading-relaxed tracking-wide text-center max-w-4xl drop-shadow-2xl">
                                “ {plotOverlayText} ”
                            </p>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] mt-8 animate-pulse">点击画面继续历险</p>
                        </div>
                      )}
                  </div>
              ) : (
                  <div className="max-w-3xl text-center space-y-8 animate-fade-in-up p-8">
                      <span className="text-amber-400 text-6xl">✨</span>
                      <p className="text-2xl md:text-4xl font-bold text-white leading-relaxed tracking-wide">“ {plotOverlayText} ”</p>
                      <p className="text-white/30 text-xs font-bold uppercase animate-pulse mt-12">点击任意处继续我们的旅程</p>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};
