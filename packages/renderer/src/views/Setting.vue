<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-12">
        <h4 class="text-center">
          <img class="logo-text" src="/assets/images/logo-text.svg">
        </h4>
      </div>
    </div>

    <div class="row mt-4 justify-content-center">
      <div class="col-12 col-md-6 col-lg-4">
        <h6 class="fw-bold">
          Notes
        </h6>
        <ol>
          <li class="form-text">
            This app only work when you install <a
              href="#"
              @click="openURLInBrowser('https://laravel-tail-db.muhdfaiz.com/')"
            >Laravel Tail DB</a> package in your laravel/lumen application.
          </li>
          <li class="form-text">
            You can view the documentation <a
              href="#"
              @click="openURLInBrowser('https://laravel-tail-db.muhdfaiz.com/')"
            >here</a> on how to install Laravel Tail DB package.
          </li>
        </ol>
      </div>
    </div>

    <div class="row mt-4 justify-content-center">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="mb-3">
          <label class="form-label fw-bold">Server Host</label>
          <input
            id="server-host"
            v-model="serverHost"
            type="text"
            class="form-control"
            name="server-host"
            aria-describedby="serverHostHelp"
          >
          <div class="form-text">
            The server host must same with the server host in the tail-db config inside Laravel application.
          </div>
        </div>
        <div class="mb-3">
          <label
            for="port"
            class="form-label fw-bold"
          >Server Port</label>
          <input
            id="port"
            v-model="serverPort"
            type="text"
            class="form-control"
            name="host"
            aria-describedby="serverPortHelp"
          >
          <div
            id="serverPortHelp"
            class="form-text"
          >
            The server port must same with the server post in the tail-db config inside Laravel application.
          </div>
        </div>
      </div>

      <div class="row mt-3">
        <div class="col-12 text-center">
          <button
            type="submit"
            class="btn btn-info"
            @click="startTcpServerAndListenSQLQuery()"
          >
            Start Debugging
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import store from '../store';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'Home',
  components: { },
  setup(props, { $emit }) {
    const router = useRouter();
    const route = useRoute();

    /**
     * Server Host in Vuex
     *
     * @type {ComputedRef<string>}
     */
    const serverHost = computed(() => {
      return store.state.Setting.serverHost;
    });

    /**
     * Server Port in Vuex
     *
     * @type {ComputedRef<string>}
     */
    const serverPort = computed(() => {
      return store.state.Setting.serverPort;
    });

    /**
     * Start TCP Server and listen for the sql query data.
     */
    const startTcpServerAndListenSQLQuery = () => {
      window.electron.startTcpServer(serverHost.value, serverPort.value);

      // Display query list view.
      router.push({
        name: 'QueryList',
      });
    };

    /**
     * Open URL in browser.
     */
    const openURLInBrowser = (url) => {
      window.electron.openURLInBrowser(url);
    };

    return {
      serverHost,
      serverPort,
      startTcpServerAndListenSQLQuery,
      openURLInBrowser,
    };
  },
};
</script>

<style scoped>

</style>
