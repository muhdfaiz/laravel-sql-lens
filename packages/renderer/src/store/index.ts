import { createStore, createLogger } from "vuex";
import Setting from "./modules/Setting";
import QueryList from "./modules/QueryList";

const debug = process.env.NODE_ENV !== "production";

// Create a new store instance.
export default createStore({
  modules: { Setting, QueryList },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
