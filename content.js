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
  switch(type) {
    case "protanopia":
      document.documentElement.style.filter = "url(#protanopia)";
      break;
    case "deuteranopia":
      document.documentElement.style.filter = "url(#deuteranopia)";
      break;
    case "tritanopia":
      document.documentElement.style.filter = "url(#tritanopia)";
      break;
    default:
      document.documentElement.style.filter = "";
  }
}

chrome.storage.sync.get("filter", ({ filter }) => applyColorBlindFilter(filter));

chrome.storage.onChanged.addListener((changes) => {
  if (changes.filter) applyColorBlindFilter(changes.filter.newValue);
});