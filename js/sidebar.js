import { state } from "./state.js";
import { preloadCache } from "./cache.js";
import { fwdPath } from "./playback.js";
import { $ } from "./ui.js";
import { jumpTo } from "./navigation.js";

// ═══════════════════════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════════════════════
let thumbObserver = null;

export function buildSidebar() {
  const sb = $("sidebar");
  sb.innerHTML = "";

  if (thumbObserver) {
    thumbObserver.disconnect();
    thumbObserver = null;
  }

  thumbObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const item = entry.target;
        if (!item.classList.contains("unloaded")) return;

        const i = +item.dataset.i;
        const v = item.querySelector("video");
        if (!v) return;

        const cached = preloadCache.get(i);
        if (cached && cached.fwd.readyState >= 1) {
          v.src = cached.fwd.src;
          v.load();
          v.addEventListener(
            "loadedmetadata",
            () => {
              v.currentTime = Math.max(0, v.duration - 0.05);
            },
            { once: true },
          );
        } else {
          v.preload = "metadata";
          v.src = fwdPath(i);
          v.addEventListener(
            "loadedmetadata",
            () => {
              v.currentTime = Math.max(0, v.duration - 0.05);
            },
            { once: true },
          );
        }

        item.classList.remove("unloaded");
        thumbObserver.unobserve(item);
      });
    },
    { root: sb, rootMargin: "80px" },
  );

  for (let i = 0; i < state.TOTAL; i++) {
    const item = document.createElement("div");
    item.className = "thumb-item unloaded" + (i === 0 ? " active" : "");
    item.dataset.i = i;
    item.onclick = () => jumpTo(i);

    const v = document.createElement("video");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.muted = true;
    v.preload = "none";

    const lbl = document.createElement("div");
    lbl.className = "thumb-label";
    lbl.textContent = i + 1;

    item.append(v, lbl);
    sb.appendChild(item);
    thumbObserver.observe(item);
  }
}

export function syncSidebar() {
  $("sidebar")
    .querySelectorAll(".thumb-item")
    .forEach((el) => {
      el.classList.toggle("active", +el.dataset.i === state.idx);
    });
  const active = $("sidebar").querySelector(".thumb-item.active");
  if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
