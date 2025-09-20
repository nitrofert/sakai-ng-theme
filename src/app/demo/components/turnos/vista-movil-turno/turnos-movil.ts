import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { FormTurnoComponent } from '../form-turno/form-turno.component';
import { EstadosDealleSolicitud } from '../estados-turno.enum';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { Router } from '@angular/router';

import esLocale from '@fullcalendar/core/locales/es'
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { lastValueFrom, Observable } from 'rxjs';
import { Table } from 'primeng/table';
import {   PdfSolicitudCargue } from '../../solicitudescargue/config-pdf/solicitud-cargue';
import { PdfInspeccionCargue } from '../../solicitudescargue/config-pdf/inspeccion-cargue';
import { DocumentosTurnoComponent } from '../documentos-turno/documentos-turno.component';
import { ListaHistorialTurnoComponent } from '../../solicitudescargue/lista-historial-turno/lista-historial-turno.component';
import { PedidosService } from 'src/app/demo/service/pedidos.service';
import { FileUpload } from 'primeng/fileupload';


@Component({
  selector: 'app-turnos-movil',
  providers:[ConfirmationService,MessageService],
  templateUrl: './turnos-movil.html',
  styleUrls: ['./turnos-movil.scss']
})
export class TurnosMovilComponent implements OnInit, AfterViewInit {

    primerDia:Date = new Date(new Date().setDate(new Date().getDate() -5));
    ultimoDia:Date = new Date(new Date().setDate(new Date().getDate() +3));

    filtroRnagoFechas:Date[] = [this.primerDia,this.ultimoDia];

    almacenes:any[] = [];
    locaciones:any[] = [];
    localidades: any[] = [];
    localidadSeleccionada:any;
    localidadesFiltradas :any[]=[];

    infousuario!:any;
    permisosModulo!:any;

    displayModal:boolean = false;
    loadingCargue:boolean = false;
    completeCargue:boolean = false;
    completeTimer:boolean = false;
    messageComplete:string = "";

    turnosLocalidad:any[] = [];
    turnoSeleccionado:any;
    turnosFiltrados :any[]=[];

    fechacargue!:Date;
    horacargue!:Date;

    hoy:Date = new Date();
    ayer:Date = new Date((new Date()).setDate(this.hoy.getDate()-1));

    updateModulo:boolean = false;
    grabarCambios:boolean = false;
    estado:string ='';
    

    turno:any;

    activeStateTabs:boolean[] = [];
    pedidos_turno:any[] = [];

    tipoTurno:string = 'RETIRO';

    lotesItems:any[] = [];
    lotesItemLine:any[] = [];
    loadingTableLotesItem:boolean = false;
    lotesItemLineSelected:any[] = [];

    @ViewChild('filterTable') filterTable!: ElementRef;
    @ViewChild('totalSolicitado') totalSolicitado!: ElementRef;
    @ViewChild('totalTonItem') totalTonItem!: ElementRef;
    @ViewChild('totalSacosItem') totalSacosItem!: ElementRef;

    estadosTurno:any = EstadosDealleSolicitud;

    lotesFiltrados:any[] = [];

    arrayBtnTurnos!: MenuItem[];
    //   btnAprobar: MenuItem =   {label: 'Aprobar', icon: 'pi pi-check', command: () => { this.aprobarTurno();}};
    btnPausar: MenuItem =   {label: 'Pausar', icon: 'pi pi-pause', command: () => { this.pausarTurno();}};
    btnActivar: MenuItem =   {label: 'Activar', icon: 'pi pi-play', command: () => { this.activarTurno();}};
    btnCancel: MenuItem =   {label: 'Cancelar', icon: 'pi pi-times', command: () => { this.cancelarTurno();}};
    //   btnIngreso: MenuItem =   {label: 'Ingresar', icon: 'pi pi-sign-in', command: () => { this.ingresarTurno();}};
    //  btnPeso: MenuItem =   {label: 'Pesar', icon: 'pi pi-compass', command: () => { this.pesarTurno();}};
    btnCargue: MenuItem =   {label: 'Cargar', icon: 'pi pi-upload', command: () => { this.inicioCargueTurno();}};
    btnFinCargue: MenuItem =   {label: 'Fin cargue', icon: 'pi pi-box', command: () => { this.finalizarCargueTurno();}};
    //btnPesoFinal: MenuItem =   {label: 'Pesaje final', icon: 'pi pi-compass', command: () => { this.pesarTurno2();}};
    //btnDespachar: MenuItem =   {label: 'Remisionar', icon: 'pi pi-sign-out', command: () => { this.despacharTurno();}};
    //btnSolRevInv: MenuItem =   {label: 'Solicitud producción', icon: 'pi pi-search', command: () => { this.solicitarInventarioTurno();}};
    //btnValidInv: MenuItem =   {label: 'Validación producción', icon: 'pi pi-verified', command: () => { this.validarInventarioTurno();}};
    
    //btnUpdateInfo: MenuItem =   {label: 'Actualizar informaciíon', icon: 'pi pi-pencil', command: () => { this.updateInfoTurno();}};
    
    //btnCambioBodega: MenuItem =   {label: 'Cambio Locacion/bodega', icon: 'pi pi-sync', command: () => { this.cambioBodega();}};
    
    //btnDescargue: MenuItem =   {label: 'Descargar', icon: 'pi pi-download', command: () => { this.inicioDescargueTurno();}};
    //btnFinDescargue: MenuItem =   {label: 'Fin Descargue', icon: 'pi pi-box', command: () => { this.finalizarDescargueTurno();}};
    //btnEntregar: MenuItem =   {label: 'Remisionar', icon: 'pi pi-sign-out', command: () => { this.entregaTurno();}};

    accion:string = "";
    formEstadoTurno:boolean = false;
    tituloEstado:string = "";
    novedades:any[] = [];
    novedadesSeleccionadas:any[] = [];
    novedad:boolean = false;
    
    
    fechaaccion:Date = new Date();
    horaaccion:Date = new Date();

    comentario:string = "";

    cambioEstado:boolean = false;
    file!: any ;
    fileTmp:any;
    uploadedFiles: any[] = [];
    filesToUpload: any[] = [];

    tablapedidosInspeccion!:any;
    inspeccionTurno!:any;

    uploadActivo:boolean = true;

    formGestionLotesItem:boolean = false;

    dataFormGestionLotesItem:any;

    evidenciasCargue:any[] = [];

    formEvidenciasCargueTurno:boolean = false;

    dataFormCargueEvidencias:any = {
    cliente:'',
    pedido:'',
    item:'',
    files:[]
    }

       
  @ViewChild('uploaderFiles',{ static:false}) uploaderFiles!:ElementRef;


  dataUpload:any = {
    entidad:'',
    id_relacion:'',
    proceso:'',
    evidencias:[]
  }

  loading:boolean = false;


    constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private almacenesService: AlmacenesService,
    private changeDetector: ChangeDetectorRef,
    private solicitudTurnoService:SolicitudTurnoService,
    public dialogService: DialogService,
     public ref: DynamicDialogRef,
    public usuariosService:UsuarioService,
    private router:Router,
    private functionsService:FunctionsService,
    private pdfSolicitudCargue:PdfSolicitudCargue,
    private pdfInspeccionCargue:PdfInspeccionCargue,
    private pedidosService: PedidosService,
    
    

    ){}

    async ngOnInit(): Promise<void> {
        this.getPermisosModulo();
    }

    ngAfterViewInit(): void {
        //////console.log(this.turno);
        this.render();
        
    }

    private render() {
        const uploadEl = this.uploaderFiles.nativeElement;
        this.filesToUpload = uploadEl;

        //this.filesToUpload.url = 
    }


    getPermisosModulo(){
  
        const modulo = this.router.url;
        console.log('modulo',modulo)
        
        this.usuariosService.getPermisosModulo(modulo)
            .subscribe({
                next: async (permisos)=>{
                ////////////// //////////////////console.log(permisos);
                if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                    this.router.navigate(['/auth/access']);
                }
    
                if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                    this.router.navigate(['/auth/access']);
                }
                this.permisosModulo = permisos;

                this.updateModulo = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
                        
    
                //  this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
                //  this.showBtnPdf = this.permisosModulo.find((permiso: { accion: string; }) => permiso.accion === 'crearPdf').valor;
                        
                
                this.infousuario = await this.usuariosService.infoUsuario();
                
                this.getLocaciones();
                
    
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
                //////console.log('locaciones',locaciones);
                this.locaciones = locaciones;
                //this.getAlmacenes();
                
                this.getLocalidades2()
                },
                error:(err)=>{
                console.error(err);
                }
            })
    }
    getLocalidades2(){
    
        let localidadesAlmacenes: any[] = [];
   
        if(this.infousuario.locaciones.length ==0){
            for(let locacion of this.locaciones){
                if(localidadesAlmacenes.filter(localidadAlmacen => localidadAlmacen.code == locacion.code).length===0){
                //TODO: Buscar datos del almacen en array de almacenes
                    let data = {
                    code:locacion.code, 
                    name:locacion.locacion,
                    label:locacion.code+' - '+locacion.locacion
                    }
                    localidadesAlmacenes.push(data);
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
        
                    //console.log(this.localidadSeleccionada)
    }

    cambioFecha(event:any){
   
        if(event[1]){
        if(this.localidadSeleccionada){
            this.getTurnosPorLocalidad(this.localidadSeleccionada.code)
        }
        }
    }

    async filtrarLocalidad(event:any){
        this.localidadesFiltradas = await this.functionsService.filter(event,this.localidades);
    }

    seleccionarLocalidad(localidad:any){
    
        this.getTurnosPorLocalidad(localidad.code)
    
    }

    async getTurnosPorLocalidad(localidad:string){
        //////console.log('getTurnosPorLocalidad')
        this.displayModal = true;
        this.loadingCargue = true;
        this.completeCargue=false;
        this.completeTimer = false;

       
        

        this.solicitudTurnoService.getTurnosPorLocalidad(localidad,this.filtroRnagoFechas[0],this.filtroRnagoFechas[1])
            .subscribe({
                next:async (turnosLocalidad)=>{

                    //console.log('turnosLocalidad',turnosLocalidad);
                    this.turnosLocalidad = await turnosLocalidad.map((turno: { code: any; id: any; name: string; vehiculo: { placa: any; }; conductor: { nombre: any; }; fechacita: any; label: string; estado:string })=>{
                        turno.code=turno.id, 
                        turno.name = `${turno.id} - ${turno.vehiculo.placa} - ${turno.conductor.nombre} - ${turno.fechacita} - ${turno.estado}`;
                        turno.label = `${turno.id} - ${turno.vehiculo.placa} - ${turno.conductor.nombre} - ${turno.fechacita} - ${turno.estado}`;

                        return turno
                    
                    });

                    if(this.turnosLocalidad.length===0){
                        this.messageService.add({severity:'warn', summary: 'Confirmación', detail:  `La locación seleccionada no tiene turnos programados para el rango de fechas seleccionado.`});
                    }else{
                        this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el cargue de los turnos de la localidad.`});
                    }

                    this.displayModal = false;
                    this.loadingCargue = false;
                    this.turnoSeleccionado = undefined

                    // this.completeCargue = true;
                    // this.messageComplete = `Se completo correctamente el porceso de cargue de los turnos de la localidad.`;
                    
                },
                error:(err)=>{
                    this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                    console.error(err);
                    this.displayModal = false;
                    this.loadingCargue = false;
                }
        });

     
    }

    async filtrarTurnos(event:any){
        //console.log('turnosLocalidad',this.turnosLocalidad);
         if(this.turnosLocalidad.length===0){
            this.messageService.add({severity:'warn', summary: 'Confirmación', detail:  `La locación seleccionada no tiene turnos programados para el rango de fechas seleccionado.`});
        }else{
            this.turnosFiltrados = await this.functionsService.filter(event,this.turnosLocalidad);
        }
        
    }

    async seleccionarTurno(turno:any){
        console.log('turnoSeleccionado',JSON.parse(JSON.stringify(turno)))
        
        this.turno = turno;
        
        this.fechacargue = new Date(turno.fechacita);
        let hora = 60 * 60000;
        let fechacargue = new Date (new Date(turno.fechacita).getTime()+(hora*5))
        this.fechacargue = fechacargue;
        let horacargue = new Date(new Date(fechacargue).setHours(parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[2])));
        this.horacargue = horacargue;
        this.estado = turno.estado;
        this.tipoTurno = turno.tipo
        let historial = await this.getHistorialTurno(turno.id)

        //console.log('historal',historial)
        turno.detalle_solicitud_turnos_historial = historial.detalle_solicitud_turnos_historial

        let pedidos_turno = await this.functionsService.resolveObservable(this.solicitudTurnoService.getPedidosTurno(turno.id)) 
        console.log('pedidos_turno',pedidos_turno.filter((pedido: { estado: string; })=>pedido.estado==='A'))

        turno.detalle_solicitud_turnos_pedido = await this.functionsService.clonObject(pedidos_turno.filter((pedido: { estado: string; })=>pedido.estado==='A')) ;

        console.log('turno',turno)

        this.pedidos_turno = await this.calcularDisponibilidadPedido(turno.detalle_solicitud_turnos_pedido);


        this.pedidos_turno.map((pedido: {
            detalle_lotes_item_turno: any;
            cantidad: any;
            cantidadOld: any;
            lineaUpdate: { update: boolean; create: boolean; }; CardName: any; pedidonum: any; itemcode: any; itemname: any; headerTab:any; activeStateTabs:any ; lotesItem:any[]
})=>{
            pedido.headerTab = `${pedido.CardName} - ${pedido.pedidonum} - ${pedido.itemcode} - ${pedido.itemname}`
            pedido.activeStateTabs = false;
            pedido.lineaUpdate = {update:false, create:false};
            pedido.cantidadOld =pedido.cantidad;
            pedido.lotesItem =[];
            if(pedido.detalle_lotes_item_turno.length>0){
                pedido.detalle_lotes_item_turno.map((lote: { lineaUpdate: { update: boolean; create: boolean; }; })=>{
                    lote.lineaUpdate = {update:false, create:false};
                })
            }
            return pedido;
        })

        //console.log('this.pedidos_turno',this.pedidos_turno)
        this.configSplitButton(this.estado,this.permisosModulo);
        
    }

  
    async seleccionarFechaCita():Promise<void>{}

    async cambioHoraCita():Promise<void>{}

    async historialTurno(){
        let idTurno = this.turnoSeleccionado.id;
        let infoHistorialTurno= await this.getHistorialTurno(idTurno)

        const ref = this.dialogService.open(ListaHistorialTurnoComponent, {
            data: {
                id: (idTurno),
                historial: infoHistorialTurno.detalle_solicitud_turnos_historial
            },
            header: `Historial Orden de cargue: ${idTurno}` ,
            width: '70%',
            height:'auto',
            contentStyle: {"overflow": "auto"},
            maximizable:true, 
        });

        ref.onClose.subscribe(() => {
            //this.getTurnosPorLocalidad(this.localidadSeleccionada.code)
            //this.getCalendar();
            //////////////////// ////////////// //////////////////////console.log(("Refresh calendar");
        });


    }

    async getHistorialTurno(id:any):Promise<any>{

        let historialTurno$ = this.solicitudTurnoService.getHistorialTurnosByID(id);
        let infoHistorialTurno = await lastValueFrom(historialTurno$);
        return infoHistorialTurno
    }

    async calcularDisponibilidadPedido(pedidosTurno:any):Promise<any[]>{
    
    for(let pedido of pedidosTurno){
      //////////////////////////// ////////////// //////////////////////console.log(pedido);
      let cantidadComprometida = 0;
      cantidadComprometida = await this.getCantidadComprometidaItemPedido(pedido.pedidonum,pedido.itemcode,pedido.bodega, pedido.id, pedido.linenum);
      cantidadComprometida += this.tipoTurno==='RETIRO'?await this.getCantidadComprometidaItemPedidoOtrasBodegas(pedido.pedidonum,pedido.itemcode,pedido.bodega, pedido.id,pedido.linenum):0;
      //////////////////////// ////////////// //////////////////////console.log('cantidadComprometida',cantidadComprometida , new Date());
      pedido.comprometida= cantidadComprometida;
      pedido.cantidadbodega = await this.getInventarioItenBodega(pedido.itemcode,pedido.bodega);
      //////////////////////// ////////////// //////////////////////console.log('pedido.cantidadbodega',pedido.cantidadbodega , new Date());
     ////////////console.log('this.tipoTurno',this.tipoTurno);
      pedido.disponible = this.tipoTurno==='RETIRO'?((pedido.cantidadbodega-cantidadComprometida)<0?0:(pedido.cantidadbodega-cantidadComprometida)):((pedido.cantidad_pedido-cantidadComprometida)<0?0:pedido.cantidad_pedido-cantidadComprometida);
      
      
    }

    return pedidosTurno
  }

  async getCantidadComprometidaItemPedido(pedido:any, itemcode:string, bodega:string, idPedido:number,linenum:number):Promise<number>{
    
    const cantidadComprometida$ = this.pedidosService.getCantidadesComprometidasItemBodega(itemcode,bodega, idPedido,linenum);
    const cantidadComprometida = await lastValueFrom(cantidadComprometida$);
  
    return cantidadComprometida;
  
  
  }

  async getCantidadComprometidaItemPedidoOtrasBodegas(pedido:any, itemcode:string, bodega:string, idPedido:number,linea:number):Promise<number>{
    
    const cantidadComprometida$ = this.pedidosService.getCantidadesComprometidasItemPedidoOtrasBodega(pedido,itemcode,bodega, idPedido,linea);
    const cantidadComprometida = await lastValueFrom(cantidadComprometida$);
  
    return cantidadComprometida;
  
  
  }

  async getInventarioItenBodega(itemcode:string, bodega:string): Promise<any>{

    
    const inventariosItemBodega$ = this.pedidosService.getInventarioItenBodega2(itemcode, bodega);
    const inventariosItemBodega = await lastValueFrom(inventariosItemBodega$);
    
    ////////////////////////////// ////////////// //////////////////////console.log(inventarioItemBodega);
    const arrayInventariosItemBodega = await this.functionsService.objectToArray(inventariosItemBodega);
    ////////console.log('arrayInventariosItemBodega',arrayInventariosItemBodega);

    const inventarioItemBodega:any[] = arrayInventariosItemBodega.filter((inventario: { ItemCode: string; 
                                                                                  WhsCode: string; 
                                                                                }) => inventario.ItemCode == itemcode && 
                                                                                      inventario.WhsCode == bodega);
    //////////////////////////// ////////////// //////////////////////console.log(inventarioItemBodega);                                                                                  

    let cantidadInventarioItenBodega:number = 0;
    
     inventarioItemBodega.forEach(function(a){cantidadInventarioItenBodega += parseFloat(a.OnHand);});

    //////////////////////////// ////////////// //////////////////////console.log(cantidadInventarioItenBodega);    
  
    return cantidadInventarioItenBodega;
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filterTable.nativeElement.value = '';
  }


  filtrarLotes(event:any,pedido:any){
    console.log('pedido',pedido)
  }

  seleccionarLotes(lotesSeleccionados:any,pedido:any){

  }

  async gestionarLote(pedido:any){

    console.log(pedido)

    if(pedido.maneja_lote==='Y'){
       
        //consultar lotes del item y bodega
        let inventarioLotesItemBodega = await this.functionsService.resolveObservable(this.pedidosService.getInventarioLotesItemBodega(pedido.itemcode,pedido.bodega))
        //console.log('inventarioLotesItemBodega',inventarioLotesItemBodega)
        let lotesItemBodega:any[] = [];
        let total_lotes=0;
        let total_sacos= 0;
        let lotesItem:any[] = pedido.detalle_lotes_item_turno;
        //Cargar array de lotes item bodega ws sap
        for(let item in inventarioLotesItemBodega){
        let comprometido = await this.comprometidoItemLoteInTurno(pedido.id,pedido.itemcode,inventarioLotesItemBodega[item].Lote, pedido.bodega)
            comprometido = comprometido+ await this.comprometidoOtrosTurnos(this.turno.locacion,pedido.bodega,pedido.id,inventarioLotesItemBodega[item].Lote,pedido.itemcode)
            let cantidad_cargue_lote =0
            let cantidad_sacos_lote =0;

            //Validar si el lote item y linea tiene asignado un lote
            console.log('pedido.id',pedido.id);
            console.log('inventarioLotesItemBodega[item].Lote',inventarioLotesItemBodega[item].Lote);

            if(lotesItem.length>0){
                let existeLote = lotesItem.find(itemLote=>itemLote.id === pedido.id && itemLote.lote ===inventarioLotesItemBodega[item].Lote);
                if(existeLote){
                    cantidad_cargue_lote = existeLote.cantidad_cargue_lote;
                    cantidad_sacos_lote = existeLote.cantidad_sacos_lote;
                    total_lotes = total_lotes+cantidad_cargue_lote;
                    total_sacos = total_sacos+cantidad_sacos_lote
                }
            }


            lotesItemBodega.push({
                    
                    lote:inventarioLotesItemBodega[item].Lote, 
                    fecha_vencimiento:inventarioLotesItemBodega[item].Fechavencimiento, 
                    cantidad_bodega_lote:inventarioLotesItemBodega[item].Stock,
                    estado:'A', 
                    cantidad_comprometida:comprometido, 
                    saldo:inventarioLotesItemBodega[item].Stock-comprometido,
                    cantidad_cargue_lote,
                    cantidad_sacos_lote
                })
        }



        
        this.dataFormGestionLotesItem = {
            linea_id: pedido.id,
            header: `Gestionar lotes item ${pedido.itemname} - ${pedido.pedidonum}-${pedido.linea} - ${pedido.bodega}`,
            bodega: pedido.bodega,
            cantidad_solicitada:pedido.cantidad,
            total_lotes,
            total_sacos,

            lotes:lotesItemBodega
        }
        console.log('this.dataFormGestionLotesItem',this.dataFormGestionLotesItem);
        this.formGestionLotesItem = true;

    }else{
        this.messageService.add({severity:'warn', summary: 'Informaciónn', detail:  `El item ${pedido.itemname} no maneja lote, verifique y o comuniquese con el area de producción.`});
    }
  }

    async comprometidoItemLoteInTurno(idLinea:any, itemcode:any, lote:any,bodega:any, pedidosTurno?:any):Promise<any>{
    let cantidadComprometidaItemLote = 0;

    //obtener lineas de items diferentes al id linea seleccioanda e igual al item seleccionado y bodega
    let itemsTurno = !pedidosTurno?this.pedidos_turno.filter(item=>item.id != idLinea && item.itemcode === itemcode && item.bodega == bodega):pedidosTurno.filter((item: { id: any; itemcode: any; bodega:any })=>item.id != idLinea && item.itemcode === itemcode && item.bodega == bodega);
    //////////console.log('itemsTurno',itemsTurno);
    //recorrer los items del turno diferentes a la linea seleccionada, 
    for(let itemTurno of itemsTurno){
      //obtener los lotes que sean igual al item seleccionado y lote seleccioando
      let lotesItem:any = itemTurno.detalle_lotes_item_turno.filter((item: { lote: any; }) => item.lote === lote)
      //////////console.log('lotesItem',lotesItem);
      for(let loteItem of lotesItem){
        cantidadComprometidaItemLote = cantidadComprometidaItemLote+parseFloat(loteItem.cantidad_cargue_lote)
      }
    }

    return cantidadComprometidaItemLote;
  }

  async comprometidoOtrosTurnos(locacion:any, bodega:any, idLinea:any,lote:any, itemcode:any ):Promise<any>{
    let cantidadComprometidaItemLote = 0;

    //Buscar turnos abiertos de la locacion y bodega

    

    let ruote:string = 'turnos'
    let where:any = {"locacion":{"equal":locacion}, "estado":{"in":[
                                                                      `${this.estadosTurno.AUTORIZADO}`,
                                                                      `${this.estadosTurno.ARRIBO}`,
                                                                      `${this.estadosTurno.PESADO}`,
                                                                      `${this.estadosTurno.CARGANDO}`,
                                                                      `${this.estadosTurno.CARGADO}`,
                                                                      `${this.estadosTurno.PESADOF}`,
                                                                      

                                                                    ]}}
    // let relations:any = {
    //             detalle_solicitud_turnos_pedido:{
    //                 detalle_lotes_item_turno:true
    //             },
    //             vehiculo:true,
    //             conductor:true,
    //             transportadora:true
    //         }

      //let relations:any = ['detalle_solicitud_turnos_pedido','detalle_solicitud_turnos_pedido.detalle_lotes_item_turno','vehiculo','conductor','transportadora']                                                                      
      let relations:any = ['detalle_solicitud_turnos_pedido','detalle_solicitud_turnos_pedido.detalle_lotes_item_turno']                                                                      

     let turnos = await this.pedidosService.getAsyncQuery2(ruote,where,relations);
     //////////console.log('turnos',turnos)

     //Filtrar turnos cuya bodega en items sea igual a al abodega de la linea seleccionada
     let turnosBodegaLote:any = turnos.filter(turno=> turno.detalle_solicitud_turnos_pedido.filter((item: { bodega: string; detalle_lotes_item_turno:any })=>item.bodega === bodega && item.detalle_lotes_item_turno.filter((itemLote: { lote: any; })=>itemLote.lote == lote).length >0).length >0 )

     //////////console.log('turnosBodegaLote',bodega, lote,turnosBodegaLote)
    //Recorrer los turnos y obtener las cantidades comprometidas asociadas a la bodega y el lote                                                          
     for(let turnoBodegaLote of turnosBodegaLote){
       
        cantidadComprometidaItemLote = cantidadComprometidaItemLote+ await this.comprometidoItemLoteInTurno(idLinea,itemcode,lote,turnoBodegaLote.detalle_solicitud_turnos_pedido);
     }

     //////////console.log('cantidadComprometidaItemLote',cantidadComprometidaItemLote)
    return cantidadComprometidaItemLote;
  }

//   async filtrarLotesSAP(lotesItem:any[],lotesItemBodegaSap:any[]):Promise<any[]>{
//     let lotesItemBodega:any[] = [];

//     for(let loteSap of lotesItemBodegaSap){
//       if(lotesItem.filter(loteItem=>loteItem.lote === loteSap.lote).length===0){
//         lotesItemBodega.push(loteSap)
//       }
//     }

//     return lotesItemBodega;
//   }

  cambioValorCampoTablaLotesItem(event:any,idLinea:any,valorCampo:any,arrayLinea:any,campo:string){
      // ////////////console.log('event',event);
      // ////////////console.log('idLinea',idLinea);
      // ////////////console.log('valorCampo',valorCampo);
      // ////////////console.log('arrayLinea',arrayLinea);
      // ////////////console.log('campo',campo);
      // ////////////console.log('idLinea',idLinea);

      let index = this.lotesItemLine.findIndex(item=>item.id === idLinea);
      //this.lotesItemLine[index].lineaUpdate.update = true;
      if(valorCampo===""){
        valorCampo =0;
        this.lotesItemLine[index][campo]=0;
      }

      if(campo==='cantidad_cargue_lote'){
       ////////////console.log('valorCampo',valorCampo);
       ////////////console.log('parseFloat(arrayLinea[campo])',parseFloat(arrayLinea['cantidad_bodega_lote']));
        if(valorCampo> parseFloat(arrayLinea['cantidad_bodega_lote'])){
          this.messageService.add({severity:'error', summary:'Error', detail:'La cantidad a cagar del lote supera la cantidad existente en la bodega'});
          valorCampo =0;
          this.lotesItemLine[index][campo]=0;
  
        }else if(valorCampo> parseFloat(this.totalSolicitado.nativeElement.value)){
          this.messageService.add({severity:'error', summary:'Error', detail:'La cantidad a cagar del lote supera la cantidad solictada del item en el turno'});
          valorCampo =0;
          this.lotesItemLine[index][campo]=0;
        }
      }

      


      this.calcularTotalesItemLotes();
      
  }

  pressEnterTablaLotesItem(event:any,idLinea:any,valorCampo:any,arrayLinea:any,campo:string){
      // ////////////console.log('event',event);
      // ////////////console.log('idLinea',idLinea);
      // ////////////console.log('valorCampo',valorCampo);
      // ////////////console.log('arrayLinea',arrayLinea);
      // ////////////console.log('campo',campo);

      let index = this.lotesItemLine.findIndex(item=>item.id === idLinea);
      //this.lotesItemLine[index].lineaUpdate.update = true;

      if (event.key === "Enter") {
      
        // ////////////////////////////////console.log('ENTER PRESS');
        // if(event.target.value ===''){
        //   event.target.value =0;
        // }
        if(valorCampo===""){
          valorCampo =0;
          this.lotesItemLine[index][campo]=0;
        }
        if(campo==='cantidad_cargue_lote'){
          if(valorCampo> parseFloat(arrayLinea['cantidad_bodega_lote'])){
            this.messageService.add({severity:'error', summary:'Error', detail:'La cantidad a cagar del lote supera la cantidad existente en la bodega'});
            valorCampo =0;
            this.lotesItemLine[index][campo]=0;
    
          }else if(valorCampo> parseFloat(this.totalSolicitado.nativeElement.value)){
            this.messageService.add({severity:'error', summary:'Error', detail:'La cantidad a cagar del lote supera la cantidad solictada del item en el turno'});
            valorCampo =0;
            this.lotesItemLine[index][campo]=0;
    
          }
        }
        
        this.calcularTotalesItemLotes();
      }
  }

  calcularTotalesItemLotes(){
    let totalTon =0;
    let totalSacos = 0;

    for(let loteItemLine of this.lotesItemLine){
      totalTon+=parseFloat(loteItemLine.cantidad_cargue_lote);
      totalSacos+=parseFloat(loteItemLine.cantidad_sacos_lote);
    }

    ////////////console.log('totalTon',totalTon);
    this.totalTonItem.nativeElement.value = totalTon;
    ////////////console.log('totalSacos',totalSacos);
    this.totalSacosItem.nativeElement.value = totalSacos
  }
  
  
  borrarLote(){
    
    let index = this.lotesItemLine.findIndex(item=>item.lote === this.lotesItemLineSelected[0].lote);
    this.lotesItemLine.splice(index,1)
    this.calcularTotalesItemLotes();
    this.lotesItemLineSelected = [];
  }



  async pausarTurno(){
    if(await this.validarFormulario()){
      this.accion = 'pausar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Pausar turno "+this.turno.id;
      this.novedad = true;
    }
  }
  async activarTurno(){
    if(await this.validarFormulario()){
      this.accion = 'activar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Activar turno "+this.turno.id;
      this.novedad = false;
    }
  }
  async cancelarTurno(){
    
      this.accion = 'cancelar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Cancelar turno "+this.turno.id;
      this.novedad = true;
    
  }

  async inicioCargueTurno(){
    if(await this.validarFormulario()){
      this.accion = 'cargar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Cargar turno "+this.turno.id;
      this.novedad = false;
      //this.clonarTablaPedidos();
    }
  }


  async finalizarCargueTurno(){
    if(await this.validarFormulario()){
      this.accion = 'finalizar cargue de'
      this.formEstadoTurno = true;
      this.tituloEstado = "Finalizar cargue turno "+this.turno.id;
      this.novedad = false;
      
      //this.clonarTablaPedidos();
    }
  }

  async validarFormulario():Promise<boolean> {
    let valido:boolean = false;

    console.log('this.pedidos_turno',this.pedidos_turno)

    if(this.estado === this.estadosTurno.CARGANDO && this.pedidos_turno.filter(pedido=>pedido.maneja_lote==='Y' && pedido.detalle_lotes_item_turno.length ===0).length>0){
        this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe asignar lotes de producccion para cada item de producto-destino.'});
    }else if(this.estado === this.estadosTurno.CARGANDO && this.pedidos_turno.filter(pedido=>pedido.maneja_lote==='N' && !pedido.cantidad_sacos ).length>0){
        this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe asignar la cantidad de sacos a cargar para todas las lineas de pedido del turno, y esta debe ser mayor a cero.'});
    }else if(this.estado === this.estadosTurno.CARGANDO && this.pedidos_turno.filter(pedido=>!pedido.cubicacion.length).length>0){
        this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe ingresar la cubicacion para las lineas de items.'});
    }else if(this.estado === this.estadosTurno.CARGANDO && await this.validarEvidenciasItemPedido()=== false){
           this.messageService.add({severity:'error', summary: '!Error¡', detail: `No se han adjuntado evidencias del cargue`});
    }else{
        valido = await this.validarCantidadesCarga();
    }

    this.fechaaccion= new Date();
    this.horaaccion = new Date();
    this.comentario = "";


    return valido;
  }

   async validarEvidenciasItemPedido(severity:string='error', summary:string='!Error¡'):Promise<boolean> {
    let valido = true;
    let totalEvidencias =0;
    for(let item of this.pedidos_turno){
     // ////////////////console.log(item);
      if(!item.itemcode.startsWith('SF')){
        let id_relacion = item.id;
        let proceso = 'cargado';
        let entidad = 'pedidos-turno';
        let filesAtach$ = this.functionsService.loadFiles({id_relacion,proceso,entidad});
        let filesAtachByEstadoHistorialTurno = await lastValueFrom(filesAtach$);

        // if(filesAtachByEstadoHistorialTurno.length === 0){
        //   valido = false;
        //   this.messageService.add({severity, summary, detail: `No se han adjuntado evidencias del cargue del item ${item.itemcode} - ${item.itemname} del pedido ${item.docnum}`});
        // }
        totalEvidencias = totalEvidencias+ filesAtachByEstadoHistorialTurno.length
      }
      
    }
    if(totalEvidencias===0) valido = false;

    return valido;
  }

    async validarCantidadesCarga():Promise<boolean>{
    let result = true;

    for(let lineaPedido of this.pedidos_turno){
      if(lineaPedido.cantidad > lineaPedido.cantidad_pedido){
        this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar (${lineaPedido.cantidad} TON) es mayor a la cantidad del pedido (${lineaPedido.cantidad_pedido} TON)`});
        result = false
      }
      if(lineaPedido.cantidad > lineaPedido.disponible){
        this.messageService.add({severity:'warn', summary: '!Advertencia¡', detail:  `La cantidad a cargar (${lineaPedido.cantidad} TON) es mayor a la cantidad disponible (${lineaPedido.disponible} TON)`});
      }

    }
    
    return result;
  }

   async configSplitButton(estadoActual:string, permisosModulo:any){
    console.log(estadoActual);

    this.arrayBtnTurnos = [];

    switch(estadoActual){
      

      case this.estadosTurno.PAUSADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Activar turno').valor){
          this.arrayBtnTurnos.push(this.btnActivar);
        }

      

        //  if(this.infoHistorialTurno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; }) => historial.estado == EstadosDealleSolicitud.AUTORIZADO).length >0 &&
        //    this.infoHistorialTurno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; }) => historial.estado == EstadosDealleSolicitud.ARRIBO ).length == 0){
        //     if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Activar turno APNI').valor){
        //       this.arrayBtnTurnos.push(this.btnActivar);
        //     }
        // }
      break;

     

     

      case this.estadosTurno.PESADO:
        console.log('pesado')
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Inicio cargue').valor){
            console.log('pesado')
          if(this.tipoTurno==='RETIRO'){
            console.log('pesado')
            this.arrayBtnTurnos.push(this.btnCargue);
          }else{
            //this.arrayBtnTurnos.push(this.btnDescargue);
          }
          
        }

        // if(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.PLANIFICADOR) && this.updateModulo){
        //   this.arrayBtnTurnos.push(this.btnUpdateInfo);
        // }
      break;

      case this.estadosTurno.CARGANDO:
         console.log('cargando')
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Fin cargue').valor){
            console.log('cargando')
          this.arrayBtnTurnos.push(this.btnFinCargue);

        }

        // if(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.PLANIFICADOR) && this.updateModulo){
        //   this.arrayBtnTurnos.push(this.btnUpdateInfo);
        // }
      break;

     
      
     

    }

    if(estadoActual!= this.estadosTurno.PAUSADO && estadoActual!= this.estadosTurno.CANCELADO && estadoActual!= this.estadosTurno.SOLINVENTARIO){
      if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Pausar turno').valor){
        this.arrayBtnTurnos.push(this.btnPausar);
      }
      
    }

    if(estadoActual!=this.estadosTurno.CANCELADO && estadoActual!= this.estadosTurno.SOLINVENTARIO){
      if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Cancelar turno').valor){
        this.arrayBtnTurnos.push(this.btnCancel);
      }
    }



  }

  
    async clearUploader(uploaderFiles: FileUpload){
        ////////////console.log(uploaderFiles,this.filesToUpload);
        uploaderFiles.onClear;
    }

    
    removeFile($event:any,uploaderFiles: FileUpload){
        //////////////console.log('remove',$event,)
        this.filesToUpload = [];
        let currentFiles = uploaderFiles.files.filter((file: any)=>file != $event.file);
        //uploaderFiles.files = currentFiles;
        this.loadFiles(currentFiles);
    }

    loadFiles(uploaderFiles: any ){
        //////////////console.log('filesToUpload',uploaderFiles, this.uploadedFiles);
        let currentFiles = uploaderFiles;
        for(let currentFile of currentFiles){
        //////////////console.log('currentFile',currentFile);
        //const [file] = currentFile;
        this.filesToUpload.push({
            file:currentFile,
            //name:file.name
        })
        }

        //////////////console.log('this.filesToUpload',this.filesToUpload);
    }

    
  setInsppeccion($event:any){
    //////////////console.log($event);

    this.inspeccionTurno = {
      fecha_inspeccion: new Date($event.fecha_inspeccion),
      estado_vehiculo:$event.estado_vehiculo,
      pago_cargue:$event.dataTableChekVehiculo[0].estado,
      obs_pago_cargue:$event.dataTableChekVehiculo[0].observacion,
      olores:$event.dataTableChekVehiculo[1].estado,
      obs_olores:$event.dataTableChekVehiculo[1].observacion,
      carroceria:$event.dataTableChekVehiculo[2].estado,
      obs_carroceria:$event.dataTableChekVehiculo[2].observacion,
      carpa_filtraciones:$event.dataTableChekVehiculo[3].estado,
      obs_carpa_filtraciones:$event.dataTableChekVehiculo[3].observacion,
      plagas:$event.dataTableChekVehiculo[4].estado,
      obs_plagas:$event.dataTableChekVehiculo[4].observacion,
      humedad_grasa:$event.dataTableChekVehiculo[5].estado,
      obs_humedad_grasa:$event.dataTableChekVehiculo[5].observacion,
      estado_plancha:$event.dataTableChekVehiculo[6].estado,
      obs_estado_plancha:$event.dataTableChekVehiculo[6].observacion,
      plastico_polipropileno:$event.dataTableChekVehiculo[7].estado,
      obs_plastico_polipropileno:$event.dataTableChekVehiculo[7].observacion,

      registro_ica:$event.dataTableChekCarga[0].estado,
      obs_registro_ica:$event.dataTableChekCarga[0].observacion,
      lote_fabricacion:$event.dataTableChekCarga[1].estado,
      obs_lote_fabricacion:$event.dataTableChekCarga[1].observacion,
      peso_producto:$event.dataTableChekCarga[2].estado,
      obs_peso_producto:$event.dataTableChekCarga[2].observacion,
      producto_limpio:$event.dataTableChekCarga[3].estado,
      obs_producto_limpio:$event.dataTableChekCarga[3].observacion,
      empaques_rotura:$event.dataTableChekCarga[4].estado,
      obs_empaques_rotura:$event.dataTableChekCarga[4].observacion,
      producto_compactado:$event.dataTableChekCarga[5].estado,
      obs_obs_producto_compactado:$event.dataTableChekCarga[5].observacion,
      cantidad_unidades:$event.cantidad_unidades,
      conforme_cantidades:$event.conforme_cantidades,
      conforme_calidad:$event.conforme_calidad,
      observaciones:$event.observaciones,
      cedula_conductor:$event.cedula_conductor


    }

    ////////////console.log(this.inspeccionTurno);
  }

  
 async cambiarEstadoTurno(){

    //////////console.log(this.remisionesPorCliente);

    //////////console.log(this.remisionesPorCliente.filter(cliente => (cliente.remisiones.filter((remision: { manifiesto: number; })=>remision.manifiesto===0).length) >0).length);

    this.cambioEstado = true;

    if((this.accion == 'pausar' ||  this.accion == 'cancelar' ) && ( this.novedadesSeleccionadas.length==0)){
      this.messageService.add({severity:'error', summary: '!Error¡', detail: `Para ${this.accion} el turno, debe seleccionar una novedad.` });
      this.cambioEstado = false;
    }else if(this.accion != 'cancelar' && (this.estado === this.estadosTurno.CARGADO /*|| this.estado === this.estadosTurno.DESPACHADO*/) && this.inspeccionTurno && this.inspeccionTurno.cantidad_unidades === 0){
      this.messageService.add({severity:'error', summary: '!Error¡', detail: `La cantidad de unidades a recibir en la inspección debe ser mayor a cero.` });
      this.cambioEstado = false;
    } else if(await this.validarFechaEstado()){
      this.cambioEstado = false;
    }else {
      this.confirmationService.confirm({
        message: 'Esta seguro de '+this.accion+' la orden de cargue No. '+this.turno.id+'?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        
        accept: async () => {
  
           let data:any = await this.configDataTurno();
            ////////console.log(data);
            
              
           //this.updateTurno(data);
            
            
            
  
        },
        reject: (type: any) => {
            this.cambioEstado = false;
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

   async validarFechaEstado():Promise<boolean>{

    //////////console.log('estados turno',this.estadosTurno,);

    let error = false;
    let turno_actual = this.turno.estado;
    //let historial_turno:any[] = await this.functionsService.sortArrayObject(JSON.parse(JSON.stringify(this.infoHistorialTurno.detalle_solicitud_turnos_historial)),'id','ASC')
    
    //////console.log('this.infoHistorialTurno.detalle_solicitud_turnos_historial',this.infoHistorialTurno.detalle_solicitud_turnos_historial)
    let historial_turno:any[] = await this.functionsService.sortArrayObject(JSON.parse(JSON.stringify(this.turno.detalle_solicitud_turnos_historial)),'id','ASC')

    ////////console.log('historial_turno',historial_turno);

    if(historial_turno.length > 0){
      let ultimoEstado = historial_turno[historial_turno.length-1];
      ////////console.log('ultimoEstado',ultimoEstado);
      let fecha_accion_ultimo_estado = new Date(`${ultimoEstado.fecha_accion} ${ultimoEstado.hora_accion}`);
      

      //fecha_accion_ultimo_estado.setHours(0,0,0);

      //fecha_accion_ultimo_estado.setHours(ultimoEstado.hora_accion.split(':')[0],ultimoEstado.hora_accion.split(':')[1],ultimoEstado.hora_accion.split(':')[2]);

      //////////console.log('fecha_accion_ultimo_estado',fecha_accion_ultimo_estado);

      let fechaaccion = new Date(this.fechaaccion);

      fechaaccion.setHours(0,0,0)

      let horaaccion = new Date(this.horaaccion);//.toISOString().split('T')[1];

      fechaaccion.setHours(horaaccion.getHours(),horaaccion.getMinutes(),horaaccion.getSeconds());

      ////////console.log('fechaaccion',fechaaccion);
      ////////console.log('fecha_accion_ultimo_estado',fecha_accion_ultimo_estado);

      if(fechaaccion < fecha_accion_ultimo_estado){
        this.messageService.add({severity:'error', summary: '!Error¡', detail: `La fecha del nuevo estado ${fechaaccion.toISOString().split('T')[0]} ${fechaaccion.toTimeString().split(' ')[0]} no puede ser menor a fecha de accion del ultimo estado "${ultimoEstado.estado}" ${fecha_accion_ultimo_estado.toISOString().split('T')[0]} ${fecha_accion_ultimo_estado.toTimeString().split(' ')[0]}.` });
        error = true;
      }
      
 
    }

    return error;
  }

  
  async configDataTurno():Promise<any> {
    
   //////////console.log('turno para validar estado',this.turno.condiciontpt);
    //console.log('config turno')
    let nuevoEstado = "";
    let mensaje ="";

        switch(this.accion){
        //   case 'aprobar':
        //     nuevoEstado = this.estadosTurno.AUTORIZADO;
        //     mensaje = `fue aprobado`;
        //   break;

        //   case 'solicitud produccion':
        //     nuevoEstado = this.estadosTurno.SOLINVENTARIO;
        //     mensaje = `fue solicitado validacion a producción`;
        //   break;

        //   case 'validar revision inventario':
        //     nuevoEstado = this.estadosTurno.VALINVENTARIO;
        //     mensaje = `fue validado el inventario`;
        //   break;

            case 'pausar':
            nuevoEstado = this.estadosTurno.PAUSADO;
            mensaje = `ha sido pausado debido a ${this.novedadesSeleccionadas.length>1?'las sguientes novedades':'la siguiente novedad'}: ${this.novedadesSeleccionadas.map((novedad)=>{return novedad.label }).toString()}`;
            break;

            case 'activar':
            nuevoEstado =  this.estadosTurno.ACTIVADO;
            mensaje = `fue activado`;
            break;
        
        //   case 'ingresar':
        //     nuevoEstado = this.estadosTurno.ARRIBO;
        //     mensaje = `ingreso a las instalaciones: ${this.localidad}`;
        //   break;

        //   case 'pesar':
        //     nuevoEstado = this.estadosTurno.PESADO;
        //     mensaje = `ha sido pesado. ${this.tipoTurno==='RETIRO'?'El peso vacio':'El peso neto'} del  vehiculo ${this.vehiculoSeleccionado.placa} fue de  ${this.tipoTurno==='RETIRO'?this.peso_bruto:this.peso_neto} TON`;
        //   break;

            case 'cargar':
            nuevoEstado = this.estadosTurno.CARGANDO;
            mensaje = `ha iniciado el cargue`;
            break;

        //   case 'descargar':
        //     nuevoEstado = this.estadosTurno.DESCARGANDO;
        //     mensaje = `ha iniciado el descargue`;
        //   break;

            case 'finalizar cargue de':
            nuevoEstado = this.estadosTurno.CARGADO;
            mensaje = `ha sido cargado`;
            break;

        //   case 'finalizar descargue de':
        //     nuevoEstado = this.estadosTurno.DESCARGADO;
        //     mensaje = `ha sido descargado`;
        //   break;

        //   case 'realizar pesaje final a':
        //     nuevoEstado = this.estadosTurno.PESADOF;
        //     mensaje = `ha sido pesado`;
        //   break;

        //   case 'despachar':
        //     nuevoEstado = this.estadosTurno.DESPACHADO;
        //     mensaje = `ha sido despachado`;
        //   break;

        //   case 'entregar':
        //     nuevoEstado = this.estadosTurno.ENTREGADO;
        //     mensaje = `ha sido entregado`;
        //   break;

            case 'cancelar':
            nuevoEstado = this.estadosTurno.CANCELADO;
            mensaje = `ha sido cancelado`;
            break;

        //   case 'actualizar la información del turno y reestablecer el estado  de ':
        //     nuevoEstado = this.estadosTurno.SOLICITADO;
        //     mensaje = `ha sido actualizado y se reestablecio su estado`;
        //     this.comentario = mensaje;
        //   break;

        //   case 'actualizar la información del turno por cambio de bodega ':
        //     nuevoEstado = this.estadosTurno.SOLICITADO;
        //     //mensaje = `ha sido actualizado y se reestablecio su estado`;
        //     //this.comentario = mensaje;
        //   break;
        }

    

    this.displayModal = true;
    this.loadingCargue = true;
    //this.getRemisiones = true;

    let data:any = {
        historial : {
                    estado:nuevoEstado,
                    fechaaccion:this.fechaaccion,
                    horaaccion:this.horaaccion,
                    comentario:this.comentario,
                    estado_anterior:this.estado
                    }
    };

    // if(this.estado===this.estadosTurno.SOLINVENTARIO){
    //   //////// ////////////// ////////////////////console.log(this.existeInventario);
    //   data.historial.disponibilidad = this.existeInventario;
    //   data.historial.fechadisponibilidad = this.fechadisponibilidad;
    // }

    // if(nuevoEstado == this.estadosTurno.SOLINVENTARIO){
    //   data.historial.tipo_solicitud = this.solictudProduccionSeleccionada.code
    // }

    if(this.novedadesSeleccionadas.length>0){
        data.historial.novedades = this.novedadesSeleccionadas;
    }
    
    if(this.updateModulo){
        let horacargue = `${this.fechacargue.toISOString().split("T")[0]}T${this.horacargue.toISOString().split("T")[1]}`;
        data.fechacita = new Date(this.fechacargue);
        data.horacita = new Date(horacargue);
        
        // data.transportadora = this.transportadoraSeleccionada.id;
        // data.vehiculo = this.vehiculoSeleccionado.id;
        // data.conductor = this.conductorSeleccionado.id;
        // data.peso_vacio = this.peso_bruto;
        // data.peso_neto = this.peso_neto;
        // data.adicional = this.adicional;

        //////////console.log('this.lotesItems',this.lotesItems);
        //////////console.log('this.pedidosTurno',this.pedidosTurno);

        // if(this.lotesItems.length>0){
        //     for(let itemPedido of this.pedidos_turno){
        //         let detalle_lotes_item_turno:any[] = this.lotesItems.filter(lotesItem=>lotesItem.id === itemPedido.index);
        //         itemPedido.detalle_lotes_item_turno = detalle_lotes_item_turno;
        //     }
        // }


        
        data.pedidos_detalle_solicitud = this.pedidos_turno;
        
        //if(this.remision){
        //  data.remision = this.remision;
        //}

        //////////console.log(this.observacionesCargue);

        // if(this.observacionesCargue.length > 0){
        //   data.observacion = this.observacionesCargue.join(';');
        // }else{
        //   data.observacion ='';
        // }
        
    }

    // if(this.remisionesPorCliente.length>0){
        
    //   data.remisionesPorCliente = this.remisionesPorCliente;
    // }

    if(this.inspeccionTurno){
        data.inspeccion = this.inspeccionTurno;
    }
    
    console.log('Data update turno',data);

    return data;
  }

  updateTurno(data:any){
   
    this.solicitudTurnoService.updateInfoTruno(this.turno.id,data)
      .subscribe({
            next:async (turno)=>{
               //console.log("turno actualizado",turno);

              
                let infoHistorialTurno =  await this.getHistorialTurno(turno.id)

                
                if(this.filesToUpload.length > 0 && this.uploadActivo){
                  for(let anexo of this.filesToUpload){
                    let body = new FormData();
                    body.append('file', anexo.file, anexo.file.name);
                    body.append('entidad', 'turnos');
                    body.append('id_relacion', infoHistorialTurno.detalle_solicitud_turnos_historial[infoHistorialTurno.detalle_solicitud_turnos_historial.length-1].id);
                    body.append('proceso', turno.estado);
                    body.append('nombre', anexo.file.name);

                    this.functionsService.uploadFile(body)
                        .subscribe({
                          next:(result)=>{
                            //////////////console.log('Upload ok',result);
                            this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha cargado correctamente el anexo ${anexo.file.name}`});
                          },
                          error:(err)=>{
                            this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo :'+err});
                          }
                        })
                  }
                  
                }

                // if(turno.estado===this.estadosTurno.DESPACHADO && turno.condiciontpt ==='TRANSP' && turno.detalle_solicitud_turnos_pedido.filter((pedido: { itemcode: string; })=>pedido.itemcode.startsWith('SF')).length === 0){

                //   //////////console.log('Turno de tranportasociedad sin flete: Envio de notificación creacion de flete');

                //   let email_destino_flete = turno.detalle_solicitud_turnos_pedido[0].email_asistente==null?turno.solicitud.usuario.email:turno.detalle_solicitud_turnos_pedido[0].email_asistente;
                //   let nombre_destino_flete = turno.detalle_solicitud_turnos_pedido[0].email_asistente==null?turno.solicitud.usuario.nombrecompleto:turno.detalle_solicitud_turnos_pedido[0].nombre_asistente;
                  
                //   this.solicitudTurnoService.sendNotificationFleteTurno(turno.id,'solicitud',email_destino_flete,nombre_destino_flete)
                //   .subscribe({
                //     next:(result)=>{
                //       this.messageService.add({ severity: 'success', summary: 'Información', detail: "Se ha enviado correctamente la solicitud de creación del flete" });
                //     },
                //     error:(err)=>{
                //       this.messageService.add({ severity: 'error', summary: '!Error¡', detail: "ocurrio un error en el envio de la solicitud de creacion de felte." });
                //     }
                //   })
                    
                // }

                // this.pedidos_turno.map((pedido)=>{
                //   pedido.lineaUpdate = {update:false, create:false};
                //   if(turno.estado===this.estadosTurno.DESPACHADO || turno.estado===this.estadosTurno.ENTREGADO){
                //    //////////console.log('pedido',pedido);
                    
                //     pedido.remision = turno.detalle_solicitud_turnos_pedido.filter((lineaPedido: { itemcode: any; id: any; })=>lineaPedido.itemcode === pedido.itemcode && lineaPedido.id === pedido.id)[0].remision;
                //   }
                // });

                this.novedadesSeleccionadas = [];

                if(this.updateModulo){
                  this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha actualizado correctamente los cambios efectuados a la orden de cargue ${turno.id}.`});
                }

                this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el cambio del estado.`});
                this.displayModal = false;
                this.loadingCargue = false;
                this.formEstadoTurno = false;
                this.estado = turno.estado

                // if(turno.estado===this.estadosTurno.VALINVENTARIO){
                    

                //     let newEstado:any = {
                //       historial : {
                //                     estado:this.estadosTurno.SOLICITADO,
                //                     fechaaccion:this.fechaaccion,
                //                     horaaccion:this.horaaccion,
                //                     comentario:`Se realizo validación del inventario de los items del turno, dispnibilidad:${data.historial.disponibilidad.toLowerCase()}, Fecha:${data.historial.fechadisponibilidad.toLocaleDateString()}`,
                //                     estado_anterior:this.estado

                //                   }
                //     };

                //     this.solicitudTurnoService.updateInfoTruno(this.turnoId,newEstado)
                //     .subscribe({
                //           next:async (turno)=>{
                //             this.estado = turno.estado
                            
                //           },  
                //           error:(err)=> {
                //             this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                //               console.error(err);
                //               this.displayModal = false;
                //               this.loadingCargue = false;
                              
                //           }
                //     });
                // }
                // // Si el estado del turno es remisionado y la condicion de trasnporte es TRASP y existe al menos un item de traslado, buscar los turnos creados en base al turno actual
                // if(turno.estado===this.estadosTurno.DESPACHADO && turno.condiciontpt ==='TRANSP' && turno.detalle_solicitud_turnos_pedido.filter((pedido: { tipo_operacion: string; })=>pedido.tipo_operacion==='TRASLADO').length > 0){
                //   //buscar los turnos asociados al turno actual
                //   this.solicitudTurnoService.getTurnosByTurnoBase(turno.id)
                //     .subscribe({
                //         next:(result)=>{
                //           if(result.length>0){
                //             let turnos:string='';
                //             for(let turno of result){
                //               turnos+=turno.id+','
                //             }
                //             this.messageService.add({severity:'warn', summary: 'Confirmación', detail:  `Se ha${result.length>1?'n':''} creado ${result.length>1?'los':'el'} siguiente${result.length>1?'s':''} turno${result.length>1?'s':''} de entrega: ${turnos.substring(0,turnos.length-1)} basado el turno:${turno.id}.`});
                //           }
                //         },
                //         error:(err)=>{
                //           console.error(err);
                //           this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});
                //         }

                //     });  
                // }

                //this.configTablePedidosAlmacenCliente();

                this.configSplitButton(this.estado,this.permisosModulo);


                this.solicitudTurnoService.sendNotification(turno.id)
                    .subscribe({
                        next:(result)=>{
                          if(result){
                            this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se han enviado las notificaciones correspondientes para el turno ${turno.id}.`});
                          }
                        },
                        error:(err)=>{
                          console.error(err);
                          this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});
                        }

                    });
                //////console.log('turno.estado',turno.estado)
                    // if(turno.estado!=this.estadosTurno.PESADOF){
                      this.cambioEstado = false;
                    // }
                
            },
            error:(err)=> {
              this.cambioEstado = false;
              console.error(err);
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});
                console.error(err);
                this.displayModal = false;
                this.loadingCargue = false;
                
            }
      });
      
              
  }

  async verEvidencias(pedido:any){

    this.dataUpload.entidad= 'pedidos-turno';
    this.dataUpload.id_relacion = pedido.id;
    this.dataUpload.proceso = 'Cargado';

    console.log('this.dataUpload',this.dataUpload)

    let filesAtach$ = this.functionsService.loadFiles({id_relacion:this.dataUpload.id_relacion,proceso:this.dataUpload.proceso,entidad:this.dataUpload.entidad});
    let filesAtachByEstadoHistorialTurno = await lastValueFrom(filesAtach$);
    console.log('filesAtachByEstadoHistorialTurno',filesAtachByEstadoHistorialTurno)
    if(filesAtachByEstadoHistorialTurno.length>0){
        this.dataFormCargueEvidencias.evidencias = filesAtachByEstadoHistorialTurno;
    }
    
    this.dataFormCargueEvidencias.cliente = pedido.CardName;
    this.dataFormCargueEvidencias.pedido = pedido.pedidonum;
    this.dataFormCargueEvidencias.item = pedido.itemname;
    

    

    

    this.formEvidenciasCargueTurno = true;
    

      
  }

  async cambioValorLote(valor:number, saldo:number,lote:any){
    console.log(valor,saldo,lote)
    if(valor!=undefined){
        if(valor>saldo){
            let index = await this.dataFormGestionLotesItem.lotes.findIndex((item: { lote: any; })=>item.lote===lote);
            this.messageService.add({severity:'error', summary: 'Informaciónn', detail:  `La cantidad a cargar del lote ${lote} es mayor a la cantidad disponible.`});
            console.log(index,this.dataFormGestionLotesItem.lotes[index].cantidad_cargue_lote)
            this.dataFormGestionLotesItem.lotes[index].cantidad_cargue_lote =0;
            //console.log(this.dataFormGestionLotesItem.lotes[index].cantidad_cargue_lote)
            
        }
        this.calcularToneladasLotes()
    }else{
        console.log('no valor')
    }
    
  }

  async cambioValorSacos(valor:number, lote:any){
        console.log(valor,lote)
         if(valor!=undefined){
            // let index = await this.dataFormGestionLotesItem.lotes.findIndex((item: { lote: any; })=>item.lote===lote);
            // console.log(index,this.dataFormGestionLotesItem.lotes[index].cantidad_sacos_lote)
            // console.log(this.dataFormGestionLotesItem.lotes[index].cantidad_cargue_lote)
            this.calcularToneladasSacos()
         }
        
    
  }

  async validarLote(valor:number,lote:any){
     console.log('valor',valor)
     if(valor===undefined){
         if(lote){
            console.log('lote',lote)
            let index = await this.dataFormGestionLotesItem.lotes.findIndex((item: { lote: any; })=>item.lote===lote);
            this.dataFormGestionLotesItem.lotes[index].cantidad_cargue_lote =0;
            this.calcularToneladasLotes()
         }
     }
    
  }

  async validarSaco(valor:number,lote:any){
     console.log('valor',valor)
     if(valor===undefined){
         if(lote){
            console.log('lote',lote)
            let index = await this.dataFormGestionLotesItem.lotes.findIndex((item: { lote: any; })=>item.lote===lote);
            this.dataFormGestionLotesItem.lotes[index].cantidad_sacos_lote =0;
             this.calcularToneladasSacos()
         }
     }
    
  }

  async calcularToneladasLotes(){
    console.log('calcularToneladasLotes');
    let total_lotes =0;
    this.dataFormGestionLotesItem.lotes.map((item: { cantidad_cargue_lote: any; cantidad_sacos_lote: any; })=>{
        let cantidad_carga_lote = !item.cantidad_cargue_lote?0:item.cantidad_cargue_lote;
        total_lotes=total_lotes+cantidad_carga_lote;
    })
    // await this.dataFormGestionLotesItem.lotes.forEach((lote:any,index:any)=>{
    //     console.log('index',index)
    //     console.log('lote',lote)
    // })
    console.log('total_lotes',total_lotes)
    this.dataFormGestionLotesItem.total_lotes = total_lotes;
  }

  calcularToneladasSacos(){
    let total_sacos = 0;
    this.dataFormGestionLotesItem.lotes.map((item: { cantidad_cargue_lote: any; cantidad_sacos_lote: any; })=>{
        let cantidad_sacos_lote = !item.cantidad_sacos_lote?0:item.cantidad_sacos_lote;
        total_sacos+=cantidad_sacos_lote;
    })
    this.dataFormGestionLotesItem.total_sacos = total_sacos;
  }

  async asignarLotesItem(){
    console.log('this.dataFormGestionLotesItem.total_sacos',this.dataFormGestionLotesItem.total_sacos);
    console.log('this.dataFormGestionLotesItem.cantidad_solicitada',this.dataFormGestionLotesItem.cantidad_solicitada);
    console.log('this.dataFormGestionLotesItem.total_lotes',this.dataFormGestionLotesItem.total_lotes)
    if(this.dataFormGestionLotesItem.total_sacos===0 ){
        this.messageService.add({severity:'error', summary: 'Informaciónn', detail:  `La cantidad total de sacos a cargar del item debe ser mayor a cero.`});       
    }else if(this.dataFormGestionLotesItem.total_lotes!=this.dataFormGestionLotesItem.cantidad_solicitada){
        this.messageService.add({severity:'error', summary: 'Informaciónn', detail:  `La cantidad total de lotes a cargar del item debe ser igual a la cantidad solicitada del item.`});       
    }else{

        let lotes = this.dataFormGestionLotesItem.lotes.filter((item: { cantidad_cargue_lote: number; cantidad_sacos_lote: any; })=>item.cantidad_cargue_lote !=0 && item.cantidad_sacos_lote)
        let lotesItemLine:any[] = [];
        lotes.forEach((lote:any,index:any)=>{
            
            lotesItemLine.push({
                id:this.dataFormGestionLotesItem.linea_id,
                lote:lote.lote,
                fecha_vencimiento:lote.fecha_vencimiento,
                cantidad_bodega_lote:lote.saldo,
                cantidad_cargue_lote:lote.cantidad_cargue_lote,
                cantidad_sacos_lote:lote.cantidad_sacos_lote,
                lineaUpdate:{create:true,update:false}
            })
        })

        let indexItemPedido = this.pedidos_turno.findIndex(item=>item.id === this.dataFormGestionLotesItem.linea_id)
        this.pedidos_turno[indexItemPedido].cantidad_sacos =this.dataFormGestionLotesItem.total_sacos
        this.pedidos_turno[indexItemPedido].detalle_lotes_item_turno =lotesItemLine;
        // this.lotesItems = lotesItemLine;
        // console.log('this.lotesItems',this.lotesItems);
        this.formGestionLotesItem = false;
    }
  }

   UploadFiles(event:any,uploaderFiles: FileUpload){
  
        console.log(event)
        console.log(uploaderFiles)
        console.log(uploaderFiles.files)
        if(!uploaderFiles.files.length){
            this.messageService.add({severity:'error', summary: '!Error¡', detail: `Debe seleccionar al menos un archivo para subir.` });
        }else{
             for(let file of uploaderFiles.files){
                //////console.log(file);

                let body = new FormData();
                body.append('file', file, file.name);
                body.append('entidad', this.dataUpload.entidad);
                body.append('id_relacion', this.dataUpload.id_relacion);
                body.append('proceso', this.dataUpload.proceso);
                body.append('nombre', file.name);

                //////console.log(body)

                this.functionsService.uploadFile(body)
                    .subscribe({
                        next:(result)=>{
                        console.log('Upload ok',result);

                        this.dataFormCargueEvidencias.evidencias.push(result)
                        
                        this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha cargado correctamente el anexo ${file.name}`});
                        
                        },
                        error:(err)=>{
                        this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo :'+err});
                        }
                });

                uploaderFiles.clear(); 

            }
        }
       
    }

     progressUpload(event :any){}

     verImagen(linkS3:any){
        window.open(linkS3);
     }


     guardarFoto(file:any){
     this.loading = true;
    let body = new FormData();
    const fileName = `capture_${Date.now()}.png`;
    body.append('file', file, fileName);
    body.append('entidad', this.dataUpload.entidad);
    body.append('id_relacion', this.dataUpload.id_relacion);
    body.append('proceso', this.dataUpload.proceso);
    body.append('nombre', fileName);

   //////console.log('guardarFoto',body)

    

    this.functionsService.uploadFile(body)
          .subscribe({
            next:(result)=>{
               this.loading = false;
              console.log('Upload ok',result);
              this.dataFormCargueEvidencias.evidencias = [
                    ...this.dataFormCargueEvidencias.evidencias,
                    result
                ];
            //   console.log('this.dataFormCargueEvidencias.evidencias',this.dataFormCargueEvidencias.evidencias);
            //   console.log('Upload ok',result.nombre);
            //   console.log('Upload ok',result.linkS3);
            //   //this.dataFormCargueEvidencias.evidencias.push(result)
              this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha cargado correctamente el anexo capture_${fileName}.png`});
              this.changeDetector.detectChanges()
            },
            error:(err)=>{
              this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo :'+err});
              this.loading = false;
              this.changeDetector.detectChanges()
            }
      });

       

 }

    //  showCamera(){
    //     this.bool_show_camera = true;
    //  }

    //  showUpload(){
    //     this.bool_show_up = true;
    //  }

}