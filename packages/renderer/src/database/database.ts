import { SqlQueryModel } from "./sql-query-model";
import { UrlModel } from "./url-model";
import Dexie from "dexie";
import { ServerModel } from "./server-model";

export class Database extends Dexie {
  servers: Dexie.Table<ServerModel, number>;
  urls: Dexie.Table<UrlModel, number>;
  sqlQueries: Dexie.Table<SqlQueryModel, number>;

  constructor() {
    // Create database.
    super("laravel-sqlense", { autoOpen: true });

    this.version(2).stores({
      servers: "++id,name",
      urls: "++id,url,totalQueries,containN1Issue",
      sqlQueries: "++id,urlId,database,file,sql_with_bindings",
    });

    this.servers.mapToClass(ServerModel);
    this.urls.mapToClass(UrlModel);
    this.sqlQueries.mapToClass(SqlQueryModel);
  }
}
