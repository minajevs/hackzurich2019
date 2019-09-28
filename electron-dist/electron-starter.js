"use strict";
exports.__esModule = true;
// Modules to control application life and create native browser window
var electron_1 = require("electron");
var mainWindow;
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600
    });
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    if (mainWindow === null)
        createWindow();
});
