import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const photosTable = pgTable("photos", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  isHighlight: boolean("is_highlight").notNull().default(false),
});

export const insertPhotoSchema = createInsertSchema(photosTable).omit({ id: true });
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photosTable.$inferSelect;
