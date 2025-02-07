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
import { Table } from 'primeng/table';



@Component({
  selector: 'app-remisiones',
  providers:[ConfirmationService,MessageService], 
  templateUrl: './remisiones.component.html',
  styleUrls: ['./remisiones.component.scss'],
 
})


export class RemisionesComponent implements  OnInit ,  OnChanges {

  @Input() turno!:any;
  @Input() estado!:string;
  @Input() pedidos!:any;

  @Input() getRemisionesPorCliente!:boolean;


  @Output() onGetRemisiones: EventEmitter<any> = new EventEmitter();

  @ViewChild('filterTable') filterTable!: ElementRef;

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

  remisiones:any[] = [];
  clientes:any[] = [];

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
              private pdfInspeccionCargue:PdfInspeccionCargue,
              ) { }

  async ngOnInit() {

    //this.displayModal = true;
    //this.loadingCargue = true;
    //this.condicion_tpt="RETIRA";
   ////console.log('ngOnInit inspeccion');
   //////console.log('turno estado inspeccion', this.estado);
    this.getPermisosModulo();
    
    

  
  }

  async ngOnChanges(changes: SimpleChanges){
    //////////////////console.log('changes',changes['rangoFechas'].currentValue)

    ////console.log('ngOnChanges inspeccion')
   
    //this.estado = changes['estado'].currentValue;
    this.turno = changes['turno'].currentValue;
    //this.pedidos = changes['pedidos'].currentValue;
    ////console.log('turno estado inspeccion',this.estado);
   //console.log('turno remision',this.turno);
    this.remisiones = await this.setDataRemisiones(this.turno);
    console.log('remisiones',this.remisiones);
    this.clientes = await this.getClientesPedidos(this.turno);////console.log('turno pedidos',this.pedidos);
   //console.log(this.clientes);

    // this.getRemisionesPorCliente = changes['getRemisionesPorCliente'].currentValue;
    // if(this.getRemisionesPorCliente){
       await this.emitirRemisionesPorCliente();
    // }
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

  async setDataRemisiones(infoTurno:any):Promise<any[]>{

    let remisiones:any[] = [];

    let treTableLotes:any[] = [];
    
    //Armar array de remisiones
    for(let linea_detalle of infoTurno.detalle_solicitud_turnos_pedido){

      console.log('linea_detalle',linea_detalle);
      //console.log(JSON.parse(JSON.stringify(remisiones)))

       if(/*!linea_detalle.itemcode.startsWith('SF') && */linea_detalle.estado ==='A'){
          if(remisiones.filter(remision=>remision.base_docnum === linea_detalle.pedidonum && remision.lugarentrega == linea_detalle.lugarentrega && remision.municipioentrega == linea_detalle.municipioentrega).length ===0){
            remisiones.push({
              fecha:new Date(),
              turnoid:infoTurno.id,
              base_docnum:linea_detalle.pedidonum,
              base_docentry:linea_detalle.docentry,
              base_objectType:linea_detalle.objectType,
              municipioentrega:linea_detalle.municipioentrega,
              lugarentrega:linea_detalle.lugarentrega,
              CardCode:linea_detalle.CardCode,
              CardName:linea_detalle.CardName,
              codigo_vendedor:linea_detalle.codigo_vendedor,
              manifiesto:0,
              tipo_operacion:linea_detalle.tipo_operacion,
              detalle_remision:[
                                  {
                                    id:linea_detalle.id,
                                    linea:linea_detalle.linea,
                                    itemcode:linea_detalle.itemcode,
                                    itemname:linea_detalle.itemname,
                                    bodega:linea_detalle.bodega,
                                    cantidad:linea_detalle.cantidad,
                                    cantidad_sacos:linea_detalle.cantidad_sacos,
                                    lotes:linea_detalle.detalle_lotes_item_turno,
                                    vicepresidencia:linea_detalle.vicepresidencia,
                                    dependencia:linea_detalle.dependencia,
                                    localidad:linea_detalle.localidad,
                                    precio_lista:linea_detalle.precio_lista,
                                    precio_vendedor:linea_detalle.precio_vendedor,
                                    precio_gerente:linea_detalle.precio_gerente,
                                    categoria_item:linea_detalle.categoria_item,
                                    subcategoria_item:linea_detalle.subcategoria_item,
                                    almacen_fpp:linea_detalle.almacen_fpp,
                                    bodega_destino:linea_detalle.bodega_destino,
                                    ubicacion:linea_detalle.ubicacion,
                                    vendedor:linea_detalle.vendedor,
                                    
                                    ivacode:linea_detalle.ivacode,
                                    precio_unitario:linea_detalle.precio_unitario,

  
                                  }
                              ],
              lotes:[
                        {
                          "data":{
                                itemcode_lote:linea_detalle.itemcode,
                                itemname:linea_detalle.itemname,
                                linea:linea_detalle.linea,
                                bodega:linea_detalle.bodega,
                                cantidad:linea_detalle.cantidad,
                                cantidad_sacos:linea_detalle.cantidad_sacos
                          },
                          "children":linea_detalle.detalle_lotes_item_turno.map((lote: { lote: any; cantidad_cargue_lote: any; cantidad_sacos_lote: any; })=>{
                            return {
                              "data":{
                                      itemcode_lote:lote.lote,
                                      itemname:'',
                                      linea:'',
                                      bodega:'',
                                      cantidad:lote.cantidad_cargue_lote,
                                      cantidad_sacos:lote.cantidad_sacos_lote
                                  }
                            } 
                          })
  
                          
                        }
                ]
              
            })

            
          }else{
            let index = remisiones.findIndex(remision=>remision.base_docnum === linea_detalle.pedidonum && remision.lugarentrega == linea_detalle.lugarentrega && remision.municipioentrega == linea_detalle.municipioentrega);
            remisiones[index].detalle_remision.push(
              {
                  id:linea_detalle.id,
                  linea:linea_detalle.linea,
                  itemcode:linea_detalle.itemcode,
                  itemname:linea_detalle.itemname,
                  bodega:linea_detalle.bodega,
                  cantidad:linea_detalle.cantidad,
                  cantidad_sacos:linea_detalle.cantidad_sacos,
                  lotes:linea_detalle.detalle_lotes_item_turno,
                  vicepresidencia:linea_detalle.vicepresidencia,
                  dependencia:linea_detalle.dependencia,
                  localidad:linea_detalle.localidad,
                  precio_lista:linea_detalle.precio_lista,
                  precio_vendedor:linea_detalle.precio_vendedor,
                  precio_gerente:linea_detalle.precio_gerente,
                  categoria_item:linea_detalle.categoria_item,
                  subcategoria_item:linea_detalle.subcategoria_item,
                  almacen_fpp:linea_detalle.almacen_fpp,
                  bodega_destino:linea_detalle.bodega_destino,
                  ubicacion:linea_detalle.ubicacion,
                  vendedor:linea_detalle.vendedor,
                  
                  ivacode:linea_detalle.ivacode,
                  precio_unitario:linea_detalle.precio_unitario,
  
              }
            )
  
            remisiones[index].lotes.push({
              "data":{
                    itemcode_lote:linea_detalle.itemcode,
                    itemname:linea_detalle.itemname,
                    linea:linea_detalle.linea,
                    bodega:linea_detalle.bodega,
                    cantidad:linea_detalle.cantidad,
                    cantidad_sacos:linea_detalle.cantidad_sacos
              },
              "children":linea_detalle.detalle_lotes_item_turno.map((lote: { lote: any; cantidad_cargue_lote: any; cantidad_bodega_lote: any; })=>{
                return {
                  "data":{
                          itemcode_lote:lote.lote,
                          itemname:'',
                          linea:'',
                          bodega:'',
                          cantidad:lote.cantidad_cargue_lote,
                          cantidad_sacos:linea_detalle.cantidad_sacos
                      }
                } 
              })
  
              
            });
          }
      }
        
    }

    console.log('remisiones ---', remisiones);
    return remisiones;
}


  async getClientesPedidos(infoTurno:any):Promise<any[]>{
      let clientes:any[] = [];
      for(let linea_detalle of infoTurno.detalle_solicitud_turnos_pedido){
        if(clientes.filter(remision=>remision.CardCode === linea_detalle.CardCode).length ===0){
          clientes.push({
            CardCode:linea_detalle.CardCode,
            CardName:linea_detalle.CardName,
            remisiones: this.remisiones.filter(remision=>remision.CardCode===linea_detalle.CardCode)
            // remisiones: await (this.remisiones.filter(remision=>remision.CardCode===linea_detalle.CardCode)).map((remision)=>{
            //   return {
            //     fecha:remision.fecha,
            //     turnoid:remision.turnoid,
            //     base_docnum:remision.base_docnum,
            //     base_docentry:remision.base_docentry,
            //     base_objectType:remision.base_objectType,
            //     municipioentrega:remision.municipioentrega,
            //     lugarentrega:remision.lugarentrega,
            //     CardCode:remision.CardCode,
            //     CardName:remision.CardName,
            //     codigo_vendedor:remision.codigo_vendedor,
            //     manifiesto:remision.manifiesto,
            //     tipo_operacion:remision.tipo_operacion,
            //     detalle_remision:remision.detalle_remision
            //   }
            // })
            
          })
        }
      }

      return clientes;
  }

  
  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filterTable.nativeElement.value = '';
  }

  async emitirRemisionesPorCliente():Promise<void>{
    
    let clientes:any[] =[];
    for(let cliente of this.clientes){
      clientes.push({
          CardCode:cliente.CardCode,
          CardName:cliente.CardName,
          remisiones: await cliente.remisiones.map((remision: { fecha: any; turnoid: any; base_docnum: any; base_docentry: any; base_objectType: any; municipioentrega: any; lugarentrega: any; CardCode: any; CardName: any; codigo_vendedor: any; manifiesto: any; tipo_operacion: any; detalle_remision: any; })=>{
            return {
              fecha:remision.fecha,
                turnoid:remision.turnoid,
                base_docnum:remision.base_docnum,
                base_docentry:remision.base_docentry,
                base_objectType:remision.base_objectType,
                municipioentrega:remision.municipioentrega,
                lugarentrega:remision.lugarentrega,
                CardCode:remision.CardCode,
                CardName:remision.CardName,
                codigo_vendedor:remision.codigo_vendedor,
                manifiesto:remision.manifiesto,
                tipo_operacion:remision.tipo_operacion,
                detalle_remision:remision.detalle_remision
            }
          })
      })
    }

    console.log('clientes remisiones',clientes);
    this.onGetRemisiones.emit(clientes)
    //this.onGetRemisiones.emit(this.clientes)
  }

  async cambioValorManifiesto(){
    await this.emitirRemisionesPorCliente();
  }
  
 


 



 
  

  

}
