export type ImageChoiceOption = {
  id: string;
  image: string;
  label: string;
};

export type ImageChoiceOptions = {
  options: ImageChoiceOption[];
  correctId: string;
  onAnswer: (correct: boolean) => void;
};

/** Três imagens grandes para a criança tocar na resposta correta. */
export function createImageChoice(config: ImageChoiceOptions): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className = "image-choice";
  wrapper.setAttribute("role", "group");
  wrapper.setAttribute("aria-label", "Escolha a imagem correta");

  let answered = false;

  config.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "image-choice__option";
    button.setAttribute("aria-label", option.label);
    button.innerHTML = `<span class="image-choice__emoji" aria-hidden="true">${option.image}</span>`;

    button.addEventListener("click", () => {
      if (answered) return;
      const correct = option.id === config.correctId;

      if (correct) {
        answered = true;
        button.classList.add("image-choice__option--correct");
      } else {
        button.classList.add("image-choice__option--wrong");
        window.setTimeout(() => button.classList.remove("image-choice__option--wrong"), 420);
      }

      config.onAnswer(correct);
    });

    wrapper.appendChild(button);
  });

  return wrapper;
}
