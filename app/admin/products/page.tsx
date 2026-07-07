"use client";
import { Suspense } from "react";
import { ProductsPageContent } from "./ProductsPageContent";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
