const MODES = {
  inside: {
    title: '<- Back inside',
    iconPath: "icons/icon128-inside.png",
  },
  outisde: {
    title: 'Step outside ->',
    iconPath: "icons/icon128-outside.png",
  },
};

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {}, (response) => {
      let mode = response.connected ? MODES.outisde : MODES.inside;
      chrome.browserAction.setIcon({ path: mode.iconPath });
      chrome.browserAction.setTitle({ title: mode.title });
    });
  });
});
