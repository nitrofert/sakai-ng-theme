import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { MatrizNotificacionService } from 'src/app/demo/service/matriz-notificacion.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-matriz-notificacion',
  providers:[ConfirmationService,MessageService],
  templateUrl: './matriz-notificacion.component.html',
  styleUrls: ['./matriz-notificacion.component.scss']
})
export class MatrizNotificacionComponent implements  OnInit{

  tablaMatrizNotificacion:any;
  loadingTablaMatrizNotificacion:boolean = false;
  matrizNotificacion:any[] = [];
  estadosTurnos:any;

  constructor( private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private solicitudTurnoService:SolicitudTurnoService,
    //public ref: DynamicDialogRef,
    private router:Router,
    public usuariosService:UsuarioService, 
   
    public dialogService: DialogService,
    //public config: DynamicDialogConfig,
   
    public functionsService:FunctionsService,
    private matrizNotificacionService:MatrizNotificacionService
    ) { }

  async ngOnInit() {
    this.configTablaMatrizNotificacion();
    this.getMatrizNotificacion();
    this.estadosTurnos = this.solicitudTurnoService.estadosTurno;
    ////console.log(this.estadosTurnos);
  }

  getMatrizNotificacion(){
    this.matrizNotificacionService.getMatrizNotificacion()
        .subscribe({
            next:(notificaciones)=>{
              
              notificaciones.map((notificacion:any)=>{
                ////console.log(notificacion)
                notificacion.order = this.estadosTurnos.find((estado: { name: any; })=>estado.name === notificacion.estado_turno).order;
              });
              
              notificaciones.sort((a:{locacion:string; order:number},b:{locacion:string; order:number})=> (a.locacion.localeCompare(b.locacion) || (a.order < b.order)));
              ////console.log(notificaciones);
              this.matrizNotificacion = notificaciones;
              this.configTablaMatrizNotificacion();
            },
            error:(err)=>{
              console.error(err);
            }
        })
  }

  configTablaMatrizNotificacion(){
    let headersTable:any= this.configHeadersMatrizNotificacion();
    let dataTable:any = this.configDataTableMatrizNotificacion(this.matrizNotificacion);
    
    this.tablaMatrizNotificacion = {
      header: headersTable,
      data: dataTable
    }
    this.loadingTablaMatrizNotificacion = false;
  }

  configHeadersMatrizNotificacion(){
    let headersTable:any[] = [
      {
       
        'locacion': { label:'Locacion',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'locacion'},
        'estado_turno': { label:'Estado turno',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'estado_turno'},
        'nombre_responsable': {label:'Responsable',type:'text', sizeCol:'6rem', align:'center',field:'nombre_responsable'},
        'email_responsable': {label:'Email',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'email_responsable'},
        
      }];

     
      return headersTable;
  }

  configDataTableMatrizNotificacion(data:any){
    
     ////// ////////////console.log('arregloPedido',arregloPedido);
     
     let dataTable:any[] = [];
     
     for (let item of data){
       
       
         dataTable.push({
            locacion:item.locacion,
            estado_turno: item.estado_turno,
            nombre_responsable: item.nombre_responsable,
            email_responsable: item.email_responsable
         });
 
         
       
       
     } 
     
     return dataTable;
  }
}
