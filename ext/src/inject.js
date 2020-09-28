const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const feedForward = [0.00020298, 0.0004059599, 0.00020298];
const feedBack = [1.0126964558, -1.9991880801, 0.9873035442];
const iirfilter = audioCtx.createIIRFilter(feedForward, feedBack);

let connected = false;
let srcNode = null;

const toggleActionHandler = (_request, _sender, sendResponse) => {
  if (!connected) {
    if (srcNode) srcNode.disconnect(audioCtx.destination);
    if (!srcNode) {
      const myAudio = document.querySelector("audio,video");
      srcNode = audioCtx.createMediaElementSource(myAudio);
    }

    srcNode.connect(iirfilter).connect(audioCtx.destination);
    connected = true;
  } else {
    srcNode.disconnect(iirfilter);
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
