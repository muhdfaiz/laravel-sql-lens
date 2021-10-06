<template>
  <Button
    v-if="sqlQueryGroups.length > 0"
    class="p-button p-button-sm"
    @click="clearAllData()"
  >
    <font-awesome-icon
      :icon="['fas', 'trash-alt']"
      size="lg"
    />
    <span class="p-ml-2">Clear Data</span>
  </Button>
</template>

<script lang="ts" setup>
import type { ComputedRef } from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
import { getModule } from "vuex-module-decorators";
import ListeningSqlQueryModule from "../../store/modules/ListeningSqlQueryModule";
import Button from "primevue/button";
import type { UrlModel } from "/@/database/url-model";

const store = useStore();
const listeningSqlQueryModule = getModule(ListeningSqlQueryModule, store);

const sqlQueryGroups: ComputedRef<UrlModel[]> = computed(() => {
  return listeningSqlQueryModule.sqlQueryGroups;
});

/**
 * Stop monitoring SQL query from application.
 */
function clearAllData() {
  listeningSqlQueryModule.emptySqlQueryGroups();
}
</script>
