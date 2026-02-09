

import { Script } from '../../types';
import { THEME_QIN } from '../themes';

export const shangYangScript: Script = {
    id: 'script_shang_yang_002',
    title: '铁血秦风：商鞅的抉择',
    theme: THEME_QIN,
    coverImage: 'https://www.imgur.la/images/2025/12/08/fa36e586ce99dc87c3efe7f2ec394f52.png', 
    backgroundImage: 'https://www.imgur.la/images/2025/12/08/fa36e586ce99dc87c3efe7f2ec394f52.png',
    curriculum: {
      subject: '历史',
      version: '人教版（2024新课标）',
      grade: '七年级上册',
      unit: '第6课 战国时期的社会变革',
      knowledgePoints: ['商鞅变法内容', '立木为信', '废井田制', '推行县制', '秦国的崛起', '奖励耕战', '中央集权'],
      coreCompetencies: ['历史解释', '唯物史观', '史料分析', '家国情怀'],
      teachingFocus: '商鞅变法的主要内容及其对秦国强盛的作用。',
      teachingDifficulty: '变法各项措施之间的内在逻辑联系及其深远影响。'
    },
    duration: 40,
    minPlayers: 5,
    maxPlayers: 7,
    difficulty: 4,
    description: '战国时期，秦国积贫积弱，被魏国夺去河西之地。秦孝公发布求贤令，商鞅入秦欲行变法。然而旧贵族百般阻挠，太子更是触犯新法。作为秦国朝堂的一员，你将决定大秦的命运。',
    introSlides: [
        { 
            image: 'https://www.imgur.la/images/2025/12/25/-1-1.md.jpeg', 
            video: 'https://www.imgur.la/images/2025/12/25/-1-1.mp4',
            text: '' 
        },
        { 
            image: 'https://www.imgur.la/images/2025/12/25/-1-2.md.jpeg', 
            video: 'https://www.imgur.la/images/2025/12/25/-1-2.mp4',
            text: '' 
        },
        { 
            image: 'https://www.imgur.la/images/2025/12/25/-2.md.jpeg', 
            video: 'https://www.imgur.la/images/2025/12/25/-2.mp4',
            text: '' 
        },
        { 
            image: 'https://www.imgur.la/images/2025/12/25/-37478e88be52419a3.md.jpeg', 
            video: 'https://www.imgur.la/images/2025/12/25/-37478e88be52419a3.mp4',
            text: '' 
        },
        { 
            image: 'https://www.imgur.la/images/2025/12/08/fa36e586ce99dc87c3efe7f2ec394f52.png', 
            text: '公元前 356 年，秦国咸阳宫，一场关乎秦国命运的廷议正在进行。' 
        }
    ],
    initialScenario: '第一幕：廷议变法。咸阳宫廷议现场，商鞅展开竹简，高声宣读变法草案：“废井田、开阡陌，允许土地自由买卖；确立县制，官吏由国君直接任命……” 话音未落，老世族猛地拍案而起：“井田制乃先祖定下的立国之本，县制更是违背分封祖制，此等变法必乱秦国！” 新军将领急声反驳：“旧制之下士兵无晋升之路，秦军何以强？” 百姓那边也传来消息，因不知新法真假，无人敢响应 “垦荒令”，朝堂之上争论不休，秦孝公眉头紧锁，目光扫向你们：“诸卿且议，此二项措施究竟能否强秦？”',
    // Added missing scenes property
    scenes: [],
    roles: [
        { id: 'r_sy_1', name: '法家门徒', avatar: '📜', description: '商鞅的死忠追随者，深信“治世不一道”。', objective: '协助商鞅推行新法，从生产力角度反驳旧贵族。', detailedProfile: '你曾游历魏国，见识过李悝变法的成效。你认为秦国只有彻底变革法度，奖励耕战，才能在乱世生存。' },
        { id: 'r_sy_2', name: '秦国老世族', avatar: '🦁', description: '拥有大量封地 and 奴隶的旧贵族代表。', objective: '维护世袭特权，阻挠废除井田制，质疑变法的合法性。', detailedProfile: '你的家族世世代代为秦国流血牺牲，如今一个外来的卫国人要剥夺你们的特权，你决不答应。' },
        { id: 'r_sy_3', name: '新军将领', avatar: '⚔️', description: '渴望通过军功改变命运的平民将领。', objective: '支持军功爵制，渴望打破贵族垄断，强调战争对国力的需求。', detailedProfile: '你出身贫寒，空有一身武艺却因没有贵族血统无法晋升。商鞅的“军功爵制”是你翻身的唯一机会。' },
        { id: 'r_sy_4', name: '关中富商', avatar: '💰', description: '经营粮草马匹的大商人。', objective: '权衡新法对商业的打击，利用经济数据评估变法影响。', detailedProfile: '新法重农抑商，你的生意受到了很大影响。但统一的度量衡又似乎带来了便利。你需要做出选择。' },
        { id: 'r_sy_5', name: '太子太傅', avatar: '👴', description: '太子的老师，公子虔的亲信。', objective: '在廷议中以祖制为由质疑县制，试探商鞅对传统秩序的态度。', detailedProfile: '你坚守周礼，认为分封制是长治久安的关键。对于商鞅这种颠覆性的权力重组，你感到深深的忧虑。' },
    ],
    tasks: [
      { 
          id: 't_sy_discussion_1', 
          category: 'main',
          title: '富秦之基：废井田之辩', 
          mission: '向秦孝公和老世族陈明：废除井田制、允许土地自由买卖，何以成为“富秦之基”？',
          description: '老世族手持先祖传下的井田图，质问商鞅“废井田则失立国根基”。如今秦国耕地不足、粮食短缺，而铁犁牛耕已在民间逐渐推广。请结合生产力发展，阐述此项改革的必然性。', 
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600',
          type: 'discussion', 
          correctAnswer: '铁制农具 and 牛耕推广后，井田制已不适应生产力发展；允许土地自由买卖能调动农民垦荒积极性，增加国家粮食产量，同时满足新兴地主阶级利益，稳定社会秩序，为“强兵”提供物质基础', 
          rewardClueId: 'csy1',
          plotUpdate: '秦孝公微微颔首：“耕织者多而粮足，此理审明。老世族虽存古礼，却难解当下粮荒。”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't_sy_discussion_2', 
          category: 'main',
          title: '固统治：县制之争', 
          mission: '共同向秦孝公阐明：确立县制、国君直接派官治理，如何能帮秦国“固统治、推新法”？',
          description: '太子太傅质问：“分封制沿用数百年，为何要改县制”。如今秦国部分贵族在封地内擅自征税、不听调遣。请论述县制在加强中央集权方面的优势。', 
          image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600',
          type: 'discussion', 
          correctAnswer: '县制使国君直接掌控地方管理，避免贵族割据，加强中央集权；官吏由国君任命，能忠实执行新法，避免旧贵族在地方阻挠变法，为全国推行统一政策提供保障', 
          rewardClueId: 'csy2',
          plotUpdate: '商鞅激昂言道：“政令统一，则国力如臂使指！”廷议陷入沉思，秦孝公眼中闪过一丝决绝。',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't_sy_bridge_act2', 
          category: 'main',
          title: '第二幕：立木取信', 
          mission: '前往南门，见证变法的信誉建立。',
          description: '廷议结束后，商鞅率众人前往咸阳南门，命人立起一根三丈高的木柱，张贴告示：“有人能将此木搬至北门，赏五十金。” 围观百姓窃窃私语：“秦国法令向来朝令夕改，这怕是什么圈套？”', 
          image: 'https://www.imgur.la/images/2025/12/08/fa36e586ce99dc87c3efe7f2ec394f52.png',
          type: 'discussion', 
          plotUpdate: '就在此时，宫中传来急报：太子驷触犯“禁止私斗”条款！消息传开，百姓更是观望：“太子犯法都能免责，新法不过是约束我等平民罢了。”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't_sy_discussion_3', 
          category: 'main',
          title: '取信于民：立木之辩', 
          mission: '分析为何百姓不敢搬木，以及如何借此确立法律信誉。',
          description: '商鞅问你们：“此木搬之易如反掌，为何百姓不敢？我等如何借这根木柱，让咸阳百姓相信新法‘言出必行’？”', 
          image: 'https://images.unsplash.com/photo-1549141011-82343904e228?auto=format&fit=crop&w=600',
          type: 'discussion', 
          correctAnswer: '百姓不敢是因此前秦国法令多变，不信“搬木得五十金”的重赏。目的是确立法律的信誉 and 政府公信力，向百姓传递“新法赏罚分明、言出必行”的信号；只有百姓相信遵守新法能获得实际利益、触犯新法必受处罚，才会主动配合垦荒、耕织等新法要求，为变法落地奠定群众基础', 
          rewardClueId: 'csy4,csy5',
          plotUpdate: '一名壮汉越众而出，将木头搬至北门。商鞅当众兑现五十金，咸阳全城轰动！',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't_sy_discussion_4', 
          category: 'main',
          title: '法不阿贵：太子之劫', 
          mission: '商定处理太子犯法的方案，并向天下宣示。',
          description: '商鞅提出“刑其傅公子虔，黥其师公孙贾”，让太子的老师代为受罚。你们需商议：此策是否可行？如何解释判决？', 
          image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600',
          type: 'discussion', 
          correctAnswer: '可行，既体现“法律面前人人平等”，不让贵族凌驾于法令之上，又保全了太子的身份体面；向百姓解释时需言明：“太子年少，教化有责，其师未能尽到教导之责，故代受刑罚。秦法严明，无论身份高低，触犯者必受惩处，此乃‘法不阿贵’，只为让天下人信服新法，共助秦国强盛”', 
          rewardClueId: 'csy6',
          plotUpdate: '变法指令迅速向全国传递。不久后，商鞅又颁布了奖励耕战的系列法令。',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't_sy_bridge_act3', 
          category: 'main',
          title: '第三幕：耕战动员', 
          mission: '见证变法三年后的秦国新貌。',
          description: '新法推行三年，咸阳粮仓堆满粮食，新军士兵作战勇猛，秦国国力初显。但近日又生新忧：关中富商联名上书，抱怨“重农抑商”导致货物滞销；老世族暗中散布流言，称“土地自由买卖让贫者更贫，恐生内乱”。', 
          image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=600',
          type: 'discussion', 
          plotUpdate: '秦孝公召你们入宫：“新法已见成效，但争议未平，如何巩固变法成果，让秦国真正实现富国强兵？”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't_sy_discussion_5', 
          category: 'main',
          title: '富国强兵：协同之理', 
          mission: '梳理新法各项措施如何相互配合实现“国富兵强”。',
          description: '商鞅呈上奏报：“粮食产量较往年增两倍，新军胜率从三成升至七成。”请分析政治、经济、军事措施是如何形成合力的？', 
          image: 'https://images.unsplash.com/photo-1580130775562-3ef9211bd807?auto=format&fit=crop&w=600',
          type: 'discussion', 
          correctAnswer: '经济上通过土地私有 and 奖励耕织确保了粮草供应；军事上通过军功爵制打破贵族特权，激发士兵斗志；政治上通过县制加强中央集权，使国家能高效调动全国资源支持战争，形成了“以农促战，以战护农”的良性循环。', 
          rewardClueId: 'csy8',
          plotUpdate: '秦孝公感叹：“法度如臂使指，资源尽归国家，秦军何愁不强！”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't_sy_discussion_6', 
          category: 'main',
          title: '变法价值：历史之辩', 
          mission: '反驳老世族的激进论，阐明变法的核心价值。',
          description: '老世族质疑：“变法过于激进，贫富差距扩大，恐留后患。”请阐述变法对秦国未来的核心价值是什么？', 
          image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600',
          type: 'discussion', 
          correctAnswer: '变法并非扩大差距，而是确立了以“法” and “功劳”为准绳的公平竞争机制，打破了僵化的阶级垄断；其核心价值在于建立了一套高度集权的体制，将散沙般的封建势力转化为统一的国家机器，是秦国横扫六国、完成大一统的政治基石。', 
          rewardClueId: 'csy7',
          plotUpdate: '商鞅目光如炬：“变法者，所以利民也；守法者，所以安邦也。”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't_sy_finale_task', 
          category: 'main',
          title: '统一度量衡', 
          mission: '选择正确的衡具，确保商贸 and 赋税的统一。',
          description: '商鞅方升的颁行是经济改革的关键。其主要意义在于？', 
          image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&w=600',
          type: 'choice', 
          options: ['便利商业往来 and 政府征收赋税', '展示大秦精工', '用于祭祀仪式', '仅作装饰'], 
          correctAnswer: '0', 
          rewardClueId: 'csy3',
          plotUpdate: '秦国上下焕然一新，废井田、重耕战、行县制、统一度量衡。接下来，我们需要对这场波澜壮阔的变革进行最后的总结。',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't_sy_summary_report', 
          category: 'main',
          title: '大结局：秦国变法成效总结', 
          mission: '结合线索 with 推理，撰写《秦国变法成效总结》，明确核心内容、成功原因 and 历史意义。',
          description: '秦孝公站在咸阳城头，望着繁荣的关中大地，目光深邃：“诸卿，大秦之变已历十载。此法究其根本，成于何处？利在何方？请诸卿作答，以昭告天下！”', 
          image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600',
          type: 'discussion', 
          correctAnswer: '变法大成，秦国崛起！秦孝公下令在全国全面推行新法，秦国逐渐成为战国七雄中最强盛的诸侯国，为统一六国迈出关键一步。', 
          plotUpdate: '变法大成，秦国崛起！秦孝公下令在全国全面推行新法，秦国逐渐成为战国七雄中最强盛的诸侯国，为统一六国迈出关键一步。',
          isCompleted: false, 
          requiredForPlot: true 
      }
    ],
    clues: [
        { 
            id: 'csy1', 
            title: '《垦草令》核心摘要', 
            content: '“劝民垦荒，地广则粮足，粮足则兵强。”', 
            knowledgeDetail: '旨在通过法律手段强制或诱导荒地开垦，扩大税基。', 
            type: 'history', 
            isFound: false, 
            image: 'https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?auto=format&fit=crop&w=300' 
        },
        { 
            id: 'csy2', 
            title: '战国各国变法概况表', 
            content: '标注：“李悝变法使魏强，吴起变法使楚兴。”', 
            knowledgeDetail: '法家思想在各国取得显著成效的实证。', 
            type: 'history', 
            isFound: false, 
            image: 'https://images.unsplash.com/photo-1565538421876-0f36d7d4982f?auto=format&fit=crop&w=300' 
        },
        { 
            id: 'csy3', 
            title: '商鞅方升实物图', 
            content: '“秦孝公十八年颁行，统一全国度量衡。”', 
            knowledgeDetail: '反映了商鞅在经济领域加强中央集权的努力。', 
            type: 'history', 
            isFound: false, 
            image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&w=300' 
        },
        { 
            id: 'csy4', 
            title: '百姓态度调查', 
            content: '“半数百姓担心‘变法朝令夕改’，不敢响应。”', 
            knowledgeDetail: '变法初期社会信用缺失的真实写照。', 
            type: 'plot', 
            isFound: false, 
            image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=300' 
        },
        { 
            id: 'csy5', 
            title: '立木为信记录', 
            content: '“一人搬木得五十金，百姓奔走相告‘秦法必行’。”', 
            knowledgeDetail: '法律信誉确立的转折点。', 
            type: 'plot', 
            isFound: false, 
            image: 'https://images.unsplash.com/photo-1549141011-82343904e228?auto=format&fit=crop&w=600' 
        },
        { 
            id: 'csy6', 
            title: '朝堂反馈', 
            content: '“贵族不敢再公然抵触新法，官吏推行更顺畅。”', 
            knowledgeDetail: '“法不阿贵”产生的高压震慑效果。', 
            type: 'plot', 
            isFound: false, 
            image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=300' 
        },
        { 
            id: 'csy7', 
            title: '《史记・商君列传》引文', 
            content: '“商君相秦十年，宗室贵戚多怨望者…… 秦法未败也。”', 
            knowledgeDetail: '揭示了变法虽然损害了旧贵族利益，但其确立的法治体系已根植于秦国。', 
            type: 'history', 
            isFound: false, 
            image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300' 
        },
        { 
            id: 'csy8', 
            title: '变法前后数据对比表', 
            content: '“粮食产量增加两倍，军队胜率从30%提升至70%，人口增长15%。”', 
            knowledgeDetail: '用具体数据直观展示了奖励耕战 and 县制改革带来的巨大成效。', 
            type: 'history', 
            isFound: false, 
            image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=300' 
        }
    ],
    quiz: [
        { id: 1, question: '商鞅变法中，直接打击了旧贵族世袭特权的措施是？', options: ['废除井田制', '奖励军功', '建立县制', '统一度量衡'], correctAnswer: 1, explanation: '奖励军功，按功授爵，打破贵族特权垄断。' },
        { id: 2, question: '“法不阿贵”这一判决主要针对谁的犯法行为？', options: ['商鞅', '秦孝公', '太子', '老世族'], correctAnswer: 2, explanation: '针对太子犯法，商鞅重罚其老师，确立了新法的权威。' },
        { id: 3, question: '商鞅变法确立的哪项措施加强了中央对地方的管辖？', options: ['奖励耕织', '废除井田', '推行县制', '统一度量衡'], correctAnswer: 2, explanation: '县制由国君直接派官治理，标志着官僚政治取代贵族政治，加强了中央集权。' }
    ]
};
