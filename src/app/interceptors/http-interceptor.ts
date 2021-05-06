import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ExceptionHandlingService} from '../services/exception-handling.service';

@Injectable()
export class HttpInterceptorClass implements HttpInterceptor {
    constructor(
        private exceptionHandling: ExceptionHandlingService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headers = req.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        const authReq = req.clone({headers});
        return next.handle(authReq).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('Interceptor event --->>>', event.headers);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                console.log('Interceptor error --->>>', error);
                return this.exceptionHandling.handleError(error);
                // let errorMessage = '';
                // if (error.hasOwnProperty('error') && typeof error.error === 'string') {
                //     errorMessage = error.error;
                // } else {
                //     errorMessage = 'Something went wrong.';
                // }
                // return throwError(errorMessage);
            }));
    }
}
