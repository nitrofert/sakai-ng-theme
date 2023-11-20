import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UrlApiService } from "./url-api.service";
import { lastValueFrom } from 'rxjs';

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

    async infoUsuario():Promise<any>{
        const infousuario$ = this.getInfoUsuario();
        const infousuario = await lastValueFrom(infousuario$);
        return infousuario;
    }
    

    getInfoUsuarioByID(idusuario:number):Observable<any>{
        const url:string = `${this.api_url}/api/usuarios/${idusuario}`;
        return this.http.get<any>(url);
    }

    getUsuarioByCardCode(CardCode:string):Observable<any>{
        const url:string = `${this.api_url}/api/usuarios/by-card-code/${CardCode} `;
        return  this.http.get<any>(url);
    }

    async infoUsuarioByCardCode(CardCode:string):Promise<any>{
        const infousuario$ = this.getUsuarioByCardCode(CardCode);
        const infousuario = await lastValueFrom(infousuario$);
        return infousuario;
    }

    getRolesUsuario():Observable<any>{
        const url:string = `${this.api_url}/api/usuarios/roles`;
        return  this.http.get<any>(url);
    }

   

    getClientesUsuario():Observable<any>{
        const url:string = `${this.api_url}/api/usuarios/clientes`;
        return  this.http.get<any>(url);
    }

    getMenuUsuario():Observable<any>{
        const url:string = `${this.api_url}/api/menu/by-usuario`;
        return  this.http.get<any>(url);
    }

    getPermisosModulo(modulo:string):Observable<any> {
        ////////console.log(modulo);
        modulo = modulo.replace(/\//g, '_')
        const url:string = `${this.api_url}/api/usuarios/permisos-modulo/${modulo}`;
        return  this.http.get<any>(url);
    }

    async permisosModulo(modulo:string):Promise<any>{
        const permisos$ = this.getPermisosModulo(modulo);
        const permisos = await lastValueFrom(permisos$);
        return permisos;
    }

    async permisoModuloAccion(modulo:string, accion:string):Promise<boolean>{
  
        //const modulo = this.router.url;
        let permiso = false;
        let permisosModulo = await this.permisosModulo(modulo);
        //////console.log(permisosModulo);
        //////console.log(permisosModulo.find((permisoModulo: { accion: string; })=>permisoModulo.accion === accion))
        if(permisosModulo.find((permisoModulo: { accion: string; })=>permisoModulo.accion === accion) && permisosModulo.find((permisoModulo: { accion: string; })=>permisoModulo.accion === accion).valor){
            permiso = true;
        }
        return permiso;
      }



    getListadoUsuarios():Observable<any> {
        const url:string = `${this.api_url}/api/usuarios`;
        return  this.http.get<any>(url);
    }
    create(form:any):Observable<any> {
        const url:string = `${this.api_url}/api/usuarios`;
        return  this.http.post<any>(url,form);
    }

    update(form:any,idusuario:number):Observable<any> {
        const url:string = `${this.api_url}/api/usuarios/${idusuario}`;
        return  this.http.patch<any>(url,form);
    }




    async aceptoPoliticaDatos(infousuario:any):Promise<boolean>{
        let acepto:boolean = false;
        //const infousuario = await this.infoUsuario();
        //const infousuario = this.info_usuario;
        if(infousuario.aceptopoliticadatos=='Y'){
            acepto = true;
        }
        return acepto;
    }

    async actualizoPassword(infousuario:any):Promise<boolean>{
        let actualizo:boolean = false;
        //const infousuario = await this.infoUsuario();
        //const infousuario = this.info_usuario;
        if(infousuario.cambiopassword=='Y'){
            actualizo = true;
        }
        return actualizo;
    }
}