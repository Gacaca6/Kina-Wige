// All site copy, in all three languages, in one file.
//
// The site is statically rendered once per locale (/, /rw/, /fr/) so a visitor
// downloads exactly one language and no switching JavaScript. That matters more
// here than anywhere: this page argues that the app is light on data, and it
// should not need a runtime to say so.
//
// ⚠️ The Kinyarwanda here is MACHINE-WRITTEN and belongs in the ROADMAP review
// queue alongside the app's strings. It is parent-facing and public.

export type Locale = 'en' | 'rw' | 'fr';

export const LOCALES: { code: Locale; label: string; href: string; htmlLang: string }[] = [
  { code: 'rw', label: 'KN', href: '/rw/', htmlLang: 'rw' },
  { code: 'en', label: 'EN', href: '/', htmlLang: 'en' },
  { code: 'fr', label: 'FR', href: '/fr/', htmlLang: 'fr' },
];

export interface Copy {
  meta: { title: string; description: string };
  nav: { how: string; learn: string; parents: string; schools: string; install: string };
  hero: {
    badge: string;
    h1a: string;
    h1b: string;
    lede: string;
    install: string;
    watch: string;
    points: string[];
    soon: string;
  };
  film: { eyebrow: string; h2: string; lede: string; caption: string };
  how: {
    eyebrow: string; h2: string; lede: string;
    items: { kn: string; name: string; body: string; icon: string }[];
  };
  learn: {
    eyebrow: string; h2: string; lede: string;
    domains: { name: string; body: string }[];
    bandsTitle: string;
    bandsLede: string;
    bands: { icon: string; name: string; what: string }[];
    contract: string;
  };
  parents: {
    eyebrow: string; h2: string; lede: string;
    reportTitle: string;
    rows: { band: string; skill: string }[];
    cards: { title: string; body: string }[];
  };
  offline: { eyebrow: string; h2: string; lede: string; stats: { n: string; label: string }[] };
  privacy: {
    eyebrow: string; h2: string; lede: string;
    yes: string[]; no: string[]; yesTitle: string; noTitle: string;
  };
  langs: { eyebrow: string; h2: string; lede: string; note: string };
  schools: { eyebrow: string; h2: string; lede: string; cta: string; body: string };
  credits: { eyebrow: string; h2: string; body: string };
  faq: { eyebrow: string; h2: string; items: { q: string; a: string }[] };
  cta: { h2: string; lede: string; install: string };
  foot: {
    tagline: string;
    product: string; company: string; legal: string;
    links: { how: string; learn: string; parents: string; schools: string; privacy: string; terms: string; contact: string };
    madeIn: string; rights: string;
  };
}

const en: Copy = {
  meta: {
    title: 'Kina Wige — play and learn, offline, in Kinyarwanda',
    description:
      'A Kinyarwanda-first learning app for children aged 3–6 in Rwanda. Works with no internet, takes no data off your phone, and can name the skill behind every screen.',
  },
  nav: { how: 'How it works', learn: 'What they learn', parents: 'For parents', schools: 'Schools', install: 'Install' },
  hero: {
    badge: 'Built in Rwanda, for Rwanda',
    h1a: 'Play. Learn.',
    h1b: 'Grow.',
    lede:
      'A learning app for children aged 3 to 6, in Kinyarwanda first. It works with no internet at all, and nothing your child does ever leaves your phone.',
    install: 'Install on this phone',
    watch: 'Watch 80 seconds',
    points: [
      'Works completely offline — install once, no data after that',
      'No account, no ads, no tracking, nothing transmitted',
      'Every screen traces to a named skill from Rwanda’s pre-primary areas',
      'Kinyarwanda first, with English and French',
    ],
    soon: 'Coming to the stores',
  },
  film: {
    eyebrow: 'See it',
    h2: 'One lesson, eighty seconds',
    lede:
      'Hygiene, from what it means to why it matters — handwashing, the germs we cannot see, teeth, and keeping our village clean.',
    caption: 'Isuku n’Ubuzima · an episode from inside the app',
  },
  how: {
    eyebrow: 'How it works',
    h2: 'Four ways in',
    lede:
      'The same four places, every time. A three-year-old learns where things are once and never has to learn again.',
    items: [
      { kn: 'Iga', name: 'Learn', icon: 'learn', body: 'A path of short lessons that remembers where your child got to, and unlocks the next step only when the last one is genuinely done.' },
      { kn: 'Amasomo', name: 'Episodes', icon: 'video', body: 'Animated stories that end with a question rather than a summary. Downloaded once, then they play forever without a connection.' },
      { kn: 'Imikino', name: 'Games', icon: 'play', body: 'Play that happens to be practice. Difficulty follows the child, not a fixed ramp — a three-year-old never gets thrown a five-year-old’s question.' },
      { kn: 'Ibitabo', name: 'Books', icon: 'book', body: 'Illustrated stories to tap through together, with the words on screen for the grown-up sitting alongside.' },
    ],
  },
  learn: {
    eyebrow: 'What they learn',
    h2: 'A real curriculum, not a pile of games',
    lede:
      'Rwanda’s six pre-primary learning areas are the spine. Singapore’s concrete-to-abstract method, Reggio’s child-as-investigator and Finland’s play-first principle supply technique — never structure.',
    domains: [
      { name: 'Language & literacy', body: 'Listening, vocabulary, the five vowels, and a syllable-first path that fits how Kinyarwanda actually works.' },
      { name: 'Numeracy', body: 'Not reciting to ten. Knowing what a number means — counting five things and answering “so how many?”' },
      { name: 'Discovery of the world', body: 'Ask, predict, look, explain. Animals, plants, weather, water, and the child’s own village.' },
      { name: 'Physical & health', body: 'Handwashing, teeth, food, safety — the part of this app with a measurable public-health outcome.' },
      { name: 'Social & emotional', body: 'Naming feelings, taking turns, sharing, and staying with something difficult.' },
      { name: 'Creative arts & culture', body: 'Rwandan songs, stories and traditions — and making something, not only watching.' },
    ],
    bandsTitle: 'Four bands. No scores, ever.',
    bandsLede:
      'A child is measured against where children of their age are expected to be, never against another child. You will never see a percentage.',
    bands: [
      { icon: '🌱', name: 'Emerging', what: 'Beginning to show the skill' },
      { icon: '🌿', name: 'Developing', what: 'Can do it with a little help' },
      { icon: '🌳', name: 'Demonstrated', what: 'Can do it on their own' },
      { icon: '⭐', name: 'Applying', what: 'Uses it somewhere new' },
    ],
    contract:
      'Nothing ships without declaring what it teaches. That is not a promise on a website — it is a check that runs when the app is built, and the build fails if a single screen cannot say what it is for.',
  },
  parents: {
    eyebrow: 'For parents',
    h2: 'You will know exactly what your child can do',
    lede:
      'Not a dashboard of numbers. Plain sentences about your own child, in your own language, that give you something to talk about at dinner.',
    reportTitle: 'What your child can do',
    rows: [
      { band: '⭐ Uses it somewhere new', skill: 'washes hands in the right order' },
      { band: '🌳 Can do it on their own', skill: 'counts five things and says how many' },
      { band: '🌿 Getting there, with a little help', skill: 'tells you what happened in a story' },
    ],
    cards: [
      { title: 'Something to do together', body: 'Every lesson ends off the screen — at a real basin, with real stones, in the garden. You tap once to say you did it together.' },
      { title: 'Twelve minutes, then it stops', body: 'A session is capped by design. We are not trying to keep your child on a phone; we are trying to hand them back to you.' },
      { title: 'One question, two minutes', body: 'After each lesson you get a single thing to ask. The pause after you ask is the part that matters.' },
    ],
  },
  offline: {
    eyebrow: 'No internet needed',
    h2: 'Built for the phone you already have',
    lede:
      'Install once on a connection you trust. After that Kina Wige is fully offline — in the bus, on the hill, at the end of the month when the bundle is gone.',
    stats: [
      { n: '0', label: 'MB of data after install' },
      { n: '100%', label: 'of the app works offline' },
      { n: '0', label: 'accounts to create' },
    ],
  },
  privacy: {
    eyebrow: 'Privacy',
    h2: 'We take nothing',
    lede:
      'Most children’s apps ask you to trust their privacy policy. Kina Wige has no server to send anything to, so there is nothing to trust us about.',
    yesTitle: 'Stays on your phone',
    yes: [
      'Your child’s progress and skill record',
      'Stars, and which episodes were opened',
      'The language you chose',
    ],
    noTitle: 'Never happens',
    no: [
      'No account, no sign-up, no email',
      'No advertising, ever',
      'No analytics and no tracking',
      'No data leaves the device — there is no server',
    ],
  },
  langs: {
    eyebrow: 'Three languages',
    h2: 'Kinyarwanda first — not translated last',
    lede:
      'The whole interface is Kinyarwanda, English and French. Instruction begins in the language your child already thinks in, and the other two arrive when a child is ready for them, not before.',
    note: 'Switch language anywhere, at any time, in one tap.',
  },
  schools: {
    eyebrow: 'Schools & partners',
    h2: 'For pre-primary schools, districts and funders',
    lede:
      'Kina Wige is built to sit inside Rwanda’s pre-primary curriculum, works on shared devices with no connectivity, and can report exactly which competences its content covers.',
    cta: 'Talk to us',
    body:
      'We are preparing a supervised pilot with real classrooms and real families. If you work in early childhood education in Rwanda, we would like to hear from you.',
  },
  credits: {
    eyebrow: 'Thanks',
    h2: 'Standing on work others shared',
    body:
      'Our thanks to Ubongo, whose Toolkit provides the alphabet songs and the Letter A episode, and to Book Dash, whose freely licensed illustrations became one of our storybooks. Ubongo makes African educational media for African children. Kina Wige exists in the same spirit.',
  },
  faq: {
    eyebrow: 'Questions',
    h2: 'Straight answers',
    items: [
      { q: 'Does it really work with no internet?', a: 'Yes. You need a connection once, to install it and to download an episode the first time you open it. After that everything — lessons, games, books, video — runs from your phone with no connection at all.' },
      { q: 'What does it cost?', a: 'Nothing. Kina Wige is free while we run our pilot. If we ever introduce a family plan we will say so plainly and long before it happens; nothing you have already installed will stop working.' },
      { q: 'How old is it for?', a: 'Three to six — the pre-primary years. It works from before a child can read, because nothing in it depends on reading: every instruction is a picture, a colour and a spoken cue.' },
      { q: 'Is it on the App Store or Google Play?', a: 'Not yet. Today you install it straight from this page, which takes seconds and needs no store account. We are preparing store releases; this page will carry the badges the moment they are real.' },
      { q: 'What do you do with my child’s data?', a: 'Nothing, because we never receive it. There is no account and no server. The progress record lives in your phone’s own storage, and clearing the app removes it completely.' },
      { q: 'Who made it?', a: 'A small Rwandan team. The curriculum follows Rwanda’s six pre-primary learning areas, and every piece of content declares which skill it teaches before it is allowed into the app.' },
    ],
  },
  cta: {
    h2: 'Start tonight',
    lede: 'Install it, hand your child the phone for twelve minutes, and see what they can do by the weekend.',
    install: 'Install Kina Wige',
  },
  foot: {
    tagline: 'A Kinyarwanda-first learning app for children aged 3–6. Made in Rwanda.',
    product: 'Product', company: 'Company', legal: 'Legal',
    links: {
      how: 'How it works', learn: 'What they learn', parents: 'For parents',
      schools: 'Schools & partners', privacy: 'Privacy', terms: 'Terms', contact: 'Contact',
    },
    madeIn: 'Made in Rwanda',
    rights: 'All rights reserved.',
  },
};

const rw: Copy = {
  meta: {
    title: 'Kina Wige — kina wige, nta murandasi, mu Kinyarwanda',
    description:
      'Porogaramu yo kwiga ku bana b’imyaka 3–6 mu Rwanda, mu Kinyarwanda mbere na mbere. Ikora nta murandasi, kandi nta makuru ava kuri telefone yawe.',
  },
  nav: { how: 'Uko ikora', learn: 'Ibyo biga', parents: 'Ku babyeyi', schools: 'Amashuri', install: 'Shyiraho' },
  hero: {
    badge: 'Byakorewe mu Rwanda, ku Rwanda',
    h1a: 'Kina. Wige.',
    h1b: 'Ukure.',
    lede:
      'Porogaramu yo kwiga ku bana b’imyaka 3 kugeza kuri 6, mu Kinyarwanda mbere na mbere. Ikora nta murandasi na mba, kandi ibyo umwana wawe akora ntibisohoka kuri telefone yawe.',
    install: 'Shyiraho kuri iyi telefone',
    watch: 'Reba amasegonda 80',
    points: [
      'Ikora nta murandasi — uyishyiraho rimwe, nta data ikenewe nyuma',
      'Nta konti, nta kwamamaza, nta gukurikirana, nta cyoherezwa',
      'Buri kintu gifitanye isano n’ubumenyi bwo mu bice bitandatu by’amashuri y’incuke',
      'Ikinyarwanda mbere, hamwe n’Icyongereza n’Igifaransa',
    ],
    soon: 'Iraza mu maduka',
  },
  film: {
    eyebrow: 'Reba',
    h2: 'Isomo rimwe, amasegonda mirongo inani',
    lede:
      'Isuku, uhereye ku cyo ari cyo kugeza ku mpamvu ari ingenzi — gukaraba amaboko, udupfunyi tutaboneka, amenyo, no kwita ku mudugudu wacu.',
    caption: 'Isuku n’Ubuzima · isomo riva muri porogaramu',
  },
  how: {
    eyebrow: 'Uko ikora',
    h2: 'Inzira enye',
    lede:
      'Ahantu hamwe buri gihe. Umwana w’imyaka itatu yiga aho ibintu biri rimwe, ntiyongere kubyiga ukundi.',
    items: [
      { kn: 'Iga', name: 'Kwiga', icon: 'learn', body: 'Inzira y’amasomo magufi yibuka aho umwana wawe yagereye, kandi ifungura intambwe ikurikira gusa iyo iyabanje irangiye koko.' },
      { kn: 'Amasomo', name: 'Amashusho', icon: 'video', body: 'Inkuru zishushanyije zirangira n’ikibazo aho kuba incamake. Zikururwa rimwe, hanyuma zigakina iteka nta murandasi.' },
      { kn: 'Imikino', name: 'Imikino', icon: 'play', body: 'Gukina ari na ko wimenyereza. Ubukana bukurikira umwana, ntibukurikire urutonde rudahinduka — umwana w’imyaka itatu ntahabwa ikibazo cy’uw’imyaka itanu.' },
      { kn: 'Ibitabo', name: 'Ibitabo', icon: 'book', body: 'Inkuru zifite amashusho mukanda muri kumwe, amagambo agaragara ku muntu mukuru wicaye iruhande.' },
    ],
  },
  learn: {
    eyebrow: 'Ibyo biga',
    h2: 'Integanyanyigisho nyakuri, atari imikino gusa',
    lede:
      'Ibice bitandatu by’amashuri y’incuke byo mu Rwanda ni byo shingiro. Uburyo bwa Singapore, ubwa Reggio n’ubwa Finland butanga ubuhanga gusa — ntabwo butanga imiterere.',
    domains: [
      { name: 'Ururimi no gusoma', body: 'Kumva, amagambo, inyajwi eshanu, n’inzira ishingiye ku nyajwi n’ingombajwi nk’uko Ikinyarwanda kimeze.' },
      { name: 'Imibare', body: 'Ntabwo ari ukubara kugeza ku icumi. Ni ukumenya icyo umubare usobanura — kubara ibintu bitanu ukavuga uko bingana.' },
      { name: 'Gushakashaka isi', body: 'Baza, tekereza, reba, sobanura. Inyamaswa, ibimera, ikirere, amazi, n’umudugudu w’umwana.' },
      { name: 'Ubuzima n’umubiri', body: 'Gukaraba amaboko, amenyo, ibiryo, umutekano — igice gitanga inyungu zigaragara ku buzima.' },
      { name: 'Imyifatire n’amarangamutima', body: 'Kuvuga amarangamutima, gutegereza, gusaranganya, no kwihangana ku kintu kigoye.' },
      { name: 'Ubuhanzi n’umuco', body: 'Indirimbo, inkuru n’imigenzo y’u Rwanda — no gukora ikintu, atari ukureba gusa.' },
    ],
    bandsTitle: 'Ibyiciro bine. Nta manota, na rimwe.',
    bandsLede:
      'Umwana apimwa ku byo abana b’imyaka ye biteganyijwe, ntabwo apimwa ku wundi mwana. Ntuzigera ubona ijanisha.',
    bands: [
      { icon: '🌱', name: 'Aratangira', what: 'Atangiye kubigaragaza' },
      { icon: '🌿', name: 'Aragenda', what: 'Arabikora afashijwe gato' },
      { icon: '🌳', name: 'Arabishoboye', what: 'Arabikora wenyine' },
      { icon: '⭐', name: 'Arabikoresha', what: 'Abikoresha mu bindi bihe' },
    ],
    contract:
      'Nta kintu gishyirwa muri porogaramu kitavuze icyo cyigisha. Si isezerano ryo ku rubuga — ni isuzuma rikorwa igihe porogaramu yubakwa, kandi kutubaka bikanga iyo hari urupapuro rutabasha kuvuga icyo rugamije.',
  },
  parents: {
    eyebrow: 'Ku babyeyi',
    h2: 'Uzamenya neza ibyo umwana wawe ashobora',
    lede:
      'Si imbonerahamwe y’imibare. Ni interuro zoroshye ku mwana wawe, mu rurimi rwawe, zikuguha icyo mwaganira nimugoroba.',
    reportTitle: 'Ibyo umwana wawe ashobora',
    rows: [
      { band: '⭐ Abikoresha mu bindi bihe', skill: 'akaraba amaboko ku murongo uwo ari wo' },
      { band: '🌳 Arabikora wenyine', skill: 'abara ibintu bitanu akakubwira uko bingana' },
      { band: '🌿 Aragenda, afashijwe gato', skill: 'akubwira ibyabaye mu nkuru' },
    ],
    cards: [
      { title: 'Icyo mukora mwembi', body: 'Buri somo rirangirira hanze ya telefone — ku karengeti, ku mabuye, mu busitani. Ukanda rimwe kwerekana ko mwabikoranye.' },
      { title: 'Iminota cumi n’ibiri, hanyuma bigahagarara', body: 'Igihe cyo gukina gifite urugero. Ntabwo tugerageza gufata umwana kuri telefone; turagerageza kumusubiza kuri wowe.' },
      { title: 'Ikibazo kimwe, iminota ibiri', body: 'Nyuma ya buri somo uhabwa ikintu kimwe cyo kubaza. Guceceka nyuma yo kubaza ni byo by’ingenzi.' },
    ],
  },
  offline: {
    eyebrow: 'Nta murandasi ukenewe',
    h2: 'Yubakiwe telefone usanzwe ufite',
    lede:
      'Uyishyiraho rimwe aho murandasi ihari. Nyuma yaho Kina Wige ikora nta murandasi na mba — mu modoka, ku musozi, mu mpera z’ukwezi iyo data yashize.',
    stats: [
      { n: '0', label: 'MB za data nyuma yo kuyishyiraho' },
      { n: '100%', label: 'bya porogaramu bikora nta murandasi' },
      { n: '0', label: 'konti zo gukora' },
    ],
  },
  privacy: {
    eyebrow: 'Ibanga',
    h2: 'Nta kintu dutwara',
    lede:
      'Porogaramu nyinshi z’abana zigusaba kwizera amategeko yazo y’ibanga. Kina Wige nta seriveri ifite yohererezwa ikintu, bityo nta cyo mudukeneyeho kutwizera.',
    yesTitle: 'Bisigara kuri telefone yawe',
    yes: [
      'Aho umwana wawe ageze n’ubumenyi afite',
      'Inyenyeri, n’amasomo yafunguye',
      'Ururimi wahisemo',
    ],
    noTitle: 'Ntibibaho na rimwe',
    no: [
      'Nta konti, nta kwiyandikisha, nta imeyili',
      'Nta kwamamaza, na rimwe',
      'Nta gusesengura, nta gukurikirana',
      'Nta makuru asohoka kuri telefone — nta seriveri ihari',
    ],
  },
  langs: {
    eyebrow: 'Indimi eshatu',
    h2: 'Ikinyarwanda mbere — ntabwo ari ubusemuzi bwa nyuma',
    lede:
      'Porogaramu yose iri mu Kinyarwanda, Icyongereza n’Igifaransa. Kwigisha bitangirira mu rurimi umwana asanzwe atekerezamo, izindi zikaza igihe umwana yiteguye, atari mbere yaho.',
    note: 'Hindura ururimi aho ariho hose, igihe cyose, ukanda rimwe.',
  },
  schools: {
    eyebrow: 'Amashuri n’abafatanyabikorwa',
    h2: 'Ku mashuri y’incuke, uturere n’abaterankunga',
    lede:
      'Kina Wige yubakiwe kujyana na gahunda y’amashuri y’incuke yo mu Rwanda, ikora kuri telefone zisangiwe nta murandasi, kandi ishobora kuvuga neza ubumenyi ibikubiyemo bigeraho.',
    cta: 'Twandikire',
    body:
      'Turimo gutegura igerageza ryitondewe hamwe n’ibyumba nyabyo n’imiryango nyayo. Niba ukora mu burezi bw’abana bato mu Rwanda, twifuza kukumva.',
  },
  credits: {
    eyebrow: 'Urakoze',
    h2: 'Twubatse ku mirimo abandi batugabiye',
    body:
      'Turashimira Ubongo, Toolkit yabo yaduhaye indirimbo z’inyuguti n’isomo ry’inyuguti A, na Book Dash, amashusho yabo yabaye kimwe mu bitabo byacu. Ubongo ikora ibikoresho by’uburezi by’Abanyafurika ku bana b’Abanyafurika. Kina Wige na yo ifite iyo ntego.',
  },
  faq: {
    eyebrow: 'Ibibazo',
    h2: 'Ibisubizo bisobanutse',
    items: [
      { q: 'Ese koko ikora nta murandasi?', a: 'Yego. Ukeneye murandasi rimwe gusa, kugira ngo uyishyireho no gukurura isomo ubwo uriteguye bwa mbere. Nyuma yaho byose — amasomo, imikino, ibitabo, amashusho — bikorera kuri telefone yawe nta murandasi.' },
      { q: 'Itwara angahe?', a: 'Nta kintu. Kina Wige ni ubuntu mu gihe cy’igerageza. Nitwaza gahunda y’umuryango tuzabivuga mu buryo bwumvikana kandi hakiri kare; ibyo wamaze gushyiraho ntibizahagarara.' },
      { q: 'Ni iy’abana b’imyaka ingahe?', a: 'Kuva ku myaka itatu kugeza kuri itandatu — igihe cy’amashuri y’incuke. Ikora n’umwana utarasoma, kuko nta kintu na kimwe gishingiye ku gusoma: buri nyandiko ni ishusho, ibara n’ijwi.' },
      { q: 'Iri ku App Store cyangwa Google Play?', a: 'Ntiraba. Ubu uyishyiraho uhereye kuri uru rubuga, bifata amasegonda make kandi nta konti y’iduka ikenewe. Turimo gutegura kuyishyira mu maduka; uru rubuga ruzagaragaza ibimenyetso ako kanya nibiba nyabyo.' },
      { q: 'Amakuru y’umwana wanjye muyakoresha mute?', a: 'Nta cyo, kuko tutayakira. Nta konti, nta seriveri. Aho umwana ageze biba mu bubiko bwa telefone yawe, kandi gusiba porogaramu bibikuraho burundu.' },
      { q: 'Ni nde wayikoze?', a: 'Itsinda rito ry’Abanyarwanda. Integanyanyigisho ikurikira ibice bitandatu by’amashuri y’incuke byo mu Rwanda, kandi buri kintu kivuga ubumenyi cyigisha mbere yo kwemererwa muri porogaramu.' },
    ],
  },
  cta: {
    h2: 'Tangira uyu mugoroba',
    lede: 'Yishyireho, uhe umwana wawe telefone iminota cumi n’ibiri, urebe ibyo azaba ashoboye ku mpera z’icyumweru.',
    install: 'Shyiraho Kina Wige',
  },
  foot: {
    tagline: 'Porogaramu yo kwiga mu Kinyarwanda ku bana b’imyaka 3–6. Byakorewe mu Rwanda.',
    product: 'Porogaramu', company: 'Ikigo', legal: 'Amategeko',
    links: {
      how: 'Uko ikora', learn: 'Ibyo biga', parents: 'Ku babyeyi',
      schools: 'Amashuri', privacy: 'Ibanga', terms: 'Amabwiriza', contact: 'Twandikire',
    },
    madeIn: 'Byakorewe mu Rwanda',
    rights: 'Uburenganzira bwose burabitswe.',
  },
};

const fr: Copy = {
  meta: {
    title: 'Kina Wige — jouer et apprendre, hors ligne, en kinyarwanda',
    description:
      'Une application d’apprentissage kinyarwanda d’abord, pour les enfants de 3 à 6 ans au Rwanda. Fonctionne sans internet et ne fait sortir aucune donnée de votre téléphone.',
  },
  nav: { how: 'Comment ça marche', learn: 'Ce qu’ils apprennent', parents: 'Pour les parents', schools: 'Écoles', install: 'Installer' },
  hero: {
    badge: 'Fait au Rwanda, pour le Rwanda',
    h1a: 'Joue. Apprends.',
    h1b: 'Grandis.',
    lede:
      'Une application d’apprentissage pour les enfants de 3 à 6 ans, en kinyarwanda d’abord. Elle fonctionne entièrement sans internet, et rien de ce que fait votre enfant ne quitte votre téléphone.',
    install: 'Installer sur ce téléphone',
    watch: 'Regarder 80 secondes',
    points: [
      'Fonctionne hors ligne — installez une fois, aucune donnée ensuite',
      'Aucun compte, aucune publicité, aucun suivi, rien n’est transmis',
      'Chaque écran correspond à une compétence des six domaines du préprimaire',
      'Kinyarwanda d’abord, avec l’anglais et le français',
    ],
    soon: 'Bientôt sur les stores',
  },
  film: {
    eyebrow: 'Voir',
    h2: 'Une leçon, quatre-vingts secondes',
    lede:
      'L’hygiène, de sa définition à son importance — se laver les mains, les microbes invisibles, les dents, et garder notre village propre.',
    caption: 'Isuku n’Ubuzima · un épisode tiré de l’application',
  },
  how: {
    eyebrow: 'Comment ça marche',
    h2: 'Quatre portes d’entrée',
    lede:
      'Les mêmes quatre endroits, à chaque fois. Un enfant de trois ans apprend où sont les choses une seule fois.',
    items: [
      { kn: 'Iga', name: 'Apprendre', icon: 'learn', body: 'Un parcours de courtes leçons qui retient où votre enfant s’est arrêté et n’ouvre l’étape suivante que lorsque la précédente est vraiment acquise.' },
      { kn: 'Amasomo', name: 'Épisodes', icon: 'video', body: 'Des histoires animées qui se terminent par une question plutôt qu’un résumé. Téléchargées une fois, elles se lisent ensuite sans connexion.' },
      { kn: 'Imikino', name: 'Jeux', icon: 'play', body: 'Du jeu qui est aussi de l’entraînement. La difficulté suit l’enfant, pas une courbe fixe — un enfant de trois ans ne reçoit jamais la question d’un enfant de cinq ans.' },
      { kn: 'Ibitabo', name: 'Livres', icon: 'book', body: 'Des histoires illustrées à parcourir ensemble, avec le texte à l’écran pour l’adulte assis à côté.' },
    ],
  },
  learn: {
    eyebrow: 'Ce qu’ils apprennent',
    h2: 'Un vrai programme, pas un tas de jeux',
    lede:
      'Les six domaines du préprimaire rwandais forment la colonne vertébrale. La méthode concret-vers-abstrait de Singapour, l’enfant-chercheur de Reggio et le jeu d’abord finlandais apportent la technique — jamais la structure.',
    domains: [
      { name: 'Langue et lecture', body: 'Écouter, le vocabulaire, les cinq voyelles, et un chemin syllabique adapté au fonctionnement réel du kinyarwanda.' },
      { name: 'Les nombres', body: 'Pas réciter jusqu’à dix. Savoir ce qu’un nombre signifie — compter cinq choses et répondre « alors, combien ? »' },
      { name: 'Découverte du monde', body: 'Demander, prédire, observer, expliquer. Les animaux, les plantes, la météo, l’eau et le village de l’enfant.' },
      { name: 'Corps et santé', body: 'Se laver les mains, les dents, la nourriture, la sécurité — la partie de cette application au bénéfice sanitaire mesurable.' },
      { name: 'Social et émotionnel', body: 'Nommer ses émotions, attendre son tour, partager, et persévérer devant une difficulté.' },
      { name: 'Arts et culture', body: 'Chansons, histoires et traditions rwandaises — et créer quelque chose, pas seulement regarder.' },
    ],
    bandsTitle: 'Quatre paliers. Jamais de notes.',
    bandsLede:
      'Un enfant est situé par rapport à ce qu’on attend de son âge, jamais par rapport à un autre enfant. Vous ne verrez jamais de pourcentage.',
    bands: [
      { icon: '🌱', name: 'Émergent', what: 'Commence à le montrer' },
      { icon: '🌿', name: 'En progrès', what: 'Y arrive avec un peu d’aide' },
      { icon: '🌳', name: 'Acquis', what: 'Y arrive tout seul' },
      { icon: '⭐', name: 'Réinvesti', what: 'L’utilise dans une situation nouvelle' },
    ],
    contract:
      'Rien n’est publié sans déclarer ce que cela enseigne. Ce n’est pas une promesse sur un site — c’est une vérification exécutée à la compilation, et la compilation échoue si un seul écran ne peut pas dire à quoi il sert.',
  },
  parents: {
    eyebrow: 'Pour les parents',
    h2: 'Vous saurez exactement ce que votre enfant sait faire',
    lede:
      'Pas un tableau de chiffres. Des phrases simples sur votre propre enfant, dans votre langue, qui vous donnent de quoi parler au dîner.',
    reportTitle: 'Ce que votre enfant sait faire',
    rows: [
      { band: '⭐ L’utilise ailleurs', skill: 'se lave les mains dans le bon ordre' },
      { band: '🌳 Y arrive tout seul', skill: 'compte cinq choses et dit combien' },
      { band: '🌿 Y arrive avec un peu d’aide', skill: 'raconte ce qui s’est passé dans une histoire' },
    ],
    cards: [
      { title: 'Quelque chose à faire ensemble', body: 'Chaque leçon se termine hors de l’écran — à un vrai lavabo, avec de vrais cailloux, dans le jardin. Vous appuyez une fois pour dire que vous l’avez fait ensemble.' },
      { title: 'Douze minutes, puis ça s’arrête', body: 'La session est plafonnée par conception. Nous ne cherchons pas à garder votre enfant sur un téléphone ; nous cherchons à vous le rendre.' },
      { title: 'Une question, deux minutes', body: 'Après chaque leçon, vous recevez une seule chose à demander. Le silence après la question est ce qui compte.' },
    ],
  },
  offline: {
    eyebrow: 'Sans internet',
    h2: 'Conçue pour le téléphone que vous avez déjà',
    lede:
      'Installez-la une fois sur une connexion sûre. Ensuite Kina Wige fonctionne entièrement hors ligne — dans le bus, sur la colline, en fin de mois quand le forfait est épuisé.',
    stats: [
      { n: '0', label: 'Mo de données après l’installation' },
      { n: '100%', label: 'de l’application fonctionne hors ligne' },
      { n: '0', label: 'compte à créer' },
    ],
  },
  privacy: {
    eyebrow: 'Confidentialité',
    h2: 'Nous ne prenons rien',
    lede:
      'La plupart des applications pour enfants vous demandent de faire confiance à leur politique de confidentialité. Kina Wige n’a aucun serveur où envoyer quoi que ce soit — il n’y a donc rien à nous confier.',
    yesTitle: 'Reste sur votre téléphone',
    yes: [
      'La progression et le relevé de compétences de votre enfant',
      'Les étoiles, et les épisodes ouverts',
      'La langue choisie',
    ],
    noTitle: 'N’arrive jamais',
    no: [
      'Aucun compte, aucune inscription, aucun e-mail',
      'Aucune publicité, jamais',
      'Aucune analyse, aucun suivi',
      'Aucune donnée ne quitte l’appareil — il n’y a pas de serveur',
    ],
  },
  langs: {
    eyebrow: 'Trois langues',
    h2: 'Le kinyarwanda d’abord — pas traduit en dernier',
    lede:
      'Toute l’interface existe en kinyarwanda, anglais et français. L’enseignement commence dans la langue où votre enfant pense déjà ; les deux autres arrivent quand il est prêt, pas avant.',
    note: 'Changez de langue partout, à tout moment, en un geste.',
  },
  schools: {
    eyebrow: 'Écoles et partenaires',
    h2: 'Pour les écoles préprimaires, les districts et les bailleurs',
    lede:
      'Kina Wige est conçue pour s’inscrire dans le programme préprimaire rwandais, fonctionne sur des appareils partagés sans connectivité, et peut indiquer précisément quelles compétences son contenu couvre.',
    cta: 'Nous contacter',
    body:
      'Nous préparons un pilote encadré avec de vraies classes et de vraies familles. Si vous travaillez dans la petite enfance au Rwanda, écrivez-nous.',
  },
  credits: {
    eyebrow: 'Remerciements',
    h2: 'Bâti sur le travail partagé par d’autres',
    body:
      'Merci à Ubongo, dont le Toolkit fournit les chansons de l’alphabet et la leçon de la lettre A, et à Book Dash, dont les illustrations libres sont devenues l’un de nos livres. Ubongo crée des médias éducatifs africains pour les enfants africains. Kina Wige existe dans le même esprit.',
  },
  faq: {
    eyebrow: 'Questions',
    h2: 'Réponses directes',
    items: [
      { q: 'Fonctionne-t-elle vraiment sans internet ?', a: 'Oui. Vous avez besoin d’une connexion une seule fois, pour l’installer et pour télécharger un épisode à sa première ouverture. Ensuite tout — leçons, jeux, livres, vidéo — fonctionne depuis votre téléphone sans aucune connexion.' },
      { q: 'Combien ça coûte ?', a: 'Rien. Kina Wige est gratuite pendant notre phase pilote. Si nous introduisons un jour une formule famille, nous le dirons clairement et bien à l’avance ; rien de ce que vous avez installé ne cessera de fonctionner.' },
      { q: 'Pour quel âge ?', a: 'De trois à six ans — les années du préprimaire. Elle fonctionne avant même que l’enfant sache lire, car rien n’y dépend de la lecture : chaque consigne est une image, une couleur et un son.' },
      { q: 'Est-elle sur l’App Store ou Google Play ?', a: 'Pas encore. Aujourd’hui vous l’installez directement depuis cette page, en quelques secondes et sans compte de store. Les versions store sont en préparation ; cette page affichera les badges dès qu’ils seront réels.' },
      { q: 'Que faites-vous des données de mon enfant ?', a: 'Rien, car nous ne les recevons jamais. Il n’y a ni compte ni serveur. Le relevé de progression vit dans le stockage de votre téléphone, et effacer l’application le supprime entièrement.' },
      { q: 'Qui l’a créée ?', a: 'Une petite équipe rwandaise. Le programme suit les six domaines du préprimaire rwandais, et chaque contenu déclare la compétence qu’il enseigne avant d’être admis dans l’application.' },
    ],
  },
  cta: {
    h2: 'Commencez ce soir',
    lede: 'Installez-la, confiez le téléphone à votre enfant douze minutes, et voyez ce qu’il sait faire d’ici le week-end.',
    install: 'Installer Kina Wige',
  },
  foot: {
    tagline: 'Une application d’apprentissage en kinyarwanda pour les 3–6 ans. Faite au Rwanda.',
    product: 'Produit', company: 'Entreprise', legal: 'Légal',
    links: {
      how: 'Comment ça marche', learn: 'Ce qu’ils apprennent', parents: 'Pour les parents',
      schools: 'Écoles et partenaires', privacy: 'Confidentialité', terms: 'Conditions', contact: 'Contact',
    },
    madeIn: 'Fait au Rwanda',
    rights: 'Tous droits réservés.',
  },
};

export const COPY: Record<Locale, Copy> = { en, rw, fr };
