export type WordExample = {
  word: string;
  image: string;
  /** Caminho local de áudio, quando existir um arquivo real gravado. */
  audio?: string;
};

export type Letter = {
  id: string;
  character: string;
  /** Representação textual do fonema, usada apenas como rótulo visual pequeno. */
  sound: string;
  /** true quando a letra é uma vogal (não combina com vogais na tela de sílabas). */
  isVowel: boolean;
  examples: WordExample[];
  color: string;
};

export const LETTERS: Letter[] = [
  {
    id: "a",
    character: "A",
    sound: "/a/",
    isVowel: true,
    color: "var(--color-coral)",
    examples: [{ word: "abelha", image: "🐝" }],
  },
  {
    id: "b",
    character: "B",
    sound: "/b/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "bola", image: "⚽" }],
  },
  {
    id: "c",
    character: "C",
    sound: "/k/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "casa", image: "🏠" }],
  },
  {
    id: "d",
    character: "D",
    sound: "/d/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "dado", image: "🎲" }],
  },
  {
    id: "e",
    character: "E",
    sound: "/e/",
    isVowel: true,
    color: "var(--color-coral)",
    examples: [{ word: "elefante", image: "🐘" }],
  },
  {
    id: "f",
    character: "F",
    sound: "/f/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "foca", image: "🦭" }],
  },
  {
    id: "g",
    character: "G",
    sound: "/g/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "gato", image: "🐱" }],
  },
  {
    id: "h",
    character: "H",
    sound: "",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "hipopótamo", image: "🦛" }],
  },
  {
    id: "i",
    character: "I",
    sound: "/i/",
    isVowel: true,
    color: "var(--color-coral)",
    examples: [{ word: "igreja", image: "⛪" }],
  },
  {
    id: "j",
    character: "J",
    sound: "/ʒ/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "jacaré", image: "🐊" }],
  },
  {
    id: "k",
    character: "K",
    sound: "/k/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "kiwi", image: "🥝" }],
  },
  {
    id: "l",
    character: "L",
    sound: "/l/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "lua", image: "🌙" }],
  },
  {
    id: "m",
    character: "M",
    sound: "/m/",
    isVowel: false,
    color: "var(--color-yellow)",
    examples: [{ word: "macaco", image: "🐒" }],
  },
  {
    id: "n",
    character: "N",
    sound: "/n/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "navio", image: "🚢" }],
  },
  {
    id: "o",
    character: "O",
    sound: "/o/",
    isVowel: true,
    color: "var(--color-coral)",
    examples: [{ word: "ovo", image: "🥚" }],
  },
  {
    id: "p",
    character: "P",
    sound: "/p/",
    isVowel: false,
    color: "var(--color-green)",
    examples: [{ word: "pato", image: "🦆" }],
  },
  {
    id: "q",
    character: "Q",
    sound: "/k/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "queijo", image: "🧀" }],
  },
  {
    id: "r",
    character: "R",
    sound: "/ɾ/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "rato", image: "🐭" }],
  },
  {
    id: "s",
    character: "S",
    sound: "/s/",
    isVowel: false,
    color: "var(--color-teal)",
    examples: [{ word: "sapo", image: "🐸" }],
  },
  {
    id: "t",
    character: "T",
    sound: "/t/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "tatu", image: "🦔" }],
  },
  {
    id: "u",
    character: "U",
    sound: "/u/",
    isVowel: true,
    color: "var(--color-coral)",
    examples: [{ word: "uva", image: "🍇" }],
  },
  {
    id: "v",
    character: "V",
    sound: "/v/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "vaca", image: "🐄" }],
  },
  {
    id: "w",
    character: "W",
    sound: "/w/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "waffle", image: "🧇" }],
  },
  {
    id: "x",
    character: "X",
    sound: "/ʃ/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "xícara", image: "☕" }],
  },
  {
    id: "y",
    character: "Y",
    sound: "/i/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "yoyo", image: "🪀" }],
  },
  {
    id: "z",
    character: "Z",
    sound: "/z/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "zebra", image: "🦓" }],
  },
];

/** Todas as 26 letras aparecem na grade de seleção; só A, B, M, P, S têm lição pronta. */
export const ALL_ALPHABET: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const READY_LETTER_IDS: string[] = LETTERS.map((letter) => letter.id);

export function getLetterById(id: string): Letter | undefined {
  return LETTERS.find((letter) => letter.id === id);
}
