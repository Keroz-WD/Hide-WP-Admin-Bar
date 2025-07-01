"use strict";

const adminBar = document.getElementById("wpadminbar");

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("request");
  switch (message.request) {
    case "checkAdminBar":
      sendResponse({ adminBarCheck: checkAdminBar() });
      break;
    case "toggleAdminBar":
      sendResponse({ adminBarHidden: toggleAdminBar() });
      break;
  }
});

// Check if page has an admin bar
const checkAdminBar = () => {
  return adminBar ? true : false;
};

const toggleAdminBar = () => {
  const html = document.documentElement;
  const computedDisplay = window.getComputedStyle(adminBar).display;
  if (computedDisplay === "block") {
    // when the bar is displayed
    adminBar.style.display = "none";
    html.style.setProperty("margin-top", "0", "important");
    return true;
  } else {
    adminBar.style.display = "block";
    html.style.marginTop = "32px";
    return false;
  }
};

const getAdminElements = () => {};
