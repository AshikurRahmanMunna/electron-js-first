// Modules
const { app, BrowserWindow } = require("electron");
const windowStateKeeper = require("electron-window-state");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow, secWindow;

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  console.log("Creating window");

  const winState = windowStateKeeper({
    defaultHeight: 800,
    defaultWidth: 1000,
  });

  mainWindow = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    x: winState.x,
    y: winState.y,
    minWidth: 300,
    minHeight: 150,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  winState.manage(mainWindow);

  // secWindow = new BrowserWindow({
  //   width: 700,
  //   height: 800,
  //   webPreferences: {
  //     // --- !! IMPORTANT !! ---
  //     // Disable 'contextIsolation' to allow 'nodeIntegration'
  //     // 'contextIsolation' defaults to "true" as from Electron v12
  //     contextIsolation: false,
  //     nodeIntegration: true,
  //   },
  // });

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile("index.html");
  // secWindow.loadFile("index.html");
  // secondaryWindow.loadFile("secondary.html");

  // Open DevTools - Remove for PRODUCTION!

  mainWindow.on("focus", () => {
    console.log("Main window is focused");
  });
  // secWindow.on("focus", () => {
  //   console.log("Second window is focused");
  // });

  // Listen for window being closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // secWindow.on("closed", () => {
  //   mainWindow.maximize();
  //   mainWindow = null;
  // });
  // secondaryWindow.on("closed", () => {
  //   secondaryWindow = null;
  // });
}

// Electron `app` is ready
app.on("ready", () => {
  console.log(app.getPath("downloads"));
  console.log(app.getPath("music"));
  console.log(app.getPath("desktop"));
  console.log(app.getPath("userData"));
  createWindow();
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("browser-window-focus", () => {
  console.log("App focused");
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
