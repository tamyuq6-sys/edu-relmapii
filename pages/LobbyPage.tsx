import React, { useState, useEffect } from 'react';
import { Share2, Users, CheckCircle, Info, GraduationCap, MapPin, Loader, BookOpen, Target } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import ImageWithFallback from '../components/ImageWithFallback';
import { Script, Role, Participant } from '../types';

const IP_ICON_URL = "https://www.imgur.la/images/2025/12/23/kou-_20251222210737_658_105.png";

const LobbyPage = ({ script, onStartGame, onBack }: { script: Script, onStartGame: (role: Role, p: Participant[]) => void, onBack: () => void }) => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roomCode] = useState("8392");
    const [simulatedPlayers, setSimulatedPlayers] = useState<any[]>([
        { id: 'p1', name: '王小明', status: 'ready', avatar: '🐼' },
        { id: 'p2', name: '李华', status: 'waiting', avatar: '🦁' },
    ]);
    const [takenRoles, setTakenRoles] = useState<string[]>([]);

    const MAX_PLAYERS = script.maxPlayers;
    const currentCount = simulatedPlayers.length + 1;
    const isRoomFull = currentCount >= MAX_PLAYERS;

    useEffect(() => {
        const timeouts: any[] = [];
        if (simulatedPlayers.length < 3) {
             const t1 = setTimeout(() => {
                setSimulatedPlayers(prev => {
                    if (prev.length + 1 >= MAX_PLAYERS) return prev;
                    return [...prev, { id: 'p3', name: '陈思思', status: 'ready', avatar: '🐰' }]
                });
            }, 1500);
            timeouts.push(t1);
        }
        return () => timeouts.forEach(clearTimeout);
    }, [script.maxPlayers]);

    useEffect(() => {
        if (simulatedPlayers.length > 0) {
            const takenIds: string[] = [];
            const available = script.roles.filter(r => r.id !== selectedRole?.id);
            simulatedPlayers.forEach((p, i) => {
                if (available[i]) takenIds.push(available[i].id);
            });
            setTakenRoles(takenIds);
        }
    }, [simulatedPlayers, selectedRole, script.roles]);

    const handleStart = () => {
        if (!selectedRole) return;
        const participants: Participant[] = [];
        participants.push({
            id: 'user-me',
            name: '我',
            avatar: selectedRole.avatar,
            roleId: selectedRole.id,
            roleName: selectedRole.name,
            isAi: false
        });
        const otherRoles = script.roles.filter(r => r.id !== selectedRole.id);
        simulatedPlayers.forEach((sim, idx) => {
            if (otherRoles[idx]) {
                participants.push({
                    id: sim.id,
                    name: sim.name,
                    avatar: sim.avatar,
                    roleId: otherRoles[idx].id,
                    roleName: otherRoles[idx].name,
                    isAi: false
                });
            }
        });
        const currentParticipantsRoles = participants.map(p => p.roleId);
        const remainingUnassignedRoles = script.roles.filter(r => !currentParticipantsRoles.includes(r.id));
        remainingUnassignedRoles.forEach((role, i) => {
             participants.push({
                 id: `ai-${i + 1}`,
                 name: `AI-${role.name}`,
                 avatar: '🤖',
                 roleId: role.id,
                 roleName: role.name,
                 isAi: true
             });
        });
        onStartGame(selectedRole, participants);
    };

    return (
        <div className="min-h-screen bg-[#FEF9E7] p-6 flex items-center justify-center font-nunito">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3 h-full flex flex-col gap-6">
                     <Card className="flex-1 flex flex-col">
                        <div className="mb-6 text-center">
                            <p className="text-stone-400 font-bold uppercase text-xs mb-1">房间号</p>
                            <div className="text-4xl font-black text-stone-800 tracking-widest bg-stone-100 py-4 rounded-2xl border-2 border-stone-200 dashed flex justify-center items-center gap-2 cursor-pointer hover:bg-white transition-colors">
                                {roomCode} <Share2 size={20} className="text-stone-400"/>
                            </div>
                            {isRoomFull ? (
                                <div className="mt-2 text-red-500 text-xs font-black bg-red-100 px-2 py-1 rounded inline-block">房间已满，无法邀请</div>
                            ) : (
                                <div className="mt-2 text-green-500 text-xs font-black bg-green-100 px-2 py-1 rounded inline-block">等待玩家加入...</div>
                            )}
                        </div>
                        <h3 className="font-extrabold text-stone-700 mb-4 flex items-center gap-2">
                            <Users size={20}/> 在线队友 ({currentCount}/{MAX_PLAYERS})
                        </h3>
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] lg:max-h-none">
                            <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-2xl border-2 border-amber-200">
                                <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
                                    <img src={IP_ICON_URL} alt="User" className="w-full h-full object-cover"/>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-amber-900">You (Host)</p>
                                    <p className="text-xs text-amber-600 font-bold">{selectedRole ? `${selectedRole.name}` : '选择角色中...'}</p>
                                </div>
                            </div>
                            {simulatedPlayers.map((p, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-2xl border-2 border-stone-100">
                                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-xl grayscale opacity-70">{p.avatar}</div>
                                    <div className="flex-1">
                                        <p className="font-bold text-stone-600">{p.name}</p>
                                        <p className="text-xs text-stone-400 font-bold">{p.status === 'ready' ? '已准备' : '选择角色中...'}</p>
                                    </div>
                                    {p.status === 'ready' && <CheckCircle size={16} className="text-green-500"/>}
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" onClick={onBack} className="mt-4">离开房间</Button>
                     </Card>
                </div>

                <div className="lg:col-span-9 space-y-6">
                    <div className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-stone-100 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">{script.curriculum.unit}</span>
                                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">{script.duration}分钟</span>
                                </div>
                                <h2 className="text-3xl font-extrabold text-stone-800">{script.title}</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-10">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-extrabold text-stone-700 mb-2 flex items-center gap-2">
                                        <Info className="text-amber-500" size={20}/> 剧本简介
                                    </h3>
                                    <p className="text-stone-600 font-bold leading-relaxed text-sm bg-stone-50 p-4 rounded-2xl border border-stone-100">
                                        {script.description}
                                    </p>
                                </div>
                                <div>
                                     <h3 className="text-lg font-extrabold text-stone-700 mb-2 flex items-center gap-2">
                                        <GraduationCap className="text-blue-500" size={20}/> 教学重难点
                                    </h3>
                                    <div className="space-y-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                        <div>
                                            <p className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                                                <Target size={14}/> 教学重点
                                            </p>
                                            <p className="font-bold text-stone-700 text-sm">
                                                {script.curriculum.teachingFocus}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="flex items-center gap-2 text-xs font-black text-red-600 uppercase tracking-wider mb-1">
                                                <BookOpen size={14}/> 教学难点
                                            </p>
                                            <p className="font-bold text-stone-700 text-sm">
                                                {script.curriculum.teachingDifficulty}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-full min-h-[400px] lg:h-full rounded-2xl overflow-hidden shadow-md border-2 border-stone-100 relative group">
                                <ImageWithFallback src={script.coverImage} alt={script.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">EduRealm Presents</p>
                                    <p className="font-black text-lg leading-tight">{script.title}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 lg:p-8 border-2 border-stone-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-extrabold text-stone-700 flex items-center gap-2">
                                <Users className="text-purple-500" size={24}/> 选择你的角色
                            </h3>
                            <span className="text-xs font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                                剩余空缺将由 AI 自动补位
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {script.roles.map(role => {
                                const isTakenByOther = takenRoles.includes(role.id);
                                return (
                                    <div 
                                        key={role.id} 
                                        onClick={() => !isTakenByOther && setSelectedRole(role)}
                                        className={`relative p-4 rounded-2xl border-b-4 transition-all flex gap-4 items-start group ${
                                            selectedRole?.id === role.id 
                                            ? 'bg-amber-100 border-amber-300 ring-2 ring-amber-300 cursor-pointer' 
                                            : isTakenByOther 
                                                ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                                                : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-amber-200 hover:shadow-md cursor-pointer'
                                        }`}
                                    >
                                        <div className="text-4xl bg-white w-14 h-14 flex items-center justify-center rounded-2xl shadow-sm border border-stone-100 group-hover:scale-110 transition-transform">
                                            {role.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-extrabold text-stone-800 text-lg truncate">{role.name}</h4>
                                            <p className="text-xs text-stone-500 font-bold leading-tight mt-1 mb-2 line-clamp-2">{role.description}</p>
                                        </div>
                                        {selectedRole?.id === role.id && (
                                            <div className="absolute top-2 right-2 text-amber-500">
                                                <CheckCircle size={24} fill="currentColor" className="text-white"/>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button 
                                onClick={handleStart} 
                                variant={selectedRole ? "accent" : "secondary"} 
                                className="w-full md:w-auto px-12 py-4 text-xl shadow-lg"
                                disabled={!selectedRole}
                            >
                                {selectedRole ? '确认角色并进入课堂' : '请先选择角色'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LobbyPage;