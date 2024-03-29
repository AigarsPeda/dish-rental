import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `dish-rental_${name}`);

export const product = createTable(
  "product",
  {
    id: serial("id").primaryKey(),
    price: real("price").notNull(), // price like 10.99
    name: varchar("name", { length: 256 }),
    titleImage: varchar("titleImage", { length: 255 }),
    isPublished: boolean("isPublished").notNull().default(false),
    availablePieces: integer("availablePieces").notNull(),
    availableDatesStart: bigint("availableDatesStart", {
      mode: "number",
    }).notNull(),
    availableDatesEnd: bigint("availableDatesEnd", {
      mode: "number",
    }).notNull(),
    createdById: varchar("createdById", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    description: text("description"),
    categories: text("categories")
      .array()
      .default(sql`ARRAY[]::text[]`),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const images = createTable(
  "image",
  {
    id: serial("id").primaryKey(),
    size: integer("size").notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    key: varchar("key", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    postId: integer("postId")
      .references(() => product.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    postIdIdx: index("postId_idx").on(example.postId),
  }),
);

// one post can have many images
export const postRelations = relations(product, ({ many }) => ({
  images: many(images),
}));

export const imageRelations = relations(images, ({ one }) => ({
  post: one(product, { fields: [images.postId], references: [product.id] }),
}));

// bookings table, booking may have many products
export const bookings = createTable(
  "booking",
  {
    id: serial("id").primaryKey(),
    productId: integer("productId")
      .notNull()
      .references(() => product.id)
      .array(),
    customerName: varchar("customerName", { length: 255 }).notNull(),
    customerEmail: varchar("customerEmail", { length: 255 }).notNull(),
    customerPhone: varchar("customerPhone", { length: 255 }).notNull(),
    customerAddress: varchar("customerAddress", { length: 255 }).notNull(),
    startDate: bigint("startDate", { mode: "number" }).notNull(),
    endDate: bigint("endDate", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (booking) => ({
    productIdIdx: index("productId_idx").on(booking.productId),
    customerEmailIdx: index("userId_idx").on(booking.customerEmail),
  }),
);

export const bookingRelations = relations(bookings, ({ many }) => ({
  // users: one(users, {
  //   fields: [bookings.customerEmail],
  //   references: [users.email],
  // }),
  products: many(product),
}));
// Bookings table for the product
// We need to create a new table for the bookings to determine the availability of the product

export const users = createTable("user", {
  name: varchar("name", { length: 255 }),
  image: varchar("image", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// CLEAR DB TABLES
// DROP TABLE IF EXISTS "dish-rental_verificationToken";
// export const DROP_DB = sql`
//   DROP TABLE IF EXISTS "dish-rental_verificationToken";
//   DROP TABLE IF EXISTS "dish-rental_session";
//   DROP TABLE IF EXISTS "dish-rental_account";
//   DROP TABLE IF EXISTS "dish-rental_user";
//   DROP TABLE IF EXISTS "dish-rental_post";
//   DROP TABLE IF EXISTS "dish-rental_image";
//   DROP TABLE IF EXISTS "dish-rental_product";
// `;
