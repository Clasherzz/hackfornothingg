import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./settings.css";

function Options() {
  const [urls, setUrls] = useState([]);

  // Load blocked URLs from local storage
  useEffect(() => {
    chrome.storage.local.get(["blockedUrls"], (result) => {
      setUrls(result.blockedUrls || []);
    });
  }, []);

  // Function to add a new URL
  const addUrl = () => {
    const url = prompt("Enter a URL to block:");
    if (url) {
      const updatedUrls = [...urls, url];
      setUrls(updatedUrls);
      chrome.storage.local.set({ blockedUrls: updatedUrls });
    }
  };

  // Function to remove a URL
  const removeUrl = (index) => {
    const updatedUrls = urls.filter((_, i) => i !== index);
    setUrls(updatedUrls);
    chrome.storage.local.set({ blockedUrls: updatedUrls });
    chrome.storage.local.remove([`rule_${index + 1}`]); // Remove the rule from storage
  };

  return (
    <div className="options-container">
      <h1 className="evil-title">😈 Blocked Websites 😈</h1>
      <button onClick={addUrl} className="add-url-btn">+ Add URL</button>

      {urls.length > 0 ? (
        <ul className="url-list">
          {urls.map((url, index) => (
            <li key={index} className="url-item">
              <span>{url}</span>
              <button onClick={() => removeUrl(index)} className="remove-btn">
                ❌
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-blocked-msg">No blocked websites yet.</p>
      )}
    </div>
  );
}

// Render React inside the options page
const container = document.getElementById("options-root");
const root = createRoot(container);
root.render(<Options />);
