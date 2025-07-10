import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { ConfirmationService, ConfirmEventType, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { Router } from '@angular/router';

import esLocale from '@fullcalendar/core/locales/es'
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { lastValueFrom, Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { EstadosDealleSolicitud } from '../turnos/estados-turno.enum';
import { PedidosService } from '../../service/pedidos.service';



@Component({
  selector: 'app-costado-buque',
  providers:[ConfirmationService,MessageService],
  templateUrl: './costado-buque.component.html',
  styleUrls: ['./costado-buque.component.scss']
})
export class CostadoBuqueComponent implements OnInit {

 /* coordenadasMouseMove!:any;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (e: any) => {
    
    if (e.target.id === 'canvasFirma') {
      //this.write(e);
     //console.log(e);
      this.coordenadasMouseMove = e;
    }
  }*/

  

  almacenes:any[] = [];
  locaciones:any[] = [];
  localidades: any[] = [];
  localidadSeleccionada:any = [];
  localidadesFiltradas :any[]=[];
  ordenesdecargue!:EventSourceInput; 
  currentEvents: EventApi[] = [];
  eventGuid = 0;
  showTraslados = false;

  calendarOptions!:CalendarOptions

  displayModal:boolean = false;
  loadingCargue:boolean = false;
  completeCargue:boolean = false;
  completeTimer:boolean = false;
  messageComplete:string = "";
  //hoy:any = new Date().toLocaleDateString('en-us', { weekday:"long", day:'numeric', year:"numeric", month:"long"})
  hoy:any ='';
  currentDay!:Date[];

  tablaTurnosLocalidad:any[] = []

  turnosLocalidad:any[]=[];
  turnosLocalidad$!: Observable<any[]>;

  estadosTurno:any = EstadosDealleSolicitud;
  estadosTurno2!:any[];

  documentStyle = getComputedStyle(document.documentElement);
  infousuario!:any;
  boxEstados!:any[];
  permisosModulo!:any;

  trasladosBuque:any[] = [];
  trasladosBuqueLocalidad:any[] = [];


  semanaEnMilisegundos:number = 1000 * 60 * 60 * 24 * 7;  
  
  // primerDia:Date = new Date(new Date().getTime() - (this.semanaEnMilisegundos*2));
  // ultimoDia:Date = new Date(new Date().getTime() + (this.semanaEnMilisegundos*2));

  primerDia:Date = new Date(new Date().setDate(new Date().getDate() -7));
  ultimoDia:Date = new Date(new Date().setDate(new Date().getDate() +7));

  filtroRnagoFechas:Date[] = [this.primerDia,this.ultimoDia];


  columnsTable: number = 10;
  dataKey: string = "DocNum";
  loading: boolean = true;

  globalFilterFields: any[] = ['DocNum',
    'WhsName',
    'Bodega_Destino',
    'U_NF_MOTONAVE',
    'ItemCode',
    'Quantity'
  ];
  selectionMode: string = "multiple";
  selectedItem: any[] = [];
  showBtnPdf: boolean = false;
  showBtnExp: boolean = false;
  showBtnAdmin:boolean = true;

  @ViewChild('filter') filter!: ElementRef;

  filtroLocaciones: any[] = [];
  tiposTurno:any[]  = [{name:'RETIRO', value:'RETIRO'},{name:'ENTREGA', value:'ENTREGA'}]

  dialogDetalleOperacion:boolean = false;
  operacionSeleccionada:any= {
    DocNum:'',
    U_NF_MOTONAVE:'',
    WhsName:'',
    Bodega_Destino:'',
    Quantity:0,
    totalPuertoEntregado:0,
    totalPuertoEnOpercion:0,
    totalPendienteEnOpercion:0
  };

 
  turnosTrasladoSeleccionado:TreeNode[] = [];
  cols:any[] =[
    { field: 'itemCode', header: 'Código/Turno', type:'string' },
    { field: 'itemName', header: 'Item/Placa - conductor - transportadora', type:'string' },
    { field: 'Quantity', header: 'Cant. traslado solictado', type:'number' },
    { field: 'SALDO', header: 'Cant. saldo traslado', type:'number' },
    { field: 'totalTrasladoTransito', header: 'Cant. traslado - transito', type:'number' },
    { field: 'totalPuertoEntregado', header: 'Total entregado - puerto', type:'number' },
    { field: 'totalBasculaEntregado', header: 'Total entregado - bascula', type:'number' },
    { field: 'totalPuertoEnOpercion', header: 'Total en operación', type:'number' },
    { field: 'totalPendienteEnOpercion', header: 'Total pendiente operación', type:'number' }
  ];

  totalTrasladoSolicitado:number=0;
  totalSladoTrasladoSolicitado:number=0;
  totalTrasladoTransito:number=0;
  totalTrasladoEntregado:number=0;
  totalTrasladoEnOperacion:number=0;
  totalTrasladoPendienteOperacion:number=0;


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private almacenesService: AlmacenesService,
    private changeDetector: ChangeDetectorRef,
    private solicitudTurnoService:SolicitudTurnoService,
    public dialogService: DialogService,
    public usuariosService:UsuarioService,
    private router:Router,
    private functionsService:FunctionsService,
    private pedidosService: PedidosService,
    

    ){}


  async ngOnInit(): Promise<void> {
    this.getPermisosModulo();
    
    let estadosTurno2:any[]  = this.solicitudTurnoService.estadosTurno;
    this.estadosTurno2 = estadosTurno2.filter(estado=>estado.name !== EstadosDealleSolicitud.ACTIVADO);
    //// //////////console.log(this.estadosTurno2);

    this.hoy = await this.functionsService.formatDate(new Date(), 'DDDD, dd MMMMM YYYY');
    //this.hoy = new Date()
  }




  getPermisosModulo(){
  
    const modulo = this.router.url;
    
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              ////////////// //////////console.log(permisos);
              if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                this.router.navigate(['/auth/access']);
              }
  
              if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                this.router.navigate(['/auth/access']);
              }
              this.permisosModulo = permisos;
              //this.multiplesClientes = await this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Seleccionar multiples clientes').valor;
              ////////////////////////// //////////console.log(this.multiplesClientes);
  
             this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
             this.showBtnPdf = this.permisosModulo.find((permiso: { accion: string; }) => permiso.accion === 'crearPdf').valor;
             //this.showBtnAdmin = await this.usuariosService.permisoModuloAccion('/portal/turnos','Aprobar turno');
              /*
              this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
              this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
              
              this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
              */
         
              ////////////// //////////console.log(this.condicion_tpt);
              this.infousuario = await this.usuariosService.infoUsuario();
              //// //////////console.log(this.infousuario);
              this.getLocaciones();
              this.getSaldosPedidos();
              
  
            },
            error:(err)=>{
                console.error(err);
            }
        });
        
  }

  getLocaciones(){
    this.almacenesService.getLocaciones()
        .subscribe({
            next:(locaciones)=>{
               //////////console.log(locaciones);
              this.locaciones = locaciones;
              this.getAlmacenes();
            },
            error:(err)=>{
              console.error(err);
            }
        })
  }
  getAlmacenes(){
    //Busca los almacenes de SAP consulta XE
    this.almacenesService.getAlmacenes()
        .subscribe({
            next:(almacenes)=>{
              let almacenesTMP:any[] = [];
             
              for(let index in almacenes){
                let linea:any = almacenes[index];
                linea.code = linea.WhsCode_Code;
                linea.name = linea.WhsName;
                linea.label = `${linea.WhsCode_Code} - ${linea.WhsName} - ${linea.Name_State}`;
                almacenesTMP.push(linea);
             
              }
              this.almacenes = almacenesTMP;
               //////////console.log(this.almacenes);
              this.getLocalidades(this.almacenes);
            },
            error:(err)=>{
                console.error(err);
            }
      
    }); 
  }

  getLocalidades(almacenes:any){
    
    let localidadesAlmacenes: any[] = [];
   
    if(this.infousuario.locaciones.length ==0){
      
      for(let almacen of almacenes){
     
        //if(localidadesAlmacenes.filter(localidadAlmacen => localidadAlmacen.code == almacen.Location).length===0){
        if(localidadesAlmacenes.filter(localidadAlmacen => localidadAlmacen.code == almacen.locacion_codigo2).length===0){
        
          //TODO: Buscar datos del almacen en array de almacenes
         
          if(almacen.CorreoNoti!= null){
            if(this.locaciones.find(locacion=>locacion.code === almacen.locacion_codigo2)){
              let data = {
                code:almacen.locacion_codigo2, 
                name:almacen.locacion2,
                label:almacen.locacion2
              }
              localidadesAlmacenes.push(data);
            }
           
          }
          
        }
      }
     
    }else{
      for(let almacen of this.infousuario.locaciones){
        if(localidadesAlmacenes.filter(localidadAlmacen => localidadAlmacen.code == almacen.code).length===0){
        
          //TODO: Buscar datos del almacen en array de almacenes
         
          
            let data = {
              code:almacen.code, 
              name:almacen.locacion,
              label:almacen.code+' - '+almacen.locacion
            }
            localidadesAlmacenes.push(data);
          
          
        }
      }
    }

    this.localidades = localidadesAlmacenes.sort((a,b)=>{ return a.name <b.name ? -1 : 1});
     //////////console.log(this.localidades);
    

    
    ////// //////////console.log('localidades',this.localidades);
  }

  getSaldosPedidos(){
    this.pedidosService.getSaldosOrdenesCompra()
        .subscribe({
            next:async (saldosPedidos)=>{
                console.log('saldosPedidos',saldosPedidos);
                let tasladosBuque:any[] = await this.functionsService.objectToArray(saldosPedidos);

                this.trasladosBuque = tasladosBuque.filter((traslado: { Tipo_Movimiento: string; })=>traslado.Tipo_Movimiento==='TRASLADO');

                console.log('trasladosBuque',this.trasladosBuque);
            },
            error:(err)=>{
              console.error(err);
            }
        });
}


  cambioFecha(event:any){
   //console.log(this.localidadSeleccionada)
    if(event[1]){
       if(this.localidadSeleccionada.length > 0){
        //this.getTurnosPorLocalidad(this.localidadSeleccionada.code)
       }
    }
  
  }

  async seleccionarLocalidad(localidad:any){
    this.loading = true;
    
    //console.log('localidad seleccionada',localidad)
    let trasladosBuqueLocalidad:any = this.trasladosBuque.filter(traslado=>traslado.WhsCode_Code === localidad.code);
    this.showTraslados = true;
   
    if(trasladosBuqueLocalidad.length>0){
      //Recorrer trasladosBuqueLocalidad y Buscar turnos asociados a la localidad y al numero del trasado e item 
     

      for(let trasladoBuqueLocalidad of trasladosBuqueLocalidad){
         //console.log('trasladoBuqueLocalidad',parseFloat(trasladoBuqueLocalidad.Quantity))
         trasladoBuqueLocalidad.Quantity = parseFloat(trasladoBuqueLocalidad.Quantity)
         trasladoBuqueLocalidad.SALDO = parseFloat(trasladoBuqueLocalidad.SALDO)
          //pedidos por localidad-item
          let totalTrasladoTransito =0;
          let totalPuertoEntregado =0;
          let totalBasculaEntregado =0;
          let totalPuertoEnOpercion =0;
          let totalPendienteEnOpercion =0;
        
          let turnosLocalidadItemTraslado = await this.pedidosService.getTurnosByQuery({
                                                                                        //estado:EstadosDealleSolicitud.ENTREGADO,
                                                                                        detalle_solicitud_turnos_pedido:{
                                                                                                        pedidonum:trasladoBuqueLocalidad.DocNum, 
                                                                                                        linea:trasladoBuqueLocalidad.LineNum, 
                                                                                                        bodega:trasladoBuqueLocalidad.WhsCode_Code
                                                                                                      }
                                                                                      });
          //console.log('turnosLocalidadItemTraslado',turnosLocalidadItemTraslado)
          let turnosLocalidadItemTrasladoEntregado = turnosLocalidadItemTraslado.filter(turno=>turno.estado===EstadosDealleSolicitud.ENTREGADO);
          //console.log('turnosLocalidadItemTrasladoEntregado',turnosLocalidadItemTrasladoEntregado);
          for(let turno of turnosLocalidadItemTrasladoEntregado){
            console.log('turno', turno)
            console.log('peso carga turno', turno.peso_neto-turno.peso_vacio)

            turno.detalle_solicitud_turnos_pedido.map((pedido: {docentry_traslado: number; cantidad: number; linea: any; itemname:any })=>{
              console.log('peso item turno',pedido.itemname, pedido.cantidad)
              console.log('% peso item en carga turno', ((pedido.cantidad*100)/(turno.peso_neto-turno.peso_vacio)))

              if(pedido.linea === trasladoBuqueLocalidad.LineNum && pedido.docentry_traslado ===0){
                totalPuertoEntregado +=pedido.cantidad;
                
              }else{
                totalTrasladoTransito+=pedido.cantidad;
              }
              //totalBasculaEntregado +=((pedido.cantidad*100)/(turno.peso_neto-turno.peso_vacio)*(turno.peso_neto-turno.peso_vacio))/100;
              
            })

            totalBasculaEntregado +=(turno.peso_neto-turno.peso_vacio);
          }
          trasladoBuqueLocalidad.totalBasculaEntregado = totalBasculaEntregado;
          trasladoBuqueLocalidad.totalPuertoEntregado = totalPuertoEntregado;
          let turnosLocalidadItemTrasladoEnOperacion = turnosLocalidadItemTraslado.filter(turno=>turno.estado!=EstadosDealleSolicitud.ENTREGADO);
          //console.log('turnosLocalidadItemTrasladoEnOperacion',turnosLocalidadItemTrasladoEnOperacion)
          for(let turno of turnosLocalidadItemTrasladoEnOperacion){
            turno.detalle_solicitud_turnos_pedido.map((pedido: { cantidad: number; linea: any; })=>{
              if(pedido.linea === trasladoBuqueLocalidad.LineNum){
                totalPuertoEnOpercion +=pedido.cantidad;
              }
            })
          }
          trasladoBuqueLocalidad.totalTrasladoTransito = totalTrasladoTransito;
          trasladoBuqueLocalidad.totalPuertoEnOpercion = totalPuertoEnOpercion;
          trasladoBuqueLocalidad.totalPendienteEnOpercion = trasladoBuqueLocalidad.Quantity-(totalPuertoEnOpercion+totalBasculaEntregado)
          trasladoBuqueLocalidad.turnosLocalidadItemTraslado = turnosLocalidadItemTraslado;

          
      }
      this.trasladosBuqueLocalidad = trasladosBuqueLocalidad;
    }
    this.loading = false;
  }

 

  async filtrarLocalidad(event:any){
    this.localidadesFiltradas = await this.functionsService.filter(event,this.localidades);
  }



  setTimer(){
    if(this.completeCargue){
      this.displayModal = false;
    }
    this.completeTimer = true;
    
  }

 
  

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
 




  async exportExcel() {

    let fields = {
      detalle_solicitudes_turnos_estado: 'Estado Turno',
      locacion_locacion: 'Locacion',
      detalle_solicitudes_turnos_fechacita: 'Fecha Turno',
      detalle_solicitudes_turnos_horacita: 'Hora Turno',
      detalle_solicitudes_turnos_id: 'Turno',
      detalle_solicitudes_turnos_pedidos_pedidonum: 'Pedido',
      cliente_CardCode: 'Código Cliente',
      cliente_CardName: 'Cliente',
      cliente_FederalTaxID: 'Nit',
      detalle_solicitudes_turnos_pedidos_itemcode: 'Código Item',
      detalle_solicitudes_turnos_pedidos_itemname: 'Descripción Item',
      detalle_solicitudes_turnos_pedidos_tipoproducto: 'Tipo Item',
      detalle_solicitudes_turnos_pedidos_cantidad: 'Cantidad',
      detalle_solicitudes_turnos_pedidos_dependencia_label: 'Dependencia',
      detalle_solicitudes_turnos_pedidos_localidad_label: 'Localidad',
      detalle_solicitudes_turnos_pedidos_bodega: 'Bodega',
      transportadoras_nombre: 'Transportadora',
      vehiculos_placa: 'Placa',
      conductores_nombre: 'Conductor',
      conductores_numerocelular: 'Télefono Conductor',
      detalle_solicitudes_turnos_condiciontpt: 'Condición de transporte',
      lugarentrega: 'Lugar Entrega',
      remision: 'Remisión'
    };

    let newData = await this.functionsService.extraerCampos(this.turnosLocalidad, fields);

    await this.functionsService.exportarXLS(newData, 'Solicitudes de cargue');

    /*import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.solicitudesExtendida);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Solicitudes de cargue`);
    });*/
  }

  async detalleOperacion(){
    console.log(this.selectedItem)
    let operacionSeleccionada = this.selectedItem[0];
    this.operacionSeleccionada = this.selectedItem[0];
    let itemsOperacionSeleccionada:any[] = this.trasladosBuqueLocalidad.filter(traslado=>traslado.DocNum ===  operacionSeleccionada.DocNum);

    console.log("itemsOperacionSeleccionada",itemsOperacionSeleccionada)

    let totalTrasladoSolicitado = 0;
    let totalSladoTrasladoSolicitado =0;
    let totalTrasladoTransito =0;
    let totalTrasladoEntregado =0;
    let totalTrasladoEnOperacion = 0;
    let totalTrasladoPendienteOperacion =0;



    this.dialogDetalleOperacion = true;

    let turnos :any[] = [];

    for(let itemTraslado of itemsOperacionSeleccionada){

      totalTrasladoSolicitado+=itemTraslado.Quantity;
      totalSladoTrasladoSolicitado+=itemTraslado.SALDO;
      totalTrasladoTransito+=itemTraslado.totalTrasladoTransito;
      totalTrasladoEntregado+=itemTraslado.totalPuertoEntregado;
      totalTrasladoEnOperacion+=itemTraslado.totalPuertoEnOpercion;
      totalTrasladoPendienteOperacion+=itemTraslado.totalPendienteEnOpercion

        let data = {
                    "data":{
                          itemCode:itemTraslado.ItemCode,
                          itemName:itemTraslado.Dscription,
                          Quantity:itemTraslado.Quantity,
                          SALDO:itemTraslado.SALDO,
                          totalTrasladoTransito:itemTraslado.totalTrasladoTransito,
                          totalPuertoEntregado:itemTraslado.totalPuertoEntregado,
                          totalBasculaEntregado:itemTraslado.totalBasculaEntregado,
                          totalPuertoEnOpercion:itemTraslado.totalPuertoEnOpercion,
                          totalPendienteEnOpercion:itemTraslado.totalPendienteEnOpercion
                    },
                    "children":[]
        }
        if(itemTraslado.turnosLocalidadItemTraslado.length>0){
          let children:any = [];
          for(let turno of itemTraslado.turnosLocalidadItemTraslado){
            let totalPuertoEntregado:number =0;
            let totalBasculaEntregado:number =0;
            let totalPuertoEnOpercion:number =0;
            let totalTrasladoTransito:number =0;

            // let pedidosTurno:any = turno.detalle_solicitud_turnos_pedido.filter((pedido: { linea: any; })=>pedido.linea === itemTraslado.LineNum);
            console.log("turno",turno)

            await turno.detalle_solicitud_turnos_pedido.filter((pedido: { linea: any; })=>pedido.linea === itemTraslado.LineNum).map((item: { cantidad: number; })=>{
              if(turno.estado === EstadosDealleSolicitud.ENTREGADO){
                
                if(turno.detalle_solicitud_turnos_pedido.filter((item:{docentry_traslado:number;})=>item.docentry_traslado===0).length>0){
                  totalPuertoEntregado+=item.cantidad;
                  
                }else{
                  totalTrasladoTransito +=item.cantidad;
                }
                //totalBasculaEntregado +=((item.cantidad*100)/(turno.peso_neto-turno.peso_vacio)*(turno.peso_neto-turno.peso_vacio))/100;
                totalBasculaEntregado +=(turno.peso_neto-turno.peso_vacio);
              }else{
                totalPuertoEnOpercion+=item.cantidad;
              }
              
            })
            children.push(
                      {
                        "data":{
                                itemCode:turno.id,
                                itemName:`${turno.vehiculo.placa} - ${turno.conductor.nombre} - ${turno.transportadora.nombre}`,
                                Quantity:0,
                                SALDO:0,
                                totalTrasladoTransito,
                                totalPuertoEntregado,
                                totalBasculaEntregado,
                                totalPuertoEnOpercion,
                                totalPendienteEnOpercion:0
                            }
                      }
                    );
          }
          data.children = children;
        }
        turnos.push(data);
    }

    this.totalTrasladoSolicitado=totalTrasladoSolicitado;
    this.totalSladoTrasladoSolicitado=totalSladoTrasladoSolicitado;
    this.totalTrasladoTransito=totalTrasladoTransito;
    this.totalTrasladoEntregado=totalTrasladoEntregado;
    this.totalTrasladoEnOperacion=totalTrasladoEnOperacion;
    this.totalTrasladoPendienteOperacion=totalTrasladoPendienteOperacion
    
    console.log("turnos",turnos)

    this.turnosTrasladoSeleccionado = turnos as TreeNode[];

  }

  confirmarTraslado(){


    if(this.operacionSeleccionada.Exceso ==="NO"){
      let operacionSeleccionada = this.selectedItem[0];
    this.operacionSeleccionada = this.selectedItem[0];
    let itemsOperacionSeleccionada:any[] = this.trasladosBuqueLocalidad.filter(traslado=>traslado.DocNum ===  operacionSeleccionada.DocNum);
    //console.log("itemsOperacionSeleccionada",itemsOperacionSeleccionada);
    let infoTrasladoSAP:any = {
              fecha:new Date(),
              //turnoid:infoTurno.id,
              base_docnum:operacionSeleccionada.DocNum,
              base_docentry:operacionSeleccionada.DocEntry,
              base_objectType:operacionSeleccionada.ObjType,
              municipioentrega:operacionSeleccionada.turnosLocalidadItemTraslado.length>0?operacionSeleccionada.turnosLocalidadItemTraslado[0].municipioentrega:'',
              lugarentrega:operacionSeleccionada.turnosLocalidadItemTraslado.length>0?operacionSeleccionada.turnosLocalidadItemTraslado[0].lugarentrega:'',
              CardCode:operacionSeleccionada.CardCode,
              CardName:operacionSeleccionada.CardName,
              codigo_vendedor:operacionSeleccionada.Codigo_Vendedor,
              manifiesto:0,
              tipo_operacion:operacionSeleccionada.Tipo_Movimiento,
              lineas_items:[],
              detalle_remision:[],
              
              infoTurno:{
                transportadora:{
                  nombre:"",
                },
                vehiculo:{
                  placa:""
                },
                conductor:{
                  cedula:"",
                  nombre:""
                },
                peso_vacio:0,
                peso_neto:0,
                condiciontpt:"TRANSP",
                turno_base:0,
                tipo:"ENTREGA"
              }
    }

    let detalle_remision:any[] = [];
    
    let lineas_items:any[] = [];
    for(let item of itemsOperacionSeleccionada){
      console.log("itemOperacionSeleccionada",item);
      let lotes_item:any[] = [];
        let cantidada_a_trasladar =0;
        for(let turnoItem of item.turnosLocalidadItemTraslado){
            if(turnoItem.estado === EstadosDealleSolicitud.ENTREGADO){
              for(let detalleTurno of turnoItem.detalle_solicitud_turnos_pedido){
                if(detalleTurno.linea === item.LineNum && detalleTurno.docentry_traslado===0){
                    cantidada_a_trasladar+= detalleTurno.cantidad;
                   // console.log('detalleTurno',detalleTurno);
                    infoTrasladoSAP.lineas_items.push(detalleTurno.id)
                   
                    for(let itemLote of detalleTurno.detalle_lotes_item_turno){
                        if(lotes_item.filter(lote_item=>lote_item.lote === itemLote.lote && lote_item.itemcode === item.ItemCode).length===0){
                          lotes_item.push({lote:itemLote.lote, cantidad_cargue_lote:itemLote.cantidad_cargue_lote, itemcode:item.ItemCode})
                        }else{
                          let indexLote = lotes_item.findIndex(lote_item=>lote_item.lote === itemLote.lote && lote_item.itemcode === item.ItemCode);
                          lotes_item[indexLote].cantidad_cargue_lote += itemLote.cantidad_cargue_lote;
                        }
                    }
                }
              }
            }
           
        }

        detalle_remision.push({
                  id:item.DocEntry,
                  linea:item.LineNum,
                  itemcode:item.ItemCode,
                  itemname:item.Dscription,
                  bodega:item.WhsCode_Code,
                  cantidad:cantidada_a_trasladar,
                  cantidad_sacos:1,
                  lotes:lotes_item,//item.turnosLocalidadItemTraslado.length>0?[{lote:'', cantidad_cargue_lote:cantidada_a_trasladar,itemcode:item.ItemCode}]:[],
                  vicepresidencia:item.VICEPRESIDENCIA,
                  dependencia:item.DEPENDENCIA,
                  localidad:item.LOCALIDAD,
                  precio_lista:item.ListaPrecio,
                  precio_vendedor:item.PrecioVendedor,
                  precio_gerente:item.PrecioGerente,
                  categoria_item:item.Categoria_Item,
                  subcategoria_item:item.Subcategoria_Item,
                  almacen_fpp:item.AlmacenFPP,
                  bodega_destino:item.Bodega_Destino,
                  ubicacion:'',
                  vendedor:item.SlpName,
                  
                  ivacode:item.IvaCode,
                  precio_unitario:item.Precio_Unitario,
        })
    }

    infoTrasladoSAP.detalle_remision = detalle_remision.filter(detalle=>detalle.cantidad>0);
    //infoTrasladoSAP.lineas_items = lineas_items;


    if(infoTrasladoSAP.detalle_remision.filter((detalle: { cantidad: number; })=>detalle.cantidad>0).length>0){
      this.confirmationService.confirm({
        message: `Esta seguro de realizar el traslado de los items cuyo cantidad a trasladar (Total entregado - puerto) sea mayor a cero ?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
         
          console.log('infoTrasladoSAP',infoTrasladoSAP);
          this.displayModal = true;
          this.solicitudTurnoService.trasladoAduanaTransito(infoTrasladoSAP)
              .subscribe({
                  next:(result)=>{
                    console.log('resuslt',result)

                    if(result.status===200){
                      this.messageService.add({severity:'success', summary:'!Ok¡', detail:`Se ha realizado satisfactoriamente el traslado ${result.resultDocumentSAP.DocNum} a la bodega de transtio ${operacionSeleccionada.Nombre_Bod_Destino}`});
                      this.dialogDetalleOperacion = false;
                      this.seleccionarLocalidad(this.localidadSeleccionada);

                    }else{
                      this.messageService.add({severity:'error', summary:'Error', detail:`Ocurio un error al momento de realizar el traslado a la bodega de transtio ${operacionSeleccionada.Nombre_Bod_Destino}`});
                    }

                    this.displayModal = false;
                  },
                  error:(err)=>{
                      console.error(err);
                      this.displayModal = false;
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
    }else{
      this.messageService.add({severity:'error', summary: '!Error¡', detail: 'La cantidad a trasladar para cada uno de los items debe ser mayor a cero' });
    }
    }else{
      this.messageService.add({severity:'error', summary:'Error', detail:`La operación seleccionada no puede ser trasladada a la bodega de transito por ser un exceso de material.`});
    }

    
  }


    
}
