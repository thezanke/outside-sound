const audioCtx = new AudioContext();

const filter = audioCtx.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.value = 200;
filter.connect(audioCtx.destination);

let connected = false;
let srcNode = null;

const clickHandler = (event) => {
  if (!connected) {
    if (!srcNode) {
      const myAudio = document.querySelector('audio,video');
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

  event.detail.sendResponse({ connected });
};

const actionTarget = new EventTarget();
actionTarget.addEventListener('clicked', clickHandler);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request.action) return;
  const { action, ...data } = request;
  actionTarget.dispatchEvent(new CustomEvent(action, { detail: { data, sender, sendResponse } }));
});
