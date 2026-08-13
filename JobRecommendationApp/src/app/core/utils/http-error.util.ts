import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof HttpErrorResponse && typeof err.error === 'string') {
    return err.error;
  }
  return fallback;
}
