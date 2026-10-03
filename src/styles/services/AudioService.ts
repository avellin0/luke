/**
 * Camada de áudio do aplicativo.
 *
 * Não existem arquivos de áudio gravados neste projeto. Em vez de inventar
 * URLs externas, usamos a Web Speech API (SpeechSynthesis) do navegador para
 * falar letras, sílabas e palavras em pt-BR, e a Web Audio API para gerar
 * pequenos efeitos de recompensa (bipes curtos).
 *
 * Quando arquivos de áudio reais forem gravados, basta preencher o campo
 * `audio` em `WordExample` (ver src/data/letters.ts) e trocar a implementação
 * de `speak` para tocar esse arquivo antes de cair no fallback de síntese.
 */
export class AudioService {
  private synth: SpeechSynthesis | null;
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
    this.loadVoice();
    if (this.synth) {
      this.synth.addEventListener?.("voiceschanged", () => this.loadVoice());
    }
  }

  private loadVoice(): void {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.voice =
      voices.find((item) => item.lang?.toLowerCase().startsWith("pt-br")) ??
      voices.find((item) => item.lang?.toLowerCase().startsWith("pt")) ??
      null;
  }

  get isSpeechAvailable(): boolean {
    return this.synth !== null;
  }

  /** Interrompe qualquer fala em andamento, evitando sobreposição de áudios. */
  stop(): void {
    this.synth?.cancel();
    this.currentUtterance = null;
  }

  /** Indica se o app está falando algo no momento, útil para evitar sobreposições. */
  get isSpeaking(): boolean {
    return this.currentUtterance !== null && (this.synth?.speaking ?? false);
  }

  /** Fala um texto curto (letra, sílaba ou palavra) em português. */
  speak(text: string, options: { rate?: number } = {}): void {
    if (!this.synth) return;
    this.stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = options.rate ?? 0.95;
    utterance.pitch = 1.05;
    if (this.voice) utterance.voice = this.voice;
    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  private ensureAudioContext(): AudioContext | null {
    if (this.audioCtx) return this.audioCtx;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    this.audioCtx = new Ctor();
    return this.audioCtx;
  }

  /** Pequeno efeito sonoro de sucesso, gerado com osciladores (sem arquivos externos). */
  playSuccessChime(): void {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      const startTime = ctx.currentTime + index * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  }

  /** Som curto e neutro para "tente de novo" — nunca negativo ou alarmante. */
  playRetryTone(): void {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 330;
    const startTime = ctx.currentTime;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.24);
  }
}
