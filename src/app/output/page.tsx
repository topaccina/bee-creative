"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ErrorState, LoadingState } from "@/components/LoadingState";
import { QuizTable } from "@/components/QuizTable";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/context/QuizContext";
import { downloadCsv, rowsToCsv } from "@/lib/quiz";
import { Download, Trash2 } from "lucide-react";

export default function OutputPage() {
  const { rows, loading, error, feedbackMap, clearAllFeedback } = useQuiz();

  const feedbackCount = Object.keys(feedbackMap).length;

  const handleDownload = () => {
    const csv = rowsToCsv(rows, feedbackMap);
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `beewise-quiz-output-${date}.csv`);
  };

  return (
    <AppShell
      title="Output table"
      description="All input columns plus Feedback (Y/N) and Notes. Updated live as you review in the quiz."
    >
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && !error && (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
            <span className="text-sm text-honey-200/60">
              {feedbackCount} / {rows.length} questions with feedback
            </span>
            {feedbackCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (
                    confirm(
                      "Clear all saved feedback? This cannot be undone."
                    )
                  ) {
                    clearAllFeedback();
                  }
                }}
                className="ml-auto gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear feedback
              </Button>
            )}
          </div>
          <QuizTable rows={rows} feedbackMap={feedbackMap} showOutputColumns />
        </>
      )}
    </AppShell>
  );
}
