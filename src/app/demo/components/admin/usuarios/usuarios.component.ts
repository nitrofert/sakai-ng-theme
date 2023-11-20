import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';

@Component({
  selector: 'app-usuarios',
  providers:[ConfirmationService,MessageService],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements  OnInit{
  dataTable:any[] = [];
  headersTable:any[] = [
                          {
                              'id':{ 
                                    label:'Id', 
                                    type:'text',
                                    sizeCol:'6rem',
                                    align:'center',
                                    field:'id'
                                  }, 
                              'username': {
                                    label:'Usuario portal',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center',
                                    field:'username'
                                  }, 
                              'email': {
                                        label:'Email',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'justify',
                                        field:'email'
                                      },
                              
                              'nombrecompleto':{
                                label:'Nombre usuario',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center',
                                field:'nombrecompleto'
                              },
                              'numerotelefonico':{
                                label:'Número telefonico',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center',
                                field:'numerotelefonico'
                              },         
                              'estado': {
                                                label:'Estado',
                                                type:'text', 
                                                sizeCol:'6rem', 
                                                align:'center',
                                                field:'estado'
                                              }
                          }
                        ];
  
  permisosModulo!:any[];

  showBtnNew:boolean =false;
  showBtnEdit:boolean = false;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = false;

  constructor(private router:Router,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private usuariosService:UsuarioService){}

  ngOnInit() {
    this.getPermisosModulo(); 
    this.getListadoUsuarios();
    

  }
            
  getPermisosModulo(){
      const modulo = this.router.url;
      this.usuariosService.getPermisosModulo(modulo)
          .subscribe({
              next: (permisos)=>{
               //////console.log(permisos);
                if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                  this.router.navigate(['/auth/access']);
                }

                if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                  this.router.navigate(['/auth/access']);
                }
                this.permisosModulo = permisos;
                this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
                this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
                this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
                this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
              },
              error:(err)=>{
                  console.error(err);
              }
          });
          
  }
            
  getListadoUsuarios(){
    this.usuariosService.getListadoUsuarios()
        .subscribe({
            next: (usuario)=>{
             //////console.log(usuario);
              let usuarioTmp:any[] = [];
              for(let item of usuario){
                  usuarioTmp.push({
                      id:item.id,
                      username:item.username,
                      email:item.email,
                      nombrecompleto:item.nombrecompleto,
                      numerotelefonico:item.numerotelefonico,
                      estado:item.estado,
                  });
              }

              this.dataTable = usuarioTmp;
            },
            error:(err)=>{
                console.error(err);
            }
        });
    
  }
            
  nuevoUsuario(event: any){
   //////console.log(event);
    //this.router.navigate(['/portal/solicitudes-de-cargue/nueva']);
    
      const ref = this.dialogService.open(FormUsuarioComponent, {
        data: {
            id: parseInt('0')
        },
        header: `Nuevo usuario` ,
        width: '70%',
        height:'auto',
        contentStyle: {"overflow": "auto"},
        maximizable:true, 
      });
    
      ref.onClose.subscribe(() => {
        this.getListadoUsuarios();
        //////console.log("Refresh calendar");
      });
  }
            
            
  editUsuario(event: any){

    
      const ref = this.dialogService.open(FormUsuarioComponent, {
        data: {
            id: parseInt(event)
        },
        header: `Editar usuario` ,
        width: '70%',
        height:'auto',
        contentStyle: {"overflow": "auto"},
        maximizable:true, 
      });
    
      ref.onClose.subscribe(() => {
        this.getListadoUsuarios();
        //////console.log("Refresh calendar");
      });
  }
  
  deleteUsuario(event: any){
     //////console.log(event);
  }
}
