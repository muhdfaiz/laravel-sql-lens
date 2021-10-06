import type { ServerModel } from "../../renderer/src/database/server-model";
import type { MenuItem } from "electron";
import { Menu, app, BrowserWindow, ipcMain, shell, dialog } from "electron";
import { join } from "path";
import { URL } from "url";
import * as net from "net";
import type { IpcMainInvokeEvent, OpenDialogReturnValue } from "electron/main";
import type {
  ISsh2Config,
  ISshConnectionData,
} from "../../renderer/types/ssh-connection";
import { TestSshEvent } from "../../renderer/enums/ssh";
import type { ClientInfo } from "ssh2";

const { readFileSync } = require("fs");
const Client = require("ssh2").Client;
const contextMenu = require("electron-context-menu");

if (!import.meta.env.PROD) {
  contextMenu({
    showSaveImageAs: true,
    showInspectElement: true,
  });
}

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}

app.disableHardwareAcceleration();

app
  .whenReady()
  .then(async () => {
    if (import.meta.env.MODE === "development") {
      const { default: installExtension, VUEJS3_DEVTOOLS } = await import(
        "electron-devtools-installer"
      );

      installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      });
    }

    if (import.meta.env.MODE !== "development") {
      removeUnnecessaryMenu();
    }
  })
  .catch((e) => console.error("Failed install extension:", e));

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 900,
    minHeight: 700,
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
          "file://" + __dirname,
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
  sshServerConnection?.end();
  sshServerConnection?.destroy();
  server?.close();

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

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/**
 * Remove unnecessary menu like toggle developer tool, reload and edit.
 */
const removeUnnecessaryMenu = () => {
  const menu = Menu.getApplicationMenu() as Menu;
  // console.log(menu);

  const editMenu: MenuItem | undefined = menu.items.find(
    (item) => (item.role as string) === "editmenu",
  );

  if (editMenu !== undefined) {
    editMenu.visible = false;
  }

  const viewMenu: MenuItem | undefined = menu.items.find(
    (item) => (item.role as string) === "viewmenu",
  );

  if (viewMenu !== undefined && viewMenu?.submenu) {
    // Find to
    const toggleDeveloperToolMenu = viewMenu?.submenu?.items.find(
      (item) => (item.role as string) === "toggledevtools",
    );

    if (toggleDeveloperToolMenu !== undefined) {
      toggleDeveloperToolMenu.visible = false;
    }

    const forceReloadMenu = viewMenu?.submenu?.items.find(
      (item) => (item.role as string) === "forcereload",
    );

    if (forceReloadMenu !== undefined) {
      forceReloadMenu.visible = false;
    }

    const reloadMenu = viewMenu?.submenu?.items.find(
      (item) => (item.role as string) === "reload",
    );

    if (reloadMenu !== undefined) {
      reloadMenu.visible = false;
    }
  }

  Menu.setApplicationMenu(menu);
};

// TCP Server
let server: net.Server | null = null;

type SshClient = typeof Client;
let sshServerConnection: SshClient | null = null;

/**
 * Handler to start TCP Server and listen sql query data.
 */
ipcMain.handle(
  "start-tcp-server",
  (event: IpcMainInvokeEvent, serverHost: string, serverPort: number) => {
    server = new net.Server();

    server.listen(serverPort, serverHost);

    server.on("connection", function (socket: net.Socket) {
      socket.setEncoding("utf8");

      socket.on("data", function (chunk: Buffer) {
        const newSqlQueryGroup = chunk.toString();
        event.sender.send(
          "new-sql-query-group-received",
          JSON.parse(newSqlQueryGroup),
        );

        socket.end();
      });

      socket.on("error", function (err: Error) {
        console.log(`Error: ${err}`);
      });
    });
  },
);

/**
 * Handler to stop tcp server.
 */
ipcMain.handle("stop-tcp-server", () => {
  server?.close();
});

/**
 * Handler to open url in browser
 */
ipcMain.handle("open-url-in-browser", (_, url) => {
  shell.openExternal(url);
});

/**
 * Handler to send selected ssh private key information.
 */
ipcMain.handle("select-ssh-private-key", (event: IpcMainInvokeEvent) => {
  if (process.platform !== "darwin") {
    dialog
      .showOpenDialog({ properties: ["openFile"] })
      .then((files: OpenDialogReturnValue) => {
        if (files) {
          event.sender.send("selected-ssh-private-key", files);
        }
      });
  } else {
    dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory"],
      })
      .then((files: OpenDialogReturnValue) => {
        if (files) {
          event.sender.send("selected-ssh-private-key", files);
        }
      });
  }
});

/**
 * Handler to test ssh connection valid or not.
 */
ipcMain.handle(
  "test-ssh-connection",
  (event: IpcMainInvokeEvent, sshConnectionData: ISshConnectionData) => {
    try {
      const sshCredentials: ISsh2Config = {
        host: sshConnectionData.sshServer as string,
        port: sshConnectionData.sshPort as number,
        username: sshConnectionData.sshUser as string,
        readyTimeout: 3000,
      };

      if (sshConnectionData.sshPassword) {
        sshCredentials.password = sshConnectionData.sshPassword;
      } else {
        sshCredentials.privateKey = readFileSync(
          sshConnectionData.sshPrivateKey,
        );
      }

      const conn: SshClient = new Client();

      conn
        .on("ready", () => {
          event.sender.send("test-ssh-connection-result", {
            result: true,
            type: sshConnectionData.type,
          });

          conn.end();
        })
        .on("error", (error: unknown) => {
          const errorMessage = (error as Error).message;
          conn.end();

          event.sender.send("test-ssh-connection-result", {
            result: false,
            type: sshConnectionData.type,
            message: errorMessage,
          });
        })
        .connect(sshCredentials);
    } catch (err: unknown) {
      const errorMessage = (err as Error).message;

      event.sender.send("test-ssh-connection-result", {
        result: false,
        type: sshConnectionData.type,
        message: errorMessage,
      });
    }
  },
);

/**
 * Handler to test ssh connection valid or not.
 */
ipcMain.handle(
  "ssh-into-server-and-listen-sql-queries",
  (event: IpcMainInvokeEvent, server: ServerModel) => {
    try {
      const sshCredentials: ISsh2Config = {
        host: server.sshServer as string,
        port: server.sshPort as number,
        username: server.sshUser as string,
        readyTimeout: 3000,
      };

      if (server.sshPassword) {
        sshCredentials.password = server.sshPassword;
      } else {
        sshCredentials.privateKey = readFileSync(server.sshPrivateKey);
      }

      sshServerConnection = new Client();

      (sshServerConnection as SshClient)
        .on("ready", () => {
          (sshServerConnection as SshClient).forwardIn(
            server.host as string,
            server.port as number,
            (err: Error) => {
              if (err !== undefined) {
                console.log("Error:" + err);
              }
            },
          );
        })
        .on(
          "tcp connection",
          (info: ClientInfo, accept: () => SshClient, reject: () => void) => {
            accept()
              .on("data", (newSqlQueryGroup: string) => {
                event.sender.send(
                  "new-sql-query-group-received",
                  JSON.parse(newSqlQueryGroup),
                );
              })
              .end();
          },
        )
        .on("error", () => {
          event.sender.send("test-ssh-connection-result", {
            result: false,
            type: TestSshEvent.StartServer,
          });

          sshServerConnection.end();
        })
        .connect(sshCredentials);
    } catch (err: unknown) {
      const errorMessage = (err as Error).message;

      event.sender.send("test-ssh-connection-result", {
        result: false,
        type: TestSshEvent.StartServer,
        message: errorMessage,
      });
    }
  },
);

/**
 * Handler to stop ssh server connection.
 */
ipcMain.handle("stop-ssh-server-connection", () => {
  server?.close();
  sshServerConnection?.end();
  sshServerConnection?.destroy();
});
