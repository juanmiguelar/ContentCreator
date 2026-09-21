import { defineConfig } from "@playwright/test";
import path from "node:path";
import { tmpdir } from "node:os";
process.env.STUDIO_E2E_DIR ??= path.join(
  tmpdir(),
  `social-studio-e2e-${process.pid}`,
);
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 180000,
  expect: { timeout: 20000 },
  use: {
    baseURL: "http://127.0.0.1:3100",
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    actionTimeout: 20000,
    navigationTimeout: 30000,
    permissions: ["clipboard-read", "clipboard-write"],
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node --import tsx scripts/e2e-server.ts",
    url: "http://127.0.0.1:3100",
    timeout: 120000,
    reuseExistingServer: false,
  },
});
