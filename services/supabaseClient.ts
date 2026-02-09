
import { createClient } from '@supabase/supabase-js';
import { Script, Role, Task, Clue, QuizQuestion, ScriptScene } from '../types';

const supabaseUrl = 'https://bwqwypvbeavnzldhpvip.supabase.co';
const supabaseKey = 'sb_publishable_P86PEAtXOKd-55QPBg958w_8B22hmKY';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const testSupabaseConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabase.from('scripts').select('id', { count: 'exact', head: true });
        if (error) return false;
        return true;
    } catch (err) {
        return false;
    }
};

export const getCurrentProfile = async () => {
    try {
        const { data: authData, error: authErr } = await (supabase.auth as any).getUser();
        const user = authData?.user;
        if (authErr || !user) return null;
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (error) return null;
        return data;
    } catch (err) {
        return null;
    }
};

export const fetchScriptsList = async (): Promise<Script[]> => {
    try {
        const { data: authData } = await (supabase.auth as any).getUser();
        const user = authData?.user;
        let query = supabase.from('scripts').select('*');
        if (user) {
            query = query.or(`is_official.eq.true,creator_id.eq.${user.id}`);
        } else {
            query = query.eq('is_official', true);
        }
        const { data, error } = await query.order('id', { ascending: false });
        if (error) throw error;
        return (data || []).map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            coverImage: s.cover_image,
            backgroundImage: s.background_image,
            difficulty: s.difficulty,
            duration: s.duration,
            minPlayers: s.min_players,
            maxPlayers: s.max_players,
            curriculum: {
                subject: s.subject,
                grade: s.grade,
                version: s.version,
                unit: s.unit,
                knowledgePoints: s.knowledge_points || [],
                coreCompetencies: s.core_competencies || [],
                teachingFocus: s.teaching_focus,
                teachingDifficulty: s.teaching_difficulty
            },
            theme: s.theme_config,
            creator_id: s.creator_id,
            is_official: s.is_official,
            roles: [],
            introSlides: s.intro_slides || [],
            initialScenario: s.initial_scenario || "",
            scenes: [],
            tasks: [],
            clues: [],
            quiz: []
        }));
    } catch (err) {
        return []; 
    }
};

export const fetchFullScript = async (scriptId: string): Promise<Script | null> => {
    try {
        const { data: script, error: sErr } = await supabase.from('scripts').select('*').eq('id', scriptId).single();
        if (sErr || !script) return null;

        const [rolesRes, scenesRes, quizzesRes] = await Promise.all([
            supabase.from('roles').select('*').eq('script_id', scriptId),
            supabase.from('scenes').select('*, tasks(*), clues(*)').eq('script_id', scriptId).order('order_index'),
            supabase.from('quizzes').select('*').eq('script_id', scriptId)
        ]);

        const allTasks: Task[] = [];
        const allClues: Clue[] = [];

        const mappedScenes: ScriptScene[] = (scenesRes.data || []).map(scene => {
            const sceneTasks = (scene.tasks || []).map((t: any) => ({
                id: t.id,
                title: t.title,
                description: t.description,
                mission: t.mission || t.description,
                type: t.type,
                category: t.category || 'main',
                assigneeId: t.assignee_role_id,
                funPoint: t.fun_point,
                knowledgePoint: t.knowledge_point,
                isCompleted: false,
                requiredForPlot: t.required_for_plot ?? true,
                plotUpdate: t.plot_update,
                correctAnswer: t.correct_answer,
                rewardClueId: t.reward_clue_id,
                video: t.video,
                options: t.options,
                matchingData: t.matching_data,
                image: t.image
            }));

            const sceneClues = (scene.clues || []).map((c: any) => ({
                id: c.id,
                title: c.title,
                content: c.content,
                type: c.type as 'history' | 'plot',
                isFound: true,
                image: c.image_url,
                knowledgeDetail: c.knowledge_detail,
                assetPrompt: c.asset_prompt
            }));

            allTasks.push(...sceneTasks);
            allClues.push(...sceneClues);

            return {
                id: scene.id,
                actId: scene.order_index.toString(),
                title: scene.title,
                summary: scene.summary || "",
                narrative: scene.narrative,
                transition: scene.transition_text,
                assetType: scene.asset_type || 'image',
                assetDescription: scene.asset_description || '',
                assetPrompt: scene.asset_prompt || '',
                assetUrl: scene.asset_url,
                generationOptions: scene.generation_options || { styles: [], resolutions: [] },
                isEdited: true,
                associatedRoleIds: scene.associated_role_ids || [],
                tasks: sceneTasks,
                clues: sceneClues
            };
        });

        const fullScript: Script = {
            id: script.id,
            title: script.title,
            description: script.description,
            coverImage: script.cover_image,
            backgroundImage: script.background_image,
            difficulty: script.difficulty,
            duration: script.duration,
            minPlayers: script.min_players,
            maxPlayers: script.max_players,
            curriculum: {
                subject: script.subject,
                grade: script.grade,
                version: script.version,
                unit: script.unit,
                knowledgePoints: script.knowledge_points || [],
                coreCompetencies: script.core_competencies || [],
                teachingFocus: script.teaching_focus,
                teachingDifficulty: script.teaching_difficulty
            },
            theme: script.theme_config,
            roles: (rolesRes.data || []).map(r => ({
                id: r.id,
                name: r.name,
                avatar: r.avatar,
                description: r.description,
                objective: r.objective,
                detailedProfile: r.detailed_profile,
                portraitLarge: r.portrait_large
            })),
            introSlides: script.intro_slides || [],
            initialScenario: script.initial_scenario || (mappedScenes[0]?.narrative || script.description),
            scenes: mappedScenes,
            tasks: allTasks, 
            clues: allClues,
            quiz: (quizzesRes.data || []).map(q => ({
                id: q.id,
                question: q.question,
                type: q.type,
                options: q.options,
                correctAnswer: q.correct_answer,
                explanation: q.explanation,
                material: q.material
            }))
        };
        return fullScript;
    } catch (err) {
        console.error("Fetch full script error:", err);
        return null;
    }
};

export const saveUserProgress = async (progress: {
    script_id: string;
    quiz_score: number;
    transcript: string[];
    ai_report: any;
    completed_at: string;
}) => {
    try {
        const { data: authData } = await (supabase.auth as any).getUser();
        const user = authData?.user;
        if (!user) return;
        await supabase.from('user_progress').insert({
            user_id: user.id,
            script_id: progress.script_id,
            quiz_score: progress.quiz_score,
            transcript: progress.transcript,
            ai_report: progress.ai_report,
            completed_at: progress.completed_at
        });
    } catch (err) {}
};

/**
 * 发布剧本：深度同步所有字段到 Supabase 
 */
export const publishFullScript = async (script: Script) => {
    try {
        const { data: authData } = await (supabase.auth as any).getUser();
        const user = authData?.user;
        
        // 1. 插入剧本主表
        const { data: sData, error: sErr } = await supabase.from('scripts').insert({
            title: script.title,
            description: script.description,
            cover_image: script.coverImage,
            background_image: script.backgroundImage,
            subject: script.curriculum.subject,
            grade: script.curriculum.grade,
            version: script.curriculum.version,
            unit: script.curriculum.unit,
            duration: script.duration,
            difficulty: script.difficulty,
            min_players: script.minPlayers,
            max_players: script.maxPlayers,
            knowledge_points: script.curriculum.knowledgePoints,
            core_competencies: script.curriculum.coreCompetencies,
            intro_slides: script.introSlides,
            theme_config: script.theme,
            creator_id: user?.id,
            is_official: user ? false : true,
            teaching_focus: script.curriculum.teachingFocus,
            teaching_difficulty: script.curriculum.teachingDifficulty,
            initial_scenario: script.initialScenario
        }).select().single();

        if (sErr) throw sErr;
        const scriptId = sData.id;

        // 2. 插入角色并记录 ID 映射 (用于任务分配)
        const roleIdMap: Record<string, string> = {};
        if (script.roles?.length) {
            for (const r of script.roles) {
                const { data: rd, error: re } = await supabase.from('roles').insert({
                    script_id: scriptId,
                    name: r.name,
                    avatar: r.avatar,
                    description: r.description,
                    objective: r.objective,
                    // Fix: detailed_profile used camelCase property detailedProfile
                    detailed_profile: r.detailedProfile,
                    // Fix: portrait_large used camelCase property portraitLarge
                    portrait_large: r.portraitLarge
                }).select().single();
                if (rd) roleIdMap[r.id] = rd.id;
            }
        }

        // 3. 处理场景与任务
        const uploadScenes = (script.scenes && script.scenes.length > 0) 
            ? script.scenes 
            : [{
                title: "第一幕",
                narrative: script.initialScenario || script.description,
                tasks: script.tasks || [],
                clues: script.clues || [],
                assetUrl: script.coverImage,
                summary: "场景摘要"
            }];

        for (let i = 0; i < uploadScenes.length; i++) {
            const scene = uploadScenes[i];
            const { data: scData, error: sce } = await supabase.from('scenes').insert({
                script_id: scriptId,
                order_index: i,
                title: scene.title,
                narrative: scene.narrative,
                asset_url: (scene as any).assetUrl,
                transition_text: (scene as any).transition,
                summary: (scene as any).summary,
                asset_type: (scene as any).assetType || 'image',
                asset_description: (scene as any).assetDescription,
                asset_prompt: (scene as any).assetPrompt,
                generation_options: (scene as any).generationOptions,
                associated_role_ids: (scene as any).associatedRoleIds?.map((id: string) => roleIdMap[id] || id)
            }).select().single();

            if (scData) {
                if (scene.tasks?.length) {
                    await supabase.from('tasks').insert(
                        scene.tasks.map(t => ({
                            scene_id: scData.id,
                            title: t.title,
                            description: t.description,
                            mission: t.mission,
                            type: t.type,
                            correct_answer: t.correctAnswer,
                            options: t.options,
                            knowledge_point: t.knowledgePoint,
                            category: t.category,
                            assignee_role_id: t.assigneeId ? (roleIdMap[t.assigneeId] || t.assigneeId) : null,
                            fun_point: t.funPoint,
                            required_for_plot: t.requiredForPlot,
                            // Fix: plot_update used camelCase property plotUpdate
                            plot_update: t.plotUpdate,
                            reward_clue_id: t.rewardClueId,
                            video: t.video,
                            matching_data: t.matchingData,
                            image: t.image
                        }))
                    );
                }
                if (scene.clues?.length) {
                    await supabase.from('clues').insert(
                        scene.clues.map(c => ({
                            scene_id: scData.id,
                            title: c.title,
                            content: c.content,
                            type: c.type,
                            image_url: (c as any).image,
                            knowledge_detail: c.knowledgeDetail,
                            asset_prompt: c.assetPrompt
                        }))
                    );
                }
            }
        }

        // 4. 插入小测
        if (script.quiz?.length) {
            await supabase.from('quizzes').insert(
                script.quiz.map(q => ({
                    script_id: scriptId,
                    question: q.question,
                    type: q.type || 'choice',
                    options: q.options,
                    correct_answer: q.correctAnswer,
                    explanation: q.explanation,
                    material: q.material
                }))
            );
        }

        return scriptId;
    } catch (err) {
        console.error("Publish failed:", err);
        throw err;
    }
};
