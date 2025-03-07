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
        
                chrome.tabs.update({ url: "https://www.google.com" });
                console.log("Redirected to YouTube after 10 seconds");
            
        }
      }, 100);
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  })();