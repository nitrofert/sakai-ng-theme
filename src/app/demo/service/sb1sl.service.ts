import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UrlApiService } from "./url-api.service";

@Injectable({
    providedIn: 'root'
  })
  export class SB1SLService  {
    
    private api_url:string = "";

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService,
                ) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    getClientesSAP():Observable<any>{
        const url:string = `${this.api_url}/api/sb1sl/BusinessPartners`;
        return this.http.get<any>(url,{params:{
            '$select':'CardCode,CardName,FederalTaxID,GroupCode,Address, Phone1,Phone2, ContactPerson,Currency,City,County,EmailAddress,BPAddresses,ContactEmployees',
            '$filter':`CardType eq 'cCustomer'`
        }});
    }


    bloqueoPedidos(data:any):Observable<any>{
        const url:string = `${this.api_url}/api/sb1sl/bloqueo-pedidos`;
        return this.http.post<any>(url,data);
    }


}