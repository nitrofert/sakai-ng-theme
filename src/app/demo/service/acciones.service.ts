import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UrlApiService } from "./url-api.service";

@Injectable({
    providedIn: 'root'
  })
  export class AccionesService  {
    
    private api_url:string = "";

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService,
                ) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    getListadoAcciones():Observable<any>{
        const url:string = `${this.api_url}/api/acciones`;
        return this.http.get<any>(url);
    }


    getAccionByID(id:number):Observable<any>{
        const url:string = `${this.api_url}/api/acciones/${id}`;
        return this.http.get<any>(url);
    }

    create(form:any):Observable<any>{
        const url:string = `${this.api_url}/api/acciones`;
        return  this.http.post<any>(url,form);
    }

    update(form:any, id:number):Observable<any>{
        const url:string = `${this.api_url}/api/acciones/${id}`;
        return  this.http.patch<any>(url,form);
    }
    

}