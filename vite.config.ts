import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// @ts-expect-error No type declaration available for this plugin. Internet recommends to change the config to js.
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    vue(),
    eslint({
      emitWarning: true, // emits to the console if there is a warning
      emitError: true, // emits to the console if there is an error
      failOnError: false, // hides the stack trace
    }),
  ],
  base: "./",
});
