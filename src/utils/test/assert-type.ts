export function assertType<TActual, TExpected>(
  _value: TActual extends TExpected ? true : false
): void {}

export function expectToCompile() {
  expect(true).toBe(true);
}
