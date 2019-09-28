"use strict";
exports.__esModule = true;
// Modules to control application life and create native browser window
const electron_1 = require("electron");
const backEnd = require("../src/index.js");
const Shortcut = require("../src/models/Shortcut");
const path = require("path");

const updateShortcuts = async () => {
  (topic => shortcuts => mainWindow.webContents.send(topic, shortcuts))('shortcuts-list')((await Shortcut.getAllShortcutsDescending()).map(({ _doc: { countPressed, keys, gesture } }) => ({
    countPressed,
    keys,
    gesture
  })))
}

const updateGestures = async () => {
  (topic => gestures => mainWindow.webContents.send(topic, gestures))('gestures-list')((await Shortcut.getGestures()).map(({ _doc }) => ({
    direction: _doc.direction,
    description: _doc.description,
    bindTo: _doc.bindTo
  })))
}

let mainWindow;
const createWindow = async () => {
  // Create the browser window.
  mainWindow = new electron_1.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../src/preload.js")
    }
  });

  mainWindow.loadURL("http://localhost:3000");

  // zhopa is called when APP is ready to be rendered
  electron_1.ipcMain.on('zhopa', () => {
    updateShortcuts()
    updateGestures()
  })

  electron_1.ipcMain.on('gesture-bind', (event, { direction, keys }) => {
    Shortcut.bindGesture(direction, keys)
    Shortcut.bindShortcut(direction, keys)
  })

  electron_1.ipcMain.on('gesture-unbind', (event, direction) => {
    Shortcut.bindGesture(direction, null)
    Shortcut.unbindShortcut(direction)
  })

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

electron_1.app.on("ready", function () {
  console.log("init back");
  backEnd.init();
  Shortcut.attachNewShortcutsEmitter(
    (topic => shortcuts => mainWindow.webContents.send(topic, shortcuts))('shortcuts-list')
  );
  Shortcut.attachNewGesturesEmitter(
    (topic => gestures => mainWindow.webContents.send(topic, gestures))('gestures-list')
  )
  createWindow();
});
electron_1.app.on("window-all-closed", function () {
  if (process.platform !== "darwin") electron_1.app.quit();
});
electron_1.app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
