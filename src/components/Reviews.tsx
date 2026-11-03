import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { services } from "@/data/services";
import { getReviews, submitReview } from "@/lib/reviews";

const field = "w-full rounded-xl bg-background/60 border border-amber-500/30 px-4 py-3 text-sm outline-none focus:border-amber-300 transition";

function Stars({ value, size = "w-4 h-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${size} ${i <= Math.round(value) ? "fill-amber-300 text-amber-300" : "text-amber-500/30"}`} />
      ))}
    </span>
  );
}

export function Reviews() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["reviews"], queryFn: () => getReviews() });
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [err, setErr] = useState("");

  const m = useMutation({
    mutationFn: (d: { name: string; service: string; rating: number; comment: string; website: string }) => submitReview({ data: d }),
    onSuccess: () => {
      setName(""); setService(""); setRating(0); setComment(""); setErr("");
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: unknown) => setErr(e instanceof Error ? e.message : "حدث خطأ، حاولي مرة أخرى"),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) { setErr("اختاري عدد النجوم"); return; }
    setErr("");
    m.mutate({ name, service, rating, comment, website });
  };

  return (
    <section id="reviews" className="scroll-mt-20 py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl font-black"><span className="gold-text">آراء عملائنا</span></h2>
          {data && data.count > 0 && data.avg != null && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Stars value={data.avg} size="w-6 h-6" />
              <span className="text-lg font-bold">{data.avg}</span>
              <span className="text-sm text-muted-foreground">({data.count} تقييم)</span>
            </div>
          )}
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            {data && data.reviews.length > 0 ? (
              data.reviews.map((r) => (
                <figure key={r.id} className="gold-border rounded-2xl p-5 bg-card/40">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold gold-text">{r.name}</span>
                    <Stars value={r.rating} />
                  </div>
                  {r.service && <div className="text-xs text-muted-foreground mt-1">{r.service}</div>}
                  <blockquote className="mt-3 text-sm leading-relaxed whitespace-pre-line break-words">{r.comment}</blockquote>
                  <figcaption className="mt-3 text-[11px] text-muted-foreground">
                    {new Date(r.created_at.replace(" ", "T") + "Z").toLocaleDateString("ar")}
                  </figcaption>
                </figure>
              ))
            ) : (
              <div className="gold-border rounded-2xl p-8 text-center text-muted-foreground bg-card/40">
                لا توجد تقييمات بعد — كوني أول من يشاركنا رأيه.
              </div>
            )}
          </div>

          <form onSubmit={submit} className="gold-border rounded-2xl p-5 sm:p-6 space-y-4 bg-card/40">
            <h3 className="font-bold text-lg text-amber-200">أضف تقييمك</h3>
            <input className={field} placeholder="الاسم" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} required />
            <select className={field} value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">الخدمة (اختياري)</option>
              {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
            </select>
            <div className="flex items-center gap-1" role="radiogroup" aria-label="التقييم">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} type="button" role="radio" aria-checked={rating === i} aria-label={`${i} نجوم`} onClick={() => setRating(i)}>
                  <Star className={`w-8 h-8 transition ${i <= rating ? "fill-amber-300 text-amber-300" : "text-amber-500/40 hover:text-amber-300"}`} />
                </button>
              ))}
            </div>
            <textarea className={field} rows={4} placeholder="اكتبي تعليقك (10 أحرف على الأقل)" value={comment} maxLength={600} minLength={10} onChange={(e) => setComment(e.target.value)} required />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
            {err && <p className="text-sm text-red-400" role="alert">{err}</p>}
            {m.isSuccess && !err && <p className="text-sm text-emerald-400" role="status">شكرًا لك! تقييمك قيد المراجعة وسيظهر بعد الموافقة عليه.</p>}
            <button type="submit" disabled={m.isPending} className="w-full rounded-xl py-3 font-bold text-background disabled:opacity-60" style={{ background: "linear-gradient(135deg,#f6e3a3,#d9a441,#b67d2a)" }}>
              {m.isPending ? "جارٍ الإرسال..." : "إرسال التقييم"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
