import { Injectable } from '@angular/core';
import {throwError} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExceptionHandlingService {

    constructor() { }

    handleError = (error: any) => {
        let errorMessage = '';
        if (error.hasOwnProperty('error') && typeof error.error === 'string') {
            errorMessage = error.error;
            if (error.error instanceof ErrorEvent) {
                // client-side error
                errorMessage = `Error: ${error.error}`;
            } else if (error.error) {
                errorMessage = error.error;
            } else {
                // server-side error
                errorMessage = 'Something went wrong.';
            }
            console.log('Exception Handling ' + errorMessage);
        } else if (error.hasOwnProperty('message')) {
            errorMessage = error.message;
        } else {
            errorMessage = 'Something went wrong.';
        }
        return throwError(errorMessage);
    }
}
