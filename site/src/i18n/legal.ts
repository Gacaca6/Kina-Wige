// Privacy policy and terms, in all three languages.
//
// This is the shortest honest privacy policy we could write, because the app
// genuinely has no server, no account and no analytics. Most children's apps
// need pages of disclosure; we mostly need to explain what does NOT happen.
//
// Both app stores require a reachable privacy policy before a listing is
// accepted, so this page is also a prerequisite for the store badges.
//
// ⚠️ Not legal advice and not reviewed by a lawyer. Have counsel read it before
// the pilot, especially the children's-data section.

import type { Locale } from './copy';

export interface Doc {
  title: string;
  updated: string;
  intro: string;
  blocks: { h: string; p?: string; ul?: string[] }[];
}

const UPDATED = '2026-08-18';

export const PRIVACY: Record<Locale, Doc> = {
  en: {
    title: 'Privacy policy',
    updated: `Last updated ${UPDATED}`,
    intro:
      'Kina Wige is used by young children, so we built it to collect nothing at all. This page explains exactly what that means.',
    blocks: [
      {
        h: 'We collect no personal data',
        p: 'Kina Wige has no user accounts, no sign-up, no email field and no server that receives information about you or your child. We cannot see your child’s name, age, photo, location, or what they did in the app, because none of it is ever sent to us.',
      },
      {
        h: 'What is stored, and where',
        p: 'The app saves a small amount of information in your own device’s storage so your child does not start from zero each time:',
        ul: [
          'Which lessons, episodes, games and books have been opened or completed',
          'Stars collected',
          'A per-skill record used to show you what your child can do',
          'The language you selected',
        ],
      },
      {
        h: 'This never leaves your device',
        p: 'That information stays in the browser storage on your phone. It is not transmitted, backed up to us, sold, shared, or used for advertising. Deleting the app, clearing its storage, or using “Delete all progress” in the grown-up settings removes it permanently. We cannot recover it, because we never had it.',
      },
      {
        h: 'No advertising and no tracking',
        p: 'There are no adverts in Kina Wige, no third-party advertising SDKs, no analytics, no tracking pixels and no cookies used for tracking. The app makes no network requests once it is installed.',
      },
      {
        h: 'Video and content',
        p: 'Episodes are downloaded to your device the first time you open them, so they play offline afterwards. Downloading them requires an internet connection and, like any download, is visible to your internet provider. After that, playback needs no connection.',
      },
      {
        h: 'This website',
        p: 'This marketing site is served as static files and runs no analytics, no advertising and no tracking cookies. Our hosting provider may keep standard server logs, such as IP addresses, for security and reliability.',
      },
      {
        h: 'Children',
        p: 'Kina Wige is designed for children aged 3–6 and is intended to be used alongside a parent or guardian. Because we collect no personal information from anyone, we collect none from children. Purchases, external links and settings sit behind a simple grown-up gate.',
      },
      {
        h: 'Changes',
        p: 'If this policy ever changes, the date at the top changes with it. If we ever begin collecting anything at all, we will say so plainly and ask first.',
      },
      { h: 'Contact', p: 'Questions about privacy can be sent to the address in the footer of this site.' },
    ],
  },

  rw: {
    title: 'Politiki y’ibanga',
    updated: `Byavuguruwe ${UPDATED}`,
    intro:
      'Kina Wige ikoreshwa n’abana bato, ni yo mpamvu twayubatse ku buryo itakusanya amakuru na mba. Uru rupapuro rusobanura icyo bivuze neza.',
    blocks: [
      {
        h: 'Nta makuru bwite dukusanya',
        p: 'Kina Wige nta konti z’abakoresha ifite, nta kwiyandikisha, nta imeyili, kandi nta seriveri yakira amakuru yerekeye wowe cyangwa umwana wawe. Ntitubasha kubona izina ry’umwana wawe, imyaka ye, ifoto, aho aherereye, cyangwa ibyo yakoze muri porogaramu, kuko nta na kimwe cyoherezwa kuri twe.',
      },
      {
        h: 'Ibibikwa, n’aho bibikwa',
        p: 'Porogaramu ibika amakuru make mu bubiko bwa telefone yawe kugira ngo umwana wawe atatangira busa buri gihe:',
        ul: [
          'Amasomo, amashusho, imikino n’ibitabo byafunguwe cyangwa byarangiye',
          'Inyenyeri yegeranyije',
          'Inyandiko y’ubumenyi ikwereka ibyo umwana wawe ashobora',
          'Ururimi wahisemo',
        ],
      },
      {
        h: 'Ibi ntibisohoka kuri telefone yawe',
        p: 'Ayo makuru asigara mu bubiko bwa mushakisha kuri telefone yawe. Ntiyoherezwa, ntitwayabika, ntiyagurishwa, ntiyasangizwa, kandi ntiyakoreshwa mu kwamamaza. Gukuraho porogaramu, gusiba ububiko bwayo, cyangwa gukoresha “Siba amanota n’aho wageze” mu igenamiterere ry’ababyeyi bibikuraho burundu. Ntitwabasha kubigarura, kuko tutigeze tubigira.',
      },
      {
        h: 'Nta kwamamaza, nta gukurikirana',
        p: 'Nta kwamamaza kuri muri Kina Wige, nta bikoresho by’abandi byo kwamamaza, nta gusesengura, nta gukurikirana. Porogaramu nta busabe bw’urusobe ikora nyuma yo kuyishyiraho.',
      },
      {
        h: 'Amashusho n’ibikubiyemo',
        p: 'Amasomo akururwa kuri telefone yawe ubwo uyafunguye bwa mbere, kugira ngo nyuma akine nta murandasi. Kuyakurura bisaba murandasi kandi, nk’ibindi bikururwa byose, bigaragara ku watanze murandasi. Nyuma yaho, kuyareba ntibisaba murandasi.',
      },
      {
        h: 'Uru rubuga',
        p: 'Uru rubuga rutangwa nk’amadosiye adahinduka, nta gusesengura, nta kwamamaza, nta cookies zo gukurikirana. Uwadutanze ububiko ashobora kubika inyandiko zisanzwe za seriveri, nka aderesi IP, ku mpamvu z’umutekano.',
      },
      {
        h: 'Abana',
        p: 'Kina Wige yagenewe abana b’imyaka 3–6 kandi igenewe gukoreshwa umubyeyi ari hafi. Kubera ko tutakusanya amakuru bwite ku muntu uwo ari we wese, nta yo dukusanya ku bana. Kugura, amahuza yo hanze n’igenamiterere biri inyuma y’irembo ry’abakuru.',
      },
      {
        h: 'Impinduka',
        p: 'Iyi politiki niyihinduka, itariki iri hejuru na yo irahinduka. Nitwatangira gukusanya ikintu icyo ari cyo cyose, tuzabivuga mu buryo bwumvikana kandi tubanze tubabaze.',
      },
      { h: 'Twandikire', p: 'Ibibazo ku ibanga byoherezwa kuri aderesi iri hasi kuri uru rubuga.' },
    ],
  },

  fr: {
    title: 'Politique de confidentialité',
    updated: `Dernière mise à jour ${UPDATED}`,
    intro:
      'Kina Wige est utilisée par de jeunes enfants ; nous l’avons donc conçue pour ne rien collecter du tout. Cette page explique précisément ce que cela signifie.',
    blocks: [
      {
        h: 'Nous ne collectons aucune donnée personnelle',
        p: 'Kina Wige n’a ni compte utilisateur, ni inscription, ni champ e-mail, ni serveur recevant des informations sur vous ou votre enfant. Nous ne pouvons pas voir le nom, l’âge, la photo, la position de votre enfant ni ce qu’il a fait dans l’application, car rien ne nous est jamais envoyé.',
      },
      {
        h: 'Ce qui est enregistré, et où',
        p: 'L’application enregistre une petite quantité d’informations dans le stockage de votre appareil pour que votre enfant ne reparte pas de zéro :',
        ul: [
          'Les leçons, épisodes, jeux et livres ouverts ou terminés',
          'Les étoiles obtenues',
          'Un relevé par compétence qui vous montre ce que votre enfant sait faire',
          'La langue choisie',
        ],
      },
      {
        h: 'Rien ne quitte votre appareil',
        p: 'Ces informations restent dans le stockage du navigateur de votre téléphone. Elles ne sont ni transmises, ni sauvegardées chez nous, ni vendues, ni partagées, ni utilisées à des fins publicitaires. Supprimer l’application, effacer son stockage ou utiliser « Réinitialiser » dans les réglages adultes les efface définitivement. Nous ne pouvons pas les récupérer, car nous ne les avons jamais eues.',
      },
      {
        h: 'Aucune publicité, aucun suivi',
        p: 'Il n’y a aucune publicité dans Kina Wige, aucun SDK publicitaire tiers, aucune analyse, aucun pixel de suivi et aucun cookie de suivi. L’application n’effectue aucune requête réseau une fois installée.',
      },
      {
        h: 'Vidéos et contenus',
        p: 'Les épisodes sont téléchargés sur votre appareil à leur première ouverture, puis se lisent hors ligne. Le téléchargement nécessite une connexion et, comme tout téléchargement, est visible par votre fournisseur d’accès. Ensuite, la lecture ne nécessite aucune connexion.',
      },
      {
        h: 'Ce site',
        p: 'Ce site est servi sous forme de fichiers statiques et n’exécute aucune analyse, publicité ni cookie de suivi. Notre hébergeur peut conserver des journaux serveur standards, comme les adresses IP, pour la sécurité et la fiabilité.',
      },
      {
        h: 'Enfants',
        p: 'Kina Wige est conçue pour les enfants de 3 à 6 ans et destinée à être utilisée avec un parent ou tuteur. Comme nous ne collectons aucune information personnelle de quiconque, nous n’en collectons aucune auprès des enfants. Les achats, liens externes et réglages sont derrière une barrière adulte.',
      },
      {
        h: 'Modifications',
        p: 'Si cette politique change, la date en haut change également. Si nous commencions un jour à collecter quoi que ce soit, nous le dirions clairement et demanderions d’abord.',
      },
      { h: 'Contact', p: 'Les questions de confidentialité peuvent être envoyées à l’adresse en bas de ce site.' },
    ],
  },
};

export const TERMS: Record<Locale, Doc> = {
  en: {
    title: 'Terms of use',
    updated: `Last updated ${UPDATED}`,
    intro: 'The short version: use it with your child, for free, and do not resell it.',
    blocks: [
      { h: 'Using Kina Wige', p: 'Kina Wige is provided free of charge for personal and family use, and for use in pre-primary classrooms. You may install it on as many devices as you like. No account is required.' },
      { h: 'What we ask', p: 'Please do not resell the app or its content, republish the videos, books or lessons as your own, or modify the app and distribute it as if it were ours.' },
      { h: 'Content we license from others', p: 'Some content is used under licence from its creators and remains theirs. The alphabet songs and the Letter A episode come from the Ubongo Toolkit under CC BY-NC-ND 4.0. Illustrations in one storybook come from Book Dash under CC BY 4.0. Those licences travel with that content.' },
      { h: 'Supervision', p: 'Kina Wige is designed for children aged 3–6 and assumes an adult nearby. Parts of it — the Kina Challenge, the parent activities, marking off-screen work — only make sense with a grown-up taking part.' },
      { h: 'Availability', p: 'This is early software, offered as it is. We do not promise it is free of faults, and we may change or withdraw features. Because your child’s progress is stored only on your device, we cannot restore it if the device is lost or cleared.' },
      { h: 'Price', p: 'Kina Wige is free during our pilot. If a paid family plan is introduced later, we will announce it clearly beforehand and anything you already have installed will continue to work.' },
      { h: 'Contact', p: 'Questions can be sent to the address in the footer of this site.' },
    ],
  },
  rw: {
    title: 'Amabwiriza yo gukoresha',
    updated: `Byavuguruwe ${UPDATED}`,
    intro: 'Muri make: yikoreshe n’umwana wawe, ku buntu, kandi ntuyigurishe.',
    blocks: [
      { h: 'Gukoresha Kina Wige', p: 'Kina Wige itangwa ku buntu ku bwo gukoreshwa mu muryango no mu byumba by’amashuri y’incuke. Ushobora kuyishyira kuri telefone nyinshi uko ushaka. Nta konti ikenewe.' },
      { h: 'Icyo tugusaba', p: 'Ntugurishe porogaramu cyangwa ibiyirimo, ntusubire gutangaza amashusho, ibitabo cyangwa amasomo nk’ibyawe, kandi ntuhindure porogaramu ngo uyisakaze nk’aho ari iyacu.' },
      { h: 'Ibikubiyemo tuvana ku bandi', p: 'Ibimwe mu bikubiyemo bikoreshwa ku burenganzira bw’ababikoze kandi bigumaho ari ibyabo. Indirimbo z’inyuguti n’isomo ry’inyuguti A biva muri Ubongo Toolkit ku burenganzira CC BY-NC-ND 4.0. Amashusho yo mu gitabo kimwe ava muri Book Dash ku burenganzira CC BY 4.0.' },
      { h: 'Kwitabwaho', p: 'Kina Wige yagenewe abana b’imyaka 3–6 kandi iteganya ko umuntu mukuru ari hafi. Ibice bimwe — Kina Challenge, ibikorwa by’ababyeyi, no kwemeza ibyakozwe hanze ya telefone — bisaba ko umuntu mukuru agira uruhare.' },
      { h: 'Kuboneka', p: 'Iyi ni porogaramu ikiri nshya, itangwa uko iri. Ntitwemeza ko idafite amakosa, kandi dushobora guhindura cyangwa gukuraho ibice. Kubera ko aho umwana wawe ageze bibikwa gusa kuri telefone yawe, ntitwabasha kubigarura telefone niyibura cyangwa igasibwa.' },
      { h: 'Igiciro', p: 'Kina Wige ni ubuntu mu gihe cy’igerageza. Nihaza gahunda ifite igiciro, tuzabimenyesha hakiri kare kandi ibyo wamaze gushyiraho bizakomeza gukora.' },
      { h: 'Twandikire', p: 'Ibibazo byoherezwa kuri aderesi iri hasi kuri uru rubuga.' },
    ],
  },
  fr: {
    title: 'Conditions d’utilisation',
    updated: `Dernière mise à jour ${UPDATED}`,
    intro: 'En bref : utilisez-la avec votre enfant, gratuitement, et ne la revendez pas.',
    blocks: [
      { h: 'Utiliser Kina Wige', p: 'Kina Wige est fournie gratuitement pour un usage personnel et familial, et pour les classes préprimaires. Vous pouvez l’installer sur autant d’appareils que vous le souhaitez. Aucun compte n’est requis.' },
      { h: 'Ce que nous demandons', p: 'Merci de ne pas revendre l’application ou son contenu, de ne pas republier les vidéos, livres ou leçons comme les vôtres, et de ne pas modifier l’application pour la distribuer comme si elle était la nôtre.' },
      { h: 'Contenus sous licence de tiers', p: 'Certains contenus sont utilisés sous licence et restent la propriété de leurs auteurs. Les chansons de l’alphabet et l’épisode de la lettre A proviennent du Ubongo Toolkit sous CC BY-NC-ND 4.0. Les illustrations d’un livre proviennent de Book Dash sous CC BY 4.0.' },
      { h: 'Accompagnement', p: 'Kina Wige est conçue pour les 3–6 ans et suppose la présence d’un adulte. Certaines parties — le Kina Challenge, les activités parents, la validation du travail hors écran — n’ont de sens qu’avec un adulte qui y participe.' },
      { h: 'Disponibilité', p: 'Ce logiciel est récent et fourni en l’état. Nous ne garantissons pas l’absence de défauts et pouvons modifier ou retirer des fonctionnalités. La progression étant stockée uniquement sur votre appareil, nous ne pouvons pas la restaurer s’il est perdu ou effacé.' },
      { h: 'Prix', p: 'Kina Wige est gratuite pendant notre phase pilote. Si une formule famille payante est introduite, nous l’annoncerons clairement à l’avance et tout ce que vous avez installé continuera de fonctionner.' },
      { h: 'Contact', p: 'Les questions peuvent être envoyées à l’adresse en bas de ce site.' },
    ],
  },
};
