export type PictureWord = {
  word: string;
  image: string;
  letterId: string;
};

/**
 * Banco de palavras usado nos exercícios de associação imagem → letra.
 * Cada palavra começa com uma das letras já disponíveis (A, B, M, P, S).
 */
export const PICTURE_WORDS: PictureWord[] = [
  { word: "abelha", image: "🐝", letterId: "a" },
  { word: "anel", image: "💍", letterId: "a" },
  { word: "avião", image: "✈️", letterId: "a" },
  { word: "bola", image: "⚽", letterId: "b" },
  { word: "borboleta", image: "🦋", letterId: "b" },
  { word: "banana", image: "🍌", letterId: "b" },
  { word: "macaco", image: "🐒", letterId: "m" },
  { word: "maçã", image: "🍎", letterId: "m" },
  { word: "mochila", image: "🎒", letterId: "m" },
  { word: "pato", image: "🦆", letterId: "p" },
  { word: "pipa", image: "🪁", letterId: "p" },
  { word: "panela", image: "🍳", letterId: "p" },
  { word: "sapo", image: "🐸", letterId: "s" },
  { word: "sol", image: "☀️", letterId: "s" },
  { word: "sorvete", image: "🍦", letterId: "s" },
];

export function wordsForLetter(letterId: string): PictureWord[] {
  return PICTURE_WORDS.filter((item) => item.letterId === letterId);
}

export function randomDistractors(excludeLetterId: string, count: number): PictureWord[] {
  const pool = PICTURE_WORDS.filter((item) => item.letterId !== excludeLetterId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
