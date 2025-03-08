// // import React, { useState, useEffect } from "react";
// // import { createRoot } from "react-dom/client";
// // import "./settings.css";

// // function Options() {
// //   const [urls, setUrls] = useState([]);

// //   // Load blocked URLs from local storage
// //   useEffect(() => {
// //     chrome.storage.local.get(["blockedUrls"], (result) => {
// //       setUrls(result.blockedUrls || []);
// //     });
// //   }, []);

// //   // Function to add a new URL
// //   const addUrl = () => {
// //     const url = prompt("Enter a URL to block:");
// //     if (url) {
// //       const updatedUrls = [...urls, url];
// //       setUrls(updatedUrls);
// //       chrome.storage.local.set({ blockedUrls: updatedUrls });
// //     }
// //   };

// //   // Function to remove a URL
// //   const removeUrl = (index) => {
// //     const updatedUrls = urls.filter((_, i) => i !== index);
// //     setUrls(updatedUrls);
// //     chrome.storage.local.set({ blockedUrls: updatedUrls });
// //     chrome.storage.local.remove([`rule_${index + 1}`]); // Remove the rule from storage
// //   };

// //   return (
// //     <div className="options-container">
// //       <h1 className="evil-title">😈 Blocked Websites 😈</h1>
// //       <button onClick={addUrl} className="add-url-btn">+ Add URL</button>

// //       {urls.length > 0 ? (
// //         <ul className="url-list">
// //           {urls.map((url, index) => (
// //             <li key={index} className="url-item">
// //               <span>{url}</span>
// //               <button onClick={() => removeUrl(index)} className="remove-btn">
// //                 ❌
// //               </button>
// //             </li>
// //           ))}
// //         </ul>
// //       ) : (
// //         <p className="no-blocked-msg">No blocked websites yet.</p>
// //       )}
// //     </div>
// //   );
// // }

// // // Render React inside the options page
// // const container = document.getElementById("options-root");
// // const root = createRoot(container);
// // root.render(<Options />);

// import React, { useState, useEffect } from "react";
// import { createRoot } from "react-dom/client";
// import "./settings.css";

// function Options() {
//   const [currentTab, setCurrentTab] = useState("blocked"); // "blocked" or "alert"
//   const [blockedUrls, setBlockedUrls] = useState([]);
//   const [alertUrls, setAlertUrls] = useState([]);

//   // Load stored data
//   useEffect(() => {
//     chrome.storage.local.get(["blockedUrls", "alertUrls"], (result) => {
//       setBlockedUrls(result.blockedUrls || []);
//       setAlertUrls(result.alertUrls || []);
//     });

//     // Keyboard Navigation
//     const handleKeyDown = (event) => {
//       if (event.key === "ArrowLeft") setCurrentTab("blocked");
//       if (event.key === "ArrowRight") setCurrentTab("alert");
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   // Add URL function
//   const addUrl = (type) => {
//     const url = prompt(`Enter a URL to ${type === "blocked" ? "block" : "alert"}:`);
//     if (url) {
//       if (type === "blocked") {
//         const updated = [...blockedUrls, url];
//         setBlockedUrls(updated);
//         chrome.storage.local.set({ blockedUrls: updated });
//       } else {
//         const updated = [...alertUrls, url];
//         setAlertUrls(updated);
//         chrome.storage.local.set({ alertUrls: updated });
//       }
//     }
//   };

//   // Remove URL function
//   const removeUrl = (index, type) => {
//     if (type === "blocked") {
//       const updated = blockedUrls.filter((_, i) => i !== index);
//       setBlockedUrls(updated);
//       chrome.storage.local.set({ blockedUrls: updated });
//     } else {
//       const updated = alertUrls.filter((_, i) => i !== index);
//       setAlertUrls(updated);
//       chrome.storage.local.set({ alertUrls: updated });
//     }
//   };

//   return (
//     <div className="options-container full-screen">
//       <h1 className="title">
//         {currentTab === "blocked" ? "😈 Blocked Websites 😈" : "⚠️ Alert Websites ⚠️"}
//       </h1>

//       <div className="navigation">
//         <button onClick={() => setCurrentTab("blocked")} disabled={currentTab === "blocked"}>⬅️ Back</button>
//         <button onClick={() => setCurrentTab("alert")} disabled={currentTab === "alert"}>Next ➡️</button>
//       </div>

//       <button onClick={() => addUrl(currentTab)} className="add-url-btn">
//         + Add URL
//       </button>

//       <div className="url-list-container">
//         {currentTab === "blocked" ? (
//           blockedUrls.length > 0 ? (
//             <ul className="url-list">
//               {blockedUrls.map((url, index) => (
//                 <li key={index} className="url-item">
//                   <span>{url}</span>
//                   <button onClick={() => removeUrl(index, "blocked")} className="remove-btn">
//                     ❌
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="no-blocked-msg">No blocked websites yet.</p>
//           )
//         ) : (
//           alertUrls.length > 0 ? (
//             <ul className="url-list">
//               {alertUrls.map((url, index) => (
//                 <li key={index} className="url-item">
//                   <span>{url}</span>
//                   <button onClick={() => removeUrl(index, "alert")} className="remove-btn">
//                     ❌
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="no-blocked-msg">No alert websites yet.</p>
//           )
//         )}
//       </div>
//     </div>
//   );
// }

// // Render React inside the options page
// const container = document.getElementById("options-root");
// const root = createRoot(container);
// root.render(<Options />);
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./settings.css";

function Options() {
  const [currentTab, setCurrentTab] = useState("blocked"); // "blocked" or "alert"
  const [blockedUrls, setBlockedUrls] = useState([]);
  const [alertUrls, setAlertUrls] = useState([]);

  // Load stored data
  useEffect(() => {
    chrome.storage.local.get(["blockedUrls", "alertUrls"], (result) => {
      setBlockedUrls(result.blockedUrls || []);
      setAlertUrls(result.alertUrls || []);
    });

    // Keyboard Navigation
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") setCurrentTab("blocked");
      if (event.key === "ArrowRight") setCurrentTab("alert");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Add URL function
  const addUrl = (type) => {
    const url = prompt(`Enter a URL to ${type === "blocked" ? "block" : "alert"}:`);
    if (url) {
      if (type === "blocked") {
        const updated = [...blockedUrls, url];
        setBlockedUrls(updated);
        chrome.storage.local.set({ blockedUrls: updated });
      } else {
        const updated = [...alertUrls, url];
        setAlertUrls(updated);
        chrome.storage.local.set({ alertUrls: updated });
      }
    }
  };

  // Remove URL function
  const removeUrl = (index, type) => {
    if (type === "blocked") {
      const updated = blockedUrls.filter((_, i) => i !== index);
      setBlockedUrls(updated);
      chrome.storage.local.set({ blockedUrls: updated });
    } else {
      const updated = alertUrls.filter((_, i) => i !== index);
      setAlertUrls(updated);
      chrome.storage.local.set({ alertUrls: updated });
    }
  };

  return (
    <div className="options-container full-screen">
      <h1 className="title">
        {currentTab === "blocked" ? "😈 Blocked Websites 😈" : "⚠️ Alert Websites ⚠️"}
      </h1>

      <div className="navigation">
        <button
          onClick={() => setCurrentTab("blocked")}
          disabled={currentTab === "blocked"}
          className={`tab-btn ${currentTab === "blocked" ? "active" : ""}`}
        >
          ⬅️ Back
        </button>
        <button
          onClick={() => setCurrentTab("alert")}
          disabled={currentTab === "alert"}
          className={`tab-btn ${currentTab === "alert" ? "active" : ""}`}
        >
          Next ➡️
        </button>
      </div>

      <button onClick={() => addUrl(currentTab)} className="add-url-btn">
        + Add URL
      </button>

      <div className="url-list-container">
        {currentTab === "blocked" ? (
          blockedUrls.length > 0 ? (
            <ul className="url-list">
              {blockedUrls.map((url, index) => (
                <li key={index} className="url-item">
                  <span className="url-text">{url}</span>
                  <button
                    onClick={() => removeUrl(index, "blocked")}
                    className="remove-btn"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-blocked-msg">No blocked websites yet.</p>
          )
        ) : (
          alertUrls.length > 0 ? (
            <ul className="url-list">
              {alertUrls.map((url, index) => (
                <li key={index} className="url-item">
                  <span className="url-text">{url}</span>
                  <button
                    onClick={() => removeUrl(index, "alert")}
                    className="remove-btn"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-blocked-msg">No alert websites yet.</p>
          )
        )}
      </div>
    </div>
  );
}

// Render React inside the options page
const container = document.getElementById("options-root");
const root = createRoot(container);
root.render(<Options />);
