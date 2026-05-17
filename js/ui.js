function updateUI() {
  const cur = idx + 1;
  $("cur-label").textContent = cur;
  $("hud-ctr").textContent = `${cur} / ${TOTAL}`;
  $("prog-label").textContent = `${cur} / ${TOTAL}`;
  const pct = TOTAL > 1 ? (idx / (TOTAL - 1)) * 100 : 100;
  $("prog-fill").style.width = pct + "%";

  // Prev: disabled at slide 0 (even if on intro, Prev still works)
  $("btn-prev").disabled = idx === 0;
  $("hud-prev").disabled = idx === 0;

  // Next: disabled only when on the very last slide AND animation already played
  const atEnd = idx === TOTAL - 1 && !presentIntro;
  $("btn-next").disabled = atEnd;
  $("hud-next").disabled = atEnd;

  syncSidebar();
}

const $ = (id) => document.getElementById(id);
