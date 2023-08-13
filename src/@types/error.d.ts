interface Error {
  cause?: unknown;
}

interface ErrorConstructor {
  new (message?: string, options?: { cause: unknown }): Error;
  (message?: string, options?: { cause: unknown }): Error;
}
