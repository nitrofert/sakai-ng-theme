import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdenesCargueService } from 'src/app/demo/service/ordenes-cargue.service';
import { PedidosService } from 'src/app/demo/service/pedidos.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { Subject, debounceTime, lastValueFrom } from 'rxjs';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { VehiculosService } from 'src/app/demo/service/vehiculos.service';
import { ConductoresService } from 'src/app/demo/service/conductores.service';
import { TransportadorasService } from 'src/app/demo/service/transportadoras.service';
import { FormVehiculoComponent } from '../../vehiculos/form-vehiculo/form-vehiculo.component';
import { FormConductorComponent } from '../../conductores/form-conductor/form-conductor.component';
import { FormTransportadoraComponent } from '../../transportadoras/form-transportadora/form-transportadora.component';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { TipoRol } from '../../admin/roles/roles.enum';
import { EstadosDealleSolicitud } from '../estados-turno.enum';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { NovedadesService } from 'src/app/demo/service/novedades.service';
import { ListaHistorialTurnoComponent } from '../../solicitudescargue/lista-historial-turno/lista-historial-turno.component';
import { CiudadesService } from 'src/app/demo/service/ciudades.service';
import { FileUpload } from 'primeng/fileupload';
import { DynamicUploadComponent } from 'src/app/layout/shared/dynamic-upload/dynamic-upload.component';
import { PdfSolicitudCargue } from '../../solicitudescargue/config-pdf/solicitud-cargue';
import { PdfInspeccionCargue } from '../../solicitudescargue/config-pdf/inspeccion-cargue';

@Component({
  selector: 'app-documentos-turno',
  providers:[ConfirmationService,MessageService], 
  templateUrl: './documentos-turno.component.html',
  styleUrls: ['./documentos-turno.component.scss'],
 
})
export class DocumentosTurnoComponent implements  OnInit {


  turnoId!:number;
  ordenCargue: any;
  hoy:Date = new Date();

  


  displayModal:boolean = false;
  loadingCargue:boolean = false;
  completeCargue:boolean = false;
  completeTimer:boolean = false;
  messageComplete:string = "";

  permisosModulo!:any[];

updateModulo:boolean = false;


tiposRol:any = TipoRol;

estadosTurno:any = EstadosDealleSolicitud;

rolesUsuario:any[]=[];

turno!:any;


domain:string = window.location.hostname;

documentos:any[] = [{label:"Solicitud de cargue", tipo:"solicitud"},{label:"inspección de cargue", tipo:"inspeccion"}];

infoTurno!:any;


  constructor( private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private ordenesCargueService: OrdenesCargueService, 
              private solicitudTurnoService:SolicitudTurnoService,
              private pedidosService: PedidosService,
              public ref: DynamicDialogRef,
              private router:Router,
              public usuariosService:UsuarioService, 
    
              public dialogService: DialogService,
              public config: DynamicDialogConfig,
       
              public functionsService:FunctionsService,
              private pdfSolicitudCargue:PdfSolicitudCargue,
              private pdfInspeccionCargue:PdfInspeccionCargue
            
              ) { }

  ngOnInit() {

    this.displayModal = true;
    this.loadingCargue = true;
    //this.condicion_tpt="RETIRA";
    this.turnoId = this.config.data.id;
    this.infoTurno = this.config.data.info;
    this.getPermisosModulo();
   

   
    
  }



  getPermisosModulo(){
  
    const modulo = this.router.url!='/portal/turnos'?'/portal/turnos':this.router.url;
    //////console.log(modulo);
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              ////////////////////////// ////////////// //////////console.log(permisos);
              if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                this.router.navigate(['/auth/access']);
              }
  
              if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                this.router.navigate(['/auth/access']);
              }
              this.permisosModulo = permisos;
              //this.multiplesClientes = await this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Seleccionar multiples clientes').valor;
              ////////////////////////////// ////////////// //////////console.log(this.multiplesClientes);
              /*
              this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
              this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
              this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
              this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
              */

              const infoUsuario = await this.usuariosService.infoUsuario();
              this.rolesUsuario = infoUsuario.roles;
              ////////////////// ////////////// //////////console.log(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.CLIENTE));
           
             this.updateModulo = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
        
             this.getTurno(this.turnoId);

            // this.displayModal = false;
             //this.loadingCargue = false;
            },
            error:(err)=>{
                console.error(err);
            }
        });
        
  }



 

  async getTurno(id: number){
    
    //let orden = await this.ordenesCargueService.getOrdenesByID(id);
    this.solicitudTurnoService.getTurnosByID(id)
        .subscribe({
              next:async (turno)=>{
                 console.log('turno docs',turno);
                  
                  this.turno = turno;
                  this.displayModal = false;
                  this.loadingCargue = false;
                
              },
              error:(err)=>{
                console.error(err);
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});

              }
        });


  }

  generarPDF(tipo:string){

      switch(tipo){
        case 'solicitud':
            this.pdfSolicitud();
        break;

        case 'inspeccion':
            this.pdfInspeccion();
        break;
      }
  }
 
  
 
  async pdfSolicitud():Promise<void> {
    await this.pdfSolicitudCargue.generarPDF(this.infoTurno);
  }

  async pdfInspeccion():Promise<void> {
    if(this.infoTurno.estado != this.estadosTurno.DESPACHADO){
      this.messageService.add({ severity: 'error', summary: '!Error¡', detail: "Solo puede generar el pdf de inspección de cargue, si el turno se encuentra remisionado" });
    }else if(this.turno.detalle_solicitud_turnos_inspeccion.length == 0){
      this.messageService.add({ severity: 'error', summary: '!Error¡', detail: "El turno seleccionado no posee una inspección de carga realizada." });
     
    }else{
      await this.pdfInspeccionCargue.generarPDF(this.infoTurno);
    }
    
  }


}
