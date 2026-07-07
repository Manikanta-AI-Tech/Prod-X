"use client";

import { DashboardTopbar } from "@/components/Dashboard/DashboardTopbar";
import { ProductForm } from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <DashboardTopbar
        title="New Product"
        subtitle="Add a new product to the builder ecosystem."
      />

      <div className="rounded-2xl border border-border/40 bg-card/40 p-6 md:p-8">
        <ProductForm />
      </div>
    </div>
  );
}