import {node} from "../../electron-vendors.config.json";
import {join} from "path";
import {builtinModules} from "module";
import builtins from "rollup-plugin-node-builtins";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const PACKAGE_ROOT = __dirname;


/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      "/@/": join(PACKAGE_ROOT, "src") + "/",
    },
  },
  plugins: [builtins(), nodeResolve()],
  build: {
    sourcemap: "inline",
    target: `node${node}`,
    outDir: "dist",
    assetsDir: ".",
    minify: process.env.MODE === "development" ? false : "terser",
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2,
      },
      safari10: false,
    },
    lib: {
      entry: "src/index.ts",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [
        "electron",
        "electron-devtools-installer",
        ...builtinModules,
      ],
      output: {
        entryFileNames: "[name].cjs",
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;
