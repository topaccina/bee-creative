# BeeWise Quiz Review

Internal QA tool to review BeeWise quiz questions from CSV, test answers, and capture reviewer feedback.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data

- Source CSV: `public/quiz-data.csv` (copy of `input_data/BeeWise Quiz - 13_05_fixed.csv`)
- Feedback is persisted in the browser (`localStorage`) and merged into the downloadable output CSV.

## Pages

| Route    | Description                                      |
| -------- | ------------------------------------------------ |
| `/`      | Home — links to Input, Quiz, Output              |
| `/input` | Read-only table of all quiz rows                 |
| `/quiz`  | Step through questions, answer, leave feedback   |
| `/output`| Table with `feedback` (Y/N) and `notes` columns  |
