import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-vue";
import App from "./App.vue";

describe("The application", () => {
  it("renders", async () => {
    const screen = await render(App);
    await expect.element(screen.locator).toBeInTheDocument();
  });
});
