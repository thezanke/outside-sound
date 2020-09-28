const audioCtx = new AudioContext();

var filter = audioCtx.createBiquadFilter();
filter.type = "lowpass";
filter.frequency.value = 200;
filter.connect(audioCtx.destination);

let connected = false;
let srcNode = null;

const actionHandler = (_request, _sender, sendResponse) => {
  if (!connected) {
    if (!srcNode) {
      const myAudio = document.querySelector("audio,video");
      if (myAudio) srcNode = audioCtx.createMediaElementSource(myAudio);
    } else {
      srcNode.disconnect(audioCtx.destination);
    }

    if (srcNode) {
      srcNode.connect(filter);
      connected = true;
    }
  } else {
    srcNode.disconnect(filter);
    srcNode.connect(audioCtx.destination);
    connected = false;
  }

  sendResponse({ connected });
};

chrome.runtime.onMessage.addListener(actionHandler);
