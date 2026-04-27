# Functional Specification

## User capabilities

1. Users can create a counter with name, numeric value, text color, and background color.
2. Users can update any existing counter.
3. Users can archive a counter from edit mode (soft delete).
4. Users can increment and decrement from the home list.
5. Users can open a counter and see history plus trend chart.
6. Users can switch theme and the choice is persisted.
7. Users see the interface in English or Spanish depending on device language.
8. Users can recover archived counters from the create screen.
9. Users can open an annual report with year-end maximum values, copy it, and export it as PDF.
10. Users can reorder counters by long-pressing a counter and dragging it directly to a new position.
11. Users can switch the home view between a list and a two-column grid from the topbar menu.
12. Users can reset a single counter to 0 from the edit form without losing its history.
13. Users can reset all counters to 0 at once from the topbar menu without losing history.
14. Users can undo a same-day reset to restore counter values from the topbar menu.
15. Users can navigate to the home screen by tapping the app title or the Home item in the topbar menu.
16. Users can schedule a daily reminder notification to update their counters (requires a development build).

## Validation and input rules

1. Name is normalized and cannot be empty after trim.
2. Value must be a valid integer.
3. Invalid input shows explicit feedback and blocks persistence.

## Error handling and feedback

1. Validation errors show animated success/error/info toast notifications.
2. Toast notifications appear at the top of the screen with auto-dismiss after 3 seconds.
3. Error toasts include title and descriptive message (red color).
4. Success toasts include title and confirmation message (green color).
5. Info toasts provide informational feedback (blue color).
6. Toasts can be manually dismissed by tapping the close button.

## Persistence behavior

1. Every value change is stored as a daily historical data point.
2. Insert counter and first history point are atomic.
3. Counter update and optional history update are atomic.
4. Increment/decrement update and history write are atomic.
5. Archiving a counter marks it as archived and keeps historical values for future recovery.
6. Counter display order is persisted when user reorders via drag and drop.
7. Display order is 0-indexed and counters are sorted by displayOrder on retrieval.
8. Layout mode is persisted in configuration and restored on startup.
9. Development preview counters are seeded only in development builds and are purged in production builds.
10. Counter reset writes a 0 value as a new history entry for the current day; previous history is preserved.
11. Undo reset removes the current day's 0 entry and restores each counter to its most recent prior value. Only reliable if performed on the same day as the reset and before any further changes.
12. In Expo Go, development preview counters are always re-seeded on every app launch to restore test state.

## UI state behavior

1. Home screen shows all counters sorted by display order and supports direct value changes.
2. Long-pressing a counter activates drag mode without opening any modal or popup.
3. Dropping a dragged counter persists the new order immediately.
4. Success toast confirms order was saved; error toast if persistence fails.
5. Topbar menu includes a layout toggle between list and two-column grid.
6. Grid mode renders counters in two columns on the home screen.
7. Detail screen supports empty history state without crash.
8. Form supports create and edit flows with the same component.
9. Annual report opens in a modal with immediate loading feedback.
10. Annual report content scrolls inside the modal without overflowing the screen.
11. Annual report year sections are collapsed by default and expand on tap.
12. Topbar menu order: Home, Grid, Theme, Language, Report, Reset all, Undo reset.
13. Reset icon appears in the top-right corner of the edit form, aligned with the title and subtitle.
14. Status bar text color adapts to light and dark theme across all screens.

## Quality gates

1. Lint must pass.
2. Unit tests must pass.
3. Expo Doctor checks must pass.

## Execution commands

- Expo launch: npx expo start
- Development start: npm run start
- Android: npm run android
- iOS: npm run ios
- Web: npm run web
- Lint: npm run lint
- Tests: npm run test
- Expo health checks: npx expo-doctor
- Preview build: eas build -p android --profile preview
- Production Android build: npx eas-cli@latest build --platform android --profile production --non-interactive --message "Release 1.1.2"
- Production Android build and submit: npx eas-cli@latest build --platform android --profile production --auto-submit --non-interactive --message "Release 1.1.2"

## Maintenance baseline

1. Project baseline runtime is Expo SDK 54.
2. Dependency security baseline requires npm audit total vulnerabilities to remain at 0.
3. Any dependency update must preserve lint, tests, and expo-doctor passing status.
4. Release 1.1.0 uses Expo app version `1.1.0` and Android `versionCode` `8`.
5. Release 1.1.2 uses Expo app version `1.1.2` and Android `versionCode` `10`.
