<template>
  <Accordion>
    <AccordionTab
      v-for="(sqlQueryGroup, index) in sqlQueryGroups"
      :key="sqlQueryGroup.id"
    >
      <template #header>
        <div
          class="p-d-flex p-flex-column p-jc-between w-100"
        >
          <div
            class="p-d-flex p-flex-row p-ai-center p-mb-2"
          >
            <div style="overflow-wrap: break-word;">
              {{ sqlQueryGroups.length - index }}. {{ sqlQueryGroup.url }}
            </div>

            <Tag
              v-if="(sqlQueryGroup.issues as string[]).length > 0"
              v-tooltip="'Click to view the issue.'"
              class="p-ml-2 p-mr-2 font-weight-500"
              severity="danger"
              :value="sqlQueryGroup.issues?.length + ' issues'"
              @click.stop="toggleIssuesFound($event, index)"
            />
            <OverlayPanel :ref="(el: any) => { if (el) issueOverlay[index] = el }">
              <ul
                style="margin: 0; padding: 0 0 0 1rem"
              >
                <li
                  v-for="(issue, index2) in sqlQueryGroup.issues"
                  :key="index2"
                  style="font-size: 0.8rem"
                >
                  {{ issue }}
                </li>
              </ul>
            </OverlayPanel>
          </div>

          <div
            class="p-d-flex p-flex-row p-mr-2"
            style="font-size: 0.85rem; color: #c5c5c5"
          >
            <div class="p-mr-2">
              <span class="font-weight-400 p-mr-1">Total Query:</span>
              <span class="font-weight-400">{{ sqlQueryGroup.totalQueries }}</span>
            </div>
            <div class="p-mr-2">
              <span class="font-weight-400 p-mr-1">Total Query Time:</span>
              <span class="font-weight-400">{{ sqlQueryGroup.totalQueryTime?.toFixed(2) }}ms</span>
            </div>
            <div class="p-mr-2">
              <span class="font-weight-400 p-mr-1">Fastest Query:</span>
              <span class="font-weight-400">{{ sqlQueryGroup.fastestQueryTime }}ms</span>
            </div>
            <div>
              <span class="font-weight-400 p-mr-1">Slowest Query:</span>
              <span class="font-weight-400">{{ sqlQueryGroup.slowestQueryTime }}ms</span>
            </div>
          </div>
        </div>
      </template>

      <div
        v-for="(sqlQuery, index1) in sqlQueryGroup.sqlQueries"
        :key="index1"
        style="position: relative;"
      >
        <div
          class="p-mb-2 font-weight-600"
        >
          Query {{ index1 + 1 }}
        </div>
        <div
          class="p-d-flex p-ai-center p-mb-2"
          style="color: #bcbcbc"
        >
          <div>
            <span class="font-weight-500 p-mr-1">Connection:</span>
            <span class="font-weight-400">{{ sqlQuery.connection }}</span>
          </div>
          <div
            class="p-ml-2"
          >
            <span class="font-weight-500 p-mr-1">Database:</span>
            <span class="font-weight-400">{{ sqlQuery.database }}</span>
          </div>
          <div
            class="p-d-flex p-ai-center p-ml-2"
          >
            <div class="font-weight-500">
              Time:
            </div>
            <Tag
              v-if="
                (slowQueryThreshold && sqlQuery.time && sqlQuery.time <= slowQueryThreshold) ||
                  !slowQueryThreshold
              "
              class="query-time good p-ml-2 p-mr-2 font-weight-500"
              severity="success"
              style="background: #3e967c"
              :value="sqlQuery.time + 'ms'"
            />
            <Tag
              v-else
              class="p-ml-2 p-mr-2 font-weight-500"
              severity="danger"
              :value="sqlQuery.time + 'ms'"
            />
          </div>
        </div>

        <div
          class="d-flex mb-2"
          style="color: #bcbcbc"
        >
          <div>
            <span class="font-weight-500">Location:</span>
            <span class="font-weight-400">{{ sqlQuery.file }}:{{ sqlQuery.line }}</span>
          </div>
        </div>

        <div class="position-relative">
          <Button
            v-if="sqlQuery.explainResult !== undefined && sqlQuery.explainResult.length > 0"
            class="show-explain-result p-button p-button-sm"
            @click="displayExplainResultModal(sqlQuery)"
          >
            Explain Result
          </Button>
          <Button
            v-if="sqlQuery.sqlWithBindings !== undefined"
            class="copy-btn p-button p-button-sm"
            @click="copyToClipboard(sqlQuery.sqlWithBindings as string)"
          >
            Copy
          </Button>
        </div>
        <hljsVuePlugin.component
          v-if="sqlQuery.sqlWithBindings !== undefined "
          language="sql"
          :code="format(sqlQuery.sqlWithBindings)"
        />
      </div>
    </AccordionTab>
  </Accordion>
</template>


<script lang="ts" setup>
import type { ComputedRef } from "vue";
import { computed, onMounted, ref, onBeforeUpdate } from "vue";
import { format } from "sql-formatter";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import "highlight.js/scss/monokai.scss";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import OverlayPanel from "primevue/overlaypanel";
import Button from "primevue/button";
import Tag from "primevue/tag";
import type { MysqlExplainResult, SqlQuery, SqlQueryGroup } from "types/sql-query";
import { useToast } from "primevue/usetoast";
import { useElectron } from "../../use/electron";
import { useStore } from "vuex";
import { getModule } from "vuex-module-decorators";
import ListeningSqlQueryModule from "../../store/modules/ListeningSqlQueryModule";
// import type { Database } from "/@/database/database";
// import dayjs from "dayjs";
import type { UrlModel } from "/@/database/url-model";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
import type { SqlQueryModel } from "/@/database/sql-query-model";
import type { OverlayComponent } from "../../../types/primevue";

hljs.registerLanguage("sql", sql);

const $electron = useElectron();

// Database
// let db: Database | undefined = inject("db");

// Vuex modules.
const $store = useStore();
const listeningSqlQueryModule = getModule(ListeningSqlQueryModule, $store);

const sqlQueryGroups: ComputedRef<UrlModel[]> = computed(() => {
  return listeningSqlQueryModule.sqlQueryGroups;
});

const slowQueryThreshold: ComputedRef<number> = computed(() => {
  return listeningSqlQueryModule.slowQueryThreshold;
});

const totalQueryThreshold: ComputedRef<number> = computed(() => {
  return listeningSqlQueryModule.totalQueryThreshold;
});

const totalQueryTimeThreshold: ComputedRef<number> = computed(() => {
  return listeningSqlQueryModule.totalQueryTimeThreshold;
});

const issueOverlay = ref<OverlayComponent[]>([]);
const $toast = useToast();

/**
 * Copy SQL query to clipboard.
 */
const copyToClipboard = (sqlQuery: string) => {
  toClipboard(sqlQuery);

  $toast.add({
    severity: "success",
    summary: "Success",
    detail: "Successfully copied SQL query to clipboard",
    life: 3000,
  });
};

/**
 * Display explain result modal.
 */
const displayExplainResultModal = (query: SqlQueryModel) => {
  if (
    query.explainResult === undefined ||
    query.explainResult.length <= 0
  ) {
    return;
  }

  const firstExplainResult = query?.explainResult[0] as MysqlExplainResult;

  const headers = Object.keys(firstExplainResult);

  // Set table header.
  listeningSqlQueryModule.setExplainResultTableHeaders(headers);

  query.explainResult.forEach((explainResult: MysqlExplainResult) => {
    let explainResultData: (string|number|null)[] = Object.values(explainResult);

    listeningSqlQueryModule.pushNewExplainResultTableData(explainResultData);
  });

  listeningSqlQueryModule.setShowExplainResultModal(true);
};

/**
 * Display issue details for the queries.
 */
const toggleIssuesFound = (event: Event, overlayIndex: number) => {
    issueOverlay["value"]?.[overlayIndex]?.toggle(event);
};

/**
 * Store sql queries received.
 */
// const storeSqlQueries = (sqlQueryGroup: SqlQueryGroup, fastestQueryTime: number, slowestQueryTime: number,
//   totalQueryTime: number, averageQueryTime: number, containN1Issue: boolean) => {

//   const inputs = {
//     url: sqlQueryGroup.url,
//     totalQueries: sqlQueryGroup.queries.length,
//     containN1Issue: containN1Issue,
//     fastestQueryTime: fastestQueryTime,
//     slowestQueryTime: slowestQueryTime,
//     averageQueryTime: averageQueryTime,
//     totalQueryTime: totalQueryTime,
//     createdAt: new Date().toString(),
//   };

//   // Store new url in database.
//   db?.urls.add(inputs).then((id: number) => {
//     sqlQueryGroup.queries.forEach((sqlQuery: SqlQuery) => {
//       const inputs = {
//         urlId: id,
//         connection: sqlQuery.connection,
//         driver: sqlQuery.driver,
//         database: sqlQuery.database,
//         bindings: sqlQuery.bindings,
//         sqlWithoutBindings: sqlQuery.sqlWithoutBindings,
//         sqlWithBindings: sqlQuery.sqlWithBindings,
//         time: sqlQuery.time,
//         file: sqlQuery.file,
//         line: sqlQuery.line,
//         explainResult: sqlQuery.explainResult,
//         createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
//       };

//       db?.sqlQueries.add(inputs);
//     });
//   });
// };

/**
 * Check if query contain n1 issue.
 */
const checkIfQueryGroupContainN1Issue = (sqlQueries: SqlQuery[]) => {
  const sqlQueriesWithoutBindings = sqlQueries.map((sqlQuery => sqlQuery.sqlWithoutBindings));

  const uniqueSqlQueries = new Set(sqlQueriesWithoutBindings);

  // Compare total unique sql queries with not unique one.
  // If not equal then the sql queries contain n1 issue.
  if ([...uniqueSqlQueries].length < sqlQueriesWithoutBindings.length) {
    return true;
  }

  return false;
};

/**
 * Check if total query time per request exceed the threshold.
 */
const checkIfTotalQueryTimeExceedThreshold = (sqlQueries: SqlQuery[]) => {
  const totalQueryTime = sqlQueries.reduce((totalQueryTime: number, sqlQuery: SqlQuery) => {
    return totalQueryTime + sqlQuery.time;
  }, 0);

  if (totalQueryTime > totalQueryTimeThreshold.value) {
    return {
      totalQueryTime: totalQueryTime,
      exceedThreshold: true,
    };
  } else {
    return {
      totalQueryTime: totalQueryTime,
      exceedThreshold: false,
    };
  }
};

/**
 * Listen for new sql query data received from ipcMain.
 */
const onReceivedNewSqlQueryGroup = (event: Event, sqlQueryGroup: SqlQueryGroup) => {
  const sqlQueriesTime = sqlQueryGroup.queries.map((sqlQuery) => { return sqlQuery.time; });
  const fastestQueryTime = Math.min.apply(Math, sqlQueriesTime);
  const slowestQueryTime = Math.max.apply(Math, sqlQueriesTime);
  const containN1Issue = checkIfQueryGroupContainN1Issue(sqlQueryGroup.queries);
  const {totalQueryTime, exceedThreshold} = checkIfTotalQueryTimeExceedThreshold(sqlQueryGroup.queries);
  const averageQueryTime = totalQueryTime / sqlQueryGroup.queries.length;

  //storeSqlQueries(sqlQueryGroup, fastestQueryTime, slowestQueryTime, totalQueryTime, averageQueryTime, containN1Issue);

  const newSqlQueries: UrlModel = {
    url: sqlQueryGroup.url,
    totalQueries: sqlQueryGroup.queries.length,
    totalQueryTime: totalQueryTime,
    totalQueryTimeExceedThreshold: exceedThreshold,
    fastestQueryTime: fastestQueryTime,
    slowestQueryTime: slowestQueryTime,
    averageQueryTime: averageQueryTime,
    containN1Issue: containN1Issue,
    sqlQueries: sqlQueryGroup.queries,
    issues: [],
  };

  if (exceedThreshold) {
    newSqlQueries.issues?.push(`Total query time ${totalQueryTime.toFixed(2)}ms exceed the threshold value ${totalQueryTimeThreshold.value}.`);
  }

  if (slowestQueryTime > slowQueryThreshold.value) {
    newSqlQueries.issues?.push(`One or more query exceed the slow query threshold value ${slowQueryThreshold.value}ms.`);
  }

  if (containN1Issue) {
    newSqlQueries.issues?.push("Contain n+1 or duplicate issue.");
  }

  if (sqlQueryGroup.queries.length > totalQueryThreshold.value) {
    newSqlQueries.issues?.push(`Total number of query per request ${sqlQueryGroup.queries.length} exceed the the threshold value ${totalQueryThreshold.value}`);
  }

  listeningSqlQueryModule.pushNewSqlQueries(newSqlQueries);

  $electron.removeListener("new-sql-query-group-received");
  $electron.addListener("new-sql-query-group-received", onReceivedNewSqlQueryGroup);
};

// make sure to reset the refs before each update
onBeforeUpdate(() => {
  issueOverlay.value = [];
});

// Trigger when the component loaded.
onMounted(() => {
  $electron.addListener("new-sql-query-group-received", onReceivedNewSqlQueryGroup);
});
</script>
