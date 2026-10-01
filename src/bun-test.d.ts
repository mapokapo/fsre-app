declare module "bun:test" {
  type Matcher = {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toMatchObject(expected: object): void;
    toBeNull(): void;
    toBeDefined(): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toThrow(): void;
  };

  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function expect(value: unknown): Matcher;
  export const mock: {
    module(path: string, factory: () => Record<string, unknown>): void;
  };
}
