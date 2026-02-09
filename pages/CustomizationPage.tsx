import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Sparkles, Brain, Loader2, AlertCircle, ChevronRight, Zap, BookOpen, FlaskConical, ChevronDown, Check, ChevronUp, Cpu, Bug } from 'lucide-react';
import Avatar from '../components/Avatar';
import { analyzeCurriculumMaterial, generateOutline, finalizeScriptFromScheme, generateRoleFunctions, generateQuizzesForScript } from '../services/customizationService';
import { Script, CurriculumInfo, DesignScheme, QuizQuestion, ScriptScene } from '../types';
import { THEME_SILK_ROAD } from '../data/themes';

// Step Components
import StepIndicator from '../components/customization/StepIndicator';
import StepUpload from '../components/customization/StepUpload';
import StepCurriculum from '../components/customization/StepCurriculum';
import StepDesignScheme from '../components/customization/StepDesignScheme';
import StepRoles from '../components/customization/StepRoles';
import StepReview from '../components/customization/StepReview';
import StepQuizGeneration from '../components/customization/StepQuizGeneration';

export enum CustomStep {
  UPLOAD = 'UPLOAD',
  CURRICULUM = 'CURRICULUM',
  SCHEME = 'SCHEME',
  ROLES = 'ROLES',
  REVIEW = 'REVIEW',
  QUIZ_GEN = 'QUIZ_GEN'
}

const ENGINE_OPTIONS = [
  { id: 'gemini-3-flash', name: 'GEMINI 3 FLASH PREVIEW', desc: '极速响应，适合快速生成初稿' },
  { id: 'gemini-3-pro', name: 'GEMINI 3 PRO PREVIEW', desc: '深度逻辑，适合文学性创作' },
  { id: 'gemini-2.5-pro', name: 'GEMINI 2.5 PRO', desc: '综合实力强劲，稳定输出' },
  { id: 'gemini-2.5-flash', name: 'GEMINI 2.5 FLASH', desc: '高效轻量，适合大规模生成' },
];

// --- 开发者模式模拟数据 ---
const DEV_MOCK_CURRICULUM: CurriculumInfo = {
  subject: '历史',
  grade: '七年级',
  version: '人教版',
  unit: '模拟单元：盛唐气象',
  knowledgePoints: ['文成公主入藏', '开元盛世的繁荣', '唐诗的发展', '中外文化交流'],
  coreCompetencies: ['时空观念', '史料实证', '家国情怀'],
  teachingFocus: '通过沉浸式体验感受盛唐在经济、文化及民族关系上的开放与包容。',
  teachingDifficulty: '理解盛唐气象背后的制度支撑与文化心理。'
};

const DEV_MOCK_SCHEME: DesignScheme = {
  positioning: '长安幻夜：失落的遣唐使',
  teacherInstructions: '引导学生观察盛唐都市生活细节，通过解谜掌握关键史实。',
  acts: [
    { id: 'a1', title: '西市惊魂', plotLogic: '遣唐使在闹市失踪，留下异国信件。', knowledgePoint: '盛唐商业繁荣', assessmentContent: '识别西市物品来源', duration: 15 },
    { id: 'a2', title: '大明宫词', plotLogic: '入宫寻找线索，涉及宫廷礼仪。', knowledgePoint: '政治制度与对外交流', assessmentContent: '理解朝贡体系', duration: 20 }
  ],
  overallLogic: '以遣唐使失踪为线索，串联起唐朝的商业、政治与文化知识点。',
  cognitiveRoles: [
    { id: 'cr1', roleName: '大理寺司直', emoji: '⚖️', roleDescription: '冷静睿智的断案官', cognitiveFunction: '逻辑推理与法律视角', knowledgeResponsibility: '掌握唐律知识', collaborationValue: '组织证据链' },
    { id: 'cr2', roleName: '遣唐使随员', emoji: '🌸', roleDescription: '远渡重洋的学习者', cognitiveFunction: '异域观察与文化对比', knowledgeResponsibility: '掌握交流史实', collaborationValue: '提供跨文化视角' }
  ]
};

const DEV_MOCK_GAMEPLAY = {
  scenes: [
    {
      id: 's1', actId: 'a1', title: '西市繁华', summary: '在人声鼎沸的西市展开调查', 
      narrative: '长安西市，万商云集。你站在波斯地毯与中原丝绸的交界处，空气中弥漫着香料的味道...',
      assetType: 'image', assetDescription: '繁华的唐代集市场景', assetPrompt: 'Cyberpunk Tang Dynasty marketplace, crowded, vibrant lanterns, hyper-realistic',
      assetUrl: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1200',
      generationOptions: { styles: ['古风', '写实'], resolutions: ['1080P', '4K'] },
      tasks: [
        { id: 't1', title: '商品辨析', description: '从下列货物中找出不属于西市常见大宗贸易的物品。', mission: '识别盛唐贸易物产', type: 'choice', options: ['丝绸', '胡椒', '土豆', '茶叶'], correctAnswer: '2', knowledgePoint: '唐代中外贸易', isCompleted: false, requiredForPlot: true }
      ],
      clues: [
        { id: 'c1', title: '神秘的波斯信件', content: '信上提到了一个名为“青龙寺”的地方。', type: 'plot', isFound: true, knowledgeDetail: '青龙寺是当时著名的文化交流中心。', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300' }
      ],
      associatedRoleIds: ['cr1', 'cr2'],
      isEdited: false
    }
  ]
};

const DEV_MOCK_QUIZZES: QuizQuestion[] = [
  { id: 1, type: 'choice', question: '唐朝长安城中，主要的商业活动集中在哪个区域？', options: ['东市和西市', '朱雀大街', '大明宫', '曲江池'], correctAnswer: 0, explanation: '唐朝长安城实行坊市制，商业活动集中在东市和西市。' }
];

const CustomizationPage: React.FC<{ onCancel: () => void, onComplete: (script: Script) => void }> = ({ onCancel, onComplete }) => {
  const [step, setStep] = useState<CustomStep>(CustomStep.UPLOAD);
  const [isDevMode, setIsDevMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [engineId, setEngineId] = useState('gemini-3-flash');
  const [isEngineDropdownOpen, setIsEngineDropdownOpen] = useState(false);
  const engineDropdownRef = useRef<HTMLDivElement>(null);

  // 状态数据
  const [metadata, setMetadata] = useState({ subject: '历史', grade: '七年级', version: '人教版' });
  const [materialText, setMaterialText] = useState('');
  const [curriculum, setCurriculum] = useState<CurriculumInfo | null>(null);
  const [config, setConfig] = useState({ style: '悬疑探秘', duration: 45, notes: '' });
  const [scheme, setScheme] = useState<DesignScheme | null>(null);
  const [gameplay, setGameplay] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (engineDropdownRef.current && !engineDropdownRef.current.contains(event.target as Node)) {
        setIsEngineDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 开发者模式跳转逻辑
  const handleStepJump = (targetStep: CustomStep) => {
    if (!isDevMode) return;
    
    // 如果跳转到需要数据的步骤，自动注入 Mock 数据
    if (targetStep !== CustomStep.UPLOAD && !curriculum) setCurriculum(DEV_MOCK_CURRICULUM);
    if (targetStep === CustomStep.SCHEME || targetStep === CustomStep.ROLES) {
        if (!scheme) setScheme(DEV_MOCK_SCHEME);
    }
    if (targetStep === CustomStep.REVIEW && !gameplay) setGameplay(DEV_MOCK_GAMEPLAY);
    if (targetStep === CustomStep.QUIZ_GEN && quizzes.length === 0) setQuizzes(DEV_MOCK_QUIZZES);
    
    setStep(targetStep);
  };

  const handleAnalyze = async (instructions: string) => {
    setIsLoading(true);
    const result = await analyzeCurriculumMaterial(materialText, instructions, metadata, engineId);
    // 核心修正：合并元数据，确保学科分类不丢失
    setCurriculum({
      ...result,
      subject: metadata.subject,
      grade: metadata.grade,
      version: metadata.version
    });
    setStep(CustomStep.CURRICULUM);
    setIsLoading(false);
  };

  const handleGenerateOutline = async () => {
    if (!curriculum) return;
    setIsLoading(true);
    const result = await generateOutline(curriculum, config, engineId);
    setScheme(result);
    setStep(CustomStep.SCHEME);
    setIsLoading(false);
  };

  const handleGenerateRoles = async (updatedScheme: DesignScheme) => {
    if (!curriculum) return;
    setIsLoading(true);
    const result = await generateRoleFunctions(curriculum, updatedScheme, engineId);
    setScheme(result);
    setStep(CustomStep.ROLES);
    setIsLoading(false);
  };

  const handleRenderFullScript = async () => {
    if (!curriculum || !scheme) return;
    setIsLoading(true);
    const result = await finalizeScriptFromScheme(curriculum, scheme, engineId);
    setGameplay(result);
    setStep(CustomStep.REVIEW);
    setIsLoading(false);
  };

  const handleGenerateQuizzes = async () => {
    if (!curriculum || !gameplay) return;
    setIsLoading(true);
    const result = await generateQuizzesForScript(curriculum, gameplay, engineId);
    setQuizzes(result);
    setStep(CustomStep.QUIZ_GEN);
    setIsLoading(false);
  };

  const handlePublish = (finalQuizzes: QuizQuestion[]) => {
    if (!curriculum || !scheme || !gameplay) return;

    const newScript: Script = {
      id: `custom_${Date.now()}`,
      title: scheme.positioning,
      theme: THEME_SILK_ROAD,
      curriculum: curriculum,
      duration: config.duration,
      minPlayers: scheme.cognitiveRoles?.length || 4,
      maxPlayers: scheme.cognitiveRoles?.length || 6,
      difficulty: 3,
      description: scheme.overallLogic,
      roles: (scheme.cognitiveRoles || []).map(cr => ({
          id: cr.id,
          name: cr.roleName,
          avatar: cr.emoji,
          description: cr.roleDescription,
          objective: cr.collaborationValue,
          detailedProfile: cr.cognitiveFunction
      })),
      introSlides: [],
      initialScenario: gameplay.scenes?.[0]?.narrative || "故事开始了...",
      scenes: gameplay.scenes || [],
      tasks: (gameplay.scenes || []).flatMap((s: any) => s.tasks || []),
      clues: (gameplay.scenes || []).flatMap((s: any) => s.clues || []),
      quiz: finalQuizzes,
      coverImage: gameplay.scenes?.[0]?.assetUrl || 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=1200'
    };

    onComplete(newScript);
  };

  const activeEngine = ENGINE_OPTIONS.find(e => e.id === engineId) || ENGINE_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#FEF9E7] flex flex-col font-nunito overflow-x-hidden">
      {/* Header */}
      <header className="px-8 py-6 bg-white/40 backdrop-blur-md border-b border-stone-100 flex items-center justify-between z-50 sticky top-0">
        <div className="flex items-center gap-6">
          <button onClick={onCancel} className="p-3 hover:bg-stone-100 rounded-full transition-all text-stone-400">
            <ArrowLeft size={24}/>
          </button>
          <div>
            <h1 className="text-3xl font-black text-stone-800 tracking-tight">AI 剧本创作工坊</h1>
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mt-1">Edurealm Script Engine v2.5</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Custom Engine Selector */}
           <div className="relative" ref={engineDropdownRef}>
              <div 
                onClick={() => setIsEngineDropdownOpen(!isEngineDropdownOpen)}
                className={`bg-white border-2 px-6 py-2.5 rounded-2xl flex items-center gap-4 group cursor-pointer transition-all ${isEngineDropdownOpen ? 'border-amber-400 shadow-lg' : 'border-amber-100 hover:border-amber-400'}`}
              >
                  <Zap className={`text-amber-500 ${isEngineDropdownOpen ? 'animate-pulse' : ''}`} size={24}/>
                  <div className="flex flex-col">
                      <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">当前创作引擎</span>
                      <span className="font-black text-stone-800 text-sm uppercase tracking-tight">{activeEngine.name}</span>
                  </div>
                  {isEngineDropdownOpen ? <ChevronUp size={16} className="text-stone-300 ml-2" /> : <ChevronDown size={16} className="text-stone-300 ml-2" />}
              </div>

              {isEngineDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-stone-100 overflow-hidden py-4 animate-scale-up origin-top-right">
                  {ENGINE_OPTIONS.map((opt) => (
                    <div 
                      key={opt.id}
                      onClick={() => {
                        setEngineId(opt.id);
                        setIsEngineDropdownOpen(false);
                      }}
                      className={`px-8 py-5 flex items-center justify-between cursor-pointer transition-all group hover:bg-stone-50 ${engineId === opt.id ? 'bg-amber-50/30' : ''}`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className={`font-black text-sm uppercase tracking-tight ${engineId === opt.id ? 'text-amber-500' : 'text-stone-400 group-hover:text-amber-500'}`}>
                          {opt.name}
                        </span>
                        <span className="text-[10px] font-bold text-stone-300 group-hover:text-stone-400">
                          {opt.desc}
                        </span>
                      </div>
                      {engineId === opt.id && <Check size={20} className="text-stone-800" />}
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      </header>

      {/* Steps Indicator */}
      <div className="bg-[#FEF9E7] pt-8 sticky top-[92px] z-40">
        <StepIndicator step={step} isDevMode={isDevMode} onStepClick={handleStepJump} />
      </div>

      {/* Main Process Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-8 pb-32">
        <div className="bg-white/60 backdrop-blur-xl rounded-[4rem] border-4 border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-12 min-h-[600px] relative">
          
          {isLoading && (
            <div className="absolute inset-0 z-[100] bg-white/40 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-8 border-2 border-amber-100 scale-100 animate-scale-up">
                    <Avatar char="🐹" size="lg" isSpeaking />
                    <div className="flex items-center gap-4">
                        <Loader2 className="animate-spin text-amber-500" size={32}/>
                        <div className="flex flex-col">
                            <span className="font-black text-2xl text-stone-800 tracking-tight">球球正在同步设计...</span>
                            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-1">Multi-Modal Knowledge Synching</span>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {step === CustomStep.UPLOAD && (
            <StepUpload 
               metadata={metadata} 
               setMetadata={setMetadata} 
               materialText={materialText} 
               setMaterialText={setMaterialText} 
               onAnalyze={handleAnalyze} 
               config={config}
               setConfig={setConfig}
            />
          )}

          {step === CustomStep.CURRICULUM && curriculum && (
            <StepCurriculum 
               curriculum={curriculum} 
               onBack={() => setStep(CustomStep.UPLOAD)} 
               onNext={(updated) => {
                 setCurriculum(updated);
                 handleGenerateOutline();
               }} 
            />
          )}

          {step === CustomStep.SCHEME && scheme && (
            <StepDesignScheme 
               scheme={scheme} 
               onUpdate={setScheme} 
               onBack={() => setStep(CustomStep.CURRICULUM)} 
               onNext={handleGenerateRoles} 
            />
          )}

          {step === CustomStep.ROLES && scheme && (
            <StepRoles 
               scheme={scheme} 
               onUpdate={(roles) => setScheme({...scheme, cognitiveRoles: roles})} 
               onBack={() => setStep(CustomStep.SCHEME)} 
               onNext={handleRenderFullScript} 
            />
          )}

          {step === CustomStep.REVIEW && gameplay && (
            <StepReview 
               gameplay={gameplay} 
               onUpdateGameplay={setGameplay} 
               onBack={() => setStep(CustomStep.ROLES)} 
               onFinalize={handleGenerateQuizzes} 
            />
          )}

          {step === CustomStep.QUIZ_GEN && (
            <StepQuizGeneration 
               questions={quizzes} 
               onBack={() => setStep(CustomStep.REVIEW)} 
               onPublish={handlePublish} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomizationPage;