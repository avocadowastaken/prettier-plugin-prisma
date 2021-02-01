import { spawnSync } from "child_process";
import { join as joinPath } from "path";

const ROOT_DIR = joinPath(__dirname, "..");
const TS_ENTRY = joinPath(ROOT_DIR, "plugin.ts");
const OUT_DIR = joinPath();

spawnSync("esbuild", [TS_ENTRY], {
  stdio: "inherit",
  encoding: "utf8",
});
