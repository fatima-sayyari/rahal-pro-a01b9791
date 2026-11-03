import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle } from "lucide-react";
import { services } from "@/data/services";
import { RequestForm } from "@/components/RequestForm";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const s = services.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return { title: s.title, desc: s.desc };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "خدمة"} — الرحال برو` },
      { name: "description", content: loaderData?.desc ?? "" },
      { property: "og:title", content: `${loaderData?.title ?? "خدمة"} — الرحال برو` },
    ],
  }),
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  const s = services.find((x) => x.slug === slug)!;
  const others = services.filter((x) => x.slug !== slug);

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 md:pt-32">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200">
          <ArrowRight className="w-4 h-4" /> العودة للرئيسية
        </Link>
        <div className="mt-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center border border-amber-500/30">
            <s.icon className="w-8 h-8 text-amber-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black"><span className="gold-text">{s.title}</span></h1>
        </div>
        <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">{s.details}</p>

        <h2 className="mt-10 mb-4 text-xl font-bold text-amber-200">المطلوب منك</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {s.requirements.map((r) => (
            <li key={r} className="gold-border rounded-xl p-4 flex items-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" /> {r}
            </li>
          ))}
        </ul>

        <h2 className="mt-10 mb-4 text-xl font-bold text-amber-200">خدمات أخرى</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((o) => (
            <Link key={o.slug} to="/services/$slug" params={{ slug: o.slug }}
                  className="gold-border rounded-full px-4 py-2 text-xs sm:text-sm hover:glow-gold transition">
              {o.title}
            </Link>
          ))}
        </div>
      </div>
      <RequestForm defaultService={s.title} />
    </main>
  );
}
