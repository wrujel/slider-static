import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.js"],
    coverage: {
      provider: "v8",
      include: ["app.js"],
      reporter: ["text", "json-summary", "lcov", "html"],
      reportsDirectory: "coverage",
      thresholds: {
        100: true,
      },
    },
  },
});
