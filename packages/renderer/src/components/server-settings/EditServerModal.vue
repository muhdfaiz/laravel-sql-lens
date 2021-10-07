<template>
  <div
    v-if="showEditServerModal"
    class="dialog-overlay"
  />
  <Dialog
    v-model:visible="showEditServerModal"
    :style="{width: '47vw'}"
  >
    <template #header>
      <div class="p-d-flex p-ai-center">
        <font-awesome-icon
          :icon="['fas', 'server']"
          size="lg"
        />
        <h4 class="p-ml-3">
          Edit Server
        </h4>
      </div>
    </template>

    <div class="card p-text-center p-m-3">
      <div class="p-fluid">
        <div class="p-field p-grid">
          <label
            for="host"
            class="p-col-4"
          >
            <span>Name</span>
          </label>
          <div class="p-col-8 p-text-left">
            <div class="p-d-inline-flex p-flex-row p-ai-center w-100">
              <InputText
                id="name"
                v-model="name"
                type="text"
              />
            </div>
            <div
              v-if="v$.name && v$.name.$error"
              class="p-error p-mt-1"
            >
              {{ displayVuelidateError(v$.name.$errors) }}
            </div>
          </div>
        </div>
        <div class="p-field p-grid">
          <label
            for="host"
            class="p-col-4"
          >
            <span>Host</span>
          </label>
          <div class="p-col-8 p-text-left">
            <div class="p-d-inline-flex p-flex-row p-ai-center w-100">
              <InputText
                id="host"
                v-model="host"
                type="text"
              />
              <i
                v-tooltip="
                  'The server host must same with the server host in the tail-db config inside Laravel application.'
                "
                class="p-ml-2 pi pi-info-circle"
                style="font-size: 16px"
              />
            </div>
            <div
              v-if="v$.host.$error"
              class="p-error p-mt-1"
            >
              {{ displayVuelidateError(v$.host.$errors) }}
            </div>
          </div>
        </div>
        <div class="p-field p-grid">
          <label
            for="port"
            class="p-col-4"
          >Port</label>
          <div class="p-col-8 p-text-left">
            <div class="p-d-inline-flex p-flex-row p-ai-center w-100">
              <InputNumber
                id="port"
                v-model="port"
                :use-grouping="false"
                type="text"
              />
              <i
                v-tooltip="
                  ' The server port must same with the server post in the tail-db config inside Laravel application.'
                "
                class="p-ml-2 pi pi-info-circle"
                style="font-size: 16px"
              />
            </div>

            <div
              v-if="v$.port.$error"
              class="p-error p-mt-1"
            >
              {{ displayVuelidateError(v$.port.$errors) }}
            </div>
          </div>
        </div>

        <div class="p-field p-grid">
          <label
            for="overSSH"
            class="p-col-4"
          >Over SSH</label>
          <div class="p-col-8 p-text-left">
            <InputSwitch v-model="overSSH" />
          </div>
        </div>

        <template v-if="overSSH">
          <div class="p-field p-grid">
            <label
              for="port"
              class="p-col-4"
            >SSH Server</label>
            <div class="p-col-8 p-text-left">
              <div class="p-d-inline-flex p-flex-row p-ai-center w-100">
                <InputText
                  id="ssh-server"
                  v-model="sshServer"
                  type="text"
                />
              </div>

              <div
                v-if="v$.sshServer.$error"
                class="p-error p-mt-1"
              >
                {{ displayVuelidateError(v$.sshServer.$errors) }}
              </div>
            </div>
          </div>

          <div class="p-field p-grid">
            <label
              for="port"
              class="p-col-4"
            >SSH Port</label>
            <div class="p-col-8 p-text-left">
              <div class="p-d-inline-flex p-flex-row p-ai-center w-100">
                <InputNumber
                  id="ssh-port"
                  v-model="sshPort"
                  :use-grouping="false"
                  type="text"
                />
              </div>

              <div
                v-if="v$.sshPort.$error"
                class="p-error p-mt-1"
              >
                {{ displayVuelidateError(v$.sshPort.$errors) }}
              </div>
            </div>
          </div>

          <div class="p-field p-grid">
            <label
              for="port"
              class="p-col-4"
            >SSH User</label>
            <div class="p-col-8 p-text-left">
              <div class="p-d-inline-flex p-flex-row p-ai-center w-100">
                <InputText
                  id="ssh-server"
                  v-model="sshUser"
                  type="text"
                />
              </div>

              <div
                v-if="v$.sshUser.$error"
                class="p-error p-mt-1"
              >
                {{ displayVuelidateError(v$.sshUser.$errors) }}
              </div>
            </div>
          </div>

          <div class="p-field p-grid">
            <div class="p-col-8 p-offset-4 p-text-left">
              <SelectButton
                v-model="selectedSshOption"
                :options="sshOptions"
              />
            </div>
          </div>

          <div
            class="p-fluid"
          >
            <div
              v-if="selectedSshOption === 'Password'"
              class="p-field p-grid"
            >
              <label
                for="host"
                class="p-col-4"
              >
                <span>SSH Password</span>
              </label>
              <div class="p-col-8 p-text-left">
                <Password
                  v-model="sshPassword"
                  :feedback="false"
                  :toggle-mask="true"
                />

                <div
                  v-if="v$.sshPassword.$error"
                  class="p-error p-mt-1"
                >
                  {{ displayVuelidateError(v$.sshPassword.$errors) }}
                </div>
              </div>
            </div>

            <div
              v-if="selectedSshOption === 'Private Key'"
              class="p-fluid"
            >
              <div class="p-field p-grid">
                <label
                  for="host"
                  class="p-col-4"
                >
                  <span class="p-text-left">SSH Private Key</span>
                </label>
                <div class="p-col-8 p-text-left">
                  <div class="p-d-flex p-flex-row">
                    <InputText
                      id="private-key"
                      v-model="sshPrivateKey"
                      type="text"
                    />
                    <Button
                      id="select-private-key"
                      style="width: 100px;"
                      label="Select"
                      @click="selectSshPrivateKey"
                    />
                  </div>
                  <div
                    v-if="v$.sshPrivateKey.$error"
                    class="p-error p-mt-1"
                  >
                    {{ displayVuelidateError(v$.sshPrivateKey.$errors) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <template #footer>
      <div class="p-d-flex p-ai-center p-jc-end">
        <Button
          v-if="overSSH"
          @click="testSshConnection"
        >
          <ProgressSpinner
            v-if="testingSshStatus"
            stroke-width="4"
            class="p-mr-2"
          />
          <font-awesome-icon
            :icon="['fas', 'plug']"
            size="lg"
          />
          <div class="p-ml-2">
            Test
          </div>
        </Button>

        <Button
          @click="updateServer"
        >
          <font-awesome-icon
            :icon="['fas', 'save']"
            size="lg"
          />
          <div class="p-ml-2">
            Save
          </div>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type { WritableComputedRef } from "vue";
import { inject, ref, computed, defineProps, onMounted, watchEffect } from "vue";
import { getModule } from "vuex-module-decorators";
import ServerSettingModule from "../../store/modules/ServerSettingModule";
import { useStore } from "vuex";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import SelectButton from "primevue/selectbutton";
import ProgressSpinner from "primevue/progressspinner";
import Password from "primevue/password";
import { useToast } from "primevue/usetoast";
import useVuelidate from "@vuelidate/core";
import { helpers, required, numeric } from "@vuelidate/validators";
import { useElectron } from "/@/use/electron";
import type { ISshConnectionResult } from "../../../types/ssh-connection";
import { TestSshEvent } from "../../../enums/ssh";
import type { Database } from "/@/database/database";
import type { ServerModel } from "/@/database/server-model";
import { displayVuelidateError } from "../../helper/helper";

// Props
const props = defineProps<{
  serverId: number | undefined,
}>();

// Vuex module
const $store = useStore();
const serverSettingModule = getModule(ServerSettingModule, $store);

const showEditServerModal: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return serverSettingModule.showEditServerModal;
  },
  set(displayModal: boolean): void {
    serverSettingModule.setShowEditServerModal(displayModal);
  },
});

// Toast
const $toast = useToast();

// Data
const testingSshStatus = ref(false);
const overSSH = ref(false);
const sshOptions = ref([
  "Password",
  "Private Key",
]);

// Database
let db: Database | undefined = inject("db");

// Form submitted.
const submitted = ref(false);

// Form Data
let oldName = ref("");
let name = ref("");
let host = ref("127.0.0.1");
let port = ref<number>(9003);
let sshServer = ref("");
let sshPort = ref<number>(22);
let sshUser = ref("");
let sshPassword = ref("");
let sshPrivateKey = ref("");
let selectedSshOption = ref("Password");

// Vuelidate
const rules = computed(() => {
  const localRules = {
    name: { required: helpers.withMessage("Name is required.", required) },
    host: { required: helpers.withMessage("Host is required.", required) },
    port: {required: helpers.withMessage("Port is required.", required), numeric: helpers.withMessage("Port must be a number.", numeric)},
    sshServer: {},
    sshPort: {},
    sshUser: {},
    sshPassword: {},
    sshPrivateKey: {},
  };

  if (overSSH.value) {
    localRules.sshServer = { required: helpers.withMessage("SSH server is required.", required) };
    localRules.sshPort = { required: helpers.withMessage("SSH port is required.", required), numeric: helpers.withMessage("SSH port must be a number.", numeric) };
    localRules.sshUser = { required: helpers.withMessage("SSH user is required.", required) };

    if (selectedSshOption.value === "Password") {
      localRules.sshPassword = { required: helpers.withMessage("SSH password is required.", required) };
    }

    if (selectedSshOption.value === "Private Key") {
      localRules.sshPrivateKey = { required: helpers.withMessage("SSH private key is required.", required) };
    }
  }
  return localRules;
});

const v$ = useVuelidate(rules, {name, host, port, sshServer, sshPort, sshUser, sshPassword, sshPrivateKey});

const $electron = useElectron();

/**
 * Select ssh private key.
 */
const selectSshPrivateKey = () => {
  $electron.addListener("selected-ssh-private-key", onSelectedPrivateKey);

  $electron.selectSshPrivateKey();
};

/**
 * Test SSH connection.
 */
const testSshConnection = async () => {
  $electron.addListener("test-ssh-connection-result", onReceivedTestSshConnectionResult);

  testingSshStatus.value = true;
  submitted.value = true;

  const validationResult = await v$.value.$validate();

  // Check validation pass or fail.
  if (!validationResult) {
      testingSshStatus.value = false;
      return;
  }

  const sshConnectionInfo = {
    sshServer: sshServer.value,
    sshPort: sshPort.value,
    sshUser: sshUser.value,
    selectedSshOption: selectedSshOption.value,
    sshPassword: sshPassword.value,
    sshPrivateKey: sshPrivateKey.value,
    type: TestSshEvent.UpdateServer,
  };

  $electron.testSshConnection(sshConnectionInfo);
};

/**
 * Store new server in storage.
 */
const updateServer = async () => {
  submitted.value = true;
  const validationResult = await v$.value.$validate();

  // Check validation pass or fail.
  if (!validationResult) {
      return;
  }

  // Server inputs.
  const server = {
    name: name.value,
    host: host.value,
    port: port.value,
    overSSH: overSSH.value,
    sshServer: sshServer.value,
    sshPort: sshPort.value,
    sshUser: sshUser.value,
    sshPassword: sshPassword.value,
    sshPrivateKey: sshPrivateKey.value,
  };

  // Update server in database.
  db?.servers.update(props.serverId as number, server).then(() => {
    $toast.add({
      severity: "success",
      summary: "Success",
      detail: "Successfully updated server.",
      life: 2000,
    });

    // Update server list data to reflect latest change.
    db?.servers.toArray((serverList: ServerModel[]) => {
        serverSettingModule.setServerList(serverList);
    });

    // Close edit server modal.
    showEditServerModal.value = false;
  }).catch(() => {
    $toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to update server.",
      life: 2000,
    });
  });
};

/**
 * Event trigger when selected private key. Need to set the private key path.
 */
const onSelectedPrivateKey = (event: Event, data: {canceled: boolean, filePaths: string[]}) => {
  if (data.filePaths.length > 0) {
    sshPrivateKey.value = data.filePaths[0] as string;
  }

  $electron.removeListener("selected-ssh-private-key");
};

/**
 * Test ssh connection result.
 */
const onReceivedTestSshConnectionResult = (event: Event, result: ISshConnectionResult) => {
    if (result.type !== TestSshEvent.UpdateServer) {
      return;
    }

    if (!result.result) {
      let errorMessage = "SSH connection failed.";

      if (result.message) {
        errorMessage = result.message;
      }

      $toast.add({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 2000,
      });

      testingSshStatus.value = false;
      $electron.removeListener("test-ssh-connection-result");

      return;
    }

    $toast.add({
      severity: "success",
      summary: "Success",
      detail: "SSH connection success.",
      life: 2000,
    });

    testingSshStatus.value = false;

    $electron.removeListener("test-ssh-connection-result");
};

/**
 * Watch serverId prop change. Need to retrieve the server info need to edit.
 */
onMounted(() => {
  if (props.serverId === undefined) {
    return;
  }

  db?.servers.get(props.serverId)
    .then((result: ServerModel | undefined) => {
      if (result === undefined) {
        return;
      }

      oldName.value = result.name as string;
      name.value = result?.name as string;
      host.value = result?.host as string;
      port.value = result?.port as number;
      overSSH.value = result?.overSSH as boolean;
      sshUser.value = result?.sshUser as string;
      sshPort.value = result?.sshPort as number;
      sshServer.value = result?.sshServer as string;
      sshPassword.value = result?.sshPassword as string;
      sshPrivateKey.value = result?.sshPrivateKey as string;

      if (sshPassword.value) {
        selectedSshOption.value = "Password";
      } else {
        selectedSshOption.value = "Private Key";
      }
    });
});

/**
 * Watch selectedSshOption change. Need to empty ssh password input or ssh private key.
 */
watchEffect(() => {
  if (selectedSshOption.value === "Password") {
    sshPrivateKey.value = "";
  } else {
    sshPassword.value = "";
  }
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
