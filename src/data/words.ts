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

  { word: "banana", image: "🍌", letterId: "b" },
  { word: "bola", image: "⚽", letterId: "b" },
  { word: "borboleta", image: "🦋", letterId: "b" },

  { word: "cachorro", image: "🐶", letterId: "c" },
  { word: "casa", image: "🏠", letterId: "c" },
  { word: "carro", image: "🚗", letterId: "c" },

  { word: "dado", image: "🎲", letterId: "d" },
  { word: "dinossauro", image: "🦖", letterId: "d" },
  { word: "doce", image: "🍬", letterId: "d" },

  { word: "elefante", image: "🐘", letterId: "e" },
  { word: "escada", image: "🪜", letterId: "e" },
  { word: "estrela", image: "⭐", letterId: "e" },

  { word: "faca", image: "🔪", letterId: "f" },
  { word: "flor", image: "🌸", letterId: "f" },
  { word: "foca", image: "🦭", letterId: "f" },

  { word: "gato", image: "🐱", letterId: "g" },
  { word: "girafa", image: "🦒", letterId: "g" },
  { word: "golfinho", image: "🐬", letterId: "g" },

  { word: "hipopótamo", image: "🦛", letterId: "h" },
  { word: "horta", image: "🌱", letterId: "h" },
  { word: "hotel", image: "🏨", letterId: "h" },

  { word: "igreja", image: "⛪", letterId: "i" },
  { word: "ilha", image: "🏝️", letterId: "i" },
  { word: "ímã", image: "🧲", letterId: "i" },

  { word: "jacaré", image: "🐊", letterId: "j" },
  { word: "janela", image: "🪟", letterId: "j" },
  { word: "joaninha", image: "🐞", letterId: "j" },

  { word: "kiwi", image: "🥝", letterId: "k" },
  { word: "karaokê", image: "🎤", letterId: "k" },
  { word: "ketchup", image: "🍅", letterId: "k" },

  { word: "lápis", image: "✏️", letterId: "l" },
  { word: "leão", image: "🦁", letterId: "l" },
  { word: "lua", image: "🌙", letterId: "l" },

  { word: "macaco", image: "🐒", letterId: "m" },
  { word: "maçã", image: "🍎", letterId: "m" },
  { word: "mochila", image: "🎒", letterId: "m" },

  { word: "navio", image: "🚢", letterId: "n" },
  { word: "ninho", image: "🪺", letterId: "n" },
  { word: "nuvem", image: "☁️", letterId: "n" },

  { word: "ocelote", image: "🐆", letterId: "o" },
  { word: "olho", image: "👁️", letterId: "o" },
  { word: "ovo", image: "🥚", letterId: "o" },

  { word: "panela", image: "🍳", letterId: "p" },
  { word: "pato", image: "🦆", letterId: "p" },
  { word: "pipa", image: "🪁", letterId: "p" },

  { word: "queijo", image: "🧀", letterId: "q" },
  { word: "quebra-cabeça", image: "🧩", letterId: "q" },
  { word: "quindim", image: "🍮", letterId: "q" },

  { word: "rato", image: "🐭", letterId: "r" },
  { word: "rei", image: "🤴", letterId: "r" },
  { word: "robô", image: "🤖", letterId: "r" },

  { word: "sapo", image: "🐸", letterId: "s" },
  { word: "sol", image: "☀️", letterId: "s" },
  { word: "sorvete", image: "🍦", letterId: "s" },

  { word: "tatu", image: "🦔", letterId: "t" },
  { word: "tigre", image: "🐯", letterId: "t" },
  { word: "tomate", image: "🍅", letterId: "t" },

  { word: "uva", image: "🍇", letterId: "u" },
  { word: "urso", image: "🐻", letterId: "u" },
  { word: "unicornio", image: "🦄", letterId: "u" },

  { word: "vaca", image: "🐄", letterId: "v" },
  { word: "vela", image: "🕯️", letterId: "v" },
  { word: "violão", image: "🎸", letterId: "v" },

  { word: "waffle", image: "🧇", letterId: "w" },
  { word: "webcam", image: "📹", letterId: "w" },
  { word: "wifi", image: "📶", letterId: "w" },

  { word: "xícara", image: "☕", letterId: "x" },
  { word: "xale", image: "🧣", letterId: "x" },
  { word: "xadrez", image: "♟️", letterId: "x" },

  { word: "yoga", image: "🧘", letterId: "y" },
  { word: "yoyo", image: "🪀", letterId: "y" },
  { word: "yakisoba", image: "🍜", letterId: "y" },

  { word: "zebra", image: "🦓", letterId: "z" },
  { word: "zero", image: "0️⃣", letterId: "z" },
  { word: "zíper", image: "🤐", letterId: "z" },
]



export function wordsForLetter(letterId: string): PictureWord[] {
  return PICTURE_WORDS.filter((item) => item.letterId === letterId);
}

export function randomDistractors(excludeLetterId: string, count: number): PictureWord[] {
  const pool = PICTURE_WORDS.filter((item) => item.letterId !== excludeLetterId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
