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

📚 Learning path

Check [docs/LEARNING.md](docs/LEARNING.md) and [docs/OVERVIEW.md](docs/OVERVIEW.md) for comprehensive learning resources.

### Interview Questions — Async & Caching

1. What are Promises and how do they work in JavaScript?
2. Explain the difference between `async/await` and traditional promise chaining.
3. How can you implement retry logic in an API call?
4. What is exponential backoff and why is it useful in network requests?
5. Describe a caching strategy you could use for API responses.
6. How do you handle errors in asynchronous code?
7. What are some common pitfalls when working with async code?

For more questions, see [docs/INTERVIEW_QUESTIONS.md](docs/INTERVIEW_QUESTIONS.md).

Jest coverage reports are viewable publicly at

https://luckyhegde6.github.io/ts105/coverage/.
