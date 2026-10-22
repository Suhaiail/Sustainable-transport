# NPTEL Practice & Study Hub - Sustainable Transportation Systems

Interactive quiz web application and comprehensive study companion for **Sustainable Transportation Systems** (Course Code: `NOC26_CE107`, Course ID: `105107210`), taught by **Prof. Bhola Ram Gurjar**, Department of Civil Engineering, IIT Roorkee.

Contains:
1. **12 Weeks MCQ Practice Engine**: 120 verified questions extracted from assignment files.
2. **Interactive Study Material System**: Extracted from the complete 1,839-page NPTEL Course Book (`105107210.pdf`), organized across all 60 lectures, 12 weeks, 80 interactive 3D flashcards, and key terms glossary.

Zero-build static web app ready for free hosting on **GitHub Pages**.

---

## 🚀 How to Host on GitHub Pages (Available to Everyone for Free)

### Option 1: Via Git Command Line
Open PowerShell or Terminal in this folder (`NPTEL FILES`):
```bash
git init
git add .
git commit -m "Add Sustainable Transportation Systems quiz and study platform"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```
**Enable GitHub Pages**:
1. Open your repository on GitHub.
2. Click **Settings** (top tab) &rarr; **Pages** (left sidebar).
3. Under **Build and deployment** &rarr; **Branch**, select **`main`** and **`/ (root)`**, then click **Save**.
4. In ~1 minute, your website will be live at:
   ```
   https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/
   ```

---

### Option 2: Upload Directly via GitHub Web UI
1. Create a new repository on [GitHub](https://github.com/new).
2. Click **uploading an existing file**.
3. Drag and drop all the files from this folder (`index.html`, `style.css`, `app.js`, `README.md`, `data/`, and `assets/`).
4. Commit the changes.
5. Go to **Settings** &rarr; **Pages** &rarr; select branch **`main`** &rarr; **`/ (root)`** &rarr; **Save**.

---

## 🌟 Key Features

### 📖 1. Interactive Study Material (Extracted from 105107210.pdf)
- **All 60 Lectures Mapped Across 12 Weeks**:
  - Exact page number citations referencing `105107210.pdf` (pp. 4–1839).
  - High-yield bullet points, core concepts, frameworks, and exam takeaways.
  - "🎯 Practice Week X MCQs" one-click button inside each study week.
- **80 Interactive 3D Flip Flashcards**:
  - Test yourself on high-yield definitions, acts, years, policies, and formulas.
  - Controls: Flip, Next, Previous, Shuffle, with smooth 3D CSS animation and keyboard shortcuts (Space / Enter / Arrow keys).
- **Live Search & Filter**:
  - Search across all lectures, topics, case studies, and keywords (e.g. `EIA`, `TOD`, `BRTS`, `STAN`, `openLCA`, `DPSIR`, `STAR`, `NCAP`, `BS-VI`).
  - Filter by week (1 to 12) or expand/collapse all notes.
- **Acronyms & Glossary**:
  - Quick reference for essential environmental and transport acronyms.

### 📝 2. Practice Quizzes & Mock Test System
- **120 Assignment Questions**:
  - All 12 weeks of assignments with verified answer keys.
- **3 Quiz Modes**:
  - **Practice Mode**: Instant feedback per question (green for correct, red for incorrect).
  - **Quiz Mode**: Normal test environment with review at the end.
  - **Mock Test Mode**: Realistic timed exam conditions with score percentage.
- **Mistake Tracker (LocalStorage)**:
  - Tracks missed questions automatically across browser sessions.
  - "Practice wrong answers" and "View wrong answers" buttons.
- **Keyboard Navigation**:
  - Keys `1`, `2`, `3`, `4`: Select option.
  - Key `Enter`: Next question / submit.
  - Key `←`: Previous question.
  - Key `Esc`: Close modals.

---

## 📁 Directory Structure

```
.
├── index.html                  # Main SPA website entry point
├── style.css                   # Custom dark theme stylesheet
├── app.js                      # Quiz engine, study explorer & keyboard shortcuts
├── README.md                   # Setup and deployment instructions
├── data/
│   ├── questions.json          # 12-week MCQ question bank (120 questions)
│   ├── questions.js            # Offline/CORS-safe question bank loader
│   ├── study_material.json     # 60 lectures, 80 flashcards & glossary (JSON)
│   └── study_material.js       # Offline/CORS-safe study material loader
└── assets/
    └── images/
        └── week_1_q10.webp     # Embedded motor vehicle trends graph for Week 1 Q10
```
