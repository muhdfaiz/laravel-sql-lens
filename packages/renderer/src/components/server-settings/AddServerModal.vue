<template>
  <div
    v-if="showAddServerModal"
    class="dialog-overlay"
  />
  <Dialog
    v-model:visible="showAddServerModal"
    :style="{width: '47vw'}"
  >
    <template #header>
      <div class="p-d-flex p-ai-center">
        <font-awesome-icon
          :icon="['fas', 'server']"
          size="lg"
        />
        <h4 class="p-ml-3">
          Add New Server
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
              v-if="v$.name.$error"
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
          @click="storeNewServer"
        >
          <font-awesome-icon
            :icon="['fas', 'save']"
            size="lg"
          />
          <div class="p-ml-2">
            Add New Server
          </div>
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type { WritableComputedRef } from "vue";
import { inject, ref, computed, watchEffect } from "vue";
import { getModule } from "vuex-module-decorators";
import ServerSettingModule from "../../store/modules/ServerSettingModule";
import { useStore } from "vuex";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import SelectButton from "primevue/selectbutton";
import Password from "primevue/password";
import { useToast } from "primevue/usetoast";
import useVuelidate from "@vuelidate/core";
import { helpers, required, numeric } from "@vuelidate/validators";
import { useElectron } from "../../use/electron";
import { TestSshEvent } from "../../../enums/ssh";
import ProgressSpinner from "primevue/progressspinner";
import type { ISshConnectionResult} from "../../../types/ssh-connection";
import type { Database } from "../../database/database";
import type { ServerModel } from "../../database/server-model";
import { displayVuelidateError } from "/@/helper/helper";

// Vuex module
const $store = useStore();
const serverSettingModule = getModule(ServerSettingModule, $store);

// Toast
const $toast = useToast();

// Electron
const $electron = useElectron();

// Data
const testingSshStatus = ref(false);
const overSSH = ref(false);
const sshOptions = ref([
  "Password",
  "Private Key",
]);
const submitted = ref(false);

const showAddServerModal: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return serverSettingModule.showAddServerModal;
  },
  set(displayModal: boolean): void {
    serverSettingModule.setShowAddServerModal(displayModal);
  },
});

// Database
let db: Database | undefined = inject("db");

// Form Data
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
    type: TestSshEvent.CreateServer,
  };

  $electron.testSshConnection(sshConnectionInfo);
};

/**
 * Reset add new server data.
 */
const resetAddNewServerData = () => {
  // Reset form data.
  submitted.value = false;
  name.value = "";
  host.value = "127.0.0.1";
  port.value = 9003;
  overSSH.value = false;
  sshPort.value = 22;
  sshUser.value = "";
  selectedSshOption.value = "Password";
  sshPassword.value = "";
  sshPrivateKey.value = "";
};

/**
 * Store new server in storage.
 */
const storeNewServer = async () => {
  submitted.value = true;
  const validationResult = await v$.value.$validate();

  // Check validation pass or fail.
  if (!validationResult) {
      return;
  }

  // Check if the server name already exist in storage.
  const serverAlreadyExist = await db?.servers.where({name: name.value}).first();

  // Display an error if already exist.
  if (serverAlreadyExist) {
    $toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to add new server. Server with name " + name.value + " already exist",
      life: 2000,
    });
    return;
  }

  // Server inputs.
  const newServer = {
    name: name.value,
    host: host.value,
    port: port.value ?? 22,
    overSSH: overSSH.value,
    sshServer: sshServer.value,
    sshPort: sshPort.value,
    sshUser: sshUser.value,
    sshPassword: sshPassword.value,
    sshPrivateKey: sshPrivateKey.value,
  };

  // Store new server in database.
  db?.servers.add(newServer).then(() => {
    $toast.add({
      severity: "success",
      summary: "Success",
      detail: "Successfully created new server.",
      life: 2000,
    });

    // Update list of server list.
    db?.servers.toArray((serverList: ServerModel[]) => {
      serverSettingModule.setServerList(serverList);
    });

    // Reset form data to add new server.
    resetAddNewServerData();

    // Close add new server modal.
    serverSettingModule.setShowAddServerModal(false);

  }).catch(() => {
    $toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to add new server.",
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
  if (result.type !== TestSshEvent.CreateServer) {
    return;
  }

  if (!result.result) {
    $toast.add({
      severity: "error",
      summary: "Error",
      detail: "SSH connection failed.",
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
