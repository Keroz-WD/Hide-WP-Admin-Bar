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
    adminBarCheck: (value) => {
      if (value) {
        btnToggleAdminBar.disabled = false;
        sendToContent({ request: "isAdminBarVisible" });
      } else {
        document.getElementById("toggleBar").classList.add("disabled");
        document.getElementById("toggleLabel").textContent =
          "No Admin Bar found";
      }
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
});
