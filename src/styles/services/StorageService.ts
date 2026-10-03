const NAMESPACE = "letrinhas";

/** Pequena camada sobre localStorage, isolando o resto do app do browser API. */
export class StorageService {
  private available: boolean;

  constructor() {
    this.available = StorageService.detectAvailability();
  }

  private static detectAvailability(): boolean {
    try {
      const testKey = `${NAMESPACE}:__test__`;
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private fullKey(key: string): string {
    return `${NAMESPACE}:${key}`;
  }

  get<T>(key: string, fallback: T): T {
    if (!this.available) return fallback;
    const raw = window.localStorage.getItem(this.fullKey(key));
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.available) return;
    try {
      window.localStorage.setItem(this.fullKey(key), JSON.stringify(value));
    } catch {
      /* armazenamento indisponível ou cheio: falha silenciosa, não quebra o app */
    }
  }
}
