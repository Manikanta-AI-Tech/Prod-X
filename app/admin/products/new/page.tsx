"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductForm } from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 sm:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">New Product</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add a new product to the catalog.</p>
        </div>
        <ProductForm />
      </main>
      <Footer />
    </div>
  );
}
