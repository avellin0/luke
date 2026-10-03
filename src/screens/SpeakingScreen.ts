import type { Screen, Services, Navigate } from "../app/App";
import { MicrophoneButton } from "../components/MicrophoneButton";
import { getLetterById, READY_LETTER_IDS } from "../data/letters";
import { SpeechService } from "../styles/services/SpeechService";

export class SpeakingScreen implements Screen {
  private root: HTMLElement | null = null;
  private services: Services | null = null;

  mount(container: HTMLElement, params: Record<string, string>, services: Services, navigate: Navigate): void {
    this.services = services;
    const letter = getLetterById(params.id);

    const root = document.createElement("div");
    root.className = "screen screen--speaking";
    this.root = root;

    if (!letter) {
      navigate("/letters");
      return;
    }

    const word = letter.examples[0].word;

    const topBar = document.createElement("div");
    topBar.className = "top-bar";
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "icon-button";
    backButton.setAttribute("aria-label", "Voltar");
    backButton.textContent = "←";
    backButton.addEventListener("click", () => navigate(`/match/${letter.id}`));
    topBar.appendChild(backButton);
    root.appendChild(topBar);

    const wordDisplay = document.createElement("p");
    wordDisplay.className = "speaking-word";
    wordDisplay.textContent = word;
    root.appendChild(wordDisplay);

    const feedback = document.createElement("p");
    feedback.className = "practice-panel__feedback";
    feedback.setAttribute("aria-live", "polite");
    root.appendChild(feedback);

    const micButton = new MicrophoneButton({
      onPress: () => this.handleMicPress(word, letter.id, micButton, feedback, nextButton, services),
    });
    root.appendChild(micButton.element);

    if (!services.speech.isSupported) {
      micButton.setState("unsupported");
      const hint = document.createElement("p");
      hint.className = "practice-panel__hint";
      hint.textContent = "Toque para ouvir a palavra";
      root.appendChild(hint);
      micButton.element.addEventListener("click", () => services.audio.speak(word));
    }

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "big-button big-button--primary speaking-next";
    nextButton.textContent = "Próxima letra →";
    nextButton.hidden = true;
    nextButton.addEventListener("click", () => {
      const currentIndex = READY_LETTER_IDS.indexOf(letter.id);
      const nextId = READY_LETTER_IDS[currentIndex + 1];
      navigate(nextId ? `/lesson/${nextId}` : "/letters");
    });
    root.appendChild(nextButton);

    container.appendChild(root);

    window.setTimeout(() => services.audio.speak(word), 300);
  }

  private handleMicPress(
    word: string,
    letterId: string,
    micButton: MicrophoneButton,
    feedback: HTMLElement,
    nextButton: HTMLButtonElement,
    services: Services,
  ): void {
    if (!services.speech.isSupported) return;
    if (micButton.getState() === "listening" || micButton.getState() === "processing") return;

    feedback.textContent = "";
    micButton.setState("listening");

    services.speech.listen(
      (transcript) => {
        micButton.setState("processing");
        window.setTimeout(() => {
          const success = SpeechService.matches(transcript, word);
          services.progress.recordPronunciationAttempt(letterId, success);
          if (success) {
            micButton.setState("success");
            feedback.textContent = "🎉";
            services.audio.playSuccessChime();
            nextButton.hidden = false;
          } else {
            micButton.setState("retry");
            feedback.textContent = "🔁";
            services.audio.playRetryTone();
            window.setTimeout(() => micButton.setState("idle"), 1200);
          }
        }, 300);
      },
      () => {
        micButton.setState("retry");
        feedback.textContent = "🔁";
        window.setTimeout(() => micButton.setState("idle"), 1200);
      },
      () => {
        if (micButton.getState() === "listening") {
          micButton.setState("idle");
        }
      },
    );
  }

  unmount(): void {
    this.services?.speech.stop();
    this.root?.remove();
    this.root = null;
  }
}
