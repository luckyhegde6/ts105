# Design Patterns — ts105: API Fetcher & Cache

*Note: ts105 already has `docs/design-patterns.md`. This file provides the complete cross-project reference.*

## Patterns Used

### 1. Strategy Pattern

```typescript
interface CacheStrategy<T> {
  get(key: string): Awaitable<CacheEntry<T> | undefined>;
  set(key: string, entry: CacheEntry<T>): Awaitable<void>;
  del?(key: string): Awaitable<void>;
}
```

Swap `MemoryCache` for Redis, localStorage, or any backend without changing `ApiFetcher`.

### 2. Template Method Pattern

`fetchData<T>()` defines the algorithm skeleton:
1. Build URL
2. Check cache
3. Retry loop with backoff
4. Parse response
5. Store in cache
6. Return result

The caching and retry strategies are pluggable.

### 3. Error Hierarchy Pattern

```
ApiError (base, has `cause`)
├── NetworkError    (retryable)
├── TimeoutError    (retryable)
└── ParseError      (non-retryable)
```

Enables `instanceof`-based error handling with clear retry/no-retry semantics.

### 4. Exponential Backoff + Jitter

```typescript
const delay = Math.min(maxBackoffMs, backoffMs * Math.pow(2, attempt));
return withJitter ? delay * (0.5 + Math.random()) : delay;
```

### 5. AbortController Pattern

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
return fetch(url, { signal: controller.signal });
```

### 6. Dependency Injection

Logger interface injected via `ApiFetcherConfig` — similar to ts104's pattern.

## Evolution Path

- CacheStrategy → Redis adapter for distributed caching (production)
- Error hierarchy → Used in ts107's `ApiError` for HTTP error handling
- Retry logic → Backend resilience patterns (ts107 middleware)
- Fetch abstraction → apiClient in ts108 (React)
