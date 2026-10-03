import type { Screen, Services, Navigate } from "../app/App";
import { getLetterById } from "../data/letters";
import { VOWELS, buildSyllable } from "../data/syllables";

export class SyllableScreen implements Screen {
  private root: HTMLElement | null = null;
  private triedCount = 0;

  mount(container: HTMLElement, params: Record<string, string>, services: Services, navigate: Navigate): void {
    const letter = getLetterById(params.id);
    this.triedCount = 0;

    const root = document.createElement("div");
    root.className = "screen screen--syllables";
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
    backButton.addEventListener("click", () => navigate(`/lesson/${letter.id}`));
    topBar.appendChild(backButton);
    root.appendChild(topBar);

    const display = document.createElement("div");
    display.className = "syllable-display";
    display.style.setProperty("--letter-color", letter.color);
    display.textContent = letter.character;
    root.appendChild(display);

    const vowelsRow = document.createElement("div");
    vowelsRow.className = "syllable-vowels";

    const continueButton = document.createElement("button");
    continueButton.type = "button";
    continueButton.className = "big-button big-button--secondary syllable-continue";
    continueButton.textContent = "Continuar →";
    continueButton.hidden = true;
    continueButton.addEventListener("click", () => navigate(`/match/${letter.id}`));

    VOWELS.forEach((vowel) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "syllable-vowel";
      button.textContent = vowel;
      button.setAttribute("aria-label", `Formar sílaba ${letter.character}${vowel.toLowerCase()}`);
      button.addEventListener("click", () => {
        const syllable = buildSyllable(letter.character, vowel);
        display.textContent = syllable;
        display.classList.remove("syllable-display--pop");
        void display.offsetWidth;
        display.classList.add("syllable-display--pop");
        services.audio.speak(syllable);

        this.triedCount += 1;
        if (this.triedCount >= 2) {
          continueButton.hidden = false;
        }
      });
      vowelsRow.appendChild(button);
    });

    root.appendChild(vowelsRow);
    root.appendChild(continueButton);

    container.appendChild(root);
  }

  unmount(): void {
    this.root?.remove();
    this.root = null;
  }
}
