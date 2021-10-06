<template>
  <Button
    class="p-button p-button-sm p-ml-2"
    @click="stopMonitoring()"
  >
    <font-awesome-icon
      :icon="['far', 'stop-circle']"
      size="lg"
    />
    <span class="p-ml-2">Stop Listening</span>
  </Button>
</template>

<script lang="ts" setup>
import type { Router } from "vue-router";
import { useRouter } from "vue-router";
import { useElectron } from "/@/use/electron";
import Button from "primevue/button";
import { useStore } from "vuex";
import { getModule } from "vuex-module-decorators";
import ListeningSqlQueryModule from "../../store/modules/ListeningSqlQueryModule";
import ServerSettingModule from "../../store/modules/ServerSettingModule";

const $store = useStore();
const listeningSqlQueryModule = getModule(ListeningSqlQueryModule, $store);
const serverSettingModule = getModule(ServerSettingModule, $store);


const $router: Router = useRouter();
const $electron = useElectron();

/**
 * Stop monitor SQL query from application.
 */
function stopMonitoring() {
  $electron.removeListener("new-sql-query-group-received");
  listeningSqlQueryModule.emptySqlQueryGroups();
  serverSettingModule.emptyActiveServer();

  if (serverSettingModule.activeServer.overSSH) {
    $electron.stopTcpServer();
  } else {
    $electron.stopSshServerConnection();
  }

  $router.push({
    name: "ServerSetting",
  });
}
</script>
