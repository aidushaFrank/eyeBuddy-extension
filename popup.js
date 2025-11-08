document.getElementById("toggle-night").onclick = () => {
  chrome.storage.sync.get("night", ({ night }) => {
    chrome.storage.sync.set({ night: !night });
  });
};

document.getElementById("color-filter").onchange = (e) => {
  chrome.storage.sync.set({ filter: e.target.value });
};

document.getElementById("toggle-font").onclick = () => {
  chrome.storage.sync.get("fontMode", ({ fontMode }) => {
    const nextMode = ((fontMode || 0) + 1) % 4; // cycles 0 → 1 → 2 → 3 → back to 0
    chrome.storage.sync.set({ fontMode: nextMode });
  });
};