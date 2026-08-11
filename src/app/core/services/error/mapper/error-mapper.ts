import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorSurface } from '../../../../enums/global/errorSurface.enum';
import { AppError } from '../../../../models/ui/global/ErrorPresentation.ui';
import { ApiErrorResponse, ErrorType } from '../../../../models/api/ApiError.api';
import { ErrorRecovery } from '../../../../enums/global/errorRecovery.enum';
import { ErrorCategory } from '../../../../enums/global/errorCategory.enum';

@Injectable({
  providedIn: 'root',
})
export class ErrorMapperService {
  map(
    error: HttpErrorResponse,
    preferredSurface: ErrorSurface = ErrorSurface.TOAST,
  ): AppError {
    const apiError = this.extractApiError(error);

    return {
      apiError,
      surface: preferredSurface,
      recovery: this.resolveRecovery(apiError),
      title: this.resolveTitle(apiError),
      message: apiError.context.message,
      retryable: apiError.context.retryable,
      requestId: apiError.context.requestId,
      originalError: error,
    };
  }

  private extractApiError(error: HttpErrorResponse): ErrorType {
    // Network, connection and timeout failures normally have status 0.
    if (error.status === 0) {
      return {
        code: {
          codeName: 'network_unavailable',
          httpStatusCode: 0,
        },
        context: {
          category: ErrorCategory.INFRASTRUCTURE,
          message:
            'Unable to connect to the server. Check your connection and try again.',
          retryable: true,
          requestId: '',
        },
      };
    }

    const body = error.error as Partial<ApiErrorResponse> | null;

    if (this.isErrorType(body?.error)) {
      return body.error;
    }

    // Handles proxy errors, malformed responses and unnormalized server failures.
    return {
      code: {
        codeName: 'unexpected_http_error',
        httpStatusCode: error.status || 500,
      },
      context: {
        category: ErrorCategory.SERVER,
        message: 'The request could not be completed.',
        retryable: error.status >= 500,
        requestId: '',
      },
    };
  }

  private isErrorType(value: unknown): value is ErrorType {
    if (!value || typeof value !== 'object') return false;

    const candidate = value as ErrorType;

    return (
      typeof candidate.code?.codeName === 'string' &&
      typeof candidate.code?.httpStatusCode === 'number' &&
      typeof candidate.context?.category === 'string' &&
      typeof candidate.context?.message === 'string' &&
      typeof candidate.context?.retryable === 'boolean'
    );
  }

  private resolveTitle(error: ErrorType): string {
    switch (error.context.category) {
      case ErrorCategory.AUTHENTICATION:
        return 'Your session has ended';

      case ErrorCategory.AUTHORIZATION:
        return 'Access denied';

      case ErrorCategory.NOT_FOUND:
        return 'Resource not found';

      case ErrorCategory.VALIDATION:
        return 'Check the information provided';

      case ErrorCategory.CONFLICT:
        return 'Your request conflicts with recent changes';

      case ErrorCategory.POLICY:
        return 'Action restricted by policy';

      case ErrorCategory.WORKFLOW:
        return 'Workflow action unavailable';

      case ErrorCategory.INFRASTRUCTURE:
        return 'Connection problem';

      default:
        return 'Unable to complete request';
    }
  }

  private resolveRecovery(error: ErrorType): ErrorRecovery {
    switch (error.context.category) {
      case ErrorCategory.AUTHENTICATION:
        return ErrorRecovery.SIGN_IN;

      case ErrorCategory.AUTHORIZATION:
        return ErrorRecovery.REQUEST_ACCESS;

      case ErrorCategory.NOT_FOUND:
        return ErrorRecovery.GO_BACK;

      default:
        return error.context.retryable ? ErrorRecovery.RETRY : ErrorRecovery.NONE;
    }
  }
}
