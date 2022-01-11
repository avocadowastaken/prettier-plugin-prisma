"use strict";

/** @type {import("prettier").Plugin<{ text: string }>} */
module.exports = {
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
      parse(text) {
        return { text };
      },
      locStart() {
        return 0;
      },
      locEnd(node) {
        return node.text.length;
      },
    },
  },

  printers: {
    "prisma-ast": {
      print(path, options) {
        const { format } = require("@prisma/prisma-fmt-wasm");
        const { text } = path.getValue();
        const params = JSON.stringify({
          textDocument: {
            uri: new URL(`file://${options.filepath}`),
          },
          options: {
            tabSize: options.tabWidth,
            insertSpaces: !options.useTabs,
          },
        });

        return format(text, params);
      },
    },
  },
};
