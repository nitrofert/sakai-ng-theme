import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-perfil',
  providers:[ConfirmationService,MessageService],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements  OnInit{

  permisosModulo!:any[];
  infoUsuario!:any;

  nombrecompleto:string ="";
  username:string = "";
  password:string = "";
  password2:string = "";
  email:string="";
  numerotelefonico:string ="";
  estado:string = "";

  roles!:any[];
  rolesSeleccionados:any[] = [];
  rolesFiltrados:any[] = [];

  clientesSAP!:any[];
  clientesSAPSeleccionados:any[] = [];
  clientesSAPFiltrados:any[] = [];

  envioLineaUsuario:boolean = false;

  constructor(private router:Router,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private usuariosService:UsuarioService){}

ngOnInit() {
  this.getPermisosModulo(); 
  
}

getPermisosModulo(){
  const modulo = this.router.url;
  this.usuariosService.getPermisosModulo(modulo)
      .subscribe({
          next: async (permisos)=>{
           //////console.log(permisos);
            if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
              this.router.navigate(['/auth/access']);
            }

            if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
              this.router.navigate(['/auth/access']);
            }
            this.permisosModulo = permisos;
           
           //////console.log(this.permisosModulo);
            this.getInfoUsuario();
          
          },
          error:(err)=>{
              console.error(err);
          }
      });
      
}

async getInfoUsuario():Promise<void> {
  this.infoUsuario = await this.usuariosService.infoUsuario();
 //////console.log(this.infoUsuario);

  this.nombrecompleto = this.infoUsuario.nombrecompleto;
  this.email = this.infoUsuario.email;
  this.numerotelefonico = this.infoUsuario.numerotelefonico;
  this.username = this.infoUsuario.username;
}

editar(){

}

cancelar(){

}
  
}
