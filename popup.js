document.getElementById("toggle-night").onclick = () => {
  chrome.storage.sync.get("night", ({ night }) => {
    chrome.storage.sync.set({ night: !night });
  });
};

document.getElementById("color-filter").onchange = (e) => {
  chrome.storage.sync.set({ filter: e.target.value });
};