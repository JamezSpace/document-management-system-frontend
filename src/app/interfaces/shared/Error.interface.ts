interface ErrorType {
  code: { codeName: string; httpStatusCode: number };
  context: {
    category: string;
    message: string;
    table?: string | null;
    column?: string | null;
  };
}

export type { ErrorType };
