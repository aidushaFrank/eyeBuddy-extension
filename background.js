document.addEventListener("DOMContentLoaded", () => {
  console.log("popup.js loaded");
  const minutesInput = document.getElementById("time-limit");
  const startBtn = document.getElementById("start-timer");

  // restore last value
  chrome.storage.sync.get("timeLimitMin", ({ timeLimitMin = "" }) => {
    if (timeLimitMin) minutesInput.value = timeLimitMin;
  });

  startBtn.addEventListener("click", async () => {
    const minutes = Number(minutesInput.value);
    if (!minutes || minutes <= 0) return;

    await chrome.storage.sync.set({ timeLimitMin: minutes });
    await chrome.alarms.clear("screenTimeEnd");
    chrome.alarms.create("screenTimeEnd", { when: Date.now() + minutes * 60_000 });

    // quick confirmation
    chrome.runtime.sendMessage({ type: "TIMER_SET", minutes });
    console.log("Timer set for", minutes, "minute(s)");
  });
});
