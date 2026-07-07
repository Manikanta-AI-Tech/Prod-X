import type { ProductStatus } from "@/lib/products";

interface Props {
  status: ProductStatus;
}

export function StatusBadge({ status }: Props) {
  const isPublished = status === "published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isPublished
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-emerald-400" : "bg-amber-400"}`} />
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
