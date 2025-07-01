"use strict";

const btnToggleAdminBar = document.getElementById("btnToggleAdminBar");

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
    adminBarCheck: () => {
      btnToggleAdminBar.disabled = false;
    },
    adminBarHidden: () => {
      console.log("Admin bar hidden");
    },
    adminBarShown: () => {
      console.log("Admin bar shown");
    },
  };

  Object.keys(response).forEach((key) => {
    if (actions[key]) actions[key]();
  });
};

// const sendToContent = (request) => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     if (tabs.length > 0) {
//       chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
//         if (chrome.runtime.lastError) {
//           console.error(
//             "Error sending message to content script:",
//             chrome.runtime.lastError.message
//           );
//         } else if (response) {
//           manageResponse(response);
//         } else {
//           console.warn("No response received from content");
//         }
//       });
//     } else {
//       console.warn("No active tab found.");
//     }
//   });
// };

// Toggle Admin Bar display
const toggleAdminBar = () => {
  sendToContent({ request: "toggleAdminBar" });
};

// Initialize the popup
document.addEventListener("DOMContentLoaded", () => {
  sendToContent({ request: "checkAdminBar" });

  btnToggleAdminBar.addEventListener("click", toggleAdminBar);
  console.log("Popup initialized");
});
