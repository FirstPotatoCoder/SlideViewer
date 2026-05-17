const fwdPath = (i) => `public/slides/${DECK}/forward/${i + 1}.mp4`;
const bwdPath = (i) => `public/slides/${DECK}/backward/${i + 1}.mp4`;

function playSlide(i, dir) {
  const cached = preloadCache.get(i);
  const src = cached
    ? dir === "backward"
      ? cached.bwd.src
      : cached.fwd.src
    : dir === "backward"
      ? bwdPath(i)
      : fwdPath(i);

  phase = dir;
  $("dot").classList.add("on");
  $("back-badge").classList.toggle("show", dir === "backward");

  if (mode === "present") {
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
  phase = "idle";
  $("dot").classList.remove("on");
  $("back-badge").classList.remove("show");
  showLastFrame(idx);
  updateUI();
}

function onPresentEnded() {
  phase = "idle";
  $("dot").classList.remove("on");
  $("back-badge").classList.remove("show");
  // Seek present stage video to last frame in place (no buffer swap needed)
  const sv = svF();
  if (sv.duration && isFinite(sv.duration)) {
    sv.currentTime = Math.max(0, sv.duration - 0.01);
  }
  // Keep preview in sync too
  showLastFrame(idx);
  updateUI();
}
