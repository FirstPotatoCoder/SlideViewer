import { state } from "./state.js";
import { syncSidebar } from "./sidebar.js";

export function updateUI() {
  const cur = state.idx + 1;
  $("cur-label").textContent = cur;
  $("hud-ctr").textContent = `${cur} / ${state.TOTAL}`;
  $("prog-label").textContent = `${cur} / ${state.TOTAL}`;
  const pct = state.TOTAL > 1 ? (state.idx / (state.TOTAL - 1)) * 100 : 100;
  $("prog-fill").style.width = pct + "%";

  // Prev: disabled at slide 0 (even if on intro, Prev still works)
  $("btn-prev").disabled = state.idx === 0;
  $("hud-prev").disabled = state.idx === 0;

  // Next: disabled only when on the very last slide AND animation already played
  const atEnd = state.idx === state.TOTAL - 1 && !state.presentIntro;
  $("btn-next").disabled = atEnd;
  $("hud-next").disabled = atEnd;

  syncSidebar();
}

export const $ = (id) => document.getElementById(id);
