import { pipe } from "./pipe";
import { asyncPipe } from "./pipe-async";
import { assertType } from "./utils/test/assert-type";

// Test helper functions
function getInitialValue(): string {
  return "5";
}

function parseToNumber(str: string): number {
  return parseInt(str, 10);
}

function multiplyByTwo(num: number): number {
  return num * 2;
}

function toString(num: number): string {
  return num.toString();
}

function addPrefix(str: string): string {
  return `Result: ${str}`;
}

async function asyncMultiplyByThree(num: number): Promise<number> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1));
  return num * 3;
}

async function asyncAddSuffix(str: string): Promise<string> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1));
  return `${str} (async)`;
}

function toUpperCase(str: string): string {
  return str.toUpperCase();
}

describe("Pipe Functions", () => {
  describe("pipe (synchronous)", () => {
    test("should handle simple synchronous pipe with multiple transformations", () => {
      const result = pipe(
        getInitialValue(),
        parseToNumber,
        multiplyByTwo,
        toString,
        addPrefix
      );
      expect(result).toBe("Result: 10");
    });

    test("should handle single step pipe", () => {
      const result = pipe(getInitialValue(), parseToNumber);
      expect(result).toBe(5);
    });

    test("should handle no transformation pipe (identity)", () => {
      const result = pipe(getInitialValue());
      expect(result).toBe("5");
    });

    test("should handle number transformations", () => {
      const result = pipe(
        10,
        (x: number) => x * 2,
        (x: number) => x + 5,
        (x: number) => x.toString()
      );
      expect(result).toBe("25");
    });

    test("should handle string transformations", () => {
      const result = pipe(
        "hello",
        (str: string) => str.toUpperCase(),
        (str: string) => `${str} WORLD`,
        (str: string) => str.toLowerCase()
      );
      expect(result).toBe("hello world");
    });
  });

  describe("asyncPipe (asynchronous)", () => {
    test("should handle simple async pipe", async () => {
      const result = await asyncPipe(
        getInitialValue(),
        parseToNumber,
        asyncMultiplyByThree,
        toString,
        addPrefix
      );
      expect(result).toBe("Result: 15");
    });

    test("should handle mixed sync/async pipe", async () => {
      const result = await asyncPipe(
        getInitialValue(),
        parseToNumber,
        multiplyByTwo,
        asyncMultiplyByThree,
        toString,
        asyncAddSuffix,
        toUpperCase
      );
      expect(result).toBe("30 (ASYNC)");
    });

    test("should handle all async operations", async () => {
      const result = await asyncPipe(
        "hello",
        async (str) => `${str} world`,
        asyncAddSuffix,
        async (str) => str.toUpperCase()
      );
      expect(result).toBe("HELLO WORLD (ASYNC)");
    });

    test("should handle asyncPipe with just sync functions", async () => {
      const result = await asyncPipe(
        getInitialValue(),
        parseToNumber,
        multiplyByTwo,
        toString
      );
      expect(result).toBe("10");
    });

    test("should handle complex data transformations", async () => {
      const initialData = { name: "John", age: 25 };
      const result = await asyncPipe(
        initialData,
        (data) => ({ ...data, age: data.age + 1 }),
        async (data) => ({ ...data, name: data.name.toUpperCase() }),
        (data) => `${data.name} is ${data.age} years old`,
        asyncAddSuffix
      );
      expect(result).toBe("JOHN is 26 years old (async)");
    });

    test("should handle array transformations", async () => {
      const numbers = [1, 2, 3];
      const result = await asyncPipe(
        numbers,
        (arr) => arr.map((x) => x * 2),
        async (arr) => arr.filter((x) => x > 5),
        (arr) => arr.reduce((sum, x) => sum + x, 0),
        toString
      );
      expect(result).toBe("6");
    });

    test("should handle single async operation", async () => {
      const result = await asyncPipe(5, asyncMultiplyByThree);
      expect(result).toBe(15);
    });

    test("should handle identity async pipe", async () => {
      const result = await asyncPipe("test");
      expect(result).toBe("test");
    });
  });

  describe("Type Safety", () => {
    test("should compile with correct types", () => {
      // Test that pipe maintains type safety
      const numResult: number = pipe(5, (x: number) => x * 2);
      expect(numResult).toBe(10);

      const strResult: string = pipe("hello", (s: string) => s.toUpperCase());
      expect(strResult).toBe("HELLO");
    });

    test("should infer types properly in the piped functions", () => {
      const result = pipe(
        getInitialValue(),
        parseToNumber,
        multiplyByTwo,
        (input) => {
          assertType<typeof input, number>(true);
          return input;
        },
        toString,
        (input) => {
          assertType<typeof input, string>(true);
          return input;
        }
      );
      expect(result).toBe("10");
    });

    test("should compile async pipe with correct types", async () => {
      // Test that asyncPipe maintains type safety
      const numResult: number = await asyncPipe(5, async (x: number) => x * 2);
      expect(numResult).toBe(10);

      const strResult: string = await asyncPipe("hello", async (s: string) =>
        s.toUpperCase()
      );
      expect(strResult).toBe("HELLO");
    });

    test("should infer types properly in the async piped functions", async () => {
      const result = await asyncPipe(
        getInitialValue(),
        parseToNumber,
        asyncMultiplyByThree,
        (input) => {
          assertType<typeof input, number>(true);
          return input;
        },
        toString,
        async (input) => {
          assertType<typeof input, string>(true);
          return input;
        },
        asyncAddSuffix
      );
      expect(result).toBe("15 (async)");
    });
  });
});
