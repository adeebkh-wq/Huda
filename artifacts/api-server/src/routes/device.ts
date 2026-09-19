import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, deviceSessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/** Register (or transfer) the active device for a user.
 *  POST /api/device/register   { deviceId: string }
 *  Requires Bearer token from Clerk.
 */
router.post("/register", async (req, res) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { deviceId } = req.body as { deviceId?: string };
  if (!deviceId) {
    res.status(400).json({ error: "deviceId is required" });
    return;
  }

  try {
    await db
      .insert(deviceSessionsTable)
      .values({ userId, deviceId, lastSeenAt: new Date() })
      .onConflictDoUpdate({
        target: deviceSessionsTable.userId,
        set: { deviceId, lastSeenAt: new Date() },
      });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to register device" });
  }
});

/** Check whether the given deviceId is the current active device for this user.
 *  GET /api/device/check?deviceId=xxx
 *  Requires Bearer token from Clerk.
 */
router.get("/check", async (req, res) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { deviceId } = req.query as { deviceId?: string };
  if (!deviceId) {
    res.status(400).json({ error: "deviceId query param is required" });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(deviceSessionsTable)
      .where(eq(deviceSessionsTable.userId, userId))
      .limit(1);

    if (rows.length === 0) {
      res.json({ isActive: false, reason: "no_device_registered" });
      return;
    }

    res.json({ isActive: rows[0].deviceId === deviceId });
  } catch (err) {
    res.status(500).json({ error: "Failed to check device" });
  }
});

export default router;
