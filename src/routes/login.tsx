import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Lock, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";
import logo from "@/assets/logo.jpeg";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — الرحال برو" },
      { name: "description", content: "سجّل دخولك إلى الرحال برو عبر البريد الإلكتروني أو رقم الجوال." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = /^\+?\d{8,15}$/.test(phone.replace(/\s/g, ""));
  const passValid = password.length >= 6;
  const valid = (mode === "email" ? emailValid : phoneValid) && passValid;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10"
           style={{ background: "radial-gradient(circle at 20% 20%, rgba(217,164,65,.12), transparent 50%), radial-gradient(circle at 80% 80%, rgba(182,125,42,.1), transparent 50%)" }} />

      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-300 transition mb-8">
          <ArrowLeft className="w-4 h-4 rotate-180" /> العودة للرئيسية
        </Link>

        <div className="brushed-metal rounded-3xl p-1 glow-gold">
          <div className="bg-card/85 backdrop-blur-xl rounded-[22px] p-8">
            <div className="flex flex-col items-center text-center mb-7">
              <img src={logo} alt="الرحال برو" className="w-14 h-14 rounded-xl mb-4" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/5 text-amber-300 text-xs mb-3">
                <Sparkles className="w-3 h-3" /> أهلاً بعودتك
              </div>
              <h1 className="text-3xl font-black gold-text">تسجيل الدخول</h1>
              <p className="text-sm text-muted-foreground mt-2">ادخل إلى حسابك لمتابعة رحلتك</p>
            </div>

            {/* Mode toggle */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-background/50 border border-amber-500/20 mb-6">
              <button
                type="button"
                onClick={() => setMode("email")}
                className={`py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  mode === "email" ? "bg-amber-500/15 text-amber-200" : "text-muted-foreground"
                }`}
              >
                <Mail className="w-4 h-4" /> البريد الإلكتروني
              </button>
              <button
                type="button"
                onClick={() => setMode("phone")}
                className={`py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  mode === "phone" ? "bg-amber-500/15 text-amber-200" : "text-muted-foreground"
                }`}
              >
                <Phone className="w-4 h-4" /> رقم الجوال
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {mode === "email" ? (
                <LoginField
                  icon={Mail}
                  type="email"
                  label="البريد الإلكتروني"
                  placeholder="name@example.com"
                  value={email}
                  onChange={setEmail}
                  valid={emailValid}
                />
              ) : (
                <LoginField
                  icon={Phone}
                  type="tel"
                  label="رقم الجوال"
                  placeholder="+966 5X XXX XXXX"
                  value={phone}
                  onChange={setPhone}
                  valid={phoneValid}
                  dir="ltr"
                />
              )}

              <LoginField
                icon={Lock}
                type="password"
                label="كلمة المرور"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                valid={passValid}
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="accent-amber-400" /> تذكرني
                </label>
                <a href="#" className="text-amber-300 hover:underline">نسيت كلمة المرور؟</a>
              </div>

              <button
                type="submit"
                disabled={!valid}
                className="w-full rounded-xl font-bold text-background py-3.5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#f6e3a3,#d9a441,#b67d2a)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  دخول <ArrowLeft className="w-4 h-4" />
                </span>
                <span className="absolute inset-0 shimmer" />
              </button>

              {submitted && (
                <div className="text-xs text-emerald-400 text-center flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> تم استلام بياناتك بأمان
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                مشفّر بالكامل — بياناتك في أمان
              </div>
            </form>

            <div className="mt-7 text-center text-sm text-muted-foreground">
              ليس لديك حساب؟{" "}
              <a href="#" className="text-amber-300 font-semibold hover:underline">أنشئ حساب جديد</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function LoginField({ icon: Icon, label, type = "text", value, onChange, placeholder, valid, dir }: any) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1.5 block">{label}</span>
      <div className="relative">
        <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/70" />
        <input
          type={type}
          value={value}
          dir={dir}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-background/60 border border-amber-500/30 rounded-xl pr-10 pl-9 py-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition"
        />
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400/70" />
        {valid && (
          <span className="absolute left-9 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        )}
      </div>
    </label>
  );
}
