import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { adminLogin, adminSession, listPendingReviews, moderateReview } from "@/lib/reviews";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({
    meta: [
      { title: "موافقة التعليقات — الرحال برو" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminReviewsPage,
});

const field =
  "w-full rounded-xl bg-background/60 border border-amber-500/30 px-4 py-3 text-sm outline-none focus:border-amber-300 transition";

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-4 h-4 ${i <= value ? "fill-amber-300 text-amber-300" : "text-amber-500/30"}`} />
      ))}
    </span>
  );
}

function AdminReviewsPage() {
  const qc = useQueryClient();
  const session = useQuery({ queryKey: ["admin-session"], queryFn: () => adminSession() });
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const login = useMutation({
    mutationFn: () => adminLogin({ data: { password } }),
    onSuccess: () => {
      setErr("");
      setPassword("");
      qc.invalidateQueries({ queryKey: ["admin-session"] });
    },
    onError: (e: unknown) => setErr(e instanceof Error ? e.message : "تعذر تسجيل الدخول"),
  });

  if (!session.data?.ok) {
    return (
      <main className="min-h-screen px-4 py-24">
        <form
          className="gold-border mx-auto max-w-md space-y-4 rounded-2xl bg-card/40 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setErr("");
            login.mutate();
          }}
        >
          <h1 className="text-2xl font-black text-amber-200">موافقة التعليقات</h1>
          <p className="text-sm text-muted-foreground">أدخلي كلمة المرور لعرض التعليقات الجديدة.</p>
          <input
            className={field}
            type="password"
            autoComplete="current-password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-xl py-3 font-bold text-background disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#f6e3a3,#d9a441,#b67d2a)" }}
          >
            {login.isPending ? "جارٍ الدخول..." : "دخول"}
          </button>
          <Link to="/" className="block text-center text-sm text-amber-300">
            العودة للرئيسية
          </Link>
        </form>
      </main>
    );
  }

  return <ReviewQueue />;
}

function ReviewQueue() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["pending-reviews"], queryFn: () => listPendingReviews() });
  const [err, setErr] = useState("");

  const moderate = useMutation({
    mutationFn: (data: { id: number; status: "approved" | "rejected" }) => moderateReview({ data }),
    onSuccess: () => {
      setErr("");
      qc.invalidateQueries({ queryKey: ["pending-reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: unknown) => setErr(e instanceof Error ? e.message : "تعذر تحديث التعليق"),
  });

  const reviews = list.data?.reviews ?? [];

  return (
    <main className="min-h-screen px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-amber-200">تعليقات بانتظار الموافقة</h1>
          <Link to="/" className="text-sm text-amber-300">
            الرئيسية
          </Link>
        </div>
        {err && <p className="mt-4 text-sm text-red-400">{err}</p>}
        {list.isPending && <p className="mt-8 text-muted-foreground">جارٍ التحميل...</p>}
        {list.isError && <p className="mt-8 text-red-400">تعذر تحميل التعليقات. حدّثي الصفحة.</p>}
        {!list.isPending && reviews.length === 0 && (
          <p className="gold-border mt-8 rounded-2xl bg-card/40 p-8 text-center text-muted-foreground">
            لا توجد تعليقات جديدة.
          </p>
        )}
        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <article key={review.id} className="gold-border rounded-2xl bg-card/40 p-5">
              <div className="flex items-center justify-between gap-3">
                <strong className="text-amber-200">{review.name}</strong>
                <Stars value={review.rating} />
              </div>
              {review.service && <p className="mt-1 text-xs text-muted-foreground">{review.service}</p>}
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{review.comment}</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={moderate.isPending}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                  onClick={() => moderate.mutate({ id: review.id, status: "approved" })}
                >
                  قبول
                </button>
                <button
                  type="button"
                  disabled={moderate.isPending}
                  className="rounded-xl border border-red-400/50 px-4 py-2 text-sm font-bold text-red-300 disabled:opacity-60"
                  onClick={() => moderate.mutate({ id: review.id, status: "rejected" })}
                >
                  رفض
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
