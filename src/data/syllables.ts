export const VOWELS: string[] = ["A", "E", "I", "O", "U"];

export function buildSyllable(consonant: string, vowel: string): string {
  return `${consonant}${vowel.toLowerCase()}`;
}
