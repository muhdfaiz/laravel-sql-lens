import type { SqlQueryModel } from "./sql-query-model";

export class UrlModel {
  id?: number;
  url?: string;
  totalQueries?: number;
  containN1Issue?: boolean;
  totalQueryTime?: number;
  fastestQueryTime?: number;
  slowestQueryTime?: number;
  averageQueryTime?: number;
  totalQueryTimeExceedThreshold?: boolean;
  createdAt?: string;
  issues?: string[];
  sqlQueries?: SqlQueryModel[];

  constructor() {
    Object.defineProperties(this, {
      sqlQueries: { value: [], enumerable: false, writable: true },
    });
  }
}
