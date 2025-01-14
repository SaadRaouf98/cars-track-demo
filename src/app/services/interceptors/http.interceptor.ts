import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the Authorization header
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });

    // Handle the request
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle errors globally
        console.error('Error occurred:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  // Simulate fetching token (you can implement your own logic)
  private getToken(): string {
    return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbiIsIlR5cGUiOiJBZG1pbiIsIkVtcGxveWVlSWQiOiIiLCJmYW1pbHlfbmFtZSI6IkVuZy8gQWhtZWQiLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3MzMzNDQzOTQsImV4cCI6MTczMzM4NjM5NCwiaWF0IjoxNzMzMzQ0Mzk0fQ.jDMNy9fFFab1rn0stH6uSkuqrpAoIDZZMKUUqakGekXyY7TNlJFoGmcEEvQ5Kyn2mNYtEOt73wC1nYUsMESgog';
  }
}
