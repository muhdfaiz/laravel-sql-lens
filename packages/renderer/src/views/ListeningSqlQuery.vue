<template>
  <section id="query-list">
    <div class="p-grid">
      <div class="p-col p-mt-0 p-mb-0">
        <h4
          class="p-text-center p-mt-2"
          style="font-size: 0.9rem;"
        >
          Listening SQL query on local server {{ activeServer?.host }}:{{ activeServer?.port }}
        </h4>
      </div>
    </div>

    <div class="p-grid p-mb-3">
      <div class="p-col-12 p-px-3 p-d-flex p-flex-row p-ai-end p-jc-between">
        <div class="p-d-flex p-ai-center">
          <TotalQueryThresholdFilter class="p-mr-3" />
          <TotalQueryTimeThresholdFilter class="p-mr-3" />
          <SlowQueryThresholdFilter class="p-mr-3" />
        </div>
        <div>
          <ClearDataButton class="p-mr-2" />
          <StopListeningButton v-if="sqlQueryGroups.length > 0" />
        </div>
      </div>
    </div>
    <div class="p-grid">
      <div class="p-col-12 p-px-3">
        <QueryList v-show="sqlQueryGroups.length > 0" />
        <div
          v-show="sqlQueryGroups.length <= 0"
          class="listening-data"
        >
          <ProgressSpinner />
          <div
            class="p-mt-4 p-text-center"
            style="font-size: 0.9rem;"
          >
            No Data Received. You can start executing sql query from your
            application.
          </div>
          <StopListeningButton
            v-if="sqlQueryGroups.length <= 0"
            class="p-mt-3"
          />
        </div>
      </div>
    </div>
    <ExplainResultModal />
  </section>
</template>

<script lang="ts" setup>
import type { ComputedRef} from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { getModule } from "vuex-module-decorators";
import type { ServerModel } from "../database/server-model";
import ProgressSpinner from "primevue/progressspinner";
import ClearDataButton from "../components/listening-sql-query/ClearDataButton.vue";
import StopListeningButton from "../components/listening-sql-query/StopListeningButton.vue";
import SlowQueryThresholdFilter from "../components/listening-sql-query/SlowQueryThresholdFilter.vue";
import TotalQueryTimeThresholdFilter from "../components/listening-sql-query/TotalQueryTimeThresholdFilter.vue";
import TotalQueryThresholdFilter from "../components/listening-sql-query/TotalQueryThresholdFilter.vue";
import ListeningSqlQueryModule from "../store/modules/ListeningSqlQueryModule";
import ServerSettingModule from "../store/modules/ServerSettingModule";
import QueryList from "../components/listening-sql-query/QueryList.vue";
import ExplainResultModal from "../components/listening-sql-query/ExplainResultModal.vue";
import type { UrlModel } from "../database/url-model";

// Vuex modules.
const $store = useStore();
const serverSettingModule = getModule(ServerSettingModule, $store);
const listeningSqlQueryModule = getModule(ListeningSqlQueryModule, $store);

const sqlQueryGroups: ComputedRef<UrlModel[]> = computed(() => {
  return listeningSqlQueryModule.sqlQueryGroups;
});

const activeServer: ComputedRef<ServerModel> = computed(() => {
  return serverSettingModule.activeServer;
});
</script>

<style lang="scss">

</style>
