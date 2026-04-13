---
description: "Use when enforcing code style, naming conventions, and code quality rules."
---
# Engineering Rules

## Code Style

- All code, comments, and documentation must be written in English.
- Keep code clean and readable: meaningful names, no abbreviations, no magic numbers.
- For components/classes/modules, keep a consistent internal order:
  1. Imports
  2. Constants/config
  3. Types/interfaces (if applicable)
  4. Main component/class/function
  5. External helper functions
  6. Styles
- Public, reusable, or non-trivial functions/components/classes require JSDoc.
- Complex logic may include short comments explaining why.
- Keep single responsibility per function/component.
- Use const by default; use let only when needed; never use var.
- Break down oversized functions when readability drops.
- No dead code, commented-out blocks, or unused imports in committed files.

## Naming

- Variables/functions: camelCase.
- Components/classes: PascalCase.
- Global constants: UPPER_SNAKE_CASE.
- Filenames: PascalCase for components, camelCase for utilities/screens.
- Booleans: is/has/can/should prefix.
- Event handlers: handle* for functions, on* for props.

## What to Avoid

- Large unrelated batches of changes.
- Over-engineering and unnecessary abstractions.
- Clever but cryptic code.
- Deep nesting instead of extracted functions.
- Premature optimization without evidence.
- Mixing business logic and presentation concerns.
