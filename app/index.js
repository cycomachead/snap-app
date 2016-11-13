// Native Modules
const path = require('path')
const url = require('url')
const fs = require('fs');
const http = require('http');

// Electrom Modules
const {app, BrowserWindow} = require('electron');

// Custom dependencies


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    // TODO: Set automatically fill screen
    // TODO: or use previous settings?
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,

        // Security Settings
        allowRunningInsecureContent: false, // TODO
        allowDisplayingInsecureContent: true,
        // Chrome Overrides
        experimentalFeatures: true,
        experimentalCanvasFeatures: true,
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
    
    // Open the DevTools.
    // TODO: put behind a dev flag.
    mainWindow.webContents.openDevTools();


    // Window settings
    // TODO: these are tests
    mainWindow.webSecurity = false;

    mainWindow.onbeforeunload = () => {};
    
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

});

app.on('window-all-closed', () => {
  app.quit()
});


// save As Stuff
function saveFile(fName, fContents) {
    dialog.showSaveDialog({
        filters: [{
            name: 'text',
            extensions: ['txt']
        }]
    }, function(fileName) {
        if (fileName === undefined) {
            return;
        }
        fs.writeFile(fileName, fContents, function(err) {
            dialog.showMessageBox({
                message: "The file has been saved!",
                buttons: ["OK"]
            });
        });
    });
}
