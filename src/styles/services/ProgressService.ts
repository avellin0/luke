import { StorageService } from "./StorageService";

export type LetterProgress = {
  practiced: boolean;
  attempts: number;
  pronunciationAttempts: number;
  pronunciationSuccesses: number;
  lastPracticedAt: number | null;
};

type ProgressMap = Record<string, LetterProgress>;

const PROGRESS_KEY = "progress";
const LAST_LETTER_KEY = "last-letter";

function emptyProgress(): LetterProgress {
  return {
    practiced: false,
    attempts: 0,
    pronunciationAttempts: 0,
    pronunciationSuccesses: 0,
    lastPracticedAt: null,
  };
}

/** Guarda e consulta o progresso de cada letra. Persiste via StorageService. */
export class ProgressService {
  private storage: StorageService;
  private cache: ProgressMap;

  constructor(storage: StorageService) {
    this.storage = storage;
    this.cache = this.storage.get<ProgressMap>(PROGRESS_KEY, {});
  }

  private persist(): void {
    this.storage.set(PROGRESS_KEY, this.cache);
  }

  getProgress(letterId: string): LetterProgress {
    return this.cache[letterId] ?? emptyProgress();
  }

  markPracticed(letterId: string): void {
    const current = this.getProgress(letterId);
    current.practiced = true;
    current.attempts += 1;
    current.lastPracticedAt = Date.now();
    this.cache[letterId] = current;
    this.persist();
  }

  recordPronunciationAttempt(letterId: string, success: boolean): void {
    const current = this.getProgress(letterId);
    current.pronunciationAttempts += 1;
    if (success) current.pronunciationSuccesses += 1;
    current.lastPracticedAt = Date.now();
    this.cache[letterId] = current;
    this.persist();
  }

  practicedLetterIds(): string[] {
    return Object.keys(this.cache).filter((id) => this.cache[id].practiced);
  }

  totalPronunciationAttempts(): number {
    return Object.values(this.cache).reduce((sum, item) => sum + item.pronunciationAttempts, 0);
  }

  setLastLetter(letterId: string): void {
    this.storage.set(LAST_LETTER_KEY, letterId);
  }

  getLastLetter(): string | null {
    return this.storage.get<string | null>(LAST_LETTER_KEY, null);
  }
}
