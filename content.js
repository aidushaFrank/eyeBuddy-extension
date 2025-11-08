console.log("Content script active");

function applyNightMode(night) {
  if (night) {
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
  } else {
    document.documentElement.style.filter = "";
  }
}

chrome.storage.sync.get("night", ({ night }) => {
  applyNightMode(night);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.night) applyNightMode(changes.night.newValue);
});