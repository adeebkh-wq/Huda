import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const couponCodesTable = pgTable("coupon_codes", {
  code:          text("code").primaryKey(),
  description:   text("description").notNull(),            // e.g. "1 month free"
  freeMonths:    integer("free_months").notNull(),          // months of access granted
  maxUses:       integer("max_uses").notNull().default(100),
  usedCount:     integer("used_count").notNull().default(0),
  expiresAt:     timestamp("expires_at", { withTimezone: true }),   // null = never
  isActive:      boolean("is_active").notNull().default(true),
  createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const couponRedemptionsTable = pgTable("coupon_redemptions", {
  id:            serial("id").primaryKey(),
  couponCode:    text("coupon_code").notNull().references(() => couponCodesTable.code),
  userId:        text("user_id").notNull(),
  redeemedAt:    timestamp("redeemed_at", { withTimezone: true }).notNull().defaultNow(),
  accessUntil:   timestamp("access_until", { withTimezone: true }).notNull(),
});

export type CouponCode       = typeof couponCodesTable.$inferSelect;
export type CouponRedemption = typeof couponRedemptionsTable.$inferSelect;
