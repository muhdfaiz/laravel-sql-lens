<template>
  <div
    v-if="showExplainResultModal"
    class="dialog-overlay"
  />
  <Dialog
    v-model:visible="showExplainResultModal"
    style="width: 95vw !important"
    header="Explain Result"
    @hide="closeModal()"
  >
    <div
      id="explain-result-table"
      class="table-responsive"
    >
      <table
        class="table table-bordered table-striped"
        style="background: #fff;"
      >
        <thead>
          <tr>
            <th
              v-for="(header, key) in explainResultTableHeaders"
              :key="key"
              style="font-weight: 600;"
            >
              {{ header.toUpperCase() }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(rows: any, index: number) in explainResultTableData"
            :key="index"
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
  </Dialog>
</template>

<script lang="ts" setup>
import type { WritableComputedRef, ComputedRef } from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { getModule } from "vuex-module-decorators";
import ListeningSqlQueryModule from "../../store/modules/ListeningSqlQueryModule";
import Dialog from "primevue/dialog";

// Vuex modules.
const $store = useStore();
const listeningSqlQueryModule = getModule(ListeningSqlQueryModule, $store);

const showExplainResultModal: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return listeningSqlQueryModule.showExplainResultModal;
  },
  set(displayModal: boolean): void {
    listeningSqlQueryModule.setShowExplainResultModal(displayModal);
  },
});

const explainResultTableHeaders: ComputedRef<string[]> = computed(() => {
  return listeningSqlQueryModule.explainResultTableHeaders;
});

const explainResultTableData: ComputedRef<[]> = computed(() => {
  return listeningSqlQueryModule.explainResultTableData;
});

const closeModal = () => {
  listeningSqlQueryModule.emptyExplainResultTableHeaders();
  listeningSqlQueryModule.emptyExplainResultTableData();
  listeningSqlQueryModule.setShowExplainResultModal(false);
};

</script>

