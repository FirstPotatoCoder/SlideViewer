// ═══════════════════════════════════════════════════════
//  showFirstFrame — load frame 0 of slide i into the
//  present stage only (preview stage stays as-is).
// ═══════════════════════════════════════════════════════
function showFirstFrame(i) {
  const cached = preloadCache.get(i);
  const src = cached ? cached.fwd.src : fwdPath(i);
  _swapSvEl(src, 0, false, null);
}

// ═══════════════════════════════════════════════════════
//  showLastFrame — seek forward video to its last frame
//  and display in preview (and present if not in present mode)
// ═══════════════════════════════════════════════════════
function showLastFrame(i) {
  const cached = preloadCache.get(i);
  if (!cached) {
    _showLastFrameDirect(fwdPath(i));
    return;
  }
  const src = cached.fwd;

  const doSeekAndSwap = () => {
    const dur = src.duration;
    const seekTo = dur && isFinite(dur) ? Math.max(0, dur - 0.01) : 0;
    const doSwap = () => {
      src.removeEventListener("seeked", doSwap);
      _swapPvEl(src.src, seekTo, false, null);
    };
    src.currentTime = seekTo;
    if (Math.abs(src.currentTime - seekTo) < 0.05) {
      doSwap();
    } else {
      src.addEventListener("seeked", doSwap, { once: true });
    }
  };

  if (src.readyState >= 1) {
    doSeekAndSwap();
  } else {
    src.addEventListener("loadedmetadata", doSeekAndSwap, { once: true });
  }
}

function _showLastFrameDirect(path) {
  const bv = pvB();
  bv.oncanplay = null;
  bv.onloadedmetadata = null;
  bv.src = path;
  bv.load();
  bv.onloadedmetadata = () => {
    bv.onloadedmetadata = null;
    const seekTo =
      bv.duration && isFinite(bv.duration)
        ? Math.max(0, bv.duration - 0.01)
        : 0;
    bv.currentTime = seekTo;
    const doSwap = () => {
      bv.removeEventListener("seeked", doSwap);
      _swapPvEl(bv.src, seekTo, false, null);
    };
    if (Math.abs(bv.currentTime - seekTo) < 0.05) doSwap();
    else bv.addEventListener("seeked", doSwap, { once: true });
  };
}

// ═══════════════════════════════════════════════════════
//  _swapPvEl — swap preview buffer
// ═══════════════════════════════════════════════════════
function _swapPvEl(src, time, autoplay, onEndedCb) {
  const fv = pvF();
  const bv = pvB();
  fv.onended = null;
  bv.oncanplay = null;

  const doSwap = () => {
    bv.oncanplay = null;
    bv.className = "front fadein";
    fv.className = "back";
    pvFront = 1 - pvFront;
    bv.addEventListener("animationend", () => bv.classList.remove("fadein"), {
      once: true,
    });
    if (autoplay) {
      bv.play().catch(() => {});
      bv.onended = onEndedCb;
    }
  };

  if (bv.src !== new URL(src, location.href).href) {
    bv.src = src;
    bv.load();
  }
  bv.currentTime = time;
  if (bv.readyState >= 3) doSwap();
  else bv.oncanplay = doSwap;
}

// ═══════════════════════════════════════════════════════
//  _swapSvEl — swap present buffer
// ═══════════════════════════════════════════════════════
function _swapSvEl(src, time, autoplay, onEndedCb) {
  const fv = svF();
  const bv = svB();
  fv.onended = null;
  bv.oncanplay = null;

  const doSwap = () => {
    bv.oncanplay = null;
    bv.className = "front fadein";
    fv.className = "back";
    svFront = 1 - svFront;
    bv.addEventListener("animationend", () => bv.classList.remove("fadein"), {
      once: true,
    });
    if (autoplay) {
      bv.play().catch(() => {});
      bv.onended = onEndedCb;
    }
  };

  if (bv.src !== new URL(src, location.href).href) {
    bv.src = src;
    bv.load();
  }
  bv.currentTime = time;
  if (bv.readyState >= 3) doSwap();
  else bv.oncanplay = doSwap;
}

// Helper: seek present stage to last frame of slide i
function _syncPresentToLastFrame(i) {
  const cached = preloadCache.get(i);
  const src = cached ? cached.fwd.src : fwdPath(i);
  // We need duration — load into a temp element if not cached
  if (cached && cached.fwd.readyState >= 1) {
    const dur = cached.fwd.duration;
    const seekTo = dur && isFinite(dur) ? Math.max(0, dur - 0.01) : 0;
    _swapSvEl(src, seekTo, false, null);
  } else {
    // Just show frame 0 as fallback; it'll be close enough
    _swapSvEl(src, 0, false, null);
  }
}
