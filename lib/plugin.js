"use strict";

/** @type { import("prettier").Plugin<{ text: string }> } */
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
      print(path) {
        const { format } = require("@prisma/prisma-fmt-wasm");
        return format(path.getValue().text);
      },
    },
  },
};
