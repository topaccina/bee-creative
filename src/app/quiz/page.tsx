"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState, LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/context/QuizContext";
import { getCorrectIndex, getOptions, isAnswerCorrect } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";

type Phase = "answer" | "result" | "feedback-done";

export default function QuizPage() {
  const { rows, loading, error, feedbackMap, setQuestionFeedback } = useQuiz();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("answer");
  const [thumb, setThumb] = useState<"Y" | "N" | null>(null);
  const [note, setNote] = useState("");

  const row = rows[index];
  const total = rows.length;
  const options = row ? getOptions(row) : [];
  const correctIndex = row ? getCorrectIndex(row) : -1;
  const isCorrect =
    selected !== null && row ? isAnswerCorrect(row, selected) : false;
  const existingFeedback = row ? feedbackMap[row.id] : undefined;

  useEffect(() => {
    if (!row) return;
    setSelected(null);
    setPhase("answer");
    const fb = feedbackMap[row.id];
    setThumb(fb?.feedback ?? null);
    setNote(fb?.notes ?? "");
    // Only reset when navigating between questions, not when saving feedback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, row?.id]);

  const goTo = (next: number) => {
    if (next >= 0 && next < total) setIndex(next);
  };

  const handleSubmitAnswer = () => {
    if (selected === null) return;
    setPhase("result");
  };

  const handleSubmitFeedback = () => {
    if (!row || thumb === null) return;
    setQuestionFeedback(row.id, { feedback: thumb, notes: note.trim() });
    setPhase("feedback-done");
  };

  if (loading) {
    return (
      <AppShell title="Test quiz">
        <LoadingState />
      </AppShell>
    );
  }

  if (error || !row) {
    return (
      <AppShell title="Test quiz">
        <ErrorState message={error ?? "No questions found"} />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Test quiz"
      description={`Question ${index + 1} of ${total} · ${row.topic_label}`}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-honey-500 transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-sm text-honey-200/60">
          {index + 1}/{total}
        </span>
      </div>

      <article className="rounded-2xl border border-white/10 bg-hive-900/50 p-6 shadow-xl sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-honey-400">
          {row.id} · {row.topic_key}
        </p>
        <h2 className="mt-3 text-xl font-semibold leading-snug text-honey-50 sm:text-2xl">
          {row.text}
        </h2>

        <ul className="mt-8 space-y-3">
          {options.map((opt, i) => {
            const isSelected = selected === i;
            const showCorrect = phase !== "answer" && i === correctIndex;
            const showWrong =
              phase !== "answer" && isSelected && i !== correctIndex;

            return (
              <li key={i}>
                <button
                  type="button"
                  disabled={phase !== "answer"}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition",
                    phase === "answer" &&
                      (isSelected
                        ? "border-honey-500 bg-honey-500/15 text-honey-50"
                        : "border-white/10 bg-white/[0.03] text-honey-100 hover:border-honey-500/40"),
                    showCorrect &&
                      "border-emerald-500/60 bg-emerald-500/15 text-emerald-50",
                    showWrong &&
                      "border-rose-500/60 bg-rose-500/15 text-rose-50",
                    phase !== "answer" &&
                      !showCorrect &&
                      !showWrong &&
                      "border-white/5 opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      isSelected ? "bg-honey-500 text-hive-950" : "bg-white/10"
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 pt-0.5">{opt}</span>
                  {showCorrect && (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  )}
                  {showWrong && (
                    <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {phase === "answer" && (
          <div className="mt-8 flex justify-end">
            <Button
              size="lg"
              disabled={selected === null}
              onClick={handleSubmitAnswer}
            >
              Submit answer
            </Button>
          </div>
        )}

        {phase !== "answer" && (
          <div className="mt-8 space-y-6 border-t border-white/10 pt-8">
            <div
              className={cn(
                "flex items-start gap-3 rounded-xl px-4 py-3",
                isCorrect
                  ? "bg-emerald-500/15 text-emerald-100"
                  : "bg-rose-500/15 text-rose-100"
              )}
            >
              {isCorrect ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
              )}
              <div>
                <p className="font-semibold">
                  {isCorrect ? "Correct!" : "Incorrect"}
                </p>
                <p className="mt-2 text-sm leading-relaxed opacity-90">
                  {row.explanation}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-honey-200">
                Reviewer feedback
                {existingFeedback && (
                  <span className="ml-2 text-honey-400/60">
                    (saved — submit again to update)
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setThumb("Y")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 transition",
                    thumb === "Y"
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-200"
                      : "border-white/10 hover:border-emerald-500/50"
                  )}
                >
                  <ThumbsUp className="h-5 w-5" />
                  Thumbs up (Y)
                </button>
                <button
                  type="button"
                  onClick={() => setThumb("N")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 transition",
                    thumb === "N"
                      ? "border-rose-500 bg-rose-500/20 text-rose-200"
                      : "border-white/10 hover:border-rose-500/50"
                  )}
                >
                  <ThumbsDown className="h-5 w-5" />
                  Thumbs down (N)
                </button>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note for this question…"
                rows={3}
                className="mt-3 w-full resize-y rounded-xl border border-white/10 bg-hive-950/50 px-4 py-3 text-sm text-honey-50 placeholder:text-honey-200/40 focus:border-honey-500/50 focus:outline-none focus:ring-1 focus:ring-honey-500/30"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  variant="success"
                  disabled={thumb === null}
                  onClick={handleSubmitFeedback}
                >
                  Submit feedback
                </Button>
                {phase === "feedback-done" && (
                  <span className="flex items-center text-sm text-emerald-400/90">
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Saved to output table
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </article>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={index >= total - 1}
          onClick={() => goTo(index + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </AppShell>
  );
}
