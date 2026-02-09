


import { Script } from '../../types';
import { THEME_QING } from '../themes';

export const wuxuReformScript: Script = {
    id: 'script_wuxu_003',
    title: '维新变奏：戊戌年的至暗时刻',
    theme: THEME_QING,
    coverImage: 'https://www.imgur.la/images/2025/12/08/df4641893e936bdec5de319c698b90b7.png', 
    backgroundImage: 'https://www.imgur.la/images/2025/12/08/df4641893e936bdec5de319c698b90b7.png',
    curriculum: {
      subject: '历史',
      version: '人教版',
      grade: '八年级上册',
      unit: '第6课 戊戌变法',
      knowledgePoints: ['百日维新', '公车上书', '戊戌政变', '严复与《天演论》'],
      coreCompetencies: ['家国情怀', '历史解释']
    },
    duration: 50,
    minPlayers: 4,
    maxPlayers: 6,
    difficulty: 5,
    description: '1898年9月，光绪帝颁布的变法诏书引发了慈禧太后为首的顽固派的疯狂反扑。光绪帝被囚禁，维新党人命悬一线。在这历史的转折点，你能否救出谭嗣同，或者保存变法的火种？',
    introSlides: [
        { image: 'https://www.imgur.la/images/2025/12/08/df4641893e936bdec5de319c698b90b7.png', text: '1898年，甲午战败的阴云笼罩中华。列强瓜分，国将不国。' },
        { image: 'https://www.imgur.la/images/2025/12/08/fa36e586ce99dc87c3efe7f2ec394f52.png', text: '光绪皇帝任用康有为、梁启超等人，颁布明定国是诏，史称“百日维新”。' },
        { image: 'https://www.imgur.la/images/2025/12/08/image4f5da43236607a88.png', text: '然而，旧势力并不甘心退出历史舞台。9月21日，一场血腥的政变正在酝酿中……' }
    ],
    initialScenario: '北京城，浏阳会馆深夜。谭嗣同正襟危坐，窗外满是抓捕维新党人的清兵脚步声。此时，一名神秘访客敲响了门。',
    // Added missing scenes property
    scenes: [],
    roles: [
        { id: 'r_wx_1', name: '谭嗣同门生', avatar: '🎓', description: '深受谭嗣同教诲的年轻学子。', objective: '保护密诏，尽可能劝说老师撤离。', detailedProfile: '你敬佩老师“以此血唤醒国民”的决心，但你更希望为变法留存火种。' },
        { id: 'r_wx_2', name: '光绪帝密使', avatar: '🕵️', description: '手持衣带诏，寻找袁世凯求援。', objective: '辨别谁是真正的盟友，传达皇帝旨意。', detailedProfile: '皇帝被困瀛台，唯一的希望就在新建陆军。你必须在天亮前找到袁世凯。' },
        { id: 'r_wx_3', name: '时务报记者', avatar: '📰', description: '记录变法全过程，拥有广泛的情报网。', objective: '记录历史真相，揭露顽固派的阴谋。', detailedProfile: '你的笔是你的武器。你知道慈禧太后已经从颐和园回宫，政变一触即发。' },
        { id: 'r_wx_4', name: '新建陆军军官', avatar: '🎖️', description: '袁世凯的部下，倾向维新，但需服从军令。', objective: '在忠于上级 and 忠于国家之间做出抉择。', detailedProfile: '袁大人态度暧昧不明。荣禄的军队已经包围了天津。你必须判断形势。' },
    ],
    tasks: [
        {
            id: 't_wx_1',
            title: '识别衣带诏',
            mission: '确认皇帝的真实旨意，防止被假情报欺骗。',
            description: '光绪帝通过杨锐带出密诏：“朕位且不保，命康有为、梁启超等速出走……”你需要从三份文书中找出真正的密诏。',
            category: 'main',
            image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600',
            type: 'choice',
            options: ['普通的请安折子', '写在衣带上的血书密诏', '慈禧的手谕'],
            correctAnswer: '1',
            plotUpdate: '密诏确认无疑！形势万分危急，必须立即通知康梁二人撤离北京！',
            isCompleted: false,
            requiredForPlot: true
        },
        {
            id: 't_wx_2',
            title: '夜访法华寺',
            mission: '判断袁世凯是否值得信任，为维新派争取军队支持。',
            description: '谭嗣同决定孤注一掷，夜访袁世凯。作为随行人员，你需要协助谭嗣同用言语试探袁世凯的态度。袁世凯问：“此时若杀荣禄，如杀一狗耳。但太后尚在，奈何？”你应该如何回应？',
            category: 'main',
            image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600',
            type: 'choice',
            options: ['痛斥袁世凯胆小', '晓以大义，强调皇权正统', '承诺高官厚禄'],
            correctAnswer: '1',
            plotUpdate: '袁世凯虽然表面慷慨激昂，拍胸脯保证，但他眼神游离，似乎另有算盘。',
            isCompleted: false,
            requiredForPlot: true
        },
        {
            id: 't_wx_3',
            title: '菜市口诀别',
            mission: '见证 and 记录谭嗣同的牺牲，将这份精神传承下去。',
            description: '政变发生，六君子被捕。谭嗣同拒绝逃亡。请补全他的绝命诗：“我自横刀向天笑，去留肝胆____。”',
            category: 'main',
            image: 'https://images.unsplash.com/photo-1434394354979-a235cd36751d?auto=format&fit=crop&w=600',
            type: 'puzzle',
            correctAnswer: '两昆仑',
            plotUpdate: '“死得其所，快哉快哉！”谭嗣同英勇就义。他的血唤醒了无数沉睡的国人。',
            isCompleted: false,
            requiredForPlot: true
        }
    ],
    clues: [
        { id: 'cwx1', title: '袁世凯的日记', content: '记录了他当晚的真实想法，似乎早已倒向后党。', knowledgeDetail: '戊戌政变中，袁世凯的出卖是导致变法失败的直接原因之一。这也暴露了维新派寄希望于拥有实权的军阀是不可靠的。', type: 'plot', isFound: false, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300' }
    ],
    quiz: [
        { id: 1, question: '戊戌变法失败的根本原因是？', options: ['袁世凯告密', '光绪帝没有实权', '民族资产阶级力量弱小', '慈禧太后太强大'], correctAnswer: 2, explanation: '根本原因是民族资本主义发展不充分，民族资产阶级具有软弱性 and 妥协性。' }
    ]
};

