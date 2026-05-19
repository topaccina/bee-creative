import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Download, LayoutGrid, PlayCircle, Table2 } from "lucide-react";

const cards = [
  {
    href: "/input",
    title: "Input table",
    description: "View the full quiz dataset from the source CSV.",
    icon: Table2,
    accent: "from-amber-500/20 to-amber-600/5",
  },
  {
    href: "/quiz",
    title: "Test quiz",
    description:
      "Walk through each question, check answers, and leave thumbs feedback with notes.",
    icon: PlayCircle,
    accent: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    href: "/output",
    title: "Output table",
    description:
      "See feedback and notes merged into the dataset. Download CSV anytime.",
    icon: Download,
    accent: "from-sky-500/20 to-sky-600/5",
  },
];

export default function HomePage() {
  return (
    <AppShell
      title="BeeWise Quiz Review"
      description="Internal QA tool to review quiz questions, validate answers, and capture reviewer feedback."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, title, description, icon: Icon, accent }) => (
          <Link
            key={href}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-hive-900/40 p-6 transition hover:border-honey-500/40 hover:bg-hive-900/70"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition group-hover:opacity-100`}
            />
            <div className="relative">
              <div className="mb-4 inline-flex rounded-xl bg-honey-500/15 p-3 text-honey-400">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-honey-100">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-honey-200/65">
                {description}
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-honey-400 group-hover:text-honey-300">
                Open →
              </span>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-10 flex items-center gap-2 text-sm text-honey-200/50">
        <LayoutGrid className="h-4 w-4" />
        Progress is saved in your browser and reflected in the output table.
      </p>
    </AppShell>
  );
}
