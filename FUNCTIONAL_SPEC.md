# Functional Specification

## User capabilities

1. Users can create a counter with name, numeric value, text color, and background color.
2. Users can update any existing counter.
3. Users can delete a counter.
4. Users can increment and decrement from the home list.
5. Users can open a counter and see history plus trend chart.
6. Users can switch theme and the choice is persisted.

## Validation and input rules

1. Name is normalized and cannot be empty after trim.
2. Value must be a valid integer.
3. Invalid input shows explicit feedback and blocks persistence.

## Persistence behavior

1. Every value change is stored as a daily historical data point.
2. Insert counter and first history point are atomic.
3. Counter update and optional history update are atomic.
4. Increment/decrement update and history write are atomic.
5. Deleting a counter cascades to historical values.

## UI state behavior

1. Home screen shows all counters and supports direct value changes.
2. Detail screen supports empty history state without crash.
3. Form supports create and edit flows with the same component.

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

## Maintenance baseline

1. Project baseline runtime is Expo SDK 54.
2. Dependency security baseline requires npm audit total vulnerabilities to remain at 0.
3. Any dependency update must preserve lint, tests, and expo-doctor passing status.
