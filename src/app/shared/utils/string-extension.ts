export {};

Object.defineProperty(String, 'Empty', {
  value: '',
  writable: false,
  configurable: false,
  enumerable: false,
});

declare global {
  interface StringConstructor {
    Empty: string;
  }

  interface String {
    equals(compareTo: string): boolean;
  }
}

String.prototype.equals = function (compareTo: string): boolean {
  return this.toLowerCase() === compareTo.toLowerCase();
};
