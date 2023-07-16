export abstract class HTTPClientError extends Error {
  public readonly statusCode!: number;
  public readonly name!: string;

  constructor(message: Record<string, unknown> | string) {
    super(JSON.stringify(message));
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HTTP400Error extends HTTPClientError {
  public readonly statusCode = 400;

  constructor(message: string | Record<string, unknown> = "Bad request") {
    super(message);
  }
}

export class HTTP401Error extends HTTPClientError {
  public readonly statusCode = 401;

  constructor(message: string | Record<string, unknown> = "Unauthorized") {
    super(message);
  }
}

export class HTTP403Error extends HTTPClientError {
  public readonly statusCode = 403;

  constructor(message: string | Record<string, unknown> = "Forbidden") {
    super(message);
  }
}

export class HTTP404Error extends HTTPClientError {
  public readonly statusCode = 404;

  constructor(message: string | Record<string, unknown> = "Not found") {
    super(message);
  }
}

export class HTTP406Error extends HTTPClientError {
  public readonly statusCode = 406;

  constructor(message: string | Record<string, unknown> = "Not Acceptable") {
    super(message);
  }
}

export class HTTP409Error extends HTTPClientError {
  public readonly statusCode = 409;

  constructor(message: string | Record<string, unknown> = "Conflict") {
    super(message);
  }
}

export class HTTP412Error extends HTTPClientError {
  public readonly statusCode = 412;

  constructor(
    message: string | Record<string, unknown> = "Precondition Failed",
  ) {
    super(message);
  }
}

export abstract class HTTPServerError extends Error {
  public readonly statusCode!: number;
  public readonly name!: string;

  constructor(message: Record<string, unknown> | string) {
    super(JSON.stringify(message));
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HTTP500Error extends HTTPServerError {
  public readonly statusCode = 500;

  constructor(
    message: string | Record<string, unknown> = "Internal server error",
  ) {
    super(message);
  }
}

export class HTTP502Error extends HTTPServerError {
  public readonly statusCode = 502;

  constructor(message: string | Record<string, unknown> = "Bad Gateway") {
    super(message);
  }
}
