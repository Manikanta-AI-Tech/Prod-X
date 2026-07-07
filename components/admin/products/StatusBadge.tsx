import { Badge } from "@/components/ui/Badge";
import type { ProductStatus } from "@/lib/products";

const statusConfig: Record<ProductStatus, { label: string; variant: "premium" | "success" | "secondary" | "destructive" }> = {
  idea: { label: "Idea", variant: "secondary" },
  building: { label: "Building", variant: "premium" },
  testing: { label: "Testing", variant: "destructive" },
  live: { label: "Live", variant: "success" },
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}