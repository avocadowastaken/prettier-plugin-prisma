import { check, format } from "prettier";
import plugin from "./plugin";

const invalid = `
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
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

`;

test("basic", () => {
  const formatted = format(invalid, {
    plugins: [plugin],
    filepath: "./prisma/schema.prisma",
  });

  expect(
    format(invalid, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(formatted);

  expect(formatted).toBe(
    `
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
`.trimStart()
  );

  expect(
    check(invalid, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(false);

  expect(
    check(formatted, {
      plugins: [plugin],
      filepath: "./prisma/schema.prisma",
    })
  ).toBe(true);
});
