import { $ } from "./ui.js";
import { navigate, startHold, clearHold } from "./navigation.js";
import { setMode } from "./mode.js";
import { state } from "./state.js";

const keyHeld = {};

document.addEventListener("keydown", (e) => {
  if ($("setup").style.display !== "none") return;
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
  if (keyHeld[e.key]) return;
  keyHeld[e.key] = true;
  switch (e.key) {
    case "ArrowRight":
    case ".":
    case ">":
      e.preventDefault();
      navigate(1);
      startHold(1);
      break;
    case "ArrowLeft":
    case ",":
    case "<":
      e.preventDefault();
      navigate(-1);
      startHold(-1);
      break;
    case "f":
    case "F":
      setMode(state.mode === "present" ? "preview" : "present");
      break;
    case "Escape":
      if (state.mode === "present") setMode("preview");
      break;
  }
});
document.addEventListener("keyup", (e) => {
  keyHeld[e.key] = false;
  if ([">", ".", "ArrowRight", "<", ",", "ArrowLeft"].includes(e.key))
    clearHold();
});
