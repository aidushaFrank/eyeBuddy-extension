console.log("Content script active");


function applyNightMode(night) {
  if (night) {
    document.documentElement.classList.add("night-mode");
  } else {
    document.documentElement.classList.remove("night-mode");
  }
}

chrome.storage.sync.get("night", ({ night }) => {
  applyNightMode(night);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.night) applyNightMode(changes.night.newValue);
});