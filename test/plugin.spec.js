const fs = require("fs");
const path = require("path");
const { check, format } = require("prettier");
const plugin = require("..");

const FORMATTED_FIXTURE = fs.readFileSync(
  path.join(__dirname, "__fixtures__", "formatted.prisma"),
  "utf8"
);

const UNFORMATTED_FIXTURE = fs.readFileSync(
  path.join(__dirname, "__fixtures__", "unformatted.prisma"),
  "utf8"
);

test("basic", () => {
  expect(
    format(FORMATTED_FIXTURE, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(FORMATTED_FIXTURE);

  expect(
    format(UNFORMATTED_FIXTURE, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(FORMATTED_FIXTURE);

  expect(
    check(FORMATTED_FIXTURE, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(true);

  expect(
    check(UNFORMATTED_FIXTURE, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(false);
});

test("markdown", () => {
  expect(
    format(
      ["### Example 1", "```prisma", FORMATTED_FIXTURE, "```"].join("\n"),
      {
        plugins: [plugin],
        filepath: "./README.md",
      }
    )
  ).toMatchInlineSnapshot(`
    "### Example 1

    \`\`\`prisma
    generator client {
      provider = \\"prisma-client-js\\"
    }

    datasource db {
      provider = \\"postgresql\\"
      url      = env(\\"DATABASE_URL\\")
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
    "
  `);

  expect(
    format(["### Example 1", "```", UNFORMATTED_FIXTURE, "```"].join("\n"), {
      plugins: [plugin],
      filepath: "./README.md",
    })
  ).toMatchInlineSnapshot(`
    "### Example 1

    \`\`\`
    generator client {
     provider=\\"prisma-client-js\\"
    }

    datasource db {
        provider = \\"postgresql\\"
        url    =    env(\\"DATABASE_URL\\")
    }
    model Post {
    id Int @default(autoincrement()) @id
    createdAt DateTime @default(now())
    title String
    content String?
    published Boolean @default(false)
    User User @relation(fields: [authorId], references: [id])
    authorId Int
    }

    model Profile {
    id Int @default(autoincrement()) @id
    bio String?
    User User @relation(fields: [userId], references: [id])
    userId Int @unique
    }

    model User {
    id Int @default(autoincrement()) @id
    email String @unique
    name String?
    Post Post[]
    Profile Profile?
    }
    \`\`\`
    "
  `);
});
