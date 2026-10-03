import type { Screen, Services, Navigate } from "../app/App";
import { LETTERS } from "../data/letters";

export class ProgressScreen implements Screen {
  private root: HTMLElement | null = null;

  mount(container: HTMLElement, _params: Record<string, string>, services: Services, navigate: Navigate): void {
    const root = document.createElement("div");
    root.className = "screen screen--progress";
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
    heading.textContent = "Progresso";
    topBar.appendChild(heading);

    root.appendChild(topBar);

    const list = document.createElement("ul");
    list.className = "progress-list";

    LETTERS.forEach((letter) => {
      const progress = services.progress.getProgress(letter.id);
      const item = document.createElement("li");
      item.className = "progress-list__item";
      item.innerHTML = `
        <span class="progress-list__letter">${letter.character}</span>
        <span class="progress-list__status" aria-hidden="true">${progress.practiced ? "✓" : "○"}</span>
      `;
      item.setAttribute(
        "aria-label",
        `Letra ${letter.character}: ${progress.practiced ? "praticada" : "ainda não praticada"}`,
      );
      list.appendChild(item);
    });

    root.appendChild(list);

    const practicedCount = services.progress.practicedLetterIds().length;
    const pronunciationCount = services.progress.totalPronunciationAttempts();

    const stats = document.createElement("div");
    stats.className = "progress-stats";
    stats.innerHTML = `
      <p>⭐ ${practicedCount} letras praticadas</p>
      <p>🎤 ${pronunciationCount} sons praticados</p>
    `;
    root.appendChild(stats);

    container.appendChild(root);
  }

  unmount(): void {
    this.root?.remove();
    this.root = null;
  }
}
