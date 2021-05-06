const fs = require("fs");
const path = require("path");
const { check, format } = require("prettier");
const plugin = require("..");

const FORMATTED_FIXTURE = fs.readFileSync(
  path.join(__dirname, "__fixtures__", "formatted.prisma"),
  "utf8"
);

const UNFORMATTED_FIXTURE = fs.readFileSync(
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
