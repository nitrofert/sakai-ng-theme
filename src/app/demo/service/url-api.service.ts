
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
  })
export class UrlApiService {

    //env:string = 'dev';
    env:string = environment.env;
    url_api:string =environment.url_backend;
    
    companySAP:string = environment.companySAP;
    companyMySQL:string = environment.companyMySQL;
    
    headers:any;
    constructor() {}

    getUrlAPI():string{
        console.log('url api2:',this.url_api);
        return this.url_api;
    }

    getToken():string{
        let token:string = "";
        if(localStorage.getItem('token')){
            token!= localStorage.getItem('token');
            
        }
        return token;
    }

    getHeadersAPI(tokenid?:string):any{
        
        let headers = new HttpHeaders()

        let token = this.getToken();
 
        headers=headers.append('content-type','application/json')
        headers=headers.append('Access-Control-Allow-Origin', '*')
        //headers=headers.append('content-type','application/x-www-form-urlencoded')
        if(token!=""){
            headers=headers.append('withCredentials','true')
            headers=headers.append('Authorization','Bearer ' + token) 
        }
        
        //console.log(headers) 
       
        return { headers: headers };
    }
}
