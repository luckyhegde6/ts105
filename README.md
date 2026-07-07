# API Fetcher & Cache — TypeScript Learning Project

[![Coverage](coverage/badge.svg)](https://luckyhegde6.github.io/ts105/coverage/)
![Build](./build-badge.svg)

A fully-typed, asynchronous data-fetching and caching library demonstrating Promises, async/await, retry logic with exponential backoff + jitter, structured error handling, and strong TypeScript inference.

## 🧩 Goals

- Understand Promises, async/await, and how TypeScript infers async return types.
- Learn how to design robust retry + caching mechanisms.
- Showcase typed error classes and discriminated unions.
- Build a clean CI-ready TypeScript library with test coverage.

### ⚙️ Installation

```bash
npm install
npm run build
npm run test
```

### 🧠 Example usage

```typescript
import { ApiFetcher, NetworkError } from 'api-fetcher-cache';


interface Todo { id: number; title: string; completed: boolean; }


const fetcher = new ApiFetcher<Todo[]>({
baseURL: 'https://jsonplaceholder.typicode.com',
cacheTTL: 60_000,
retries: 3,
});


(async () => {
try {
const todos = await fetcher.fetchData('/todos');
console.log('Fetched', todos.length, 'todos');
} catch (err) {
if (err instanceof NetworkError) console.error('Network issue:', err.message);
}
})();
```

### 🧪 Scripts

- npm run build — Type-check project.

- npm run test — Run Jest tests.

- npm run lint — Lint all files.

- npm run coverage — Generate coverage report.

### 🧰 Features

- Caching: In-memory TTL cache, pluggable cache strategy.

- Retries: Exponential backoff with jitter.

- Timeouts: AbortController-based.

- Typed Errors: NetworkError, TimeoutError, ParseError.

- Logging: Console logger with optional injection.

- CI: GitHub Actions workflow included.

## 📚 Documentation

- [LEARNING.md](docs/LEARNING.md) — Async TypeScript learning notes
- [OVERVIEW.md](docs/OVERVIEW.md) — HLD & LLD overview
- [promises.md](docs/promises.md) — Promises deep dive
- [async-await.md](docs/async-await.md) — Async/await best practices
- [error-handling.md](docs/error-handling.md) — Structured error patterns
- [retry-logic.md](docs/retry-logic.md) — Exponential backoff design
- [INTERVIEW_QUESTIONS.md](docs/INTERVIEW_QUESTIONS.md) — Interview prep
- [design-patterns.md](docs/design-patterns.md) — Design patterns in depth
- [NEETCODE.md](docs/NEETCODE.md) — Sequence diagram, edge cases, complexity, patterns

Jest coverage reports are viewable publicly at https://luckyhegde6.github.io/ts105/coverage/.
