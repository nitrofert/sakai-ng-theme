import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import { DynamicDrawComponent } from 'src/app/layout/shared/dynamic-draw/dynamic-draw.component';
import { PdfInspeccionCargue } from '../../solicitudescargue/config-pdf/inspeccion-cargue';

@Component({
  selector: 'app-inspeccion-despacho',
  providers:[ConfirmationService,MessageService], 
  templateUrl: './inspeccion-despacho.component.html',
  styleUrls: ['./inspeccion-despacho.component.scss'],
 
})
export class InspeccionDespachoComponent implements  OnInit ,  OnChanges {

  @Input() turno!:any;
  @Input() estado!:string;
  @Input() pedidos!:any;

  @Output() onChangeData: EventEmitter<any> = new EventEmitter();

  hoy:Date = new Date();
  stateOptions: any[] = [{label: 'Conforme', value: true}, {label: 'No Conforme', value: false}];
  

  estadosTurno:any = EstadosDealleSolicitud;

 
  displayModal:boolean = false;
  loadingCargue:boolean = false;
  completeCargue:boolean = false;
  completeTimer:boolean = false;
  messageComplete:string = "";
  loading:boolean = false;

  permisosModulo!:any[];
rolesUsuario:any[] = [];

dataTableChekVehiculo:any[] = [{item:0,label:'PAGO DE CARGUE',estado:true,observacion:''},
                               {item:1,label:'SIN OLORES',estado:true,observacion:''},
                               {item:2,label:'ESTADO CARROCERIA',estado:true,observacion:''},
                               {item:3,label:'CARPA SIN FILTRACIONES',estado:true,observacion:''},
                               {item:4,label:'AUSENCIA DE PLAGAS VIVAS O MUERTAS',estado:true,observacion:''},
                               {item:5,label:'AUSENCIA DE HUMEDAD O GRASA',estado:true,observacion:''},
                               {item:6,label:'LIMPIEZA Y BUE ESTADO DE PLANCHA',estado:true,observacion:''},
                               {item:7,label:'PLASTICO O PLIPROPILENO',estado:true,observacion:''}];


dataTableChekCarga:any[] = [{item:1,label:'REGISTRO ICA',estado:true,observacion:''},
                               {item:2,label:'LOTE DE FABRICACIÓN',estado:true,observacion:''},
                               {item:3,label:'PESO PRODUCTO',estado:true,observacion:''},
                               {item:4,label:'PRODUCTO LIMPIO',estado:true,observacion:''},
                               {item:5,label:'EMPAQUES SIN ROTURAS',estado:true,observacion:''},
                               {item:6,label:'PRODUCTO NO ESTA DURO/COMPACTADO',estado:true,observacion:''}];                               

estado_vehiculo:boolean = true;

cantidad_unidades:number = 0;
conforme_cantidades:boolean = false;
conforme_calidad:boolean = false;
observaciones:string = '';
cedula_conductor:number = 0;


hora_llegada!:Date;
hora_inicio_cargue!:Date;
hora_fin_cargue!:Date;
tiempo_de_cargue:string ="";



 



dataTableProductosTurno:any = {
  header:[{"cliente":{"label":"Cliente","type":"text","sizeCol":"6rem","align":"center","editable":false},
           "pedido":{"label":"No. Pedido","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
           "itemcode":{"label":"Código producto","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
           "itemname":{"label":"Producto","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
           "lote":{"label":"Lote","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
           "cantidad":{"label":"Cantidad (TON)","type":"number","sizeCol":"6rem","align":"center","editable":false,"sum":true}, 
           "sacos":{"label":"Cantidad (Sacos)","type":"number","sizeCol":"6rem","align":"center","editable":false,"sum":true}, 
           "toneldasM":{"label":"Toneladas Metricas","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
           "cubicacion":{"label":"Cubicación","type":"text","sizeCol":"6rem","align":"center","editable":false},
           "remision":{"label":"No. Remisión","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
         }],
  data:[],
  colsSum:[]
};

filesInspeccion:any[] = [];

historial:any;
inspeccion:any

  constructor( private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private ordenesCargueService: OrdenesCargueService, 
              private solicitudTurnoService:SolicitudTurnoService,
              private pedidosService: PedidosService,
              public ref: DynamicDialogRef,
              private router:Router,
              public usuariosService:UsuarioService, 
              private vehiculosService:VehiculosService,
              private conductoresService:ConductoresService,
              private transportadorasService:TransportadorasService,
              public dialogService: DialogService,
              public config: DynamicDialogConfig,
              private almacenesService: AlmacenesService,
              public functionsService:FunctionsService,
              private novedadesService:NovedadesService,
              private ciudadesService:CiudadesService,
              private pdfInspeccionCargue:PdfInspeccionCargue) { }

  async ngOnInit() {

    //this.displayModal = true;
    //this.loadingCargue = true;
    //this.condicion_tpt="RETIRA";
   ////console.log('ngOnInit inspeccion');
   //////console.log('turno estado inspeccion', this.estado);
    this.getPermisosModulo();
    this.setFormInspeccion();

  
  }

  ngOnChanges(changes: SimpleChanges){
    //////////////////console.log('changes',changes['rangoFechas'].currentValue)

    ////console.log('ngOnChanges inspeccion')
   
    //this.estado = changes['estado'].currentValue;
    //this.turno = changes['turno'].currentValue;
    //this.pedidos = changes['pedidos'].currentValue;
    ////console.log('turno estado inspeccion',this.estado);
    ////console.log('turno inspeccion',this.turno);
    ////console.log('turno pedidos',this.pedidos);
    this.setFormInspeccion();
   
    
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
             
            

             //this.getTurno(this.turnoId);
            },
            error:(err)=>{
                console.error(err);
            }
        });
        
  }

  async setFormInspeccion(){

    ///console.log('Pedidos items',this.pedidos)

    console.log('Turno inspeccion',this.turno)
    
    let fecha_accion!:any;
    let hora_accion!:any;

    let historial$ = this.solicitudTurnoService.getHistorialTurnosByID(this.turno.id);
    this.historial = await lastValueFrom(historial$);
 
    // if(this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.ARRIBO).length > 0){
    //    fecha_accion = this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.ARRIBO)[0].fecha_accion;
    //    hora_accion = this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.ARRIBO)[0].hora_accion;
    //    this.hora_llegada = await this.functionsService.setTImeToDate(new Date(fecha_accion),hora_accion);
    // }

    if(this.historial.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.ARRIBO).length > 0){
       fecha_accion = this.historial.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.ARRIBO)[0].fecha_accion;
       hora_accion = this.historial.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.ARRIBO)[0].hora_accion;
       this.hora_llegada = await this.functionsService.setTImeToDate(new Date(fecha_accion),hora_accion);
    }

 
    // if(this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGANDO).length > 0){
    //  fecha_accion = this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGANDO)[0].fecha_accion;
    //  hora_accion = this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGANDO)[0].hora_accion;
    //  this.hora_inicio_cargue = await this.functionsService.setTImeToDate(new Date(fecha_accion),hora_accion);
    // }

     if(this.historial.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGANDO).length > 0){
      fecha_accion = this.historial.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGANDO)[0].fecha_accion;
      hora_accion = this.historial.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGANDO)[0].hora_accion;
      this.hora_inicio_cargue = await this.functionsService.setTImeToDate(new Date(fecha_accion),hora_accion);
    }
 
 
    // if(this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGADO).length > 0){
    //  fecha_accion = this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGADO)[0].fecha_accion;
    //  hora_accion = this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGADO)[0].hora_accion;
    //  this.hora_fin_cargue = await this.functionsService.setTImeToDate(new Date(fecha_accion),hora_accion);
    // }

    if(this.historial.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGADO).length > 0){
     fecha_accion = this.historial.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGADO)[0].fecha_accion;
     hora_accion = this.historial.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.CARGADO)[0].hora_accion;
     this.hora_fin_cargue = await this.functionsService.setTImeToDate(new Date(fecha_accion),hora_accion);
    }

    let inspeccion$ = this.solicitudTurnoService.getInspeccionTurnosByID(this.turno.id);
    this.inspeccion = await lastValueFrom(inspeccion$);
 
    if(this.inspeccion.detalle_solicitud_turnos_inspeccion.length > 0){
       let inspeccion = this.inspeccion.detalle_solicitud_turnos_inspeccion[0];
       //console.log(inspeccion);
       this.estado_vehiculo = inspeccion.estado_vehiculo;
       this.cantidad_unidades = inspeccion.cantidad_unidades;
       this.conforme_cantidades = inspeccion.conforme_cantidades;
       this.conforme_calidad = inspeccion.conforme_calidad;
       this.observaciones = inspeccion.observaciones;
       this.cedula_conductor = inspeccion.cedula_conductor;
 
 
    
       this.dataTableChekVehiculo[0].estado = inspeccion.pago_cargue;
       this.dataTableChekVehiculo[0].observacion = inspeccion.obs_pago_cargue;
       this.dataTableChekVehiculo[1].estado = inspeccion.olores;
       this.dataTableChekVehiculo[1].observacion = inspeccion.obs_olores;
       this.dataTableChekVehiculo[2].estado = inspeccion.carroceria;
       this.dataTableChekVehiculo[2].observacion = inspeccion.obs_carroceria;
       this.dataTableChekVehiculo[3].estado = inspeccion.carpa_filtraciones;
       this.dataTableChekVehiculo[3].observacion = inspeccion.obs_carpa_filtraciones;
       this.dataTableChekVehiculo[4].estado = inspeccion.plagas;
       this.dataTableChekVehiculo[4].observacion = inspeccion.obs_plagas;
       this.dataTableChekVehiculo[5].estado = inspeccion.humedad_grasa;
       this.dataTableChekVehiculo[5].observacion = inspeccion.obs_humedad_grasa;
       this.dataTableChekVehiculo[6].estado = inspeccion.estado_plancha;
       this.dataTableChekVehiculo[6].observacion = inspeccion.obs_estado_plancha;
       this.dataTableChekVehiculo[7].estado = inspeccion.plastico_polipropileno;
       this.dataTableChekVehiculo[7].observacion = inspeccion.obs_plastico_polipropileno;
 
       this.dataTableChekCarga[0].estado = inspeccion.registro_ica;
       this.dataTableChekVehiculo[0].observacion = inspeccion.obs_registro_ica;
       this.dataTableChekCarga[1].estado = inspeccion.lote_fabricacion;
       this.dataTableChekVehiculo[1].observacion = inspeccion.obs_lote_fabricacion;
       this.dataTableChekCarga[2].estado = inspeccion.peso_producto;
       this.dataTableChekVehiculo[2].observacion = inspeccion.obs_peso_producto;
       this.dataTableChekCarga[3].estado = inspeccion.producto_limpio;
       this.dataTableChekVehiculo[3].observacion = inspeccion.obs_producto_limpio;
       this.dataTableChekCarga[4].estado = inspeccion.empaques_rotura;
       this.dataTableChekVehiculo[4].observacion = inspeccion.obs_empaques_rotura;
       this.dataTableChekCarga[5].estado = inspeccion.producto_compactado;
       this.dataTableChekVehiculo[5].observacion = inspeccion.obs_producto_compactado;

       
        await this.getFilesInspeccion();
 
    }

    
   
 
    this.cambioValor()
 
    /*this.dataTableProductosTurno.data = await this.setDataTableProductosTurno(this.turno.detalle_solicitud_turnos_pedido);
    let colsSum = await this.configSumTabla(this.dataTableProductosTurno.header,this.dataTableProductosTurno.data);
    this.dataTableProductosTurno.colsSum = colsSum;
    */
    let dataTableProductosTurno:any = {
      header: this.dataTableProductosTurno.header ,
      data:  await this.setDataTableProductosTurno(this.turno.detalle_solicitud_turnos_pedido)
    };

    let colsSum = await this.configSumTabla(dataTableProductosTurno.header,dataTableProductosTurno.data);
    this.dataTableProductosTurno = dataTableProductosTurno;
    this.dataTableProductosTurno.colsSum = colsSum;

    ////console.log('this.dataTableProductosTurno',this.dataTableProductosTurno);    
  }
 

  async getTurno(id: number){
    
    //let orden = await this.ordenesCargueService.getOrdenesByID(id);
    this.solicitudTurnoService.getTurnosByID(id)
        .subscribe({
              next:async (turno)=>{
                 ////console.log('turno',turno);
                  
                  
              },
              error:(err)=>{
                console.error(err);
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});

              }
        });


  }


  cambioValor(){
    ////console.log('estado_vehiculo',this.estado_vehiculo)
    ////console.log('dataTableChekVehiculo',this.dataTableChekVehiculo);
    ////console.log('dataTableChekCarga',this.dataTableChekCarga);
    let dataInspenccion:any = {
      fecha_inspeccion: new Date(),
      dataTableChekVehiculo:this.dataTableChekVehiculo,
      dataTableChekCarga:this.dataTableChekCarga,
      cantidad_unidades:this.cantidad_unidades,
      conforme_cantidades:this.conforme_cantidades,
      conforme_calidad:this.conforme_calidad,
      observaciones:this.observaciones,
      cedula_conductor:this.cedula_conductor,
      estado_vehiculo:this.estado_vehiculo

    }
    this.onChangeData.emit(dataInspenccion);
  }
 
  async setDataTableProductosTurno(detalle_pedidos:any): Promise<any> {

    let data:any[] = [];

    for(let linea_pedido of detalle_pedidos){
      data.push({
        cliente:linea_pedido.CardName,
        pedido:linea_pedido.pedidonum,
        itemcode:linea_pedido.itemcode,
        itemname:linea_pedido.itemname,
        lote:linea_pedido.lote_produccion,
        cantidad:linea_pedido.cantidad,
        sacos:linea_pedido.cantidad_sacos,
        toneldasM:linea_pedido.toneladas_metircas,
        cubicacion:linea_pedido.cubicacion,
        remision:linea_pedido.remision,

      })
    }

    return data;

  }

 async getFilesInspeccion():Promise<void>{

      let id_relacion = this.inspeccion.detalle_solicitud_turnos_inspeccion[0].id;
       let proceso = 'firma-conductor';
       let entidad = 'inspeccion-turno';
    
       let filesAtach$ = this.functionsService.filesToBase64({id_relacion,proceso,entidad});
       this.filesInspeccion = await lastValueFrom(filesAtach$);
 }
 

  cargarFirma(){
    //console.log('this.turno.detalle_solicitud_turnos_inspeccion',this.turno.detalle_solicitud_turnos_inspeccion);
    const ref = this.dialogService.open(DynamicDrawComponent, {
      data: {
          id_relacion: this.inspeccion.detalle_solicitud_turnos_inspeccion[0].id,
          entidad: 'inspeccion-turno',
          proceso: 'firma-conductor',
          filename: `firma-inspeccion-turno-${this.turno.id}-conductor-${this.turno.conductor.cedula}.png`,
          accion:this.filesInspeccion.length==0?'create':'update' ,
      },
      header: this.filesInspeccion.length==0?'Cargar firma':'Actualizar firma' ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });

    ref.onClose.subscribe(async () => {
      await this.getFilesInspeccion();
    });
  }

  async imprimirInspeccion(){

    this.turno.dataKey = `${this.turno.solicitud.id}-${this.turno.id}-${this.turno.vehiculo.placa}`
    await this.pdfInspeccionCargue.generarPDF(this.turno)
  }

  async configSumTabla(headersTable:any[],dataTable:any[]):Promise<any>{
    let colsSum:any[] = [];
    ////////////////////////////// //////////////console.log(dataTable);
    ////////////////////////////////// //////////////console.log(Object.keys(headersTable[0]));
    let objString:string = "";
    let colsSumSwitch:boolean = false;
    for(let key of Object.keys(headersTable[0])){
      objString+=`"${key}":`
      if(headersTable[0][key].sum){
        ////////////////////////////////// //////////////console.log(key);
        colsSumSwitch = true;
        let total = await this.functionsService.sumColArray(dataTable,JSON.parse(`[{"${key}":0}]`));
        ////////////////////////////////// //////////////console.log(total[0][key]);
        objString+=`${parseFloat(total[0][key])},`
      }else{
        objString+=`"",`
      }
    }
    objString = `{${objString.substring(0,objString.length-1)}}`;
    ////////////////////////////////// //////////////console.log(objString);
    if(colsSumSwitch){
      colsSum.push(JSON.parse(objString));
    }
    

    ////////////////////////////////// //////////////console.log(colsSum);

    return colsSum;

  }


}
