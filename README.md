# NPTEL Practice - Sustainable Transportation Systems (2026)

Interactive quiz web application for **Sustainable Transportation Systems** (Course Code: `NOC26_CE107`). Contains all 12 weeks of assignments (120 verified multiple-choice questions) extracted directly from the course assignment files.

Ready for immediate deployment to **GitHub Pages** with zero setup or build steps required.

---

## 🚀 How to Host on GitHub Pages (Available to Everyone for Free)

### Option 1: Via Git Command Line
1. Open PowerShell or Terminal in this folder (`NPTEL FILES`):
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Sustainable Transportation Systems Quiz"
   ```
2. Create a new repository on [GitHub](https://github.com/new) (e.g. `nptel-sustainable-transportation-systems`).
3. Link and push to GitHub:
   ```bash
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git branch -M main
   git push -u origin main
   ```
4. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** (top tab) &rarr; **Pages** (left menu).
   - Under **Build and deployment** &rarr; **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and `/ (root)`, then click **Save**.
   - In 1–2 minutes, your website will be live at:
     ```
     https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/
     ```

---

### Option 2: Upload Directly via GitHub Web UI
1. Create a new empty repository on [GitHub](https://github.com/new).
2. Click **uploading an existing file** on the repository page.
3. Drag and drop all the files from this folder (`index.html`, `style.css`, `app.js`, `README.md`, `data/`, and `assets/`).
4. Commit the changes.
5. Go to **Settings** &rarr; **Pages**, select **Deploy from a branch** &rarr; branch: `main` &rarr; `/ (root)` &rarr; **Save**.

---

## 💻 Local Usage
You can test the website immediately on your computer:
- Simply double-click `index.html` to open it in any web browser (Chrome, Edge, Firefox, Safari).
- Or run a simple local web server:
  ```bash
  py -m http.server 8080
  ```
  and visit `http://localhost:8080`.

---

## 🌟 Features Included

- **All 12 Weeks & 120 Questions**:
  - Week 1: Introduction to Environmental Impact Assessment (EIA) and Transportation systems
  - Week 2: Land-use plans, zoning schemes and provisions
  - Week 3: Urban and regional transport planning
  - Week 4: Impacts on humans, flora and fauna, soil, water, air, climate and landscape
  - Week 5: Establishment of baseline conditions w.r.t soil, water and air quality
  - Week 6: Noise, air and water pollution modelling
  - Week 7: Modelling of impacts and scenario-based analysis
  - Week 8: Assessment of potential project impacts including indirect, cumulative and synergistic impacts
  - Week 9: Decision support systems for EIA of transport infrastructures
  - Week 10: Abatement measures
  - Week 11: Sustainable transportation systems
  - Week 12: Case studies of highway, railway and airport projects, OpenLCA tool for Life Cycle Assessment, STAN for material flow analysis

- **3 Quiz Modes**:
  - **Practice Mode**: Immediate feedback on selecting answers (highlights correct in green, wrong in red).
  - **Quiz Mode**: Select answers throughout the quiz and review full results at the end.
  - **Mock Test Mode**: Realistic exam simulation with score percentage and in-depth answer review.

- **Mistake / Wrong Answer Tracking**:
  - Incorrect answers are automatically saved to your browser (`localStorage`).
  - Access **Practice wrong answers** anytime to target and master difficult questions.

- **Keyboard Shortcuts**:
  - Press `1`, `2`, `3`, `4`: Select option.
  - Press `Enter`: Next question or finish quiz.
  - Press `ArrowLeft`: Previous question.
  - Press `Esc`: Close modals.

- **Custom Controls**:
  - Multi-week selection (pick any combination of weeks).
  - "Select all" / "Deselect all" toggle.
  - "Shuffle question order" toggle.
  - "Shuffle answer order" toggle.
  - Full markdown formatting with comparison tables and diagrams (including Week 1 Graph).

---

## 📁 Project Structure

```
.
├── index.html                  # Main SPA website entry point
├── style.css                   # Dark theme stylesheet
├── app.js                      # Application logic, quiz engine, & keyboard shortcuts
├── README.md                   # Setup and GitHub Pages deployment guide
├── data/
│   ├── questions.json          # Complete 12-week MCQ question bank (JSON)
│   └── questions.js            # Offline/CORS-safe data loader script
└── assets/
    └── images/
        └── week_1_q10.webp     # Embedded motor vehicle trends graph for Week 1 Q10
```
