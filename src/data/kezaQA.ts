// Offline Q&A database for Baza Keza
// Keyword-matched, grouped by topic, trilingual

export interface QAEntry {
  keywords: string[];  // Match against these (lowercase)
  answer: {
    KN: string;
    EN: string;
    FR: string;
  };
  emoji: string;       // Visual response
  topic: string;       // Category
}

export const kezaQA: QAEntry[] = [
  // === HANDWASHING / HYGIENE ===
  {
    keywords: ['karaba', 'gukaraba', 'amaboko', 'wash', 'hands', 'laver', 'mains', 'hand'],
    answer: {
      KN: 'Tukaraba amaboko n\'isabune n\'amazi kugira ngo twice udupfunyi! Karaba mbere yo kurya, nyuma wo gukoresha ubwiherero, no nyuma yo gukina.',
      EN: 'We wash our hands with soap and water to remove germs! Wash before eating, after using the toilet, and after playing.',
      FR: 'On se lave les mains avec du savon et de l\'eau pour enlever les microbes! Lave-toi avant de manger, après les toilettes, et après avoir joué.',
    },
    emoji: '🧼',
    topic: 'hygiene',
  },
  {
    keywords: ['isabune', 'isabuni', 'soap', 'savon'],
    answer: {
      KN: 'Isabune ifasha kwica udupfunyi! Amazi yonyine ntabwo ahagije. Isabune ni yo nkuru mu gukaraba amaboko.',
      EN: 'Soap helps kill germs! Water alone is not enough. Soap is the hero of handwashing.',
      FR: 'Le savon aide à tuer les microbes! L\'eau seule ne suffit pas. Le savon est le héros du lavage des mains.',
    },
    emoji: '🫧',
    topic: 'hygiene',
  },
  {
    keywords: ['dupfunyi', 'udupfunyi', 'germ', 'germs', 'microbe', 'microbes', 'bacteria'],
    answer: {
      KN: 'Udupfunyi ni utuntu duto cyane tutaboneka n\'amaso! Dushobora kukurwaza. Ariko isabune n\'amazi biratwicaraho!',
      EN: 'Germs are tiny things we can\'t see with our eyes! They can make us sick. But soap and water wash them away!',
      FR: 'Les microbes sont des petites choses qu\'on ne peut pas voir! Ils peuvent nous rendre malades. Mais le savon et l\'eau les éliminent!',
    },
    emoji: '🦠',
    topic: 'hygiene',
  },
  {
    keywords: ['kurwara', 'indwara', 'sick', 'ill', 'malade', 'disease'],
    answer: {
      KN: 'Turwara iyo udupfunyi dupfuye mu mubiri wacu. Gukaraba amaboko ni bwo buryo bwiza bwo kwirinda indwara!',
      EN: 'We get sick when germs get inside our body. Washing our hands is the best way to stay healthy!',
      FR: 'On tombe malade quand les microbes entrent dans notre corps. Se laver les mains est le meilleur moyen de rester en bonne santé!',
    },
    emoji: '🤒',
    topic: 'hygiene',
  },
  {
    keywords: ['amenyo', 'teeth', 'tooth', 'brush', 'dents', 'brosser'],
    answer: {
      KN: 'Barira amenyo kabiri ku munsi — mu gitondo no nimugoroba! Koresha uburoso n\'umuti w\'amenyo.',
      EN: 'Brush your teeth twice a day — morning and evening! Use a toothbrush and toothpaste.',
      FR: 'Brosse-toi les dents deux fois par jour — le matin et le soir! Utilise une brosse à dents et du dentifrice.',
    },
    emoji: '🪥',
    topic: 'hygiene',
  },

  // === NUTRITION ===
  {
    keywords: ['kurya', 'ibiryo', 'food', 'eat', 'manger', 'nourriture', 'ifunguro'],
    answer: {
      KN: 'Kurya ibiryo byiza bifasha umubiri wacu gukura no kugira imbaraga! Rya imbuto, imboga, n\'amata.',
      EN: 'Eating good food helps our body grow and stay strong! Eat fruits, vegetables, and milk.',
      FR: 'Manger de la bonne nourriture aide notre corps à grandir et rester fort! Mange des fruits, des légumes et du lait.',
    },
    emoji: '🥗',
    topic: 'nutrition',
  },
  {
    keywords: ['imbuto', 'fruit', 'fruits'],
    answer: {
      KN: 'Imbuto ni nziza cyane! Umuneke, inanasi, imyembe... Imbuto zitanga imbaraga n\'uburozi bwiza.',
      EN: 'Fruits are wonderful! Bananas, pineapples, mangoes... Fruits give us energy and vitamins.',
      FR: 'Les fruits sont merveilleux! Bananes, ananas, mangues... Les fruits donnent de l\'énergie et des vitamines.',
    },
    emoji: '🍌',
    topic: 'nutrition',
  },
  {
    keywords: ['amazi', 'water', 'eau', 'kunywa', 'drink', 'boire'],
    answer: {
      KN: 'Kunywa amazi menshi ni byiza cyane ku mubiri wacu! Amazi meza atuma tugira imbaraga.',
      EN: 'Drinking lots of water is great for our body! Clean water keeps us strong and healthy.',
      FR: 'Boire beaucoup d\'eau est très bon pour notre corps! L\'eau propre nous garde forts et en bonne santé.',
    },
    emoji: '💧',
    topic: 'nutrition',
  },

  // === SHARING / VALUES ===
  {
    keywords: ['gusaranganya', 'share', 'sharing', 'partager', 'saranganya', 'tubyigane'],
    answer: {
      KN: 'Gusaranganya ni byiza! Iyo dusaranganije n\'inshuti zacu, bose turashimishwa.',
      EN: 'Sharing is wonderful! When we share with friends, everyone is happy.',
      FR: 'Partager, c\'est merveilleux! Quand on partage avec nos amis, tout le monde est content.',
    },
    emoji: '🤝',
    topic: 'values',
  },
  {
    keywords: ['inshuti', 'friend', 'friends', 'ami', 'amis'],
    answer: {
      KN: 'Inshuti ni abantu bakundana kandi bakinerana! Ba mwiza ku nshuti zawe.',
      EN: 'Friends are people who care about each other and play together! Be kind to your friends.',
      FR: 'Les amis sont des personnes qui s\'aiment et jouent ensemble! Sois gentil avec tes amis.',
    },
    emoji: '👫',
    topic: 'values',
  },

  // === COUNTING / LEARNING ===
  {
    keywords: ['kubara', 'count', 'number', 'compter', 'nombre', 'tubareho'],
    answer: {
      KN: 'Reka tubareho! Rimwe, bibiri, bitatu, bine, bitanu! Kubara ni byiza cyane!',
      EN: 'Let\'s count! One, two, three, four, five! Counting is so much fun!',
      FR: 'Comptons! Un, deux, trois, quatre, cinq! Compter, c\'est tellement amusant!',
    },
    emoji: '🔢',
    topic: 'learning',
  },
  {
    keywords: ['amabara', 'color', 'colors', 'couleur', 'couleurs'],
    answer: {
      KN: 'Amabara ni meza! Umutuku, icyatsi, ubururu, umuhondo... Ni ayahe mabara ubona hano?',
      EN: 'Colors are beautiful! Red, green, blue, yellow... What colors can you see around you?',
      FR: 'Les couleurs sont belles! Rouge, vert, bleu, jaune... Quelles couleurs vois-tu autour de toi?',
    },
    emoji: '🌈',
    topic: 'learning',
  },

  // === ABOUT KEZA & HIRWA ===
  {
    keywords: ['keza', 'ninde', 'who is keza', 'qui est keza'],
    answer: {
      KN: 'Ndi Keza! Nkunda kwiga ibintu bishya no gufasha abana nkanawe! Tugiye kwiga byinshi hamwe!',
      EN: 'I\'m Keza! I love learning new things and helping children like you! We\'re going to learn so much together!',
      FR: 'Je suis Keza! J\'adore apprendre de nouvelles choses et aider les enfants comme toi! On va tellement apprendre ensemble!',
    },
    emoji: '👧',
    topic: 'characters',
  },
  {
    keywords: ['hirwa', 'ninde', 'who is hirwa', 'qui est hirwa'],
    answer: {
      KN: 'Hirwa ni incuti yanjye! Akunda gukina cyane, kandi rimwe na rimwe yibagirwa gukaraba amaboko! Tumufashe kwiga.',
      EN: 'Hirwa is my best friend! He loves to play, and sometimes forgets to wash his hands! Let\'s help him learn.',
      FR: 'Hirwa est mon meilleur ami! Il adore jouer, et parfois il oublie de se laver les mains! Aidons-le à apprendre.',
    },
    emoji: '👦',
    topic: 'characters',
  },

  // === GREETINGS ===
  {
    keywords: ['muraho', 'hello', 'hi', 'bonjour', 'salut', 'amakuru', 'how are you'],
    answer: {
      KN: 'Muraho neza! Ndi Keza, nishimiye kukubona! Ubaza iki uyu munsi?',
      EN: 'Hello! I\'m Keza, so happy to see you! What would you like to ask today?',
      FR: 'Bonjour! Je suis Keza, contente de te voir! Qu\'est-ce que tu voudrais demander aujourd\'hui?',
    },
    emoji: '👋',
    topic: 'greeting',
  },
];

// Fallback responses when no match found (before hitting Gemini)
export const fallbackResponses = {
  KN: 'Ikibazo cyiza! Reka mbisubize...',
  EN: 'Great question! Let me think about that...',
  FR: 'Bonne question! Laisse-moi réfléchir...',
};

// Responses for off-topic questions
export const offTopicResponses = {
  KN: 'Ibyo biragoye! Baza umubyeyi wawe abisobanure neza.',
  EN: 'That\'s a tough one! Ask your parent to explain it to you.',
  FR: 'C\'est difficile! Demande à ton parent de t\'expliquer.',
};

// Find best match from offline database
export function findOfflineAnswer(question: string): QAEntry | null {
  const q = question.toLowerCase().trim();
  let bestMatch: QAEntry | null = null;
  let bestScore = 0;

  for (const entry of kezaQA) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (q.includes(keyword.toLowerCase())) {
        score += keyword.length; // Longer keyword matches = higher confidence
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Require at least one keyword match
  return bestScore > 0 ? bestMatch : null;
}
