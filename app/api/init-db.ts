/**
 * 启动时自检数据库：
 * 1. CREATE TABLE IF NOT EXISTS 全部业务表(幂等)
 * 2. 若词条表为空则写入种子数据
 * 仅在数据库可达时执行，任何失败只记录日志，不阻塞服务启动。
 */
import mysql from "mysql2/promise";
import { env } from "./lib/env";
import { getDb } from "./queries/connection";
import * as schema from "../db/schema";
import {
  termRows,
  guideRows,
  announcementRows,
  eventRows,
  memberRows,
} from "../db/seed-data";

const DDL = [
  `CREATE TABLE IF NOT EXISTS users (
    id bigint unsigned NOT NULL AUTO_INCREMENT,
    unionId varchar(255) NOT NULL,
    name varchar(255),
    email varchar(320),
    avatar text,
    role enum('user','admin') NOT NULL DEFAULT 'user',
    createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    lastSignInAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unionId_unique (unionId)
  )`,
  `CREATE TABLE IF NOT EXISTS announcements (
    id bigint unsigned NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    content text NOT NULL,
    pinned tinyint(1) NOT NULL DEFAULT 0,
    author_id bigint unsigned,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  )`,
  `CREATE TABLE IF NOT EXISTS terms (
    id bigint unsigned NOT NULL AUTO_INCREMENT,
    term varchar(100) NOT NULL,
    aliases varchar(255) NOT NULL DEFAULT '',
    category varchar(50) NOT NULL,
    short_def varchar(255) NOT NULL,
    detail text,
    example varchar(255) NOT NULL DEFAULT '',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  )`,
  `CREATE TABLE IF NOT EXISTS guides (
    id bigint unsigned NOT NULL AUTO_INCREMENT,
    channel enum('ops','pvp','pve','dungeon','resource') NOT NULL,
    title varchar(255) NOT NULL,
    summary varchar(500) NOT NULL DEFAULT '',
    content text NOT NULL,
    version varchar(50) NOT NULL DEFAULT '',
    tags varchar(255) NOT NULL DEFAULT '',
    author_id bigint unsigned,
    published tinyint(1) NOT NULL DEFAULT 1,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  )`,
  `CREATE TABLE IF NOT EXISTS events (
    id bigint unsigned NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    kind enum('daily','weekly','once') NOT NULL,
    days_of_week varchar(20) NOT NULL DEFAULT '',
    date varchar(20) NOT NULL DEFAULT '',
    time_range varchar(50) NOT NULL,
    description text,
    signup_open tinyint(1) NOT NULL DEFAULT 0,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  )`,
  `CREATE TABLE IF NOT EXISTS event_signups (
    id bigint unsigned NOT NULL AUTO_INCREMENT,
    event_id bigint unsigned NOT NULL,
    user_id bigint unsigned NOT NULL,
    note varchar(255) NOT NULL DEFAULT '',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  )`,
  `CREATE TABLE IF NOT EXISTS members (
    id bigint unsigned NOT NULL AUTO_INCREMENT,
    game_id varchar(100) NOT NULL,
    server varchar(100) NOT NULL DEFAULT '',
    position varchar(50) NOT NULL DEFAULT '成员',
    direction varchar(20) NOT NULL DEFAULT '双修',
    joined_at varchar(20) NOT NULL DEFAULT '',
    status varchar(20) NOT NULL DEFAULT '活跃',
    note varchar(255) NOT NULL DEFAULT '',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  )`,
  `CREATE TABLE IF NOT EXISTS applications (
    id bigint unsigned NOT NULL AUTO_INCREMENT,
    game_id varchar(100) NOT NULL,
    server varchar(100) NOT NULL,
    contact varchar(100) NOT NULL,
    intro text,
    status enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    reviewer_note varchar(255) NOT NULL DEFAULT '',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  )`,
];

let done = false;

export async function ensureDb() {
  if (done) return;
  done = true;
  try {
    const conn = await mysql.createConnection({
      uri: env.databaseUrl,
      connectTimeout: 8000,
    });
    for (const sql of DDL) {
      await conn.query(sql);
    }
    await conn.end();
    console.log("[init-db] tables ensured");

    const db = getDb();
    const existing = await db
      .select({ id: schema.terms.id })
      .from(schema.terms)
      .limit(1);
    if (existing.length === 0) {
      await db.insert(schema.terms).values(
        termRows.map((t) => ({
          term: t.term,
          aliases: t.aliases ?? "",
          category: t.category,
          shortDef: t.shortDef,
          detail: t.detail ?? "",
          example: t.example ?? "",
        })),
      );
      await db.insert(schema.announcements).values(announcementRows);
      await db.insert(schema.guides).values(guideRows);
      await db.insert(schema.events).values(eventRows);
      await db.insert(schema.members).values(memberRows);
      console.log("[init-db] seed data inserted");
    }
  } catch (err) {
    console.error("[init-db] skipped:", err instanceof Error ? err.message : err);
  }
}
