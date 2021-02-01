import { join as joinPath } from "path";
import { Plugin } from "prettier";

interface PrismaFormatter {
  format: (input: string) => string;
}

let prismaFormatter: undefined | PrismaFormatter;

function formatSchema(input: string): string {
  if (!prismaFormatter) {
    const formatterPath = process.env.PRISMA_FORMATTER_PATH;

    if (!formatterPath) {
      throw new Error("'PRISMA_FORMATTER_PATH' not defined");
    }

    try {
      prismaFormatter = require(joinPath(
        __dirname,
        formatterPath
      )) as PrismaFormatter;
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
      print: (path) => formatSchema(path.getValue()),
    },
  },
};
