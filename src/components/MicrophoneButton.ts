import type { SpeechState } from "../styles/services/SpeechService";

export type MicrophoneButtonOptions = {
  onPress: () => void;
};

const STATE_ICON: Record<SpeechState, string> = {
  idle: "🎤",
  listening: "🎤",
  processing: "⏳",
  success: "✨",
  retry: "🔁",
  unsupported: "🎤",
};

const STATE_LABEL: Record<SpeechState, string> = {
  idle: "Toque para falar",
  listening: "Ouvindo...",
  processing: "Analisando...",
  success: "Muito bem!",
  retry: "Tente de novo",
  unsupported: "Toque para ouvir de novo",
};

/** Botão de microfone grande com estados visuais (idle/listening/processing/success/retry). */
export class MicrophoneButton {
  readonly element: HTMLButtonElement;
  private iconEl: HTMLSpanElement;
  private wavesEl: HTMLSpanElement;
  private state: SpeechState = "idle";

  constructor(options: MicrophoneButtonOptions) {
    this.element = document.createElement("button");
    this.element.type = "button";
    this.element.className = "mic-button mic-button--idle";

    this.wavesEl = document.createElement("span");
    this.wavesEl.className = "mic-button__waves";
    this.wavesEl.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 3; i += 1) {
      const ring = document.createElement("span");
      ring.className = "mic-button__ring";
      this.wavesEl.appendChild(ring);
    }

    this.iconEl = document.createElement("span");
    this.iconEl.className = "mic-button__icon";
    this.iconEl.textContent = STATE_ICON.idle;

    this.element.appendChild(this.wavesEl);
    this.element.appendChild(this.iconEl);
    this.element.setAttribute("aria-label", STATE_LABEL.idle);

    this.element.addEventListener("click", () => options.onPress());
  }

  setState(state: SpeechState): void {
    this.state = state;
    this.element.className = `mic-button mic-button--${state}`;
    this.iconEl.textContent = STATE_ICON[state];
    this.element.setAttribute("aria-label", STATE_LABEL[state]);
  }

  getState(): SpeechState {
    return this.state;
  }
}
