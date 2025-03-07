(async () => {
    try {
      const video = document.createElement("video");
      video.style.position = "absolute";
      video.style.width = "300px";
      video.style.height = "300px";
      video.style.top = "10px";
      document.body.appendChild(video);
  
      const progressBar = document.querySelector(".progress");
      let progress = 0;
      let isLooking = false;
      let lastLookingTime = Date.now();
  
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();
  
      const modelURL =
        "https://storage.googleapis.com/tm-model/e92om_aVr/model.json";
      const metadataURL =
        "https://storage.googleapis.com/tm-model/e92om_aVr/metadata.json";
      const model = await tmImage.load(modelURL, metadataURL);
  
      async function predict() {
        const prediction = await model.predict(video);
        isLooking = prediction[0].probability > 0.8;
        console.log(
          prediction[0].probability,
          prediction[1].probability,
          prediction[2].probability,
          isLooking
        );
  
        return isLooking;
      }
  
      function updateProgressBar() {
        if (isLooking) {
          if (progress >= 100) {
            progress = 100;
            return;
          }
          const elapsedTime = Date.now() - lastLookingTime;
          if (elapsedTime > 2000) {
            progress -= 1; // Slowly reverse if continuously looking
          } else {
            progress += 0.5; // Slow increase
          }
        } else {
          progress += 2; // Fast increase
        }
        progress = Math.min(Math.max(progress, 0), 100);
        progressBar.style.width = `${progress}%`;
      }
  
      let counter = 0;
      const interval = setInterval(async () => {
        await predict();
        updateProgressBar();
        if (progress >= 100) {
          clearInterval(interval);
          stream.getTracks().forEach((track) => track.stop());
          video.remove();
          console.log("Window closed");
          //window.location.replace("https://www.youtube.com");
          
        //   chrome.tabs.update({ url: "https://www.youtube.com" });

        //   console.log("Redirected to YouTube");
        // chrome.declarativeNetRequest.updateDynamicRules({
        //     removeRuleIds: [1] // Assuming YouTube block is rule ID 1
        // }, () => {
        //     // Redirect after rule removal
        //     chrome.tabs.update({ url:  });
        //     console.log("Redirected to YouTube after 10 seconds");
        // });
        var ruleId = 0;
        document.addEventListener("DOMContentLoaded", () => {
            const urlParams = new URLSearchParams(window.location.search);
            console.log("URL Params:", urlParams);
            ruleId = urlParams.get("ruleId");
            console.log("Rule ID inside domlistener:", ruleId);


        
            if (!ruleId) {
                console.error("ruleId is missing or invalid");
            } else {
                console.log("Camera.js Loaded - Rule ID:", ruleId);
            }
        
            // Now you can use ruleId in your logic
        }); 
        const urlParams = new URLSearchParams(window.location.search);
        console.log("URL Params:", urlParams);
        ruleId = urlParams.get("ruleId");
        console.log("Rule ID inside domlistener:", ruleId);

        console.log("Rule ID:", ruleId);
        var redirectUrl = "";
        var lastPart = "";

        chrome.storage.local.get(`rule_${ruleId}`, (result) => {
            if (chrome.runtime.lastError) {
                console.error("Error retrieving URL:", chrome.runtime.lastError);
            } else {
                redirectUrl = result[`rule_${ruleId}`]; 
                if (redirectUrl) {
                    lastPart = redirectUrl.substring(redirectUrl.lastIndexOf('/') + 1);
                    console.log("Retrieved URL:", lastPart);
                } else {
                    console.log("No URL found for ruleId:", ruleId);
                }
            }
        });
        

        ruleId = parseInt(ruleId, 10);
        console.log("Redirect url:", redirectUrl);
        setTimeout(() => {
            chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [ruleId]
            }, () => {
            console.log("Rule removed. Redirecting to:", redirectUrl);
        
            // Redirect to the retrieved URL
            // chrome.tabs.update({ url: "/" + lastPart });
            chrome.tabs.update( { url: "https://" + lastPart.replace(/^\/+/, "") });
        
            // Optional: Remove the stored URL after use
            // chrome.storage.local.remove(`rule_${ruleId}`);
            });
        }, 10000);
       // chrome.tabs.update({ url: lastPart });
               
            
        }
      }, 100);
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  })();