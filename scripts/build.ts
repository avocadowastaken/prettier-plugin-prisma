import * as execa from "execa";
import * as fs from "fs";
import * as path from "path";

const ROOT_DIR = path.join(__dirname, "..");
const WASM_DIR = path.join(ROOT_DIR, "wasm");
const DIST_DIR = path.join(ROOT_DIR, "dist");
function exec(file: string, ...args: string[]): void {
  execa.sync(file, args, { stdio: "inherit" });
}

//
// Prepare
//

exec("rimraf", DIST_DIR, WASM_DIR);
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(WASM_DIR, { recursive: true });

//
// Build Wasm
//

const RUST_TARGET = "wasm32-unknown-unknown";

exec("rustup", "target", "add", RUST_TARGET, "--toolchain", "stable");
exec("cargo", "install", "wasm-bindgen-cli");

const PRISMA_FORMATTER_WASM_PATH = path.join(
  ROOT_DIR,
  "target",
  RUST_TARGET,
  "release",
  "deps",
  "prisma_formatter.wasm"
);

exec(
  "cargo",
  "build",
  "--release",
  `--target=${RUST_TARGET}`,
  "--lib=prisma-formatter"
);

exec(
  "wasm-bindgen",
  PRISMA_FORMATTER_WASM_PATH,
  "--no-typescript",
  "--target",
  "nodejs",
  "--out-dir",
  WASM_DIR
);

//
// Build JS
//

const TS_ENTRY = path.join(ROOT_DIR, "src", "plugin.ts");

exec(
  "esbuild",
  TS_ENTRY,
  "--bundle",
  "--target=node12",
  "--platform=node",
  `--outdir=${DIST_DIR}`
);
