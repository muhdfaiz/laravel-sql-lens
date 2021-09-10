import { createApp } from "vue";
import App from "/@/App.vue";
import router from "/@/router";
import store from "./store";

// Load Prime Vue CSS
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

// Load Bootstrap 5 css.
import "bootstrap/dist/css/bootstrap.min.css";

createApp(App)
  .use(router)
  .use(store)
  .use(PrimeVue)
  .use(ToastService)
  .directive("tooltip", Tooltip)
  .mount("#app");
