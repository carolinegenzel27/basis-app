import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Unit-test config only - covers pure logic (validations, scoring,
// templates, PDF text-splitting). Deliberately does NOT spin up a browser
// or a real Supabase instance: Server Actions and page components are
// integration-level code that needs a real (or mocked) database to be
// meaningful to test, which is out of scope for this pass - see TESTING.md.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
  },
});
