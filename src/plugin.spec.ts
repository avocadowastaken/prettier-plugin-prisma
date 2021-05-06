import { readFileSync } from "fs";
import * as path from "path";
import { check, format } from "prettier";
import * as plugin from "./plugin";

const FORMATTED_FIXTURE = readFileSync(
  path.join(__dirname, "__fixtures__", "formatted.prisma"),
  "utf8"
);

const UNFORMATTED_FIXTURE = readFileSync(
  path.join(__dirname, "__fixtures__", "unformatted.prisma"),
  "utf8"
);

test("basic", () => {
  expect(
    format(FORMATTED_FIXTURE, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(FORMATTED_FIXTURE);

  expect(
    format(UNFORMATTED_FIXTURE, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(FORMATTED_FIXTURE);

  expect(
    check(FORMATTED_FIXTURE, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(true);

  expect(
    check(UNFORMATTED_FIXTURE, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(false);
});
