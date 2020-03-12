import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this.authService.token
        
        const authRequest = req.clone({
            headers : req.headers.set('Authorization' , `Bearer ${token}`)
            // .set('Access-Control-Allow-Origin','*')
            // .set("Access-Control-Allow-Methods", "POST")
        })
        return next.handle(authRequest)

    }
}