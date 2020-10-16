let connected = false;

let audioCtx = null;
let filterNode = null;
let sourceNodes = null;

const clickHandler = (event) => {
  if (!audioCtx) {
    audioCtx = new AudioContext();

    // Create a compressor node
    var gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.65;

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 200;

    filterNode.connect(gainNode).connect(audioCtx.destination);
  }

  if (!connected) {
    if (!sourceNodes) {
      const elements = document.querySelectorAll('audio,video');
      sourceNodes = [...elements].map((el) => audioCtx.createMediaElementSource(el));
    }

    sourceNodes.forEach((sourceNode) => {
      try {
        sourceNode.disconnect(audioCtx.destination);
      } catch {}

      sourceNode.connect(filterNode);
    });

    connected = true;
  } else {
    sourceNodes.forEach((sourceNode) => {
      sourceNode.disconnect(filterNode);
      sourceNode.connect(audioCtx.destination);
    });

    connected = false;
  }

  event.detail.sendResponse({ connected });
};

const statusCheckHandler = (event) => {
  event.detail.sendResponse({ connected });
};

const actionTarget = new EventTarget();
actionTarget.addEventListener('CLICKED', clickHandler);
actionTarget.addEventListener('STATUS_CHECK', statusCheckHandler);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request.action) return;
  const { action, ...data } = request;
  actionTarget.dispatchEvent(new CustomEvent(action, { detail: { data, sender, sendResponse } }));
});
