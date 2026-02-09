
import React, { useState, useEffect } from 'react';
import { AppStage, Script, Role, Participant } from './types';
import LandingPage from './pages/LandingPage';
import SelectionPage from './pages/SelectionPage';
import LobbyPage from './pages/LobbyPage';
import { ClassroomPage } from './pages/ClassroomPage';
import QuizPage from './pages/QuizPage';
import ReportPage from './pages/ReportPage';
import CustomizationPage from './pages/CustomizationPage';
import ApiSettings from './components/ApiSettings';
import { SCRIPTS_DB } from './data/mockData';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.LANDING);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [completedScriptIds, setCompletedScriptIds] = useState<Set<string>>(new Set());
  
  const [allScripts, setAllScripts] = useState<Script[]>(SCRIPTS_DB);
  const [profile, setProfile] = useState<any>(null);

  const handleSimulateLogin = (username: string) => {
    setProfile({
        id: 'mock-user-123',
        username: username,
        level: 12,
        avatar_url: 'https://www.imgur.la/images/2025/12/23/kou-_20251222210737_658_105.png'
    });
  };

  const [scriptReports, setScriptReports] = useState<Record<string, any>>({});
  const [sessionTranscript, setSessionTranscript] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });

  const startApp = () => setStage(AppStage.SELECTION);
  
  const handleSelectScript = (script: Script) => {
    setSelectedScript(script);
    if (completedScriptIds.has(script.id)) {
      setStage(AppStage.REPORT);
    } else {
      setStage(AppStage.LOBBY);
    }
  };

  const handleStartGame = (role: Role, party: Participant[]) => {
      setUserRole(role);
      setParticipants(party);
      setSessionTranscript([]); 
      setStage(AppStage.CLASSROOM);
  };

  const handleFinishClass = (transcript: string[]) => {
    setSessionTranscript(transcript);
    setStage(AppStage.QUIZ);
  };

  const handleFinishQuiz = (score: number) => {
    if (selectedScript) {
      setCompletedScriptIds(prev => new Set(prev).add(selectedScript.id));
      setQuizResult({ score, total: selectedScript.quiz.length });
    }
    setStage(AppStage.REPORT);
  };

  const handleCacheReport = (scriptId: string, reportData: any) => {
    setScriptReports(prev => ({ ...prev, [scriptId]: reportData }));
  };

  const handleAddCustomScript = (script: Script) => {
    setAllScripts(prev => [script, ...prev]);
    setStage(AppStage.SELECTION);
  };

  const restart = () => {
    setStage(AppStage.SELECTION);
    setSelectedScript(null);
    setUserRole(null);
    setParticipants([]);
    setSessionTranscript([]);
  };

  return (
    <div className="font-sans text-stone-800 selection:bg-amber-200">
      {stage === AppStage.LANDING && (
        <LandingPage 
            onStart={startApp} 
            onSimulateLogin={handleSimulateLogin}
        />
      )}
      {stage === AppStage.SELECTION && (
        <SelectionPage 
          scripts={allScripts}
          onSelectScript={handleSelectScript} 
          completedScriptIds={completedScriptIds} 
          onStartCustomization={() => setStage(AppStage.CUSTOMIZATION)}
          userProfile={profile}
        />
      )}
      {stage === AppStage.CUSTOMIZATION && (
        <CustomizationPage 
          onCancel={restart} 
          onComplete={handleAddCustomScript} 
        />
      )}
      {stage === AppStage.LOBBY && selectedScript && (
        <LobbyPage script={selectedScript} onStartGame={handleStartGame} onBack={restart} />
      )}
      {stage === AppStage.CLASSROOM && selectedScript && userRole && (
        <ClassroomPage 
          script={selectedScript} 
          role={userRole} 
          participants={participants} 
          onFinish={handleFinishClass} 
          onExit={restart} 
        />
      )}
      {stage === AppStage.QUIZ && selectedScript && (
        <QuizPage questions={selectedScript.quiz} onComplete={handleFinishQuiz} />
      )}
      {stage === AppStage.REPORT && selectedScript && (
        <ReportPage 
          script={selectedScript}
          transcript={sessionTranscript}
          quizScore={quizResult.score}
          totalQuestions={quizResult.total}
          cachedReport={scriptReports[selectedScript.id]}
          onSaveReport={(data) => handleCacheReport(selectedScript.id, data)}
          onRestart={restart} 
        />
      )}
      
      {/* 注入 API 设置面板 */}
      <ApiSettings />
    </div>
  );
};

export default App;
