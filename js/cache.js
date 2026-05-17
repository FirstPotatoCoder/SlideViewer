import { state } from "./state.js";
import { fwdPath, bwdPath } from "./playback.js";

export const LOOK_AHEAD = 3;
export const LOOK_BACK = 1;
export const preloadCache = new Map();

export function makeVid(src) {
  const v = document.createElement("video");
  v.setAttribute("playsinline", "");
  v.setAttribute("webkit-playsinline", "");
  v.preload = "auto";
  v.muted = true;
  v.src = src;
  v.load();
  return v;
}

export function warmCache(center) {
  const lo = Math.max(0, center - LOOK_BACK);
  const hi = Math.min(state.TOTAL - 1, center + LOOK_AHEAD);
  const keep = new Set();

  for (let i = lo; i <= hi; i++) {
    keep.add(i);
    if (!preloadCache.has(i)) {
      preloadCache.set(i, {
        fwd: makeVid(fwdPath(i)),
        bwd: makeVid(bwdPath(i)),
      });
    }
  }

  for (const [k, vs] of preloadCache) {
    if (!keep.has(k)) {
      vs.fwd.src = "";
      vs.bwd.src = "";
      preloadCache.delete(k);
    }
  }
}
