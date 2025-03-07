import React from "react";
import { createRoot } from "react-dom/client";
import "./pop.css";

function Popup() {
  return (
    <div className="popup-container">
      <h1 className="evil-title">😈 Evil Goofy 😈</h1>
      <button onClick={() => chrome.runtime.openOptionsPage()} className="settings-btn">
        Open Settings
      </button>
    </div>
  );
}

createRoot(document.getElementById("popup-root")).render(<Popup />);
