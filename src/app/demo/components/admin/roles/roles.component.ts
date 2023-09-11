import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { RolesService } from 'src/app/demo/service/roles.service';
import { FormRolesComponent } from './form-roles/form-roles.component';

@Component({
  selector: 'app-roles',
  providers:[ConfirmationService,MessageService],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements  OnInit {
  dataTable:any[] = [];
  headersTable:any[] = [
                          {
                              'id':{ 
                                    label:'Id Acción', 
                                    type:'text',
                                    sizeCol:'6rem',
                                    align:'center',
                                    field:'id',
                                  }, 
                              'accion': {
                                    label:'Nombre',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center',
                                    field:'accion',
                                  }, 
                              'descripcion': {
                                        label:'Descripción',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'justify',
                                        field:'descripcion',
                                      }, 
                              'estado': {
                                                label:'Estado',
                                                type:'text', 
                                                sizeCol:'6rem', 
                                                align:'center',
                                                field:'estado',
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
              private rolesService:RolesService,
              private usuariosService:UsuarioService){}

    ngOnInit() {
      this.getPermisosModulo(); 
      this.getListadoRoles();
      
  
    }
  
    getPermisosModulo(){
        const modulo = this.router.url;
        this.usuariosService.getPermisosModulo(modulo)
            .subscribe({
                next: (permisos)=>{
                  console.log(permisos);
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

    getListadoRoles(){
      this.rolesService.getListadoRoles()
          .subscribe({
              next: (roles)=>{
                console.log(roles);
                let rolesTmp:any[] = [];
                for(let item of roles){
                  rolesTmp.push({
                        id:item.id,
                        accion:item.nombre,
                        descripcion:item.descripcion,
                        estado:item.estado
                    });
                }
  
                this.dataTable = rolesTmp;
              },
              error:(err)=>{
                  console.error(err);
              }
          });
      
    }
  
    nuevaAccion(event: any){
      console.log(event);
      //this.router.navigate(['/portal/solicitudes-de-cargue/nueva']);
     
        const ref = this.dialogService.open(FormRolesComponent, {
          data: {
              id: parseInt('0')
          },
          header: `Nuevo rol` ,
          width: '70%',
          height:'auto',
          contentStyle: {"overflow": "auto"},
          maximizable:true, 
        });
      
        ref.onClose.subscribe(() => {
          this.getListadoRoles();
          //console.log("Refresh calendar");
        });
    }
  
  
    editAccion(event: any){
  
      
        const ref = this.dialogService.open(FormRolesComponent, {
          data: {
              id: parseInt(event)
          },
          header: `Editar acción` ,
          width: '70%',
          height:'auto',
          contentStyle: {"overflow": "auto"},
          maximizable:true, 
        });
      
        ref.onClose.subscribe(() => {
          this.getListadoRoles();
          //console.log("Refresh calendar");
        });
    }
   
    deleteAccion(event: any){
        console.log(event);
    }
}
