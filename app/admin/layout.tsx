"use client";

import { Sidebar } from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar type="admin" />
      <main className="flex-1 pl-64">
        <div className="container mx-auto p-8 pt-20">
          {children}
        </div>
      </main>
    </div>
  );
}
