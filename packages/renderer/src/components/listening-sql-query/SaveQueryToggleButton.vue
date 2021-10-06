<template>
  <div class="p-ml-3">
    <div class="p-mb-2">
      Save Query
    </div>
    <InputSwitch v-model="saveQueryIntoStorage" />
  </div>
</template>

<script lang="ts" setup>
import type { WritableComputedRef } from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { getModule } from "vuex-module-decorators";
import ListeningSqlQueryModule from "../../store/modules/ListeningSqlQueryModule";
import InputSwitch from "primevue/inputswitch";

// Vuex modules.
const $store = useStore();
const listeningSqlQueryModule = getModule(ListeningSqlQueryModule, $store);

const saveQueryIntoStorage: WritableComputedRef<boolean> = computed({
  get(): boolean {
    return listeningSqlQueryModule.saveQueryIntoStorage;
  },
  set(saveQueryIntoStorage: boolean): void {
    listeningSqlQueryModule.setSaveDataIntoStorage(saveQueryIntoStorage);
  },
});
</script>
