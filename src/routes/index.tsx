import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Palmtree, Briefcase, Users, Landmark, BookUser, Plane, ShieldCheck, CheckCircle,
  MapPin, Phone, Mail, Instagram, Twitter,
  Facebook, ArrowLeft, Sparkles, Globe,
  MessageCircle, Headphones, Music2, Youtube,
} from "lucide-react";
import { services, faqs } from "@/data/services";
import { JourneyScene } from "@/components/JourneyScene";
import { Reviews } from "@/components/Reviews";
import { RequestForm } from "@/components/RequestForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Suitcase } from "@/components/Suitcase";
import { WorldMap } from "@/components/WorldMap";
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

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src={logo} alt="الرحال برو" className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover shrink-0" />
          <span className="gold-text text-base sm:text-lg font-bold truncate">الرحال برو</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#services" className="hover:text-amber-300 transition">خدماتنا</a>
          <a href="#destinations" className="hover:text-amber-300 transition">الوجهات</a>
        </nav>
        <a href="#request" className="gold-border px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-amber-200 hover:glow-gold transition shrink-0">
          اطلب خدمتك
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-24 pb-10 md:pt-32 md:pb-20 md:min-h-screen flex items-center">
      <div className="absolute inset-0 -z-10 opacity-50">
        <WorldMap />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col md:grid md:grid-cols-2 md:gap-10 md:items-center">
        <div className="fade-up order-1 text-center md:text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/5 text-amber-300 text-xs mb-4 md:mb-6">
            <Sparkles className="w-3 h-3" /> للسفريات — تأشيرات ومعاملات وحجوزات
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-snug md:leading-tight">
            <span className="gold-text">الرحال برو خدمات سفر</span>
            <br />
            <span className="text-foreground/95">وتأشيرات متكاملة</span>
          </h1>
          <p className="mt-4 md:mt-6 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed">
            تأشيرات وبرامج العمرة، تخليص فيز العمل والزيارات العائلية، تختيم الوثائق،
            استخراج الجوازات، وحجوزات الطيران والفنادق والباقات — كل ذلك من مكان واحد.
          </p>
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
            <a href="#request" className="group relative px-7 py-3.5 rounded-xl font-semibold text-background overflow-hidden inline-flex justify-center"
               style={{ background: "linear-gradient(135deg,#f6e3a3,#d9a441,#b67d2a)" }}>
              <span className="relative z-10 flex items-center gap-2">اطلب خدمتك <ArrowLeft className="w-4 h-4" /></span>
              <span className="absolute inset-0 shimmer" />
            </a>
            <a href="#services" className="gold-border px-7 py-3.5 rounded-xl font-semibold text-amber-200 inline-flex justify-center">
              تعرف على خدماتنا
            </a>
          </div>
          <div className="mt-6 md:mt-10 flex flex-wrap justify-center md:justify-start items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <Trust icon={ShieldCheck} text="متابعة حتى التسليم" />
            <Trust icon={Globe} text="+180 دولة" />
            <Trust icon={CheckCircle} text="خدمة موثوقة" />
          </div>
        </div>

        <div className="relative order-2 flex justify-center mt-6 md:mt-0 md:order-2">
          <Suitcase className="w-[min(100%,260px)] sm:w-[300px] lg:w-[360px]" />
          <div
            className="hidden lg:grid absolute -bottom-4 left-0 right-0 grid-cols-6 gap-2 fade-up"
            style={{ animationDelay: ".5s" }}
          >
            {services.map((s, i) => (
              <div key={i} className="gold-border rounded-xl p-3 text-center backdrop-blur-sm bg-card/50">
                <s.icon className="w-5 h-5 mx-auto text-amber-300" />
                <div className="text-[10px] mt-1 text-muted-foreground truncate">{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
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
    <section id="services" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow="خدماتنا"
          title="كل خدماتك في مكان واحد"
          desc="نجمع بين خدمات التأشيرات والمعاملات الرسمية وخدمات السفر والحجوزات لتقديم حل متكامل لعملائنا."
        />
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((s, i) => (
            <Link key={i} to="/services/$slug" params={{ slug: s.slug }} className="service-card group gold-border rounded-2xl p-6 hover:glow-gold transition-all duration-500 hover:-translate-y-2 block">
              <div className="icon-wrap inline-flex w-14 h-14 items-center justify-center rounded-xl mb-5"
                   style={{ background: "linear-gradient(135deg,rgba(244,210,122,.15),rgba(182,125,42,.1))", border: "1px solid rgba(244,210,122,.3)" }}>
                <s.icon className={`w-7 h-7 text-amber-300 ${s.anim}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-5 flex items-center gap-2 text-amber-300 text-sm font-semibold md:opacity-0 md:group-hover:opacity-100 transition">
                اكتشف المزيد <ArrowLeft className="w-3 h-3" />
              </div>
            </Link>
          ))}
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
              <a href="https://wa.me/967784140404" target="_blank" rel="noreferrer"
                 className="flex-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-background hover:scale-[1.02] transition"
                 style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}>
                <MessageCircle className="w-4 h-4"/> دردشة فورية
              </a>
              <a href="tel:+967784140404"
                 className="w-11 h-11 rounded-xl gold-border flex items-center justify-center text-amber-300 hover:glow-gold transition" aria-label="اتصال">
                <Headphones className="w-4 h-4"/>
              </a>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-amber-200/80 mb-2 font-semibold">تابعنا</div>
            <div className="flex flex-wrap gap-2">
              {[
                { I: Instagram, href: "https://www.instagram.com/alrhal_pro", label: "Instagram" },
                { I: Facebook,  href: "https://www.facebook.com/share/1B77oRdQe3/", label: "Facebook" },
                { I: Twitter,   href: "https://x.com/alrhalpro", label: "X" },
                { I: Youtube,   href: "https://www.youtube.com/@Alrhaal_pro", label: "YouTube" },
                { I: Music2,    href: "https://tiktok.com/@alrhaalpro", label: "TikTok" },
              ].map(({ I, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                   className="w-10 h-10 rounded-lg gold-border flex items-center justify-center text-amber-300 hover:glow-gold hover:-translate-y-0.5 transition">
                  <I className="w-4 h-4"/>
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
