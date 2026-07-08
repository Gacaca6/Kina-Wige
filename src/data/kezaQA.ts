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

  // === APP MANUAL / HELP (Baza Keza acts as a kid-friendly guide) ===
  {
    keywords: ['baza keza', 'who are you', 'uri nde', 'uri nde', 'qui es-tu', 'what are you', 'uri iki'],
    answer: {
      KN: 'Ndi Keza, inshuti yawe muri Kina Wige! Ushobora kumbaza ikibazo cyose ku isuku, ibiryo, kubara, cyangwa amabara. Kanda kuri mikoro cyangwa wandike!',
      EN: 'I am Keza, your friend in Kina Wige! You can ask me anything about washing, food, counting, or colors. Tap the mic or type!',
      FR: 'Je suis Keza, ton amie dans Kina Wige! Tu peux me poser une question sur le lavage, la nourriture, compter ou les couleurs. Appuie sur le micro ou écris!',
    },
    emoji: '💚',
    topic: 'app',
  },
  {
    keywords: ['ndashaka ubufasha', 'ufasha iki', 'what can you do', 'help me', 'aide-moi', 'que fais-tu', 'ushobora iki'],
    answer: {
      KN: 'Ndagufasha kwiga! Mbaza ku gukaraba amaboko, ibiryo byiza, kubara, amabara, cyangwa uko ukoresha Kina Wige. Ngwino tubaze!',
      EN: 'I help you learn! Ask me about washing hands, healthy food, counting, colors, or how to use Kina Wige. Come and ask!',
      FR: 'Je t\'aide à apprendre! Demande-moi le lavage des mains, la bonne nourriture, compter, les couleurs, ou comment utiliser Kina Wige!',
    },
    emoji: '🙋',
    topic: 'app',
  },
  {
    keywords: ['imikino ikinwa', 'how do i play', 'how to play', 'uko nkina', 'comment jouer', 'play games', 'nkina gute'],
    answer: {
      KN: 'Kugira ngo ukine, kanda "Imikino" hasi ku rupapuro. Hari imikino myinshi: gukaraba, kwibuka, kubara, gukurikiranya, no guhitamo ibiryo!',
      EN: 'To play, tap "Games" at the bottom of the screen. There are many games: washing, memory, counting, patterns, and choosing food!',
      FR: 'Pour jouer, appuie sur "Jeux" en bas de l\'écran. Il y a plein de jeux: laver, mémoire, compter, suites, et choisir la nourriture!',
    },
    emoji: '🎮',
    topic: 'app',
  },
  {
    keywords: ['kureba amasomo', 'how to watch', 'watch video', 'watch episode', 'episodes', 'regarder', 'reba video'],
    answer: {
      KN: 'Kugira ngo urebe amasomo, kanda "Amasomo" hasi. Reba Keza na Hirwa biga isuku n\'ibindi byinshi!',
      EN: 'To watch episodes, tap "Episodes" at the bottom. Watch Keza and Hirwa learn about hygiene and much more!',
      FR: 'Pour regarder les épisodes, appuie sur "Épisodes" en bas. Regarde Keza et Hirwa apprendre l\'hygiène et plus!',
    },
    emoji: '📺',
    topic: 'app',
  },
  {
    keywords: ['inyenyeri', 'stars', 'star', 'étoile', 'étoiles', 'amanota', 'points', 'how do i get stars', 'nabona inyenyeri'],
    answer: {
      KN: 'Ubona inyenyeri iyo urangije umukino cyangwa ibibazo neza! Kina kenshi wongere inyenyeri zawe!',
      EN: 'You earn stars when you finish a game or a quiz! Play often to collect more stars!',
      FR: 'Tu gagnes des étoiles quand tu finis un jeu ou un quiz! Joue souvent pour en avoir plus!',
    },
    emoji: '⭐',
    topic: 'app',
  },
  {
    keywords: ['ururimi', 'language', 'langue', 'change language', 'changer la langue', 'hindura ururimi', 'kinyarwanda english'],
    answer: {
      KN: 'Ushobora guhindura ururimi! Kanda agapfundikizo ka "KN", "EN", cyangwa "FR" hejuru iburyo. Dukoresha Ikinyarwanda, Icyongereza, n\'Igifaransa!',
      EN: 'You can change the language! Tap the "KN", "EN", or "FR" button at the top right. We speak Kinyarwanda, English, and French!',
      FR: 'Tu peux changer la langue! Appuie sur le bouton "KN", "EN" ou "FR" en haut à droite. On parle kinyarwanda, anglais et français!',
    },
    emoji: '🌍',
    topic: 'app',
  },
  {
    keywords: ['ababyeyi', 'parents section', 'parent zone', 'igice cy\'ababyeyi', 'section parents', 'for parents'],
    answer: {
      KN: 'Igice cy\'Ababyeyi ni ku babyeyi bawe! Kanda "Ababyeyi" hasi. Bahabona ibyo wize n\'imikino yo gukorera mu rugo.',
      EN: 'The Parents section is for your parents! Tap "Parents" at the bottom. They see what you learned and activities to do at home.',
      FR: 'La section Parents est pour tes parents! Appuie sur "Parents" en bas. Ils voient ce que tu as appris et des activités à la maison.',
    },
    emoji: '👨‍👩‍👧',
    topic: 'app',
  },
  {
    keywords: ['ahabanza', 'go home', 'go back', 'gusubira inyuma', 'retour', 'accueil', 'subira ahabanza'],
    answer: {
      KN: 'Kugira ngo usubire ku ntangiriro, kanda "Ahabanza" hasi, cyangwa akambi k\'inyuma hejuru ibumoso!',
      EN: 'To go back home, tap "Home" at the bottom, or the back arrow at the top left!',
      FR: 'Pour revenir à l\'accueil, appuie sur "Accueil" en bas, ou la flèche retour en haut à gauche!',
    },
    emoji: '🏠',
    topic: 'app',
  },
  {
    keywords: ['nde wakoze', 'who made', 'who created', 'qui a fait', 'who built you', 'wakoze iyi app', 'made this app'],
    answer: {
      KN: 'Kina Wige yakozwe n\'abantu bakunda abana bo mu Rwanda, kugira ngo wige mu rurimi rwawe! Baza umubyeyi wawe amakuru menshi.',
      EN: 'Kina Wige was made by people who love children in Rwanda, so you can learn in your own language! Ask your parent to know more.',
      FR: 'Kina Wige a été créé par des gens qui aiment les enfants du Rwanda, pour que tu apprennes dans ta langue! Demande à tes parents pour en savoir plus.',
    },
    emoji: '💚',
    topic: 'app',
  },
  {
    keywords: ['internet', 'offline', 'murandasi', 'nta internet', 'without internet', 'sans internet', 'ikora nta'],
    answer: {
      KN: 'Yego! Kina Wige ikora nta murandasi (internet)! Ushobora gukina no kwiga aho ariho hose, igihe cyose!',
      EN: 'Yes! Kina Wige works without internet! You can play and learn anywhere, anytime!',
      FR: 'Oui! Kina Wige marche sans internet! Tu peux jouer et apprendre partout, tout le temps!',
    },
    emoji: '📶',
    topic: 'app',
  },
  {
    keywords: ['uko mbaza', 'how to ask', 'microphone', 'mikoro', 'keyboard', 'clavier', 'how do i talk to you', 'andika'],
    answer: {
      KN: 'Kugira ngo umbaze, kanda kuri mikoro (🎙️) uvuge, cyangwa kanda ku buto bw\'imyandikire wandike ikibazo cyawe!',
      EN: 'To ask me, tap the mic (🎙️) and speak, or tap the keyboard and type your question!',
      FR: 'Pour me demander, appuie sur le micro (🎙️) et parle, ou appuie sur le clavier et écris ta question!',
    },
    emoji: '🎙️',
    topic: 'app',
  },
  {
    keywords: ['shakisha bimwe', 'memory game', 'memory match', 'umukino wo kwibuka', 'jeu de mémoire'],
    answer: {
      KN: 'Mu mukino "Shakisha Bimwe", hindukiza udukarita ushakishe tumwe tumeze kimwe! Bituma wibuka neza.',
      EN: 'In "Memory Match", flip the cards to find matching pairs! It helps your memory grow strong.',
      FR: 'Dans "Mémoire", retourne les cartes pour trouver les paires identiques! Ça aide ta mémoire à devenir forte.',
    },
    emoji: '🧠',
    topic: 'app',
  },
  {
    keywords: ['umukino wa bara', 'counting game', 'count game', 'jeu compter', 'game yo kubara'],
    answer: {
      KN: 'Mu mukino "Bara!", bara ibintu ubona hanyuma uhitemo umubare nyawo! Bikwigisha kubara.',
      EN: 'In "Count!", count the things you see, then pick the right number! It teaches you to count.',
      FR: 'Dans "Compte!", compte les choses que tu vois puis choisis le bon nombre! Ça t\'apprend à compter.',
    },
    emoji: '🔢',
    topic: 'app',
  },
  {
    keywords: ['ikurikira ni iki', 'pattern game', 'jeu de suite', 'game y\'urutonde', 'what comes next game'],
    answer: {
      KN: 'Mu mukino "Ikurikira ni Iki?", reba urutonde rw\'ibintu hanyuma uhitemo igikurikira! Bikwigisha gutekereza.',
      EN: 'In "What Comes Next?", look at the pattern, then choose what comes next! It teaches you to think.',
      FR: 'Dans "Que Vient Ensuite?", regarde la suite puis choisis ce qui vient après! Ça t\'apprend à réfléchir.',
    },
    emoji: '🧩',
    topic: 'app',
  },
  {
    keywords: ['hitamo ibiryo', 'sorting game', 'food game', 'jeu de tri', 'umukino w\'ibiryo'],
    answer: {
      KN: 'Mu mukino "Hitamo Ibiryo Byiza", hitamo niba ikiryo ari cyiza cyangwa kitari cyiza ku buzima! Bikwigisha ibiryo byiza.',
      EN: 'In "Pick Healthy Food", choose whether a food is healthy or not! It teaches you about good food.',
      FR: 'Dans "Choisis les Bons Aliments", choisis si un aliment est bon ou non pour la santé! Ça t\'apprend la bonne nourriture.',
    },
    emoji: '🥗',
    topic: 'app',
  },

  // === CURIOSITY: "WHY" & SCIENCE QUESTIONS ===
  {
    keywords: ['ikirere', 'sky', 'ciel', 'why is the sky blue', 'kuki ikirere', 'ciel bleu'],
    answer: {
      KN: 'Ikirere kibonekana ubururu kubera urumuri rw\'izuba rukwira mu kirere! Ni cyiza cyane, sibyo?',
      EN: 'The sky looks blue because sunlight spreads across the air! It is very beautiful, isn\'t it?',
      FR: 'Le ciel paraît bleu parce que la lumière du soleil se répand dans l\'air! C\'est très beau, non?',
    },
    emoji: '🌤️',
    topic: 'curiosity',
  },
  {
    keywords: ['ukwezi', 'moon', 'lune', 'nijoro', 'night', 'nuit', 'izuba rigiye he', 'stars in the sky'],
    answer: {
      KN: 'Nijoro, izuba rijya kuruhuka undi ruhande rw\'isi, ukwezi n\'inyenyeri bikaza mu kirere! Ni igihe cyo gusinzira.',
      EN: 'At night, the sun goes to rest on the other side of the world, and the moon and stars come out! It is time to sleep.',
      FR: 'La nuit, le soleil va se reposer de l\'autre côté du monde, et la lune et les étoiles apparaissent! C\'est l\'heure de dormir.',
    },
    emoji: '🌙',
    topic: 'curiosity',
  },
  {
    keywords: ['inyoni', 'bird', 'birds', 'oiseau', 'oiseaux', 'kuguruka', 'fly', 'voler'],
    answer: {
      KN: 'Inyoni zifite amababa afasha kuguruka mu kirere! Zubaka ibyari kandi ziririmba mu gitondo.',
      EN: 'Birds have wings that help them fly in the sky! They build nests and sing in the morning.',
      FR: 'Les oiseaux ont des ailes pour voler dans le ciel! Ils font des nids et chantent le matin.',
    },
    emoji: '🐦',
    topic: 'curiosity',
  },
  {
    keywords: ['umukororombya', 'rainbow', 'arc-en-ciel'],
    answer: {
      KN: 'Umukororombya ugaragara iyo izuba rimurika nyuma y\'imvura! Ufite amabara meza atandukanye.',
      EN: 'A rainbow appears when the sun shines after the rain! It has many beautiful colors.',
      FR: 'Un arc-en-ciel apparaît quand le soleil brille après la pluie! Il a plein de belles couleurs.',
    },
    emoji: '🌈',
    topic: 'curiosity',
  },
  {
    keywords: ['inkuba', 'thunder', 'lightning', 'tonnerre', 'umuravyo', 'storm', 'orage'],
    answer: {
      KN: 'Inkuba n\'urusaku rw\'ikirere gusa — nta cyo ikwitwaza iyo uri mu nzu! Wihangane, izarangira vuba.',
      EN: 'Thunder is just a loud noise in the sky — it cannot hurt you when you are inside! Stay calm, it will pass soon.',
      FR: 'Le tonnerre n\'est qu\'un grand bruit dans le ciel — il ne peut pas te faire de mal à l\'intérieur! Reste calme, ça passera.',
    },
    emoji: '⛈️',
    topic: 'curiosity',
  },
  {
    keywords: ['imbuto zimera', 'seed', 'seeds', 'graine', 'how do plants grow', 'ibimera bikura', 'kimera'],
    answer: {
      KN: 'Ibimera bikura biva ku mbuto nto! Bikeneye amazi, izuba, n\'ubutaka kugira ngo bikure bibe binini.',
      EN: 'Plants grow from tiny seeds! They need water, sunshine, and soil to grow big.',
      FR: 'Les plantes poussent à partir de petites graines! Elles ont besoin d\'eau, de soleil et de terre pour grandir.',
    },
    emoji: '🌱',
    topic: 'curiosity',
  },
  {
    keywords: ['ibicu', 'cloud', 'clouds', 'nuage', 'nuages'],
    answer: {
      KN: 'Ibicu ni amazi mato mato ari mu kirere! Iyo yuzuye, atangira kugwa nk\'imvura.',
      EN: 'Clouds are tiny drops of water up in the sky! When they get full, they fall as rain.',
      FR: 'Les nuages sont de petites gouttes d\'eau dans le ciel! Quand ils sont pleins, ils tombent en pluie.',
    },
    emoji: '☁️',
    topic: 'curiosity',
  },

  // === EVERYDAY CHILD PROBLEMS ===
  {
    keywords: ['umwijima', 'dark', 'noir', 'scared of the dark', 'ntinya umwijima', 'peur du noir'],
    answer: {
      KN: 'Ntutinye umwijima! Umwijima ni igihe cyo gusinzira gusa. Saba mama urumuri ruto niba ubishaka, kandi wibuke ndi hafi yawe.',
      EN: 'Don\'t be afraid of the dark! The dark is just time for sleep. Ask mama for a small light if you like, and remember I am near you.',
      FR: 'N\'aie pas peur du noir! Le noir, c\'est juste l\'heure de dormir. Demande une petite lumière à maman, et je suis près de toi.',
    },
    emoji: '🌜',
    topic: 'problem',
  },
  {
    keywords: ['inzozi mbi', 'bad dream', 'nightmare', 'cauchemar', 'narose', 'narota'],
    answer: {
      KN: 'Inzozi mbi ni nk\'inkuru gusa — ntabwo ari ukuri. Wowe uri amahoro. Bwira mama, azaguhobera.',
      EN: 'A bad dream is just like a story — it is not real. You are safe. Tell mama, she will give you a hug.',
      FR: 'Un cauchemar, c\'est comme une histoire — ce n\'est pas réel. Tu es en sécurité. Dis-le à maman, elle te fera un câlin.',
    },
    emoji: '💤',
    topic: 'problem',
  },
  {
    keywords: ['ndarambiwe', 'bored', 'boredom', 'ennui', 'je m\'ennuie', 'nothing to do'],
    answer: {
      KN: 'Ndarambiwe? Reka dukine! Gerageza umukino wa "Shakisha Bimwe" cyangwa ureba isomo rishya. Hari byinshi byo gukora!',
      EN: 'Feeling bored? Let\'s play! Try the "Memory Match" game or watch a new episode. There is so much to do!',
      FR: 'Tu t\'ennuies? Jouons! Essaie le jeu "Mémoire" ou regarde un nouvel épisode. Il y a tant à faire!',
    },
    emoji: '🎈',
    topic: 'problem',
  },
  {
    keywords: ['inda irababara', 'tummy hurts', 'stomach ache', 'mal au ventre', 'inda irwaye'],
    answer: {
      KN: 'Inda irakubabaza? Bibwire mama cyangwa papa ako kanya. Bagufasha kandi bakamenya icyo bakora. Nywa amazi wihangane.',
      EN: 'Does your tummy hurt? Tell mama or papa right away. They will help you and know what to do. Drink water and rest.',
      FR: 'Tu as mal au ventre? Préviens maman ou papa tout de suite. Ils t\'aideront. Bois de l\'eau et repose-toi.',
    },
    emoji: '🤕',
    topic: 'problem',
  },
  {
    keywords: ['narakomeretse', 'hurt myself', 'i am hurt', 'blessé', 'igikomere', 'wound', 'bobo'],
    answer: {
      KN: 'Warakomeretse? Bwira umuntu mukuru vuba! Bagukaraba igikomere bakagipfuka. Uzakira vuba, wihangane.',
      EN: 'Did you hurt yourself? Tell a grown-up quickly! They will clean the cut and cover it. You will feel better soon.',
      FR: 'Tu t\'es fait mal? Préviens vite un adulte! Il nettoiera la blessure et la couvrira. Tu iras mieux bientôt.',
    },
    emoji: '🩹',
    topic: 'problem',
  },
  {
    keywords: ['yankubise', 'someone hit me', 'hit me', 'bully', 'bullying', 'frappé', 'baranyubise'],
    answer: {
      KN: 'Umuntu yaragukubise? Ntibyiza gukubita! Bwira umwarimu cyangwa umubyeyi ako kanya. Ntukwiye kubabazwa.',
      EN: 'Did someone hit you? Hitting is not okay! Tell a teacher or a parent right away. You do not deserve to be hurt.',
      FR: 'Quelqu\'un t\'a frappé? Frapper, ce n\'est pas bien! Préviens un enseignant ou un parent tout de suite.',
    },
    emoji: '🫂',
    topic: 'problem',
  },
  {
    keywords: ['numva mama', 'miss mama', 'miss mummy', 'lonely', 'wenyine', 'i miss', 'maman me manque'],
    answer: {
      KN: 'Wumva mama? Ni ukubera umukunda cyane! Azagaruka. Muri iki gihe, dukine hamwe cyangwa dusome inkuru.',
      EN: 'Do you miss mama? That\'s because you love her so much! She will come back. For now, let\'s play or hear a story.',
      FR: 'Maman te manque? C\'est parce que tu l\'aimes très fort! Elle reviendra. En attendant, jouons ou écoutons une histoire.',
    },
    emoji: '💗',
    topic: 'problem',
  },
  {
    keywords: ['sinshaka kurya', 'don\'t want to eat', 'not hungry', 'pas faim', 'kurya oya'],
    answer: {
      KN: 'Ntushaka kurya? Ibiryo bituma ukura ukagira imbaraga zo gukina! Gerageza kurya gato gato. Rya n\'imboga n\'imbuto.',
      EN: 'You don\'t want to eat? Food helps you grow and gives you energy to play! Try eating little by little. Eat vegetables and fruit.',
      FR: 'Tu ne veux pas manger? La nourriture t\'aide à grandir et à jouer! Essaie de manger petit à petit.',
    },
    emoji: '🍲',
    topic: 'problem',
  },
  {
    keywords: ['ntisaranganya', 'won\'t share', 'sharing problem', 'ne partage pas', 'friend share'],
    answer: {
      KN: 'Inshuti yawe ntishaka gusaranganya? Musabe neza uti "ndagusabye". Niba bitagenda, bibwire umukuru. Nawe usaranganye!',
      EN: 'Your friend won\'t share? Ask kindly, say "please". If it doesn\'t work, tell a grown-up. And remember to share too!',
      FR: 'Ton ami ne veut pas partager? Demande gentiment, dis "s\'il te plaît". Sinon, préviens un adulte. Et partage aussi!',
    },
    emoji: '🤝',
    topic: 'problem',
  },
  {
    keywords: ['nananiwe', 'i am tired', 'fatigué', 'ndananiwe', 'sleepy', 'j\'ai sommeil'],
    answer: {
      KN: 'Wananiwe? Umubiri wawe urashaka kuruhuka. Ruhuka gato, unywe amazi. Niba ari nijoro, ni igihe cyo gusinzira.',
      EN: 'Are you tired? Your body wants to rest. Take a little rest and drink water. If it is night, it is time to sleep.',
      FR: 'Tu es fatigué? Ton corps veut se reposer. Repose-toi un peu et bois de l\'eau. Si c\'est la nuit, va dormir.',
    },
    emoji: '😴',
    topic: 'problem',
  },
  {
    keywords: ['sinshaka kujya ku ishuri', 'don\'t want to go to school', 'school scared', 'peur de l\'école'],
    answer: {
      KN: 'Ntushaka kujya ku ishuri? Ku ishuri wiga ibintu bishya kandi ugakina n\'inshuti! Bizajya byoroha. Bwira mama uko wiyumva.',
      EN: 'You don\'t want to go to school? At school you learn new things and play with friends! It gets easier. Tell mama how you feel.',
      FR: 'Tu ne veux pas aller à l\'école? À l\'école tu apprends et tu joues avec des amis! Dis à maman comment tu te sens.',
    },
    emoji: '🏫',
    topic: 'problem',
  },
  {
    keywords: ['nanyaririye', 'wet the bed', 'bedwetting', 'pipi au lit', 'nanyaye mu buriri'],
    answer: {
      KN: 'Wanyaririye mu buriri? Nta cyo bitwaye rwose — bibaho ku bana bose! Bwira mama muhindure. Ntugire isoni.',
      EN: 'Did you wet the bed? That\'s totally okay — it happens to all children! Tell mama to change it. Don\'t feel ashamed.',
      FR: 'Tu as fait pipi au lit? Ce n\'est pas grave — ça arrive à tous les enfants! Dis-le à maman. N\'aie pas honte.',
    },
    emoji: '💛',
    topic: 'problem',
  },
  {
    keywords: ['amenyo arababara', 'toothache', 'tooth hurts', 'mal aux dents', 'iryinyo ribabara'],
    answer: {
      KN: 'Iryinyo rirakubabaza? Bibwire umubyeyi wawe — mushobora kujya kwa muganga w\'amenyo. Wibuke kubarira amenyo kabiri ku munsi!',
      EN: 'Do you have a toothache? Tell your parent — you may need to see a dentist. Remember to brush your teeth twice a day!',
      FR: 'Tu as mal aux dents? Préviens tes parents — il faut peut-être voir un dentiste. Brosse-toi les dents deux fois par jour!',
    },
    emoji: '🦷',
    topic: 'problem',
  },

  // === BIG QUESTIONS (warm, then gently send to a parent) ===
  {
    keywords: ['abana bava he', 'where do babies come from', 'where babies', 'bébés viennent', 'how are babies made'],
    answer: {
      KN: 'Icyo ni ikibazo cyiza cyane! Ariko iki ni icyo umubyeyi wawe akubwira neza. Baza mama cyangwa papa.',
      EN: 'That\'s a very good question! But this is one your parent should tell you. Ask mama or papa.',
      FR: 'C\'est une très bonne question! Mais c\'est à tes parents de te répondre. Demande à maman ou papa.',
    },
    emoji: '💛',
    topic: 'bigquestions',
  },
  {
    keywords: ['urupfu', 'why do people die', 'death', 'mourir', 'la mort', 'gupfa', 'someone died', 'yarapfuye'],
    answer: {
      KN: 'Iki ni ikibazo gikomeye, kandi birababaza. Umubyeyi wawe ni we wakubwira neza kuri iki. Ngwino tumugane hamwe.',
      EN: 'That is a big question, and it can feel sad. Your parent is the best one to talk with you about this. Let\'s go to them together.',
      FR: 'C\'est une grande question, et ça peut rendre triste. Tes parents sont les mieux pour en parler avec toi. Allons les voir.',
    },
    emoji: '💛',
    topic: 'bigquestions',
  },
  {
    keywords: ['imana', 'god', 'dieu', 'religion', 'idini', 'gusenga', 'jesus', 'allah', 'prayer'],
    answer: {
      KN: 'Ibibazo by\'Imana n\'idini, umubyeyi wawe ni we ubikubwira nk\'uko umuryango wanyu wemera. Baza mama cyangwa papa.',
      EN: 'Questions about God and faith are for your parent to share, the way your family believes. Ask mama or papa.',
      FR: 'Les questions sur Dieu et la foi, c\'est à tes parents d\'en parler, selon votre famille. Demande à maman ou papa.',
    },
    emoji: '🙏',
    topic: 'bigquestions',
  },
  {
    keywords: ['amabara y\'uruhu', 'skin color', 'different colors people', 'why are people different', 'couleur de peau'],
    answer: {
      KN: 'Abantu bose ni beza uko bakabaye — abafite uruhu rwijimye n\'urwera bose ni abantu bafite agaciro! Twese turasa mu mutima.',
      EN: 'All people are beautiful just as they are — dark skin, light skin, everyone is a special person! Inside, we are all the same.',
      FR: 'Toutes les personnes sont belles telles qu\'elles sont — peau foncée ou claire, chacun est spécial! À l\'intérieur, on est pareils.',
    },
    emoji: '🌍',
    topic: 'values',
  },

  // === MANNERS & SOCIAL (more) ===
  {
    keywords: ['imbabazi', 'sorry', 'mbabarira', 'pardon', 'apologize', 'excuse'],
    answer: {
      KN: 'Iyo ukoze ikibi, vuga uti "mbabarira". Gusaba imbabazi byerekana ko uri umwana mwiza kandi bikomeza ubucuti.',
      EN: 'When you do something wrong, say "sorry". Apologizing shows you are a kind child and keeps friendships strong.',
      FR: 'Quand tu fais une erreur, dis "pardon". S\'excuser montre que tu es gentil et garde l\'amitié forte.',
    },
    emoji: '🤝',
    topic: 'values',
  },
  {
    keywords: ['kubeshya', 'lie', 'lying', 'truth', 'ukuri', 'mentir', 'vérité'],
    answer: {
      KN: 'Ni byiza kuvuga ukuri buri gihe! Kubeshya bibabaza abandi. Nubwo watinya, vuga ukuri — abagukunda bazagukunda kurushaho.',
      EN: 'It is best to always tell the truth! Lying hurts others. Even if you feel scared, tell the truth — those who love you will love you more.',
      FR: 'Il vaut mieux toujours dire la vérité! Mentir fait mal aux autres. Même si tu as peur, dis la vérité.',
    },
    emoji: '💬',
    topic: 'values',
  },
  {
    keywords: ['uruhererekane', 'taking turns', 'take turns', 'gukurikirana', 'chacun son tour', 'wait my turn'],
    answer: {
      KN: 'Iyo mukina, buri wese agomba kugira uruhererekane! Tegereza uruhererekane rwawe wihangane — bituma bose bishimira umukino.',
      EN: 'When you play, everyone should take turns! Wait for your turn patiently — it makes the game fun for everyone.',
      FR: 'Quand vous jouez, chacun son tour! Attends ton tour patiemment — le jeu est amusant pour tout le monde.',
    },
    emoji: '🔄',
    topic: 'values',
  },

  // === SELF-CARE (more) ===
  {
    keywords: ['kwambara', 'get dressed', 'clothes', 'imyenda', 's\'habiller', 'vêtements', 'wear clothes'],
    answer: {
      KN: 'Kwambara wenyine ni byiza! Ambara imyenda isukuye buri munsi. Saba mama afashe niba bigoye.',
      EN: 'Dressing yourself is great! Wear clean clothes every day. Ask mama for help if it is hard.',
      FR: 'S\'habiller tout seul, c\'est bien! Mets des vêtements propres chaque jour. Demande de l\'aide à maman si besoin.',
    },
    emoji: '👕',
    topic: 'selfcare',
  },
  {
    keywords: ['inzara', 'nails', 'ongles', 'cut nails', 'koza inzara'],
    answer: {
      KN: 'Inzara ndende zihisha udupfunyi! Saba mama akwice inzara kugira ngo intoki zawe zisukure.',
      EN: 'Long nails hide germs! Ask mama to cut your nails so your fingers stay clean.',
      FR: 'Les ongles longs cachent des microbes! Demande à maman de couper tes ongles pour garder les doigts propres.',
    },
    emoji: '✋',
    topic: 'selfcare',
  },
  {
    keywords: ['umusatsi', 'hair', 'cheveux', 'gusokoza', 'comb hair', 'koza umusatsi'],
    answer: {
      KN: 'Gusukura umusatsi bituma umera neza! Saba mama agusokoze kandi akarabe umusatsi wawe.',
      EN: 'Keeping your hair clean helps you look nice! Ask mama to comb and wash your hair.',
      FR: 'Garder les cheveux propres, c\'est bien! Demande à maman de peigner et laver tes cheveux.',
    },
    emoji: '💇',
    topic: 'selfcare',
  },
  {
    keywords: ['kurya ubutaka', 'eat dirt', 'dirty food', 'karaba imbuto', 'wash fruit', 'laver les fruits'],
    answer: {
      KN: 'Ntukarye ibintu bihumanye cyangwa ubutaka — bifite udupfunyi! Karaba imbuto mbere yo kuzirya.',
      EN: 'Don\'t eat dirty things or soil — they have germs! Wash fruit before you eat it.',
      FR: 'Ne mange pas de choses sales ou de la terre — il y a des microbes! Lave les fruits avant de les manger.',
    },
    emoji: '🍎',
    topic: 'selfcare',
  },
  {
    keywords: ['imiti', 'medicine', 'médicament', 'pills', 'umuti'],
    answer: {
      KN: 'Imiti si ibikinisho! Ntukayifate wenyine — ishobora kukurwaza. Umuti ufatwa gusa iyo umubyeyi wawe akubwiye.',
      EN: 'Medicine is not a toy! Never take it by yourself — it can make you sick. Only take medicine when your parent gives it to you.',
      FR: 'Les médicaments ne sont pas des jouets! N\'en prends jamais seul — tu pourrais tomber malade. Seulement quand un parent te le donne.',
    },
    emoji: '💊',
    topic: 'safety',
  },
  {
    keywords: ['amashanyarazi', 'electricity', 'électricité', 'socket', 'prise', 'plug'],
    answer: {
      KN: 'Amashanyarazi arica! Ntukinjize intoki cyangwa ibintu mu byuma by\'amashanyarazi. Bibwire umukuru.',
      EN: 'Electricity is very dangerous! Never put your fingers or things into electric sockets. Tell a grown-up.',
      FR: 'L\'électricité est très dangereuse! Ne mets jamais tes doigts dans les prises. Préviens un adulte.',
    },
    emoji: '⚡',
    topic: 'safety',
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
