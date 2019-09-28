const ioHook = require("iohook");
const Shortcut = require("../models/Shortcut");
const { SHORTCUTS } = require("../consts");

let shortcutInTrack;

const trackCombination = shortcutName => {
  if (shortcutInTrack) {
    shortcutInTrack.shortcutsSequence.push(shortcutName);
  } else {
    shortcutInTrack = {
      shortcutsSequence: [shortcutName]
    };
    setTimeout(async () => {
      const shortcutsSequence = shortcutInTrack.shortcutsSequence.toString();
      shortcutInTrack = null;
      await Shortcut.increaseCountByOne(shortcutsSequence);
    }, 2000);
  }
  console.log("info", `${shortcutName} pressed`);
};

const attachShortcutsListeners = () =>
  Object.keys(SHORTCUTS).forEach(shortcutName =>
    ioHook.registerShortcut(
      SHORTCUTS[shortcutName].map(({ code }) => code),
      () => trackCombination(shortcutName)
    )
  );

module.exports = {
  init: () => {
    attachShortcutsListeners();
    ioHook.start();
  }
};
