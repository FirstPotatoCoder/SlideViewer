function initPlayer(deckName, slideCount) {
  DECK = deckName;
  TOTAL = slideCount;
  $("topbar-title").textContent = DECK;
  $("tot-label").textContent = TOTAL;
  buildSidebar();
  $("setup").style.display = "none";
  $("app").classList.add("active");
  idx = 0;
  phase = "idle";
  presentIntro = false;
  warmCache(0);
  showLastFrame(idx);
  updateUI();
}

function goSetup() {
  clearHold();
  pvEls.forEach((v) => {
    v.pause();
    v.src = "";
  });
  svEls.forEach((v) => {
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
  mode = "preview";
  phase = "idle";
  setPresentIntro(false);
}

initState();
loadGallery();
