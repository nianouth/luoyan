import { getDb } from "../api/queries/connection";
import * as schema from "./schema";
import {
  termRows,
  guideRows,
  announcementRows,
  eventRows,
  memberRows,
} from "./seed-data";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  const existing = await db.select({ id: schema.terms.id }).from(schema.terms).limit(1);
  if (existing.length > 0) {
    console.log("Already seeded, skip.");
    process.exit(0);
  }

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
  console.log(`terms: ${termRows.length}`);

  await db.insert(schema.announcements).values(announcementRows);
  console.log(`announcements: ${announcementRows.length}`);

  await db.insert(schema.guides).values(guideRows);
  console.log(`guides: ${guideRows.length}`);

  await db.insert(schema.events).values(eventRows);
  console.log(`events: ${eventRows.length}`);

  await db.insert(schema.members).values(memberRows);
  console.log(`members: ${memberRows.length}`);

  console.log("Done.");
  process.exit(0);
}

seed();
