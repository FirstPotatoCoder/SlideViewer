function navigate(dir) {
  if (phase !== "idle") {
    pvF().pause();
    pvF().onended = null;
    svF().pause();
    svF().onended = null;
    phase = "idle";
    $("dot").classList.remove("on");
    $("back-badge").classList.remove("show");
  }
  doNav(dir);
}

function doNav(dir) {
  if (dir === 1) {
    // ── NEXT ──────────────────────────────────────────
    if (presentIntro) {
      // We're on the "first frame" intro of the current slide.
      // Play its animation in-place, don't advance idx.
      setPresentIntro(false);
      playSlide(idx, "forward");
      return;
    }
    if (idx >= TOTAL - 1) return;
    idx++;
    playSlide(idx, "forward");
  } else {
    // ── PREV ──────────────────────────────────────────
    if (presentIntro) {
      // We're still on intro frame — Prev just goes to the previous slide normally
      setPresentIntro(false);
    }
    if (idx <= 0) return;
    const from = idx;
    idx--;
    playSlide(from, "backward");
  }
  warmCache(idx);
  updateUI();
}

function jumpTo(target) {
  clearHold();
  if (target === idx && phase === "idle" && !presentIntro) return;
  pvF().pause();
  pvF().onended = null;
  svF().pause();
  svF().onended = null;
  phase = "idle";
  $("dot").classList.remove("on");
  $("back-badge").classList.remove("show");
  idx = target;
  setPresentIntro(false);
  warmCache(idx);
  if (mode === "present") {
    showLastFrame(idx); // preview stays in sync
    showFirstFrame(idx); // present shows last frame on jump (already played)
    // Actually on jump we show last frame in present too for consistency
    // Re-use showLastFrame for present stage as well:
    _syncPresentToLastFrame(idx);
  } else {
    showLastFrame(idx);
  }
  updateUI();
}

// ═══════════════════════════════════════════════════════
//  presentIntro helpers
// ═══════════════════════════════════════════════════════
function setPresentIntro(val) {
  presentIntro = val;
  const badge = $("present-intro-badge");
  if (badge) badge.classList.toggle("hidden", !val);
}

// ═══════════════════════════════════════════════════════
//  HOLD TO FAST-SCAN
// ═══════════════════════════════════════════════════════
function startHold(dir) {
  clearHold();
  holdTimer = setTimeout(() => {
    holdInterval = setInterval(() => navigate(dir), 120);
  }, 350);
}
function clearHold() {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
  if (holdInterval) {
    clearInterval(holdInterval);
    holdInterval = null;
  }
}

// ═══════════════════════════════════════════════════════
//  SEEK BAR
// ═══════════════════════════════════════════════════════
function seekClick(e) {
  if (TOTAL <= 1) return;
  const rect = $("prog-track").getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  jumpTo(Math.round(ratio * (TOTAL - 1)));
}
