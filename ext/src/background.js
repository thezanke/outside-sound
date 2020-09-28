const MODES = {
  inside: {
    title: 'Step outside ->',
    iconPath: "icons/icon128-inside.png",
  },
  outside: {
    title: '<- Back inside',
    iconPath: "icons/icon128-outside.png",
  },
};

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {}, (response) => {
      const mode = response && response.connected ? MODES.outside : MODES.inside;
      chrome.browserAction.setIcon({ path: mode.iconPath });
      chrome.browserAction.setTitle({ title: mode.title });
    });
  });
});
