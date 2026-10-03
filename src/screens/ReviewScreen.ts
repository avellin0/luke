import type { Screen, Services, Navigate } from "../app/App";
import { createAudioButton } from "../components/AudioButton";
import { createImageChoice } from "../components/ImageChoice";
import { randomDistractors, wordsForLetter, type PictureWord } from "../data/words";

const TOTAL_QUESTIONS = 5;

export class ReviewScreen implements Screen {
  private root: HTMLElement | null = null;

  mount(container: HTMLElement, _params: Record<string, string>, services: Services, navigate: Navigate): void {
    const root = document.createElement("div");
    root.className = "screen screen--review";
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
    root.appendChild(topBar);

    const practicedIds = services.progress.practicedLetterIds();

    if (practicedIds.length < 2) {
      const message = document.createElement("div");
      message.className = "review-empty";
      message.innerHTML = `
        <span class="review-empty__emoji" aria-hidden="true">🧩</span>
        <p>Pratique mais letras primeiro!</p>
      `;
      const goButton = document.createElement("button");
      goButton.type = "button";
      goButton.className = "big-button big-button--primary";
      goButton.textContent = "Escolher letra";
      goButton.addEventListener("click", () => navigate("/letters"));
      message.appendChild(goButton);
      root.appendChild(message);
      container.appendChild(root);
      return;
    }

    const questionArea = document.createElement("div");
    questionArea.className = "review-question-area";
    root.appendChild(questionArea);

    const counter = document.createElement("p");
    counter.className = "review-counter";
    root.appendChild(counter);

    container.appendChild(root);

    let questionIndex = 0;
    let correctCount = 0;

    const renderQuestion = () => {
      questionArea.innerHTML = "";
      counter.textContent = `Pergunta ${questionIndex + 1} de ${TOTAL_QUESTIONS}`;

      const letterId = practicedIds[Math.floor(Math.random() * practicedIds.length)];
      const candidates = wordsForLetter(letterId);
      const correctWord: PictureWord = candidates[Math.floor(Math.random() * candidates.length)];
      const distractors = randomDistractors(letterId, 2);
      const options = [correctWord, ...distractors].sort(() => Math.random() - 0.5);

      const audioButton = createAudioButton({
        label: `Ouvir ${correctWord.word}`,
        size: "lg",
        onPlay: () => services.audio.speak(correctWord.word),
      });
      questionArea.appendChild(audioButton);

      const feedback = document.createElement("p");
      feedback.className = "match-feedback";
      feedback.setAttribute("aria-live", "polite");
      questionArea.appendChild(feedback);

      const choice = createImageChoice({
        options: options.map((item) => ({ id: item.word, image: item.image, label: item.word })),
        correctId: correctWord.word,
        onAnswer: (correct) => {
          if (correct) {
            correctCount += 1;
            feedback.textContent = "🎉";
            services.audio.playSuccessChime();
            questionIndex += 1;
            window.setTimeout(() => {
              if (questionIndex >= TOTAL_QUESTIONS) {
                renderSummary();
              } else {
                renderQuestion();
              }
            }, 900);
          } else {
            feedback.textContent = "🔁";
            services.audio.playRetryTone();
            window.setTimeout(() => services.audio.speak(correctWord.word), 400);
          }
        },
      });
      questionArea.appendChild(choice);

      window.setTimeout(() => services.audio.speak(correctWord.word), 250);
    };

    const renderSummary = () => {
      questionArea.innerHTML = "";
      counter.textContent = "";

      const summary = document.createElement("div");
      summary.className = "review-summary";
      summary.innerHTML = `
        <span class="review-summary__emoji" aria-hidden="true">🏆</span>
        <p>${correctCount} de ${TOTAL_QUESTIONS}</p>
      `;

      const homeButton = document.createElement("button");
      homeButton.type = "button";
      homeButton.className = "big-button big-button--primary";
      homeButton.textContent = "Voltar";
      homeButton.addEventListener("click", () => navigate("/"));
      summary.appendChild(homeButton);

      questionArea.appendChild(summary);
    };

    renderQuestion();
  }

  unmount(): void {
    this.root?.remove();
    this.root = null;
  }
}
