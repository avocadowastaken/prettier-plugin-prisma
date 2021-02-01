import * as execa from "execa";
import * as fs from "fs";
import * as path from "path";

const rootDir = path.join(__dirname, "..");
const distDir = path.join(rootDir, "dist");

//
// Prepare
//

execa.sync("rimraf", [distDir], { stdio: "inherit" });
fs.mkdirSync(distDir, { recursive: true });

//
// Build Wasm
//

const rustTarget = "wasm32-unknown-unknown";
const formatterWasmPath = path.join(
  rootDir,
  "target",
  rustTarget,
  "release",
  "deps",
  "prisma_formatter.wasm"
);

execa.sync(
  "cargo",
  ["build", "--release", `--target=${rustTarget}`, "--lib=prisma-formatter"],
  { stdio: "inherit" }
);

execa.sync(
  "wasm-bindgen",
  [
    formatterWasmPath,
    "--no-typescript",
    "--target",
    "nodejs",
    "--out-dir",
    distDir,
  ],
  {
    stdio: "inherit",
  }
);

//
// Build JS
//

const tsEntry = path.join(rootDir, "src", "plugin.ts");

execa.sync(
  "esbuild",
  [
    tsEntry,
    "--bundle",
    "--target=node12",
    "--platform=node",
    `--outdir=${distDir}`,
    `--define:process.env.PRISMA_FORMATTER_PATH="prisma_formatter.js"`,
  ],
  { stdio: "inherit" }
);
