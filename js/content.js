"use strict";

const adminBar = document.getElementById("wpadminbar");

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const actions = {
    checkAdminBar: () => ({ adminBarCheck: !!adminBar }),
    isAdminBarVisible: () => ({ adminBarVisible: isAdminBarVisible() }),
    toggleAdminBar: () => ({ adminBarHidden: toggleAdminBar() }),
  };
  if (actions[message.request]) {
    sendResponse(actions[message.request]());
  }
});

function isAdminBarVisible() {
  return adminBar && adminBar.style.display !== "none";
}

function toggleAdminBar() {
  if (!adminBar) return false;
  const html = document.documentElement;
  if (isAdminBarVisible()) {
    adminBar.style.display = "none";
    html.style.setProperty("margin-top", "0", "important");
    return true;
  } else {
    adminBar.style.display = "block";
    html.style.marginTop = "32px";
    return false;
  }
}
