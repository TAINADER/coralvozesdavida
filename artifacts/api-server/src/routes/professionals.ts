import { Router } from "express";
import { db, professionalsTable, reviewsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { CreateProfessionalBody, ListProfessionalsQueryParams } from "@workspace/api-zod";
import { z } from "zod/v4";

const ReviewInputSchema = z.object({
  reviewerName: z.string().min(1).max(80).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

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
    const { query, lat, lng, radiusKm = 3 } = params;

    let results = await db.select().from(professionalsTable);

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.profession.toLowerCase().includes(q) ||
          (p.skills ?? []).some((s) => s.toLowerCase().includes(q)) ||
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
    const skills = (data as any).skills as string[] | undefined;
    const primaryProfession = skills && skills.length > 0 ? skills[0] : ((data as any).profession ?? "");
    const [created] = await db
      .insert(professionalsTable)
      .values({
        name: data.name,
        photoUrl: data.photoUrl ?? null,
        linkUrl: data.linkUrl ?? null,
        profession: primaryProfession,
        skills: skills ?? null,
        professionDetail: data.professionDetail ?? null,
        lessonType: data.lessonType ?? null,
        level: data.level,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        address: data.address ?? null,
        phone: data.phone ?? null,
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

router.put("/professionals/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [existing] = await db
      .select({ id: professionalsTable.id })
      .from(professionalsTable)
      .where(eq(professionalsTable.id, id));
    if (!existing) return res.status(404).json({ error: "Not found" });

    const data = req.body;
    const skills = data.skills as string[] | undefined;
    const primaryProfession = skills && skills.length > 0 ? skills[0] : (data.profession ?? "");

    const [updated] = await db
      .update(professionalsTable)
      .set({
        name: data.name,
        address: data.address ?? null,
        phone: data.phone ?? null,
        photoUrl: data.photoUrl ?? null,
        linkUrl: data.linkUrl ?? null,
        profession: primaryProfession,
        skills: skills ?? null,
        professionDetail: data.professionDetail ?? null,
        lessonType: data.lessonType ?? null,
        level: data.level,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
      })
      .where(eq(professionalsTable.id, id))
      .returning();

    res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to update professional" });
  }
});

router.get("/professionals/:id/reviews", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.professionalId, id))
      .orderBy(reviewsTable.createdAt);

    res.json(reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (err) {
    res.status(500).json({ error: "Failed to list reviews" });
  }
});

router.post("/professionals/:id/reviews", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [professional] = await db
      .select({ id: professionalsTable.id })
      .from(professionalsTable)
      .where(eq(professionalsTable.id, id));
    if (!professional) return res.status(404).json({ error: "Professional not found" });

    const parsed = ReviewInputSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid data", details: parsed.error.issues });

    const [created] = await db
      .insert(reviewsTable)
      .values({
        professionalId: id,
        reviewerName: parsed.data.reviewerName || "Anônimo",
        rating: parsed.data.rating,
        comment: parsed.data.comment ?? null,
      })
      .returning();

    res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to create review" });
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
