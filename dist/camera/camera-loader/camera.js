(async () => {
  try {
    const video = document.createElement("video");
    video.style.position = "fixed";
    video.style.display = "none";
    video.style.width = "300px";
    video.style.height = "300px";
    video.style.top = "0px";
    document.body.appendChild(video);

    const progressBar = document.querySelector(".progress");
    const messageP = document.getElementById("messageID");

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
          progress -= 1.5; // Slowly reverse if continuously looking

          if (messageP.textContent === "Loading...") {
            messageP.innerHTML = getRandomMessage();
          }
        } else {
          progress += 0.1; // Slow increase
        }
      } else {
        if (messageP.textContent !== "Loading...") {
          messageP.innerHTML = "Loading...";
        }
        progress += 0.6; // Fast increase
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

const savageMessages = [
  "Your screen isnt a mirror. Look away.",
  "What? Never seen a loading bar before?",
  "This isnt a staring contest. You'll lose.",
  "Your eyes have better things to do. Like blinking.",
  "Go touch some grass while we load this.",
  "Loading wont go faster if you glare at it.",
  "Seriously? You have nothing better to do?",
  "Your FBI agent is judging you right now.",
  "Even the progress bar is uncomfortable now.",
  "Staring wont make it go any faster, Einstein.",
  "The pixels need privacy. Respect that.",
  "You're creeping out the loading screen.",
  "Go outside. The sun exists, I promise.",
  "You look better when you're not staring at me.",
  "You blinked once in 10 seconds. blink, dude. Bliiiiiiink!!!",
  "At this rate, you'll burn the screen with your gaze.",
  "Your devotion is noted, but unnecessary.",
  "Congratulations, you unlocked the Time Waster achievement.",
  "Even your reflection thinks this is weird. Weirdo",
  "The bar won't fill up just because you're watching. duhh",
];

function getRandomMessage() {
  return savageMessages[Math.floor(Math.random() * savageMessages.length)];
}
