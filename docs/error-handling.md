# Structured Error Handling in Async Code

Handling async errors is crucial to avoid silent failures and retry storms.

## Why structured errors?

Instead of throwing plain `Error`, we define a hierarchy:

- `ApiError` (base)
  - `NetworkError`
  - `TimeoutError`
  - `ParseError`

## Benefits

1. Type-safe handling using `instanceof`.
2. Discriminated union possibilities for exhaustive checks.
3. Clear separation of retryable vs. non-retryable failures.

### Example

```ts
try {
  await fetcher.fetchData('/todos');
} catch (err) {
  if (err instanceof TimeoutError) {
    // handle specifically
  } else if (err instanceof NetworkError) {
    // retry or notify user
  }
}
```

## Error flow in ApiFetcher

- Network failures → retried with backoff.
- Parse failures → abort retries immediately.
- Timeout → retried if configured.
- Unknown → wrapped as NetworkError.

By encoding errors as distinct types, TypeScript enforces safer error logic.

---
