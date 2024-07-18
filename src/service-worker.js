const GOOGLE_DOCS_ORIGIN = "https://docs.google.com/document";

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

const tabChangeCallback = async (tab) => {
  if (!tab.url) return;
  // Enables the side panel on google.com
  if (tab.url.startsWith(GOOGLE_DOCS_ORIGIN)) {
    await chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: "js/index.html",
      enabled: true,
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId: tab.id,
      enabled: false,
    });
  }
};

const tabUpdateCallback = async (_tabId, _info, tab) => tabChangeCallback(tab);
const tabActivateCallback = async () => {
  const tab = await chrome.tabs.query({ active: true }).then((tabs) => tabs[0]);
  tabChangeCallback(tab);
};

chrome.tabs.onActivated.addListener(tabActivateCallback);
chrome.tabs.onUpdated.addListener(tabUpdateCallback);
