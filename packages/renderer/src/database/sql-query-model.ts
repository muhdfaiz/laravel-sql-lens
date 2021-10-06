export class SqlQueryModel {
  id?: number;
  urlId?: number;
  driver?: string;
  connection?: string;
  database?: string;
  bindings?: string[];
  sqlWithoutBindings?: string;
  sqlWithBindings?: string;
  time?: number;
  file?: string;
  line?: number;
  explainResult?: [];
  createdAt?: string;
}
