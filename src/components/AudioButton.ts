export type AudioButtonOptions = {
  label: string;
  size?: "md" | "lg";
  onPlay: () => void;
};

/** Botão de alto-falante grande. Faz uma pequena animação a cada toque. */
export function createAudioButton(options: AudioButtonOptions): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `audio-button audio-button--${options.size ?? "md"}`;
  button.setAttribute("aria-label", options.label);
  button.innerHTML = `
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true" focusable="false">
      <path d="M4 10v4h3.5l4 3.5V6.5l-4 3.5H4Z" fill="currentColor" />
      <path d="M15.5 9c1 1 1 5 0 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <path d="M18 7c2 2 2 8 0 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none" />
    </svg>
  `;

  button.addEventListener("click", () => {
    button.classList.remove("audio-button--pulse");
    // force reflow so the animation can restart on repeated clicks
    void button.offsetWidth;
    button.classList.add("audio-button--pulse");
    options.onPlay();
  });

  return button;
}
