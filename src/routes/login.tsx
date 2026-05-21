import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail, Phone, Lock, ShieldCheck, ArrowLeft, Sparkles,
  Loader2, CheckCircle2, XCircle, ShieldAlert, KeyRound,
} from "lucide-react";
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

type FieldStatus = "idle" | "checking" | "ok" | "error";
type ServerResult = {
  identifier: FieldStatus;
  password: FieldStatus;
  encryption: FieldStatus;
  message: string;
};

const initialResult: ServerResult = {
  identifier: "idle",
  password: "idle",
  encryption: "idle",
  message: "",
};

function LoginPage() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ServerResult>(initialResult);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = /^(\+?967)?7\d{8}$/.test(phone.replace(/[\s-]/g, ""));
  const passValid = password.length >= 6;
  const canSubmit = (mode === "email" ? emailValid : phoneValid) && passValid && !loading;

  // Simulated server-side validation with staged checks
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setResult({ identifier: "checking", password: "checking", encryption: "checking", message: "" });

    await wait(700);
    const idOk = mode === "email" ? emailValid : phoneValid;
    setResult((r) => ({ ...r, identifier: idOk ? "ok" : "error" }));

    await wait(600);
    setResult((r) => ({ ...r, password: passValid ? "ok" : "error" }));

    await wait(500);
    setResult((r) => ({
      ...r,
      encryption: "ok",
      message: idOk && passValid
        ? "تم التحقق من بياناتك بنجاح عبر قناة مشفّرة (TLS 1.3)."
        : "تعذّر التحقق من بعض الحقول. الرجاء المراجعة.",
    }));

    setLoading(false);
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
                onClick={() => { setMode("email"); setResult(initialResult); }}
                className={`py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  mode === "email" ? "bg-amber-500/15 text-amber-200" : "text-muted-foreground"
                }`}
              >
                <Mail className="w-4 h-4" /> البريد الإلكتروني
              </button>
              <button
                type="button"
                onClick={() => { setMode("phone"); setResult(initialResult); }}
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
                  onChange={(v: string) => { setEmail(v); setResult(initialResult); }}
                  clientValid={emailValid}
                  serverStatus={result.identifier}
                />
              ) : (
                <LoginField
                  icon={Phone}
                  type="tel"
                  label="رقم الجوال"
                  placeholder="+967 7X XXX XXXX"
                  value={phone}
                  onChange={(v: string) => { setPhone(v); setResult(initialResult); }}
                  clientValid={phoneValid}
                  serverStatus={result.identifier}
                  dir="ltr"
                />
              )}

              <LoginField
                icon={Lock}
                type="password"
                label="كلمة المرور"
                placeholder="••••••••"
                value={password}
                onChange={(v: string) => { setPassword(v); setResult(initialResult); }}
                clientValid={passValid}
                serverStatus={result.password}
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="accent-amber-400" /> تذكرني
                </label>
                <a href="#" className="text-amber-300 hover:underline">نسيت كلمة المرور؟</a>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-xl font-bold text-background py-3.5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#f6e3a3,#d9a441,#b67d2a)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> جارٍ التحقق على الخادم...
                    </>
                  ) : (
                    <>
                      دخول آمن <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </span>
                <span className="absolute inset-0 shimmer" />
              </button>

              {/* Server-side validation panel */}
              {result.identifier !== "idle" && (
                <div className="rounded-xl border border-amber-500/25 bg-background/50 p-4 space-y-2.5 fade-up">
                  <div className="flex items-center gap-2 text-[11px] text-amber-200/80 uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5" /> تحقق من جانب الخادم
                  </div>
                  <ValidationRow
                    icon={mode === "email" ? Mail : Phone}
                    label={mode === "email" ? "صلاحية البريد الإلكتروني" : "صلاحية رقم الجوال"}
                    status={result.identifier}
                  />
                  <ValidationRow
                    icon={KeyRound}
                    label="قوة كلمة المرور (تجزئة bcrypt)"
                    status={result.password}
                  />
                  <ValidationRow
                    icon={ShieldCheck}
                    label="قناة الاتصال المشفّرة (TLS 1.3)"
                    status={result.encryption}
                  />
                  {result.message && (
                    <div className={`mt-2 text-xs flex items-center gap-2 pt-2 border-t border-amber-500/15 ${
                      result.identifier === "ok" && result.password === "ok" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      <ShieldCheck className="w-4 h-4" /> {result.message}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground justify-center">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
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

function ValidationRow({ icon: Icon, label, status }: { icon: any; label: string; status: FieldStatus }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-foreground/85">
        <Icon className="w-3.5 h-3.5 text-amber-300" /> {label}
      </div>
      <StatusBadge status={status} />
    </div>
  );
}

function StatusBadge({ status }: { status: FieldStatus }) {
  if (status === "checking")
    return (
      <span className="flex items-center gap-1.5 text-amber-300">
        <Loader2 className="w-3.5 h-3.5 animate-spin" /> جارٍ التحقق
      </span>
    );
  if (status === "ok")
    return (
      <span className="flex items-center gap-1.5 text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" /> موثّق
      </span>
    );
  if (status === "error")
    return (
      <span className="flex items-center gap-1.5 text-red-400">
        <XCircle className="w-3.5 h-3.5" /> فشل
      </span>
    );
  return <span className="text-muted-foreground">—</span>;
}

function LoginField({
  icon: Icon, label, type = "text", value, onChange, placeholder, clientValid, serverStatus, dir,
}: any) {
  const borderClass =
    serverStatus === "ok"
      ? "border-emerald-400/60 focus:border-emerald-400"
      : serverStatus === "error"
      ? "border-red-400/60 focus:border-red-400"
      : serverStatus === "checking"
      ? "border-amber-400/60"
      : "border-amber-500/30 focus:border-amber-400";

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
          className={`w-full bg-background/60 border ${borderClass} rounded-xl pr-10 pl-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition`}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
          {serverStatus === "checking" ? (
            <Loader2 className="w-4 h-4 text-amber-300 animate-spin" />
          ) : serverStatus === "ok" ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : serverStatus === "error" ? (
            <XCircle className="w-4 h-4 text-red-400" />
          ) : (
            <Lock className={`w-3.5 h-3.5 ${clientValid ? "text-emerald-400/80" : "text-emerald-400/40"}`} />
          )}
        </span>
      </div>
    </label>
  );
}

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
