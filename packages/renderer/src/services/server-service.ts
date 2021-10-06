// import type { IServerModel } from "../../types/model";
import Dexie from "dexie";

export default class ServerService {
  private db: Dexie;

  constructor() {
    this.db = new Dexie("servers");
  }

  // getAllServers(): Promise<IPouchDBCollection<IPouchDBDocument<IServerModel>>> {
  //   return this.db.allDocs({ include_docs: true });
  // }

  /**
   * Check if the server name already exist or not.
   *
   * @param host
   * @returns
   */
  // checkServerNameAlreadyExist(
  //   name: string,
  // ): Promise<PouchDB.Core.AllDocsResponse<IServerModel>> {
  //   return this.db.get(name);
  // }

  /**
   * Get sprecific server by ID.
   *
   * @param host
   * @returns
   */
  // getSpecificServerById(
  //   id: string,
  // ): Promise<PouchDB.Core.Document<IServerModel>> {
  //   return this.db.get(id);
  // }

  /**
   * Store new server in storage.
   *
   * @param server
   * @returns
   */
  // storeNewServer(server: IServerModel): Promise<PouchDB.Core.Response> {
  //   return this.db.put(server);
  // }

  /**
   * Update server in storage.
   *
   * @param server
   * @returns
   */
  // updateServer(server: IServerModel): Promise<PouchDB.Core.Response> {
  //   return this.db.put(server);
  // }

  /**
   * Delete server by name from storage.
   *
   * @param server
   * @returns
   */
  // async deleteServer(id: string): Promise<PouchDB.Core.Response> {
  //   const doc = await this.db.get(id);

  //   return await this.db.remove(doc);
  // }
}
