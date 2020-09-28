const audioCtx = new AudioContext();

// const feedForward = [0.00020298, 0.0004059599, 0.00020298];
// const feedBack = [1.0126964558, -1.9991880801, 0.9873035442];
// const filter = audioCtx.createIIRFilter(feedForward, feedBack);

var filter = audioCtx.createBiquadFilter();
filter.type = "lowpass"; // Low-pass filter. See BiquadFilterNode docs
filter.frequency.value = 200; // Set cutoff to 440 HZ

let connected = false;
let srcNode = null;

const toggleActionHandler = (_request, _sender, sendResponse) => {
  if (!connected) {
    if (srcNode) {
      srcNode.disconnect(audioCtx.destination);
    } else {
      const myAudio = document.querySelector("audio,video");
      srcNode = audioCtx.createMediaElementSource(myAudio);
    }

    srcNode.connect(filter).connect(audioCtx.destination);
    connected = true;
  } else {
    srcNode.disconnect(filter);
    srcNode.connect(audioCtx.destination);
    connected = false;
  }

  sendResponse({ connected });
};

chrome.extension.sendMessage({}, function () {
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      chrome.runtime.onMessage.addListener(toggleActionHandler);
    }
  }, 10);
});
