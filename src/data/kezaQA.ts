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

  // === HYGIENE (MORE) ===
  {
    keywords: ['intambwe', 'steps', 'étapes', 'uburyo bwo gukaraba', 'how to wash'],
    answer: {
      KN: 'Intambwe zo gukaraba: shyiraho amazi, isabune, gosora hose, koza, hanagura! Ubikore mu masegonda 20!',
      EN: 'Handwashing steps: wet with water, add soap, scrub everywhere, rinse, dry! Do it for 20 seconds!',
      FR: 'Les étapes du lavage: mouille avec de l\'eau, mets du savon, frotte partout, rince, sèche! Pendant 20 secondes!',
    },
    emoji: '🧼',
    topic: 'hygiene',
  },
  {
    keywords: ['koga', 'kwiyuhagira', 'bath', 'shower', 'bain', 'se laver le corps'],
    answer: {
      KN: 'Kwiyuhagira buri munsi bituma usukura kandi umererwa neza! Koresha amazi n\'isabune.',
      EN: 'Bathing every day keeps you clean and feeling good! Use water and soap.',
      FR: 'Se laver chaque jour te garde propre et bien! Utilise de l\'eau et du savon.',
    },
    emoji: '🛁',
    topic: 'hygiene',
  },
  {
    keywords: ['inkorora', 'gukorora', 'kwitsamura', 'cough', 'sneeze', 'tousser', 'éternuer'],
    answer: {
      KN: 'Iyo ukorora cyangwa witsamura, pfuka umunwa n\'inkokora yawe! Bituma udupfunyi tudakwira ku bandi.',
      EN: 'When you cough or sneeze, cover your mouth with your elbow! It stops germs from spreading to others.',
      FR: 'Quand tu tousses ou éternues, couvre ta bouche avec ton coude! Ça empêche les microbes de se propager.',
    },
    emoji: '🤧',
    topic: 'hygiene',
  },
  {
    keywords: ['ubwiherero', 'toilet', 'toilettes', 'musarani'],
    answer: {
      KN: 'Nyuma yo gukoresha ubwiherero, karaba amaboko n\'isabune buri gihe! Ni intambwe y\'ingenzi cyane.',
      EN: 'After using the toilet, always wash your hands with soap! It is a very important step.',
      FR: 'Après les toilettes, lave-toi toujours les mains avec du savon! C\'est une étape très importante.',
    },
    emoji: '🚽',
    topic: 'hygiene',
  },

  // === HEALTH & SAFETY ===
  {
    keywords: ['gusinzira', 'kuryama', 'sleep', 'dormir', 'ibitotsi', 'tired', 'night'],
    answer: {
      KN: 'Gusinzira neza bituma ukura kandi ugira imbaraga! Abana bakwiye gusinzira amasaha menshi buri joro.',
      EN: 'Good sleep helps you grow and stay strong! Children need many hours of sleep every night.',
      FR: 'Bien dormir t\'aide à grandir et à rester fort! Les enfants ont besoin de beaucoup de sommeil chaque nuit.',
    },
    emoji: '😴',
    topic: 'health',
  },
  {
    keywords: ['siporo', 'sport', 'kwiruka', 'run', 'courir', 'exercise', 'umupira', 'ball', 'ballon'],
    answer: {
      KN: 'Gukina no kwiruka bituma umubiri ukomera! Kina hanze buri munsi, ariko wibuke gukaraba amaboko nyuma!',
      EN: 'Playing and running make your body strong! Play outside every day, but remember to wash your hands after!',
      FR: 'Jouer et courir rendent ton corps fort! Joue dehors chaque jour, mais lave-toi les mains après!',
    },
    emoji: '⚽',
    topic: 'health',
  },
  {
    keywords: ['umubu', 'imibu', 'mosquito', 'moustique', 'malariya', 'malaria', 'paludisme', 'inzitiramubu'],
    answer: {
      KN: 'Imibu ishobora kuduha malariya! Sinzira mu nzitiramubu buri joro kugira ngo imibu itakurya.',
      EN: 'Mosquitoes can give us malaria! Sleep under a mosquito net every night so they can\'t bite you.',
      FR: 'Les moustiques peuvent donner le paludisme! Dors sous une moustiquaire chaque nuit pour éviter les piqûres.',
    },
    emoji: '🦟',
    topic: 'health',
  },
  {
    keywords: ['umuhanda', 'road', 'street', 'rue', 'route', 'imodoka', 'car', 'voiture', 'kwambuka', 'cross'],
    answer: {
      KN: 'Umuhanda urimo akaga! Ntukambuke wenyine — fata ukuboko k\'umuntu mukuru, urebe ibumoso n\'iburyo.',
      EN: 'The road is dangerous! Never cross alone — hold a grown-up\'s hand and look both ways.',
      FR: 'La route est dangereuse! Ne traverse jamais seul — tiens la main d\'un adulte et regarde des deux côtés.',
    },
    emoji: '🚸',
    topic: 'safety',
  },
  {
    keywords: ['umuriro', 'fire', 'feu', 'gushya', 'brûler', 'amazi ashyushye', 'hot water'],
    answer: {
      KN: 'Umuriro urashya! Ntukwegere umuriro cyangwa amazi ashyushye. Bibwire umuntu mukuru.',
      EN: 'Fire is hot and dangerous! Never go near fire or hot water. Tell a grown-up.',
      FR: 'Le feu brûle! Ne t\'approche jamais du feu ou de l\'eau chaude. Préviens un adulte.',
    },
    emoji: '🔥',
    topic: 'safety',
  },
  {
    keywords: ['utazi', 'stranger', 'étranger', 'inconnu', 'umuntu utazi'],
    answer: {
      KN: 'Ntukurikire umuntu utazi! Iyo umuntu utazi akuvugishije, bibwire ababyeyi bawe ako kanya.',
      EN: 'Never go with someone you don\'t know! If a stranger talks to you, tell your parents right away.',
      FR: 'Ne suis jamais quelqu\'un que tu ne connais pas! Si un inconnu te parle, préviens tes parents tout de suite.',
    },
    emoji: '🛑',
    topic: 'safety',
  },

  // === NUTRITION (MORE) ===
  {
    keywords: ['imboga', 'vegetable', 'légume', 'karoti', 'carrot', 'carotte', 'isombe', 'dodo'],
    answer: {
      KN: 'Imboga zituma ukomera! Karoti, dodo, isombe... Rya imboga buri munsi kugira ngo ukure neza.',
      EN: 'Vegetables make you strong! Carrots, greens, cassava leaves... Eat vegetables every day to grow well.',
      FR: 'Les légumes te rendent fort! Carottes, légumes verts, feuilles de manioc... Manges-en chaque jour.',
    },
    emoji: '🥕',
    topic: 'nutrition',
  },
  {
    keywords: ['amata', 'milk', 'lait'],
    answer: {
      KN: 'Amata atanga kalisiyumu ikomeza amagufa n\'amenyo! Nywa amata kugira ngo ukure neza.',
      EN: 'Milk gives calcium that makes bones and teeth strong! Drink milk to grow well.',
      FR: 'Le lait donne du calcium qui rend les os et les dents forts! Bois du lait pour bien grandir.',
    },
    emoji: '🥛',
    topic: 'nutrition',
  },
  {
    keywords: ['bombo', 'sweets', 'candy', 'bonbon', 'isukari', 'sugar', 'sucre', 'soda', 'ifanta'],
    answer: {
      KN: 'Ibiryoshye byinshi byangiza amenyo! Rya bike gusa, kandi ukarabe amenyo nyuma.',
      EN: 'Too many sweets hurt your teeth! Eat only a little, and brush your teeth after.',
      FR: 'Trop de bonbons abîment les dents! Manges-en juste un peu, et brosse-toi les dents après.',
    },
    emoji: '🍬',
    topic: 'nutrition',
  },

  // === BODY ===
  {
    keywords: ['umubiri', 'body', 'corps', 'amaso', 'eyes', 'yeux', 'amatwi', 'ears', 'oreilles', 'izuru', 'nose', 'nez'],
    answer: {
      KN: 'Umubiri wawe ni uw\'agaciro! Amaso areba, amatwi yumva, izuru rihumurirwa. Wite ku mubiri wawe buri munsi!',
      EN: 'Your body is precious! Eyes see, ears hear, the nose smells. Take care of your body every day!',
      FR: 'Ton corps est précieux! Les yeux voient, les oreilles entendent, le nez sent. Prends soin de ton corps!',
    },
    emoji: '👀',
    topic: 'body',
  },

  // === NATURE ===
  {
    keywords: ['inyamaswa', 'animal', 'animaux', 'inka', 'cow', 'vache', 'ihene', 'goat', 'chèvre', 'inkoko', 'chicken', 'poule', 'imbwa', 'dog', 'chien', 'injangwe', 'cat', 'chat'],
    answer: {
      KN: 'Inyamaswa ni nziza! Inka itanga amata, inkoko itanga amagi. Ni iyihe nyamaswa ukunda?',
      EN: 'Animals are wonderful! Cows give milk, chickens give eggs. Which animal do you like best?',
      FR: 'Les animaux sont merveilleux! Les vaches donnent du lait, les poules donnent des œufs. Lequel préfères-tu?',
    },
    emoji: '🐄',
    topic: 'nature',
  },
  {
    keywords: ['imvura', 'rain', 'pluie'],
    answer: {
      KN: 'Imvura itanga amazi ku bimera no ku bantu! Iyo imvura igwa, ibihingwa birakura. Wirinde kubira imvura cyane.',
      EN: 'Rain gives water to plants and people! When it rains, crops grow. Try not to get too wet and cold.',
      FR: 'La pluie donne de l\'eau aux plantes et aux gens! Quand il pleut, les cultures poussent. Évite de trop te mouiller.',
    },
    emoji: '🌧️',
    topic: 'nature',
  },
  {
    keywords: ['izuba', 'sun', 'soleil', 'umucyo', 'ubushyuhe'],
    answer: {
      KN: 'Izuba ritanga umucyo n\'ubushyuhe! Rituma ibimera bikura. Ariko ntukarebe izuba n\'amaso yawe!',
      EN: 'The sun gives light and warmth! It helps plants grow. But never look straight at the sun!',
      FR: 'Le soleil donne la lumière et la chaleur! Il fait pousser les plantes. Mais ne le regarde jamais directement!',
    },
    emoji: '☀️',
    topic: 'nature',
  },
  {
    keywords: ['igiti', 'ibiti', 'tree', 'arbre', 'ibimera', 'plant', 'plante', 'indabyo', 'flower', 'fleur'],
    answer: {
      KN: 'Ibiti bitanga umwuka mwiza, imbuto, n\'igicucu! Dukunde ibiti kandi tubirinde.',
      EN: 'Trees give us fresh air, fruit, and shade! Let\'s love and protect trees.',
      FR: 'Les arbres donnent de l\'air pur, des fruits et de l\'ombre! Aimons et protégeons les arbres.',
    },
    emoji: '🌳',
    topic: 'nature',
  },

  // === FEELINGS ===
  {
    keywords: ['kwishima', 'ibyishimo', 'happy', 'heureux', 'contente', 'joie'],
    answer: {
      KN: 'Kwishima ni byiza! Iyo wishimye, seka kandi ubisangize abandi. Ni iki kigushimisha uyu munsi?',
      EN: 'Being happy is wonderful! When you\'re happy, smile and share it. What makes you happy today?',
      FR: 'Être heureux, c\'est merveilleux! Quand tu es content, souris et partage-le. Qu\'est-ce qui te rend heureux?',
    },
    emoji: '😊',
    topic: 'feelings',
  },
  {
    keywords: ['kubabara', 'agahinda', 'sad', 'triste', 'kurira', 'cry', 'pleurer'],
    answer: {
      KN: 'Kubabara biba kuri twese rimwe na rimwe. Bibwire umubyeyi wawe cyangwa inshuti — kuvuga bituma umutima woroherwa.',
      EN: 'Everyone feels sad sometimes. Tell your parent or a friend — talking makes your heart feel lighter.',
      FR: 'Tout le monde est triste parfois. Parle à tes parents ou à un ami — parler fait du bien au cœur.',
    },
    emoji: '🤗',
    topic: 'feelings',
  },
  {
    keywords: ['kurakara', 'umujinya', 'angry', 'fâché', 'colère'],
    answer: {
      KN: 'Iyo urakaye, fata umwuka gatatu buhoro: rimwe... kabiri... gatatu! Hanyuma ubivugane n\'umuntu mukuru.',
      EN: 'When you feel angry, take three slow breaths: one... two... three! Then talk to a grown-up about it.',
      FR: 'Quand tu es fâché, respire trois fois lentement: un... deux... trois! Puis parles-en à un adulte.',
    },
    emoji: '😮‍💨',
    topic: 'feelings',
  },
  {
    keywords: ['ubwoba', 'gutinya', 'scared', 'afraid', 'peur'],
    answer: {
      KN: 'Iyo ufite ubwoba, jya ku muntu mukuru wizeye. Kuvuga ibigutera ubwoba bituma bworoha.',
      EN: 'When you feel scared, go to a grown-up you trust. Talking about what scares you makes it smaller.',
      FR: 'Quand tu as peur, va voir un adulte de confiance. Parler de ta peur la rend plus petite.',
    },
    emoji: '💛',
    topic: 'feelings',
  },

  // === FAMILY & VALUES (MORE) ===
  {
    keywords: ['umuryango', 'famille', 'family', 'mama', 'mother', 'maman', 'papa', 'father', 'père'],
    answer: {
      KN: 'Umuryango wawe uragukunda! Umvira ababyeyi bawe kandi ufashe mu rugo.',
      EN: 'Your family loves you! Listen to your parents and help at home.',
      FR: 'Ta famille t\'aime! Écoute tes parents et aide à la maison.',
    },
    emoji: '👨‍👩‍👧‍👦',
    topic: 'values',
  },
  {
    keywords: ['ishuri', 'school', 'école', 'umwarimu', 'teacher', 'professeur'],
    answer: {
      KN: 'Ishuri ni ahantu heza ho kwiga no gukina n\'inshuti! Kwiga buri munsi bituma ugira ubwenge bwinshi.',
      EN: 'School is a great place to learn and play with friends! Learning every day makes you smarter and smarter.',
      FR: 'L\'école est un endroit génial pour apprendre et jouer avec des amis! Apprendre te rend de plus en plus fort.',
    },
    emoji: '🏫',
    topic: 'learning',
  },
  {
    keywords: ['murakoze', 'urakoze', 'thank', 'merci', 'ndagusabye', 'please', 'polite'],
    answer: {
      KN: '"Murakoze" na "ndagusabye" ni amagambo meza! Kuyavuga byerekana ko uri umwana mwiza.',
      EN: '"Thank you" and "please" are magic words! Saying them shows you are a kind child.',
      FR: '"Merci" et "s\'il te plaît" sont des mots magiques! Les dire montre que tu es un enfant gentil.',
    },
    emoji: '🙏',
    topic: 'values',
  },
  {
    keywords: ['gufasha', 'help', 'aider', 'gutabara'],
    answer: {
      KN: 'Gufasha abandi ni byiza cyane! Ushobora gufasha mama gutwara ibintu bito cyangwa gufasha inshuti yawe.',
      EN: 'Helping others is wonderful! You can help mama carry small things or help your friend.',
      FR: 'Aider les autres, c\'est merveilleux! Tu peux aider maman à porter de petites choses ou aider ton ami.',
    },
    emoji: '💪',
    topic: 'values',
  },

  // === FUN ===
  {
    keywords: ['indirimbo', 'kuririmba', 'song', 'sing', 'chanson', 'chanter', 'umuziki', 'music', 'musique', 'kubyina', 'dance', 'danser'],
    answer: {
      KN: 'Kuririmba no kubyina binezeza umutima! Ririmba indirimbo ukunda mu gihe ukaraba amaboko!',
      EN: 'Singing and dancing make the heart happy! Sing your favorite song while washing your hands!',
      FR: 'Chanter et danser rendent le cœur joyeux! Chante ta chanson préférée en te lavant les mains!',
    },
    emoji: '🎵',
    topic: 'fun',
  },
  {
    keywords: ['kina wige', 'porogaramu', 'app', 'application'],
    answer: {
      KN: 'Kina Wige ni porogaramu yawe yo gukina no kwiga! Reba amasomo, ukine imikino, wige byinshi!',
      EN: 'Kina Wige is your app for playing and learning! Watch episodes, play games, and learn lots!',
      FR: 'Kina Wige est ton application pour jouer et apprendre! Regarde les épisodes, joue et apprends plein de choses!',
    },
    emoji: '🎮',
    topic: 'characters',
  },
  {
    keywords: ['murabeho', 'bye', 'goodbye', 'au revoir', 'tuzabonana'],
    answer: {
      KN: 'Murabeho! Tuzabonana vuba! Wibuke gukaraba amaboko no gusaranganya n\'inshuti!',
      EN: 'Goodbye! See you soon! Remember to wash your hands and share with friends!',
      FR: 'Au revoir! À bientôt! N\'oublie pas de te laver les mains et de partager avec tes amis!',
    },
    emoji: '👋',
    topic: 'greeting',
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

// Fallback responses when no match found
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
