import type { Screen, Services, Navigate } from "../app/App";
import { createAudioButton } from "../components/AudioButton";
import { createImageChoice } from "../components/ImageChoice";
import { getLetterById } from "../data/letters";
import { randomDistractors, wordsForLetter } from "../data/words";

export class ImageMatchScreen implements Screen {
  private root: HTMLElement | null = null;

  mount(container: HTMLElement, params: Record<string, string>, services: Services, navigate: Navigate): void {
    const letter = getLetterById(params.id);

    const root = document.createElement("div");
    root.className = "screen screen--match";
    this.root = root;

    if (!letter) {
      navigate("/letters");
      return;
    }

    const correctWord = wordsForLetter(letter.id)[0];
    const distractors = randomDistractors(letter.id, 2);
    const options = [correctWord, ...distractors].sort(() => Math.random() - 0.5);

    const topBar = document.createElement("div");
    topBar.className = "top-bar";
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "icon-button";
    backButton.setAttribute("aria-label", "Voltar");
    backButton.textContent = "←";
    backButton.addEventListener("click", () => navigate(`/syllables/${letter.id}`));
    topBar.appendChild(backButton);
    root.appendChild(topBar);

    const prompt = document.createElement("div");
    prompt.className = "match-prompt";

    const audioButton = createAudioButton({
      label: `Ouvir ${correctWord.word}`,
      size: "lg",
      onPlay: () => services.audio.speak(correctWord.word),
    });
    prompt.appendChild(audioButton);
    root.appendChild(prompt);

    const feedback = document.createElement("p");
    feedback.className = "match-feedback";
    feedback.setAttribute("aria-live", "polite");
    root.appendChild(feedback);

    const choice = createImageChoice({
      options: options.map((item) => ({ id: item.word, image: item.image, label: item.word })),
      correctId: correctWord.word,
      onAnswer: (correct) => {
        if (correct) {
          feedback.textContent = "🎉";
          services.audio.playSuccessChime();
          window.setTimeout(() => navigate(`/speaking/${letter.id}`), 1000);
        } else {
          feedback.textContent = "🔁";
          services.audio.playRetryTone();
          window.setTimeout(() => services.audio.speak(correctWord.word), 400);
        }
      },
    });
    root.appendChild(choice);

    container.appendChild(root);

    window.setTimeout(() => services.audio.speak(correctWord.word), 300);
  }

  unmount(): void {
    this.root?.remove();
    this.root = null;
  }
}
