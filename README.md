# @j2blasco/ts-pipe

A TypeScript utility library providing strongly-typed function composition through pipe operations. Chain together synchronous and asynchronous functions with full type safety.

## Features

- 🔗 **Function Composition**: Chain multiple functions together in a readable, left-to-right manner
- 🔄 **Sync & Async Support**: Handle both synchronous and asynchronous operations seamlessly  
- 🛡️ **Type Safety**: Full TypeScript support with proper type inference across the chain
- 📦 **Zero Dependencies**: Lightweight with no external dependencies
- ⚡ **Performance**: Optimized implementations for up to 10 function arguments with fallback for more

## Installation

```bash
npm install @j2blasco/ts-pipe
```

## Usage

### Synchronous Pipe

The `pipe` function allows you to chain synchronous functions together:

```typescript
import { pipe } from '@j2blasco/ts-pipe';

// Basic example
const result = pipe(
  "5",
  (str) => parseInt(str, 10),  // string → number
  (num) => num * 2,            // number → number  
  (num) => num.toString(),     // number → string
  (str) => `Result: ${str}`    // string → string
);
console.log(result); // "Result: 10"

// Object transformations
const user = pipe(
  { name: "john", age: 25 },
  (user) => ({ ...user, name: user.name.toUpperCase() }),
  (user) => ({ ...user, age: user.age + 1 }),
  (user) => `${user.name} is ${user.age} years old`
);
console.log(user); // "JOHN is 26 years old"
```

### Asynchronous Pipe

The `asyncPipe` function handles both synchronous and asynchronous functions, always returning a Promise:

```typescript
import { asyncPipe } from '@j2blasco/ts-pipe';

// Mixed sync/async operations
const result = await asyncPipe(
  "https://api.example.com/data",
  async (url) => fetch(url),           // async
  (response) => response.json(),       // sync (returns Promise)
  async (data) => processData(data),   // async
  (processed) => processed.result      // sync
);

// All async operations
const transformed = await asyncPipe(
  "hello",
  async (str) => `${str} world`,
  async (str) => str.toUpperCase(),
  async (str) => `${str}!`
);
console.log(transformed); // "HELLO WORLD!"
```

### Array Processing

```typescript
import { pipe, asyncPipe } from '@j2blasco/ts-pipe';

// Synchronous array processing
const numbers = pipe(
  [1, 2, 3, 4, 5],
  (arr) => arr.filter(x => x % 2 === 0),    // [2, 4]
  (arr) => arr.map(x => x * 2),             // [4, 8]
  (arr) => arr.reduce((sum, x) => sum + x, 0) // 12
);

// Asynchronous array processing
const processedData = await asyncPipe(
  [1, 2, 3],
  (arr) => arr.map(x => x * 2),
  async (arr) => Promise.all(arr.map(async x => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 10));
    return x + 1;
  })),
  (arr) => arr.join(', ')
);
```

### Type Safety

The library maintains full type safety throughout the chain:

```typescript
import { pipe } from '@j2blasco/ts-pipe';

// TypeScript will infer types at each step
const result = pipe(
  5,                           // number
  (x) => x.toString(),        // number → string
  (s) => s.toUpperCase(),     // string → string
  (s) => s.length             // string → number
); // result is inferred as number

// Compilation error if types don't match
const invalid = pipe(
  5,
  (x) => x.toString(),
  (s) => s.toUpperCase(),
  (s) => s * 2  // ❌ Error: can't multiply string by number
);
```

## API Reference

### `pipe(value, ...functions)`

Composes synchronous functions from left to right.

**Parameters:**
- `value`: Initial value to pass through the pipe
- `...functions`: Up to 10 transformation functions (more supported via fallback)

**Returns:** The final transformed value

### `asyncPipe(value, ...functions)`

Composes functions that may be synchronous or asynchronous.

**Parameters:**
- `value`: Initial value to pass through the pipe
- `...functions`: Up to 10 transformation functions that can return values or Promises

**Returns:** `Promise<T>` where T is the type of the final transformed value

## Advanced Examples

### Error Handling

```typescript
import { asyncPipe } from '@j2blasco/ts-pipe';

try {
  const result = await asyncPipe(
    "invalid-url",
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      return response;
    },
    (response) => response.json(),
    (data) => data.result
  );
} catch (error) {
  console.error('Pipeline failed:', error);
}
```

### Conditional Processing

```typescript
import { pipe } from '@j2blasco/ts-pipe';

const processUser = (includeEmail: boolean) => pipe(
  { name: 'John', age: 25, email: 'john@example.com' },
  (user) => ({ ...user, name: user.name.toUpperCase() }),
  (user) => includeEmail ? user : { name: user.name, age: user.age },
  (user) => JSON.stringify(user)
);
```
## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
