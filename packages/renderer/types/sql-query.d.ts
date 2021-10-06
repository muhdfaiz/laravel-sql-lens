export interface SqlQuery {
  driver: string;
  url: string;
  connection: string;
  database: string;
  bindings: [];
  sqlWithoutBindings: string;
  sqlWithBindings: string;
  file: string;
  line: number;
  time: number;
  explainResult: [];
}

export interface SqlQueryGroup {
  url: string;
  queries: SqlQuery[];
}
