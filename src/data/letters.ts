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
    sound: "/c/",
    isVowel: false,
    color: "var(--color-blue)",
    examples: [{ word: "Carro", image: "🚗" }],
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
    id: "p",
    character: "P",
    sound: "/p/",
    isVowel: false,
    color: "var(--color-green)",
    examples: [{ word: "pato", image: "🦆" }],
  },
  {
    id: "s",
    character: "S",
    sound: "/s/",
    isVowel: false,
    color: "var(--color-teal)",
    examples: [{ word: "sapo", image: "🐸" }],
  },
];

/** Todas as 26 letras aparecem na grade de seleção; só A, B, M, P, S têm lição pronta. */
export const ALL_ALPHABET: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const READY_LETTER_IDS: string[] = LETTERS.map((letter) => letter.id);

export function getLetterById(id: string): Letter | undefined {
  return LETTERS.find((letter) => letter.id === id);
}
