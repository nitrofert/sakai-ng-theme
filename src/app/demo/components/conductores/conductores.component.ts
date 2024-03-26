import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UsuarioService } from '../../service/usuario.service';
import { FunctionsService } from '../../service/functions.service';
import { ConductoresService } from '../../service/conductores.service';
import { FormConductorComponent } from './form-conductor/form-conductor.component';

@Component({
  selector: 'app-conductores',
  providers:[ConfirmationService,MessageService],
  templateUrl: './conductores.component.html',
  styleUrls: ['./conductores.component.scss']
})
export class ConductoresComponent implements  OnInit{
  permisosModulo!:any[];

  showBtnNew:boolean =false;
  showBtnEdit:boolean = false;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = false;
  showBtnActivate:boolean = false;
  infoUsuario!:any;


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
                              'nombre': {
                                    label:'Nombre',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center',
                                    field:'nombre'
                                  }, 
                              'cedula': {
                                        label:'Cedula',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'center',
                                        field:'cedula'
                                      }, 
                              'email': {
                                          label:'E-mail',
                                          type:'text', 
                                          sizeCol:'6rem', 
                                          align:'center',
                                          field:'email'
                                        },
                              'numerotelefono': {
                                label:'Número télefonico',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center',
                                field:'numerotelefono'
                              },
                              'celular': {
                                label:'Número celular',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center',
                                field:'celular'
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
  
  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];

  constructor(private router:Router,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private  messageService: MessageService,
    private usuariosService:UsuarioService,
    private conductoresService:ConductoresService,
    public functionsService:FunctionsService){}
    
  ngOnInit() {
  this.getPermisosModulo(); 

  }

  getPermisosModulo(){
    const modulo = this.router.url;
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              //////////console.log(permisos);
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
              this.showBtnActivate = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='activar').valor;
  
              
              this.infoUsuario = await this.usuariosService.infoUsuario();
              ////////console.log(this.infoUsuario);
              this.getConductores();
  
            },
            error:(err)=>{
                console.error(err);
            }
        });
          
  }

  getConductores(){
    this.conductoresService.getConductores2()
    .subscribe({
        next:(conductores)=>{
          //console.log(clientes)

          let dataConductores:any[] = [];
              for(let conductor of conductores){
                
                dataConductores.push({
                  id:conductor.id,
                  nombre:conductor.nombre,
                  cedula:conductor.cedula,
                  email:conductor.email,
                  numerotelefono:conductor.numertelefono,
                  celular:conductor.numerocelular,
                  estado:conductor.estado

                });
              }
              this.dataTable = dataConductores;
        },
        error:(err)=>{
          console.error(err); 
        },
    });
  }

  nuevo(event:any){
    const ref = this.dialogService.open(FormConductorComponent, {
      data: {
       id: ''
      },
      header: `Nueva conductor` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async (infoVehiculo) => {
     this.getConductores();
      
    });
  }

  editar(event:any){
    console.log(event)
    const ref = this.dialogService.open(FormConductorComponent, {
      data: {
       id: event
      },
      header: `Editar conductor` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async (infoVehiculo) => {
      this.getConductores();
      
    });
  }

  borrar(event:any){

    this.confirmationService.confirm({
      message: 'Esta seguro de proceder con la inactivación de los conductores seleccionados?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        console.log(event);
        let idsInactivar = event.map((item: { id: any; })=>{
          return item.id;
        })
        this.conductoresService.inactivar(idsInactivar)
            .subscribe({
              next:(results)=>{
                if(results){
                    for(let result of results){
                      this.messageService.add({severity:result.severity, summary:result.summary, detail:`El conductor ${event.filter((item: { id: any; })=>item.id === result.id)[0].nombre} ${result.detail}`});
                      if(result.severity==='success'){
                        let indexTransportadora = this.dataTable.findIndex(item=>item.id === result.id);
                        this.dataTable[indexTransportadora].estado = 'INACTIVO';
                      }
                    }
                }
              },
              error:(err)=>{
                  console.error(err);
                  this.messageService.add({severity:'danger', summary:'Error', detail:`Ocurrio un error al inactivar los conductores seleccionados ${err}`});
              }
        })

      },
      reject: (type: any) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  //this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                  //this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
     });

    

  }

  activar(event:any){

    this.confirmationService.confirm({
      message: 'Esta seguro de proceder con la activación de los conductores seleccionados?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(event);
        let idsActivar = event.map((item: { id: any; })=>{
          return item.id;
        })
        this.conductoresService.activar(idsActivar)
            .subscribe({
              next:(results)=>{
                if(results){
                    for(let result of results){
                      this.messageService.add({severity:result.severity, summary:result.summary, detail:`El conductor ${event.filter((item: { id: any; })=>item.id === result.id)[0].nombre} ${result.detail}`});
                      if(result.severity==='success'){
                        let indexTransportadora = this.dataTable.findIndex(item=>item.id === result.id);
                        this.dataTable[indexTransportadora].estado = 'ACTIVO';
                      }
                    }
                }
              },
              error:(err)=>{
                  console.error(err);
                  this.messageService.add({severity:'danger', summary:'Error', detail:`Ocurrio un error al activar los conductores seleccionados ${err}`});
              }
        })
       

      },
      reject: (type: any) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  //this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                  //this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
     });
    
  }
}
