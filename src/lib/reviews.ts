import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type Stmt = {
  bind: (...v: unknown[]) => Stmt;
  all: <T>() => Promise<{ results: T[] }>;
  first: <T>() => Promise<T | null>;
  run: () => Promise<unknown>;
};
type DB = { prepare: (q: string) => Stmt };

export type Review = { id: number; name: string; service: string; rating: number; comment: string; created_at: string };
export type ReviewsPayload = { reviews: Review[]; count: number; avg: number | null };

async function getDB(): Promise<DB | null> {
  // @ts-ignore — module متاح وقت التشغيل على Cloudflare فقط
  const { env } = await import("cloudflare:workers");
  return ((env as unknown as { DB?: DB }).DB) ?? null;
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const getReviews = createServerFn({ method: "GET" }).handler(async (): Promise<ReviewsPayload> => {
  const empty = { reviews: [], count: 0, avg: null };
  try {
    const db = await getDB();
    if (!db) return empty;
    const rows = await db
      .prepare("SELECT id, name, service, rating, comment, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 30")
      .all<Review>();
    const agg = await db
      .prepare("SELECT COUNT(*) AS count, ROUND(AVG(rating), 1) AS avg FROM reviews WHERE status = 'approved'")
      .first<{ count: number; avg: number | null }>();
    return { reviews: rows.results, count: agg?.count ?? 0, avg: agg?.avg ?? null };
  } catch (e) {
    console.error(e);
    return empty;
  }
});

const ReviewInput = z.object({
  name: z.string().trim().min(2, "اكتبي اسمك").max(60),
  service: z.string().trim().max(80).default(""),
  rating: z.number().int().min(1, "اختاري التقييم").max(5),
  comment: z.string().trim().min(10, "التعليق قصير جدًا").max(600, "التعليق طويل جدًا"),
  website: z.string().max(0).optional(), // حقل مخفي للحماية من البوتات
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ReviewInput.parse(d))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const }; // بوت: نتجاهل بصمت
    const db = await getDB();
    if (!db) throw new Error("خدمة التقييمات غير متاحة حاليًا");

    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = getRequestHeader("cf-connecting-ip") ?? "unknown";
    const ipHash = await sha256(`rahal-reviews:${ip}`);

    const recent = await db
      .prepare("SELECT COUNT(*) AS n FROM reviews WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')")
      .bind(ipHash)
      .first<{ n: number }>();
    if ((recent?.n ?? 0) >= 3) throw new Error("محاولات كثيرة، حاولي بعد قليل");

    await db
      .prepare("INSERT INTO reviews (name, service, rating, comment, ip_hash) VALUES (?, ?, ?, ?, ?)")
      .bind(data.name, data.service, data.rating, data.comment, ipHash)
      .run();
    return { ok: true as const };
  });
