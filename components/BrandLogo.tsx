import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="LeapStart School of Technology home"
      className={cn(
        "group flex w-fit items-center gap-3 rounded-xl transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue",
        className
      )}
    >
      <Image
        src="/leapstart-logo.svg"
        alt="LeapStart"
        width={46}
        height={54}
        priority
        className="h-10 w-auto shrink-0 transition-transform duration-200 group-hover:scale-105 sm:h-12"
      />
      <div className="min-w-0 leading-none">
        <p className="truncate text-base font-bold tracking-tight text-white sm:text-lg">LeapStart</p>
        <p className="mt-1 text-[10px] font-medium tracking-wide text-muted-foreground sm:text-xs">
          School of Technology
        </p>
        <span className="mt-2 inline-flex rounded-full border border-electric-blue/30 bg-electric-blue/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-electric-blue sm:text-[10px]">
          Prod[X]
        </span>
      </div>
    </Link>
  );
}
