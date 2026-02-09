


import { Script } from '../../types';
import { THEME_SOVIET } from '../themes';

export const octoberRevolutionScript: Script = {
    id: 'script_oct_rev_004',
    title: '红色风暴：阿芙乐尔的炮声',
    theme: THEME_SOVIET,
    coverImage: 'https://www.imgur.la/images/2025/12/08/282c80463c3a7fb0e2b5caaf37fda665.png', 
    backgroundImage: 'https://www.imgur.la/images/2025/12/08/282c80463c3a7fb0e2b5caaf37fda665.png',
    curriculum: {
      subject: '历史',
      version: '人教版',
      grade: '九年级下册',
      unit: '第9课 列宁与十月革命',
      knowledgePoints: ['二月革命', '四月提纲', '彼得格勒武装起义', '苏维埃政权的建立'],
      coreCompetencies: ['唯物史观', '时空观念']
    },
    duration: 50,
    minPlayers: 4,
    maxPlayers: 6,
    difficulty: 4,
    description: '1917年11月6日晚，彼得格勒寒风刺骨。临时政府继续参加一战的政策激起了人民的愤怒。列宁秘密回到彼得格勒，亲自指挥起义。你是选择追随布尔什维克，还是继续支持临时政府？',
    introSlides: [
        { image: 'https://www.imgur.la/images/2025/12/08/282c80463c3a7fb0e2b5caaf37fda665.png', text: '1917年，第一次世界大战让俄国陷入崩溃边缘。前线溃败，后方饥荒。' },
        { image: 'https://www.imgur.la/images/2025/12/08/08c1076dbdbecdb6d551dbe40a13e07d.png', text: '资产阶级临时政府坚持继续战争。列宁回到彼得格勒，提出了“全部政权归苏维埃”的口号。' },
        { image: 'https://www.imgur.la/images/2025/12/08/fa36e586ce99dc87c3efe7f2ec394f52.png', text: '11月6日晚（俄历10月24日），起义的风暴在涅瓦河畔爆发。' }
    ],
    initialScenario: '彼得格勒，涅瓦河畔。冷风如刀。斯莫尔尼宫灯火通明，起义部队正在集结。但通往市中心的桥梁被临时政府军队封锁。',
    // Added missing scenes property
    scenes: [],
    roles: [
        { id: 'r_or_1', name: '赤卫队队长', avatar: '🚩', description: '彼得格勒普提洛夫工厂的工人领袖。', objective: '指挥工人赤卫队占领关键据点。', detailedProfile: '我们受够了饥饿 and 战争！临时政府不能给人民面包，只有苏维埃可以！' },
        { id: 'r_or_2', name: '阿芙乐尔号水兵', avatar: '⚓', description: '波罗的海舰队的水兵，激进的布尔什维克。', objective: '控制军舰，等待开炮信号。', detailedProfile: '舰上的军官企图把军舰开出涅瓦河，我们把他们关押了。炮口已经对准了冬宫。' },
        { id: 'r_or_3', name: '斯莫尔尼宫联络员', avatar: '📞', description: '负责列宁与起义部队之间的通讯。', objective: '确保起义指令准确传达，防止敌人切断电话线。', detailedProfile: '列宁同志就在斯莫尔尼宫指挥。今晚是决战的时刻，不能有半点差错。' },
        { id: 'r_or_4', name: '前线回来的士兵', avatar: '🔫', description: '从一战前线溃退回来的士兵，厌恶战争。', objective: '说服卫戍部队倒戈支持起义。', detailedProfile: '战壕里全是死人，家里人却在挨饿。我们要和平！我们要土地！' }
    ],
    tasks: [
        {
            id: 't_or_1',
            title: '占领要塞',
            mission: '以最小的代价夺取战略要地，确保后续部队通过。',
            description: '起义开始了！赤卫队的首要目标是控制交通要道。你们面前是尼古拉耶夫大桥，守军正在犹豫。是强攻还是劝降？',
            category: 'main',
            image: 'https://images.unsplash.com/photo-1565058696849-0d195f247950?auto=format&fit=crop&w=600',
            type: 'choice',
            options: ['强行冲锋', '政治攻势劝降', '绕路走'],
            correctAnswer: '1',
            plotUpdate: '士兵们也是穷苦人出身！在你们的宣传下，守桥部队倒戈，大桥被成功控制。',
            isCompleted: false,
            requiredForPlot: true
        },
        {
            id: 't_or_2',
            title: '炮打冬宫',
            mission: '发出进攻信号，震慑敌人，宣告革命的爆发。',
            description: '临时政府龟缩在冬宫拒绝投降。阿芙乐尔号巡洋舰接到命令，准备开炮震慑。请输入开炮的性质（是实弹还是空包弹）？',
            category: 'main',
            image: 'https://images.unsplash.com/photo-1452697620382-f6543ead73b5?auto=format&fit=crop&w=600',
            type: 'choice',
            options: ['实弹', '空包弹'],
            correctAnswer: '1',
            plotUpdate: '“轰！”一声巨响划破夜空。虽然只是空包弹，但巨大的声浪宣告了旧时代的终结。赤卫队向冬宫发起了总攻。',
            isCompleted: false,
            requiredForPlot: true
        },
        {
            id: 't_or_3',
            title: '颁布法令',
            mission: '通过法律形式巩固革命成果，满足人民对土地的渴望。',
            description: '起义胜利后，全俄工兵代表苏维埃大会开幕。列宁宣读了最重要的两个法令。一个是《和平法令》，另一个是关于农民最关心的土地问题的法令。请填写法令名称：《____法令》。',
            category: 'main',
            image: 'https://images.unsplash.com/photo-1589578527966-fd71f37b9d6a?auto=format&fit=crop&w=600',
            type: 'puzzle', 
            correctAnswer: '土地',
            plotUpdate: '苏维埃政权建立了。人类历史上第一个无产阶级专政的国家诞生了！',
            isCompleted: false,
            requiredForPlot: true
        }
    ],
    clues: [
        { id: 'cor1', title: '列宁的手稿', content: '上面写满了关于起义的具体部署。', knowledgeDetail: '列宁在起义中发挥了关键的领导作用。他的《四月提纲》指明了从资产阶级民主革命向社会主义革命转变的方向。', type: 'history', isFound: false, image: 'https://images.unsplash.com/photo-1544928147-79a79476e6a3?auto=format&fit=crop&w=300' }
    ],
    quiz: [
        { id: 1, question: '十月革命的性质是？', options: ['资产阶级民主革命', '社会主义革命', '农民起义', '民族独立战争'], correctAnswer: 1, explanation: '十月革命是人类历史上第一次胜利的社会主义革命，建立了无产阶级专政。' }
    ]
};

