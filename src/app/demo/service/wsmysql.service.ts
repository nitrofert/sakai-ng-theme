import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, lastValueFrom } from "rxjs";
import { UrlApiService } from "./url-api.service";

@Injectable({
    providedIn: 'root'
  })
  export class WsMysqlService  {
    
    private api_url:string = "";
  

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService,
                ) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }



    getSociosNegocio(cardcode?:string):Observable<any> {
        let socioNegoscio = '';
        if(cardcode){
            socioNegoscio = `&cardcode=${cardcode}`;
        }
        const url:string = `${this.api_url}/api/ws-mysql/socios-negocio?compania=${this.urlApiService.companyMySQL}${socioNegoscio}`;
        return this.http.get<any>(url);
    }


    
    async sociosNegocio(cardcode?:string):Promise<any>{
        const infoSociosNegocio$ = this.getSociosNegocio(cardcode);
        const infoSociosNegocio = await lastValueFrom(infoSociosNegocio$);
        return infoSociosNegocio;
    }





}