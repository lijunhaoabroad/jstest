import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // // add authorization header with jwt token if available
        // const user = this.authenticationService.userValue;
        // const isLoggedIn = user;
        // const isApiUrl = request.url.startsWith(environment.API_URL);
        // // if (isLoggedIn && isApiUrl) {

        request = request.clone({
            withCredentials: true
        });


        return next.handle(request);
    }
}