// state.js
export const state = {
  DECK: "",
  TOTAL: 0,
  idx: 0,
  mode: "preview",
  phase: "idle",
  presentIntro: false,
  holdTimer: null,
  holdInterval: null,
  pvFront: 0,
  svFront: 0,
  pvEls: [],
  svEls: [],
};

export function initState() {
  state.pvEls = [
    document.getElementById("pv0"),
    document.getElementById("pv1"),
  ];
  state.svEls = [
    document.getElementById("sv0"),
    document.getElementById("sv1"),
  ];
}

export function pvF() {
  return state.pvEls[state.pvFront];
}
export function pvB() {
  return state.pvEls[1 - state.pvFront];
}
export function svF() {
  return state.svEls[state.svFront];
}
export function svB() {
  return state.svEls[1 - state.svFront];
}
