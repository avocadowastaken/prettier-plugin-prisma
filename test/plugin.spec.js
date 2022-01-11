const fs = require("fs");
const path = require("path");
const { check, format } = require("prettier");
const plugin = require("..");
const registerRawSnapshot = require("../test/__testutils__/rawSerializer");

const UNFORMATTED_FIXTURE = fs.readFileSync(
  path.join(__dirname, "__fixtures__", "unformatted.prisma"),
  "utf8"
);

/**
 * @param {string} text
 * @param {Omit<import("prettier").Options, "plugins">} [options]
 */
function formatWithPlugin(
  text,
  { filepath = "./prisma/schema.prisma", ...options } = {}
) {
  const formatted = format(text, { ...options, filepath, plugins: [plugin] });
  registerRawSnapshot(formatted);
  return formatted;
}

test("basic", () => {
  const formatted = formatWithPlugin(UNFORMATTED_FIXTURE);

  expect(formatted).toMatchInlineSnapshot(`
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model Post {
      id        Int      @id @default(autoincrement())
      createdAt DateTime @default(now())
      title     String
      content   String?
      published Boolean  @default(false)
      User      User     @relation(fields: [authorId], references: [id])
      authorId  Int
    }

    model Profile {
      id     Int     @id @default(autoincrement())
      bio    String?
      User   User    @relation(fields: [userId], references: [id])
      userId Int     @unique
    }

    model User {
      id      Int      @id @default(autoincrement())
      email   String   @unique
      name    String?
      Post    Post[]
      Profile Profile?
    }

  `);

  expect(
    check(UNFORMATTED_FIXTURE, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(false);

  expect(
    check(formatted, { plugins: [plugin], filepath: "./prisma/schema.prisma" })
  ).toBe(true);

  expect(formatWithPlugin(formatted)).toBe(formatted);
});

test("markdown", () => {
  expect(
    formatWithPlugin(
      ["### Example 1", "```prisma", UNFORMATTED_FIXTURE, "```"].join("\n"),
      { filepath: "./README.md" }
    )
  ).toMatchInlineSnapshot(`
    ### Example 1

    \`\`\`prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model Post {
      id        Int      @id @default(autoincrement())
      createdAt DateTime @default(now())
      title     String
      content   String?
      published Boolean  @default(false)
      User      User     @relation(fields: [authorId], references: [id])
      authorId  Int
    }

    model Profile {
      id     Int     @id @default(autoincrement())
      bio    String?
      User   User    @relation(fields: [userId], references: [id])
      userId Int     @unique
    }

    model User {
      id      Int      @id @default(autoincrement())
      email   String   @unique
      name    String?
      Post    Post[]
      Profile Profile?
    }
    \`\`\`

  `);

  expect(
    formatWithPlugin(
      ["### Example 1", "```prisma", UNFORMATTED_FIXTURE, "```"].join("\n"),
      { filepath: "./README.md" }
    )
  ).toMatchInlineSnapshot(`
    ### Example 1

    \`\`\`prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    model Post {
      id        Int      @id @default(autoincrement())
      createdAt DateTime @default(now())
      title     String
      content   String?
      published Boolean  @default(false)
      User      User     @relation(fields: [authorId], references: [id])
      authorId  Int
    }

    model Profile {
      id     Int     @id @default(autoincrement())
      bio    String?
      User   User    @relation(fields: [userId], references: [id])
      userId Int     @unique
    }

    model User {
      id      Int      @id @default(autoincrement())
      email   String   @unique
      name    String?
      Post    Post[]
      Profile Profile?
    }
    \`\`\`

  `);
});

test("tabWidth", () => {
  expect(formatWithPlugin(UNFORMATTED_FIXTURE, { tabWidth: 4 }))
    .toMatchInlineSnapshot(`
    generator client {
        provider = "prisma-client-js"
    }

    datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
    }

    model Post {
        id        Int      @id @default(autoincrement())
        createdAt DateTime @default(now())
        title     String
        content   String?
        published Boolean  @default(false)
        User      User     @relation(fields: [authorId], references: [id])
        authorId  Int
    }

    model Profile {
        id     Int     @id @default(autoincrement())
        bio    String?
        User   User    @relation(fields: [userId], references: [id])
        userId Int     @unique
    }

    model User {
        id      Int      @id @default(autoincrement())
        email   String   @unique
        name    String?
        Post    Post[]
        Profile Profile?
    }

  `);
});
