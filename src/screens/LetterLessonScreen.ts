import type { Screen, Services, Navigate } from "../app/App";
import { createAudioButton } from "../components/AudioButton";
import { MicrophoneButton } from "../components/MicrophoneButton";
import { createProgressIndicator } from "../components/ProgressIndicator";
import { getLetterById, READY_LETTER_IDS } from "../data/letters";
import { SpeechService } from "../styles/services/SpeechService";

export class LetterLessonScreen implements Screen {
  private root: HTMLElement | null = null;
  private services: Services | null = null;

  mount(container: HTMLElement, params: Record<string, string>, services: Services, navigate: Navigate): void {
    this.services = services;
    const letter = getLetterById(params.id);

    const root = document.createElement("div");
    root.className = "screen screen--lesson";
    this.root = root;

    if (!letter) {
      navigate("/letters");
      return;
    }

    const topBar = document.createElement("div");
    topBar.className = "top-bar";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "icon-button";
    backButton.setAttribute("aria-label", "Voltar");
    backButton.textContent = "←";
    backButton.addEventListener("click", () => navigate("/letters"));
    topBar.appendChild(backButton);

    const indicator = createProgressIndicator({
      current: services.progress.practicedLetterIds().length,
      total: READY_LETTER_IDS.length,
    });
    topBar.appendChild(indicator);

    root.appendChild(topBar);

    const card = document.createElement("div");
    card.className = "lesson-card";

    const glyphRow = document.createElement("div");
    glyphRow.className = "lesson-card__glyph-row";

    const glyph = document.createElement("button");
    glyph.type = "button";
    glyph.className = "lesson-card__glyph";
    glyph.style.setProperty("--letter-color", letter.color);
    glyph.textContent = letter.character;
    glyph.setAttribute("aria-label", `Ouvir o som da letra ${letter.character}`);
    glyph.addEventListener("click", () => {
      glyph.classList.remove("lesson-card__glyph--bounce");
      void glyph.offsetWidth;
      glyph.classList.add("lesson-card__glyph--bounce");
      services.audio.speak(letter.character);
    });
    glyphRow.appendChild(glyph);

    const audioButton = createAudioButton({
      label: `Ouvir som da letra ${letter.character} de novo`,
      size: "lg",
      onPlay: () => services.audio.speak(letter.character),
    });
    glyphRow.appendChild(audioButton);

    card.appendChild(glyphRow);

    const example = letter.examples[0];
    const imageButton = document.createElement("button");
    imageButton.type = "button";
    imageButton.className = "lesson-card__image-button";
    imageButton.setAttribute("aria-label", `Ouvir a palavra ${example.word}`);
    imageButton.innerHTML = `<span class="lesson-card__image" aria-hidden="true">${example.image}</span>`;
    imageButton.addEventListener("click", () => services.audio.speak(example.word));
    card.appendChild(imageButton);

    const wordLabel = document.createElement("p");
    wordLabel.className = "lesson-card__word";
    wordLabel.textContent = example.word;
    card.appendChild(wordLabel);

    root.appendChild(card);

    const practicePanel = document.createElement("div");
    practicePanel.className = "practice-panel";

    const prompt = document.createElement("p");
    prompt.className = "practice-panel__prompt";
    prompt.textContent = "Agora você!";
    practicePanel.appendChild(prompt);

    const feedback = document.createElement("p");
    feedback.className = "practice-panel__feedback";
    feedback.setAttribute("aria-live", "polite");
    practicePanel.appendChild(feedback);

    const micButton = new MicrophoneButton({
      onPress: () => this.handleMicPress(letter.character, micButton, feedback),
    });
    practicePanel.appendChild(micButton.element);

    if (!services.speech.isSupported) {
      micButton.setState("unsupported");
      const hint = document.createElement("p");
      hint.className = "practice-panel__hint";
      hint.textContent = "Toque para ouvir o som de novo";
      practicePanel.appendChild(hint);
    }

    root.appendChild(practicePanel);

    const continueButton = document.createElement("button");
    continueButton.type = "button";
    continueButton.className = "big-button big-button--secondary lesson-continue";
    continueButton.textContent = "Continuar →";
    continueButton.addEventListener("click", () => {
      services.progress.markPracticed(letter.id);
      services.progress.setLastLetter(letter.id);
      if (letter.isVowel) {
        navigate(`/match/${letter.id}`);
      } else {
        navigate(`/syllables/${letter.id}`);
      }
    });
    root.appendChild(continueButton);

    container.appendChild(root);

    // Apresenta o som da letra automaticamente ao abrir a lição.
    window.setTimeout(() => services.audio.speak(letter.character), 300);
  }

  private handleMicPress(target: string, micButton: MicrophoneButton, feedback: HTMLElement): void {
    const services = this.services;
    if (!services) return;

    if (!services.speech.isSupported) {
      services.audio.speak(target);
      return;
    }

    if (micButton.getState() === "listening" || micButton.getState() === "processing") return;

    feedback.textContent = "";
    micButton.setState("listening");

    services.speech.listen(
      (transcript) => {
        micButton.setState("processing");
        window.setTimeout(() => {
          const success = SpeechService.matches(transcript, target);
          if (success) {
            micButton.setState("success");
            feedback.textContent = "🎉";
            services.audio.playSuccessChime();
          } else {
            micButton.setState("retry");
            feedback.textContent = "🔁";
            services.audio.playRetryTone();
          }
          window.setTimeout(() => micButton.setState("idle"), 1400);
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
