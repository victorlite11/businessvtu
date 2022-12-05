import { Inject, Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(    
    @Inject('AUTH_KEY_PROPERTY_NAME') private authkey : string,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      setHeaders : {
        Authorization : `Bearer ${sessionStorage.getItem(this.authkey) || localStorage.getItem(this.authkey) || ''}`
      }
    })

    return next.handle(clonedRequest).pipe(
      catchError((err : HttpErrorResponse) => {

        if (err.status == 403) {

            if (request.url.includes('user-profile')) {
              // Forbidden
              this.router.navigate([''], {
                relativeTo : this.route
              })            
            } else {
              // Forbidden
              this.router.navigate(['dashboard'], {
                relativeTo : this.route
              })  
            }

        }
        return throwError(err)
      })
    )
  }
}
