import { App } from "./app/App";

const root = document.getElementById("app");

if (root) {
  const app = new App(root);
  app.start();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}