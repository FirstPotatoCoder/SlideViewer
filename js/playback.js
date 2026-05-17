import { state, svF } from "./state.js";
import { preloadCache } from "./cache.js";
import { $, updateUI } from "./ui.js";
import { _swapPvEl, _swapSvEl, showLastFrame } from "./renderer.js";

// export const fwdPath = (i) =>
//   `public/slides/${state.DECK}/forward/${i + 1}.mp4`;
// export const bwdPath = (i) =>
//   `public/slides/${state.DECK}/backward/${i + 1}.mp4`;

const BASE = window.location.pathname.split("/")[1]
  ? "/" + window.location.pathname.split("/")[1]
  : "";

export const fwdPath = (i) =>
  `${BASE}/public/slides/${state.DECK}/forward/${i + 1}.mp4`;
export const bwdPath = (i) =>
  `${BASE}/public/slides/${state.DECK}/backward/${i + 1}.mp4`;

export function playSlide(i, dir) {
  const cached = preloadCache.get(i);
  const src = cached
    ? dir === "backward"
      ? cached.bwd.src
      : cached.fwd.src
    : dir === "backward"
      ? bwdPath(i)
      : fwdPath(i);

  state.phase = dir;
  $("dot").classList.add("on");
  $("back-badge").classList.toggle("show", dir === "backward");

  if (state.mode === "present") {
    // Drive present stage; preview stage gets silently loaded too (stays in bg)
    _swapSvEl(src, 0, true, onPresentEnded);
    // Keep preview quietly loaded (won't autoplay)
    _swapPvEl(src, 0, false, null);
  } else {
    _swapPvEl(src, 0, true, onPreviewEnded);
  }
  updateUI();
}

function onPreviewEnded() {
  state.phase = "idle";
  $("dot").classList.remove("on");
  $("back-badge").classList.remove("show");
  showLastFrame(state.idx);
  updateUI();
}

function onPresentEnded() {
  state.phase = "idle";
  $("dot").classList.remove("on");
  $("back-badge").classList.remove("show");
  // Seek present stage video to last frame in place (no buffer swap needed)
  const sv = svF();
  if (sv.duration && isFinite(sv.duration)) {
    sv.currentTime = Math.max(0, sv.duration - 0.01);
  }
  // Keep preview in sync too
  showLastFrame(state.idx);
  updateUI();
}
