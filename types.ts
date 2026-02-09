export enum AppStage {
  LANDING = 'LANDING',
  SELECTION = 'SELECTION',
  LOBBY = 'LOBBY', 
  CLASSROOM = 'CLASSROOM',
  QUIZ = 'QUIZ',
  REPORT = 'REPORT',
  // Fix: Added CUSTOMIZATION to AppStage enum to resolve errors in App.tsx
  CUSTOMIZATION = 'CUSTOMIZATION'
}

export interface CurriculumInfo {
  subject: string;      
  version: string;      
  grade: string;        
  unit: string;         
  knowledgePoints: string[]; 
  coreCompetencies: string[]; 
  teachingFocus?: string; 
  teachingDifficulty?: string; 
}

export interface PlotSlide {
  image: string;
  video?: string;
  text: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  mission: string; 
  category: 'main' | 'personal'; 
  assigneeId?: string; 
  type: 'discussion' | 'puzzle' | 'choice' | 'matching'; 
  isCompleted: boolean;
  requiredForPlot: boolean; 
  image?: string; 
  video?: string; 
  options?: string[]; 
  correctAnswer?: string; 
  rewardClueId?: string; 
  plotUpdate?: string; 
  matchingData?: {
    items: string[];
    categories: string[];
  };
  // Fix: Added missing properties used in AI-generated scripts
  funPoint?: string;
  knowledgePoint?: string;
}

export interface ThemeConfig {
    id: string;
    fontFamily: string; 
    borderRadius: string; 
    appBgOverlay: string; 
    panelBg: string; 
    panelBorder: string; 
    textPrimary: string;
    textSecondary: string;
    textAccent: string;
    buttonPrimary: string; 
    chatUserBg: string;
    chatUserText: string;
    chatAiBg: string;
    chatAiText: string;
    chatAiBorder: string;
    timelineLine: string;
}

export interface Script {
  id: string;
  title: string;
  coverImage?: string; 
  backgroundImage?: string; 
  theme: ThemeConfig; 
  curriculum: CurriculumInfo; 
  duration: number; 
  minPlayers: number;
  maxPlayers: number;
  difficulty: number; 
  description: string;
  roles: Role[];
  introSlides: PlotSlide[]; 
  initialScenario: string;
  tasks: Task[]; 
  clues: Clue[];
  quiz: QuizQuestion[];
  // Fix: Added scenes property to Script interface to resolve "property does not exist" errors
  scenes?: ScriptScene[];
}

export interface Role {
  id: string;
  name: string;
  avatar: string;
  portraitLarge?: string; 
  description: string;
  objective: string;
  detailedProfile?: string; 
  isTaken?: boolean; 
}

export interface Clue {
  id: string;
  title: string;
  content: string;
  knowledgeDetail?: string; 
  type: 'history' | 'plot';
  isFound: boolean;
  isNew?: boolean; // 新增：标记是否为刚获得未查看
  image?: string; 
  // Fix: Added assetPrompt for customization use
  assetPrompt?: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  roleId: string;
  roleName: string;
  isAi: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system' | 'teammate';
  senderName: string;
  avatar?: string; 
  content: string;
  timestamp: Date;
}

export interface QuizQuestion {
  id: number;
  // Fix: Expanded type to include boolean and material-analysis to resolve type mismatch errors in StepQuizGeneration.tsx
  type?: 'choice' | 'short' | 'boolean' | 'material-analysis';
  question: string;
  material?: string;
  options?: string[];
  correctAnswer?: number;
  explanation: string;
}

export interface TimelineEvent {
    id: string;
    time: string;
    type: 'clue' | 'task' | 'plot' | 'insight';
    title: string;
    description: string;
}

export interface AiSummary {
  transcript: string[]; 
  knowledgeMap: { point: string; status: 'mastered' | 'weak' }[]; 
  plotReview: string; 
  teacherSuggestion: string; 
}

// Fix: Added exported interfaces and types missing in previous version to resolve "no exported member" errors
export interface ScriptScene {
  id: string;
  actId: string;
  title: string;
  summary: string;
  narrative: string;
  transition?: string;
  assetType: 'image' | 'video';
  assetDescription?: string;
  assetPrompt?: string;
  assetUrl?: string;
  generationOptions?: {
    styles: string[];
    resolutions: string[];
  };
  isEdited?: boolean;
  associatedRoleIds?: string[];
  tasks?: Task[];
  clues?: Clue[];
  isCompleted?: boolean;
}

export interface DesignScheme {
  positioning: string;
  teacherInstructions: string;
  acts: {
    id: string;
    title: string;
    plotLogic: string;
    knowledgePoint: string;
    assessmentContent: string;
    duration: number;
  }[];
  overallLogic: string;
  cognitiveRoles: CognitiveRole[];
}

export interface CognitiveRole {
  id: string;
  roleName: string;
  roleDescription: string;
  cognitiveFunction: string;
  knowledgeResponsibility: string;
  collaborationValue: string;
  emoji: string;
}

export type Language = 'zh' | 'en';