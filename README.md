# Nexus Command — Personal Academic & Life Dashboard

A dynamic, high-leverage personal command center built with React, TypeScript, Tailwind CSS, and optional Supabase cloud persistence.

---

## ⚡ Key Features

1. **Course Syllabus & Progress Checklist**:
   - Structured hierarchy: Course $\rightarrow$ Modules $\rightarrow$ Topics.
   - Interactive checklist with real-time percentage completion meters per module and course.
   - High-yield topic notes & formula vault (Markdown support + formula tags).
   - Pre-loaded with realistic 2nd-Semester BBA courses (Principles of Marketing, Microeconomics, Business Math, Financial Accounting, Business Communication).

2. **Daily Action Command & Todos**:
   - Priority filters (High, Medium, Low) and category tags (Study, Assignment, Exam, Routine, Personal).
   - Instant due date alerts ("Due Today", "Overdue").
   - Micro-confetti celebration upon clearing items.

3. **Habit & Consistency Tracker**:
   - Visual 7-day completion streak matrix.
   - Active daily routine streaks and weekly targets.

4. **Mindset & Wisdom Crucible (Quotes)**:
   - High-signal insights curated from Richard Feynman, Naval Ravikant, Marcus Aurelius, Charlie Munger, and Seneca.
   - Categories: Mental Models, Analytical Thinking, Marketing Wisdom, Focus & Depth, Growth & Resilience.
   - Shuffle / Next Insight button, copy to clipboard, and custom quote creation.

5. **Semester GPA & CGPA Engine (DIU 4.00 Scale)**:
   - Real-time credit-weighted grade point calculations based on DIU grading standards.
   - Target CGPA goal tracker and grade simulators for remaining courses.

6. **Exam Countdown & Assignment Tracker**:
   - Live countdown timers (Days, Hours, Minutes, Seconds) with urgency badges (Critical, Approaching).
   - Coursework deadlines with weightage % and submission status.

7. **Audiobooks & Reading Log**:
   - Track fantasy audiobooks, business classics, and scientific papers with progress sliders and key takeaway notes.

8. **Zero Data Loss Storage**:
   - Automatic local browser persistence.
   - 1-Click JSON export / import backup files.
   - Optional Supabase Cloud Sync with 1-click SQL setup.

---

## 🚀 Quick Start (Local)

```bash
# Navigate to project directory
cd "C:/Users/ANIK PC/projects/personal-dashboard"

# Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## ☁️ Deploying to Cloud Server (Free Forever)

### Option 1: Vercel (Recommended — 2 minutes)
1. Initialize git and push to your GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "feat: initial dashboard commit"
   gh repo create personal-dashboard --public --source=. --push
   ```
2. Go to [vercel.com](https://vercel.com) $\rightarrow$ **Add New Project** $\rightarrow$ Import your `personal-dashboard` repository.
3. Click **Deploy**. Vercel will build and give you a live production URL (e.g. `https://anik-dashboard.vercel.app`) accessible from any laptop or mobile phone.

### Option 2: Supabase Free Cloud Database Sync
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and paste the setup script provided inside the dashboard settings modal:
   ```sql
   create table if not exists public.user_dashboard (
     id text primary key,
     user_name text not null default 'Nh Anik',
     data jsonb not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   alter table public.user_dashboard enable row level security;
   create policy "Allow all actions for dashboard owner" on public.user_dashboard for all using (true) with check (true);
   ```
3. Copy your **Project URL** and **Public Anon Key** from Project Settings $\rightarrow$ API, and paste them into the dashboard's **Cloud Settings Modal** (or `.env` file).
