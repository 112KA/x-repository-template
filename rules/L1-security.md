# Security Guidelines

## Required Security Checks

Always verify the following before committing:

* [ ] No hardcoded secrets (API keys, passwords, tokens)
* [ ] All user inputs are validated
* [ ] SQL injection prevention (parameterized queries)
* [ ] XSS prevention (sanitized HTML)
* [ ] CSRF protection is enabled
* [ ] Authentication/Authorization is verified
* [ ] Rate limiting is set for all endpoints
* [ ] No sensitive data leaked from error messages

## Secret Management

```typescript
// BAD: Hardcoded secret
const apiKey = "sk-proj-xxxxx"

// GOOD: Environment variable
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}


```

## Security Response Protocol

If a security issue is discovered:

1. Stop immediately
2. Use the **security-reviewer** agent
3. Fix "CRITICAL" issues before proceeding
4. Rotate (update) all exposed secrets
5. Review the entire codebase for similar issues