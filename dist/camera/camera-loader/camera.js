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
    const chippi = document.getElementById("chippiAudio");
    const reverse = document.getElementById("loseAudio");
    const incredibleFace = document.getElementById("incredible");
    const comeBackAud = document.getElementById("comeBack");

    let progress = 0;
    let isLooking = false;
    let isAFK = false;
    let playChippi = false;
    let playReverse = false;
    let playMeow = false;
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
      isAFK = prediction[1].probability > 0.7;
      console.log(
        prediction[0].probability,
        prediction[1].probability,
        prediction[2].probability,
        isLooking
      );

      return isLooking;
    }

    function updateProgressBar() {
      if (isAFK) {
        if (!playMeow) {
          comeBackAud.play();
          playMeow = true;
        }
        playChippi = false;
        playReverse = false;
        reverse.pause();
        reverse.currentTime = 0;
        chippi.pause();
        chippi.currentTime = 0;
        messageP.innerHTML =
          "Yo, the camera misses you! Get back here, we aint moving";
        return;
      }
      if (isLooking) {
        playMeow = false;
        comeBackAud.pause();
        comeBackAud.currentTime = 0;
        playChippi = false;
        chippi.currentTime = 0;
        chippi.pause();
        if (progress >= 100) {
          progress = 100;
          return;
        }
        const elapsedTime = Date.now() - lastLookingTime;
        if (elapsedTime > 2000) {
          if (!playReverse) {
            reverse.play();
            playReverse = true;
          }
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
        if (!playChippi) {
          chippi.play();
          playChippi = true;
        }
        comeBackAud.pause();
        comeBackAud.currentTime = 0;
        playMeow = false;
        playReverse = false;
        reverse.pause();
        reverse.currentTime = 0;
        progress += 0.3; // Fast increase
      }

      progress = Math.min(Math.max(progress, 0), 100);
      progressBar.style.width = `${progress}%`;
      if (progress > 75) {
        incredibleFace.src = "assets/75.png";
      } else if (progress > 50) {
        incredibleFace.src = "assets/50.png";
      } else if (progress > 25) {
        incredibleFace.src = "assets/25.png";
      } else if (progress > 3) {
        incredibleFace.src = "assets/0.png";
        incredibleFace.style.display = "block";
      } else {
        incredibleFace.src = "";
        incredibleFace.style.display = "none";
      }
    }

    var ruleId = 0;
    var redirectUrl = "";
    var lastPart = "";

    const interval = setInterval(async () => {
      await predict();
      updateProgressBar();
      if (progress >= 100) {
        clearInterval(interval);
        stream.getTracks().forEach((track) => track.stop());
        video.remove();

        const urlParams = new URLSearchParams(window.location.search);
        console.log("URL Params:", urlParams);
        ruleId = urlParams.get("ruleId");
        console.log("Rule ID inside domlistener:", ruleId);

        console.log("Rule ID:", ruleId);

        ruleId = parseInt(ruleId, 10);
        console.log("Redirect url:", redirectUrl);

        chrome.storage.local.get(`rule_${ruleId}`, (result) => {
          if (chrome.runtime.lastError) {
            console.error("Error retrieving URL:", chrome.runtime.lastError);
          } else {
            redirectUrl = result[`rule_${ruleId}`];
            console.log("result: ", result, redirectUrl);
            if (redirectUrl) {
              lastPart = redirectUrl.substring(
                redirectUrl.lastIndexOf("/") + 1
              );
              console.log("Retrieved URL:", lastPart);
            } else {
              console.log("No URL found for ruleId:", ruleId);
            }
          }
        });

        chrome.declarativeNetRequest.updateDynamicRules(
          {
            removeRuleIds: [ruleId],
          },
          () => {
            console.log(
              "Rule removed. Redirecting to:",
              redirectUrl[`rule_${ruleId}`]
            );

            // Redirect to the retrieved URL
            // chrome.tabs.update({ url: "/" + lastPart });
            chrome.tabs.update({
              url: "https://" + lastPart.replace(/^\/+/, ""),
            });

            // Optional: Remove the stored URL after use
            // chrome.storage.local.remove(`rule_${ruleId}`);
          }
        );
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

        // document.addEventListener("DOMContentLoaded", () => {
        //   const urlParams = new URLSearchParams(window.location.search);
        //   console.log("URL Params:", urlParams);
        //   ruleId = urlParams.get("ruleId");
        //   console.log("Rule ID inside domlistener:", ruleId);

        //   if (!ruleId) {
        //     console.error("ruleId is missing or invalid");
        //   } else {
        //     console.log("Camera.js Loaded - Rule ID:", ruleId);
        //   }

        //   // Now you can use ruleId in your logic
        // });
        // const urlParams = new URLSearchParams(window.location.search);
        // console.log("URL Params:", urlParams);
        // ruleId = urlParams.get("ruleId");
        // console.log("Rule ID inside domlistener:", ruleId);

        // console.log("Rule ID:", ruleId);

        // ruleId = parseInt(ruleId, 10);
        // console.log("Redirect url:", redirectUrl);
        // setTimeout(() => {
        //   chrome.declarativeNetRequest.updateDynamicRules(
        //     {
        //       removeRuleIds: [ruleId],
        //     },
        //     () => {
        //       console.log("Rule removed. Redirecting to:", redirectUrl);

        //       // Redirect to the retrieved URL
        //       // chrome.tabs.update({ url: "/" + lastPart });
        //       chrome.tabs.update({
        //         url: "https://" + lastPart.replace(/^\/+/, ""),
        //       });

        //       // Optional: Remove the stored URL after use
        //       // chrome.storage.local.remove(`rule_${ruleId}`);
        //     }
        //   );
        // }, 10000);
        // chrome.tabs.update({ url: lastPart });
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
