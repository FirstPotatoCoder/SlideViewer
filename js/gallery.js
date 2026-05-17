import { initPlayer } from "../main.js";

// const MANIFEST_PATH = "public/slides/manifest.json";

const BASE = window.location.pathname.split("/")[1]
  ? "/" + window.location.pathname.split("/")[1]
  : "";

const MANIFEST_PATH = `${BASE}/public/slides/manifest.json`;

let manifests = [];

export async function loadGallery() {
  const grid = document.getElementById("gallery-grid");
  try {
    const res = await fetch(MANIFEST_PATH);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    manifests = await res.json();
  } catch (e) {
    grid.innerHTML = `
      <div class="gallery-state">
        <div class="icon">📂</div>
        <div>Could not load <code>${MANIFEST_PATH}</code></div>
        <div style="color:var(--muted);font-size:.7rem;line-height:1.8">
          Create a JSON file at that path:<br>
          <code>[ { "name": "deckName", "slides": 69 } ]</code>
        </div>
      </div>`;
    return;
  }

  document.getElementById("gallery-meta").textContent =
    `${manifests.length} deck${manifests.length !== 1 ? "s" : ""}`;

  grid.innerHTML = "";
  const observer = new IntersectionObserver(onCardVisible, {
    root: document.querySelector(".gallery-body"),
    rootMargin: "120px",
  });

  manifests.forEach((deck, i) => {
    const card = document.createElement("div");
    card.className = "deck-card";
    card.dataset.i = i;
    card.onclick = () => initPlayer(deck.name, deck.slides);

    const thumb = document.createElement("div");
    thumb.className = "deck-thumb loading";

    const v = document.createElement("video");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.muted = true;
    v.preload = "none";
    thumb.appendChild(v);

    const info = document.createElement("div");
    info.className = "deck-info";
    info.innerHTML = `
      <div class="deck-name">${deck.name}</div>
      <div class="deck-meta">
        <span class="deck-meta-pill">${deck.slides} slide${deck.slides !== 1 ? "s" : ""}</span>
      </div>`;

    const hint = document.createElement("div");
    hint.className = "deck-open-hint";
    hint.textContent = "OPEN →";

    card.append(thumb, info, hint);
    grid.appendChild(card);
    observer.observe(card);
  });
}

function onCardVisible(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    const i = +card.dataset.i;
    const deck = manifests[i];
    if (!deck) return;

    const thumb = card.querySelector(".deck-thumb");
    const v = card.querySelector("video");
    if (!v || !thumb.classList.contains("loading")) return;

    const src = `public/slides/${deck.name}/forward/1.mp4`;
    v.src = src;
    v.load();
    v.addEventListener(
      "loadedmetadata",
      () => {
        const dur = v.duration;
        v.currentTime = dur && isFinite(dur) ? Math.max(0, dur - 0.05) : 0;
      },
      { once: true },
    );
    v.addEventListener(
      "seeked",
      () => {
        thumb.classList.remove("loading");
      },
      { once: true },
    );
  });
}
