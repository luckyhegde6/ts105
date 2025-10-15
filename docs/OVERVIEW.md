# Overview — API Fetcher & Cache

## 🏗 High-Level Design (HLD)

The system is composed of modular components:

**1. ApiFetcher<T>** — Core orchestrator that manages fetch calls, retries, caching, and error handling.
**2. Cache Layer** — Implements `CacheStrategy` interface, defaulting to in-memory TTL cache. Extensible to Redis or browser localStorage.
**3. Error Layer** — Structured, typed error classes representing network, timeout, and parsing failures.
**4. Logging Layer** — Pluggable logger interface for flexible observability.

### project structure

```
api-fetcher-cache/
├─ src/
│  ├─ index.ts                 # entry exports
│  ├─ apiFetcher.ts            # main class or module implementing fetch, cache, retry
│  ├─ cache.ts                 # caching utilities
│  ├─ errors.ts                # custom error classes
│  ├─ logger.ts                # optional logging interface
│  ├─ types.ts                 # shared type definitions
├─ tests/
│  ├─ apiFetcher.spec.ts
│  ├─ cache.spec.ts
│  └─ errorHandling.spec.ts
├─ docs/
│  ├─ README.md
│  ├─ LEARNING.md
│  ├─ OVERVIEW.md  
│  ├─ INTERVIEW_QUESTIONS.md
│  ├─ promises.md
│  ├─ async-await.md
│  ├─ error-handling.md
│  └─ retry-logic.md
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ package.json
├─ tsconfig.json
├─ jest.config.js
└─ .eslintrc.js
```

### Flow Diagram

[ Request ] → [ ApiFetcher.fetchData ] → [ Cache hit? ] ↓ no [ Fetch with retries + timeout ] ↓ success [ Cache set & return result ]

### 🔧 Low-Level Design (LLD)

**Class: ApiFetcher<T>**

- `fetchData<T>()`: Core async method handling cache lookup, retries, backoff, and type-safe response parsing.
- `buildUrl()`: Concatenates base URL and relative path safely.
- Internal state: `retries`, `cacheTTL`, `backoffMs`, `logger`, `cacheStrategy`.
- Uses `AbortController` for timeouts.

**Class: MemoryCache<T>**

- Simple `Map<string, CacheEntry<T>>` with expiry timestamps.
- Auto-deletes stale entries.

**Error Classes:**

- `ApiError` (base), `NetworkError`, `TimeoutError`, `ParseError` — using inheritance + discriminated unions.

**Retry Logic:**

- Exponential backoff: `delay = base * 2^(attempt)`.
- Adds jitter ±50% to avoid thundering herd.

### 🧩 Design Patterns Used

| Pattern | Usage |
|----------|--------|
| **Strategy Pattern** | For pluggable cache mechanisms (`CacheStrategy` interface). |
| **Template Method** | `fetchData` defines the flow, while cache or logging are replaceable hooks. |
| **Decorator Pattern** | (Optional extension) for adding logging/metrics wrappers. |
| **Factory Pattern** | Could be applied to create fetcher instances with pre-defined config sets. |

### 🚀 Extensibility

- Replace `MemoryCache` with RedisCache or BrowserCache by implementing `CacheStrategy`.
- Extend error types to support HTTP-level discriminated responses (e.g., 4xx vs 5xx).
- Add middleware chain to transform responses or handle auth tokens.

### 🧠 Learning Outcome

This design showcases how asynchronous code, error handling, and caching can combine into a clean, reusable architecture. It’s a strong interview-ready example that demonstrates knowledge of **async inference, retries, caching, and SOLID design.**
