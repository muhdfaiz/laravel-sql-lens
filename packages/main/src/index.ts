import { app, BrowserWindow, ipcMain, shell } from "electron";
import { join } from "path";
import { URL } from "url";

const net = require("net");
const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

// Install "Vue.js devtools"
if (import.meta.env.MODE === "development") {
  app
    .whenReady()
    .then(() => import("electron-devtools-installer"))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
      installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      })
    )
    .catch((e) => console.error("Failed install extension:", e));
}

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    minWidth: 700,
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      nativeWindowOpen: true,
      preload: join(__dirname, "../../preload/dist/index.cjs"),
      contextIsolation: import.meta.env.MODE !== "test", // Spectron tests can't work with contextIsolation: true
      enableRemoteModule: import.meta.env.MODE === "test", // Spectron tests can't work with enableRemoteModule: false
    },
  });

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();

    if (import.meta.env.MODE === "development") {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    import.meta.env.MODE === "development" &&
    import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          "../renderer/dist/index.html",
          "file://" + __dirname
        ).toString();

  await mainWindow.loadURL(pageUrl);
};

app.on("second-instance", () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(createWindow)
  .catch((e) => console.error("Failed create window:", e));

// Auto-updates
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}

// TCP Server
let server = null;

/**
 * Handler to start TCP Server and listen sql query data.
 */
ipcMain.handle("start-tcp-server", (event, serverHost, serverPort) => {
  console.log(serverHost, serverPort);
  server = new net.Server();

  server.listen(serverPort, function () {
    console.log(
      `Server listening for connection requests on socket localhost:${serverPort}.`
    );
  });

  server.on("connection", function (socket: any) {
    console.log("A new connection has been established.");

    socket.setEncoding("utf8");

    socket.on("data", function (chunk: any) {
      console.log(`Data received from client: ${chunk.toString()}.`);
      const newData = chunk.toString();
      event.sender.send("new-data-received", newData);
      socket.end();
    });

    socket.on("end", function () {
      console.log("Closing connection with the client");
    });

    socket.on("error", function (err: any) {
      console.log(`Error: ${err}`);
    });
  });
});

/**
 * Handler to open url in browser
 */
ipcMain.handle("open-url-in-browser", (_, url) => {
  shell.openExternal(url);
});
