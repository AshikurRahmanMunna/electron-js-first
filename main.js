// Modules
const electron = require("electron");
const fs = require("fs");
const { app, BrowserWindow, ipcMain } = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

app.disableHardwareAcceleration();

ipcMain.handle("app-path", () => {
  return app.getPath("desktop");
});

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minHeight: 300,
    minWidth: 500,
    center: true,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: false,
      offscreen: true,
    },
  });

  mainWindow.webContents.on("did-finish-load", () => {
    console.log(mainWindow.getTitle());
    mainWindow.close();
    mainWindow = null;
  });

  mainWindow.webContents.on("paint", (e, dirty, image) => {
    fs.writeFileSync(
      app.getPath("downloads") + `\\${Math.random() * 1000}`,
      image.toJPEG(),
      console.log
    );
  });

  // Load index.html into the new BrowserWindow
  // mainWindow.loadFile("index.html");

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Electron `app` is ready
app.on("ready", createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
