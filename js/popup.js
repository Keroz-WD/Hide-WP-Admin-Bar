"use strict";

const btnToggleAdminBar = document.getElementById("btnToggleAdminBar");
let userName = "";

// Send requests to content.js and receive responses
const sendToContent = (request) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
        manageResponse(response);
      });
    } else {
      console.warn("No active tab found.");
    }
  });
};

const manageResponse = (response) => {
  console.log("Response : ", response);

  const actions = {
    adminBarCheck: (value) => {
      if (value) {
        btnToggleAdminBar.disabled = false;
        sendToContent({ request: "isAdminBarVisible" });
        sendToContent({ request: "getUser" });
      } else {
        document.getElementById("toggleBar").classList.add("disabled");
        document.getElementById("toggleLabel").textContent =
          "No Admin Bar found";
      }
    },
    adminBarUser: (value) => {
      userName = value;
      document.getElementById("user").textContent = "Logged as " + value;
    },
    adminBarVisible: (value) => {
      btnToggleAdminBar.checked = !value;
    },
    adminBarHidden: (value) => {
      if (value) {
        console.log("Admin bar hidden");
      } else {
        console.log("Admin bar shown");
      }
    },
  };

  Object.entries(response).forEach(([key, value]) => {
    if (actions[key]) actions[key](value);
  });
};

// Toggle Admin Bar display
const toggleAdminBar = () => {
  sendToContent({ request: "toggleAdminBar" });
};

// Initialize the popup
document.addEventListener("DOMContentLoaded", () => {
  sendToContent({ request: "checkAdminBar" });
  getDomain((domain) => {
    console.log("Domain: ", domain);
  });
  btnToggleAdminBar.addEventListener("click", toggleAdminBar);
});

// Returns the full home URL (protocol + host + first path segment, with trailing slash) of the active tab
const getDomain = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      try {
        const url = new URL(tabs[0].url);
        // Get protocol + host + first path segment (if any)
        let homeUrl = url.origin;
        const pathMatch = url.pathname.match(/^\/(.+?\/)/);
        if (pathMatch) {
          homeUrl += "/" + pathMatch[1];
        } else {
          homeUrl += "/";
        }
        // Remove double slashes if any
        homeUrl = homeUrl.replace(/([^:]\/)\/+/, "$1");
        callback(homeUrl);
      } catch (e) {
        console.warn("Invalid URL");
        callback("");
      }
    } else {
      callback("");
    }
  });
};
