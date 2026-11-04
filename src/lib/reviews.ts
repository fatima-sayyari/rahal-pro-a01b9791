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

export type PendingReview = Review & { status: "pending" | "approved" | "rejected" };

async function adminPassword(): Promise<string | null> {
  const { env } = await import("cloudflare:workers");
  const password = (env as unknown as { ADMIN_PASSWORD?: string }).ADMIN_PASSWORD?.trim();
  return password ? password : null;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function adminToken(password: string): Promise<string> {
  return sha256(`rahal-admin-session:${password}`);
}

async function assertAdmin(): Promise<void> {
  const password = await adminPassword();
  if (!password) throw new Error("صفحة الموافقة غير مهيأة بعد");
  const { getCookie } = await import("@tanstack/react-start/server");
  const cookie = getCookie("rahal_admin");
  const expected = await adminToken(password);
  if (!cookie || !safeEqual(cookie, expected)) throw new Error("يلزم تسجيل الدخول");
}

export const adminSession = createServerFn({ method: "GET" }).handler(async () => {
  try {
    await assertAdmin();
    return { ok: true as const };
  } catch {
    return { ok: false as const };
  }
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().min(1).max(100) }).parse(d))
  .handler(async ({ data }) => {
    const password = await adminPassword();
    if (!password) throw new Error("صفحة الموافقة غير مهيأة بعد");
    const given = await sha256(`rahal-admin-check:${data.password}`);
    const expected = await sha256(`rahal-admin-check:${password}`);
    if (!safeEqual(given, expected)) throw new Error("كلمة المرور غير صحيحة");

    const { getRequestUrl, setCookie } = await import("@tanstack/react-start/server");
    setCookie("rahal_admin", await adminToken(password), {
      httpOnly: true,
      secure: getRequestUrl().protocol === "https:",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return { ok: true as const };
  });

export const listPendingReviews = createServerFn({ method: "GET" }).handler(async () => {
  await assertAdmin();
  const db = await getDB();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  const rows = await db
    .prepare("SELECT id, name, service, rating, comment, status, created_at FROM reviews WHERE status = 'pending' ORDER BY created_at DESC LIMIT 50")
    .all<PendingReview>();
  return { reviews: rows.results };
});

export const moderateReview = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ id: z.number().int().positive(), status: z.enum(["approved", "rejected"]) }).parse(d),
  )
  .handler(async ({ data }) => {
    await assertAdmin();
    const db = await getDB();
    if (!db) throw new Error("قاعدة البيانات غير متاحة");
    await db.prepare("UPDATE reviews SET status = ? WHERE id = ?").bind(data.status, data.id).run();
    return { ok: true as const };
  });
