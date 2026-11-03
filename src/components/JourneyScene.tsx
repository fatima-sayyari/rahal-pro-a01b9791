import { useEffect, useRef, useState } from "react";

const STEPS = [
  { t: "تقديم الطلب", d: "تواصلي معنا وحددي نوع الخدمة المطلوبة." },
  { t: "تجهيز الملف", d: "مراجعة الوثائق واستكمال المتطلبات الرسمية." },
  { t: "متابعة المعاملة", d: "متابعة حالة الطلب لدى الجهات المختصة." },
  { t: "إتمام الخدمة", d: "تسليم النتيجة ودعم ما بعد الإنجاز." },
];
const GATES = [0.14, 0.38, 0.62, 0.86];
const T0 = 0.02;
const T1 = 0.98;

export function JourneyScene() {
  const secRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [step, setStep] = useState(0);
  const [hint, setHint] = useState(true);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFallback(true);
      return;
    }
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        setFallback(true);
        return;
      }
      const stage = stageRef.current;
      const sec = secRef.current;
      if (disposed || !stage || !sec) return;

      let ren: import("three").WebGLRenderer;
      try {
        ren = new THREE.WebGLRenderer({ antialias: true });
      } catch {
        setFallback(true);
        return;
      }
      ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      ren.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
      stage.prepend(ren.domElement);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1410);
      scene.fog = new THREE.Fog(0x1a1410, 14, 58);
      const cam = new THREE.PerspectiveCamera(52, 1, 0.1, 120);
      scene.add(new THREE.AmbientLight(0x9a8878, 1.8));
      const sun = new THREE.DirectionalLight(0xffffff, 3);
      sun.position.set(6, 10, 8);
      scene.add(sun);
      const rim = new THREE.PointLight(0xd9a441, 220, 60);
      rim.position.set(-8, -4, -6);
      scene.add(rim);

      const curve = new THREE.CatmullRomCurve3(
        [[-10, 0, 12], [0, 1, 4], [10, 3, -3], [20, 0, -6], [30, -2, 2], [40, 1, 9], [52, 3, 6]].map(
          (a) => new THREE.Vector3(a[0], a[1], a[2]),
        ),
      );
      const guidePts: import("three").Vector3[] = [];
      for (let i = 0; i <= 160; i++) guidePts.push(curve.getPointAt(T0 + ((T1 - T0) * i) / 160));
      const guide = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(guidePts),
        new THREE.LineDashedMaterial({ color: 0xd9a441, dashSize: 0.5, gapSize: 0.5, transparent: true, opacity: 0.35 }),
      );
      guide.computeLineDistances();
      scene.add(guide);

      const small = window.innerWidth < 640;
      const starN = small ? 220 : 500;
      const sp = new Float32Array(starN * 3);
      for (let i = 0; i < starN; i++) {
        sp[i * 3] = -25 + Math.random() * 95;
        sp[i * 3 + 1] = -18 + Math.random() * 40;
        sp[i * 3 + 2] = -25 + Math.random() * 50;
      }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
      scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xf6e3a3, size: 0.12, transparent: true, opacity: 0.75 })));

      if (!small) {
        const cm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.07, depthWrite: false });
        for (let i = 0; i < 16; i++) {
          const g = new THREE.Group();
          for (let k = 0; k < 4; k++) {
            const s = new THREE.Mesh(new THREE.SphereGeometry(1 + Math.random() * 1.4, 12, 10), cm);
            s.position.set(k * 1.4 - 2, Math.random() * 0.6, Math.random() * 1.2);
            g.add(s);
          }
          g.position.set(-8 + Math.random() * 60, -6 + Math.random() * 10, -14 + Math.random() * 10);
          if (Math.random() > 0.5) g.position.z += 22;
          scene.add(g);
        }
      }

      const DIM = new THREE.Color(0x7a5f2a);
      const LIT = new THREE.Color(0xf6e3a3);
      const gates = GATES.map((t) => {
        const pos = curve.getPointAt(t);
        const tan = curve.getTangentAt(t);
        const g = new THREE.Group();
        const m1 = new THREE.MeshBasicMaterial({ color: DIM.getHex() });
        const m2 = new THREE.MeshBasicMaterial({ color: DIM.getHex(), transparent: true, opacity: 0.6 });
        g.add(new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.09, 12, 56), m1));
        g.add(new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.035, 10, 56), m2));
        g.position.copy(pos);
        g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
        scene.add(g);
        return { t, g, m1, m2, pos, k: 0 };
      });

      const body = new THREE.MeshStandardMaterial({ color: 0xf4efe6, metalness: 0.3, roughness: 0.35, side: THREE.DoubleSide });
      const gold = new THREE.MeshStandardMaterial({ color: 0xd9a441, metalness: 0.8, roughness: 0.3, side: THREE.DoubleSide });
      const glass = new THREE.MeshStandardMaterial({ color: 0x1d242c, metalness: 0.6, roughness: 0.15 });
      const model = new THREE.Group();
      const put = <T extends import("three").Object3D>(m: T, x: number, y: number, z: number) => {
        m.position.set(x, y, z);
        model.add(m);
        return m;
      };
      const fus = put(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 4, 28), body), 0, 0, 0);
      fus.rotation.z = Math.PI / 2;
      const nose = put(new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 16), body), 2, 0, 0);
      nose.scale.set(1.9, 1, 1);
      const tc = put(new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.6, 28), body), -2.8, 0, 0);
      tc.rotation.z = Math.PI / 2;
      const ck = put(new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), glass), 2.15, 0.22, 0);
      ck.scale.set(1.4, 0.8, 1);
      const sr = put(new THREE.Mesh(new THREE.CylinderGeometry(0.362, 0.362, 0.16, 28), gold), 0.9, 0, 0);
      sr.rotation.z = Math.PI / 2;
      const wing = (p: number[][], depth: number) => {
        const s = new THREE.Shape();
        s.moveTo(p[0][0], p[0][1]);
        for (let i = 1; i < p.length; i++) s.lineTo(p[i][0], p[i][1]);
        s.closePath();
        const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
        g.rotateX(-Math.PI / 2);
        return g;
      };
      const wg = wing([[0.9, 0], [-0.3, 0], [-1.5, 3.4], [-1.0, 3.4]], 0.09);
      const tg = wing([[0.5, 0], [-0.2, 0], [-0.8, 1.3], [-0.5, 1.3]], 0.06);
      put(new THREE.Mesh(wg, body), 0.2, -0.1, 0);
      put(new THREE.Mesh(wg, body), 0.2, -0.1, 0).scale.z = -1;
      put(new THREE.Mesh(tg, body), -2.9, 0, 0);
      put(new THREE.Mesh(tg, body), -2.9, 0, 0).scale.z = -1;
      const fs = new THREE.Shape();
      fs.moveTo(0.5, 0); fs.lineTo(-0.7, 0); fs.lineTo(-1.0, 1.3); fs.lineTo(-0.5, 1.3); fs.closePath();
      put(new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: 0.07, bevelEnabled: false }), gold), -2.8, 0.25, -0.035);
      [-1.3, 1.3].forEach((z) => {
        const e = put(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.1, 20), gold), 0.5, -0.4, z);
        e.rotation.z = Math.PI / 2;
      });
      model.scale.setScalar(0.28);
      const pivot = new THREE.Group();
      pivot.add(model);
      scene.add(pivot);

      const TN = 140;
      const tp = new Float32Array(TN * 3);
      const tgeo = new THREE.BufferGeometry();
      tgeo.setAttribute("position", new THREE.BufferAttribute(tp, 3));
      tgeo.setDrawRange(0, 0);
      scene.add(new THREE.Line(tgeo, new THREE.LineBasicMaterial({ color: 0xf4d27a })));

      let W = 1, H = 1;
      const resize = () => {
        W = stage.clientWidth || 1;
        H = stage.clientHeight || 1;
        ren.setSize(W, H, false);
        cam.aspect = W / H;
        cam.fov = W / H < 0.8 ? 72 : 52;
        cam.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(stage);
      resize();

      let target = 0, p = 0, visible = true, lastStep = 0, hintOff = false;
      const calc = () => {
        const r = sec.getBoundingClientRect();
        target = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
        if (!hintOff && target > 0.02) { hintOff = true; setHint(false); }
      };
      window.addEventListener("scroll", calc, { passive: true });
      calc();
      p = target;
      const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; });
      io.observe(sec);

      const UP = new THREE.Vector3(0, 1, 0);
      const V = new THREE.Vector3();
      const look = new THREE.Vector3();
      const camT = new THREE.Vector3();
      let first = true, raf = 0, last = performance.now();

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!visible) return;
        p += (target - p) * (1 - Math.exp(-dt * 5));
        const t = T0 + (T1 - T0) * Math.min(1, p);
        const pos = curve.getPointAt(t);
        const f = curve.getTangentAt(t);
        const f2 = curve.getTangentAt(Math.min(1, t + 0.01));
        const s = new THREE.Vector3().crossVectors(f, UP).normalize();
        const u = new THREE.Vector3().crossVectors(s, f).normalize();
        const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(f, u, s));
        const bank = Math.max(-0.6, Math.min(0.6, V.copy(f2).sub(f).dot(s) * 40));
        q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), bank));
        pivot.position.copy(pos);
        pivot.quaternion.copy(q);

        const want = pos.clone().addScaledVector(f, -7.5).addScaledVector(UP, 2.4).addScaledVector(s, 1.4);
        const lt = pos.clone().addScaledVector(f, 6);
        if (first) { camT.copy(want); look.copy(lt); first = false; }
        const k = 1 - Math.exp(-dt * 4);
        camT.lerp(want, k);
        look.lerp(lt, k);
        cam.position.copy(camT);
        cam.lookAt(look);

        const n = Math.max(2, Math.floor((TN * (t - T0)) / (T1 - T0)));
        for (let i = 0; i < n; i++) {
          const v = curve.getPointAt(T0 + ((t - T0) * i) / (n - 1));
          tp[i * 3] = v.x; tp[i * 3 + 1] = v.y; tp[i * 3 + 2] = v.z;
        }
        tgeo.setDrawRange(0, n);
        tgeo.attributes.position.needsUpdate = true;

        let passed = 0;
        gates.forEach((G, i) => {
          const done = t >= G.t;
          if (done) passed = i + 1;
          const near = Math.abs(t - G.t) < 0.045;
          G.k += ((done ? 1 : 0) - G.k) * Math.min(1, dt * 6);
          G.m1.color.copy(DIM).lerp(LIT, G.k);
          G.m2.color.copy(DIM).lerp(LIT, G.k);
          G.g.scale.setScalar(1 + (near ? 0.15 : 0) + G.k * 0.05);
          G.g.rotation.z += dt * (0.3 + G.k * 0.7);
          V.copy(G.pos); V.y += 2.5; V.project(cam);
          const el = labelRefs.current[i];
          if (el) {
            const vis = V.z < 1 && Math.abs(V.x) < 1.15;
            el.style.display = vis ? "block" : "none";
            el.style.left = ((V.x + 1) / 2) * W + "px";
            el.style.top = ((1 - V.y) / 2) * H + "px";
            el.style.opacity = done ? "1" : "0.55";
          }
        });
        if (passed !== lastStep) { lastStep = passed; setStep(passed); }
        ren.render(scene, cam);
      };
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", calc);
        ro.disconnect();
        io.disconnect();
        scene.traverse((o) => {
          const m = o as import("three").Mesh;
          m.geometry?.dispose?.();
        });
        ren.dispose();
        ren.domElement.remove();
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, []);

  if (fallback) {
    return (
      <section id="journey" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-center text-3xl sm:text-4xl font-black"><span className="gold-text">معاملتك بخطوات واضحة</span></h2>
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="flex items-start gap-4 gold-border rounded-xl p-4">
                <div className="text-2xl font-black gold-text shrink-0 w-12">0{i + 1}</div>
                <div><div className="font-bold">{s.t}</div><div className="text-sm text-muted-foreground">{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const cur = step > 0 ? STEPS[step - 1] : null;
  return (
    <section ref={secRef} id="journey" className="relative" style={{ height: "420vh" }}>
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden bg-background">
        <div className="absolute top-20 inset-x-0 text-center px-4 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/5 text-amber-300 text-xs mb-3">
            مسار الخدمة
          </div>
          <h2 className="text-2xl sm:text-4xl font-black"><span className="gold-text">معاملتك بخطوات واضحة</span></h2>
        </div>

        {STEPS.map((s, i) => (
          <div
            key={s.t}
            ref={(el) => { labelRefs.current[i] = el; }}
            className="absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border border-amber-500/70 bg-background/70 px-3 py-1 text-xs sm:text-sm text-amber-100 pointer-events-none transition-opacity"
            style={{ display: "none" }}
          >
            <b className="font-semibold">0{i + 1}</b> {s.t}
          </div>
        ))}

        <div className="absolute bottom-6 inset-x-0 px-4 flex flex-col items-center gap-3 pointer-events-none">
          <div className="gold-border rounded-2xl bg-background/70 backdrop-blur px-5 py-3 text-center max-w-md w-full">
            <div className="font-black text-lg gold-text">{cur ? `0${step} — ${cur.t}` : "رحلتك تبدأ من هنا"}</div>
            <div className="text-sm text-muted-foreground mt-1">{cur ? cur.d : "مرّري للأسفل لتبدأ الرحلة"}</div>
          </div>
          <div className="flex gap-2" aria-hidden>
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i < step ? "w-8 bg-amber-300" : "w-4 bg-amber-500/30"}`} />
            ))}
          </div>
          {hint && <div className="text-xs text-amber-200/70 animate-pulse">⌄ مرّري</div>}
        </div>
      </div>
    </section>
  );
}
