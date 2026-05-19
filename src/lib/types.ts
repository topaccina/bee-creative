export interface QuizRow {
  id: string;
  topic_key: string;
  topic_label: string;
  text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  correct_index: string;
  explanation: string;
  time_limit_seconds: string;
}

export interface QuestionFeedback {
  feedback: "Y" | "N";
  notes: string;
}

export type FeedbackMap = Record<string, QuestionFeedback>;

export const QUIZ_CSV_PATH = "/quiz-data.csv";
export const STORAGE_KEY = "beewise-quiz-feedback";
