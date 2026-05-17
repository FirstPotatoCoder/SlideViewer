import { state, pvF, pvB, svF, svB } from "./state.js";
import { playSlide } from "./playback.js";
import { warmCache } from "./cache.js";
import { updateUI, $ } from "./ui.js";
import { showLastFrame } from "./renderer.js";

export function navigate(dir) {
  if (state.phase !== "idle") {
    pvF().pause();
    pvF().onended = null;
    svF().pause();
    svF().onended = null;
    state.phase = "idle";
    $("dot").classList.remove("on");
    $("back-badge").classList.remove("show");
  }
  doNav(dir);
}

function doNav(dir) {
  if (dir === 1) {
    // ── NEXT ──────────────────────────────────────────
    if (state.presentIntro) {
      // We're on the "first frame" intro of the current slide.
      // Play its animation in-place, don't advance state.idx.
      setPresentIntro(false);
      playSlide(state.idx, "forward");
      return;
    }
    if (state.idx >= state.TOTAL - 1) return;
    state.idx++;
    playSlide(state.idx, "forward");
  } else {
    // ── PREV ──────────────────────────────────────────
    if (state.presentIntro) {
      // We're still on intro frame — Prev just goes to the previous slide normally
      setPresentIntro(false);
    }
    if (state.idx <= 0) return;
    const from = state.idx;
    state.idx--;
    playSlide(from, "backward");
  }
  warmCache(state.idx);
  updateUI();
}

export function jumpTo(target) {
  clearHold();
  if (target === state.idx && state.phase === "idle" && !state.presentIntro)
    return;
  pvF().pause();
  pvF().onended = null;
  svF().pause();
  svF().onended = null;
  state.phase = "idle";
  $("dot").classList.remove("on");
  $("back-badge").classList.remove("show");
  state.idx = target;
  setPresentIntro(false);
  warmCache(state.idx);
  if (state.mode === "present") {
    showLastFrame(state.idx); // preview stays in sync
    showFirstFrame(state.idx); // present shows last frame on jump (already played)
    // Actually on jump we show last frame in present too for consistency
    // Re-use showLastFrame for present stage as well:
    _syncPresentToLastFrame(state.idx);
  } else {
    showLastFrame(state.idx);
  }
  updateUI();
}

// ═══════════════════════════════════════════════════════
//  state.presentIntro helpers
// ═══════════════════════════════════════════════════════
export function setPresentIntro(val) {
  state.presentIntro = val;
  const badge = $("present-intro-badge");
  if (badge) badge.classList.toggle("hidden", !val);
}

// ═══════════════════════════════════════════════════════
//  HOLD TO FAST-SCAN
// ═══════════════════════════════════════════════════════
export function startHold(dir) {
  clearHold();
  state.holdTimer = setTimeout(() => {
    state.holdInterval = setInterval(() => navigate(dir), 120);
  }, 350);
}
export function clearHold() {
  if (state.holdTimer) {
    clearTimeout(state.holdTimer);
    state.holdTimer = null;
  }
  if (state.holdInterval) {
    clearInterval(state.holdInterval);
    state.holdInterval = null;
  }
}

// ═══════════════════════════════════════════════════════
//  SEEK BAR
// ═══════════════════════════════════════════════════════
export function seekClick(e) {
  if (state.TOTAL <= 1) return;
  const rect = $("prog-track").getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  jumpTo(Math.round(ratio * (state.TOTAL - 1)));
}
