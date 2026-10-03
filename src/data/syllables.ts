export const VOWELS: string[] = ["Á", "É", "Í", "Ó", "Ú"];

export function buildSyllable(consonant: string, vowel: string): string {
  return `${consonant}${vowel.toLowerCase().normalize()}`;
}
