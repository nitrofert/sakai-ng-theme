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
import { PdfOrdenCargue } from '../../solicitudescargue/config-pdf/orden-cargue';
import { PdfRemision } from '../../solicitudescargue/config-pdf/remision';
import { PdfTiqueteBascula } from '../../solicitudescargue/config-pdf/tiquete-turno';

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

//documentos:any[] = [{label:"Solicitud de cargue", tipo:"solicitud"},{label:"Orden de cargue", tipo:"orden_cargue"},{label:"inspección de cargue", tipo:"inspeccion"}];

documentos:any[] = [];

//documentos:any[] = [{label:"Solicitud de cargue", tipo:"solicitud"},{label:"inspección de cargue", tipo:"inspeccion"}];

infoTurno!:any;

evidencias_cargue:any[] = []

tipoTurno:string="";


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
              private pdfInspeccionCargue:PdfInspeccionCargue,
              private pdfOrdenCargue:PdfOrdenCargue,
              private pdfRemision:PdfRemision,
              private PpfTiqueteBascula:PdfTiqueteBascula,
            
              ) { }

  ngOnInit() {

    this.displayModal = true;
    this.loadingCargue = true;
    //this.condicion_tpt="RETIRA";
    this.turnoId = this.config.data.id;
    this.infoTurno = this.config.data.info;
    ////console.log('this.infoTurno',this.infoTurno);
    this.getPermisosModulo();
   

   
    
  }



  getPermisosModulo(){
  
    const modulo = this.router.url!='/portal/turnos'?'/portal/turnos':this.router.url;
    ////////console.log(modulo);
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              ////////////////////////// ////////////// ////////////console.log(permisos);
              if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                this.router.navigate(['/auth/access']);
              }
  
              if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                this.router.navigate(['/auth/access']);
              }
              this.permisosModulo = permisos;
              //this.multiplesClientes = await this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Seleccionar multiples clientes').valor;
              ////////////////////////////// ////////////// ////////////console.log(this.multiplesClientes);
              /*
              this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
              this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
              this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
              this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
              */

              const infoUsuario = await this.usuariosService.infoUsuario();
              this.rolesUsuario = infoUsuario.roles;
              ////////////////// ////////////// ////////////console.log(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.CLIENTE));
           
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
                //console.log('turno docs',turno);
                  
                  this.turno = turno;
                  this.displayModal = false;
                  this.loadingCargue = false;

                  this.evidencias_cargue = await this.getEvidenciasCargue(turno);
                  this.tipoTurno = this.turno.tipo;

                  if(this.tipoTurno==='RETIRO'){
                    this.documentos = [{label:"Solicitud de cargue", tipo:"solicitud",value:''},{label:"Orden de cargue", tipo:"orden_cargue",value:''},{label:"inspección de cargue", tipo:"inspeccion",value:''},{label:"Tiquete de bascula", tipo:"tiquete_bascula",value:''}];
                  }

                  let remisiones_turno:any[] = [];

                  for(let remision of turno.detalle_solicitud_turnos_remisiones){
                    this.documentos.push({label:`Remision No. ${remision.docnum}`, tipo:"remision", value:remision.docnum})

                    // let linea_remision:any = {
                    //   numero:remision.docnum,
                    //   pedido:remision.base_docnum,
                    //   cliente: turno.solicitud.clientes.filter((socio_negocio: { CardCode: any; })=>socio_negocio.CardCode === remision.CardCode)[0],
                    //   destino: `${remision.municipioentrega} - ${remision.lugarentrega}`,
                    //   vehiculo:turno.vehiculo,
                    //   transportadora:turno.transportadora,
                    //   conductor:turno.conductor,
                    //   tara:turno.peso_vacio,
                    //   peso_carga:turno.peso_neto - turno.peso_vacio,
                    //   neto:turno.peso_neto,
                    // }

                    // let detalle_remision:any[] = [];
                    // //Buscar en detalle_pedidos_turno los items coincidentes con la remision.docnum

                    // let detalle_pedidos_turno = turno.detalle_solicitud_turnos_pedido.filter((pedido:{remision:any})=>pedido.remision === remision.docnum);

                    // for(let pedido of detalle_pedidos_turno){
                    //   let linea_detalle_remision = {
                    //     pedidonum:pedido.pedidonum,
                    //     linea:pedido.linea,
                    //     bodega:pedido.bodega,
                    //     itemcode:pedido.itemcode,
                    //     itemname:pedido.itemname,
                    //     cantidad:pedido.cantidad,
                    //     cantidad_sacos:pedido.cantidad_sacos,
                    //     lote:'',
                    //     unidad:'TONELADA'
                    //   }
                    //   //Si la linea del pedido no tiene lotes asignar linea_detalle_remision
                    //   if(pedido.detalle_lotes_item_turno!=undefined && pedido.detalle_lotes_item_turno.length ===0){
                    //     detalle_remision.push(linea_detalle_remision);
                    //   }else{
                    //     for(let lote of pedido.detalle_lotes_item_turno){
                    //       linea_detalle_remision.cantidad = lote.cantidad_cargue_lote;
                    //       linea_detalle_remision.cantidad_sacos = lote.cantidad_sacos_lote;
                    //       linea_detalle_remision.lote = lote.lote;

                    //       detalle_remision.push(linea_detalle_remision);

                    //     }
                    //   }
                    // }

                    // linea_remision.detalle_remision = detalle_remision;
                    // remisiones_turno.push(linea_remision);

                     

                  }

                   

                    //console.log('remisiones_turno',remisiones_turno)

                    

                    


                    
                  
              },
              error:(err)=>{
                console.error(err);
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});

              }
        });


  }

  async getEvidenciasCargue(turno:any):Promise<any>{
    let itemsTurno = turno.detalle_solicitud_turnos_pedido;
    let evidenciasItemTurno:any[] = [];
    let entidad = 'pedidos-turno';

    for(let itemTurno of itemsTurno){
      let filesAtach$ = this.functionsService.loadFiles({id_relacion:itemTurno.id,entidad});
      let filesAtachByEstadoHistorialTurno = await lastValueFrom(filesAtach$);

      for(let file of filesAtachByEstadoHistorialTurno){
        evidenciasItemTurno.push({cliente:itemTurno.CardName,producto:itemTurno.itemcode+' '+itemTurno.itemname, evidencia:file.nombre, linkS3:file.linkS3 });
      }
    }

   ////console.log(evidenciasItemTurno);

    return evidenciasItemTurno;

  }

  downloadFile(url:any){
    window.open(url);
  }

  generarPDF(tipo:string,valor?:any){

      switch(tipo){
        case 'solicitud':
            this.pdfSolicitud();
        break;

        case 'inspeccion':
            this.pdfInspeccion();
        break;

        case 'orden_cargue':
            this.pdfOrden();
        break;

        case 'remision':
          this.pdfRemisionTurno(valor);
        break;

        case 'tiquete_bascula':
          this.pdfTiqueteBasculaTurno();
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

 async pdfOrden():Promise<void> {
  await this.pdfOrdenCargue.generarPDF(this.infoTurno);
 }

 async pdfRemisionTurno(remision:any):Promise<void>{

  await this.pdfRemision.generarPDF(this.turno.id,remision);
 }

 async pdfTiqueteBasculaTurno():Promise<void>{

  if(this.infoTurno.estado != this.estadosTurno.PESADOF && this.infoTurno.estado != this.estadosTurno.DESPACHADO && this.infoTurno.estado != this.estadosTurno.ENTREGADO){
      this.messageService.add({ severity: 'error', summary: '!Error¡', detail: "Solo puede generar el tiquete de bascula, si y solo si se haya realizado el pesado final" });
    }else {
      await this.PpfTiqueteBascula.generarPDF(this.infoTurno);
    }

  
 }

 



}
