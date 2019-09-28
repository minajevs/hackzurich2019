const path = require("path");
const WindowsToaster = require("node-notifier").WindowsToaster;

let focusOnAppWindow;
const notifier = new WindowsToaster({
  withFallback: false // Fallback to Growl or Balloons?
});

const notify = () => {
  notifier.notify(
    {
      title: "Toasty",
      message: "Toasty!!!!!!111)))0",
      icon: path.join(
        __dirname,
        "../kisspng-dan-forden-mortal-kombat-ii-mortal-kombat-3-mortal-5af5e57bd10d93.7564833915260645078563.jpg"
      ),
      sound: false,
      wait: true
    },
    function(error, response) {
        focusOnAppWindow.setAlwaysOnTop(true);
        focusOnAppWindow.focus();
        focusOnAppWindow.setAlwaysOnTop(false);
    }
  );
};

module.exports = { init: window => (focusOnAppWindow = window), notify };
