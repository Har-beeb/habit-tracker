# Habit Tracker (Web Portal)

A robust, offline-first habit tracking application built with Next.js. Designed to help users build and maintain routines, this app ensures you can log your habits and keep your streaks alive even when you lose internet connection.

## 🚀 Features

* **Next.js Web Portal:** A highly responsive and fast frontend built with the Next.js App Router.
* **Offline-First (PWA):** Powered by custom Service Workers to cache the app shell, allowing users to load the dashboard and view data offline.
* **Secure Authentication:** User login and signup flow with persisted sessions.
* **Dark Mode Support:** Integrated theming for a seamless user experience day or night.
* **Bulletproof Reliability:** 100% test coverage for core user flows using Playwright End-to-End (E2E) testing.

## 🛠️ Tech Stack

* **Framework:** Next.js (React)
* **Styling:** Tailwind CSS
* **Testing:** Vitest, Playwright
* **Architecture:** Progressive Web App (PWA)

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/habit-tracker.git](https://github.com/your-username/habit-tracker.git)
   ```
2. Navigate into the project directory:

```bash
cd habit-tracker
```

3. Install the dependencies:

```bash
npm install
```

### Running the Development Server

1. Start the local development server:

```bash
npm run dev
```

2. Open http://localhost:3000 in your browser to see the app.

### 🧪 Testing
This project uses Playwright to ensure all critical user journeys work perfectly.

To run the End-to-End tests:

```bash
npx playwright test
```

To open the Playwright UI for a visual debugging experience:

```bash
npx playwright test --ui
```


------

👤 Author
Name: Har-beebullah I.O
HNG Slack ID: H.A.X
Track: Frontend