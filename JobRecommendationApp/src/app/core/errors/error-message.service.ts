import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ERROR_MESSAGES } from "./error-message";

@Injectable({
    providedIn: 'root', 
})
export class ErrorMessageService {

    getMessage(error: unknown, fallback?:string): string {
        if(!(error instanceof HttpErrorResponse)) {
            return fallback ?? ERROR_MESSAGES.GENERAL.UNKNOWN;
        }

        const body = error.error as { code?: unknown } || null;
        const code =
            typeof body?.code === 'string' ? body.code : undefined;

        const apiMessage = this.getMessageByCode(code);

        if(apiMessage) {
            return apiMessage;
        }

        switch (error.status) {
            case 0:
                return ERROR_MESSAGES.GENERAL.NEWWORK;
            
            case 401:
                return ERROR_MESSAGES.GENERAL.UNAUTHORIZED;
            
            case 403:
                return ERROR_MESSAGES.GENERAL.FORBIDDEN;

            case 404:
                return ERROR_MESSAGES.GENERAL.NOT_FOUND;
            
            case 409:
                return ERROR_MESSAGES.GENERAL.CONFLICT;

            case 429:
                return ERROR_MESSAGES.GENERAL.TIMEOUT;

            default :
                if (error.status >= 500) {
                    return ERROR_MESSAGES.GENERAL.SERVER;
                }
                return fallback ?? ERROR_MESSAGES.GENERAL.UNKNOWN;
        }
    }

    getMessageByCode(
        code:string | undefined,
    ) :string | undefined {
       const messages: Record<string, string> = {
        INVALID_CREDENTALS: 
            ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        OB_ALREADY_APPLIED:
            ERROR_MESSAGES.JOB.ALREADY_APPLIED,
       };

       return code ? messages[code] : undefined;
    }

}