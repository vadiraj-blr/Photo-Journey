import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { tripsTable } from "./trips";

export const tripCommentsTable = pgTable("trip_comments", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull().references(() => tripsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tripReactionsTable = pgTable("trip_reactions", {
  id: serial("id").primaryKey(),
  tripId: integer("trip_id").notNull().unique().references(() => tripsTable.id, { onDelete: "cascade" }),
  likes: integer("likes").notNull().default(0),
  dislikes: integer("dislikes").notNull().default(0),
});

export type TripComment = typeof tripCommentsTable.$inferSelect;
export type TripReaction = typeof tripReactionsTable.$inferSelect;
