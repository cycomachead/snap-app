// Native Modules
const path = require('path')
const url = require('url')
const fs = require('fs');
const http = require('http');

// Electrom Modules
const electron = require('electron');
const { app, BrowserWindow } = electron;

// Local Modules
const updater = require('./autoUpdate');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Check for dev mode.
// TODO: use electron-is-dev
let DEV_MODE = process.env.NODE_ENV === 'development' ||
                   process.argv[0].indexOf('electron') !== -1;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// attempt to disable caching:
app.commandLine.appendSwitch('disable-http-cache');

// EXPERIMENTAL TEST FEATURES:
BLINK_FEATURES = [
    'Accelerated2dCanvas',
    'EnableCanvas2dDynamicRenderingModeSwitching',
    'Canvas2dImageChromium',
    'Canvas2dFixedRenderingMode',
    'ExperimentalCanvasFeatures',
    'MediaCaptureFromCanvas'
];

function createWindow() {
    // Create the browser window.
    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
        width: width,
        height: height,

        // Security Settings
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
          preload: './preload.js'
        },

        // Chrome Overrides
        blinkFeatures: BLINK_FEATURES.join(','),
        defaultFontFamily: 'sansSerif',
        defaultEncoding: 'UTF-8',
        offscreen: true
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    if (DEV_MODE) {
        mainWindow.webContents.openDevTools();
    }

    // Check for updates
    updater(mainWindow);

    mainWindow.onbeforeunload = () => {};

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.

        // TODO: Warn to save a project?
        mainWindow = null;
    });
}

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

app.on('window-all-closed', () => { app.quit() });
