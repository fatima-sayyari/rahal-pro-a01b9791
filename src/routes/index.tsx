import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plane, Hotel, Palmtree, Briefcase, ShieldCheck,
  Star, MapPin, Phone, Mail, Instagram, Twitter,
  Facebook, ArrowLeft, Sparkles, Globe, Send, User,
} from "lucide-react";
import { WorldMap } from "@/components/WorldMap";
import { HeroPlane } from "@/components/HeroPlane";
import logo from "@/assets/logo.jpeg";
import dubai from "@/assets/dest-dubai.jpg";
import maldives from "@/assets/dest-maldives.jpg";
import istanbul from "@/assets/dest-istanbul.jpg";
import paris from "@/assets/dest-paris.jpg";
import makkah from "@/assets/dest-makkah.jpg";
import bali from "@/assets/dest-bali.jpg";

export const Route = createFileRoute("/")({ component: Index });

const services = [
  { icon: Plane,     title: "رحلات الطيران", desc: "أفضل العروض على الدرجة الاقتصادية ورجال الأعمال.", anim: "plane-icon" },
  { icon: Hotel,     title: "الفنادق",       desc: "أكثر من 2 مليون فندق حول العالم بأسعار حصرية.", anim: "bed-icon" },
  { icon: Palmtree,  title: "الباقات السياحية", desc: "باقات مصممة بعناية لتجربة سفر لا تُنسى.", anim: "palm-icon" },
  { icon: Briefcase, title: "الخدمات العامة",  desc: "تأشيرات، تأمين سفر، نقل خاص وتوصيل أمتعة.", anim: "luggage-icon" },
];

const destinations = [
  { img: dubai,    name: "دبي",      country: "الإمارات" },
  { img: maldives, name: "المالديف", country: "آسيا" },
  { img: istanbul, name: "إسطنبول",  country: "تركيا" },
  { img: paris,    name: "باريس",    country: "فرنسا" },
  { img: makkah,   name: "مكة المكرمة", country: "السعودية" },
  { img: bali,     name: "بالي",     country: "إندونيسيا" },
];

const initialReviews = [
  { name: "نورة العتيبي", role: "مسافرة دائمة", text: "تجربة حجز سلسة ودعم على مدار الساعة. الرحال برو وفّر لي رحلة العمر إلى المالديف بأقل من المتوقع.", rating: 5 },
  { name: "خالد الزهراني", role: "رجل أعمال",    text: "أحجز كل رحلات أعمالي عبر المنصة منذ سنتين، الواجهة فاخرة والعمليات في غاية الاحترافية.", rating: 5 },
  { name: "سارة الحربي",   role: "مدوّنة سفر",   text: "الباقات السياحية فعلاً مدروسة بعناية. كل التفاصيل مهتم بها — حتى التوصيل من المطار.", rating: 5 },
];

function Index() {
  return (
    <main className="relative overflow-x-clip">
      <Nav />
      <Hero />
      <Services />
      <JourneyPath />
      <Destinations />
      <Reviews />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="الرحال برو" className="w-10 h-10 rounded-lg object-cover" />
          <span className="gold-text text-lg font-bold">الرحال برو</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#services" className="hover:text-amber-300 transition">خدماتنا</a>
          <a href="#destinations" className="hover:text-amber-300 transition">الوجهات</a>
          <a href="#reviews" className="hover:text-amber-300 transition">آراء العملاء</a>
        </nav>
        <Link to="/login" className="gold-border px-5 py-2 rounded-lg text-sm font-semibold text-amber-200 hover:glow-gold transition">
          تسجيل الدخول
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return <HeroPlane />;
}

function Trust({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-amber-400" />
      <span>{text}</span>
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="خدماتنا" title="كل ما تحتاجه للسفر" desc="باقة متكاملة من الخدمات المصممة بأعلى معايير الفخامة والدقة." />
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div key={i} className="service-card group gold-border rounded-2xl p-6 hover:glow-gold transition-all duration-500 hover:-translate-y-2">
              <div className="icon-wrap inline-flex w-14 h-14 items-center justify-center rounded-xl mb-5"
                   style={{ background: "linear-gradient(135deg,rgba(244,210,122,.15),rgba(182,125,42,.1))", border: "1px solid rgba(244,210,122,.3)" }}>
                <s.icon className={`w-7 h-7 text-amber-300 ${s.anim}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-5 flex items-center gap-2 text-amber-300 text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                اكتشف المزيد <ArrowLeft className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyPath() {
  return (
    <section className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeader eyebrow="خط السفر السريع" title="رحلتك تبدأ من هنا" desc="من نقطة الانطلاق إلى الوجهة الأخيرة، كل محطة مرسومة بعناية على خط سفرنا الذكي." align="start" />
          <div className="mt-8 space-y-4">
            {[
              { step: "01", t: "اختر وجهتك", d: "تصفّح آلاف الوجهات حول العالم." },
              { step: "02", t: "خصّص رحلتك", d: "فنادق، طيران، خدمات إضافية بنقرة." },
              { step: "03", t: "ادفع بأمان", d: "بوابات دفع مشفّرة بمعايير عالمية." },
              { step: "04", t: "استمتع", d: "دعم على مدار الساعة طوال رحلتك." },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4 gold-border rounded-xl p-4">
                <div className="text-2xl font-black gold-text shrink-0 w-12">{s.step}</div>
                <div>
                  <div className="font-bold">{s.t}</div>
                  <div className="text-sm text-muted-foreground">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[500px]">
          <svg viewBox="0 0 400 500" className="w-full h-full">
            <defs>
              <linearGradient id="track" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f6e3a3"/>
                <stop offset="100%" stopColor="#b67d2a"/>
              </linearGradient>
              <filter id="g2"><feGaussianBlur stdDeviation="3"/></filter>
            </defs>
            <path d="M50 20 C 350 100, 50 250, 350 350 S 50 480, 200 500"
                  stroke="url(#track)" strokeWidth="10" fill="none" opacity=".25" filter="url(#g2)"/>
            <path d="M50 20 C 350 100, 50 250, 350 350 S 50 480, 200 500"
                  stroke="url(#track)" strokeWidth="3" fill="none" strokeDasharray="6 6" className="path-trail"/>

            {[[80,80],[330,180],[80,300],[330,420]].map(([x,y],i)=>(
              <g key={i}>
                <circle cx={x} cy={y} r="14" fill="#1a1410" stroke="url(#track)" strokeWidth="2"/>
                <g transform={`translate(${x-8},${y-8}) scale(.7)`} fill="#f4d27a">
                  <path d="M10 22 q-1 -12 3 -22 q-6 4 -9 11 q7 -3 9 -11 q2 9 9 12 q-4 -8 -9 -11 q6 -1 11 4 q-4 -7 -11 -5 z M11 22 l1 -22 l-1 0 z"/>
                </g>
              </g>
            ))}

            <text x="200" y="260" textAnchor="middle" className="fill-amber-200" fontSize="20" fontWeight="700">
              رحلتك تبدأ من هنا
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

function Destinations() {
  return (
    <section id="destinations" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="وجهات مختارة" title="وجهات لا تُنسى" desc="اكتشف أجمل الوجهات التي اختارها خبراؤنا بعناية." />
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((d, i) => (
            <article key={i} className="dest-card group relative rounded-2xl overflow-hidden gold-border bg-card/40">
              <div className="handle absolute top-3 left-1/2 -translate-x-1/2 w-20 h-7 border-[5px] rounded-t-full z-10"
                   style={{ borderColor: "#d9a441", borderBottom: "none", boxShadow: "0 0 12px rgba(217,164,65,.6)" }} />
              <div className="overflow-hidden h-72">
                <img src={d.img} alt={d.name} loading="lazy" width={1024} height={1024}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 z-10">
                <h3 className="font-black text-2xl gold-text">{d.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> {d.country}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [list, setList] = useState(initialReviews);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  const valid = name.trim().length >= 2 && text.trim().length >= 10;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setList([{ name: name.trim(), role: "عميل", text: text.trim(), rating }, ...list]);
    setName(""); setText(""); setRating(5);
  };

  return (
    <section id="reviews" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="آراء عملائنا" title="رضاهم هو إنجازنا" desc="آلاف المسافرين يثقون بنا في كل رحلة." />

        {/* Review form */}
        <div className="mt-12 brushed-metal rounded-3xl p-1 glow-gold max-w-3xl mx-auto">
          <form onSubmit={submit} className="bg-card/85 backdrop-blur-xl rounded-[22px] p-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: "linear-gradient(135deg,rgba(244,210,122,.15),rgba(182,125,42,.1))", border: "1px solid rgba(244,210,122,.3)" }}>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg">شاركنا تجربتك</h3>
                <p className="text-xs text-muted-foreground">رأيك يهمّنا ويساعد المسافرين الآخرين</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs text-muted-foreground mb-1.5 block">اسمك</span>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/70" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محمد العتيبي"
                    maxLength={60}
                    className="w-full bg-background/60 border border-amber-500/30 rounded-xl pr-10 pl-3 py-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition"
                  />
                </div>
              </label>

              <div>
                <span className="text-xs text-muted-foreground mb-1.5 block">تقييمك</span>
                <div className="flex items-center gap-1 bg-background/60 border border-amber-500/30 rounded-xl px-3 py-3"
                     onMouseLeave={() => setHover(0)}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const v = i + 1;
                    const active = (hover || rating) >= v;
                    return (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setRating(v)}
                        onMouseEnter={() => setHover(v)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star className={`w-6 h-6 ${active ? "fill-amber-400 text-amber-400" : "text-amber-500/30"}`} />
                      </button>
                    );
                  })}
                  <span className="mr-auto text-xs text-muted-foreground">{rating}/5</span>
                </div>
              </div>
            </div>

            <label className="block">
              <span className="text-xs text-muted-foreground mb-1.5 block">تقييمك بالتفصيل</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="اكتب رأيك عن تجربتك مع الرحال برو..."
                maxLength={500}
                rows={4}
                className="w-full bg-background/60 border border-amber-500/30 rounded-xl px-4 py-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition resize-none"
              />
              <div className="text-[11px] text-muted-foreground mt-1 text-left">{text.length}/500</div>
            </label>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                يتم مراجعة التقييمات قبل النشر
              </div>
              <button
                type="submit"
                disabled={!valid}
                className="rounded-xl font-bold text-background px-7 py-3 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#f6e3a3,#d9a441,#b67d2a)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  أرسل تقييمك <Send className="w-4 h-4" />
                </span>
                <span className="absolute inset-0 shimmer" />
              </button>
            </div>
          </form>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {list.map((r, i) => (
            <div key={i} className="gold-border rounded-2xl p-7 bg-card/40 backdrop-blur-sm">
              <div className="flex gap-1 mb-4">
                {Array.from({length:5}).map((_,j)=>(
                  <Star key={j} className={`w-4 h-4 ${j < r.rating ? "fill-amber-400 text-amber-400" : "text-amber-500/30"}`}/>
                ))}
              </div>
              <p className="text-foreground/90 leading-relaxed">{r.text}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-background"
                     style={{ background: "linear-gradient(135deg,#f6e3a3,#b67d2a)" }}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="brushed-metal mt-12 border-t border-amber-500/30">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="الرحال برو" className="w-12 h-12 rounded-lg" />
            <div>
              <div className="gold-text font-black text-lg">الرحال برو</div>
              <div className="text-[11px] text-muted-foreground">للتسفيرات و الخدمات العامة</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            منصة سفر متكاملة بمعايير فاخرة، نخدم آلاف العملاء حول المنطقة.
          </p>
        </div>

        <FooterCol title="روابط سريعة" items={["الرئيسية","خدماتنا","الوجهات","الباقات","تواصل معنا"]} />
        <FooterCol title="الدعم"        items={["الأسئلة الشائعة","سياسة الخصوصية","الشروط والأحكام","سياسة الاسترداد"]} />

        <div>
          <div className="font-bold mb-4 text-amber-200">تواصل معنا</div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-400"/> +966 50 000 0000</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-400"/> info@rahhalpro.sa</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400"/> الرياض، المملكة العربية السعودية</div>
          </div>
          <div className="mt-5 flex gap-3">
            {[Instagram, Twitter, Facebook].map((I, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-lg gold-border flex items-center justify-center text-amber-300 hover:glow-gold transition">
                <I className="w-4 h-4"/>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-amber-500/20 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} الرحال برو. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-bold mb-4 text-amber-200">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((it) => (
          <li key={it}><a href="#" className="hover:text-amber-300 transition">{it}</a></li>
        ))}
      </ul>
    </div>
  );
}

function SectionHeader({ eyebrow, title, desc, align = "center" }: any) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/5 text-amber-300 text-xs mb-4">
        <Sparkles className="w-3 h-3" /> {eyebrow}
      </div>
      <h2 className="text-4xl md:text-5xl font-black"><span className="gold-text">{title}</span></h2>
      <p className="mt-4 text-muted-foreground">{desc}</p>
    </div>
  );
}
