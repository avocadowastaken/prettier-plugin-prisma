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
 * @param {import("prettier").Options} [options]
 */
function formatWithPlugin(text, options = {}) {
  const {
    plugins = [plugin],
    filepath = "./prisma/schema.prisma",
    ...restOptions
  } = options;
  const formatted = format(text, { ...restOptions, plugins, filepath });
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
      id        Int       @id @default(autoincrement())
      createdAt DateTime  @default(now())
      title     String
      content   String?
      published Boolean   @default(false)
      User      User      @relation(fields: [authorId], references: [id])
      authorId  Int
      Comment   Comment[]
    }

    model Profile {
      id     Int     @id @default(autoincrement())
      bio    String?
      User   User    @relation(fields: [userId], references: [id])
      userId Int     @unique
    }

    model User {
      id      Int       @id @default(autoincrement())
      email   String    @unique
      name    String?
      Post    Post[]
      Profile Profile?
      Comment Comment[]
    }

    model Comment {
      id      Int    @id @default(autoincrement())
      content String
      author  User   @relation(fields: [userId], references: [id])
      post    Post   @relation(fields: [postId], references: [id])
      userId  Int
      postId  Int
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
      id        Int       @id @default(autoincrement())
      createdAt DateTime  @default(now())
      title     String
      content   String?
      published Boolean   @default(false)
      User      User      @relation(fields: [authorId], references: [id])
      authorId  Int
      Comment   Comment[]
    }

    model Profile {
      id     Int     @id @default(autoincrement())
      bio    String?
      User   User    @relation(fields: [userId], references: [id])
      userId Int     @unique
    }

    model User {
      id      Int       @id @default(autoincrement())
      email   String    @unique
      name    String?
      Post    Post[]
      Profile Profile?
      Comment Comment[]
    }

    model Comment {
      id      Int    @id @default(autoincrement())
      content String
      author  User   @relation(fields: [userId], references: [id])
      post    Post   @relation(fields: [postId], references: [id])
      userId  Int
      postId  Int
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
      id        Int       @id @default(autoincrement())
      createdAt DateTime  @default(now())
      title     String
      content   String?
      published Boolean   @default(false)
      User      User      @relation(fields: [authorId], references: [id])
      authorId  Int
      Comment   Comment[]
    }

    model Profile {
      id     Int     @id @default(autoincrement())
      bio    String?
      User   User    @relation(fields: [userId], references: [id])
      userId Int     @unique
    }

    model User {
      id      Int       @id @default(autoincrement())
      email   String    @unique
      name    String?
      Post    Post[]
      Profile Profile?
      Comment Comment[]
    }

    model Comment {
      id      Int    @id @default(autoincrement())
      content String
      author  User   @relation(fields: [userId], references: [id])
      post    Post   @relation(fields: [postId], references: [id])
      userId  Int
      postId  Int
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
        id        Int       @id @default(autoincrement())
        createdAt DateTime  @default(now())
        title     String
        content   String?
        published Boolean   @default(false)
        User      User      @relation(fields: [authorId], references: [id])
        authorId  Int
        Comment   Comment[]
    }

    model Profile {
        id     Int     @id @default(autoincrement())
        bio    String?
        User   User    @relation(fields: [userId], references: [id])
        userId Int     @unique
    }

    model User {
        id      Int       @id @default(autoincrement())
        email   String    @unique
        name    String?
        Post    Post[]
        Profile Profile?
        Comment Comment[]
    }

    model Comment {
        id      Int    @id @default(autoincrement())
        content String
        author  User   @relation(fields: [userId], references: [id])
        post    Post   @relation(fields: [postId], references: [id])
        userId  Int
        postId  Int
    }

  `);
});
