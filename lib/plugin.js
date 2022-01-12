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
        /** @type {import('vscode-languageserver-protocol').DocumentFormattingParams} */
        const params = {
          textDocument: {
            uri: new URL(`file://${options.filepath}`).toString(),
          },
          options: {
            tabSize: options.tabWidth,
            insertSpaces: !options.useTabs,
            trimFinalNewlines: true,
            insertFinalNewline: true,
            trimTrailingWhitespace: true,
          },
        };

        return format(text, JSON.stringify(params));
      },
    },
  },
};
