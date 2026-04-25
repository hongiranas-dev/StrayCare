import { Router, type IRouter } from "express";
import { eq, desc, sql, gte } from "drizzle-orm";
import { db, reportsTable } from "@workspace/db";
import {
  CreateReportBody,
  UpdateReportBody,
  UpdateReportParams,
  GetReportParams,
  DeleteReportParams,
  GetReportResponse,
  ListReportsResponse,
  UpdateReportResponse,
  GetReportsSummaryResponse,
  GetRecentReportsResponse,
  GetRecentReportsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reports", async (_req, res): Promise<void> => {
  const reports = await db
    .select()
    .from(reportsTable)
    .orderBy(desc(reportsTable.createdAt));
  res.json(ListReportsResponse.parse(reports));
});

router.post("/reports", async (req, res): Promise<void> => {
  const parsed = CreateReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [report] = await db
    .insert(reportsTable)
    .values({
      location: parsed.data.location,
      description: parsed.data.description,
      imagePath: parsed.data.imagePath ?? null,
      status: "reported",
    })
    .returning();

  res.status(201).json(GetReportResponse.parse(report));
});

router.get("/reports/stats/summary", async (_req, res): Promise<void> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [stats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      reported: sql<number>`count(*) filter (where ${reportsTable.status} = 'reported')::int`,
      inProgress: sql<number>`count(*) filter (where ${reportsTable.status} = 'in_progress')::int`,
      rescued: sql<number>`count(*) filter (where ${reportsTable.status} = 'rescued')::int`,
      last7Days: sql<number>`count(*) filter (where ${reportsTable.createdAt} >= ${sevenDaysAgo.toISOString()})::int`,
    })
    .from(reportsTable);

  res.json(
    GetReportsSummaryResponse.parse({
      total: stats?.total ?? 0,
      reported: stats?.reported ?? 0,
      inProgress: stats?.inProgress ?? 0,
      rescued: stats?.rescued ?? 0,
      last7Days: stats?.last7Days ?? 0,
    }),
  );
});

router.get("/reports/recent", async (req, res): Promise<void> => {
  const parsed = GetRecentReportsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const limit = parsed.data.limit ?? 5;

  const reports = await db
    .select()
    .from(reportsTable)
    .orderBy(desc(reportsTable.createdAt))
    .limit(limit);

  res.json(GetRecentReportsResponse.parse(reports));
});

router.get("/reports/:id", async (req, res): Promise<void> => {
  const params = GetReportParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [report] = await db
    .select()
    .from(reportsTable)
    .where(eq(reportsTable.id, params.data.id));

  if (!report) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  res.json(GetReportResponse.parse(report));
});

router.patch("/reports/:id", async (req, res): Promise<void> => {
  const params = UpdateReportParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: { status?: string } = {};
  if (parsed.data.status) updates.status = parsed.data.status;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No updates provided" });
    return;
  }

  const [report] = await db
    .update(reportsTable)
    .set(updates)
    .where(eq(reportsTable.id, params.data.id))
    .returning();

  if (!report) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  res.json(UpdateReportResponse.parse(report));
});

router.delete("/reports/:id", async (req, res): Promise<void> => {
  const params = DeleteReportParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [report] = await db
    .delete(reportsTable)
    .where(eq(reportsTable.id, params.data.id))
    .returning();

  if (!report) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  res.status(204).send();
});

export default router;
