import type { CreateReviewInput, Review } from "./types";

type ReviewRow = {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  created_at: string;
};

async function getDb() {
  const { env } = await import("cloudflare:workers");
  const db = env.DB;
  if (!db) {
    throw new Error("قاعدة بيانات التقييمات غير متصلة. تأكد من إعداد D1 في wrangler.jsonc.");
  }
  return db;
}

function mapRow(row: ReviewRow): Review {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    text: row.text,
    rating: row.rating,
    createdAt: row.created_at,
  };
}

export async function listApprovedReviews(limit = 50): Promise<Review[]> {
  const result = await (await getDb())
    .prepare(
      `SELECT id, name, role, text, rating, created_at
       FROM reviews
       WHERE status = 'approved'
       ORDER BY datetime(created_at) DESC
       LIMIT ?`,
    )
    .bind(limit)
    .all<ReviewRow>();

  return (result.results ?? []).map(mapRow);
}

export async function insertReview(input: CreateReviewInput): Promise<number> {
  const result = await (await getDb())
    .prepare(
      `INSERT INTO reviews (name, text, rating, status)
       VALUES (?, ?, ?, 'pending')`,
    )
    .bind(input.name.trim(), input.text.trim(), input.rating)
    .run();

  return Number(result.meta.last_row_id);
}
