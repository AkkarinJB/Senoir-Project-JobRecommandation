import { signal } from '@angular/core';
import { extractErrorMessage } from '../../core/utils/http-error.util';

export abstract class FormPageBase {
  isLoading = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  protected clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  protected setError(err: unknown, fallback: string): void {
    this.errorMessage.set(extractErrorMessage(err, fallback));
    this.successMessage.set(null);
  }

  protected setSuccess(message: string): void {
    this.successMessage.set(message);
    this.errorMessage.set(null);
  }
}
