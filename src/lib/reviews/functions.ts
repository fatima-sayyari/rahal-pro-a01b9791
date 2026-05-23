import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { insertReview, listApprovedReviews } from "./db.server";
import type { CreateReviewResult, Review } from "./types";

const createReviewSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جداً").max(60),
  text: z.string().trim().min(10, "التقييم قصير جداً").max(500),
  rating: z.number().int().min(1).max(5),
});

export const getReviewsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<Review[]> => listApprovedReviews(),
);

export const createReviewFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createReviewSchema.parse(data))
  .handler(async ({ data }): Promise<CreateReviewResult> => {
    await insertReview(data);
    return {
      ok: true,
      message: "شكراً! تم استلام تقييمك وسيُنشر بعد المراجعة.",
    };
  });
