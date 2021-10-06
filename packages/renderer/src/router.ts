import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "ServerSetting",
    component: () =>
      import(
        /* webpackChunkName: "ServerSetting" */ "/@/views/ServerSetting.vue"
      ),
  },
  {
    path: "/sql-queries",
    name: "ListeningSqlQuery",
    component: () =>
      import(
        /* webpackChunkName: "ListeningSqlQuery" */ "./views/ListeningSqlQuery.vue"
      ),
  },
];

export default createRouter({
  routes,
  history: createWebHashHistory(),
});
