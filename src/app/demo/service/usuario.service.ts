import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UrlApiService } from "./url-api.service";

@Injectable({
    providedIn: 'root'
  })
  export class UsuarioService  {
    
    private api_url:string = "";

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService,
                ) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    getInfoUsuario():Observable<any>{
        const url:string = `${this.api_url}/api/usuarios/my-info`;
        return this.http.get<any>(url);
    }

    getRolesUsuario():Observable<any>{
        const url:string = `${this.api_url}/api/usuarios/roles`;
        return  this.http.get<any>(url);
    }

   

    getClientesUsuario():Observable<any>{
        const url:string = `${this.api_url}/api/usuarios/clientes`;
        return  this.http.get<any>(url);
    }
}