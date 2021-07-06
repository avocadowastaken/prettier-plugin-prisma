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
        const prismaFormatter = require("../wasm/prisma_formatter");
        return prismaFormatter.format(path.getValue().text);
      },
    },
  },
};
