import { ErrorCategory } from "../../enums/global/errorCategory.enum";

interface ErrorType {
  code: {
    codeName: string;
    httpStatusCode: number;
  };
  context: {
    category: ErrorCategory;
    message: string;
    retryable: boolean;
    details?: Record<string, unknown>;
    requestId: string;
  };
}

interface ApiErrorResponse {
  success: false;
  error: ErrorType;
}

export type { ApiErrorResponse, ErrorType };
