import { readdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const distDir = path.join(process.cwd(), "dist");
const entries = await readdir(distDir, { withFileTypes: true });
const testFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".test.js"))
  .map((entry) => path.join("dist", entry.name))
  .sort();

if (testFiles.length === 0) {
  console.error("No compiled test files found in dist/. Run `npm run build` before `npm test`.");
  process.exit(1);
}

const child = spawn(process.execPath, ["--test", ...testFiles], {
  stdio: "inherit",
  shell: false
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Test runner exited with signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
