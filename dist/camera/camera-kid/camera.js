(async () => {
    try {
        const video = document.createElement("video");
        video.style.position = "absolute";
        video.style.width = "300px";
        video.style.height = "300px";
        video.style.top = "10px";
        document.body.appendChild(video);
console.log("Hello World");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();

        const modelURL = "https://storage.googleapis.com/tm-model/keo4glXcQ/model.json";
        const metadataURL = "https://storage.googleapis.com/tm-model/keo4glXcQ/metadata.json";
        const model = await tmImage.load(modelURL, metadataURL);

        let class2AboveThresholdTime = null; // Track time when class2 is above 60%

        async function predict() {
            const prediction = await model.predict(video);
            const class2Probability = prediction[1].probability; // Assuming second class is at index 1
            console.log("Class 2 Probability:", class2Probability);

            if (class2Probability > 0.4) {
                if (class2AboveThresholdTime === null) {
                    class2AboveThresholdTime = Date.now();
                } else {
                    const elapsedTime = Date.now() - class2AboveThresholdTime;
                    if (elapsedTime >= 1000) {
                        console.log("Class 2 above 60% for 5 seconds! Redirecting...");
                        clearInterval(interval);
                        stream.getTracks().forEach((track) => track.stop());
                        video.remove();
                        window.location.replace("https://www.youtube.com/watch?v=At8v_Yc044Y"); // Change this to your desired URL
                    }
                }
            } else {
                class2AboveThresholdTime = null; // Reset timer if below threshold
            }
        }

        const interval = setInterval(async () => {
            await predict();
        }, 100); // Check every 100ms
    } catch (error) {
        console.error("Camera access denied:", error);
    }
})();
