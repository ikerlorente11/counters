# Architecture

## Stack

- Expo Router + React Native
- SQLite via expo-sqlite (local persistent storage)
- NativeWind for styling and theme support
- Expo Print + Expo Sharing for annual report export
- Expo Clipboard for report copy actions

## App flow

- The root layout initializes database tables, synchronizes development preview data, and loads persisted theme, language, and layout mode.
- The home screen lists all counters and lets users increment/decrement values.
- The home screen supports persisted list/grid layouts and direct drag-and-drop reordering.
- The detail screen shows historical values and chart for one counter.
- The edit route reuses a single form for create and update flows.
- The topbar provides report, language, layout, and theme actions.

## Main modules

- app/_layout.js: app bootstrap, theme initialization, top-level stack.
- app/index.js: counters list and sound lifecycle.
- app/counter/[id].js: history list + chart.
- app/counter/edit/[id].js: create/edit wrapper for the form.
- components/Topbar.jsx: topbar menu, annual report modal, export actions, language and theme controls.
- lib/db/database.js: persistence API, transactions, archive support, display order persistence, and development preview synchronization.
- components/form/Form.jsx: create/update/delete actions and validation messaging.
- components/DraggableCounter.jsx: long-press drag and drop interactions for home cards.
- lib/counterValidation.js: shared payload validation and normalization.
- lib/reporting.js: annual report grouping and text helpers.
- lib/developmentPreview.js: representative development-only screenshot dataset.

## Data and boundaries

- Data is persisted locally in SQLite.
- UI and behavior logic are implemented in app and components modules.
- Persistence behavior is centralized in lib/db/database.js.
- Input normalization and validation helpers are centralized in lib/counterValidation.js.
- Development preview data is seeded only in development and purged on production startup.

## Reliability strategy

- Database operations are guarded and return safe fallback values on failure.
- Multi-step writes run in explicit transactions.
- User-facing failures use actionable feedback through toasts or explicit form alerts.
- Annual report modal degrades safely with a loading state and empty state.
