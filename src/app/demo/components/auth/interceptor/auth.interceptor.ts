import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent }
  from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlApiService } from 'src/app/demo/service/url-api.service';

@Injectable()
export class AuthIterceptorToken implements HttpInterceptor {
    
    constructor(private urlApi:UrlApiService){}

    intercept(req : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {
        
        const token = localStorage.getItem('token');
        

        let request = req;
        let setHeaders:any = {
            'Access-Control-Allow-Origin':'*'
        }

        if(token!=""){
            setHeaders.authorization = `Bearer ${token}`;
        
        }

        request = req.clone({
            setHeaders
        });
        
      return next.handle(request);
    }
}