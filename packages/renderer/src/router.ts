import {createRouter, createWebHashHistory} from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Setting',
    component: () =>
      import(/* webpackChunkName: "Setting" */'/@/views/Setting.vue'),
  },
  {
    path: '/sql-queries',
    name: 'QueryList',
    component: () =>
      import(/* webpackChunkName: "QueryList" */'/@/views/QueryList.vue'),
  },
];

export default createRouter({
  routes,
  history: createWebHashHistory(),
});
