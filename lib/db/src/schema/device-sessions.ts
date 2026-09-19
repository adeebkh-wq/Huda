import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const deviceSessionsTable = pgTable("device_sessions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  deviceId: text("device_id").notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DeviceSession = typeof deviceSessionsTable.$inferSelect;
export type InsertDeviceSession = typeof deviceSessionsTable.$inferInsert;
