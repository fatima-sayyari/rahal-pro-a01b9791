export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  createdAt: string;
};

export type CreateReviewInput = {
  name: string;
  text: string;
  rating: number;
};

export type CreateReviewResult = {
  ok: true;
  message: string;
};
