"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function admin_analytics_Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 sm:px-8">
        <div className="py-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-electric-blue/30 bg-electric-blue/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-electric-blue">
            Admin Analytics
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Admin Analytics
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Usage stats, engagement, and growth metrics.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
