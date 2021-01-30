import { spawnSync } from "child_process";
import { Plugin } from "prettier";

export default {
  languages: [
    {
      name: "Prisma",
      extensions: [".prisma"],
      parsers: ["prisma-parse"],
    },
  ],
  parsers: {
    "prisma-parse": {
      astFormat: "prisma-ast",
      parse: (text) => text,
      preprocess: (text) => text,

      hasPragma: (text) =>
        text.startsWith("// @format") || text.startsWith("// @prettier"),

      locStart: () => 0,
      locEnd: (node) => node.length,
    },
  },

  printers: {
    "prisma-ast": {
      print: (path) => {
        const { stdout, stderr } = spawnSync(
          "node",
          [
            "-e",
            "require('@prisma/sdk').formatSchema({ schema: require('fs').readFileSync(process.stdin.fd, 'utf8') }).then(console.log)",
          ],
          {
            encoding: "utf8",
            input: path.getValue(),
          }
        );

        if (stderr) {
          throw new Error(stderr);
        }

        return stdout;
      },
    },
  },
} as Plugin<string>;
