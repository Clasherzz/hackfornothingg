chrome.webNavigation.onCompleted.addListener((details) => {
    chrome.storage.local.get(["blockedUrls"], (result) => {
      if (result.blockedUrls) {
        const blocked = result.blockedUrls.some((url) =>
          details.url.includes(url)
        );
        if (blocked) {
          chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ["content.js"],
          });
        }
      }
    });
  });
  