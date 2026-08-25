import { z } from "zod";
import { desc, asc, eq } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, adminQuery } from "./middleware";

const idInput = z.object({ id: z.number() });

export const adminRouter = createRouter({
  // ---------- 公告管理 ----------
  "announcements.create": adminQuery
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        pinned: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await getDb().insert(schema.announcements).values({
        title: input.title,
        content: input.content,
        pinned: input.pinned ?? false,
        authorId: ctx.user.id,
      });
      return { ok: true };
    }),
  "announcements.update": adminQuery
    .input(
      idInput.extend({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        pinned: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      await getDb()
        .update(schema.announcements)
        .set({ title: input.title, content: input.content, pinned: input.pinned })
        .where(eq(schema.announcements.id, input.id));
      return { ok: true };
    }),
  "announcements.delete": adminQuery.input(idInput).mutation(async ({ input }) => {
    await getDb().delete(schema.announcements).where(eq(schema.announcements.id, input.id));
    return { ok: true };
  }),

  // ---------- 词条管理 ----------
  "terms.create": adminQuery
    .input(
      z.object({
        term: z.string().min(1).max(100),
        aliases: z.string().max(255).optional(),
        category: z.string().min(1).max(50),
        shortDef: z.string().min(1).max(255),
        detail: z.string().optional(),
        example: z.string().max(255).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await getDb().insert(schema.terms).values({
        term: input.term,
        aliases: input.aliases ?? "",
        category: input.category,
        shortDef: input.shortDef,
        detail: input.detail ?? "",
        example: input.example ?? "",
      });
      return { ok: true };
    }),
  "terms.update": adminQuery
    .input(
      idInput.extend({
        term: z.string().min(1).max(100),
        aliases: z.string().max(255).optional(),
        category: z.string().min(1).max(50),
        shortDef: z.string().min(1).max(255),
        detail: z.string().optional(),
        example: z.string().max(255).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await getDb()
        .update(schema.terms)
        .set({
          term: input.term,
          aliases: input.aliases ?? "",
          category: input.category,
          shortDef: input.shortDef,
          detail: input.detail ?? "",
          example: input.example ?? "",
        })
        .where(eq(schema.terms.id, input.id));
      return { ok: true };
    }),
  "terms.delete": adminQuery.input(idInput).mutation(async ({ input }) => {
    await getDb().delete(schema.terms).where(eq(schema.terms.id, input.id));
    return { ok: true };
  }),

  // ---------- 攻略管理 ----------
  "guides.listAll": adminQuery.query(async () => {
    return getDb()
      .select({
        id: schema.guides.id,
        channel: schema.guides.channel,
        title: schema.guides.title,
        version: schema.guides.version,
        published: schema.guides.published,
        updatedAt: schema.guides.updatedAt,
      })
      .from(schema.guides)
      .orderBy(desc(schema.guides.updatedAt));
  }),
  "guides.getRaw": adminQuery.input(idInput).query(async ({ input }) => {
    const rows = await getDb()
      .select()
      .from(schema.guides)
      .where(eq(schema.guides.id, input.id))
      .limit(1);
    return rows[0] ?? null;
  }),
  "guides.create": adminQuery
    .input(
      z.object({
        channel: z.enum(["ops", "pvp", "pve", "dungeon", "resource"]),
        title: z.string().min(1).max(255),
        summary: z.string().max(500).optional(),
        content: z.string().min(1),
        version: z.string().max(50).optional(),
        tags: z.string().max(255).optional(),
        published: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await getDb().insert(schema.guides).values({
        channel: input.channel,
        title: input.title,
        summary: input.summary ?? "",
        content: input.content,
        version: input.version ?? "",
        tags: input.tags ?? "",
        published: input.published ?? true,
        authorId: ctx.user.id,
      });
      return { ok: true };
    }),
  "guides.update": adminQuery
    .input(
      idInput.extend({
        channel: z.enum(["ops", "pvp", "pve", "dungeon", "resource"]),
        title: z.string().min(1).max(255),
        summary: z.string().max(500).optional(),
        content: z.string().min(1),
        version: z.string().max(50).optional(),
        tags: z.string().max(255).optional(),
        published: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      await getDb()
        .update(schema.guides)
        .set({
          channel: input.channel,
          title: input.title,
          summary: input.summary ?? "",
          content: input.content,
          version: input.version ?? "",
          tags: input.tags ?? "",
          published: input.published,
        })
        .where(eq(schema.guides.id, input.id));
      return { ok: true };
    }),
  "guides.delete": adminQuery.input(idInput).mutation(async ({ input }) => {
    await getDb().delete(schema.guides).where(eq(schema.guides.id, input.id));
    return { ok: true };
  }),

  // ---------- 活动管理 ----------
  "events.create": adminQuery
    .input(
      z.object({
        title: z.string().min(1).max(255),
        kind: z.enum(["daily", "weekly", "once"]),
        daysOfWeek: z.string().max(20).optional(),
        date: z.string().max(20).optional(),
        timeRange: z.string().min(1).max(50),
        description: z.string().optional(),
        signupOpen: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await getDb().insert(schema.events).values({
        title: input.title,
        kind: input.kind,
        daysOfWeek: input.daysOfWeek ?? "",
        date: input.date ?? "",
        timeRange: input.timeRange,
        description: input.description ?? "",
        signupOpen: input.signupOpen ?? false,
      });
      return { ok: true };
    }),
  "events.update": adminQuery
    .input(
      idInput.extend({
        title: z.string().min(1).max(255),
        kind: z.enum(["daily", "weekly", "once"]),
        daysOfWeek: z.string().max(20).optional(),
        date: z.string().max(20).optional(),
        timeRange: z.string().min(1).max(50),
        description: z.string().optional(),
        signupOpen: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      await getDb()
        .update(schema.events)
        .set({
          title: input.title,
          kind: input.kind,
          daysOfWeek: input.daysOfWeek ?? "",
          date: input.date ?? "",
          timeRange: input.timeRange,
          description: input.description ?? "",
          signupOpen: input.signupOpen,
        })
        .where(eq(schema.events.id, input.id));
      return { ok: true };
    }),
  "events.delete": adminQuery.input(idInput).mutation(async ({ input }) => {
    await getDb().delete(schema.eventSignups).where(eq(schema.eventSignups.eventId, input.id));
    await getDb().delete(schema.events).where(eq(schema.events.id, input.id));
    return { ok: true };
  }),
  "events.signups": adminQuery.input(idInput).query(async ({ input }) => {
    const db = getDb();
    const rows = await db
      .select({
        id: schema.eventSignups.id,
        note: schema.eventSignups.note,
        createdAt: schema.eventSignups.createdAt,
        userName: schema.users.name,
      })
      .from(schema.eventSignups)
      .leftJoin(schema.users, eq(schema.eventSignups.userId, schema.users.id))
      .where(eq(schema.eventSignups.eventId, input.id))
      .orderBy(asc(schema.eventSignups.createdAt));
    return rows;
  }),

  // ---------- 成员花名册 ----------
  "members.list": adminQuery.query(async () => {
    return getDb().select().from(schema.members).orderBy(asc(schema.members.id));
  }),
  "members.create": adminQuery
    .input(
      z.object({
        gameId: z.string().min(1).max(100),
        server: z.string().max(100).optional(),
        position: z.string().max(50).optional(),
        direction: z.string().max(20).optional(),
        joinedAt: z.string().max(20).optional(),
        status: z.string().max(20).optional(),
        note: z.string().max(255).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await getDb().insert(schema.members).values({
        gameId: input.gameId,
        server: input.server ?? "",
        position: input.position ?? "成员",
        direction: input.direction ?? "双修",
        joinedAt: input.joinedAt ?? "",
        status: input.status ?? "活跃",
        note: input.note ?? "",
      });
      return { ok: true };
    }),
  "members.update": adminQuery
    .input(
      idInput.extend({
        gameId: z.string().min(1).max(100),
        server: z.string().max(100).optional(),
        position: z.string().max(50).optional(),
        direction: z.string().max(20).optional(),
        joinedAt: z.string().max(20).optional(),
        status: z.string().max(20).optional(),
        note: z.string().max(255).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await getDb()
        .update(schema.members)
        .set({
          gameId: input.gameId,
          server: input.server ?? "",
          position: input.position ?? "成员",
          direction: input.direction ?? "双修",
          joinedAt: input.joinedAt ?? "",
          status: input.status ?? "活跃",
          note: input.note ?? "",
        })
        .where(eq(schema.members.id, input.id));
      return { ok: true };
    }),
  "members.delete": adminQuery.input(idInput).mutation(async ({ input }) => {
    await getDb().delete(schema.members).where(eq(schema.members.id, input.id));
    return { ok: true };
  }),

  // ---------- 入寮申请审批 ----------
  "applications.list": adminQuery.query(async () => {
    return getDb()
      .select()
      .from(schema.applications)
      .orderBy(desc(schema.applications.createdAt));
  }),
  "applications.review": adminQuery
    .input(
      idInput.extend({
        status: z.enum(["approved", "rejected"]),
        reviewerNote: z.string().max(255).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await getDb()
        .update(schema.applications)
        .set({ status: input.status, reviewerNote: input.reviewerNote ?? "" })
        .where(eq(schema.applications.id, input.id));
      return { ok: true };
    }),
});
