import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tripsTable = pgTable("trips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  country: text("country").notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  story: text("story"),
  coverImageUrl: text("cover_image_url").notNull(),
  photoCount: integer("photo_count").notNull().default(0),
  tags: text("tags").notNull().default("[]"),
  featured: boolean("featured").notNull().default(false),
  googlePhotosUrl: text("google_photos_url"),
});

export const insertTripSchema = createInsertSchema(tripsTable).omit({ id: true });
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof tripsTable.$inferSelect;
