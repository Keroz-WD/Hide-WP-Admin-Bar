"use strict";

const adminBar = document.getElementById("wpadminbar");

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.request) {
    case "checkAdminBar":
      sendResponse({ adminBarCheck: checkAdminBar() });
      break;
    case "isAdminBarVisible":
      sendResponse({ adminBarVisible: isAdminBarVisible() });
      break;
    case "toggleAdminBar":
      sendResponse({ adminBarHidden: toggleAdminBar() });
      break;
  }
});

// Check if page has an admin bar
const checkAdminBar = () => (adminBar ? true : false);

const toggleAdminBar = () => {
  if (isAdminBarVisible()) {
    adminBar.style.display = "none";
    document.documentElement.style.setProperty("margin-top", "0", "important");

    return true;
  } else {
    adminBar.style.display = "block";
    document.documentElement.style.marginTop = "32px";
    return false;
  }
};

const isAdminBarVisible = () => {
  return adminBar.style.display != "none";
};
