import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApiService } from './url-api.service';



@Injectable()
export class TransportadorasService {

    private api_url:string = "";

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    
    getTransportadoras():Observable<any> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/transportadoras`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<any>(url);
    }

    create(nuevaTransportadora:any):Observable<any>{
      
        //const requestOptions = this.urlApiService.getHeadersAPI();
        const url:string = `${this.api_url}/api/transportadoras`;
        //return this.http.post<any>(url, nuevaTransportadora, requestOptions);
        return this.http.post<any>(url, nuevaTransportadora);

    }

    getTransportadoraById(id:any):Observable<any> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/transportadoras/${id}`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<any>(url);
    }

    update(infoTransportadora:any,id:any):Observable<any>{
      
        //const requestOptions = this.urlApiService.getHeadersAPI();
        const url:string = `${this.api_url}/api/transportadoras/${id}`;
        //return this.http.post<any>(url, nuevaTransportadora, requestOptions);
        return this.http.patch<any>(url, infoTransportadora);

    }

    

   

    
}
