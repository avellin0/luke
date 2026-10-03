import type { Screen, Services, Navigate } from "../app/App";
import { createProgressIndicator } from "../components/ProgressIndicator";
import { READY_LETTER_IDS } from "../data/letters";

export class HomeScreen implements Screen {
  private root: HTMLElement | null = null;

  mount(container: HTMLElement, _params: Record<string, string>, services: Services, navigate: Navigate): void {
    const root = document.createElement("div");
    root.className = "screen screen--home";
    this.root = root;

    const sky = document.createElement("div");
    sky.className = "home-illustration";
    sky.setAttribute("aria-hidden", "true");
    sky.innerHTML = `
      <span class="home-illustration__cloud home-illustration__cloud--1">☁️</span>
      <span class="home-illustration__cloud home-illustration__cloud--2">☁️</span>
      <span class="home-illustration__sun">🌤️</span>
      <span class="home-illustration__mascot">🦊</span>
    `;
    root.appendChild(sky);

    const title = document.createElement("h1");
    title.className = "home-title";
    title.textContent = "Letrinhas";
    root.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.className = "home-subtitle";
    subtitle.textContent = "aprender brincando";
    root.appendChild(subtitle);

    const practiced = services.progress.practicedLetterIds().length;
    const indicator = createProgressIndicator({ current: practiced, total: READY_LETTER_IDS.length });
    indicator.classList.add("home-progress");
    root.appendChild(indicator);

    const startButton = document.createElement("button");
    startButton.type = "button";
    startButton.className = "big-button big-button--primary home-start";
    startButton.textContent = "Vamos! ▶";
    startButton.addEventListener("click", () => {
      services.audio.speak("Vamos!");
      navigate("/letters");
    });
    root.appendChild(startButton);

    const secondaryRow = document.createElement("div");
    secondaryRow.className = "home-secondary-row";

    const reviewButton = document.createElement("button");
    reviewButton.type = "button";
    reviewButton.className = "pill-button";
    reviewButton.innerHTML = `🧩 <span>Revisar</span>`;
    reviewButton.addEventListener("click", () => navigate("/review"));
    secondaryRow.appendChild(reviewButton);

    const progressButton = document.createElement("button");
    progressButton.type = "button";
    progressButton.className = "pill-button";
    progressButton.innerHTML = `📊 <span>Para os pais</span>`;
    progressButton.addEventListener("click", () => navigate("/progress"));
    secondaryRow.appendChild(progressButton);

    root.appendChild(secondaryRow);

    container.appendChild(root);
  }

  unmount(): void {
    this.root?.remove();
    this.root = null;
  }
}
