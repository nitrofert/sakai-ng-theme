import { UsuarioService } from "src/app/demo/service/usuario.service";
import { lastValueFrom } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class PermisosFunction {

    showBtnNew:boolean =false;
    showBtnEdit:boolean = false;
    showBtnExp:boolean = false;
    showBtnDelete:boolean = false;
    multiplesClientes:boolean = false;

    constructor(public usuariosService:UsuarioService){}

    /*async getPermisosModulo(modulo:string):Promise<any>{
        const permisosModulo$ = this.usuariosService.getPermisosModulo(modulo);
        const permisosModulo = await lastValueFrom(permisosModulo$) 

       //////console.log(permisosModulo);

        this.multiplesClientes = permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Seleccionar multiples clientes').valor;
            
        this.showBtnNew = permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
        this.showBtnEdit = permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
        this.showBtnExp = permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
        this.showBtnDelete = permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
            
    }*/
}