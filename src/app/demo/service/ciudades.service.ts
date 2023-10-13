import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UrlApiService } from "./url-api.service";
import { lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class CiudadesService  {
    
    private api_url:string = "";


    constructor(private http: HttpClient,
                private urlApiService:UrlApiService,
                ) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    getCiudades():Observable<any>{
        const url:string = `${this.api_url}/api/ciudades`;
        return this.http.get<any>(url);
    }

    async infoCiudades():Promise<any>{
        const infoCiudades$ = this.getCiudades();
        const infoCiudades = await lastValueFrom(infoCiudades$);
        //console.log(infoClientes)
        return infoCiudades;
    } 

   
}