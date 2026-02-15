# Testing Requirements

## Minimum Test Coverage: 80%

Test Types (all required):

1. **Unit Tests** - Individual functions, utilities, components
2. **Integration Tests** - API endpoints, database operations
3. **E2E Tests** - Critical user flows (Playwright)

## Test-Driven Development (TDD)

Mandatory workflow:

1. Write tests first (RED)
2. Run tests - Confirm failure
3. Write minimal implementation (GREEN)
4. Run tests - Confirm pass
5. Refactor (IMPROVE)
6. Check coverage (80% or higher)

## Troubleshooting Test Failures

1. Use the **tdd-guide** agent
2. Verify test isolation
3. Validate that mocks are correct
4. Fix the implementation, not the test (unless the test itself is incorrect)

## Agent Support

- **tdd-guide** - Use proactively for new features to ensure a test-first approach
- **e2e-runner** - Specialist for Playwright E2E tests
