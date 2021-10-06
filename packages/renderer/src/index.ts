import { createApp } from "vue";
import App from "/@/App.vue";
import router from "/@/router";
import store from "./store";

// Font Awesome.
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStopCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faTrashAlt,
  faServer,
  faSave,
  faPlug,
  faEdit,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Load Prime Vue CSS
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";
import ConfirmationService from "primevue/confirmationservice";
import "primevue/resources/themes/bootstrap4-dark-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import { Database } from "./database/database";

// Add font awesome icon
library.add(
  faStopCircle,
  faTrashAlt,
  faServer,
  faSave,
  faPlug,
  faEdit,
  faPlayCircle,
);

const db = new Database();

createApp(App)
  .use(router)
  .use(store)
  .use(PrimeVue)
  .use(ToastService)
  .use(ConfirmationService)
  .provide("db", db)
  .component("font-awesome-icon", FontAwesomeIcon)
  .directive("tooltip", Tooltip)
  .mount("#app");
