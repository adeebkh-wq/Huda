/**
 * Seeds initial coupon codes into the database.
 * Run:  pnpm --filter @workspace/scripts exec tsx src/seedCoupons.ts
 */
import { db, couponCodesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const INITIAL_COUPONS = [
  { code: "WELCOME30",  description: "1 month free",  freeMonths: 1,  maxUses: 1000 },
  { code: "EARLYBIRD",  description: "3 months free", freeMonths: 3,  maxUses: 500  },
  { code: "HUDA50",     description: "6 months free", freeMonths: 6,  maxUses: 200  },
  { code: "FOUNDER",    description: "1 year free",   freeMonths: 12, maxUses: 50   },
] as const;

async function seedCoupons() {
  console.log("Seeding coupon codes…");
  for (const coupon of INITIAL_COUPONS) {
    await db
      .insert(couponCodesTable)
      .values({ ...coupon, usedCount: 0, isActive: true })
      .onConflictDoNothing();
    console.log(`  ✓ ${coupon.code} — ${coupon.description}`);
  }
  console.log("Done.");
  process.exit(0);
}

seedCoupons().catch((e) => { console.error(e); process.exit(1); });
