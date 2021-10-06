<template>
  <div>
    <div class="p-d-flex p-ai-center p-mb-2">
      <span>Slow Query Threshold</span>
      <i
        v-tooltip="
          'App will highlight as an issue if the query time more than the threshold.'
        "
        class="p-ml-2 pi pi-info-circle"
        style="font-size: 1.2rem"
      />
    </div>
    <div>
      <InputNumber
        v-model="slowQueryThreshold"
        class="slow-query-threshold"
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

const slowQueryThreshold: WritableComputedRef<number> = computed({
  get(): number {
    return listeningSqlQueryModule.slowQueryThreshold;
  },
  set(slowQueryThreshold: number): void {
    listeningSqlQueryModule.setSlowQueryThreshold(slowQueryThreshold);
  },
});
</script>
