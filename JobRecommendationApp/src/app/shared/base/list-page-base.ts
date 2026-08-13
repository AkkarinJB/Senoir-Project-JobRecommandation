import { signal } from '@angular/core';
import { extractErrorMessage } from '../../core/utils/http-error.util';

export abstract class ListPageBase {
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  protected setError(err: unknown, fallback: string): void {
    this.errorMessage.set(extractErrorMessage(err, fallback));
    this.isLoading.set(false);
  }
}
