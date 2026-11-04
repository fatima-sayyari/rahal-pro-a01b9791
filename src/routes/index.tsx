import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle, MapPin, Phone, Mail, Sparkles,
} from "lucide-react";
import { services, faqs } from "@/data/services";
import { JourneyScene } from "@/components/JourneyScene";
import { Reviews } from "@/components/Reviews";
import { RequestForm } from "@/components/RequestForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import logo from "@/assets/logo.jpeg";
import dubai from "@/assets/dest-dubai.jpg";
import maldives from "@/assets/dest-maldives.jpg";
import istanbul from "@/assets/dest-istanbul.jpg";
import paris from "@/assets/dest-paris.jpg";
import makkah from "@/assets/dest-makkah.jpg";
import bali from "@/assets/dest-bali.jpg";

export const Route = createFileRoute("/")({ component: Index });

const destinations = [
  { img: dubai,    name: "دبي",      country: "الإمارات" },
  { img: maldives, name: "المالديف", country: "آسيا" },
  { img: istanbul, name: "إسطنبول",  country: "تركيا" },
  { img: paris,    name: "باريس",    country: "فرنسا" },
  { img: makkah,   name: "مكة المكرمة", country: "السعودية" },
  { img: bali,     name: "بالي",     country: "إندونيسيا" },
];

function Index() {
  return (
    <main className="relative overflow-x-clip">
      <Nav />
      <Hero />
      <Services />
      <JourneyScene />
      <Destinations />
      <Reviews />
      <Faq />
      <RequestForm />
      <Footer />
    </main>
  );
}

const navLink =
  "inline-flex min-h-11 items-center text-sm text-[#A89F90] transition-colors duration-200 hover:text-[#EDE6D8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4E4BC]";

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#4E3518] bg-[#0C0A08]">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-3">
        <nav className="hidden items-center justify-start gap-6 md:flex" aria-label="التنقل الرئيسي">
          <a href="#services" className={navLink}>خدماتنا</a>
          <a href="#destinations" className={navLink}>الوجهات</a>
          <a href="#faq" className={navLink}>الأسئلة الشائعة</a>
        </nav>
        <div className="flex min-w-0 items-center gap-2 md:justify-self-center">
          <img src={logo} alt="الرحال برو" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
          <span className="gold-text truncate text-base font-bold sm:text-lg">الرحال برو</span>
        </div>
        <a href="#request" className="btn-gold inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm md:justify-self-end">
          اطلب خدمتك
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const trust = ["متابعة حتى التسليم", "وجهات متعددة", "خدمة موثوقة"];
  return (
    <section className="relative px-4 pb-16 pt-24 sm:px-6 md:pb-24 md:pt-32">
      <div className="relative mx-auto max-w-6xl text-center">
        <p className="text-sm text-[#A89F90]">للسفريات — تأشيرات ومعاملات وحجوزات</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
          خدمات سفر وتأشيرات <span className="gold-text">متكاملة</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#A89F90] sm:text-lg">
          تأشيرات وبرامج العمرة، تخليص فيز العمل والزيارات العائلية، تختيم الوثائق،
          استخراج الجوازات، وحجوزات الطيران والفنادق والباقات — كل ذلك من مكان واحد.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#request" className="btn-gold inline-flex h-[54px] min-w-44 items-center justify-center rounded-xl px-7">
            اطلب خدمتك
          </a>
          <a href="#services" className="btn-outline inline-flex h-[54px] min-w-44 items-center justify-center rounded-xl px-7">
            تعرّف على خدماتنا
          </a>
        </div>
        <div
          className="mx-auto mt-10 max-w-3xl p-px"
          style={{ background: "linear-gradient(135deg, #F4E4BC, #C9963A 55%, #8A5E28)" }}
        >
          <ul className="grid grid-cols-3 bg-[#0C0A08]">
            {trust.map((label, index) => (
              <li
                key={label}
                className={`flex min-h-11 items-center justify-center px-2 py-3 text-center text-xs text-[#EDE6D8] sm:text-sm ${index > 0 ? "border-s border-[#4E3518]" : ""}`}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const serviceHighlights = [
  ["خدمة موثوقة", "بإجراءات واضحة"],
  ["وجهات متعددة", "حول العالم"],
  ["متابعة حتى التسليم", "ملفاتك في كل مرحلة"],
] as const;

function Services() {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section id="services" className="scroll-mt-20 py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {serviceHighlights.map(([title, sub]) => (
            <div key={title} className="gold-border rounded-2xl px-4 py-5 text-center">
              <div className="font-bold text-amber-100">{title}</div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16">
          <SectionHeader
            eyebrow="خدماتنا"
            title="كل خدماتك في مكان واحد"
            desc="نجمع بين خدمات التأشيرات والمعاملات الرسمية وخدمات السفر والحجوزات لتقديم حل متكامل لعملائنا."
          />
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-4 md:gap-5 items-start">
          <nav aria-label="قائمة الخدمات" className="gold-border rounded-2xl p-2 sm:p-3 lg:col-start-1 lg:row-start-1">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
              {services.map((s, i) => {
                const selected = i === active;
                return (
                  <li key={s.slug}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={selected}
                      className={`w-full rounded-xl px-4 py-3 text-start text-sm font-semibold transition ${
                        selected
                          ? "gold-border text-amber-100"
                          : "text-muted-foreground hover:text-amber-200"
                      }`}
                    >
                      {s.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <article className="gold-border rounded-2xl p-6 sm:p-8 lg:col-start-2 lg:row-start-1 min-w-0">
            <h3 className="text-2xl sm:text-3xl font-black">
              <span className="gold-text">{current.title}</span>
            </h3>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {current.details}
            </p>

            <h4 className="mt-8 mb-4 text-base font-bold text-amber-200">المطلوب منك</h4>
            <ul className="grid sm:grid-cols-2 gap-3">
              {current.requirements.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/90">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/services/$slug"
              params={{ slug: current.slug }}
              className="mt-8 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-amber-100 gold-border hover:glow-gold transition"
            >
              اطلب هذه الخدمة
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function Destinations() {
  return (
    <section id="destinations" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader eyebrow="وجهات مختارة" title="وجهات للعمرة والسياحة" desc="وجهات مميزة لبرامج العمرة والسياحة ضمن باقاتنا المتكاملة." />
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

function Footer() {
  return (
    <footer className="brushed-metal mt-12 border-t border-amber-500/30">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="الرحال برو" className="w-12 h-12 rounded-lg" />
            <div>
              <div className="gold-text font-black text-lg">الرحال برو</div>
              <div className="text-[11px] text-muted-foreground">للسفريات والتأشيرات والخدمات العامة</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            تأشيرات وعمرة، استخراج الجوازات، تخليص المعاملات الرسمية، وحجوزات السفر والباقات — بمعايير احترافية وموثوقية.
          </p>
        </div>

        <FooterCol title="روابط سريعة" items={[["الرئيسية","#"],["خدماتنا","#services"],["الوجهات","#destinations"],["اطلب خدمتك","#request"]]} />
        <FooterCol title="الدعم" items={[["الأسئلة الشائعة","#faq"],["تواصل معنا","#request"]]} />

        <div>
          <div className="font-bold mb-4 text-amber-200">تواصل معنا</div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <a href="https://wa.me/967784140404" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-300 transition">
              <Phone className="w-4 h-4 text-amber-400"/> +967 784 140 404
            </a>
            <a href="https://wa.me/967782024040" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-300 transition">
              <Phone className="w-4 h-4 text-amber-400"/> +967 782 024 040
            </a>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-400"/> info@alrhalpro.com</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400"/> اليمن — عدن</div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-amber-200/80 mb-2 font-semibold">خدمة العملاء على واتساب</div>
            <div className="flex gap-2">
              <a href="https://wa.me/967784140404" target="_blank" rel="noopener noreferrer"
                 className="btn-gold flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm">
                <BrandIcon name="whatsapp" /> دردشة فورية
              </a>
              <a href="tel:+967784140404"
                 className="gold-border flex h-11 w-11 items-center justify-center text-[#F4E4BC] transition-colors duration-200 hover:text-[#EDE6D8]" aria-label="اتصال">
                <BrandIcon name="phone" />
              </a>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-amber-200/80 mb-2 font-semibold">تابعنا</div>
            <div className="flex flex-wrap gap-2">
              {([
                ["instagram", "https://www.instagram.com/alrhal_pro", "Instagram"],
                ["facebook", "https://www.facebook.com/share/1B77oRdQe3/", "Facebook"],
                ["x", "https://x.com/alrhalpro", "X"],
                ["youtube", "https://www.youtube.com/@Alrhaal_pro", "YouTube"],
                ["tiktok", "https://tiktok.com/@alrhaalpro", "TikTok"],
              ] as const).map(([name, href, label]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className="gold-border flex h-11 w-11 items-center justify-center text-[#F4E4BC] transition-colors duration-200 hover:text-[#EDE6D8]">
                  <BrandIcon name={name} />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
      <div className="border-t border-amber-500/20 py-5 px-4 text-center text-xs text-muted-foreground space-y-2">
        <p>© {new Date().getFullYear()} الرحال برو. جميع الحقوق محفوظة.</p>
        <p>
          تم التصميم{" "}
          <a
            href="https://wa.me/967774929461"
            target="_blank"
            rel="noreferrer"
            className="text-amber-300 hover:text-amber-200 transition"
          >
            Fatima Al.sayyari
          </a>
        </p>
      </div>
    </footer>
  );
}

function BrandIcon({ name }: { name: "whatsapp" | "phone" | "instagram" | "facebook" | "x" | "youtube" | "tiktok" }) {
  const pen = { viewBox: "0 0 24 24", className: "h-4 w-4", fill: "none", stroke: "currentColor", strokeWidth: 1.8, "aria-hidden": true as const };
  if (name === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.9c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.39.85-.39h.61c.2 0 .46-.07.72.55.27.64.91 2.22.99 2.38.08.16.13.35.03.56-.1.22-.15.35-.3.54-.14.19-.3.42-.43.56-.14.14-.29.3-.12.58.16.27.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.27.37-.23.62-.14.26.08 1.62.76 1.9.9.27.14.46.21.53.32.07.12.07.68-.17 1.36z" />
      </svg>
    );
  }
  if (name === "phone") {
    return (
      <svg {...pen}>
        <path d="M7 3.5h3.2l1.2 3-2 1.2a12.5 12.5 0 0 0 5.9 5.9l1.2-2 3 1.2V16a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 5 6.7 2 2 0 0 1 7 3.5z" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M7 2.5h10A4.5 4.5 0 0 1 21.5 7v10a4.5 4.5 0 0 1-4.5 4.5H7A4.5 4.5 0 0 1 2.5 17V7A4.5 4.5 0 0 1 7 2.5zm5 4.2a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6zM17.7 6.1a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3zM12 8.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8z" />
      </svg>
    );
  }
  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M14.2 8.2V6.6c0-.8.4-1.1 1.3-1.1H17V3h-2.4C12.2 3 10.6 4.6 10.6 7v1.2H8.2v2.8h2.4V21h3.2v-9.9h2.4l.5-2.9h-2.9z" />
      </svg>
    );
  }
  if (name === "x") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M14.7 10.3 21.4 3h-1.6l-5.8 6.4L9.3 3H3.4l7 9.6L3.4 21h1.6l6.2-6.8L14.7 21h5.9l-7.3-10.7zm-2.2 2.4-.7-.9-5.6-7.6h2.4l4.5 6.1.7.9 5.9 8h-2.4l-4.8-6.5z" />
      </svg>
    );
  }
  if (name === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M23 12.2s0-3.1-.4-4.5c-.2-.9-.9-1.6-1.8-1.8C19.2 5.5 12 5.5 12 5.5s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9.1 1 12.2 1 12.2s0 3.1.4 4.5c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.5.4-4.5zM9.8 15.5v-6.6l6 3.3-6 3.3z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M14.2 3c.5 2.8 2.3 4.8 5 5.1v2.6a7.6 7.6 0 0 1-5-1.7v7.1a5.7 5.7 0 1 1-5.7-5.7c.3 0 .7 0 1 .1v2.8a3 3 0 1 0 2.1 2.8V3h2.6z" />
    </svg>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div className="font-bold mb-4 text-amber-200">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map(([label, href]) => (
          <li key={label}><a href={href} className="hover:text-amber-300 transition">{label}</a></li>
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
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-snug"><span className="gold-text">{title}</span></h2>
      <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeader eyebrow="الأسئلة الشائعة" title="إجابات سريعة" desc="أكثر الأسئلة التي يسألها عملاؤنا." />
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`} className="border-amber-500/20">
              <AccordionTrigger className="text-start font-bold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
