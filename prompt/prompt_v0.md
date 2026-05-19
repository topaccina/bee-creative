# Quiz QA Review App — Cursor Prompt

Build a full-stack web app for validating and reviewing multiple-choice quiz questions from a CSV file.

## Tech Stack

- Frontend: Next.js 14 + TypeScript + TailwindCSS
- Backend/API: Next.js API routes
- State persistence: local JSON or SQLite database
- CSV parsing/export: PapaParse or csv-parse
- UI components: shadcn/ui
- Use clean modular architecture
- Responsive layout
- Minimal but professional UI

---

# App Purpose

This is NOT a production quiz app for students.

It is an internal QA/review tool used by teachers to evaluate the quality of quiz questions and answers before deploying them into another production system.

---

# CSV STRUCTURE

The uploaded CSV contains:

- Question ID
- Question text
- Multiple choice options
- Correct answer
- Explanation
- Additional metadata columns

Example columns:

- id
- question
- option_a
- option_b
- option_c
- option_d
- correct_answer
- explanation

The app must dynamically support extra columns too.

---

# FEATURES

## 1. CSV Upload

Allow user to:

- Upload CSV file
- Parse CSV
- Store data in app state/database
- Validate rows
- Show parsing errors if any

---

# 2. TABLE PAGE

Create page:

`/table`

Display the original uploaded CSV as a data table.

## Requirements

- Paginated table
- Search/filter
- Sortable columns
- Sticky header
- Horizontal scrolling for large CSVs
- Preserve all original columns

Add one extra column:

`review_mark`

Possible values:

- Y
- N
- empty

## Display Colors

- Y = green badge
- N = red badge
- empty = gray

Add button:

`Download Updated CSV`

When clicked:

- Export all original CSV columns
- Plus the `review_mark` column
- Download as CSV

---

# 3. QUIZ PAGE

Create page:

`/quiz`

## Purpose

Teacher reviews questions sequentially from Q1 to last question.

## Behavior

- Show ONE question at a time
- Navigation in order
- Previous/Next buttons
- Progress indicator

## Question UI

Show:

- Question text
- Multiple choice options as radio buttons
- Submit Answer button

## After Submit

- Lock answer
- Show whether selected answer is correct or incorrect
- Highlight correct option
- Highlight selected option
- Show explanation from CSV

---

# 4. REVIEW FEEDBACK

After answering each question:

Teacher can evaluate question quality.

Add:

- Dropdown selector with:
  - Y
  - N

Meaning:

- Y = question is good
- N = question/problematic or unhappy

Add:

- Submit Review button

## Behavior

- Save review immediately
- Persist incrementally
- No need to complete full quiz

The review result must instantly update:

- internal state/database
- the `/table` page

---

# 5. DATA PERSISTENCE

## Requirements

- Reviews persist after refresh
- Use SQLite or local JSON db
- Every question review updates storage immediately

---

# 6. CSV EXPORT

Exported CSV must contain:

- all original columns
- new `review_mark` column

---

# 7. UX DETAILS

## Quiz Page

- clean centered card UI
- keyboard accessible
- large readable typography
- color feedback for correct/incorrect answers

## Table Page

- compact data grid
- colored review column

Add filters:

- all
- Y
- N
- unreviewed

---

# 8. PROJECT STRUCTURE

Generate:

- complete folder structure
- reusable components
- TypeScript types
- API routes
- CSV utility functions
- storage layer
- example CSV

---

# 9. BONUS FEATURES

If possible also include:

- progress percentage
- reviewed count
- unreviewed count
- ability to jump directly to question number
- autosave notifications
- dark mode

---

# 10. DELIVERABLES

Generate:

- all code files
- installation instructions
- package.json
- README
- sample CSV
- setup commands

The generated app must run locally with:

```bash
npm install
npm run dev