# Architecture

## Stack

- Expo Router + React Native
- SQLite via expo-sqlite (local persistent storage)
- NativeWind for styling and theme support
- Expo AV for tap sound playback

## App flow

- The root layout initializes database tables and loads persisted theme.
- The home screen lists all counters and lets users increment/decrement values.
- The detail screen shows historical values and chart for one counter.
- The edit route reuses a single form for create and update flows.

## Main modules

- app/_layout.js: app bootstrap, theme initialization, top-level stack.
- app/index.js: counters list and sound lifecycle.
- app/counter/[id].js: history list + chart.
- app/counter/edit/[id].js: create/edit wrapper for the form.
- app/db/database.js: persistence API and transactions.
- components/form/Form.jsx: create/update/delete actions and validation messaging.
- lib/counterValidation.js: shared payload validation and normalization.

## Data and boundaries

- Data is persisted locally in SQLite.
- UI and behavior logic are implemented in app and components modules.
- Persistence behavior is centralized in app/db/database.js.
- Input normalization and validation helpers are centralized in lib/counterValidation.js.

## Reliability strategy

- Database operations are guarded and return safe fallback values on failure.
- Multi-step writes run in explicit transactions.
- User-facing form failures use Alert with actionable messages.
