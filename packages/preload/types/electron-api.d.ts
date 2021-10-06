import type { ServerModel } from "/@/database/server-model";
import type { SqlQueryGroup } from "../../renderer/types/sql-query";
import type { SshConnectionData } from "../../renderer/types/ssh-connection";

interface ElectronApi {
  startTcpServer: (host: string, port: number) => void;
  onReceiveNewSqlQueryGroup: (
    channel: string,
    func: (event: Event, data: SqlQueryGroup) => void,
  ) => void;
  openURLInBrowser: (url: string) => void;
  selectSshPrivateKey: () => void;
  stopTcpServer: () => void;
  stopSshServerConnection: () => void;
  testSshConnection: (sshConnectionData: SshConnectionData) => void;
  sshIntoServerAndListenSqlQueries: (server: ServerModel) => void;
  removeListener: (listener: string) => void;
  addListener: (eventName: string, listener: (...params) => void) => void;
}

declare interface Window {
  electron: Readonly<ElectronApi>;
  electronRequire?: NodeRequire;
}
