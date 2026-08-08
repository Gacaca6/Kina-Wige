// Comic registry — the single place to add illustrated tap-through stories.
//
// Comics are the app's lightest content type: a few images + trilingual
// captions (no video). Great offline (kilobytes), license-clean when the art
// is your own, and strong for pre-literacy (pair each panel with tap-to-hear
// narration for children who cannot read yet).
//
// To add a comic:
//   1. Add panel images to src/assets/ and export them in src/assets/images.ts
//      (this first sample reuses existing character art as placeholder panels —
//      swap in real comic illustrations when you have them).
//   2. Add an entry below — it appears on the Books screen and gets its own
//      /comic/<id> route automatically.

import type { Language } from '../i18n/translations';
import type { ContentMeta } from './curriculum';
import { images } from '../assets/images';
import { mySpecialHair } from '../assets/comics/mySpecialHair';

export interface ComicPanel {
  image: string;
  text: Record<Language, string>;
}

export interface Comic {
  id: string;
  title: Record<Language, string>;
  category: Record<Language, string>;
  cover: string;
  panels: ComicPanel[];
  attribution?: string; // shown on the card/reader; required for CC-licensed art
  /** REQUIRED — what this book teaches (Architecture §17). */
  curriculum: ContentMeta;
}

export interface UpcomingComic {
  title: string;
  category: Record<Language, string>;
}

export const comics: Comic[] = [
  {
    id: 'my-special-hair',
    title: {
      KN: 'Umusatsi Wanjye Udasanzwe',
      EN: 'My Special Hair',
      FR: 'Mes Cheveux Spéciaux',
    },
    category: { KN: '💛 Kwikunda', EN: '💛 Self-love', FR: "💛 S'aimer" },
    cover: mySpecialHair.cover,
    attribution: 'Illustrations: Book Dash (bookdash.org) · CC BY 4.0',
    curriculum: {
      skills: ['self.confidence', 'wrd.story.recall'],
      level: 'L2',
      theme: 'T1',
      domains: ['D1', 'D5'],
      minutes: 4,
      // Currently the only content carrying D6 territory (self-expression), and
      // it does so through D5. Architecture §10 names this: Creative Arts &
      // Culture has no strong home and Books carry it alone.
      note: 'D6 is still uncovered by this — see the coverage report.',
    },
    panels: [
      {
        image: mySpecialHair.p04,
        text: {
          KN: "Muraho! Ndi njye n'inshuti yanjye Bobi. Reba umusatsi wanjye udasanzwe!",
          EN: "Hello! This is me and my friend Bobi. Look at my special hair!",
          FR: "Bonjour! Voici moi et mon ami Bobi. Regarde mes cheveux spéciaux!",
        },
      },
      {
        image: mySpecialHair.p05,
        text: {
          KN: 'Umusatsi wanjye ni munini kandi woroshye. Bobi arawukunda cyane!',
          EN: 'My hair is big and soft and bouncy. Bobi loves it so much!',
          FR: 'Mes cheveux sont grands, doux et rebondis. Bobi les adore!',
        },
      },
      {
        image: mySpecialHair.p08,
        text: {
          KN: 'Rimwe na rimwe, n\'inyoni nto zishaka kuwuturamo!',
          EN: 'Sometimes, even little birds want to make a home in it!',
          FR: 'Parfois, même de petits oiseaux veulent y faire leur nid!',
        },
      },
      {
        image: mySpecialHair.p06,
        text: {
          KN: 'Ku zuba, umusatsi wanjye untera igicucu cyiza. Turuhukira munsi yawo!',
          EN: 'In the sun, my hair makes cool shade. We relax underneath it!',
          FR: 'Au soleil, mes cheveux font une belle ombre. On se repose dessous!',
        },
      },
      {
        image: mySpecialHair.p07,
        text: {
          KN: "Mu mbeho, umusatsi wanjye untera ubushyuhe nk'ingofero nini!",
          EN: 'When it is cold, my hair keeps me warm like a big cozy hat!',
          FR: 'Quand il fait froid, mes cheveux me tiennent chaud comme un grand chapeau!',
        },
      },
      {
        image: mySpecialHair.p09,
        text: {
          KN: "Iyo umuyaga uhuha, umusatsi wanjye uraguruka nk'ibendera ryiza!",
          EN: 'When the wind blows, my hair flies out like a beautiful flag!',
          FR: 'Quand le vent souffle, mes cheveux volent comme un beau drapeau!',
        },
      },
      {
        image: mySpecialHair.p11,
        text: {
          KN: 'Ndashobora no kubika amakarayo yanjye muri wo mu gihe nshushanya!',
          EN: 'I can even keep my crayons in it while I draw!',
          FR: 'Je peux même y ranger mes crayons pendant que je dessine!',
        },
      },
      {
        image: mySpecialHair.p13,
        text: {
          KN: 'Ku minsi mikuru, ndawushyiramo amabara yose meza!',
          EN: 'On party days, I fill it with all the happy colours!',
          FR: 'Les jours de fête, j\'y mets toutes les jolies couleurs!',
        },
      },
      {
        image: mySpecialHair.p12,
        text: {
          KN: 'Bobi na we awukunda cyane — ni ahantu heza ho guhoberana!',
          EN: 'Bobi loves it too — it is the best place for a big hug!',
          FR: 'Bobi les aime aussi — c\'est le meilleur endroit pour un câlin!',
        },
      },
      {
        image: mySpecialHair.p14,
        text: {
          KN: 'Umusatsi wanjye ni uwanjye jyenyine. Nta wundi umeze nkawo ku isi.',
          EN: 'My hair is all my own. There is no other hair like it in the world.',
          FR: 'Mes cheveux sont bien à moi. Il n\'y en a pas d\'autres comme eux au monde.',
        },
      },
      {
        image: mySpecialHair.p15,
        text: {
          KN: 'Umusatsi wanjye ni mwiza. Ndawukunda uko ungana! Nawe wikunde uko uri.',
          EN: 'My hair is beautiful. I love it just the way it is! You are wonderful too.',
          FR: "Mes cheveux sont magnifiques. Je les aime comme ils sont! Toi aussi, tu es merveilleux.",
        },
      },
    ],
  },
  {
    id: 'clean-hands',
    title: {
      KN: "Amaboko Meza ya Hirwa",
      EN: "Hirwa's Clean Hands",
      FR: 'Les Mains Propres de Hirwa',
    },
    category: { KN: '🫧 Isuku', EN: '🫧 Hygiene', FR: '🫧 Hygiène' },
    cover: images.hirwaFull,
    curriculum: {
      skills: ['phy.hand.why', 'phy.hand.when', 'wrd.story.recall'],
      level: 'L3',
      theme: 'T6',
      domains: ['D1', 'D4'],
      minutes: 4,
      // Panel 2 is the only place in the whole app that says germs are there and
      // you cannot see them — the exact evidence statement for phy.hand.why.
      // The vertical slice depends on this book.
      note: 'Sole carrier of phy.hand.why. Do not remove without replacing the germ panel.',
    },
    panels: [
      {
        image: images.hirwaFull,
        text: {
          KN: 'Hirwa yakinnye hanze umunsi wose. Yishimye cyane!',
          EN: 'Hirwa played outside all day. He was so happy!',
          FR: 'Hirwa a joué dehors toute la journée. Il était très content!',
        },
      },
      {
        image: images.hands,
        text: {
          KN: "Ariko amaboko ye yari afite udupfunyi twinshi tutaboneka n'amaso.",
          EN: 'But his hands were covered in tiny germs you cannot see.',
          FR: 'Mais ses mains étaient couvertes de microbes invisibles.',
        },
      },
      {
        image: images.mama,
        text: {
          KN: 'Mama aramubwira ati: "Karaba amaboko mbere yo kurya!"',
          EN: 'Mama said: "Wash your hands before you eat!"',
          FR: 'Maman dit: «Lave-toi les mains avant de manger!»',
        },
      },
      {
        image: images.hands,
        text: {
          KN: "Hirwa akoresha amazi n'isabune, agosora neza intoki zose.",
          EN: 'Hirwa used water and soap, scrubbing every finger well.',
          FR: "Hirwa a utilisé de l'eau et du savon, frottant bien chaque doigt.",
        },
      },
      {
        image: images.kezaFull,
        text: {
          KN: 'Keza aramushimira ati: "Wakoze neza! Udupfunyi twagiye!"',
          EN: 'Keza cheered: "Well done! The germs are all gone!"',
          FR: "Keza l'a félicité: «Bravo! Les microbes sont partis!»",
        },
      },
      {
        image: images.parentChild,
        text: {
          KN: 'Noneho Hirwa arya afite amaboko meza. Mwiza cyane!',
          EN: 'Now Hirwa eats with clean hands. Wonderful!',
          FR: 'Maintenant Hirwa mange avec des mains propres. Magnifique!',
        },
      },
    ],
  },
];

export const upcomingComics: UpcomingComic[] = [
  { title: 'Amenyo Yera ya Keza', category: { KN: '🪥 Isuku', EN: '🪥 Hygiene', FR: '🪥 Hygiène' } },
  { title: 'Ibiryo Byiza', category: { KN: '🥗 Imirire', EN: '🥗 Nutrition', FR: '🥗 Nutrition' } },
];

export function getComic(id: string | undefined): Comic | undefined {
  return comics.find(c => c.id === id);
}
