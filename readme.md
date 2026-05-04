# Counters

Current release target: 1.1.2

## Documentation

- Architecture: ARCHITECTURE.md
- Functional specification: FUNCTIONAL_SPEC.md

This project intentionally keeps exactly three top-level documentation files:

- README.md
- ARCHITECTURE.md
- FUNCTIONAL_SPEC.md

## Local development

- Start app: `npm run start`
- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Quality checks

- Lint: `npm run lint`
- Unit tests: `npm run test`
- Expo health checks: `npx expo-doctor`

## Build

- Preview build: `eas build -p android --profile preview`
- Production Android bundle: `npx eas-cli@latest build --platform android --profile production --non-interactive --message "Release 1.1.2 - Patch update"`
- Local: `npx expo prebuild --platform android --clean`
`npx expo run:android`


## Release readiness

- Version metadata:
	- `package.json`: `1.1.2`
	- `app.json` Expo version: `1.1.2`
	- `app.json` Android `versionCode`: `10`
- Local validation before release:
	- `npm run lint`
	- `npm run test`
	- `npx expo-doctor`
- Play Store submission:
	- Build and auto-submit: `npx eas-cli@latest build --platform android --profile production --auto-submit --non-interactive --message "Release 1.1.2 - Patch update"`
	- Manual submit if needed: `npx eas-cli@latest submit --platform android --profile production`
- Deobfuscation support:
	- Production builds keep `android/app/build/outputs/mapping/release/mapping.txt` as an EAS build artifact for Play Console crash/ANR deobfuscation uploads.
- Current EAS submit profile targets the Play internal track first.

## Release notes 1.1.2

- Added counter reset: reset a single counter to 0 from the edit form (icon in top-right corner) without losing its history.
- Added reset all: reset all counters to 0 at once from the side menu without losing history.
- Added undo reset: recover counter values after a same-day reset from the topbar menu.
- Added home navigation: tap the app title or the Home menu item to return to the home screen from any screen.
- Replaced topbar dropdown menu with a slide-in side menu drawer containing all app settings.
- Added tap sound and vibration feedback on counter +/- buttons, with adjustable volume and strength from the side menu.
- Added UI scale (accessibility): choose counter card and text size across five steps (xs–xl) from the side menu.
- Fixed status bar text color adapting to light and dark theme across all screens.
- Fixed app loading in Expo Go after expo-notifications compatibility changes for SDK 53+.

## Release notes 1.1.1

- Patch update: Internal improvements, documentation, and version bump for Expo deployment readiness.

## Recent updates

- Added slide-in side menu drawer replacing the topbar dropdown, with all app settings in one place.
- Added tap sound and vibration feedback with per-counter configurable volume and strength.
- Added UI scale accessibility setting (xs–xl) persisted across sessions.
- Added counter reset (single and all) with history preservation and same-day undo.
- Added home navigation shortcut via app title tap and topbar menu item.
- Fixed status bar theme adaptation and Expo Go startup compatibility.
- Migrated project to Expo SDK 54 with dependency alignment.
- Applied dependency security remediation and verified zero npm audit vulnerabilities.
- Added English and Spanish UI localization based on device language.
- Added annual reporting with clipboard copy and PDF export support.
- Added realistic development-only preview counters for store screenshots; production purges any preview seed data.
- Added topbar quick actions for report, language, layout, and theme.
- Added archived counter recovery, improved toast feedback, and persisted list/grid layout.
- Added drag-and-drop counter reordering with persisted display order.
- Refined annual report UX with collapsible years, scroll-safe modal behavior, and loading skeleton feedback.