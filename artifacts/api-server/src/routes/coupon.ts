import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, couponCodesTable, couponRedemptionsTable } from "@workspace/db";
import { eq, and, gt, sql } from "drizzle-orm";

const router = Router();

/**
 * GET /api/coupon/validate?code=XXXX
 * Public — no auth required.
 * Returns whether the code is valid and its description.
 */
router.get("/validate", async (req, res) => {
  const code = (req.query.code as string | undefined)?.toUpperCase().trim();
  if (!code) {
    res.status(400).json({ valid: false, error: "code is required" });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(couponCodesTable)
      .where(eq(couponCodesTable.code, code))
      .limit(1);

    if (rows.length === 0) {
      res.json({ valid: false, error: "Code not found" });
      return;
    }

    const coupon = rows[0];

    if (!coupon.isActive) {
      res.json({ valid: false, error: "This code is no longer active" });
      return;
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      res.json({ valid: false, error: "This code has expired" });
      return;
    }

    if (coupon.usedCount >= coupon.maxUses) {
      res.json({ valid: false, error: "This code has reached its usage limit" });
      return;
    }

    res.json({
      valid:       true,
      description: coupon.description,
      freeMonths:  coupon.freeMonths,
    });
  } catch {
    res.status(500).json({ valid: false, error: "Server error" });
  }
});

/**
 * POST /api/coupon/redeem   { code: string }
 * Requires Clerk auth.
 * Marks the code as used and creates a redemption record.
 */
router.post("/redeem", async (req, res) => {
  const auth   = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }

  const code = (req.body?.code as string | undefined)?.toUpperCase().trim();
  if (!code) {
    res.status(400).json({ ok: false, error: "code is required" });
    return;
  }

  try {
    // Check if user already has an active redemption
    const now = new Date();
    const existingRedemptions = await db
      .select()
      .from(couponRedemptionsTable)
      .where(
        and(
          eq(couponRedemptionsTable.userId, userId),
          gt(couponRedemptionsTable.accessUntil, now),
        ),
      )
      .limit(1);

    if (existingRedemptions.length > 0) {
      res.json({
        ok:          true,
        alreadyActive: true,
        accessUntil: existingRedemptions[0].accessUntil,
      });
      return;
    }

    // Check the coupon code is still valid
    const rows = await db
      .select()
      .from(couponCodesTable)
      .where(eq(couponCodesTable.code, code))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({ ok: false, error: "Code not found" });
      return;
    }

    const coupon = rows[0];

    if (!coupon.isActive || coupon.usedCount >= coupon.maxUses) {
      res.status(409).json({ ok: false, error: "Code is no longer valid" });
      return;
    }

    if (coupon.expiresAt && coupon.expiresAt < now) {
      res.status(409).json({ ok: false, error: "Code has expired" });
      return;
    }

    // Calculate access expiry
    const accessUntil = new Date(now);
    accessUntil.setMonth(accessUntil.getMonth() + coupon.freeMonths);

    // Atomically increment usedCount and insert redemption
    await db.transaction(async (tx) => {
      await tx
        .update(couponCodesTable)
        .set({ usedCount: sql`${couponCodesTable.usedCount} + 1` })
        .where(eq(couponCodesTable.code, code));

      await tx.insert(couponRedemptionsTable).values({
        couponCode:  code,
        userId,
        accessUntil,
      });
    });

    res.json({ ok: true, accessUntil, description: coupon.description });
  } catch (err) {
    console.error("Coupon redeem error:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

/**
 * GET /api/coupon/status
 * Requires Clerk auth.
 * Returns whether the user has an active coupon-granted subscription.
 */
router.get("/status", async (req, res) => {
  const auth   = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ active: false, error: "Unauthorized" });
    return;
  }

  try {
    const now = new Date();
    const rows = await db
      .select()
      .from(couponRedemptionsTable)
      .where(
        and(
          eq(couponRedemptionsTable.userId, userId),
          gt(couponRedemptionsTable.accessUntil, now),
        ),
      )
      .limit(1);

    if (rows.length === 0) {
      res.json({ active: false });
      return;
    }

    res.json({ active: true, accessUntil: rows[0].accessUntil });
  } catch {
    res.status(500).json({ active: false, error: "Server error" });
  }
});

export default router;
