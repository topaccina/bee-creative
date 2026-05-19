"use client";

import { COLUMN_LABELS, INPUT_COLUMNS } from "@/lib/quiz";
import type { FeedbackMap, QuizRow } from "@/lib/types";
import { cn } from "@/lib/utils";

interface QuizTableProps {
  rows: QuizRow[];
  feedbackMap?: FeedbackMap;
  showOutputColumns?: boolean;
}

export function QuizTable({
  rows,
  feedbackMap = {},
  showOutputColumns = false,
}: QuizTableProps) {
  const columns = showOutputColumns
    ? ([...INPUT_COLUMNS, "feedback", "notes"] as const)
    : INPUT_COLUMNS;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-hive-900/50 shadow-xl">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-hive-800/95 backdrop-blur">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap border-b border-white/10 px-3 py-3 font-semibold text-honey-300"
                >
                  {COLUMN_LABELS[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const fb = feedbackMap[row.id];
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-white/5 transition hover:bg-white/[0.03]",
                    i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                  )}
                >
                  {INPUT_COLUMNS.map((col) => (
                    <td
                      key={col}
                      className="max-w-xs truncate px-3 py-2.5 text-honey-100/90"
                      title={row[col]}
                    >
                      {row[col]}
                    </td>
                  ))}
                  {showOutputColumns && (
                    <>
                      <td className="px-3 py-2.5">
                        <FeedbackBadge value={fb?.feedback} />
                      </td>
                      <td
                        className="max-w-xs truncate px-3 py-2.5 text-honey-100/80"
                        title={fb?.notes}
                      >
                        {fb?.notes || "—"}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeedbackBadge({ value }: { value?: "Y" | "N" }) {
  if (!value) {
    return <span className="text-honey-200/40">—</span>;
  }
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
        value === "Y"
          ? "bg-emerald-500/20 text-emerald-300"
          : "bg-rose-500/20 text-rose-300"
      )}
    >
      {value}
    </span>
  );
}
