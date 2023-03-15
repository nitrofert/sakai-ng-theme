import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UrlApiService } from "./url-api.service";

@Injectable({
    providedIn: 'root'
  })
  export class PermisosService  {
    
    private api_url:string = "";

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService,
                ) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    getListadoPermisos(opcionPermiso:any, id:number):Observable<any>{
        const url:string = `${this.api_url}/api/permisos/${opcionPermiso}/${id}`;
        return this.http.get<any>(url);
    }


    getPermisoByID(id:number):Observable<any>{
        const url:string = `${this.api_url}/api/permisos/${id}`;
        return this.http.get<any>(url);
    }

    create(form:any):Observable<any>{
        const url:string = `${this.api_url}/api/permisos`;
        return  this.http.post<any>(url,form);
    }

    update(form:any, id:number):Observable<any>{
        const url:string = `${this.api_url}/api/permisos/${id}`;
        return  this.http.patch<any>(url,form);
    }

    updateEstadoPermmisoRol(form:any):Observable<any>{
        const url:string = `${this.api_url}/api/permisos/rol`;
        return  this.http.put<any>(url,form);
    }

    updateEstadoPermmisoUsuario(form:any):Observable<any>{
        const url:string = `${this.api_url}/api/permisos/usuario`;
        return  this.http.put<any>(url,form);
    }
    

}