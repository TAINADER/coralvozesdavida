import { Router } from "express";
import { db, professionalsTable } from "@workspace/db";
import { eq, ilike, or, sql } from "drizzle-orm";
import { CreateProfessionalBody, ListProfessionalsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/professionals/stats", async (_req, res) => {
  try {
    const [total] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(professionalsTable);

    const professions = await db
      .selectDistinct({ profession: professionalsTable.profession })
      .from(professionalsTable);

    const [recent] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(professionalsTable)
      .where(sql`created_at > now() - interval '7 days'`);

    res.json({
      totalProfessionals: total.count,
      totalProfessions: professions.length,
      recentlyAdded: recent.count,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/professionals", async (req, res) => {
  try {
    const parsed = ListProfessionalsQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};
    const { query, lat, lng, radiusKm = 1 } = params;

    let results = await db.select().from(professionalsTable);

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.profession.toLowerCase().includes(q) ||
          (p.professionDetail?.toLowerCase().includes(q) ?? false)
      );
    }

    if (lat != null && lng != null) {
      const radiusKmNum = Number(radiusKm);
      results = results.filter((p) => {
        if (p.lat == null || p.lng == null) return true;
        const dist = haversineKm(lat, lng, p.lat, p.lng);
        return dist <= radiusKmNum;
      });

      results = results.map((p) => ({
        ...p,
        _distance: p.lat != null && p.lng != null ? haversineKm(lat, lng, p.lat, p.lng) : 9999,
      })) as typeof results;

      results.sort((a: any, b: any) => (a._distance ?? 9999) - (b._distance ?? 9999));
    }

    res.json(results.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to list professionals" });
  }
});

router.post("/professionals", async (req, res) => {
  try {
    const parsed = CreateProfessionalBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    }

    const data = parsed.data;
    const [created] = await db
      .insert(professionalsTable)
      .values({
        name: data.name,
        photoUrl: data.photoUrl ?? null,
        linkUrl: data.linkUrl ?? null,
        profession: data.profession,
        professionDetail: data.professionDetail ?? null,
        lessonType: data.lessonType ?? null,
        level: data.level,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        address: data.address ?? null,
      })
      .returning();

    res.status(201).json({
      ...created,
      createdAt: created.createdAt.toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create professional" });
  }
});

router.get("/professionals/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [found] = await db
      .select()
      .from(professionalsTable)
      .where(eq(professionalsTable.id, id));

    if (!found) return res.status(404).json({ error: "Not found" });

    res.json({ ...found, createdAt: found.createdAt.toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to get professional" });
  }
});

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default router;
