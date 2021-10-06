<template>
  <div id="server-settings">
    <div class="p-grid">
      <div class="p-col p-text-center">
        <img
          class="p-mt-3 logo-text"
          src="/assets/images/logo-text.svg"
        >
      </div>
    </div>

    <div class="p-grid mt-2 p-jc-center">
      <div class="p-col-12 p-md-6">
        <h5 class="p-text-bolf p-my-1">
          Notes
        </h5>
        <ol class="notes">
          <li>
            This app only work when you install <a
              href="#"
              @click="openURLInBrowser('https://github.com/muhdfaiz/laravel-tail-db')"
            >Laravel Tail DB</a> package in your laravel/lumen application.
          </li>
          <li>
            You can view the documentation <a
              href="#"
              @click="openURLInBrowser('https://laravel-tail-db.muhdfaiz.com/')"
            >here</a> on how to install the package.
          </li>
        </ol>
      </div>
    </div>

    <div class="server-list p-grid p-jc-center">
      <div class="p-col-12 p-sm-6 p-md-6 p-text-center">
        <Fieldset legend="Server List">
          <div
            v-for="server in serverList"
            :key="server.id"
            class="server p-text-left"
          >
            <div class="p-d-flex p-flex-row p-jc-between p-ai-center">
              <div class="p-d-flex p-flex-column">
                <div class="p-d-flex p-flex-row p-ai-center p-mb-2">
                  <div class="server-name">
                    {{ server.name }}
                  </div>
                  <span
                    v-if="server.overSSH"
                    class="server-type ssh"
                  >SSH</span>
                  <span
                    v-else
                    class="server-type local"
                  >Local</span>
                </div>
                <div class="server-host">
                  {{ server.host }}:{{ server.port }}
                </div>
              </div>
              <div class="p-d-flex p-ai-center p-flex-row">
                <ProgressSpinner
                  v-if="testingSshStatus && activeServer.id === server.id"
                  stroke-width="4"
                  class="p-mr-2"
                />
                <div
                  v-tooltip.bottom="'Start monitoring'"
                  @click="startListeningSqlQueries(server)"
                >
                  <font-awesome-icon
                    :icon="['fas', 'play-circle']"
                    size="lg"
                    class="p-mr-3"
                  />
                </div>
                <div
                  v-tooltip.bottom="'Edit server'"
                  @click="displayEditServerModal(server.id)"
                >
                  <font-awesome-icon
                    :icon="['fas', 'edit']"
                    size="lg"
                    class="p-mr-3"
                  />
                </div>

                <div
                  v-tooltip.bottom="'Delete server'"
                  @click="deleteServer($event, server.id)"
                >
                  <font-awesome-icon
                    :icon="['fas', 'trash-alt']"
                    size="lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </Fieldset>
      </div>
    </div>

    <div class="p-grid p-mt-1 p-jc-center">
      <div class="p-col-12 p-sm-6 p-md-6 p-text-center">
        <Button
          label="Add New Server"
          class="button btn-info p-jc-center p-font-bold"
          style="width: 100%"
          @click="displayAddNewServerModal()"
        >
          Add New Server
        </Button>
      </div>
    </div>
    <AddServerModal v-if="showAddNewServerModal" />
    <EditServerModal
      v-if="showEditServerModal"
      :server-id="editServerId"
    />
    <ConfirmDialog />
    <div class="app-version">
      <b>Version {{ appVersion }}</b>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import type { Router } from "vue-router";
import { getModule } from "vuex-module-decorators";
import ServerSettingModule from "../store/modules/ServerSettingModule";
import { useStore } from "vuex";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import AddServerModal from "../components/server-settings/AddServerModal.vue";
import EditServerModal from "../components/server-settings/EditServerModal.vue";
import Button from "primevue/button";
import Fieldset from "primevue/fieldset";
import ConfirmDialog from "primevue/confirmdialog";
import ProgressSpinner from "primevue/progressspinner";
import { useElectron } from "../use/electron";
import type { Database } from "../database/database";
import type { ServerModel } from "../database/server-model";
import { TestSshEvent } from "../../enums/ssh";
import type { ISshConnectionResult } from "types/ssh-connection";

const appVersion = import.meta.env.PACKAGE_VERSION;
const $router: Router = useRouter();
const $confirm = useConfirm();
const $toast = useToast();
const $electron = useElectron();

// Vuex modules.
const $store = useStore();
const serverSettingModule = getModule(ServerSettingModule, $store);

let editServerId = ref<number | undefined>(undefined);

// Database
let db: Database | undefined = inject("db");

// Data
const testingSshStatus = ref(false);

// Server list in Vuex.
const serverList = computed(() => {
  return serverSettingModule.serverList;
});

const showEditServerModal = computed(() => {
  return serverSettingModule.showEditServerModal;
});

const showAddNewServerModal = computed(() => {
  return serverSettingModule.showAddServerModal;
});

const activeServer = computed(() => {
  return serverSettingModule.activeServer;
});

/**
 * Display modal to add a new server.
 */
const displayAddNewServerModal = () => {
  serverSettingModule.setShowAddServerModal(true);
};

/**
 * Display modal to edit a server.
 */
const displayEditServerModal = (serverId: number | undefined) => {
  if (serverId === undefined) {
    return;
  }

  editServerId.value = serverId;
  serverSettingModule.setShowEditServerModal(true);
};

/**
 * Delete server from storage.
 */
const deleteServer = (event: Event, id: number | undefined) => {
  if (id === undefined) {
    return;
  }

  $confirm.require({
    message: "Are you sure you want to delete?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      db?.servers.delete(id).then(() => {
        db?.servers.toArray((serverList: ServerModel[]) => {
          serverSettingModule.setServerList(serverList);
        });

        $toast.add({severity:"success", summary:"Success", detail:"Server has been successfully deleted.", life: 3000});
      });
    },
  });
};

/**
 * Open URL in browser.
 */
const openURLInBrowser = (url: string) => {
  $electron.openURLInBrowser(url);
};

/**
 * Start server
 */
const startListeningSqlQueries = async (server: ServerModel) => {
  serverSettingModule.setActiveServer(server);

  // Start local server if the server settings not using ssh.
  if (!server.overSSH) {
    $electron.startTcpServer(server.host as string, server.port as number);

    $router.push({
      name: "ListeningSqlQuery",
    });

    return;
  }

  testingSshStatus.value = true;
  $electron.addListener("test-ssh-connection-result", onReceivedTestSshConnectionResult);

  const sshConnectionInfo = {
    sshServer: server.sshServer,
    sshPort: server.sshPort,
    sshUser: server.sshUser,
    selectedSshOption: server.overSSH ? "Private Key" : "Password",
    sshPassword: server.sshPassword,
    sshPrivateKey: server.sshPrivateKey,
    type: TestSshEvent.StartServer,
  };

  $electron.testSshConnection(sshConnectionInfo);
};

/**
 * Test ssh connection result.
 */
const onReceivedTestSshConnectionResult = (event: Event, result: ISshConnectionResult) => {
    if (result.type !== TestSshEvent.StartServer) {
      return;
    }

    $electron.removeListener("test-ssh-connection-result");

    if (!result.result) {
      $toast.add({
        severity: "error",
        summary: "Error",
        detail: result.message,
        life: 2000,
      });

      testingSshStatus.value = false;
      return;
    }

    $electron.sshIntoServerAndListenSqlQueries({ ...activeServer.value });

    $router.push({
      name: "ListeningSqlQuery",
    });
};

// Trigger when the component loaded.
onMounted(() => {
  db?.servers.toArray((serverList: ServerModel[]) => {
      serverSettingModule.setServerList(serverList);
  });
});
</script>

<style>
@keyframes p-progress-spinner-color {
  100%,
  0% {
      stroke: #000;
  }
  40% {
      stroke: #000;
  }
  66% {
      stroke: #000;
  }
  80%,
  90% {
      stroke: #000;
  }
}
</style>
