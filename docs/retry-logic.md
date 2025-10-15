# Retry Logic & Exponential Backoff

Network requests fail. Retrying intelligently improves resilience but prevents overloading services.

## Exponential Backoff

Each retry waits longer than the last:

delay = baseDelay * (2 ** attempt)

For example, with base = 100ms:

1st retry → 100ms
2nd retry → 200ms
3rd retry → 400ms

### Jitter

A random variation added to delay:

delay ± (delay *0.5* random(-1,1))

This prevents synchronized retries (the “thundering herd” problem).

### Implementation in ApiFetcher

1. On failure → increment attempt counter.
2. Compute backoff = min(maxBackoff, base * 2^(attempt)).
3. Apply jitter if enabled.
4. `await sleep(backoff)` before retrying.

### When *not* to retry

- Non-retryable HTTP codes (4xx).
- Parse or validation errors.
- Auth errors.

### Interview Tip

Be ready to explain why exponential backoff improves system stability and why fixed intervals are risky under high load.
