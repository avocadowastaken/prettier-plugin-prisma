const fs = require("fs");
const path = require("path");
const execa = require("execa");

const ROOT_DIR = path.join(__dirname, "..");
const WASM_DIR = path.join(ROOT_DIR, "wasm");

/**
 * @param {string} file
 * @param {...string} args
 * @returns {void}
 */
function exec(file, ...args) {
  execa.sync(file, args, { stdio: "inherit" });
}

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

exec("rimraf", WASM_DIR);
fs.mkdirSync(WASM_DIR, { recursive: true });

exec(
  "wasm-bindgen",
  PRISMA_FORMATTER_WASM_PATH,
  "--target",
  "nodejs",
  "--out-dir",
  WASM_DIR
);
