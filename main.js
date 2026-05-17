import { setPresentIntro } from "./js/navigation.js";
import { initState, state } from "./js/state.js";
import { showLastFrame } from "./js/renderer.js";
import { buildSidebar } from "./js/sidebar.js";
import { loadGallery } from "./js/gallery.js";
import { preloadCache } from "./js/cache.js";
import { warmCache } from "./js/cache.js";
import { updateUI, $ } from "./js/ui.js";

// Keyboard and controller
import "./js/keyboard.js";
// import "./js/remote.js"; // turn-off websocket fofr Github.io

// Navigation
import { startHold, clearHold, navigate, seekClick } from "./js/navigation.js";
import { setMode } from "./js/mode.js";

window.startHold = startHold;
window.clearHold = clearHold;
window.navigate = navigate;
window.setMode = setMode;
window.goSetup = goSetup;
window.seekClick = seekClick;

export function initPlayer(deckName, slideCount) {
  state.DECK = deckName;
  state.TOTAL = slideCount;
  $("topbar-title").textContent = state.DECK;
  $("tot-label").textContent = state.TOTAL;
  buildSidebar();
  $("setup").style.display = "none";
  $("app").classList.add("active");
  state.idx = 0;
  state.phase = "idle";
  state.presentIntro = false;
  warmCache(0);
  showLastFrame(state.idx);
  updateUI();
}

export function goSetup() {
  clearHold();
  state.pvEls.forEach((v) => {
    v.pause();
    v.src = "";
  });
  state.svEls.forEach((v) => {
    v.pause();
    v.src = "";
  });
  preloadCache.forEach((vs) => {
    vs.fwd.src = "";
    vs.bwd.src = "";
  });
  preloadCache.clear();
  $("app").classList.remove("active");
  $("present-overlay").classList.remove("on");
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  $("setup").style.display = "flex";
  $("sidebar").innerHTML = "";
  state.mode = "preview";
  state.phase = "idle";
  setPresentIntro(false);
}

initState();
loadGallery();
