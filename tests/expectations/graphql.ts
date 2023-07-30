// Based on the types in Supertest
interface Response extends NodeJS.ReadableStream {
  accepted: boolean;
  badRequest: boolean;
  body: Record<string, unknown> & {
    error?: string;
    errors?: {
      message: string;
      path: string[];
      extensions?: {
        exception: {
          stacktrace?: string[];
        };
      };
    }[];
  };
  charset: string;
  clientError: boolean;
  error: false | HTTPError;
  files: unknown;
  forbidden: boolean;
  get(header: string): string;
  get(header: "Set-Cookie"): string[];
  header: (key: string) => null | undefined | string;
  headers: Record<string, string>;
  info: boolean;
  links: Record<string, string>;
  noContent: boolean;
  notAcceptable: boolean;
  notFound: boolean;
  ok: boolean;
  redirect: boolean;
  serverError: boolean;
  status: number;
  statusCode: number;
  statusType: number;
  text: string;
  type: string;
  unauthorized: boolean;
  xhr: unknown;
  redirects: string[];
}

interface HTTPError extends Error {
  status: number;
  text: string;
  method: string;
  path: string;
}

export const expectGraphQLSuccessResponse = (response: Response): void => {
  if (response.body.error) {
    throw new Error(response.body.error);
  }

  const firstError = response.body.errors?.at(0);
  if (firstError) {
    const message = [
      ...(firstError.path || []),
      firstError.extensions?.exception?.stacktrace?.join("\r\n") ??
        firstError.message,
    ]
      .filter(Boolean)
      .join(" - ");
    throw new Error(message);
  }

  expect(response.status).toBe(200);
};
