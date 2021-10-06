import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import { ServerModel } from "../../database/server-model";

@Module({ namespaced: true, name: "ServerSettingModule" })
export default class ServerSettingModule extends VuexModule {
  serverList: ServerModel[] = [];
  activeServer: ServerModel = new ServerModel();
  showEditServerModal = false;
  showAddServerModal = false;

  @Mutation
  setServerList(serverList: ServerModel[]): void {
    this.serverList = serverList;
  }

  @Mutation
  setActiveServer(server: ServerModel): void {
    this.activeServer = server;
  }

  @Mutation
  emptyActiveServer(): void {
    this.activeServer = new ServerModel();
  }

  @Mutation
  setShowAddServerModal(displayModal: boolean): void {
    this.showAddServerModal = displayModal;
  }

  @Mutation
  setShowEditServerModal(displayModal: boolean): void {
    this.showEditServerModal = displayModal;
  }
}
