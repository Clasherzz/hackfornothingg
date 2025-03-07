const urlParams = new URLSearchParams(window.location.search);
const ruleId = urlParams.get("ruleId");

// Pass ruleId to camera.js
window.ruleId = ruleId;
