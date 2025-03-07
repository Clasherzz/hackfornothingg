// chrome.runtime.onInstalled.addListener(() => {
//     chrome.storage.sync.get(["blockedUrls"], (data) => {
//       let blockedUrls = data.blockedUrls || [];
//       updateRedirectRules(blockedUrls);
//     });
//   });

//   // Listen for changes in storage and update rules
//   chrome.storage.onChanged.addListener((changes) => {
//     if (changes.blockedUrls) {
//      console.log(changes.blockedUrls.newValue);
//       updateRedirectRules(changes.blockedUrls.newValue || []);
//     }
//   });

// //   function updateRedirectRules(blockedUrls) {
// //     let rules = blockedUrls.map((url, index) => ({
// //       id: index + 1,
// //       priority: 1,
// //       action: {
// //         type: "redirect",
// //         redirect: { url: "https://www.google.com" } // Change to desired redirect
// //       },
// //       condition: {
// //         urlFilter: "https://www.youtube.com/",
// //         resourceTypes: ["main_frame"]
// //       }
// //     }));

// //     chrome.declarativeNetRequest.updateDynamicRules({
// //       removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1), // Remove old rules
// //       addRules: rules
// //     });
// //   }

// // chrome.runtime.onInstalled.addListener(() => {
// //     console.log("Extension installed");

// //     chrome.declarativeNetRequest.updateDynamicRules({
// //       addRules: [
// //         {
// //           id: 1,  // Unique rule ID
// //           priority: 1,
// //           action: { type: "redirect" },
// //           condition: {
// //             urlFilter: "https://www.youtube.com/", // Block all pages from example.com
// //             resourceTypes: ["main_frame"]  // Only block page loads
// //           }
// //         }
// //       ],
// //       removeRuleIds: [1]  // Ensure old rule is removed if already present
// //     });
// //   });

// chrome.runtime.onInstalled.addListener(() => {
//     console.log("Extension installed");

//     chrome.declarativeNetRequest.updateDynamicRules({
//       removeRuleIds: [1], // Remove old rule if it exists
//       addRules: [
//         {
//           id: 1,  // Unique rule ID
//           priority: 1,
//           action: {
//             type: "redirect",
//             // Redirect to Google
//         },
//                             condition: {
//                                 urlFilter: blockedUrls.join('|'), // Matches all blocked URLs
//             resourceTypes: ["main_frame"]  // Only block full page loads
//           }
//         }
//       ]
//     });
//   });

//   chrome.storage.onChanged.addListener((changes) => {
//     if (changes.blockedUrls) {
//       console.log("Updated blocked URLs:", changes.blockedUrls.newValue);
//       updateRedirectRules(changes.blockedUrls.newValue || []);
//     }
//   });

//   function updateRedirectRules(blockedUrls) {
//     let rules = blockedUrls.map((url, index) => ({
//       id: index + 2,  // Unique ID (start from 2 to avoid conflicts)
//       priority: 1,
//       action: {
//         type: "redirect",
//         redirect: { url: chrome.runtime.getURL("index.html") }  // Redirect target
//       },
//       condition: {
//         urlFilter: `*://${url}/*`,  // Match domain dynamically
//         resourceTypes: ["main_frame"]
//       }
//     }));

//     chrome.declarativeNetRequest.updateDynamicRules({
//       removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 2), // Remove old rules
//       addRules: rules
//     });
//   }

// Function to update redirect rules dynamically
function updateRedirectRules(blockedUrls) {
  let rules = blockedUrls.map((url, index) => ({
    id: index + 1, // Unique ID for each rule
    priority: 1,
    action: {
      type: "redirect",
      redirect: { url: chrome.runtime.getURL("camera.html") }, // Redirects to local extension page
    },
    condition: {
      urlFilter: `${url}*`, // Dynamically blocks stored URLs
      resourceTypes: ["main_frame"],
    },
  }));

  // Update declarativeNetRequest rules
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1), // Clears old rules
    addRules: rules,
  });
}

// Fetch stored URLs when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["blockedUrls"], (data) => {
    let blockedUrls = data.blockedUrls || [];
    updateRedirectRules(blockedUrls);
  });
});

// Listen for storage changes and update rules
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedUrls) {
    console.log("Blocked URLs updated:", changes.blockedUrls.newValue);
    updateRedirectRules(changes.blockedUrls.newValue || []);
  }
});
