import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { AccionesService } from 'src/app/demo/service/acciones.service';
import { FormAccionesComponent } from './form-acciones/form-acciones.component';


@Component({
  selector: 'app-acciones',
  providers:[ConfirmationService,MessageService],
  templateUrl: './acciones.component.html',
  styleUrls: ['./acciones.component.scss']
})
export class AccionesComponent implements  OnInit{

  
  dataTable:any[] = [];
  headersTable:any[] = [
                          {
                              'id':{ 
                                    label:'Id Acción', 
                                    type:'text',
                                    sizeCol:'6rem',
                                    align:'center'
                                  }, 
                              'accion': {
                                    label:'Nombre',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center'
                                  }, 
                              'descripcion': {
                                        label:'Descripción',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'justify'
                                      }, 
                              'estado': {
                                                label:'Estado',
                                                type:'text', 
                                                sizeCol:'6rem', 
                                                align:'center'
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
              private accionesService:AccionesService,
              private usuariosService:UsuarioService){}

    ngOnInit() {
      this.getPermisosModulo(); 
      this.getListadoAcciones();
      
  
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

    getListadoAcciones(){
      this.accionesService.getListadoAcciones()
          .subscribe({
              next: (acciones)=>{
                console.log(acciones);
                let accionesTmp:any[] = [];
                for(let item of acciones){
                  accionesTmp.push({
                        id:item.id,
                        accion:item.accion,
                        descripcion:item.descripcion,
                        estado:item.estado
                    });
                }
  
                this.dataTable = accionesTmp;
              },
              error:(err)=>{
                  console.error(err);
              }
          });
      
    }
  
    nuevaAccion(event: any){
      console.log(event);
      //this.router.navigate(['/portal/solicitudes-de-cargue/nueva']);
     
        const ref = this.dialogService.open(FormAccionesComponent, {
          data: {
              id: parseInt('0')
          },
          header: `Nueva acción` ,
          width: '70%',
          height:'auto',
          contentStyle: {"overflow": "auto"},
          maximizable:true, 
        });
      
        ref.onClose.subscribe(() => {
          this.getListadoAcciones();
          //console.log("Refresh calendar");
        });
    }
  
  
    editAccion(event: any){
  
      
        const ref = this.dialogService.open(FormAccionesComponent, {
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
          this.getListadoAcciones();
          //console.log("Refresh calendar");
        });
    }
   
    deleteAccion(event: any){
        console.log(event);
    }



}
