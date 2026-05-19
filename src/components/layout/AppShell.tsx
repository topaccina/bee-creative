import Link from "next/link";
import { Hexagon } from "lucide-react";
import { ReactNode } from "react";

export function AppShell({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hive-950 via-hive-900 to-hive-950 text-honey-50">
      <header className="border-b border-white/10 bg-hive-950/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-honey-300">
            <Hexagon className="h-7 w-7 text-honey-400" strokeWidth={1.5} />
            <span>BeeWise Quiz Review</span>
          </Link>
          <nav className="flex gap-1 text-sm sm:gap-2">
            <NavLink href="/input">Input</NavLink>
            <NavLink href="/quiz">Quiz</NavLink>
            <NavLink href="/output">Output</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-honey-100 sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-honey-200/70">{description}</p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-honey-200/80 transition hover:bg-white/5 hover:text-honey-100"
    >
      {children}
    </Link>
  );
}
