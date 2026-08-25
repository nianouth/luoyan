import { z } from "zod";
import { desc, asc, eq, like, or, and, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { TRPCError } from "@trpc/server";

export const contentRouter = createRouter({
  // ---------- 公告 ----------
  "announcements.list": publicQuery.query(async () => {
    return getDb()
      .select()
      .from(schema.announcements)
      .orderBy(desc(schema.announcements.pinned), desc(schema.announcements.createdAt));
  }),
  "announcements.byId": publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await getDb()
        .select()
        .from(schema.announcements)
        .where(eq(schema.announcements.id, input.id))
        .limit(1);
      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND" });
      return rows[0];
    }),

  // ---------- 黑话词典 ----------
  "terms.list": publicQuery
    .input(
      z
        .object({
          category: z.string().optional(),
          q: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const conds = [];
      if (input?.category && input.category !== "全部") {
        conds.push(eq(schema.terms.category, input.category));
      }
      if (input?.q) {
        const kw = `%${input.q}%`;
        conds.push(
          or(
            like(schema.terms.term, kw),
            like(schema.terms.aliases, kw),
            like(schema.terms.shortDef, kw),
          ),
        );
      }
      return getDb()
        .select()
        .from(schema.terms)
        .where(conds.length ? and(...conds) : undefined)
        .orderBy(asc(schema.terms.category), asc(schema.terms.term));
    }),
  "terms.categories": publicQuery.query(async () => {
    const rows = await getDb()
      .selectDistinct({ category: schema.terms.category })
      .from(schema.terms);
    return rows.map((r) => r.category);
  }),

  // ---------- 攻略 ----------
  "guides.list": publicQuery
    .input(z.object({ channel: z.enum(["ops", "pvp", "pve", "dungeon", "resource"]).optional() }))
    .query(async ({ input }) => {
      const conds = [eq(schema.guides.published, true)];
      if (input.channel) conds.push(eq(schema.guides.channel, input.channel));
      return getDb()
        .select({
          id: schema.guides.id,
          channel: schema.guides.channel,
          title: schema.guides.title,
          summary: schema.guides.summary,
          version: schema.guides.version,
          tags: schema.guides.tags,
          updatedAt: schema.guides.updatedAt,
        })
        .from(schema.guides)
        .where(and(...conds))
        .orderBy(desc(schema.guides.updatedAt));
    }),
  "guides.byId": publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await getDb()
        .select()
        .from(schema.guides)
        .where(and(eq(schema.guides.id, input.id), eq(schema.guides.published, true)))
        .limit(1);
      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND" });
      return rows[0];
    }),

  // ---------- 活动 ----------
  "events.list": publicQuery.query(async () => {
    return getDb().select().from(schema.events).orderBy(asc(schema.events.id));
  }),
  "events.signupCounts": publicQuery.query(async () => {
    const rows = await getDb()
      .select({
        eventId: schema.eventSignups.eventId,
        count: sql<number>`count(*)`,
      })
      .from(schema.eventSignups)
      .groupBy(schema.eventSignups.eventId);
    return rows;
  }),
  "events.mySignups": authedQuery.query(async ({ ctx }) => {
    const rows = await getDb()
      .select({ eventId: schema.eventSignups.eventId })
      .from(schema.eventSignups)
      .where(eq(schema.eventSignups.userId, ctx.user.id));
    return rows.map((r) => r.eventId);
  }),
  "events.signup": authedQuery
    .input(z.object({ eventId: z.number(), note: z.string().max(255).optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const exist = await db
        .select()
        .from(schema.eventSignups)
        .where(
          and(
            eq(schema.eventSignups.eventId, input.eventId),
            eq(schema.eventSignups.userId, ctx.user.id),
          ),
        )
        .limit(1);
      if (exist[0]) throw new TRPCError({ code: "CONFLICT", message: "已报名" });
      await db.insert(schema.eventSignups).values({
        eventId: input.eventId,
        userId: ctx.user.id,
        note: input.note ?? "",
      });
      return { ok: true };
    }),
  "events.cancelSignup": authedQuery
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await getDb()
        .delete(schema.eventSignups)
        .where(
          and(
            eq(schema.eventSignups.eventId, input.eventId),
            eq(schema.eventSignups.userId, ctx.user.id),
          ),
        );
      return { ok: true };
    }),

  // ---------- 入寮申请 ----------
  "applications.submit": publicQuery
    .input(
      z.object({
        gameId: z.string().min(1).max(100),
        server: z.string().min(1).max(100),
        contact: z.string().min(1).max(100),
        intro: z.string().max(2000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await getDb().insert(schema.applications).values({
        gameId: input.gameId,
        server: input.server,
        contact: input.contact,
        intro: input.intro ?? "",
      });
      return { ok: true };
    }),
});
