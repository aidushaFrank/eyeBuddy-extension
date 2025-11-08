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

function injectColorBlindFilters() {
  const svg = document.createElement("div");
  svg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;">
      <filter id="protanopia">
        <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0"/>
      </filter>

      <filter id="deuteranopia">
        <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0"/>
      </filter>

      <filter id="tritanopia">
        <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0"/>
      </filter>
    </svg>
  `;
  document.body.appendChild(svg);
}

injectColorBlindFilters();

function applyColorBlindFilter(type) {
  // Always clear existing filter first
  document.documentElement.style.filter = "";

  if (type === "protanopia") {
    document.documentElement.style.filter = "url(#protanopia)";
  } else if (type === "deuteranopia") {
    document.documentElement.style.filter = "url(#deuteranopia)";
  } else if (type === "tritanopia") {
    document.documentElement.style.filter = "url(#tritanopia)";
  }
}

chrome.storage.sync.get("filter", ({ filter }) => applyColorBlindFilter(filter));

chrome.storage.onChanged.addListener((changes) => {
  if (changes.filter) applyColorBlindFilter(changes.filter.newValue);
});

function applyFontMode(fontMode) {
  // Remove any previous classes
  document.documentElement.classList.remove("font-atkinson", "font-opendys", "font-comic");

  if (fontMode === 1) {
    document.documentElement.classList.add("font-atkinson");
  } else if (fontMode === 2) {
    document.documentElement.classList.add("font-opendys");
  } else if (fontMode === 3) {
    document.documentElement.classList.add("font-comic");
  }
}

// Load on start
chrome.storage.sync.get("fontMode", ({ fontMode }) => applyFontMode(fontMode));

// Update when changed
chrome.storage.onChanged.addListener((changes) => {
  if (changes.fontMode) applyFontMode(changes.fontMode.newValue);
});