import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, lastValueFrom } from "rxjs";
import { UrlApiService } from "./url-api.service";

@Injectable({
    providedIn: 'root'
  })
  export class SB1XEService  {
    
    private api_url:string = "";
  

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService,
                ) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }



    getSaldosCupoSocioNegocio(cardcode:string):Observable<any> {
        const url:string = `${this.api_url}/api/sb1xe/saldos-cupo-sn?compania=${this.urlApiService.companySAP}&cliente=${cardcode}`;
        return this.http.get<any>(url);
    }


    
    async saldosCupoSocioNegocio(cardcode:string):Promise<any>{
        const infoSaldosSN$ = this.getSaldosCupoSocioNegocio(cardcode);
        const infoSaldosSN = await lastValueFrom(infoSaldosSN$);
        return infoSaldosSN;
    }


    getFactursaSocioNegocio(params:any):Observable<any> {

        ////console.log(params);
        let parametros ="";

        if(params.compania){
            parametros+=parametros==""?`?compania=${params.compania}`:`&compania=${params.compania}`;
        }

        if(params.cliente){
            parametros+=parametros==""?`?cliente=${params.cliente}`:`&cliente=${params.cliente}`;
        }

        if(params.pagada){
            parametros+=parametros==""?`?pagada=${params.pagada}`:`&pagada=${params.pagada}`;
        }

        if(params.fechaini){
            parametros+=parametros==""?`?fechaini=${params.fechaini}`:`&fechaini=${params.fechaini}`;
        }

        if(params.fechafin){
            parametros+=parametros==""?`?fechafin=${params.fechafin}`:`&fechafin=${params.fechafin}`;
        }

        const url:string = `${this.api_url}/api/sb1xe/facturas-sn${parametros}`;
       ////console.log(url);
        return this.http.get<any>(url);
    }

   
    async facturasSocioNegocio(params:any):Promise<any>{
        //////console.log(params);
        const facturasSN$ = this.getFactursaSocioNegocio(params);
        const facturasSN = await lastValueFrom(facturasSN$);
        return facturasSN;
    }



}