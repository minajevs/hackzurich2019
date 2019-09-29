const path = require("path");
const WindowsToaster = require("node-notifier").WindowsToaster;

let focusOnAppWindow;
const notifier = new WindowsToaster({
  withFallback: false // Fallback to Growl or Balloons?
});

const notify = () => {
  notifier.notify(
    {
      title: "Logitech MX Master dashboard",
      message: "Hey, looks like you are using this keyboard combo frequently! Want to bind it to mouse gesture?",
      icon: path.join(
        __dirname,
        "../logo.png"
      ),
      sound: false,
      wait: true
    },
    function (error, response) {
      focusOnAppWindow.setAlwaysOnTop(true);
      focusOnAppWindow.focus();
      focusOnAppWindow.setAlwaysOnTop(false);
    }
  );
};

module.exports = { init: window => (focusOnAppWindow = window), notify };
