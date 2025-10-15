# Interview Questions — Async & Caching


### Core Async Concepts
1. Explain how async/await works under the hood in JavaScript and TypeScript.
2. What is `Promise<T>` and `Awaited<T>`? When do you use each?
3. What happens if you forget to `await` a Promise? How does TypeScript help catch this?
4. How do you propagate and handle async errors? Why is `try/catch` not always sufficient?


### Error Handling & Retries
1. What is exponential backoff and why is jitter important?
2. In what scenarios would you avoid retrying failed requests?
3. How would you differentiate between retryable vs non-retryable errors?


### Caching & Design Patterns
1. Explain TTL (time-to-live) and its role in cache invalidation.
2. How would you design a distributed cache? What consistency issues arise?
3. What design pattern does the cache layer represent? (Hint: Strategy Pattern.)


### System Design Scenarios
1. How would you extend this library to support Redis or localStorage caching?
2. How can we implement circuit breaker logic around failing endpoints?
3. How would you instrument logging and monitoring for retries and timeouts?


### TypeScript-Specific
1. Why are generics critical in API clients?
2. What’s the difference between `unknown`, `any`, and `never` in async code?
3. How can TypeScript’s `discriminated unions` help in structured error handling?