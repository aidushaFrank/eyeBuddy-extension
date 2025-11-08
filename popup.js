document.getElementById("toggle-night").onclick = () => {
  chrome.storage.sync.get("night", ({ night }) => {
    chrome.storage.sync.set({ night: !night });
  });
};

document.getElementById("color-filter").onchange = (e) => {
  chrome.storage.sync.set({ filter: e.target.value });
};

document.getElementById("toggle-font").onclick = () => {
  chrome.storage.sync.get("font", ({ font }) => {
    chrome.storage.sync.set({ font: !font });
  });
};

// === TIMER ===
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("time-limit");
  const startBtn = document.getElementById("start-timer");

  // if popup doesn't have the timer fields, stop here
  if (!input || !startBtn) return;

  // small countdown label under the button
  let countdown = document.getElementById("countdown");
  if (!countdown) {
    countdown = document.createElement("div");
    countdown.id = "countdown";
    countdown.style.marginTop = "6px";
    countdown.style.fontWeight = "600";
    countdown.textContent = "⏳ Not running";
    startBtn.insertAdjacentElement("afterend", countdown);
  }

  let tickHandle = null;

  function formatLeft(ms) {
    if (ms <= 0) return "00:00";
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  async function updateCountdown() {
    const { endTime } = await chrome.storage.sync.get("endTime");
    if (!endTime) {
      countdown.textContent = "⏳ Not running";
      clearInterval(tickHandle);
      tickHandle = null;
      return;
    }
    const left = endTime - Date.now();
    countdown.textContent =
      left > 0 ? `⏳ ${formatLeft(left)} left` : "⏳ Not running";
    if (left <= 0) {
      clearInterval(tickHandle);
      tickHandle = null;
    }
  }

  async function startTicking() {
    clearInterval(tickHandle);
    await updateCountdown();
    tickHandle = setInterval(updateCountdown, 1000);
  }

  // restore previous values
  chrome.storage.sync.get(["timeLimitMin", "endTime"], ({ timeLimitMin = "", endTime }) => {
    if (timeLimitMin) input.value = timeLimitMin;
    if (endTime) startTicking();
  });

  // start timer
  startBtn.addEventListener("click", async () => {
    const minutes = Number(input.value);
    if (!minutes || minutes <= 0) return;

    const endTime = Date.now() + minutes * 60_000;
    await chrome.storage.sync.set({ timeLimitMin: minutes, endTime });
    chrome.runtime.sendMessage({ type: "TIMER_START", minutes, endTime });
    startTicking();
  });

  // update live if background clears endTime
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && "endTime" in changes) {
      const newValue = changes.endTime.newValue;
      if (!newValue) {
        countdown.textContent = "⏳ Not running";
        clearInterval(tickHandle);
        tickHandle = null;
      } else {
        startTicking();
      }
    }
  });
});
