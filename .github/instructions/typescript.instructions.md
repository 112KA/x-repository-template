---
description: 'Guidelines for TypeScript Development targeting TypeScript 5.x and ES2020 output'
applyTo: '**/*.ts'
---

# TypeScript Coding Standards
This file defines our TypeScript coding conventions for Copilot code review.

## Naming Conventions

- Use `camelCase` for variables and functions.
- Use `PascalCase` for class and interface names.
- Prefix private variables with `_`.

## Code Style

- Prefer `const` over `let` when variables are not reassigned.
- Use arrow functions for anonymous callbacks.
- Avoid using `any` type; specify more precise types whenever possible.
- Limit line length to 100 characters.

## Error Handling

- Always handle promise rejections with `try/catch` or `.catch()`.
- Use custom error classes for application-specific errors.

## Testing

- Write unit tests for all exported functions.
- Use [Vitest](https://vitest.dev/) for all testing.
- Name test files as `<filename>.test.ts`.

## Example

```typescript
// Good
interface User {
  id: number;
  name: string;
}

const fetchUser = async (id: number): Promise<User> => {
  try {
    // ...fetch logic
  } catch (error) {
    // handle error
  }
};

// Bad
interface user {
  Id: number;
  Name: string;
}

async function FetchUser(Id) {
  // ...fetch logic, no error handling
}