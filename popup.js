document.getElementById("toggle-night").onclick = () => {
  chrome.storage.sync.get("night", ({ night }) => {
    chrome.storage.sync.set({ night: !night });
  });
};