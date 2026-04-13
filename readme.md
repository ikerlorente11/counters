# Counters

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

## Recent updates

- Migrated project to Expo SDK 54 with dependency alignment.
- Applied dependency security remediation and verified zero npm audit vulnerabilities.
- Added English and Spanish UI localization based on device language.
- Added annual reporting with clipboard copy and PDF export support.