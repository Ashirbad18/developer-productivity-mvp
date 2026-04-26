# DevPulse — Developer Productivity Dashboard

A React.js web app that shows developer productivity metrics **and explains what they mean**, with actionable next steps.

**Live at:** [https://developer-productivity-mvp-kappa.vercel.app](https://developer-productivity-mvp-kappa.vercel.app)

---

## The Problem

Metrics alone (e.g. "8 PRs shipped, 6-day lead time") don't help developers improve. DevPulse adds **interpretation** and **next steps** to every metric set.

## How It Works

1. Select a developer from the dropdown
2. View their 5 productivity metrics for April 2026
3. Read the interpretation: Healthy / Slow / At Risk / Watch
4. Get 1–2 specific next steps to improve

---

## The 5 Metrics

| Metric | Definition | Target |
|---|---|---|
| **Lead Time** | Days from PR opened → deployed to prod | < 5 days |
| **Cycle Time** | Days from issue started → marked Done | < 5 days |
| **Bug Rate** | Escaped bugs / completed issues (%) | < 10% |
| **Deployment Frequency** | Prod releases per month | 2+ |
| **PR Throughput** | Merged pull requests per month | 4+ |

---

## Tech Stack

- **React.js** — component-based UI
- **JavaScript** — metric calculation and interpretation logic
- **CSS** — dark-mode glassmorphism design
- **JSON** — data layer (converted from Excel)

---

## How to Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/developer-productivity-mvp.git
cd developer-productivity-mvp
npm install
npm start
```

Then open http://localhost:3000

### (Optional) Use your own Excel data

If you have `intern_assignment_support_pack_dev_only_v3.xlsx`:

```bash
pip install pandas openpyxl
python convert_excel.py
```

This overwrites `src/data/data.json` with live data.

---

## Project Structure

```
developer-productivity-mvp/
├── src/
│   ├── components/
│   │   ├── DeveloperPicker.jsx     # Dropdown to select a developer
│   │   ├── MetricsDisplay.jsx      # 5 metric cards
│   │   └── InterpretationPanel.jsx # Status + pattern + next steps
│   ├── utils/
│   │   ├── metricsCalculator.js    # Computes all 5 metrics from raw data
│   │   └── interpretationEngine.js # Decision rules: healthy / at-risk / etc.
│   ├── data/
│   │   └── data.json               # Developer + metrics data
│   ├── App.js                      # Main app layout
│   └── App.css                     # Dark-mode premium styling
├── convert_excel.py                # Python: Excel → JSON converter
└── README.md
```

---

## Design Decisions

- **Why JSON?** Lightweight, no backend needed. Converts from Excel via Python script.
- **Why these thresholds?** Based on DORA metrics research (lead time >6d = slow, bug rate >12% = watch).
- **Why React?** Component reuse (MetricsDisplay, InterpretationPanel), state management for dev selection.
- **Why dark mode?** Premium feel, easier on eyes for developer-focused tools.

---

*Built for the Developer Productivity Intern Assignment.*
