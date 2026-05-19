import Papa from "papaparse";
import type { FeedbackMap, QuizRow } from "./types";

export const INPUT_COLUMNS: (keyof QuizRow)[] = [
  "id",
  "topic_key",
  "topic_label",
  "text",
  "option_1",
  "option_2",
  "option_3",
  "option_4",
  "correct_index",
  "explanation",
  "time_limit_seconds",
];

export const COLUMN_LABELS: Record<keyof QuizRow | "feedback" | "notes", string> = {
  id: "ID",
  topic_key: "Topic key",
  topic_label: "Topic",
  text: "Question",
  option_1: "Option 1",
  option_2: "Option 2",
  option_3: "Option 3",
  option_4: "Option 4",
  correct_index: "Correct index",
  explanation: "Explanation",
  time_limit_seconds: "Time limit (s)",
  feedback: "Feedback",
  notes: "Notes",
};

export async function loadQuizRows(): Promise<QuizRow[]> {
  const response = await fetch("/quiz-data.csv");
  if (!response.ok) {
    throw new Error("Failed to load quiz data");
  }
  const csvText = await response.text();
  const parsed = Papa.parse<QuizRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors[0]?.message ?? "CSV parse error");
  }
  return parsed.data.filter((row) => row.id?.trim());
}

export function getOptions(row: QuizRow): string[] {
  return [row.option_1, row.option_2, row.option_3, row.option_4];
}

export function getCorrectIndex(row: QuizRow): number {
  return Number.parseInt(row.correct_index, 10);
}

export function isAnswerCorrect(row: QuizRow, selectedIndex: number): boolean {
  return selectedIndex === getCorrectIndex(row);
}

export function loadFeedbackFromStorage(): FeedbackMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("beewise-quiz-feedback");
    if (!raw) return {};
    return JSON.parse(raw) as FeedbackMap;
  } catch {
    return {};
  }
}

export function saveFeedbackToStorage(feedback: FeedbackMap): void {
  localStorage.setItem("beewise-quiz-feedback", JSON.stringify(feedback));
}

export function rowsToCsv(
  rows: QuizRow[],
  feedbackMap: FeedbackMap
): string {
  const headers = [...INPUT_COLUMNS, "feedback", "notes"];
  const data = rows.map((row) => {
    const fb = feedbackMap[row.id];
    return {
      ...row,
      feedback: fb?.feedback ?? "",
      notes: fb?.notes ?? "",
    };
  });
  return Papa.unparse(data, { columns: headers });
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
