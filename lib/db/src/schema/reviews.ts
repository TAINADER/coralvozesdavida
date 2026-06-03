import { pgTable, serial, integer, text, smallint, timestamp } from "drizzle-orm/pg-core";
import { professionalsTable } from "./professionals";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  professionalId: integer("professional_id").notNull().references(() => professionalsTable.id, { onDelete: "cascade" }),
  reviewerName: text("reviewer_name").notNull().default("Anônimo"),
  rating: smallint("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Review = typeof reviewsTable.$inferSelect;
export type InsertReview = typeof reviewsTable.$inferInsert;
