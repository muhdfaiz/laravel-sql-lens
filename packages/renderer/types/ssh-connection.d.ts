import type { TestSshEvent } from "./../enums/ssh";

export interface ISshConnectionResult {
  result: boolean;
  type: TestSshEvent;
  message?: string;
}

export interface ISshConnectionData {
  sshServer: string;
  sshPort: number;
  sshUser: string;
  selectedSshOption: string;
  sshPassword: string;
  sshPrivateKey: string;
  type: TestSshEvent;
}

export interface ISsh2Config {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  readyTimeout: number;
}
