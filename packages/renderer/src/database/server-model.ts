export class ServerModel {
  id?: number;
  name?: string;
  host?: string;
  port?: number;
  overSSH?: boolean;
  sshServer?: string;
  sshPort?: number;
  sshUser?: string;
  sshPassword?: string;
  sshPrivateKey?: string;
}
