<template>
  <div>
    <div class="p-d-flex p-ai-center p-mb-2">
      <span>Total Query Time Threshold</span>
      <i
        v-tooltip="
          'App will highlight as an issue if the total query time per request exceed the threshold value.'
        "
        class="p-ml-2 pi pi-info-circle"
        style="font-size: 1.2rem"
      />
    </div>
    <div>
      <InputNumber
        v-model="totalQueryTimeThreshold"
        class="total-query-time-threshold"
        mode="decimal"
        show-buttons
        :min-fraction-digits="2"
        :max-fraction-digits="2"
        :step="0.1"
        suffix="ms"
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

const totalQueryTimeThreshold: WritableComputedRef<number> = computed({
  get(): number {
    return listeningSqlQueryModule.totalQueryTimeThreshold;
  },
  set(totalQueryTimeThreshold: number): void {
    listeningSqlQueryModule.setTotalQueryTimeThreshold(totalQueryTimeThreshold);
  },
});
</script>
