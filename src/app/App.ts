import { AudioService } from "../styles/services/AudioService";
import { SpeechService } from "../styles/services/SpeechService";
import { StorageService } from "../styles/services/StorageService";
import { ProgressService } from "../styles/services/ProgressService";

import { HomeScreen } from "../screens/HomeScreen";
import { LetterSelectionScreen } from "../screens/LetterSelectionScreen";
import { LetterLessonScreen } from "../screens/LetterLessonScreen";
import { SyllableScreen } from "../screens/SyllableScreen";
import { ImageMatchScreen } from "../screens/ImageMatchScreen";
import { SpeakingScreen } from "../screens/SpeakingScreen";
import { ReviewScreen } from "../screens/ReviewScreen";
import { ProgressScreen } from "../screens/ProgressScreen";

export type Services = {
  audio: AudioService;
  speech: SpeechService;
  storage: StorageService;
  progress: ProgressService;
};

export interface Screen {
  mount(container: HTMLElement, params: Record<string, string>, services: Services, navigate: Navigate): void;
  unmount(): void;
}

export type Navigate = (path: string) => void;

type RouteDefinition = {
  pattern: RegExp;
  keys: string[];
  factory: () => Screen;
};

function compileRoute(path: string, factory: () => Screen): RouteDefinition {
  const keys: string[] = [];
  const patternSource = path
    .split("/")
    .map((segment) => {
      if (segment.startsWith(":")) {
        keys.push(segment.slice(1));
        return "([^/]+)";
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  return { pattern: new RegExp(`^${patternSource}$`), keys, factory };
}

export class App {
  private container: HTMLElement;
  private services: Services;
  private currentScreen: Screen | null = null;
  private routes: RouteDefinition[];

  constructor(container: HTMLElement) {
    this.container = container;

    const storage = new StorageService();
    this.services = {
      audio: new AudioService(),
      speech: new SpeechService(),
      storage,
      progress: new ProgressService(storage),
    };

    this.routes = [
      compileRoute("/", () => new HomeScreen()),
      compileRoute("/letters", () => new LetterSelectionScreen()),
      compileRoute("/lesson/:id", () => new LetterLessonScreen()),
      compileRoute("/syllables/:id", () => new SyllableScreen()),
      compileRoute("/match/:id", () => new ImageMatchScreen()),
      compileRoute("/speaking/:id", () => new SpeakingScreen()),
      compileRoute("/review", () => new ReviewScreen()),
      compileRoute("/progress", () => new ProgressScreen()),
    ];

    window.addEventListener("hashchange", () => this.handleRouteChange());
  }

  start(): void {
    if (!window.location.hash) {
      window.location.hash = "#/";
    }
    this.handleRouteChange();
  }

  private navigate: Navigate = (path: string) => {
    window.location.hash = `#${path}`;
  };

  private handleRouteChange(): void {
    const hash = window.location.hash.replace(/^#/, "") || "/";

    for (const route of this.routes) {
      const match = hash.match(route.pattern);
      if (!match) continue;

      const params: Record<string, string> = {};
      route.keys.forEach((key, index) => {
        params[key] = match[index + 1];
      });

      this.renderScreen(route.factory(), params);
      return;
    }

    // Rota desconhecida: volta para a tela inicial.
    window.location.hash = "#/";
  }

  private renderScreen(screen: Screen, params: Record<string, string>): void {
    this.services.audio.stop();
    this.services.speech.stop();

    this.currentScreen?.unmount();
    this.container.innerHTML = "";
    this.currentScreen = screen;
    screen.mount(this.container, params, this.services, this.navigate);
  }
}
