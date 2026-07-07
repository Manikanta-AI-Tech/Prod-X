import Link from "next/link";
export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-12">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tighter text-white">
                Prod<span className="text-electric-blue">[</span>X<span className="text-electric-blue">]</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Don't Pitch Ideas. Launch Products.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              © 2026 LeapStart School of Technology
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Program</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/builder/journey" className="hover:text-white">Builder Journey</Link></li>
              <li><Link href="/manifesto" className="hover:text-white">Manifesto</Link></li>
              <li><Link href="/builder/journey" className="hover:text-white">Curriculum</Link></li>
              <li><Link href="/#demo" className="hover:text-white">Demo Day</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Community</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#products" className="hover:text-white">Products</Link></li>
              <li><Link href="/mentor" className="hover:text-white">Mentors</Link></li>
              <li><Link href="/builder/team" className="hover:text-white">Alumni</Link></li>
              <li><Link href="/builder/passport" className="hover:text-white">Hall of Fame</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Connect</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/auth" className="hover:text-white">Contact</Link></li>
              <li><Link href="https://twitter.com/leapstart" className="hover:text-white">Twitter</Link></li>
              <li><Link href="https://linkedin.com" className="hover:text-white">LinkedIn</Link></li>
              <li><Link href="https://github.com/Manikanta-AI-Tech/Prod-X" className="hover:text-white">GitHub</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}