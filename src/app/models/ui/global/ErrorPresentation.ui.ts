import { ErrorRecovery } from "../../../enums/global/errorRecovery.enum";
import { ErrorSurface } from "../../../enums/global/errorSurface.enum";
import { ErrorType } from "../../api/ApiError.api";

interface AppError {
     apiError: ErrorType;
     surface: ErrorSurface;
     recovery: ErrorRecovery;
     title: string;
     message: string;
     retryable: boolean;
     requestId?: string;
     originalError?: unknown;
}

export type { AppError };