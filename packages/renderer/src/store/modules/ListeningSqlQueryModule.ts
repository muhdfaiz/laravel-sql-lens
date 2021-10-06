import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import type { UrlModel } from "../../database/url-model";

@Module({ name: "ListeningSqlQueryModule" })
export default class ListeningSqlQueryModule extends VuexModule {
  sqlQueryGroups: UrlModel[] = [];
  slowQueryThreshold = 200;
  totalQueryTimeThreshold = 500;
  totalQueryThreshold = 20;
  showExplainResultModal = false;
  explainResultTableHeaders: string[] = [];
  explainResultTableData: [] = [];
  saveQueryIntoStorage = true;

  @Mutation
  emptySqlQueryGroups(): void {
    this.sqlQueryGroups = [];
  }

  @Mutation
  pushNewSqlQueries(sqlQueryGroup: UrlModel): void {
    this.sqlQueryGroups.unshift(sqlQueryGroup);
  }

  @Mutation
  setSlowQueryThreshold(slowQueryThreshold: number): void {
    this.slowQueryThreshold = slowQueryThreshold;
  }

  @Mutation
  setTotalQueryTimeThreshold(totalQueryTimeThreshold: number): void {
    this.totalQueryTimeThreshold = totalQueryTimeThreshold;
  }

  @Mutation
  setTotalQueryThreshold(totalQueryThreshold: number): void {
    this.totalQueryThreshold = totalQueryThreshold;
  }

  @Mutation
  setShowExplainResultModal(showExplainResultModal: boolean): void {
    this.showExplainResultModal = showExplainResultModal;
  }

  @Mutation
  setExplainResultTableHeaders(explainResultTableHeaders: string[]): void {
    this.explainResultTableHeaders = explainResultTableHeaders;
  }

  @Mutation
  emptyExplainResultTableHeaders(): void {
    this.explainResultTableHeaders = [];
  }

  @Mutation
  pushNewExplainResultTableData(explainResultTableData: []): void {
    this.explainResultTableData.push(explainResultTableData);
  }

  @Mutation
  emptyExplainResultTableData(): void {
    this.explainResultTableData = [];
  }

  @Mutation
  setSaveDataIntoStorage(saveDataIntoStorage: boolean): void {
    this.saveQueryIntoStorage = saveDataIntoStorage;
  }
}
