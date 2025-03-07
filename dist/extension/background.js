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

//last working here

// Function to update redirect rules dynamically
// function updateRedirectRules(blockedUrls) {
//     function updateRedirectRules(blockedUrls) {
//         let rules = blockedUrls.map((url, index) => {
//             const ruleId = index + 1; // Unique ID for each rule
//             const redirectUrl = chrome.runtime.getURL(`camera.html?ruleId=${ruleId}`); // Redirect to extension page with ruleId

//             // Store the original blocked URL in chrome.storage.local
//             chrome.storage.local.set({ [`rule_${ruleId}`]: url });

//             return {
//                 id: ruleId,
//                 priority: 1,
//                 action: {
//                     type: "redirect",
//                     redirect: { url: redirectUrl } // Redirects to camera.html with ruleId
//                 },
//                 condition: {
//                     urlFilter: `${url}*`,  // Dynamically blocks stored URLs
//                     resourceTypes: ["main_frame"]
//                 }
//             };
//         });

//         // Apply the new rules
//         chrome.declarativeNetRequest.updateDynamicRules({
//             removeRuleIds: rules.map(rule => rule.id), // Remove old rules before adding new ones
//             addRules: rules
//         }, () => {
//             console.log("Updated redirect rules:", rules);
//         });
//     }

//     // Update declarativeNetRequest rules
//     chrome.declarativeNetRequest.updateDynamicRules({
//       removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1), // Clears old rules
//       addRules: rules
//     });
//   }

//   // Fetch stored URLs when the extension is installed or updated
//   chrome.runtime.onInstalled.addListener(() => {
//     chrome.storage.sync.get(["blockedUrls"], (data) => {
//       let blockedUrls = data.blockedUrls || [];
//       updateRedirectRules(blockedUrls);
//     });
//   });

//   // Listen for storage changes and update rules
//   chrome.storage.onChanged.addListener((changes) => {
//     if (changes.blockedUrls) {
//       console.log("Blocked URLs updated:", changes.blockedUrls.newValue);
//       updateRedirectRules(changes.blockedUrls.newValue || []);
//     }
//   });

//------------------below works trying to listener though

function updateRedirectRules(blockedUrls) {
  if (!Array.isArray(blockedUrls) || blockedUrls.length === 0) {
    //  console.error("Error: blockedUrls is empty or not an array.");
    return;
  }

  let rules = blockedUrls.map((url, index) => {
    const ruleId = index + 1; // Unique ID for each rule
    const redirectUrl = chrome.runtime.getURL(`camera.html?ruleId=${ruleId}`);

    // Store the original blocked URL in chrome.storage.local
    chrome.storage.local.set({ [`rule_${ruleId}`]: url }, () => {
      if (chrome.runtime.lastError) {
        // console.error("Error storing rule in chrome.storage.local:", chrome.runtime.lastError);
      }
    });

    return {
      id: ruleId,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { url: redirectUrl },
      },
      condition: {
        urlFilter: `${url}*`,
        resourceTypes: ["main_frame"],
      },
    };
  });

  if (rules.length === 0) {
    // console.error("Error: No rules generated.");
    return;
  }

  // Update rules dynamically
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: rules.map((rule) => rule.id),
      addRules: rules,
    },
    () => {
      if (chrome.runtime.lastError) {
        //  console.error("Error updating dynamic rules:", chrome.runtime.lastError);
      } else {
        //  console.log("Updated redirect rules:", rules);
      }
    }
  );
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["blockedUrls"], (data) => {
    let blockedUrls = data.blockedUrls || [];
    updateRedirectRules(blockedUrls);
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(["blockedUrls"], (data) => {
    let blockedUrls = data.blockedUrls || [];
    updateRedirectRules(blockedUrls);
  });
});

// Run when a new tab is opened
chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.sync.get(["blockedUrls"], (data) => {
    let blockedUrls = data.blockedUrls || [];
    updateRedirectRules(blockedUrls);
  });
});

// Listen for storage changes and update rules
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedUrls) {
    // console.log("Blocked URLs updated:", changes.blockedUrls.newValue);
    updateRedirectRules(changes.blockedUrls.newValue || []);
  }
});

// let blockedUrls = [];

// chrome.storage.sync.get(["blockedUrls"], (data) => {
//     blockedUrls = data.blockedUrls || [];
// });

// // Update blocked URLs when storage changes
// chrome.storage.onChanged.addListener((changes) => {
//     if (changes.blockedUrls) {
//         blockedUrls = changes.blockedUrls.newValue || [];
//     }
// });

// Listen for requests and block/redirect them but its working only for version 2 or lower
// chrome.webRequest.onBeforeRequest.addListener(
//     (details) => {
//         const url = details.url;

//         // Check if the URL matches any blocked URL
//         if (blockedUrls.some(blocked => url.includes(blocked))) {
//             //console.log(`Blocking: ${url}`);
//             return { redirectUrl: chrome.runtime.getURL(`camera.html?redirectUrl=${url}`) };  // Redirect to extension page
//         }
//     },
//     { urls: ["<all_urls>"] },  // Listen for all URLs
//     ["blocking"]
// );
