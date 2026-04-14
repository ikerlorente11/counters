# Counters

Current release target: 1.1.0

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
- Production Android bundle: `npx eas-cli@latest build --platform android --profile production --non-interactive --message "Release 1.1.0 - Reports, archive recovery, layout toggle, reorder and Play Store polish"`

## Release readiness

- Version metadata:
	- `package.json`: `1.1.0`
	- `app.json` Expo version: `1.1.0`
	- `app.json` Android `versionCode`: `8`
- Local validation before release:
	- `npm run lint`
	- `npm run test`
	- `npx expo-doctor`
- Play Store submission:
	- Build and auto-submit: `npx eas-cli@latest build --platform android --profile production --auto-submit --non-interactive --message "Release 1.1.0 - Reports, archive recovery, layout toggle, reorder and Play Store polish"`
	- Manual submit if needed: `npx eas-cli@latest submit --platform android --profile production`
- Deobfuscation support:
	- Production builds keep `android/app/build/outputs/mapping/release/mapping.txt` as an EAS build artifact for Play Console crash/ANR deobfuscation uploads.
- Current EAS submit profile targets the Play internal track first.

## Release notes 1.1.0

Suggested Play Store patch notes:

- Added annual report view with copy and PDF export.
- Added archived counter recovery flow.
- Added list and grid layout toggle with saved preference.
- Added drag-and-drop counter reordering.
- Improved topbar quick actions, language selection, and theme switching.
- Polished report modal scrolling, collapsed year sections, and loading feedback.
- Improved development preview data for store screenshots while keeping production clean.

## Recent updates

- Migrated project to Expo SDK 54 with dependency alignment.
- Applied dependency security remediation and verified zero npm audit vulnerabilities.
- Added English and Spanish UI localization based on device language.
- Added annual reporting with clipboard copy and PDF export support.
- Added realistic development-only preview counters for store screenshots; production purges any preview seed data.
- Added topbar quick actions for report, language, layout, and theme.
- Added archived counter recovery, improved toast feedback, and persisted list/grid layout.
- Added drag-and-drop counter reordering with persisted display order.
- Refined annual report UX with collapsible years, scroll-safe modal behavior, and loading skeleton feedback.