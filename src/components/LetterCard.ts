export type LetterCardOptions = {
  character: string;
  practiced: boolean;
  ready: boolean;
  onSelect: () => void;
};

/** Cartão grande e clicável representando uma letra na grade de seleção. */
export function createLetterCard(options: LetterCardOptions): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "letter-card";
  if (options.practiced) button.classList.add("letter-card--practiced");
  if (!options.ready) button.classList.add("letter-card--soon");

  const glyph = document.createElement("span");
  glyph.className = "letter-card__glyph";
  glyph.textContent = options.character;
  button.appendChild(glyph);

  if (options.practiced) {
    const badge = document.createElement("span");
    badge.className = "letter-card__badge";
    badge.textContent = "⭐";
    badge.setAttribute("aria-hidden", "true");
    button.appendChild(badge);
  }

  button.setAttribute(
    "aria-label",
    options.ready
      ? `Letra ${options.character}${options.practiced ? ", já praticada" : ""}`
      : `Letra ${options.character}, em breve`,
  );

  button.addEventListener("click", () => {
    if (!options.ready) return;
    options.onSelect();
  });

  return button;
}
