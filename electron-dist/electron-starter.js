"use strict";
exports.__esModule = true;
// Modules to control application life and create native browser window
const electron_1 = require("electron");
const backEnd = require("../src/index.js");
const Shortcut = require("../src/models/Shortcut");
const path = require("path");

let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new electron_1.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../src/preload.js")
    }
  });
  mainWindow.loadURL("http://localhost:3000");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}
electron_1.app.on("ready", function() {
  console.log("init back");
  backEnd.init();
  Shortcut.attachNewShortcutsEmitter(
    (topic => shortcuts => mainWindow.webContents.send(topic, shortcuts))('shortcuts-list')
  );
  createWindow();
});
electron_1.app.on("window-all-closed", function() {
  if (process.platform !== "darwin") electron_1.app.quit();
});
electron_1.app.on("activate", function() {
  if (mainWindow === null) createWindow();
});
