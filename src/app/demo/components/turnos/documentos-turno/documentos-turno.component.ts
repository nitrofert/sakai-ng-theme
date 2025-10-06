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

remisiones:any[] =[];
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
    //////////console.log('this.infoTurno',this.infoTurno);
    this.getPermisosModulo();
   

   
    
  }



  getPermisosModulo(){
  
    const modulo = this.router.url!='/portal/turnos'?'/portal/turnos':this.router.url;
    //////////////////console.log(modulo);
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              ////////////////////////// ////////////// //////////////////////console.log(permisos);
              if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                this.router.navigate(['/auth/access']);
              }
  
              if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                this.router.navigate(['/auth/access']);
              }
              this.permisosModulo = permisos;
              //this.multiplesClientes = await this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Seleccionar multiples clientes').valor;
              ////////////////////////////// ////////////// //////////////////////console.log(this.multiplesClientes);
              /*
              this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
              this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
              this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
              this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
              */

              const infoUsuario = await this.usuariosService.infoUsuario();
              this.rolesUsuario = infoUsuario.roles;
              ////////////////// ////////////// //////////////////////console.log(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.CLIENTE));
           
             this.updateModulo = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
             //////console.log('llama a cargar datos del turno',this.turnoId)
             let turno = await this.getTurno(this.turnoId);
             //////console.log('termina llamado',this.turnoId)
             this.getDocumentos(turno)

            // this.displayModal = false;
             //this.loadingCargue = false;
            },
            error:(err)=>{
                console.error(err);
            }
        });
        
  }


 async getTurno(id: number):Promise<any>{
    
    //let orden = await this.ordenesCargueService.getOrdenesByID(id);
    
    let turno$ = this.solicitudTurnoService.getDocumentosTurnosByID(id)
    //let turno$ = this.solicitudTurnoService.getTurnosByID(id)
    let turno = await lastValueFrom(turno$);
       
    return turno

  }
 

  async getDocumentos(turno:any){

    console.log('turnos',turno)


   // let clientes:any[] = JSON.parse(JSON.stringify(turno.solicitud.clientes));

    let clientes:any[] = [];

    for(let cliente of turno.solicitud.clientes){
      if(turno.detalle_solicitud_turnos_pedido.find((pedido: { CardCode: any; })=>pedido.CardCode === cliente.CardCode)){
        clientes.push(cliente)
      }
    }

    for(let cliente of clientes){
      console.log('cliente',cliente)
      let turnoCliente:any = JSON.parse(JSON.stringify(turno));
      let dataKey:string = `${turnoCliente.solicitud.id}-${turnoCliente.id}-${turnoCliente.vehiculo.id}-${cliente.CardCode}-${turnoCliente.detalle_solicitud_turnos_pedido[0].id}`;
      let detalle_pedido_cliente:any[] = turnoCliente.detalle_solicitud_turnos_pedido.filter((item: { CardCode: any; })=>item.CardCode === cliente.CardCode);
      turnoCliente.detalle_solicitud_turnos_pedido = detalle_pedido_cliente;
      turnoCliente.dataKey = dataKey;
      cliente.turno =turnoCliente;
    }



    // turno.map((item: { dataKey: string; solicitud: { id: any; clientes: { CardCode: any; }[]; }; id: any; vehiculo: { id: any; }; detalle_solicitud_turnos_pedido: { id: any; }[]; })=>{
    //   item.dataKey = `${item.solicitud.id}-${item.id}-${item.vehiculo.id}-${item.solicitud.clientes[0].CardCode}-${item.detalle_solicitud_turnos_pedido[0].id}`
    // })

    turno.dataKey = `${turno.solicitud.id}-${turno.id}-${turno.vehiculo.id}-${turno.solicitud.clientes[0].CardCode}-${turno.detalle_solicitud_turnos_pedido[0].id}`
    
    this.turno = turno;
    this.infoTurno = turno;
    this.displayModal = false;
    this.loadingCargue = false;

    this.evidencias_cargue = await this.getEvidenciasCargue(turno);
    //this.evidencias_cargue = []
    this.tipoTurno = this.turno.tipo;

    if(this.tipoTurno==='RETIRO'){

      for(let cliente of clientes){
        this.documentos.push({label:`Solicitud de cargue ${cliente.CardName}` , tipo:"solicitud",value:cliente.turno});
        this.documentos.push({label:`Orden de cargue ${cliente.CardName}` , tipo:"orden_cargue",value:cliente.turno});
      }

      this.documentos.push({label:"inspección de cargue", tipo:"inspeccion",value:''});
      this.documentos.push({label:"Tiquete de bascula", tipo:"tiquete_bascula",value:''});

      //this.documentos = [{label:"Solicitud de cargue", tipo:"solicitud",value:''},{label:"Orden de cargue", tipo:"orden_cargue",value:''},{label:"inspección de cargue", tipo:"inspeccion",value:''},{label:"Tiquete de bascula", tipo:"tiquete_bascula",value:''}];
    }

    let remisiones_turno:any[] = [];

    if(!turno.detalle_solicitud_turnos_remisiones){

      //let infoTurno:any = await this.getTurno(this.turnoId);
      //  for(let remision of infoTurno.detalle_solicitud_turnos_remisiones){
      //   this.documentos.push({label:`Remision No. ${remision.docnum}`, tipo:"remision", value:remision.docnum})
      // }
      //////console.log('remisones no')
    }else{
      for(let remision of turno.detalle_solicitud_turnos_remisiones){
        this.documentos.push({label:`Remision No. ${remision.docnum}`, tipo:"remision", value:remision.docnum})
      }
    }

    

  }

  async getEvidenciasCargue(turno:any):Promise<any>{
    let itemsTurno = turno.detalle_solicitud_turnos_pedido;
    let evidenciasItemTurno:any[] = [];
    let entidad = 'pedidos-turno';
    let array_id_items:any[] = [];
    for(let itemTurno of itemsTurno){
      array_id_items.push(itemTurno.id);
       //let filesAtach$ = this.functionsService.loadFiles({id_relacion:itemTurno.id,entidad});
      // let filesAtachByEstadoHistorialTurno = await lastValueFrom(filesAtach$);

      // for(let file of filesAtachByEstadoHistorialTurno){
      //   evidenciasItemTurno.push({cliente:itemTurno.CardName,producto:itemTurno.itemcode+' '+itemTurno.itemname, evidencia:file.nombre, linkS3:file.linkS3 });
      // }
    }

    let filesItemsTurno$ = this.functionsService.loadFilesItemsTurno({array_id_items,entidad})
    let filesItemsTurno = await lastValueFrom(filesItemsTurno$);

    //evidenciasItemTurno = filesItemsTurno;

   //////////console.log('filesItemsTurno',filesItemsTurno);

   for(let file of filesItemsTurno){
      let infoItem:any = itemsTurno.find((item: { id: any; })=>item.id === file.id_relacion)
      //evidenciasItemTurno.push({cliente:infoItem.CardName,producto:infoItem.itemcode+' '+infoItem.itemname, evidencia:file.nombre, linkS3:file.linkS3 });
      file.cliente = infoItem.CardName;
      file.producto = infoItem.itemcode+' '+infoItem.itemname;
      file.evidencia = file.nombre
   }

   evidenciasItemTurno = filesItemsTurno;

    return evidenciasItemTurno;

  }

  async downloadFile(data:any){
    //////////console.log('data',data)
    let fileItemTurno$ = this.functionsService.getFile({data:JSON.stringify(data)})
    let fileItemTurno:any = await lastValueFrom(fileItemTurno$);

    //////////console.log('fileItemTurno',fileItemTurno)
    window.open(fileItemTurno.linkS3);

  }

  generarPDF(tipo:string,valor?:any){

      //////////console.log('tipo',tipo);
      //////////console.log('valor',valor);

      switch(tipo){
        case 'solicitud':
            this.pdfSolicitud(valor);
        break;

        case 'inspeccion':
            this.pdfInspeccion();
        break;

        case 'orden_cargue':
            this.pdfOrden(valor);
        break;

        case 'remision':
          this.pdfRemisionTurno(valor);
        break;

        case 'tiquete_bascula':
          this.pdfTiqueteBasculaTurno();
        break;


      }
  }
 
  
 
  async pdfSolicitud(turno?:any):Promise<void> {
    ////console.log('turno pdfSolicitud',turno)
    //await this.pdfSolicitudCargue.generarPDF(this.infoTurno);
    await this.pdfSolicitudCargue.generarPDF(turno);
  }

  async pdfInspeccion():Promise<void> {
    ////console.log('turno pdfInspeccion',this.turno)
    let inspeccion$ = this.solicitudTurnoService.getInspeccionTurnosByID(this.turno.id);
    let inspeccion = await lastValueFrom(inspeccion$);
    this.infoTurno.detalle_solicitud_turnos_inspeccion = inspeccion.detalle_solicitud_turnos_inspeccion;

    if(this.infoTurno.estado != this.estadosTurno.DESPACHADO){
      this.messageService.add({ severity: 'error', summary: '!Error¡', detail: "Solo puede generar el pdf de inspección de cargue, si el turno se encuentra remisionado" });
    }else if(this.turno.detalle_solicitud_turnos_inspeccion.length == 0){
      this.messageService.add({ severity: 'error', summary: '!Error¡', detail: "El turno seleccionado no posee una inspección de carga realizada." });
     
    }else{
      await this.pdfInspeccionCargue.generarPDF(this.infoTurno);
    }
    
  }

 async pdfOrden(turno?:any):Promise<void> {
  //await this.pdfOrdenCargue.generarPDF(this.infoTurno);
  await this.pdfOrdenCargue.generarPDF(turno);
 }

 async pdfRemisionTurno(remision:any):Promise<void>{
  ////console.log('turno pdfRemisionTurno',this.turno)
  await this.pdfRemision.generarPDF(this.turno,remision);
  //await this.pdfRemision.generarPDF(this.turno.id,remision);
 }

 async pdfTiqueteBasculaTurno():Promise<void>{
   ////console.log('turno pdfTiqueteBasculaTurno',this.turno)
  if(this.infoTurno.estado != this.estadosTurno.PESADOF && this.infoTurno.estado != this.estadosTurno.DESPACHADO && this.infoTurno.estado != this.estadosTurno.ENTREGADO){
      this.messageService.add({ severity: 'error', summary: '!Error¡', detail: "Solo puede generar el tiquete de bascula, si y solo si se haya realizado el pesado final" });
    }else {
      await this.PpfTiqueteBascula.generarPDF(this.infoTurno);
    }

  
 }

 



}
