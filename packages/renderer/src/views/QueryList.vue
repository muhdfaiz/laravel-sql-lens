<template>
  <div class="container-fluid h-100">
    <div class="row mt-4 mb-4">
      <div class="col-12">
        <h5 class="text-center">
          Listening SQL query on {{ serverHost }}:{{ serverPort }}
        </h5>
      </div>
    </div>
    <div class="row">
      <div class="col-6 col-md-4">
        <div class="mb-3 ps-3">
          <label for="exampleFormControlInput1" class="form-label">
            <div class="d-flex align-items-center">
              <span>SQL Query Filter</span>
              <i class="ms-2 pi pi-info-circle" v-tooltip="'Display only query contain the keywords. Press enter after finish typing the keyword.'" style="font-size: 16px;">
              </i>
            </div>
          </label>
          <div>
            <Chips style="width: 100%" :addOnBlur="true" v-model="queryFilter" />
          </div>
        </div>
      </div>
      <div class="col">
        <div class="mb-3 ps-3">
          <label for="exampleFormControlInput1" class="form-label">
            <div class="d-flex align-items-center">
              <span>Time Filter</span>
              <i class="ms-2 pi pi-info-circle" v-tooltip="'Display only query time more than the time has been set here.'" style="font-size: 16px;">
              </i>
            </div>
          </label>
          <div>
            <InputNumber id="change-font-size"
              v-model="timeFilter" 
              showButtons 
              :step="0.1"
              suffix="ms"
            />
          </div>
        </div>
      </div>
      <div class="col">
        <div class="mb-3 ps-3">
          <label for="exampleFormControlInput1" class="form-label">
            <div class="d-flex align-items-center">
              <span>Slow Query Time</span>
              <i class="ms-2 pi pi-info-circle" v-tooltip="'App will highlight the query time in red color if the query time more than the value you set.'" style="font-size: 16px;">
              </i>
            </div>
          </label>
          <div>
            <InputNumber id="change-font-size"
              v-model="slowQueryTime" 
              showButtons 
              :step="0.1"
              suffix="ms"
            />
          </div>
        </div>
      </div>
      <div class="col">
        <div class="mb-3 px-3">
          <label for="exampleFormControlInput1" class="form-label">
            <div class="d-flex align-items-center">
              <span>Font Size</span>
              <i class="ms-2 pi pi-info-circle" v-tooltip="'Increase or decrease font size for sql query information.'" style="font-size: 16px;">
              </i>
            </div>
          </label>
          <div>
            <InputNumber id="change-font-size"
              v-model="fontSize" 
              showButtons 
              :step="1"
              suffix="px"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div
          class="btn btn-info ms-3"
          @click="clearAllData()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash me-1"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path
              fill-rule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>
          <span>Clear All Data</span>
        </div>
      </div>
    </div>

    <div class="row mt-4 h-100">
      <div
        v-if="sqlQueries <= 0"
        class="col-12"
      >
        <div
          class="d-flex flex-column align-items-center justify-content-center"
          style="height: 100%"
        >
          <img
            style="width: 100px;"
            src="/assets/images/empty.png"
          >
          <div class="mt-4">
            No data received. You can start executing sql query from your application.
          </div>
        </div>
      </div>
      <div
        v-if="sqlQueries.length > 0"
        class="col-12"
      >
        <div
          v-for="(query, index) in sqlQueries"
          :key="index"
          class="position-relative px-3"
        >
          <div
            class="mb-2"
            style="font-size: 12px"
          >
            Query {{ totalQueries - index }}
          </div>
          <div
            class="d-flex align-items-center mb-2"
            style="color: #bcbcbc"
          >
            <div
              :style="{ fontSize: fontSize + 'px' }"
            >
              <span class="fw-bold">Connection:</span> {{ query.connection }}
            </div>
            <div
              class="ms-2"
              :style="{ fontSize: fontSize + 'px' }"
            >
              <span class="fw-bold">Database:</span> {{ query.database }}
            </div>
            <div class="d-flex align-items-center ms-2" :style="{ fontSize: fontSize + 'px' }">
              <div class="fw-bold">Time:</div>
              <Tag v-if="(slowQueryTime && parseFloat(query.time) <= slowQueryTime) || !slowQueryTime" class="ms-2 p-mr-2"  :style="{ fontSize: fontSize + 'px' }" severity="success" :value="query.time + 'ms'"></Tag> 
              <Tag v-else-if="slowQueryTime" class="ms-2 p-mr-2" :style="{ fontSize: fontSize + 'px' }" severity="danger" :value="query.time + 'ms'"></Tag> 
            </div>
          </div>

          <div
            class="d-flex mb-2"
            style="color: #bcbcbc"
          >
            <div
              :style="{ fontSize: fontSize + 'px' }"
            >
              <span class="fw-bold">Location:</span> {{ query.file }}:{{ query.line }}
            </div>
          </div>

          <div
            class="d-flex mb-2"
            style="color: #bcbcbc"
          >
            <div
              :style="{ fontSize: fontSize + 'px' }"
            >
              <span class="fw-bold">URL:</span> {{ query.url }}
            </div>
          </div>

          <div class="position-relative">
            <button
              v-if="query.explain_result !== undefined && query.explain_result.length > 0"
              class="show-explain-result btn btn-outline-info btn-sm"
              @click="displayExplainResultModal(query)"
            >
              View Explain Result
            </button>
            <button
              class="copy-btn btn btn-outline-info btn-sm"
              @click="copyToClipboard(query.sql)"
            >
              Copy
            </button>
            <highlightJs
              :style="{ fontSize: fontSize + 'px' }"
              language="sql"
              :code="query.sql"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Toast position="bottom-right" />
  <Dialog
    v-model:visible="showExplainResultModal"
    :breakpoints="{'960px': '75vw', '640px': '100vw'}"
    :style="{width: '90vw'}"
    header="Explain Result"
  >
    <div
      id="explain-result-table"
      class="table-responsive"
    >
      <table class="table table-bordered table-dark">
        <thead>
          <tr>
            <th
              v-for="(header, key) in explainResultTableHeaders"
              :key="key"
            >
              {{ header.toUpperCase() }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(rows, key) in explainResultTableData"
            :key="key"
          >
            <td
              v-for="(data, key) in rows"
              :key="key"
            >
              {{ data }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template #footer>
      <button
        class="btn btn-info"
        @click="sqlQueryIndex = null; showExplainResultModal = false;"
      >
        Close
      </button>
    </template>
  </Dialog>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, toRefs, nextTick} from 'vue';
import { useStore } from 'vuex';
import { format } from 'sql-formatter';
import { toClipboard } from '@soerenmartius/vue3-clipboard';
import hljs from 'highlight.js/lib/core';
import sql from 'highlight.js/lib/languages/sql';
import 'highlight.js/scss/monokai.scss';
import hljsVuePlugin from '@highlightjs/vue-plugin';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Tag from 'primevue/tag';
import Chips from 'primevue/chips';

hljs.registerLanguage('sql', sql);

export default defineComponent({
  name: 'QueryList',
  components: {
    highlightJs: hljsVuePlugin.component,
    Toast,
    Dialog,
    InputNumber,
    Tag,
    Chips
  },
  setup() {
    const localState = reactive({
      showExplainResultModal: false,
      explainResultTableHeaders: [],
      explainResultTableData: [],
      sqlQueryIndex: null,
      fontSize: 11,
      queryFilter: [],
      slowQueryTime: null,
      timeFilter: null
    });

    const { state, commit } = useStore();

    const toast = useToast();

    /**
     * SQL queries state in Vuex
     *
     * @type {ComputedRef<string>}
     */
    const sqlQueries = computed(() => {
      return state.QueryList.sqlQueries;
    });

    /**
     * SQL queries state in Vuex
     *
     * @type {ComputedRef<string>}
     */
    const totalQueries = computed(() => {
      return state.QueryList.sqlQueries.length;
    });

    /**
     * Server host state in Vuex
     *
     * @type {ComputedRef<string>}
     */
    const serverHost = computed(() => {
      return state.Setting.serverHost;
    });

    /**
     * Server port state in Vuex
     *
     * @type {ComputedRef<string>}
     */
    const serverPort = computed(() => {
      return state.Setting.serverPort;
    });

    /**
     * Clear all existing queries data.
     */
    const clearAllData = () => {
        commit('QueryList/emptySqlQueries');
    };

    /**
     * Display explain result modal.
     */
    const displayExplainResultModal = (query: any) => {
      if (query.explain_result === undefined || query.explain_result.length <= 0) {
        return;
      }

      const explainResult = query.explain_result[0];

      const headers = Object.keys(explainResult);

      // Set table header.
      localState.explainResultTableHeaders = headers;

      query.explain_result.forEach((explainResult: any) => {
        console.log(Object.values(explainResult));

        localState.explainResultTableData.push(Object.values(explainResult));
      });

      localState.showExplainResultModal = true;
    };

    /**
     * Copy SQL query to clipboard.
     */
    const copyToClipboard = (sqlQuery: string) => {
      toClipboard(sqlQuery);

      toast.add({severity:'success', summary: 'Success', detail:'Successfully copied SQL query to clipboard', life: 3000});
    };

    /**
     * Listen for new sql query data received from ipcMain.
     */
    window.electron.newDataReceived('new-data-received', (event, data: string) => {
      let newSqlQueries = JSON.parse(data);

      let displayQuery = true;

      // Check if the query received does not contain the sql query filter keywords.
      if (localState.queryFilter.length > 0 && !localState.queryFilter.some(filterKeyword => newSqlQueries.sql.includes(filterKeyword))) {
        displayQuery = false;
      }

      // Check if the query time below than the time filter.
      if (localState.timeFilter && parseFloat(newSqlQueries.time) < localState.timeFilter) {
        displayQuery = false;
      }

      if (displayQuery) {
        newSqlQueries.sql = format(newSqlQueries.sql, { language: 'mysql' });

        commit('QueryList/pushNewSqlQueries', newSqlQueries);
      }
    });

    return {
      ...toRefs(localState),
      toClipboard,
      sqlQueries,
      totalQueries,
      serverHost,
      serverPort,
      toast,
      clearAllData,
      displayExplainResultModal,
      copyToClipboard,
    };
  },
});
</script>

<style>
  pre {
    background: #272823;
    padding: 1rem;
  }
  .p-inputtext, .p-inputnumber {
    width: 100%;
  }
</style>
