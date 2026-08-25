import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ===== 阴阳寮运维站业务表 =====

/** 公告 */
export const announcements = mysqlTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  pinned: boolean("pinned").default(false).notNull(),
  authorId: bigint("author_id", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
export type Announcement = typeof announcements.$inferSelect;

/** 黑话词典词条 */
export const terms = mysqlTable("terms", {
  id: serial("id").primaryKey(),
  term: varchar("term", { length: 100 }).notNull(),
  aliases: varchar("aliases", { length: 255 }).default("").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  shortDef: varchar("short_def", { length: 255 }).notNull(),
  detail: text("detail"),
  example: varchar("example", { length: 255 }).default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
export type Term = typeof terms.$inferSelect;

/** 攻略文章(ops=寮运维 pvp=PVP pve=PVE dungeon=副本) */
export const guides = mysqlTable("guides", {
  id: serial("id").primaryKey(),
  channel: mysqlEnum("channel", ["ops", "pvp", "pve", "dungeon", "resource"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: varchar("summary", { length: 500 }).default("").notNull(),
  content: text("content").notNull(),
  version: varchar("version", { length: 50 }).default("").notNull(),
  tags: varchar("tags", { length: 255 }).default("").notNull(),
  authorId: bigint("author_id", { mode: "number", unsigned: true }),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
export type Guide = typeof guides.$inferSelect;

/** 活动日历 */
export const events = mysqlTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  kind: mysqlEnum("kind", ["daily", "weekly", "once"]).notNull(),
  /** weekly: 0-6(周日-周六),多个用逗号; daily/once: 空 */
  daysOfWeek: varchar("days_of_week", { length: 20 }).default("").notNull(),
  /** once 类型的日期 YYYY-MM-DD */
  date: varchar("date", { length: 20 }).default("").notNull(),
  timeRange: varchar("time_range", { length: 50 }).notNull(),
  description: text("description"),
  signupOpen: boolean("signup_open").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type GuildEvent = typeof events.$inferSelect;

/** 活动报名 */
export const eventSignups = mysqlTable("event_signups", {
  id: serial("id").primaryKey(),
  eventId: bigint("event_id", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  note: varchar("note", { length: 255 }).default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type EventSignup = typeof eventSignups.$inferSelect;

/** 成员花名册 */
export const members = mysqlTable("members", {
  id: serial("id").primaryKey(),
  gameId: varchar("game_id", { length: 100 }).notNull(),
  server: varchar("server", { length: 100 }).default("").notNull(),
  position: varchar("position", { length: 50 }).default("成员").notNull(),
  direction: varchar("direction", { length: 20 }).default("双修").notNull(),
  joinedAt: varchar("joined_at", { length: 20 }).default("").notNull(),
  status: varchar("status", { length: 20 }).default("活跃").notNull(),
  note: varchar("note", { length: 255 }).default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Member = typeof members.$inferSelect;

/** 入寮申请 */
export const applications = mysqlTable("applications", {
  id: serial("id").primaryKey(),
  gameId: varchar("game_id", { length: 100 }).notNull(),
  server: varchar("server", { length: 100 }).notNull(),
  contact: varchar("contact", { length: 100 }).notNull(),
  intro: text("intro"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"])
    .default("pending")
    .notNull(),
  reviewerNote: varchar("reviewer_note", { length: 255 }).default("").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
export type Application = typeof applications.$inferSelect;

// TODO: Add your tables here. See docs/Database.md for schema examples and patterns.
//
// Example:
// export const posts = mysqlTable("posts", {
//   id: serial("id").primaryKey(),
//   title: varchar("title", { length: 255 }).notNull(),
//   content: text("content"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });
//
// Note: FK columns referencing a serial() PK must use:
//   bigint("columnName", { mode: "number", unsigned: true }).notNull()
