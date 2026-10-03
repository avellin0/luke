import type { Screen, Services, Navigate } from "../app/App";
import { createLetterCard } from "../components/LetterCard";
import { ALL_ALPHABET, READY_LETTER_IDS } from "../data/letters";

export class LetterSelectionScreen implements Screen {
  private root: HTMLElement | null = null;

  mount(container: HTMLElement, _params: Record<string, string>, services: Services, navigate: Navigate): void {
    const root = document.createElement("div");
    root.className = "screen screen--letters";
    this.root = root;

    const topBar = document.createElement("div");
    topBar.className = "top-bar";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "icon-button";
    backButton.setAttribute("aria-label", "Voltar");
    backButton.textContent = "←";
    backButton.addEventListener("click", () => navigate("/"));
    topBar.appendChild(backButton);

    const heading = document.createElement("h2");
    heading.className = "top-bar__title";
    heading.textContent = "Escolha uma letra";
    topBar.appendChild(heading);

    root.appendChild(topBar);

    const grid = document.createElement("div");
    grid.className = "letter-grid";

    ALL_ALPHABET.forEach((character) => {
      const id = character.toLowerCase();
      const ready = READY_LETTER_IDS.includes(id);
      const practiced = services.progress.getProgress(id).practiced;

      const card = createLetterCard({
        character,
        ready,
        practiced,
        onSelect: () => {
          services.audio.speak(character);
          navigate(`/lesson/${id}`);
        },
      });

      grid.appendChild(card);
    });

    root.appendChild(grid);
    container.appendChild(root);
  }

  unmount(): void {
    this.root?.remove();
    this.root = null;
  }
}
