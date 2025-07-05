"use strict";

const btnToggleAdminBar = document.getElementById("btnToggleAdminBar");

// Send requests to content.js and receive responses

const sendToContent = (request) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return console.warn("No active tab found.");
    chrome.tabs.sendMessage(tabs[0].id, request, manageResponse);
  });
};

const manageResponse = (response) => {
  if (!response || typeof response !== "object") {
    console.warn("No valid response received from content script.");
    return noBarFound();
  }
  const actions = {
    adminBarCheck: (value) => {
      if (value === undefined) return noBarFound();
      btnToggleAdminBar.disabled = !value;
      if (value) sendToContent({ request: "isAdminBarVisible" });
      else noBarFound();
    },
    adminBarVisible: (value) => {
      btnToggleAdminBar.checked = !value;
    },
    adminBarHidden: (value) => {
      console.log(value ? "Admin bar hidden" : "Admin bar shown");
    },
  };
  for (const [key, value] of Object.entries(response)) {
    if (actions[key]) actions[key](value);
  }
};

// Toggle Admin Bar display
const toggleAdminBar = () => {
  sendToContent({ request: "toggleAdminBar" });
};

const noBarFound = () => {
  document.getElementById("toggleBar")?.classList.add("disabled");
  const label = document.getElementById("toggleLabel");
  if (label) label.textContent = "No Admin Bar found";
};

// Initialize the popup
document.addEventListener("DOMContentLoaded", () => {
  sendToContent({ request: "checkAdminBar" });
  btnToggleAdminBar.addEventListener("click", toggleAdminBar);
});
