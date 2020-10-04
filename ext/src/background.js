const MODES = {
  inside: {
    title: 'Step outside ->',
    iconPath: 'icons/icon128-inside.png',
  },
  outside: {
    title: '<- Back inside',
    iconPath: 'icons/icon128-outside.png',
  },
};

const setMode = (connected) => {
  const mode = connected ? MODES.outside : MODES.inside;
  chrome.browserAction.setIcon({ path: mode.iconPath });
  chrome.browserAction.setTitle({ title: mode.title });
};

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'CLICKED' }, (response) => {
      setMode(response && response.connected);
    });
  });
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.sendMessage(tabId, { action: 'STATUS_CHECK' }, (response) => {
    setMode(response && response.connected);
  });
});
