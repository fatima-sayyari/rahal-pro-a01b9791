import { useState } from "react";
import { services, WHATSAPP } from "@/data/services";

const field =
  "w-full rounded-xl bg-background/60 border border-amber-500/30 px-4 py-3 text-sm outline-none focus:border-amber-300 transition";

export function RequestForm({ defaultService = "" }: { defaultService?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(defaultService);
  const [notes, setNotes] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      "السلام عليكم، أرغب في طلب خدمة من الرحال برو:",
      `الاسم: ${name}`,
      `رقم التواصل: ${phone}`,
      `الخدمة: ${service}`,
      notes ? `ملاحظات: ${notes}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <section id="request" className="scroll-mt-20 py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-4xl font-black"><span className="gold-text">اطلب خدمتك</span></h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            املئي البيانات وسيصلنا طلبك على واتساب مباشرة، وسنتواصل معك في أقرب وقت.
          </p>
        </div>
        <form onSubmit={submit} className="gold-border rounded-2xl p-5 sm:p-8 space-y-4 bg-card/40">
          <input className={field} placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className={field} placeholder="رقم الهاتف / واتساب" type="tel" dir="ltr" style={{ textAlign: "right" }}
                 value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <select className={field} value={service} onChange={(e) => setService(e.target.value)} required>
            <option value="" disabled>اختاري الخدمة</option>
            {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
          </select>
          <textarea className={field} rows={4} placeholder="ملاحظات إضافية (اختياري)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button type="submit" className="w-full rounded-xl py-3.5 font-bold text-background hover:scale-[1.01] transition"
                  style={{ background: "linear-gradient(135deg,#f6e3a3,#d9a441,#b67d2a)" }}>
            إرسال الطلب عبر واتساب
          </button>
        </form>
      </div>
    </section>
  );
}
