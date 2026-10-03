export type SpeechState = "idle" | "listening" | "processing" | "success" | "retry" | "unsupported";

type RecognitionResultHandler = (transcript: string) => void;

interface MinimalSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
}

type SpeechWindow = Window & {
  SpeechRecognition?: new () => MinimalSpeechRecognition;
  webkitSpeechRecognition?: new () => MinimalSpeechRecognition;
};

/**
 * Encapsula gravação de microfone e reconhecimento de fala.
 *
 * A permissão de microfone só é solicitada quando `listen()` é chamado,
 * nunca no carregamento da página. Se a Web Speech API não estiver
 * disponível, o serviço informa `unsupported` e a interface deve oferecer
 * uma alternativa visual (ver SpeakingScreen / MicrophoneButton).
 */
export class SpeechService {
  private recognition: MinimalSpeechRecognition | null = null;

  constructor() {
    const speechWindow = window as SpeechWindow;
    const RecognitionCtor = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (RecognitionCtor) {
      this.recognition = new RecognitionCtor();
      this.recognition.lang = "pt-BR";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;
    }
  }

  get isSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Inicia a escuta. `onResult` recebe o texto reconhecido (minúsculas).
   * `onError` é chamado em caso de falha ou permissão negada.
   * `onEnd` é sempre chamado ao final, com sucesso ou não.
   */
  listen(onResult: RecognitionResultHandler, onError: () => void, onEnd: () => void): void {
    if (!this.recognition) {
      onError();
      return;
    }

    this.recognition.onresult = (event: unknown) => {
      const resultEvent = event as { results: ArrayLike<ArrayLike<{ transcript: string }>> };
      const transcript = resultEvent.results?.[0]?.[0]?.transcript ?? "";
      onResult(transcript.trim().toLowerCase());
    };

    this.recognition.onerror = () => {
      onError();
    };

    this.recognition.onend = () => {
      onEnd();
    };

    try {
      this.recognition.start();
    } catch {
      onError();
    }
  }

  stop(): void {
    this.recognition?.abort();
  }

  /**
   * Comparação tolerante entre o texto reconhecido e o alvo (letra, sílaba
   * ou palavra). Não é uma análise fonética real — apenas uma aproximação
   * razoável para dar feedback positivo quando a criança tentou pronunciar
   * o som esperado.
   */
  static matches(transcript: string, target: string): boolean {
    if (!transcript) return false;
    const normalize = (value: string) =>
      value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    const normalizedTranscript = normalize(transcript);
    const normalizedTarget = normalize(target);
    return (
      normalizedTranscript.includes(normalizedTarget) ||
      normalizedTarget.includes(normalizedTranscript) ||
      normalizedTranscript.startsWith(normalizedTarget.charAt(0))
    );
  }
}
