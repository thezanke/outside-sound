let audioCtx = null;
let filter = null;
let connected = false;
let sources = null;

const clickHandler = (event) => {
  if (!audioCtx) {
    audioCtx = new AudioContext();

    filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.connect(audioCtx.destination);
  }

  if (!connected) {
    if (!sources) {
      const elements = document.querySelectorAll('audio,video');
      sources = [...elements].map((el) => audioCtx.createMediaElementSource(el));
    }

    sources.forEach((srcNode) => {
      try {
        srcNode.disconnect(audioCtx.destination);
      } catch {}

      srcNode.connect(filter);
    });

    connected = true;
  } else {
    sources.forEach((srcNode) => {
      srcNode.disconnect(filter);
      srcNode.connect(audioCtx.destination);
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
