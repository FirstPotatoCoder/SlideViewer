import { state, pvF, pvB, svF } from "./state.js";
import { updateUI, $ } from "./ui.js";
import { showFirstFrame } from "./renderer.js";
import { setPresentIntro } from "./navigation.js";

// ═══════════════════════════════════════════════════════
//  MODE SWITCH
//
//  Entering PRESENT: show first frame of current slide on
//  present stage, set presentIntro = true so the first
//  Next plays the animation in-place instead of advancing.
//
//  Returning to PREVIEW: clear intro flag, preview stage
//  already shows the correct last frame.
// ═══════════════════════════════════════════════════════
export function setMode(m) {
  if (m === state.mode) return;

  if (m === "present") {
    // Stop any running playback
    pvF().pause();
    pvF().onended = null;
    state.phase = "idle";
    $("dot").classList.remove("on");
    $("back-badge").classList.remove("show");

    // Show FIRST frame on the present stage
    showFirstFrame(state.idx);

    // Arm the intro so the next Next plays in-place
    setPresentIntro(true);
  } else {
    // Returning to preview
    svF().pause();
    svF().onended = null;
    state.phase = "idle";
    $("dot").classList.remove("on");
    $("back-badge").classList.remove("show");
    setPresentIntro(false);
    // Preview stage still shows the correct frame — no action needed
  }

  state.mode = m;
  $("btn-preview").classList.toggle("active", m === "preview");
  $("btn-present").classList.toggle("active", m === "present");
  $("present-overlay").classList.toggle("on", m === "present");

  if (m === "present") {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  updateUI();
}

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && state.mode === "present")
    setMode("preview");
});
