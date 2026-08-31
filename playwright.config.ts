import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

// Load .env.local exactly the way Next.js itself does, so the webServer
// below (which just runs `npm run dev`) and the test files (which talk to
// Supabase directly through the admin client) see the same real project.
loadEnvConfig(process.cwd());

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: false, // tests create/delete real Supabase users - avoid overlap
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
