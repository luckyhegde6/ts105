# Understanding Promises in TypeScript

A **Promise** represents a value that will be available in the future.  
Its type is written as `Promise<T>`, meaning “a future value of type `T`”.

## Key properties

- A promise can be *pending*, *fulfilled*, or *rejected*.
- You attach reactions using `.then()` and `.catch()`.

### Example

```ts
function fetchNumber(): Promise<number> {
  return new Promise((resolve) => setTimeout(() => resolve(42), 1000));
}

fetchNumber().then((value) => console.log(value)); // 42
```

### Chaining

```ts
fetchNumber()
  .then((n) => n * 2)
  .then((result) => console.log(result)); // 84
```

When chaining, each .then() automatically wraps its return value in a Promise, maintaining the type flow.

### Typing

TypeScript can infer promise types:

```ts
const promise = Promise.resolve('hello');
type P = Awaited<typeof promise>; // string0
```

### Common pitfalls

- Returning a bare value inside .then() still returns a Promise.

- Mixing callbacks and promises often leads to nested errors.

- Use Promise.all and Promise.race for parallel async operations.

### In this project

Promises underpin the retry logic and caching pipeline. Each retry step awaits the previous Promise resolution before reattempting, ensuring strict sequential control.

---
