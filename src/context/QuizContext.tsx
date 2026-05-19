"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadFeedbackFromStorage, loadQuizRows, saveFeedbackToStorage } from "@/lib/quiz";
import type { FeedbackMap, QuestionFeedback, QuizRow } from "@/lib/types";

interface QuizContextValue {
  rows: QuizRow[];
  loading: boolean;
  error: string | null;
  feedbackMap: FeedbackMap;
  setQuestionFeedback: (id: string, feedback: QuestionFeedback) => void;
  clearAllFeedback: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<QuizRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<FeedbackMap>({});

  useEffect(() => {
    setFeedbackMap(loadFeedbackFromStorage());
    loadQuizRows()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, []);

  const setQuestionFeedback = useCallback((id: string, feedback: QuestionFeedback) => {
    setFeedbackMap((prev) => {
      const next = { ...prev, [id]: feedback };
      saveFeedbackToStorage(next);
      return next;
    });
  }, []);

  const clearAllFeedback = useCallback(() => {
    setFeedbackMap({});
    saveFeedbackToStorage({});
  }, []);

  const value = useMemo(
    () => ({
      rows,
      loading,
      error,
      feedbackMap,
      setQuestionFeedback,
      clearAllFeedback,
    }),
    [rows, loading, error, feedbackMap, setQuestionFeedback, clearAllFeedback]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
