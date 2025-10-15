# Async/Await Deep Dive

`async`/`await` is syntactic sugar over Promises — it lets us write asynchronous code that *looks* synchronous.

### The basics
```ts
async function getData() {
  const res = await fetch('https://example.com');
  return res.json();
}
```

The function automatically returns a Promise<ReturnType>:
```
type Result = Awaited<ReturnType<typeof getData>>; // the actual resolved type
```
### Error handling
```ts
try {
  const data = await getData();
} catch (err) {
  console.error('Something went wrong', err);
}
```

### Type inference

TypeScript infers that await unwraps a Promise.
So if you await Promise<number>, the result is inferred as number.

### In this project

The ApiFetcher.fetchData<T> method uses async/await extensively:

- Awaits fetch calls.
- Awaits cache reads/writes.
- Uses try/catch for typed errors.

This showcases how TypeScript safely unwraps and infers the type at each async boundary.

