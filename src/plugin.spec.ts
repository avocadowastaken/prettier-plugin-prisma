import { readFileSync } from "fs";
import { join as joinPath } from "path";
import { check, format } from "prettier";
import * as plugin from "./plugin";

const formatted = readFileSync(
  joinPath(__dirname, "__fixtures__", "formatted.prisma"),
  "utf8"
);

const unformatted = readFileSync(
  joinPath(__dirname, "__fixtures__", "unformatted.prisma"),
  "utf8"
);

test("basic", () => {
  expect(
    format(formatted, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(formatted);

  expect(
    format(unformatted, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(formatted);

  expect(
    check(formatted, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(true);

  expect(
    check(unformatted, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(false);
});
