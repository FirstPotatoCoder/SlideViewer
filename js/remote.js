// ── Slide Remote (WebSocket bridge) ──────────────────
(function () {
  let ws, retry;
  function connect() {
    ws = new WebSocket(`ws://${location.host}/player`);
    ws.onclose = () => {
      retry = setTimeout(connect, 2000);
    };
    ws.onmessage = ({ data }) => {
      try {
        const { cmd } = JSON.parse(data);
        if (cmd === "next") navigate(1);
        if (cmd === "prev") navigate(-1);
      } catch {}
    };
  }
  connect();
})();
