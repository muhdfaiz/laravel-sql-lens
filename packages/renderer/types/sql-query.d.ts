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
  explainResult: MysqlExplainResult[];
}

export interface SqlQueryGroup {
  url: string;
  queries: SqlQuery[];
}

export interface MysqlExplainResult {
  Extra: null;
  filtered: 100;
  id: number;
  key: string;
  key_len: string;
  partitions: null;
  possible_keys: string;
  ref: string;
  rows: number;
  select_type: string;
  table: string;
  type: string;
}
