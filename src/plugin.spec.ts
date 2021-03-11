import { readFileSync } from "fs";
import { join as joinPath } from "path";
import { check, format, Options } from "prettier";
import * as Prettier1 from "prettier1";
import * as plugin from "./plugin";

describe.each(["v1", "v2"] as const)("prettier@%s", (version) => {
  const options: Options = {
    plugins: [plugin],
    filepath: "./prisma/schema.prisma",
  };

  const formatted = readFileSync(
    joinPath(__dirname, "__fixtures__", "formatted.prisma"),
    "utf8"
  );

  const unformatted = readFileSync(
    joinPath(__dirname, "__fixtures__", "unformatted.prisma"),
    "utf8"
  );

  function formatCode(input: string): string {
    return version === "v1"
      ? Prettier1.format(input, options as any)
      : format(input, options);
  }

  function checkCode(input: string): boolean {
    return version === "v1"
      ? Prettier1.check(input, options as any)
      : check(input, options);
  }

  test("basic", () => {
    expect(formatCode(formatted)).toBe(formatted);
    expect(formatCode(unformatted)).toBe(formatted);

    expect(checkCode(formatted)).toBe(true);
    expect(checkCode(unformatted)).toBe(false);
  });
});
