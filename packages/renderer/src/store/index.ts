import { createStore, createLogger } from "vuex";
import ServerSettingModule from "./modules/ServerSettingModule";
import ListeningSqlQueryModule from "./modules/ListeningSqlQueryModule";

const debug = process.env.NODE_ENV !== "production";

// Create a new store instance.
export default createStore({
  modules: { ServerSettingModule, ListeningSqlQueryModule },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
