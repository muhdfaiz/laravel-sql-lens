<template>
  <div>
    <div class="p-d-flex p-ai-center p-mb-2">
      <span>Total Query Threshold</span>
      <i
        v-tooltip="
          'App will highlight as an issue if the total number of query per request exceed the threshold value.'
        "
        class="p-ml-2 pi pi-info-circle"
        style="font-size: 1.2rem"
      />
    </div>
    <div>
      <InputNumber
        v-model="totalQueryThreshold"
        class="total-query-threshold"
        show-buttons
        :step="1"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { WritableComputedRef } from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { getModule } from "vuex-module-decorators";
import ListeningSqlQueryModule from "../../store/modules/ListeningSqlQueryModule";
import InputNumber from "primevue/inputnumber";

// Vuex modules.
const $store = useStore();
const listeningSqlQueryModule = getModule(ListeningSqlQueryModule, $store);

const totalQueryThreshold: WritableComputedRef<number> = computed({
  get(): number {
    return listeningSqlQueryModule.totalQueryThreshold;
  },
  set(totalQueryThreshold: number): void {
    listeningSqlQueryModule.setTotalQueryThreshold(totalQueryThreshold);
  },
});
</script>
