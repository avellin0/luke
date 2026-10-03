export type ProgressIndicatorOptions = {
  current: number;
  total: number;
};

/** Barra de progresso simples usada no topo das telas de lição. */
export function createProgressIndicator(options: ProgressIndicatorOptions): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className = "progress-indicator";
  wrapper.setAttribute("role", "progressbar");
  wrapper.setAttribute("aria-valuemin", "0");
  wrapper.setAttribute("aria-valuemax", String(options.total));
  wrapper.setAttribute("aria-valuenow", String(options.current));
  wrapper.setAttribute("aria-label", `${options.current} de ${options.total} letras praticadas`);

  const track = document.createElement("div");
  track.className = "progress-indicator__track";

  const fill = document.createElement("div");
  fill.className = "progress-indicator__fill";
  const percent = options.total === 0 ? 0 : Math.round((options.current / options.total) * 100);
  fill.style.width = `${percent}%`;
  track.appendChild(fill);

  const label = document.createElement("span");
  label.className = "progress-indicator__label";
  label.innerHTML = `⭐ <strong>${options.current}</strong>/${options.total}`;

  wrapper.appendChild(track);
  wrapper.appendChild(label);

  return wrapper;
}
