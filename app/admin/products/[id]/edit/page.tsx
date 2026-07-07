"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { getProduct } from "@/lib/products";
import type { Product } from "@/lib/products";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const id = params.id as string;
        const data = await getProduct(id);
        if (!data) {
          router.push("/admin/products");
          return;
        }
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16 sm:px-8">
          <div className="h-8 w-48 animate-pulse rounded bg-white/5" />
          <div className="mt-8 h-96 animate-pulse rounded-xl bg-white/5" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16 sm:px-8">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-8 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 sm:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Editing: <span className="text-white">{product?.name}</span>
          </p>
        </div>
        <ProductForm product={product} />
      </main>
      <Footer />
    </div>
  );
}
