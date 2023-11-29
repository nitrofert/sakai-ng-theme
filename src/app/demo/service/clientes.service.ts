import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UrlApiService } from "./url-api.service";
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class ClientesService  {
    
    private api_url:string = "";


    constructor(private http: HttpClient,
                private urlApiService:UrlApiService,
                ) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    getClientes():Observable<any>{
        const url:string = `${this.api_url}/api/clientes`;
        return this.http.get<any>(url);
    }

    async infoClientes():Promise<any>{
        const infoClientes$ = this.getClientes();
        const infoClientes = await lastValueFrom(infoClientes$);
        //////////console.log(infoClientes)
        return infoClientes;
    } 

   
}