function notifyBasic(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/128.png",
    title,
    message,
    priority: 1
  });
}

// --- helper: open a popup window with a random eye exercise image ---
function showExerciseWindow(imageUrl) {
  chrome.windows.create({
    url: imageUrl,       // this points to your local image file
    type: "popup",
    width: 600,          // size of popup window
    height: 600,
    focused: true
  });
}

// --- when popup starts timer ---
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "TIMER_START") {
    // instant "started" notification
    notifyBasic("Timer started", `Ends in ${msg.minutes} minute(s).`);

    // clear any old alarm, then set new one
    chrome.alarms.clear("screenTimeEnd", () => {
      chrome.alarms.create("screenTimeEnd", { when: msg.endTime });
    });
  }
});

// --- when alarm goes off ---
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "screenTimeEnd") return;

  // pick random image from your /icons folder
  const exercises = [
    "icons/IMG_0730.jpg",
    "icons/IMG_0731.jpg",
    "icons/IMG_0732.jpg",
    "icons/IMG_0733.jpg",
    "icons/IMG_0734.jpg"
  ];
  const choice = exercises[Math.floor(Math.random() * exercises.length)];

  // open big popup window with the image
  showExerciseWindow(choice);

  // also send a small notification
  notifyBasic("Eye break 👀", "Look away and relax your eyes!");
  
  // clear timer so popup countdown resets
  chrome.storage.sync.remove("endTime");
});