import { spawnSync } from "child_process";
import { Plugin } from "prettier";

export const { languages, parsers, printers }: Plugin<string> = {
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
};
