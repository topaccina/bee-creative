"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ErrorState, LoadingState } from "@/components/LoadingState";
import { QuizTable } from "@/components/QuizTable";
import { useQuiz } from "@/context/QuizContext";

export default function InputPage() {
  const { rows, loading, error } = useQuiz();

  return (
    <AppShell
      title="Input table"
      description={`Source dataset — ${rows.length} questions loaded from CSV.`}
    >
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <>
          <p className="mb-4 text-sm text-honey-200/60">
            Read-only view of <code className="text-honey-300">quiz-data.csv</code>
          </p>
          <QuizTable rows={rows} />
        </>
      )}
    </AppShell>
  );
}
