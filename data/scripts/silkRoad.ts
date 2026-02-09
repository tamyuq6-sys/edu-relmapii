import { Script } from '../../types';
import { THEME_SILK_ROAD } from '../themes';

export const silkRoadScript: Script = {
    id: 'script_silk_road_001',
    title: '丝路驼铃：失落的通关文牒',
    theme: THEME_SILK_ROAD,
    coverImage: 'https://www.imgur.la/images/2025/12/08/08c1076dbdbecdb6d551dbe40a13e07d.png',
    backgroundImage: 'https://www.imgur.la/images/2025/12/08/08c1076dbdbecdb6d551dbe40a13e07d.png', 
    curriculum: {
      subject: '历史',
      version: '人教版（2024新课标）',
      grade: '七年级上册',
      unit: '第14课 沟通中外文明的“丝绸之路”',
      knowledgePoints: ['张骞通西域', '丝绸之路的路线', '西域都护', '中外物种交流', '汉匈关系'],
      coreCompetencies: ['时空观念', '史料实证', '家国情怀'],
      teachingFocus: '张骞通西域的历史意义及丝绸之路的影响。',
      teachingDifficulty: '汉朝对西域有效管理的历史意义。'
    },
    duration: 45,
    minPlayers: 4,
    maxPlayers: 7,
    difficulty: 3,
    description: '西汉汉武帝时期，一支从西域、大秦返程东归的商队，在玉门关外遭沙尘暴导致通关文牒失踪，被守将限期自证清白。商队众人在寻找通关文牒的期间发现匈奴细作的存在，经过不断地探查，最终寻回文牒、锁定细作身份，成功通关后继续东行返回中原。这不仅是一场通关危机，更是一场关乎忠诚、贸易与文化交融的生死考验。',
    introSlides: [
        { 
            image: 'https://www.imgur.la/images/2025/12/23/-1a132dbd55eaf947b.md.jpeg', 
            video: 'https://www.imgur.la/images/2025/12/23/-1a132dbd55eaf947b.mp4',
            text: '' 
        },
        { 
            image: 'https://www.imgur.la/images/2025/12/08/08c1076dbdbecdb6d551dbe40a13e07d.png', 
            video: 'https://www.imgur.la/images/2025/12/23/-2-1.mp4',
            text: '' 
        },
        { 
            image: 'https://www.imgur.la/images/2025/12/25/-2-2.md.jpeg', 
            video: 'https://www.imgur.la/images/2025/12/25/-2-2.mp4',
            text: '' 
        },
        { 
            image: 'https://www.imgur.la/images/2025/12/25/-3.md.jpeg', 
            video: 'https://www.imgur.la/images/2025/12/25/-3.mp4',
            text: '' 
        },
        { 
            image: 'https://www.imgur.la/images/2025/12/23/10c396256ad1f3ec6.png', 
            text: '玉门关外驿站，风沙未停，地上散落着货物、匈奴兽牙、皮靴印，七人集结后焦急万分。' 
        }
    ],
    initialScenario: '第一幕：玉门惊变。驿站内风沙未停，货物散乱。守将按剑而立，眼神如刀：“一炷香内找回文牒并自证清白，否则全员下狱问斩！”而在黑暗中，匈奴细作的目光正死死盯着你们。',
    roles: [
      { 
        id: 'r1', 
        name: '张骞随从', 
        avatar: '📜', 
        description: '跟随张骞出使西域多年的记录官，博望侯张骞的亲信。', 
        detailedProfile: '曾亲历两次出使西域的艰险，见识过大宛的汗血马、安息的驼队，随身携带汉武帝密令及《西域山川图志》，熟悉丝绸之路沿途的山川地貌与各国关卡。文牒丢失后，最担心地图落入匈奴人之手，泄露汉朝与西域的交通要道。',
        objective: '利用地理知识证明商队身份，保护汉朝地图不被窃取。' 
      },
      { 
        id: 'r2', 
        name: '西域向导', 
        avatar: '🐫', 
        description: '从小生长在河西走廊，祖辈世代为往来商队引路，是精通沙漠生存技巧的“万事通”。', 
        detailedProfile: '通晓汉朝官话与西域多国语言（如粟特语、匈奴语），熟悉西域各国风俗禁忌。此次受商队雇佣引引路，私藏了部分佣金，但对汉朝忠心耿耿，绝非奸细。',
        objective: '协助辨别货物来源，证明贸易性质，顺利完成行程赚取佣金。' 
      },
      { 
        id: 'r3', 
        name: '粟特商人', 
        avatar: '💰', 
        description: '来自中亚粟特城邦的资深商人。', 
        detailedProfile: '常年往返于东西方之间倒卖特产，嗅觉灵敏、精于算计。此次携带葡萄、核桃、石榴种子等西域特产入关，计划在长安高价售卖，货物中还藏着未报税的和田玉宝石，这是他全部的身家性命。',
        objective: '保护货物安全，证明所带物种为西域原产，洗清“销赃”嫌疑。' 
      },
      { 
        id: 'r4', 
        name: '护卫长', 
        avatar: '⚔️', 
        description: '前汉军斥候，曾是李广将军麾下的骑兵。', 
        detailedProfile: '武艺高强，对匈奴的习俗、服饰、气味（尤其是马奶酒、羊肉膻味）极为敏感。因战场负伤退居二线，受雇护送商队，途中敏锐察觉到异常——空气中残留着匈奴特有的马奶酒味道，怀疑队伍中混进了奸细。',
        objective: '找出匈奴细作，确保全员存活并顺利通关。' 
      },
      { 
        id: 'r5', 
        name: '匈奴流亡王子', 
        avatar: '🦅', 
        description: '匈奴部族内乱的幸存者。', 
        detailedProfile: '单于杀了他的父亲，他带着部族信物（一枚刻有匈奴图腾的玉佩）逃往汉朝寻求庇护，隐姓埋名混在商队中前往长安。深知自己身份敏感，一旦暴露必被当场格杀，内心既痛恨匈奴单于，也渴望得到汉朝的接纳。',
        objective: '隐藏真实身份，同时巧妙证明自己对汉朝无害。' 
      },
      { 
        id: 'r6', 
        name: '随军医官', 
        avatar: '💊', 
        portraitLarge: 'https://www.imgur.la/images/2025/12/23/c5edb6da363e2e6b861b1daa193a8db0.png',
        description: '出身杏林世家，精通中医草药，受朝廷指派跟随商队西行。', 
        detailedProfile: '一方面为队员诊治伤病，另一方面沿途采集西域特有药材，寻找传说中能治百病的“西域神药”（如苜蓿、沙棘等），对西域植物的药性、形态深有研究，也通晓部分毒物的特征。',
        objective: '通过辨别沿途药材及商队货物中的植物类特产，佐证商队的西域行程。' 
      },
      { 
        id: 'r7', 
        name: '大秦幻术师', 
        avatar: '🎭', 
        description: '来自遥远的大秦（古罗马），是技艺精湛的艺人。', 
        detailedProfile: '带着戏法箱子和西方特产（如玻璃器皿、异域织物）前往长安，希望能为汉武帝献艺，换取赏赐与居留权。戏法箱子里藏着西方特有的机关道具，身上带着大秦的钱币与纹饰信物。',
        objective: '利用独特的西方物品与技艺，证明丝绸之路远端的文明联系，自证并非来历不明之人。' 
      },
    ],
    tasks: [
      { 
          id: 't1', 
          category: 'main',
          title: '汉武宏图：张骞出使', 
          mission: '守将怀疑你们的身份，你们必须准确回答出守将的问题。',
          description: '守将：“既自称汉使商队，必知朝廷大事。听好了：张骞第一次出使西域，出发于（1）哪一年？目的是联络（2）哪个民族夹击匈奴？途中又被（3）谁扣留十余年？”', 
          image: 'https://www.imgur.la/images/2026/02/08/0888c764eb5cde3ba1fe82c760938cb0.png',
          type: 'puzzle', 
          correctAnswer: '公元前138|大月氏|匈奴', 
          rewardClueId: 'c_shiji_route',
          plotUpdate: '“哼，看来对朝廷旧事倒也熟稔。”守将收起长剑，但眼神依旧犀利。随行人员呈上了张骞当年的奏章摘要与西行图卷。',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't2', 
          category: 'main',
          title: '史海探珠：出使之辩', 
          mission: '回答守将的灵魂拷问，展示你们对丝路意义的深刻理解。',
          description: '守将：“张骞当年见识了什么？探明了什么？朝廷耗费如此多的人力物力，究竟换回了什么益处？说不清楚，依旧是死罪！”', 
          image: 'https://www.imgur.la/images/2026/02/08/0888c764eb5cde3ba1fe82c760938cb0.pngg',
          type: 'discussion', 
          rewardClueId: 'c_shiji_route',
          plotUpdate: '守将沉默良久，缓缓点头：“看来你们确实绝非来历不明之辈！带上来！”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't2_bridge', 
          category: 'main',
          title: '剧情转场：驿站现场', 
          mission: '点击确认，进入第二幕物产清点。',
          description: '守将已下令彻查商队货物，驿站中央空地已布置完毕。',
          image: 'https://www.imgur.la/images/2026/02/08/2-1.png',
          type: 'discussion', 
          plotUpdate: '驿站中央空地，卫兵将商队货物全部搬出摆放整齐。\n守将：“货物繁杂，且随我辨明来源。若连来源都说不清，便是走私销赃！”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't3', 
          category: 'main',
          title: '物产之辩：丝路连连看', 
          mission: '通过连线对应，向守将证明你们对这批货物的了如指掌。',
          description: '守将：“货物繁杂，请将这些物产与它们的流向进行对应连线。若有一处错误，便说明你们在撒谎！”', 
          image: 'https://www.imgur.la/images/2026/02/08/2.png',
          type: 'matching', 
          matchingData: {
            items: ['丝绸', '葡萄', '冶铁技术', '核桃', '凿井技术', '石榴', '漆器', '和田玉'],
            categories: ['汉朝输出西域', '西域传入中原']
          },
          correctAnswer: '1-0246|2-1357', 
          rewardClueId: 'c_silk_road_trade_records',
          plotUpdate: '守将查验了货物的连线清单，微微点头：“不错，起源与物件严丝合缝。丝绸、铁器乃我大汉精粹，葡萄、石榴确是西域奇珍。”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't3_bridge', 
          category: 'main',
          title: '剧情转场：地理考验', 
          mission: '点击确认，获得物品清单并进入地理之志. ',
          description: '货物虽然查清，但守将对你们的行踪路径仍有疑虑。', 
          image: 'https://www.imgur.la/images/2025/12/23/3.png',
          type: 'discussion', 
          rewardClueId: 'c_trade_summary',
          plotUpdate: '守将的目光重新落回张骞随从手中的《西域山川图志》，语气郑重起来：“但尔等此行从长安出发，经何处、过何关、历哪些国度，最终如何返程至玉门关，需一一列明，若有半分含糊，仍难信此行无假！”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't4', 
          category: 'main',
          title: '地理之志：丝路行踪', 
          mission: '补全《西域山川图志》中商队的行进路线。',
          description: '请依次回答：（1）本次路线起点是哪里？（2）补充路线：长安→河西走廊→____（今新疆地区）→中亚...（3）河西走廊的咽喉之地、必经关隘是哪里？', 
          image: 'https://www.imgur.la/images/2026/02/08/e0ac5aa39fb698b876438250101fe9df.jpeg',
          type: 'puzzle', 
          correctAnswer: '长安|西域|敦煌', 
          rewardClueId: 'c_xiyu_atlas',
          plotUpdate: '张骞随从：“出敦煌西至玉门关，再往西域便分南北两道，北道经车师前国，南道过楼兰古国！”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't5', 
          category: 'main',
          title: '宏图之辩：通路意义', 
          mission: '阐述丝绸之路对大汉及东西方的深远影响。',
          description: '守将：“此路线是往来西域与中原的要道，如今匈奴袭扰不断，朝廷为何要劳师动众维护这条通路？此路能为汉朝带来什么益处？又为何能让东西方之人甘愿冒险穿行？”', 
          image: 'hhttps://www.imgur.la/images/2026/02/08/e0ac5aa39fb698b876438250101fe9df.jpeg',
          type: 'discussion', 
          rewardClueId: 'c_xiongnu_history_compilation',
          plotUpdate: '此时护卫长突然在驿站角落的草堆里发现一块奇怪的令牌，令牌上刻着匈奴文字，而非汉朝篆书',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't5_bridge', 
          category: 'main',
          title: '剧情转场：细作端倪', 
          mission: '点击确认，听取守将的最后通牒。',
          description: '令牌的出现让气氛瞬间降至点。', 
          image: 'https://www.imgur.la/images/2026/02/08/4.png',
          type: 'discussion', 
          rewardClueId: 'c_trade_summary',
          plotUpdate: '守将：“果然有匈奴细作！速速交出细作！”护卫长站出说道：“昨夜我闻到马奶酒的味道，且发现有人偷偷放飞信鸽，细作必在队中！”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't6', 
          category: 'main',
          title: '第四幕：细作疑云', 
          mission: '寻回通关文牒，找出匈奴细作。',
          description: '这两样东西（马奶酒、信鸽）为何会出现在商队中？仅凭这两点，为何就能断定有匈奴细作混入？如何区分汉人与匈奴人？（提示：可从穿衣、吃食、住居等方面进行分析）', 
          image: 'https://www.imgur.la/images/2025/12/23/f007b274765fe1bf560d0f1d36160ea6.png',
          type: 'discussion', 
          rewardClueId: 'c_pigeon_feather',
          plotUpdate: '守将命卫兵一一排查众人身份，最终发现匈奴流亡王子藏在商队之中。卫兵将匈奴流亡王子牢牢围住，发现匈奴流亡王子的衣角沾着少量鸽羽，怀疑匈奴流亡王子早已通过鸽子传信给匈奴。',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't7', 
          category: 'main',
          title: '剧情转场：王子辩白', 
          mission: '点击确认，听取匈奴流亡王子的陈述。',
          description: '王子被卫兵重重包围，形势危急。', 
          image: 'https://www.imgur.la/images/2026/02/08/5.png',
          type: 'discussion', 
          plotUpdate: '匈奴流亡王子脸色惨白，立刻辩解：“我虽是匈奴人，却因单于杀父而逃亡汉朝，绝非细作，我愿为汉朝效力！这令牌是沙尘暴时有人塞到我行囊里嫁祸我的！”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't8', 
          category: 'main',
          title: '剧情转场：僵持时刻', 
          mission: '点击确认，进入下一阶段。',
          description: '众人陷入僵持，守将命人将匈奴流亡王子暂时关押起来。', 
          image: 'https://www.imgur.la/images/2026/02/08/6.png',
          type: 'discussion', 
          plotUpdate: '众人陷入僵持，守将命人将匈奴流亡王子暂时关押起来。',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't8_act5_intro', 
          category: 'main',
          title: '第五幕：重重审问', 
          mission: '点击确认，面对守将的严厉审问。',
          description: '因为匈奴流亡王子的关系，守将对商队众人的怀疑再次加深，下令将众人压下去一一审问。', 
          image: 'https://www.imgur.la/images/2025/12/24/5d7877485e87fb3a8a0eaaf8069d3abd.png',
          type: 'discussion', 
          plotUpdate: '守将：“既然尔等各执一词，便分头受审！谁若露了马脚，格杀勿论！”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't9', 
          category: 'main',
          title: '审问：文牒下落', 
          mission: '分析目前掌握的所有线索，给出搜索建议。',
          description: '守将：“若尔等真清白，便指条明路，文牒到底会在何处？莫非是被风吹到了关外荒漠？”', 
          image: 'https://www.imgur.la/images/2025/12/24/1b19b43c739caa7ce6566dd72c63ef25.png',
          type: 'puzzle', 
          correctAnswer: '烽火台', 
          plotUpdate: '“烽火台？言之有理，那里地势高峻，且是传讯枢纽。”',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't11_conclusion', 
          category: 'main',
          title: '剧情转场：奔向烽火台', 
          mission: '整合线索，揭开真相。',
          description: '审问结束，众人重新汇合。', 
          image: 'https://www.imgur.la/images/2026/02/08/728a933cec7c7a8994330702183b4f40.png',
          type: 'discussion', 
          plotUpdate: '在众人的再三保证下，守将暂时相信匈奴流亡王子并非细作，允许他与众人一起搜查。因为《西域山川图志》上的痕迹，众人决定到烽火台探查一下。',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
        id: 't12_water_finding', 
        category: 'main',
        title: '第六幕：暗泉之获', 
        mission: '寻找水源，意外发现。',
        description: '考虑到商队水囊快空了，你们在西域向导的带领下找到红柳丛下的暗泉。', 
        image: 'https://www.imgur.la/images/2026/02/08/7.png',
        type: 'discussion', 
        plotUpdate: '补水时发现泉边岩石下藏着一个布包，里面有一块文牒碎片，还有一张用粟特语写的纸条。',
        isCompleted: false, 
        requiredForPlot: true 
      },
      { 
        id: 't13_note_decoding', 
        category: 'main',
        title: '纸条秘闻', 
        mission: '解读密信。',
        description: '经过西域向导的解读，你们推测纸条应是细作与匈奴来往的信件一角。', 
        image: 'https://www.imgur.la/images/2025/12/24/039724450445e06f329573e17b4dbe9b.png',
        type: 'discussion', 
        video: 'https://www.imgur.la/images/2025/12/23/t13.mp4',
        plotUpdate: '纸条上面写着“文牒藏于烽火台”。接着你们来到烽火台打算找回文牒。',
        isCompleted: false, 
        requiredForPlot: true 
      },
      { 
        id: 't14_locked_door', 
        category: 'main',
        title: '高台锁钥', 
        mission: '面对封锁。',
        description: '你们来到烽火台打算找回文牒，每一层烽火台你们都找了并没有看到文牒，只剩下最顶层还没看。', 
        image: 'https://www.imgur.la/images/2025/12/24/299fc6fd1b78f28e3568d666cc49fcb6.png',
        type: 'discussion', 
        rewardClueId: 'c_xiyu_duhufu_60bc,c_hanshu_zhengji_quote',
        plotUpdate: '你们终于爬到了烽火台顶层，却发现烽火台顶层上了锁。',
        isCompleted: false, 
        requiredForPlot: true 
      },
      { 
        id: 't15_management_discussion', 
        category: 'main',
        title: '治疆良策', 
        mission: '寻回通关文牒，找出匈奴细作。',
        description: '西域小国林立、路途艰险，匈奴又常来滋扰，商队往来屡遭意外，朝廷早有心意欲安稳西域、保障丝路不绝。你们常年奔走这条通路，见识过西域诸国情形，也亲历过沿途危机，我大汉该用何法才能有效管束西域、让贸易往来安稳无虞？', 
        image: 'https://www.imgur.la/images/2025/12/24/92d9e49da48d5c96390950744e3d07e0.png',
        type: 'discussion', 
        plotUpdate: '门锁解锁，你们找到了完整的通关文牒，同时获得联络信、短刀等证据，明确了匈奴细作正是玉门关守将的亲信',
        isCompleted: false, 
        requiredForPlot: true 
      },
      { 
        id: 't16_return_to_gate', 
        category: 'main',
        title: '第七幕：重返驿站', 
        mission: '递交通关文牒，指认匈奴细作。',
        description: '你们带着文牒和从烽火台中发现的一应证据返回驿站。', 
        image: 'https://www.imgur.la/images/2025/12/24/7c116f1b9274d63d68ec37fb26fe9d84.png',
        type: 'discussion', 
        plotUpdate: '在路上，你们讨论起是否要将证据交给守将，毕竟细作身份非同一般。最后你们决定还是要将获得的所有证据交给守将，告知守将匈奴细作的身份。',
        isCompleted: false, 
        requiredForPlot: true 
      },
      { 
          id: 't17_identify_traitor', 
          category: 'main',
          title: '指认凶首', 
          mission: '指认出隐藏在商队背后的匈奴细作。',
          description: '守将：“尔等既称已查明真相，那细作究竟是何人？！”', 
          image: 'https://www.imgur.la/images/2025/12/24/1a52b0a3961ee73f48e1604686a726a2.png',
          type: 'puzzle', 
          correctAnswer: '玉门关守将亲信',
          plotUpdate: '众人合力呈上所有证据，细作无从抵赖，当场被守军擒获押下。',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
          id: 't17_bridge', 
          category: 'main',
          title: '剧情转场：守将礼赞', 
          mission: '聆听守将最后的嘱托。',
          description: '真相大白，守将对你们的行为表示高度认可。', 
          image: 'https://www.imgur.la/images/2025/12/24/520c330b6426240e157e7fbc66e46017.png',
          type: 'discussion', 
          video: 'https://www.imgur.la/images/2025/12/24/ce40aebe215b16a8344dc59c3da724c3.mp4',
          plotUpdate: '守将亲手查验文牒真伪，见印信齐全、记载详实，又目睹商队带回的西域葡萄、大秦玻璃器皿等贸易成果，挥手示意放行。',
          isCompleted: false, 
          requiredForPlot: true 
      },
      { 
        id: 't18_finale', 
        category: 'main',
        title: '大结局：霞光东行', 
        mission: '商队重新集结，迎着漫天霞光继续东行。',
        description: '玉门关门缓缓开启，驼铃声再次清脆响起。', 
        image: 'https://www.imgur.la/images/2025/12/24/9cdb5c481196d9ccba5feb137c4c1a8d.png',
        type: 'discussion', 
        video: 'https://www.imgur.la/images/2025/12/24/dd9926d5544bea8cfb8882259da77693.mp4',
        plotUpdate: '',
        isCompleted: false, 
        requiredForPlot: true 
      },
      { 
          id: 't_r1_p', 
          category: 'personal',
          assigneeId: 'r1',
          title: '密函任务：保护图志', 
          mission: '将地图藏在符合汉朝礼制的安全之处。',
          description: '你意识到《西域山川图志》被翻动过，文牒失踪可能与地图有关。你必须立刻转移它. ', 
          type: 'choice', 
          options: ['马鞍夹层', '节仗之中', '货物箱底'],
          correctAnswer: '1', 
          plotUpdate: '你打算将地图藏入节仗之中。在藏地图时，你敏锐地发现了地图上残留着很浅的匈奴印记，且图上“烽火台”的位置有淡淡 of 圈痕。',
          isCompleted: false, 
          requiredForPlot: false 
      },
      { 
          id: 't_r2_p', 
          category: 'personal',
          assigneeId: 'r2',
          title: '密函任务：沙漠生存', 
          mission: '证明你作为顶级向导的专业素养。',
          description: '商队水囊告急，需先找水源，西域沙漠中指示水源的典型植物是？', 
          type: 'choice', 
          options: ['红柳丛', '枯胡杨', '骆驼刺', '沙棘林'],
          correctAnswer: '0', 
          plotUpdate: '守军询问了你许多有关沙漠生存、汉朝与西域的问题，所有问题你都能回答正确。最终守军确认了你对西域地理的精通，排除了你的嫌疑。',
          isCompleted: false, 
          requiredForPlot: false 
      },
      { 
          id: 't_r3_p', 
          category: 'personal',
          assigneeId: 'r3',
          title: '密函任务：美玉之辩', 
          mission: '保住你的身家性命，洗清盗掘嫌疑。',
          description: '守军在搜查商品时找到了一批未报税的和田玉宝石。你必须证明这是贸易所得。请问和田玉的核心特征是？', 
          type: 'choice', 
          options: ['温润细腻', '色彩斑斓', '坚硬无比', '透明如水'],
          correctAnswer: '0', 
          plotUpdate: '你留住了和田玉宝石，突然想起昨晚曾看到守将的亲信偷偷摸摸靠近商队驼车，神色非常可疑。',
          isCompleted: false, 
          requiredForPlot: false 
      },
      { 
          id: 'r6_p', 
          category: 'personal',
          assigneeId: 'r6',
          title: '密函任务：寻找神药', 
          mission: '辨别物种，利用医学知识辅证。',
          description: '张骞通西域后，哪种植物传入中原成为重要的牧草 and 药材？', 
          type: 'choice', 
          options: ['苜蓿', '茶叶', '占城稻', '土豆'],
          correctAnswer: '0', 
          plotUpdate: '你在寻找“神药”时，偶然发现匈奴流亡王子行囊中藏着一种西域草药。你认出这种草药可专门治疗箭伤，且药性竟与汉朝军医常用的药材呈互补之势。',
          isCompleted: false, 
          requiredForPlot: false 
      },
      { 
          id: 't_r7_p', 
          category: 'personal',
          assigneeId: 'r7',
          title: '密函任务：文明见证', 
          mission: '展示你的异域背景，证明交流使命。',
          description: '守将质疑你大秦幻术师的身份。你需要展示一件大秦（古罗马）特有的物品。', 
          type: 'choice', 
          options: ['丝绸', '玻璃器皿', '漆器', '铁器'],
          correctAnswer: '1', 
          plotUpdate: '你向守军展示了流光溢彩的玻璃器皿，还表演了西方特有的戏法，守将最终相信商队确有东西方贸易与交流的崇高使命。',
          isCompleted: false, 
          requiredForPlot: false 
      }
    ],
    clues: [
      { 
        id: 'c_shiji_route', 
        title: '《史记·大宛列传》文献与路线图', 
        content: '"是时天子问匈奴降者，皆言匈奴破月氏王，以其头为饮器，月氏遁逃而常怨仇匈奴，无与共击之。汉方欲事灭胡，闻此言，因欲通使。道必更匈奴中，乃能使者。"\n"初，骞行时百余人，去十三岁，唯二人得还。"', 
        knowledgeDetail: '这是司马迁在《史记》中对张骞出使西域背景与艰辛历程的最权威记录。\n路线图标注了从长安出发，经河西走廊，穿越天山南路到达大月氏的路线。', 
        type: 'history', 
        isFound: false, 
        image: 'https://www.imgur.la/images/2026/02/08/1875d290574a101421bb3fe9f1087735.png' 
      },
      { 
        id: 'c_zhang_qian_report', 
        title: '张骞上奏汉武帝摘要', 
        content: '“臣等历尽艰辛，探明大宛、大夏、安息等国. 彼处物产丰富，良马众多。若能修好往来，大汉之威可震西域，匈奴之势必孤！”', 
        knowledgeDetail: '这是张骞对西域形势的初步研判，为汉武帝后续的丝路战略提供了情报支撑，强调了战略意义。', 
        type: 'history', 
        isFound: true, 
        image: 'https://www.imgur.la/images/2026/02/08/7aaeabacc1d08e5a27c6f24a264368cd.png' 
      },
      { 
        id: 'c_vision_return', 
        title: '张骞从西域回来后想象中的画面', 
        content: '一幅波澜壮阔的画卷：夕阳下的长安城门大开，胡商牵着满载香料 and 宝石的骆驼入城，大汉的丝绸源源不断向西运去，万国来朝。', 
        knowledgeDetail: '这代表了“凿空”后人们对未来繁荣贸易之憧憬，展示了丝绸之路带来的直接经贸成果。', 
        type: 'plot', 
        isFound: true, 
        image: 'https://www.imgur.la/images/2026/02/08/87465627e58f8c9bd67b4c575bc79147.png' 
      },
      { 
        id: 'c_silk_road_trade_records', 
        title: '丝路物产与贸易文献汇编', 
        content: '[《汉书》物产记载] “宛王蝉封与汉约，岁献天马二匹. 汉使采蒲陶、目宿种归。”\n[《丝绸之路》研究] “贸易的主要产品是丝绸。在汉朝，丝绸与钱币、粮食一样可以用作支付军饷。从某种意义上讲，丝绸是一种最值得信赖的货币” (——彼得·弗兰科潘)\n[《史记》大宛物产] “（大宛）其俗土著，耕田，田稻麦. 有蒲陶酒，多善马……汉使取其实来，于是天子始种苜蓿、蒲陶肥饶地。”', 
        knowledgeDetail: '本汇编综合了《史记》、《汉书》及现代学术研究，详细记载了汉朝通过丝绸之路引进良马、葡萄、苜蓿等物种的过程，并论证了丝绸在国际贸易中作为重要“货币”的信用地位。', 
        type: 'history', 
        isFound: false, 
        image: 'https://www.imgur.la/images/2026/02/08/83c157cd29408817f94b95ff76e640ca.jpeg' 
      },
      { 
        id: 'c_trade_summary', 
        title: '丝路互通总表', 
        content: '汉朝输出：丝绸、漆器、开渠、凿井、铸铁技术；\n西域传入：核桃、葡萄、石榴、苜蓿、良马、香料、玻璃、宝石、乐器歌舞。', 
        knowledgeDetail: '总结了汉朝与西域之间全方位的物质与技术交流，是大汉文明影响力的体现。', 
        type: 'history', 
        isFound: false, 
        image: 'https://www.imgur.la/images/2026/02/08/2758126d7686e93b0906f6d741b85c65.png' 
      },
      { 
        id: 'c_xiyu_atlas', 
        title: '《西域山川图志》', 
        content: '上面标注着路线：长安—河西走廊—西域—中亚—西亚—欧洲（大秦）。', 
        knowledgeDetail: '这是商队赖以生存的地理向导，详细记录了张骞开辟的丝路全线。', 
        type: 'history', 
        isFound: false, 
        image: 'https://www.imgur.la/images/2026/02/08/e0ac5aa39fb698b876438250101fe9df.jpeg' 
      },
      { 
        id: 'c_hanshu_xiyu', 
        title: '《汉书·西域传》摘录', 
        content: '“自玉门、阳关出西域有两道. 从鄯善傍南山北，波河西行至莎车，为南道；自车师前王廷随北山，波河西行至疏勒，为北道。”', 
        knowledgeDetail: '记载了丝绸之路在西域境内分化出的南北两条主要交通干线。', 
        type: 'history', 
        isFound: true, 
        image: 'https://www.imgur.la/images/2025/12/24/9560713157b9635c3ecb74db0848477c.png' 
      },
      { 
        id: 'c_hengchui', 
        title: '胡乐考据', 
        content: '“横吹，胡乐也. 张博望(张骞)入西域，传其法于西(长安)，唯得《摩诃》《兜勒》二曲。”——《古今注》', 
        knowledgeDetail: '证明了丝绸之路不仅是物质贸易之路，更是文化与艺术的交流之路。', 
        type: 'history', 
        isFound: true, 
        image: 'https://www.imgur.la/images/2025/12/24/f464bb10ffca6f3e4af7f99a40c8f06a.png' 
      },
      { 
        id: 'c_houhanshu', 
        title: '《后汉书·西域传》记载', 
        content: '“立屯田于膏腴之野，列邮置于要害之路... 帝于是遣使天竺问佛道法，遂于中国图画形象焉。”', 
        knowledgeDetail: '记录了汉朝在西域的屯田管理以及佛教通过丝绸之路传入中原的早期踪迹。', 
        type: 'history', 
        isFound: true, 
        image: 'https://www.imgur.la/images/2025/12/24/738ef2b11f9a194a22dcbf428cfdc400.png' 
      },
      { 
        id: 'c_xiongnu_token', 
        title: '奇怪的令牌', 
        content: '刻着奇怪的文字，似乎不是汉朝的篆书，而是某种草原民族的图腾. ', 
        knowledgeDetail: '这可能是匈奴内部高级将领的信物，为何会出现在汉朝的驿站之中？', 
        type: 'plot', 
        isFound: true, 
        image: 'https://www.imgur.la/images/2026/02/08/4.png' 
      },
      { 
        id: 'c_xiongnu_history_compilation', 
        title: '《史记·匈奴列传》文献三篇汇编', 
        content: '[《民俗篇》 "匈奴……逐水草迁徙，毋城郭常处耕田之业，然亦各有分地. 毋文书，以言语为约束. 儿能骑羊，引弓射鸟鼠；少长则射狐兔，用为食. 士力能弯弓，尽为甲骑. 其俗，宽则随畜，因射猎禽兽为生业，急则人习战攻以侵伐，其天性也。"\n[外交篇] "高祖乃使刘敬奉宗室女公主为单于阏氏，岁奉匈奴絮缯酒米食物各有数，约为昆弟以和亲。"\n[武功篇] "陛下（汉武帝）以四海为境，九州为家，北畈匈奴，南诛羌夷，以安中国。"', 
        knowledgeDetail: '本汇编通过《史记》记载，从民俗、外交、军事三个维度展示了匈奴的游牧特性、汉初的和亲政策以及汉武帝时期的战略转变，是辨识匈奴文化特征的核心依据。', 
        type: 'history', 
        isFound: false, 
        image: 'https://www.imgur.la/images/2026/02/08/9dff37365f4df5d5e6cbd0d0839ee605.jpeg' 
      },
      { 
        id: 'c_pigeon_feather', 
        title: '沾着鸽羽的衣角', 
        content: '在匈奴流亡王子的衣角边，残留着几根细小的白色鸽毛，似乎是喂养信鸽时留下的痕迹. ', 
        knowledgeDetail: '物证之一，直接将信鸽传信的疑虑指向了王子。', 
        type: 'plot', 
        isFound: false, 
        image: 'https://images.unsplash.com/photo-1596701062351-be5f6a210331?auto=format&fit=crop&w=300' 
      },
      { 
        id: 'c_xiyu_duhufu_60bc', 
        title: '西域都护府设置 (公元前60年)', 
        content: '公元前60年，西汉朝廷在乌垒城设置西域都护府，以西域都护为管理西域的最高长官。西域都护府的设置，标志着西域正式归属中央政权。', 
        knowledgeDetail: '西域都护颁行汉朝的号令，调遣军队，征发粮草，对西域地区进行有效治理，管辖范围包括今新疆及巴尔喀什湖以东、以南的广大地区。', 
        type: 'history', 
        isFound: false, 
        image: 'https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?auto=format&fit=crop&w=300' 
      },
      { 
        id: 'c_hanshu_zhengji_quote', 
        title: '《汉书·西域传》郑吉记载', 
        content: '“匈奴日逐王先贤掸将人众万余来降。使都护西域骑都尉郑吉迎日逐，破车师，皆封列侯……乃因使吉并护北道，故号曰都护。都护之起，自吉置矣。”', 
        knowledgeDetail: '记载了西域都护职位的由来，以及汉朝通过军事 and 政治手段整合西域南北道的关键转折。', 
        type: 'history', 
        isFound: false, 
        image: 'https://images.unsplash.com/photo-1585241645927-c7a8e5840c42?auto=format&fit=crop&w=300' 
      }
    ],
    quiz: [
      { 
        id: 1, 
        question: '张骞第一次出使西域的主要目的是什么？', 
        options: ['联络大月氏夹击匈奴', '购买汗血宝马', '传播汉朝文化', '开辟丝绸之路'], 
        correctAnswer: 0, 
        explanation: '汉武帝派张骞出使西域的初衷是军事目的，即联络大月氏夹击匈奴。' 
      },
      { 
        id: 2, 
        question: '汉朝通过丝绸之路传入西域的技术是（）', 
        options: ['冶铁技术', '佛教', '玻璃制造', '葡萄种植'], 
        correctAnswer: 0, 
        explanation: '汉朝的冶铁技术在当时处于世界领先水平，通过丝绸之路传入西域，推动了西域地区的手工业发展；佛教、玻璃制造技术是从西域或西方传入中原的；葡萄种植则是西域传入中原的农业技术。' 
      },
      { 
        id: 3, 
        question: '“通过这条路，中国的丝绸、造纸、火药、印刷术等传到西方，佛教、伊斯兰教、阿拉伯的音乐舞蹈也来到中国。”这句话说明丝绸之路促进了（）', 
        options: ['经济重心的南移', '民族融合的加强', '大一统局面的形成', '中外文明的交流'], 
        correctAnswer: 3, 
        explanation: '这句话明确提到中国的丝绸、四大发明等传入西方，同时西方的宗教、艺术等传入中国，直接体现了丝绸之路作为中外文明交流桥梁的作用；经济重心南移是中国国内的经济格局变化，民族融合是国内各民族间的交流，大一统局面形成与丝绸之路的文明交流属性无关。' 
      },
      { 
        id: 4, 
        question: '1884年，清政府在西北边疆设新疆省，取“故土新归”之意。新疆地区正式归属中央政权的标志是（）', 
        options: ['设置安西都护府', '设置伊犁将军', '设置北庭都元帅府', '设置西域都护府'], 
        correctAnswer: 3, 
        explanation: '公元前60年，西汉政府设置西域都护府，代表中央政权正式管辖西域地区，标志着新疆地区正式归属中央政权；安西都护府是唐朝管理西域的机构，伊犁将军是清朝巩固西北边防的官职，北庭都元帅府是元朝管理西域的机构。' 
      },
      { 
        id: 5, 
        question: '西汉时开辟的横跨欧亚大陆的“丝绸之路”，给世界留下了“和平合作、开放包容、互学互鉴、互利共赢”的精神遗产。这条“丝绸之路”从东向西的路线是（）', 
        options: [
            '长安→河西走廊→西域→中亚→欧洲、北非', 
            '长安→河西走廊→中亚→西域→欧洲、北非', 
            '洛阳→中亚→河西走廊→西域→欧洲、北非', 
            '洛阳→河西走廊→西域→中亚→欧洲、北非'
        ], 
        correctAnswer: 0, 
        explanation: '西汉丝绸之路的起点是都城长安，路线走向为：长安→河西走廊（今甘肃地区）→西域（今新疆及中亚东部地区）→中亚→欧洲、北非. 洛阳并非西汉丝绸之路的起点，且路线顺序上必须先经过西域，再进入中亚。' 
      },
      { 
        id: 6, 
        type: 'short',
        question: '结合材料和剧本，分析材料中“张骞凿空”的内涵并概括丝绸之路的影响。', 
        material: '张骞通西域，史称“张骞凿空”，“西北国始通于汉矣”。......当时经这条道路运往西方的商品有蚕丝、丝织品、漆器、铁器等，铸铁 and 凿井技术也在这时西传。西方输进中国的商品有良马、橐驼、香料、葡萄、石榴、苜蓿、胡麻、胡瓜、胡豆、胡豆、胡桃等。\n——袁行霈《中华文明史（第二卷）》',
        explanation: '“凿空”是指张骞开辟了通往西域的道路，在此之前中原与西域互不往来，处于隔绝状态。丝绸之路的影响：它是古代东西方往来的大动脉，极大地促进了中国同其他国家 and 地区的经济文化交流，促进了物种的互通 and 文明的交融，对人类文明的发展产生了深远影响。' 
      },
    ]
};