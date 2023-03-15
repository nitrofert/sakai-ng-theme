import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt'
import decode from 'jwt-decode';
import { firstValueFrom, lastValueFrom, map, Observable } from "rxjs";
import { UrlApiService } from "./url-api.service";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService  {
    
    private api_url:string = "";

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService,
                private jwtHelperService: JwtHelperService
                ) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    isAuth():boolean{
        
        if(!localStorage.getItem('token')){
            return false;
        }
        return true;
    }

    validateToken():Observable<any>{
          const url:string = `${this.api_url}/api/auth`;
          return  this.http.get<any>(url);
    }

    login(dataLogin:any):Observable<any>{

        /*let headers:HttpHeaders = new HttpHeaders();
        headers=headers.append('content-type','application/json')
        headers=headers.append('Access-Control-Allow-Origin', '*')*/

        //let headers = await this.urlApiService.getHeadersAPI();
      
        const url:string = `${this.api_url}/api/auth/login2`;
        //return this.http.post<any>(url,dataLogin,{headers});
        return this.http.post<any>(url,dataLogin);

    }

   verifyCode(dataVerifyCode:any):Observable<any>{
      
      const url:string = `${this.api_url}/api/auth/verify-code`;
      return this.http.post<any>(url,dataVerifyCode);

   }

   resetPassword(dataRestore:any):Observable<any>{
      
    const url:string = `${this.api_url}/api/auth/reset-password`;
    return this.http.post<any>(url,dataRestore);

   }

   changePassword(dataChange:any, token:string):Observable<any>{

    //const requestOptions = this.urlApiService.getHeadersAPI(token);
    //console.log(requestOptions)
    //const requestOptions = { headers: headers };
      
    const url:string = `${this.api_url}/api/auth/change-password`;
    //return this.http.patch<any>(url,dataChange,requestOptions);
    return this.http.patch<any>(url,dataChange);
   }

  
   

 
    
  }