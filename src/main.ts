import { App } from "./app/App";

const root = document.getElementById("app");

if (root) {
  const app = new App(root);
  app.start();
}