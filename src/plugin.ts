import { Plugin } from "prettier";

interface PrismaFormatter {
  format: (input: string) => string;
}

let prismaFormatter: undefined | PrismaFormatter;

function formatSchema(input: string): string {
  if (!prismaFormatter) {
    try {
      prismaFormatter = require("../wasm/prisma_formatter.js") as PrismaFormatter;
    } catch (error) {
      if (
        error instanceof Error &&
        (error as { code?: string }).code === "MODULE_NOT_FOUND"
      ) {
        throw new Error("File defined in 'PRISMA_FORMATTER_PATH' not found");
      }

      throw error;
    }
  }

  return prismaFormatter.format(input);
}

interface PrismaAST {
  text: string;
}

export const { languages, parsers, printers }: Plugin<PrismaAST> = {
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
      parse: (text) => ({ text }),
      locStart: () => 0,
      locEnd: (node) => node.text.length,
    },
  },

  printers: {
    "prisma-ast": {
      print: (path) => formatSchema(path.getValue().text),
    },
  },
};
