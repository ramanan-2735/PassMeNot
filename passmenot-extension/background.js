chrome.runtime.onInstalled.addListener(() => {
    console.log("PassMeNot Extension Installed");
  });
  
  // Listen for a secure PassMeNot link being opened
  chrome.webNavigation.onCompleted.addListener((details) => {
    const url = new URL(details.url);
    if (url.hostname === "passmenot.com" && url.pathname.startsWith("/access/")) {
      fetch(details.url) // Get encrypted credentials
        .then((response) => response.json())
        .then((data) => {
          chrome.storage.local.set({ credentials: data });
          chrome.tabs.create({ url: data.site }); // Open the login page
        });
    }
  });
  