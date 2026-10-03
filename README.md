# ClientPulse — Micro-CRM & Sales Pipeline Tracker

ClientPulse is a visual sales pipeline management tool engineered for small businesses, freelancers, and agencies. It features an interactive drag-and-drop Kanban board, real-time pipeline valuation metrics, lead search, contact note logging, and local storage persistence.

![Status](https://img.shields.io/badge/Status-Live-success)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

- **Drag-and-Drop Pipeline Board**: Effortlessly move deal cards across 5 key sales stages (`New Lead`, `Contacted`, `Proposal Sent`, `Closed Won`, `Closed Lost`).
- **Real-Time Revenue Analytics**: Automatically calculates total deals, overall pipeline value, closed revenue, and win-rate percentage.
- **Search & Filter System**: Instant live search by client name or company name across all pipeline stages.
- **Lead Management Modal**: Complete form for creating and updating lead records, deal amounts, contact details, and interaction logs.
- **Dark/Light Mode Engine**: Seamless theme switching backed by `localStorage`.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Flexbox/Grid, Custom Properties)
- **JavaScript**: Modern ES6+ (HTML5 Drag & Drop API, DOM Manipulation, LocalStorage API)
- **Icons**: FontAwesome 6.4

---

## 📁 Project Structure

```text
ClientPulse/
│
├── index.html          # Application markup, layout, and modal
├── style.css           # Styling, themes, responsive board layout
├── app.js              # Drag-and-drop logic, metrics calculation, local storage
├── README.md           # Documentation
└── .gitignore          # System ignore rules