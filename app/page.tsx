"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import {
  Rocket, Zap, Target, Users, BookOpen, ArrowRight,
  ChevronDown, Star, Sparkles, Activity
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

function useScrollInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return { ref, inView };
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useScrollInView(0.1);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="mb-6 inline-block rounded-full border border-electric-blue/30 bg-electric-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric-blue">
      {text}
    </div>
  );
}

function SectionTitle({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <FadeUp>
      <div className="mb-16 text-center">
        <SectionLabel text={label} />
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
      </div>
    </FadeUp>
  );
}

// ─── Section 1: Hero ───

function Hero() {
  const [stats, setStats] = useState({ builders: 0, teams: 0, shipRate: 78 });

  useEffect(() => {
    async function fetchStats() {
      const { count: builders } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'builder');
      const { count: teams } = await supabase.from('teams').select('*', { count: 'exact', head: true });
      
      setStats({
        builders: builders || 0,
        teams: teams || 0,
        shipRate: 78 // Keeping this as a baseline/target
      });
    }
    fetchStats();
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-electric-blue/20 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-deep-purple/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-electric-blue/10 blur-[80px]" />
      </div>
      
      {/* Floating Badges */}
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-32 right-[12%] hidden rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm md:block">
        <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-xs text-muted-foreground">{stats.shipRate}% Ship Rate</span></div>
      </motion.div>
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute bottom-40 left-[10%] hidden rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm md:block">
        <div className="flex items-center gap-2"><Rocket className="h-3.5 w-3.5 text-electric-blue" /><span className="text-xs text-muted-foreground">{stats.builders} Active Builders</span></div>
      </motion.div>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute top-1/2 left-[18%] hidden rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm md:block">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">{["AR","SC","MT"].map(i => <div key={i} className="flex h-5 w-5 items-center justify-center rounded-full bg-electric-blue text-[8px] font-bold text-white ring-2 ring-background">{i}</div>)}</div>
          <span className="text-xs text-muted-foreground">{stats.teams} Active Teams</span>
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}>
          <SectionLabel text="LeapStart School of Technology" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-5xl font-extrabold tracking-tighter text-white sm:text-7xl lg:text-8xl">
          Don't Pitch Ideas.<br />
          <span className="bg-gradient-to-r from-electric-blue to-deep-purple bg-clip-text text-transparent">Launch Products.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Prod[X] is a premium Builder Operating System. In 10 days, go from problem identification to a live, shipped product — supported by mentors and industry-standard workflows.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth">
            <Button size="lg" className="h-12 rounded-full px-8 text-base font-semibold premium shadow-lg shadow-electric-blue/25">Start Your Builder Journey</Button>
          </Link>
          <Button size="lg" variant="outline" className="h-12 rounded-full border-white/10 px-8 text-base font-semibold hover:bg-white/5">View the Manifesto</Button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-electric-blue to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Section 2: Why Prod[X] ───

const comparisonData = [
  { traditional: "Lectures & exams", prodX: "Build a real product from day one" },
  { traditional: "Semester-long courses", prodX: "10-day intensive sprint to launch" },
  { traditional: "Generic assignments", prodX: "Your own startup idea, your vision" },
  { traditional: "Grades from professors", prodX: "Real feedback from experienced mentors" },
  { traditional: "Theoretical projects", prodX: "Live product you ship to users" },
  { traditional: "Individual assessments", prodX: "Team-based builder experience" },
];

function WhyProdX() {
  const { ref, inView } = useScrollInView(0.15);
  return (
    <section id="why" className="relative px-6 py-32">
      <SectionTitle label="Why Prod[X]" title="The traditional model is broken. We fixed it." subtitle="Stop learning about code. Start building products that matter." />
      <div ref={ref} className="mx-auto max-w-5xl">
        <div className="grid gap-3">
          {comparisonData.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl border border-border/40 bg-card/40 p-4 transition-all hover:border-electric-blue/30 hover:bg-card/60">
              <div className="text-right"><span className="text-sm text-muted-foreground line-through">{item.traditional}</span></div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-electric-blue/20"><ArrowRight className="h-4 w-4 text-electric-blue" /></div>
              <div className="text-left"><span className="text-sm font-medium text-white">{item.prodX}</span></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Builder Journey ───

const journeySteps = [
  { step: "01", title: "Discover", desc: "Identify a real problem worth solving", icon: Target },
  { step: "02", title: "Validate", desc: "Confirm market need with user interviews", icon: Users },
  { step: "03", title: "Design", desc: "Architect your MVP and UX flows", icon: BookOpen },
  { step: "04", title: "Build", desc: "Ship core features with a pro tech stack", icon: Rocket },
  { step: "05", title: "Test", desc: "Get real user feedback and iterate", icon: Activity },
  { step: "06", title: "Launch", desc: "Present your live product on Demo Day", icon: Zap },
];

function BuilderJourney() {
  const { ref, inView } = useScrollInView(0.2);
  return (
    <section id="journey" className="relative px-6 py-32 bg-black/40">
      <SectionTitle label="The Builder Journey" title="10 Days. From Zero to Live." subtitle="A structured sprint that takes you from problem discovery to a launched product." />
      <div ref={ref} className="mx-auto max-w-6xl">
        <div className="hidden items-start justify-between md:flex">
          {journeySteps.map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative flex flex-col items-center text-center">
              {i < journeySteps.length - 1 && <div className="absolute top-6 left-[60%] h-px w-[80%] bg-gradient-to-r from-electric-blue/60 to-electric-blue/20" />}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-electric-blue/40 bg-card text-sm font-bold text-electric-blue shadow-lg shadow-electric-blue/10">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1 max-w-[140px] text-xs text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="space-y-6 md:hidden">
          {journeySteps.map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-electric-blue/40 bg-card text-xs font-bold text-electric-blue"><item.icon className="h-4 w-4" /></div>
              <div><h3 className="text-sm font-semibold text-white">{item.title}</h3><p className="text-xs text-muted-foreground">{item.desc}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Builder Passport ───

const badgeData = [
  { icon: <Sparkles className="h-3 w-3" />, label: "Early Adopter" },
  { icon: <Zap className="h-3 w-3" />, label: "Sprint Master" },
  { icon: <Target className="h-3 w-3" />, label: "Problem Solver" },
  { icon: <Users className="h-3 w-3" />, label: "Team Player" },
];

function BuilderPassportSection() {
  const { ref, inView } = useScrollInView(0.2);
  return (
    <section id="passport" className="relative px-6 py-32">
      <SectionTitle label="Builder Passport" title="Your identity. Your progress. Your legacy." subtitle="Every builder receives a digital passport that tracks their journey, skills, and achievements." />
      <motion.div ref={ref} initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.7 }} className="mx-auto max-w-lg">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card to-zinc-950 p-8 shadow-2xl">
          <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full bg-electric-blue/10 blur-[60px]" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-deep-purple/10 blur-[50px]" />
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-electric-blue">Builder Passport</p>
              <h3 className="mt-1 text-xl font-bold text-white">Alex Rivera</h3>
              <p className="text-xs text-muted-foreground">Builder #047 &bull; Joined June 2026</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-electric-blue to-deep-purple text-lg font-bold text-white shadow-lg shadow-electric-blue/20">AR</div>
          </div>
          <div className="mb-6 grid grid-cols-3 gap-4 rounded-xl border border-border/40 bg-black/30 p-4 backdrop-blur-sm">
            <div className="text-center"><p className="text-2xl font-bold text-white">7</p><p className="text-xs text-muted-foreground">Level</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-white">2,450</p><p className="text-xs text-muted-foreground">Score</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-white">85%</p><p className="text-xs text-muted-foreground">Progress</p></div>
          </div>
          <div className="mb-6">
            <div className="mb-1 flex items-center justify-between text-xs"><span className="text-muted-foreground">Journey Progress</span><span className="text-gray-400">Day 8 of 10</span></div>
            <div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[85%] rounded-full bg-gradient-to-r from-electric-blue to-deep-purple" /></div>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Badges Earned</p>
            <div className="flex flex-wrap gap-2">
              {badgeData.map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">{b.icon}{b.label}</div>
              ))}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

// ─── Section 5: Builder Transformation ───

const transformations = [
  { before: "Afraid to present", after: "Pitches confidently", icon: "🎤" },
  { before: "Impostor syndrome", after: "Owns their craft", icon: "🛡️" },
  { before: "Waits for instructions", after: "Takes initiative", icon: "🚀" },
  { before: "Works alone", after: "Leads teams", icon: "👥" },
  { before: "Idea paralysis", after: "Ships daily", icon: "⚡" },
];

function BuilderTransformation() {
  const { ref, inView } = useScrollInView(0.2);
  return (
    <section className="relative px-6 py-32 bg-black/40">
      <SectionTitle label="Transformation" title="You don't just learn. You become." subtitle="Every builder emerges fundamentally different." />
      <div ref={ref} className="mx-auto max-w-4xl">
        <div className="grid gap-4">
          {transformations.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.5 }}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl border border-border/40 bg-card/40 p-5">
              <div className="text-right"><span className="rounded-lg bg-red-500/10 px-3 py-1 text-sm text-red-400">{item.before}</span></div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-blue/20"><span className="text-lg">{item.icon}</span></div>
              <div className="text-left"><span className="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">{item.after}</span></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 6: Manifesto ───

const manifestoLines = [
  "Education should be about building, not memorizing.",
  "You learn fastest when you ship to real users.",
  "Mentorship beats lectures. Always.",
  "Your first product won't be perfect. Ship it anyway.",
  "10 days is enough time to change your career.",
  "Builders aren't born. They're forged.",
];

function Manifesto() {
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const { ref, inView } = useScrollInView(0.3);
  useEffect(() => {
    if (!inView) return;
    setVisibleIndex(0);
    const timer = setInterval(() => setVisibleIndex(prev => prev >= manifestoLines.length - 1 ? prev : prev + 1), 1200);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <section id="manifesto" className="relative overflow-hidden px-6 py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-zinc-900 to-background" />
      <div className="pointer-events-none absolute inset-0"><div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-blue/10 blur-[120px]" /></div>
      <div ref={ref} className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="mb-8 inline-block text-xs font-medium uppercase tracking-[0.3em] text-electric-blue">The Manifesto</motion.span>
        <div className="space-y-6">
          {manifestoLines.map((line, i) => (
            <AnimatePresence key={i}>
              {visibleIndex >= i && (
                <motion.p initial={{ opacity: 0, y: 20, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.6 }}
                  className="text-2xl font-light leading-relaxed text-white sm:text-3xl lg:text-4xl">{line}</motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>
        {visibleIndex >= manifestoLines.length - 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-12">
            <div className="mx-auto h-px w-20 bg-electric-blue/50" /><p className="mt-4 text-sm text-muted-foreground">&mdash; Prod[X]</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Section 7: Products ───

const products = [
  { name: "StellarFlow", tagline: "AI-powered workflow automation platform", tech: "Next.js, tRPC, PostgreSQL", builder: "Alex Rivera & Team Nebula", color: "from-electric-blue to-blue-600" },
  { name: "QuarkDB", tagline: "Real-time database for collaborative apps", tech: "Rust, WebSocket, Redis", builder: "Marcus Thorne & Team Quantum", color: "from-deep-purple to-purple-600" },
  { name: "LumeOS", tagline: "Remote team wellness & synchronization", tech: "React Native, GraphQL, MongoDB", builder: "Jordan Smyth & Team Zenith", color: "from-emerald-500 to-teal-600" },
];

function ProductsSection() {
  const { ref, inView } = useScrollInView(0.15);
  return (
    <section id="products" className="relative px-6 py-32">
      <SectionTitle label="Built by Builders" title="Products that launched from Prod[X]" subtitle="Real products. Real users. Real impact." />
      <div ref={ref} className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <motion.div key={product.name} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.12, duration: 0.5 }}
            className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-6 transition-all hover:border-electric-blue/30 hover:shadow-xl hover:shadow-electric-blue/5">
            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${product.color} text-lg font-bold text-white shadow-lg`}>{product.name[0]}</div>
            <h3 className="text-lg font-semibold text-white">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tech.split(", ").map(t => <span key={t} className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">{t}</span>)}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Built by {product.builder}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Section 8: Demo Day ───

const feedback = [
  { name: "Sarah Kim", role: "Mentor, LeapStart", text: "The transformation from Day 1 to Demo Day is remarkable. These teams ship more in 10 days than most do in a semester.", rating: 5 },
  { name: "Marcus Chen", role: "Partner, PioneerVC", text: "I've seen demo days at top accelerators. Prod[X] builders punch well above their weight class.", rating: 5 },
  { name: "Lisa Park", role: "CTO, SyncWave", text: "The quality of thinking and execution on Demo Day consistently surprises me. These are real products.", rating: 5 },
];

function DemoDay() {
  const { ref, inView } = useScrollInView(0.15);
  return (
    <section id="demo" className="relative px-6 py-32 bg-black/40">
      <SectionTitle label="Demo Day" title="Launch day. All hands on deck." subtitle="Teams present live products to mentors, investors, and peers." />
      <div ref={ref} className="mx-auto max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {feedback.map((item, i) => (
            <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-xl border border-border/40 bg-card/60 p-6 backdrop-blur-sm">
              <div className="mb-3 flex gap-1">{Array.from({ length: item.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-500 text-amber-500" />)}</div>
              <p className="text-sm leading-relaxed text-gray-300">&ldquo;{item.text}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3 border-t border-border/40 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-electric-blue to-deep-purple text-xs font-bold text-white">
                  {item.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div><p className="text-sm font-medium text-white">{item.name}</p><p className="text-xs text-muted-foreground">{item.role}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 9: FAQ ───

const faqs = [
  { q: "Do I need to know how to code?", a: "Some programming experience helps, but we've had builders from design and non-tech backgrounds succeed. The key is willingness to learn fast." },
  { q: "What if I don't have a startup idea?", a: "We help you discover problems worth solving during Day 1. Many of our best products came from problems builders didn't know existed." },
  { q: "What's the time commitment?", a: "Full-time for 10 days. This is an intensive sprint — expect to work 8-12 hours daily with your team." },
  { q: "Do I keep my product?", a: "Absolutely. You retain full IP ownership of everything you build. Prod[X] is your launchpad, not your employer." },
  { q: "What support do I get?", a: "You're paired with an experienced mentor, have daily standups, and access to our entire toolchain and community." },
  { q: "What happens after Demo Day?", a: "You join our alumni network, get ongoing mentorship, and can apply for our follow-on funding program." },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, inView } = useScrollInView(0.15);
  return (
    <section id="faq" className="relative px-6 py-32">
      <SectionTitle label="FAQ" title="Common questions" subtitle="Everything you need to know before starting your journey." />
      <div ref={ref} className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.05, duration: 0.3 }}
            className="overflow-hidden rounded-xl border border-border/40 bg-card/40">
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-white/5">
              <span className="text-sm font-medium text-white">{faq.q}</span>
              <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div className="border-t border-border/40 px-6 py-4"><p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Section 10: Final CTA ───

function FinalCTA() {
  return (
    <section id="cta" className="relative overflow-hidden px-6 py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-electric-blue/5 to-background" />
      <div className="pointer-events-none absolute inset-0"><div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-blue/15 blur-[120px]" /></div>
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionLabel text="Start Your Journey" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">Ready to Become a Builder?</motion.h2>
        <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">Join the next cohort. 10 days from problem to live product. Your transformation starts now.</motion.p>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth">
            <Button size="lg" className="h-12 rounded-full px-10 text-base font-semibold premium shadow-xl shadow-electric-blue/30">Apply Now — Free Assessment</Button>
          </Link>
          <Button size="lg" variant="outline" className="h-12 rounded-full border-white/10 px-10 text-base font-semibold hover:bg-white/5">View Syllabus</Button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ───

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-electric-blue/30">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <WhyProdX />
        <BuilderJourney />
        <BuilderPassportSection />
        <BuilderTransformation />
        <Manifesto />
        <ProductsSection />
        <DemoDay />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
