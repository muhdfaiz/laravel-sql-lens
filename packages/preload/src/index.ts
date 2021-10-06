import type { SqlQueryGroup } from "./../../renderer/types/sql-query.d";
import { contextBridge, ipcRenderer } from "electron";
import type { ElectronApi } from "types/electron-api";
import type { ServerModel } from "../../renderer/src/database/server-model";
import type { ISshConnectionData } from "../../renderer/types/ssh-connection";

const apiKey = "electron";

const api: ElectronApi = {
  startTcpServer: (host: string, port: number) => {
    ipcRenderer.invoke("start-tcp-server", host, port);
  },
  stopTcpServer: () => {
    ipcRenderer.invoke("stop-tcp-server");
  },
  stopSshServerConnection: () => {
    ipcRenderer.invoke("stop-ssh-server-connection");
  },
  testSshConnection: (sshConnectionData: ISshConnectionData) => {
    ipcRenderer.invoke("test-ssh-connection", sshConnectionData);
  },
  sshIntoServerAndListenSqlQueries: (server: ServerModel) => {
    ipcRenderer.invoke("ssh-into-server-and-listen-sql-queries", server);
  },
  onReceiveNewSqlQueryGroup: (
    channel: string,
    func: (event: Event, data: SqlQueryGroup) => void,
  ) => {
    ipcRenderer.on(channel, func);
  },
  openURLInBrowser: (url: string) => {
    ipcRenderer.invoke("open-url-in-browser", url);
  },
  selectSshPrivateKey: () => {
    ipcRenderer.invoke("select-ssh-private-key");
  },
  removeListener: (listener: string) => {
    ipcRenderer.removeAllListeners(listener);
  },
  addListener: (eventName: string, listener) => {
    ipcRenderer.addListener(eventName, listener);
  },
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld(apiKey, api);
} else {
  /**
   * Recursively Object.freeze() on objects and functions
   * @see https://github.com/substack/deep-freeze
   * @param obj Object on which to lock the attributes
   */
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const deepFreeze = (obj: any) => {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    if (typeof obj === "object" && obj !== null) {
      Object.keys(obj).forEach((prop) => {
        const val = obj[prop];
        if (
          (typeof val === "object" || typeof val === "function") &&
          !Object.isFrozen(val)
        ) {
          deepFreeze(val);
        }
      });
    }

    return Object.freeze(obj);
  };

  deepFreeze(api);

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  (window as any)[apiKey] = api;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  // Need for Spectron tests
  (window as any).electronRequire = require;
}
