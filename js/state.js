let DECK = "",
  TOTAL = 0;
let idx = 0;
let mode = "preview";
let phase = "idle"; // 'idle' | 'forward' | 'backward'

// presentIntro = true means: present stage is showing slide idx at frame 0,
// waiting for user to press Next to play that slide's animation in-place.
// This is only ever set when first entering present mode.

let presentIntro = false;

let holdTimer = null,
  holdInterval = null;

// ═══════════════════════════════════════════════════════
//  DOUBLE BUFFER
// ═══════════════════════════════════════════════════════
// const pvEls = [document.getElementById("pv0"), document.getElementById("pv1")];
// const svEls = [document.getElementById("sv0"), document.getElementById("sv1")];

let pvEls = [];
let svEls = [];

function initState() {
  pvEls = [document.getElementById("pv0"), document.getElementById("pv1")];
  svEls = [document.getElementById("sv0"), document.getElementById("sv1")];
}

let pvFront = 0;
let svFront = 0;

function pvF() {
  return pvEls[pvFront];
}
function pvB() {
  return pvEls[1 - pvFront];
}
function svF() {
  return svEls[svFront];
}
function svB() {
  return svEls[1 - svFront];
}
