console.log("Content script active");


function applyNightMode(night) {
  if (night) {
    // Dark mode using invert (works on all websites)
    document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
  } else {
    document.documentElement.style.filter = "";
  }
}

// Load on page open
chrome.storage.sync.get("night", ({ night }) => {
  applyNightMode(night);
});

// Apply whenever it changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.night) {
    applyNightMode(changes.night.newValue);
  }
});