import { join as joinPath, relative as relativePath } from "path";

if (!process.env.PRISMA_FORMATTER_PATH) {
  const formatterpath = joinPath(
    __dirname,
    "..",
    "dist",
    "prisma_formatter.js"
  );

  process.env.PRISMA_FORMATTER_PATH = relativePath(__dirname, formatterpath);
}
