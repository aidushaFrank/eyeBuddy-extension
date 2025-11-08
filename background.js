// background.js

function notify(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/128.png",
    title,
    message,
    priority: 1
  });
}

// when alarm goes off
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "screenTimeEnd") {
    notify("Time’s up! ⏱️", "You’ve reached your screen time limit.");
    chrome.storage.sync.remove("endTime"); // stop countdown
  }
});

// when popup starts timer
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "TIMER_START") {
    notify("Timer started", `Ends in ${msg.minutes} minute(s).`);
    chrome.alarms.clear("screenTimeEnd", () => {
      chrome.alarms.create("screenTimeEnd", { when: msg.endTime });
    });
  }
});
