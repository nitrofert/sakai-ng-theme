import { Component, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-form-turno',
  providers:[ConfirmationService,MessageService], 
  templateUrl: './form-turno.component.html',
  styleUrls: ['./form-turno.component.scss'],
 
})
export class FormTurnoComponent implements  OnInit {

  turnoId!:number;
  ordenCargue: any;
  hoy:Date = new Date();

  cliente:string = '';
  localidad:string = '';
  nombreLocalidad:string = '';
  direccionLocalidad:string = '';
  ubicacionLocalidad:string = '';
  fechacargue!:Date;
  horacargue!:Date;
  transportadora:string = '';
  placa:string ='';
  tipo:string = '';
  cantidad:number = 0;
  conductor:string = '';
  telefono:string = '';
  celular:string = '';
  email:string = '';
  estado:string ='';
  remision:string = '';

  adicionalOptions: any[] = [{label: 'Vehículo adicional', value: true}, {label: 'Programado', value: false}];

  adicional!: boolean;

  arrayBtnTurnos!: MenuItem[];
  btnAprobar: MenuItem =   {label: 'Aprobar', icon: 'pi pi-check', command: () => { this.aprobarTurno();}};
  btnPausar: MenuItem =   {label: 'Pausar', icon: 'pi pi-pause', command: () => { this.pausarTurno();}};
  btnActivar: MenuItem =   {label: 'Activar', icon: 'pi pi-play', command: () => { this.activarTurno();}};
  btnCancel: MenuItem =   {label: 'Cancelar', icon: 'pi pi-times', command: () => { this.cancelarTurno();}};
  btnIngreso: MenuItem =   {label: 'Ingresar', icon: 'pi pi-sign-in', command: () => { this.ingresarTurno();}};
  btnPeso: MenuItem =   {label: 'Pesar', icon: 'pi pi-compass', command: () => { this.pesarTurno();}};
  btnCargue: MenuItem =   {label: 'Cargar', icon: 'pi pi-upload', command: () => { this.inicioCargueTurno();}};
  btnFinCargue: MenuItem =   {label: 'Fin cargue', icon: 'pi pi-box', command: () => { this.finalizarCargueTurno();}};
  btnPesoFinal: MenuItem =   {label: 'Pesaje final', icon: 'pi pi-compass', command: () => { this.pesarTurno2();}};
  btnDespachar: MenuItem =   {label: 'Remisionar', icon: 'pi pi-sign-out', command: () => { this.despacharTurno();}};
  btnSolRevInv: MenuItem =   {label: 'Solicitud producción', icon: 'pi pi-search', command: () => { this.solicitarInventarioTurno();}};
  btnValidInv: MenuItem =   {label: 'Validación producción', icon: 'pi pi-verified', command: () => { this.validarInventarioTurno();}};

  btnUpdateInfo: MenuItem =   {label: 'Actualizar informaciíon', icon: 'pi pi-pencil', command: () => { this.updateInfoTurno();}};

  btnCambioBodega: MenuItem =   {label: 'Cambio Locacion/bodega', icon: 'pi pi-sync', command: () => { this.cambioBodega();}};

  observacionesCargue:any[] = [];
  observaciones:string = "";

  nuevoComentario:string = "";

  

  /*btnAprobar: MenuItem =   {tooltip: 'Aprobar', tooltipPosition: 'top', icon: 'pi pi-check', command: () => { this.aprobarTurno();}};
  btnPausar: MenuItem =   {tooltip: 'Pausar', tooltipPosition: 'top', icon: 'pi pi-pause', command: () => { this.aprobarTurno();}};
  btnActivar: MenuItem =   {tooltip: 'Activar', tooltipPosition: 'top', icon: 'pi pi-play', command: () => { this.aprobarTurno();}};
  btnCancel: MenuItem =   {tooltip: 'Cancelar', tooltipPosition: 'top', icon: 'pi pi-times', command: () => { this.aprobarTurno();}};
  btnIngreso: MenuItem =   {tooltip: 'Ingresar', tooltipPosition: 'top', icon: 'pi pi-sign-in', command: () => { this.aprobarTurno();}};
  btnPeso: MenuItem =   {tooltip: 'Pesar', tooltipPosition: 'top', icon: 'pi pi-compass', command: () => { this.aprobarTurno();}};
  btnCargue: MenuItem =   {tooltip: 'Cargar', tooltipPosition: 'top', icon: 'pi pi-upload', command: () => { this.aprobarTurno();}};
  btnFinCargue: MenuItem =   {tooltip: 'Fin cargue', tooltipPosition: 'top', icon: 'pi pi-box', command: () => { this.aprobarTurno();}};
  btnDespachar: MenuItem =   {tooltip: 'Despachar', tooltipPosition: 'top', icon: 'pi pi-sign-out', command: () => { this.aprobarTurno();}};*/
  
 

  grabarCambios:boolean = false;

  tablaPedidosTurno!: any;

  estados: any[] = [{ name: 'Soicitado', code: 'Soicitado' , label:'Soicitado'},
                    { name: 'Autorizado', code: 'Autorizado' , label:'Autorizado'},
                    { name: 'Arribo a cargue', code: 'Arribo a cargue' , label:'Arribo a cargue'},
                    { name: 'Incio cargue', code: 'Incio cargue' , label:'Incio cargue'},
                    { name: 'Fin cargue', code: 'Fin cargue' , label:'Fin cargue'},
                    { name: 'Cancelado', code: 'Cancelado' , label:'Cancelado'},];
  estadoSeleccionado:any = [];
  estadosFiltrados :any[]=[];

  pedidosTurno:any[] = [];

  displayModal:boolean = false;
  loadingCargue:boolean = false;
  completeCargue:boolean = false;
  completeTimer:boolean = false;
  messageComplete:string = "";

  permisosModulo!:any[];

vehiculos:any[] = [];
vehiculoSeleccionado:any = [];
vehiculosFiltrados:any[] = [];

transportadoras:any[] = [];
transportadoraSeleccionada:any = [];
transportadorasFiltrados:any[] = [];

conductores:any[] = [];
conductorSeleccionado:any = [];
conductoresFiltrados:any[] = [];

updateModulo:boolean = false;

formEstadoTurno:boolean = false;
tituloEstado:string = "";

fechaaccion:Date = new Date();
horaaccion:Date = new Date();

comentario:string = "";

accion:string = "";
totalCarga:number = 0;
capacidadvh:number = 0;

peso_bruto:number =0;
peso_neto:number = 0;
pesomax:number = 0;

tiposRol:any = TipoRol;

estadosTurno:any = EstadosDealleSolicitud;

rolesUsuario:any[]=[];

updatePesoBruto:boolean = false;
updateRemision:boolean = false;

locaciones:any[] = [];
diasNoAtencion:any[] = [];
today:Date = new Date();
invalidDates:any[] =[];
horainicio:Date = new Date(new Date().setHours(0,0,0));
horafin:Date = new Date(new Date().setHours(23,59,0));
horariosLocacion:any[] = [];
horariosSeleccionados:any[] = [];

condicion_tpt:string = "";

turno!:any;

novedades:any[] = [];
novedadesSeleccionadas:any[] = [];
novedad:boolean = false;
formComentarioTurno:boolean = false;

domain:string = window.location.hostname;

municipioentrega:string ="";
sitioentrega:string = "";

inventarioOptions: any[] = [{label: 'Disponible', value: 'si'}, {label: 'No disponible', value: 'no'}];
existeInventario:string = 'no';
fechadisponibilidad:Date = new Date();

updatePedidosTurno:boolean = false;
editCantidad:boolean = false;

clientesTurno:any;
dialogPedidosCliente:boolean = false;
envioLineaCarguePedido:boolean = false;
capacidadDisponibleVehiculo:number = 0;

clienteSeleccionado: any = [];
clientesFiltrados : any[] = [];

municipios!:any[];
municipioSeleccionado:any = [];
municipiosFiltrados:any[] = [];

solictudesProduccion:any[] =[{label:"Solicitud de inventario", code:"Solicitud de inventario"},{label:"Solicitud adicional", code:"Solicitud adicional"}];
solictudProduccionSeleccionada:any = [];

pedidosCliente:any[] = [];

tablaPedidosAlmacenCliente!: any;
tablaPedidosEnSolicitud!: any;
showItemsSelectedPedidosAlmacenCliente:boolean=false;


loadingPedidosAlmacenCliente:boolean = false;
loadingPedidosTurno:boolean = false;

tablaCambioBodegaPedidosTurno!: any;
pedidosCambioBodegaTurno:any[] = [];
dialogCambioBodega:boolean = false;
loadingCambioBodegaPedidosTurno:boolean = false;

bodegas:any[] = [];
bodegaSeleccionada:any = [];
bodegasFiltradas:any[] = [];


envioCambioBodega:boolean = false;

fechacargueCambioBodega!:Date;
horacargueCambioBodega!:Date;
diasNoAtencionCambioBodega:any[] = [];
horariosLocacionCambioBodega:any[] = [];
horariosSeleccionadosCambioBodega:any[] = [];




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
              private ciudadesService:CiudadesService,) { }

  ngOnInit() {

    
    //this.condicion_tpt="RETIRA";
    this.turnoId = this.config.data.id;
    this.getPermisosModulo();
    this.getCiudades();

    ////////////////////////////// ////////////// ////console.log(this.config.data.id);
    this.configTablePedidosAlmacenCliente();
    this.configNewTablePedidosAlmacenCliente();
    this.configTableCambioPedidosBodega();
    //this.getTurno(this.turnoId);
    this.getLocaciones();
    this.getNovedades();

   
    
  }


  getPermisosModulo(){
  
    const modulo = this.router.url;
    //////////////////// ////////////// ////console.log(modulo);
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              ////////////////////////// ////////////// ////console.log(permisos);
              if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                this.router.navigate(['/auth/access']);
              }
  
              if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                this.router.navigate(['/auth/access']);
              }
              this.permisosModulo = permisos;
              //this.multiplesClientes = await this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Seleccionar multiples clientes').valor;
              ////////////////////////////// ////////////// ////console.log(this.multiplesClientes);
              /*
              this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
              this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
              this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
              this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
              */

              const infoUsuario = await this.usuariosService.infoUsuario();
              this.rolesUsuario = infoUsuario.roles;
              ////////////////// ////////////// ////console.log(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.CLIENTE));
              await this.getVehiculos();
              await this.getConductores();
              await this.getTransportadoras();
              
             this.updateModulo = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
             //////////// ////console.log(this.updateModulo);
             this.updatePedidosTurno = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar pedidos turno').valor;
             ////// ////////////// ////console.log('updatePedidosTurno',this.updatePedidosTurno); 
             this.updatePesoBruto = await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.BASCULA);
             this.updateRemision = await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.REMISION);
             ////////////////// ////////////// ////console.log(this.updateModulo ,this.updatePesoBruto); 
             ////////////////// ////////////// ////console.log(!(this.updateModulo && this.updatePesoBruto)?true:false); 
             /*if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='TRANSP').valor){
              this.condicion_tpt="TRANSP";
            }*/

             this.getTurno(this.turnoId);
            },
            error:(err)=>{
                console.error(err);
            }
        });
        
  }

  async getCiudades(){
    this.ciudadesService.getCiudades()
        .subscribe({
            next:(ciudades)=>{
             ////// ////////////// ////console.log(ciudades);
              ciudades.map((ciudad:any)=>{
                ciudad.label = `${ciudad.code} - ${ciudad.nombre}`;
              });

              this.municipios = ciudades;
            },
            error:(err)=>{
              console.error(err);
            }

        });
}

  async getVehiculos():Promise<void>{
    /*this.vehiculosService.getVehiculos()
        .subscribe({
          next: (vehiculos)=>{
              ////////////////////////////// ////////////// ////console.log(vehiculos);
              for(let vehiculo of vehiculos){
                vehiculo.code = vehiculo.placa;
                vehiculo.name = vehiculo.placa;
                vehiculo.label = vehiculo.placa;
                vehiculo.clase = vehiculo.tipo_vehiculo;
              }
              ////////////////////////////// ////////////// ////console.log(conductores);
              this.vehiculos = vehiculos;
          },
          error: (err)=>{
             console.error(err);
          }
      
    });*/

    let vehiculos = await this.functionsService.resolveObservable(this.vehiculosService.getVehiculos());

    for(let vehiculo of vehiculos){
      vehiculo.code = vehiculo.placa;
      vehiculo.name = vehiculo.placa;
      vehiculo.label = vehiculo.placa;
      vehiculo.clase = vehiculo.tipo_vehiculo;
    }
    //////////////// ////////////// ////console.log('vehiculos',vehiculos);
    this.vehiculos = vehiculos;

  }
  
  async getTransportadoras():Promise<void>{
    /*this.transportadorasService.getTransportadoras()
    .subscribe({
        next: (transportadoras)=>{
            //Adicionar campos requeridos para autocmplete y dropdwons
            for(let transportadora of transportadoras){
              transportadora.code = transportadora.nit;
              transportadora.name = transportadora.nombre;
              transportadora.label = transportadora.nit+' - '+transportadora.nombre;
            }
            ////////////////////////////// ////////////// ////console.log(conductores);
            this.transportadoras = transportadoras;
        },
        error: (err)=>{
          console.error(err);
        }
    });*/ 

    let transportadoras = await this.functionsService.resolveObservable(this.transportadorasService.getTransportadoras());

    for(let transportadora of transportadoras){
      transportadora.code = transportadora.nit;
      transportadora.name = transportadora.nombre;
      transportadora.label = transportadora.nit+' - '+transportadora.nombre;
    }
    //////////////// ////////////// ////console.log(transportadoras);
    this.transportadoras = transportadoras;
  }
  
  async getConductores():Promise<void>{
    /*this.conductoresService.getConductores2()
        .subscribe({
            next: (conductores)=>{
                //Adicionar campos requeridos para autocmplete y dropdwons
                for(let conductor of conductores){
                  conductor.code = conductor.cedula;
                  conductor.name = conductor.nombre;
                  conductor.label = conductor.cedula+' - '+conductor.nombre;
                }
                ////////////////////////////// ////////////// ////console.log(conductores);
                this.conductores = conductores;
            },
            error: (err)=>{
              console.error(err);
            }
        });*/

      let conductores =  await this.functionsService.resolveObservable(this.conductoresService.getConductores2());
      for(let conductor of conductores){
        conductor.code = conductor.cedula;
        conductor.name = conductor.nombre;
        conductor.label = conductor.cedula+' - '+conductor.nombre;
      }
      //////////////// ////////////// ////console.log(conductores);
      this.conductores = conductores;
  }

  async getLocaciones(){
    this.almacenesService.getLocaciones()
        .subscribe({
            next:(locaciones)=>{
                //////////// ////console.log('locaciones',locaciones);
                this.locaciones = locaciones;
            },
            error:(err)=>{
              console.error(err);
            }
        });
  }

  async getNovedades():Promise<void>{
    this.novedadesService.getNovedades()
        .subscribe({
              next:(novedades)=>{
                  novedades.forEach(novedad=>{
                    novedad.code = novedad.id;
                    novedad.name = novedad.novedad;
                    novedad.label = novedad.novedad;
                  });

                  //// ////console.log(novedades);
                  this.novedades = novedades;
              },
              error:(err)=>{
                  console.error(err);
              }

        });
  }

  async getTurno(id: number){
    this.displayModal = true;
    this.loadingCargue = true;
    //let orden = await this.ordenesCargueService.getOrdenesByID(id);
    this.solicitudTurnoService.getTurnosByID(id)
        .subscribe({
              next:async (turno)=>{
                 // ////console.log('turno',turno);
                  
                  this.turno = turno;
                  
                  this.cliente = turno.detalle_solicitud_turnos_pedido[0].CardCode+' - '+turno.detalle_solicitud_turnos_pedido[0].CardName;
                  this.localidad = turno.locacion;
                  this.nombreLocalidad = turno.locacion;
                  this.fechacargue = new Date(turno.fechacita);
                  let hora = 60 * 60000;

                  let fechacargue = new Date (new Date(turno.fechacita).getTime()+(hora*5))
                  this.fechacargue = fechacargue;
                  
                  
                  let horacargue = new Date(new Date(fechacargue).setHours(parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[2])));
                  //this.horacargue = new Date(turno.horacita);
                  this.horacargue = horacargue;
                  this.condicion_tpt = turno.condiciontpt;
                  //this.horacargue = new Date();
                  this.placa = turno.vehiculo.placa;
                  this.tipo = turno.vehiculo.tipo_vehiculo.tipo;
                  this.vehiculoSeleccionado =  this.vehiculos.find(vehiculo=>vehiculo.code == this.placa);
                  //this.vehiculoSeleccionado = await this.asignarVehiculo(this.placa);
                  ////////////////// ////////////// ////console.log(this.vehiculoSeleccionado);
                  this.pesomax = this.vehiculoSeleccionado.pesomax;
                  this.peso_bruto = turno.peso_vacio==0?this.vehiculoSeleccionado.pesovacio:turno.peso_vacio;

                 this.adicional = turno.adicional;

                  this.observaciones = turno.observacion;
                  this.observacionesCargue = await this.setObservacionesCargue(this.observaciones);
                  this.clientesTurno = turno.solicitud.clientes.map((cliente:any)=>{
                      cliente.label = `${cliente.FederalTaxID} - ${cliente.CardName}`;
                      return cliente;
                  });

                  this.clienteSeleccionado = this.clientesTurno[0];
                  
                 
                  
                  this.capacidadvh = this.vehiculoSeleccionado.capacidad;
                  
                  this.transportadora = turno.transportadora.nit+' - '+turno.transportadora.nombre;
                  ////////////////////// ////////////// ////console.log('transportadoras',this.transportadoras);
                  //this.transportadoraSeleccionada = this.transportadoras.find(tpt =>tpt.label === this.transportadora);
                  this.transportadoraSeleccionada = this.transportadoras.find(tpt =>tpt.code === turno.transportadora.nit);
                  this.conductor = turno.conductor.cedula+' - '+turno.conductor.nombre;
                  this.conductorSeleccionado = this.conductores.find(conductor=>conductor.label == this.conductor);
                  //his.estadoSeleccionado = this.estados.find(estado => estado.code == turno.estado);
                  ////////////////////////// ////////////// ////console.log(this.estadoSeleccionado);
                  this.pedidosTurno = await this.calcularDisponibilidadPedido(turno.detalle_solicitud_turnos_pedido);
                  
                  this.pedidosTurno.map((pedido)=>{
                    pedido.lineaUpdate = {update:false, create:false};
                    pedido.cantidadOld =pedido.cantidad;
                  });

                  //////console.log('pedidosTurno',this.pedidosTurno);
                  this.telefono = turno.conductor.numerotelefono;
                  this.celular = turno.conductor.numerocelular;
                  this.email = turno.conductor.email;
                  
                  let totalesTabla = await this.functionsService.sumColArray(this.pedidosTurno.filter(pedido=>!pedido.itemcode.startsWith('SF') && pedido.estado=='A'),[{cantidad:0, comprometida:0, cantidadbodega:0, disponible:0 }]);
                  this.cantidad = totalesTabla[0].cantidad;
                  this.capacidadDisponibleVehiculo = this.capacidadvh-this.cantidad;
                  //this.peso_neto = this.peso_bruto+this.cantidad;
                  this.peso_neto = turno.peso_neto==0?this.peso_bruto+this.cantidad:turno.peso_neto;
                  this.totalCarga = totalesTabla[0].cantidad;
                  this.displayModal = false;
                  this.loadingCargue = false;
                  this.estado = turno.estado;
                  this.remision = turno.remision;
                  this.sitioentrega = turno.lugarentrega;
                  this.municipioentrega = turno.municipioentrega;
                  this.editCantidad = await this.validarEditarCampoCantidad();



                  if(this.locaciones.filter(locacion=>locacion.code === this.localidad).length>0){
                    ////////////// ////////////// ////console.log(this.locaciones.filter(locacion=>locacion.code === this.localidad));
                    ////////////////// ////////////// ////console.log(this.horainicio, this.horafin);
                    this.diasNoAtencion = await this.obtenerDiasNoAtencion(this.locaciones.filter(locacion=>locacion.code === this.localidad)[0].horarios_locacion);
                    this.horariosLocacion = this.locaciones.filter(locacion=>locacion.code === this.localidad)[0].horarios_locacion;

                    this.nombreLocalidad = this.locaciones.filter(locacion=>locacion.code === this.localidad)[0].locacion;
                    this.direccionLocalidad = this.locaciones.filter(locacion=>locacion.code === this.localidad)[0].direccion;
                    this.ubicacionLocalidad = this.locaciones.filter(locacion=>locacion.code === this.localidad)[0].ubicacion;
                
                    ////////////// ////////////// ////console.log('horariosLocacion', this.nombreLocalidad,this.direccionLocalidad,this.ubicacionLocalidad,this.horariosLocacion);
                    await this.seleccionarFechaCita();
                  }else{
                    //Establecer horarios locacion
                    this.diasNoAtencion = [];
                    this.horariosLocacion = [];
                    this.horariosSeleccionados =[];
                  }

                  let historial!:any;

                  if(turno.estado===EstadosDealleSolicitud.PAUSADO){
                      historial = turno.detalle_solicitud_turnos_historial.filter((linea: { estado: EstadosDealleSolicitud; }) =>linea.estado === EstadosDealleSolicitud.PAUSADO);
                      this.messageService.add({severity:'warn', summary: '!Advertencia¡', detail:`El turno se encuentra pausado debido a la siguente novedad: ${JSON.stringify(historial[historial.length-1].novedades.map((novedad: { novedad: any; })=>{return novedad.novedad}).join())}`});
                  }else{
                      historial = turno.detalle_solicitud_turnos_historial.filter((linea: { comentario: any; estado: EstadosDealleSolicitud; }) =>linea.estado != EstadosDealleSolicitud.PAUSADO && linea.comentario!=null);
                      if(historial.length>0){
                        this.messageService.add({severity:'warn', summary: '!Advertencia¡', detail:` ${this.functionsService.bufferToString(historial[historial.length-1].comentario)}`});
                      }
                  }
                  
                

                  ////////////////// ////////////// ////console.log(this.estado);
                  /*
                  let pedidosTurno:any[] = turno.detalle_solicitud_turnos_pedido;
                  let clientesTurno:any[] = [];
                  pedidosTurno.forEach(async pedido=>{
                    if(clientesTurno.filter(cliente=>cliente.CardCode === pedido.CardCode).length==0){
                      let EmailAddress = "";
                      let usuarioCliente = await this.usuariosService.infoUsuarioByCardCode(pedido.CardCode);
                      ////////////////// ////////////// ////console.log('usuarioCliente',usuarioCliente);
                      if(usuarioCliente!=false){
                        EmailAddress = usuarioCliente.email;
                        //////////////// ////////////// ////console.log('usuarioCliente.email',usuarioCliente.email);
                      }
                      
                      clientesTurno.push({
                          CardCode:pedido.CardCode,
                          CardName:pedido.CardName,
                          EmailAddress
                        });
                    }
                  });

                  //////////////// ////////////// ////console.log('clientesTurno',clientesTurno);
                  
                  let turno2:any = {
                    conductor:this.conductorSeleccionado,
                    estado:this.estado,
                    fechacita:new Date(this.fechacargue).toLocaleDateString(),
                    horacita: new Date(this.horacargue).toLocaleTimeString(),
                    id:this.turnoId,
                    locacion:this.localidad,
                    lugarentrega:'',
                    municipioentrega:'',
                    observacion:'',
                    peso_vacio:this.peso_bruto,
                    transportadora:this.transportadoraSeleccionada,
                    vehiculo:this.vehiculoSeleccionado,
                    detalle_solicitud_turnos_pedido:this.pedidosTurno
                  }

                  //////////////// ////////////// ////console.log('turno2',turno2);*/
                  
                  this.configTablePedidosAlmacenCliente();
                  this.configSplitButton(this.estado,this.permisosModulo);
              },
              error:(err)=>{
                console.error(err);
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});

              }
        });


  }


  async validarEditarCampoCantidad():Promise<boolean> {
    let editable = false;
   ////// ////////////// ////console.log(this.estado,this.updatePedidosTurno);

    if((this.estado === this.estadosTurno.SOLICITADO || this.estado === this.estadosTurno.AUTORIZADO || this.estado === this.estadosTurno.ARRIBO ) && this.updatePedidosTurno){
          editable = true;
    }
    return editable;
  }

  async setObservacionesCargue(observacionesTurno:string): Promise<any[]> {

    let observacionesCargue:any[] = [];

    observacionesCargue = observacionesTurno.split(";").filter((observacion: string)=>observacion !='');
    //this.observaciones = observacionesTurno;

    return observacionesCargue

  }

  async calcularDisponibilidadPedido(pedidosTurno:any):Promise<any[]>{
    
    for(let pedido of pedidosTurno){
      //////////////////////////// ////////////// ////console.log(pedido);
      let cantidadComprometida = 0;
      cantidadComprometida = await this.getCantidadComprometidaItemPedido(pedido.pedidonum,pedido.itemcode,pedido.bodega, pedido.id);
      //////////////////////// ////////////// ////console.log('cantidadComprometida',cantidadComprometida , new Date());
      pedido.comprometida= cantidadComprometida;
      pedido.cantidadbodega = await this.getInventarioItenBodega(pedido.itemcode,pedido.bodega);
      //////////////////////// ////////////// ////console.log('pedido.cantidadbodega',pedido.cantidadbodega , new Date());
      pedido.disponible = (pedido.cantidadbodega-cantidadComprometida)<0?0:(pedido.cantidadbodega-cantidadComprometida);
      
      
    }

    return pedidosTurno
  }

  async getCantidadComprometidaItemPedido(pedido:any, itemcode:string, bodega:string, idPedido:number):Promise<number>{
    
    const cantidadComprometida$ = this.pedidosService.getCantidadesComprometidasItemBodega(itemcode,bodega, idPedido);
    const cantidadComprometida = await lastValueFrom(cantidadComprometida$);
  
    return cantidadComprometida;
  
  
  }

  async getInventarioItenBodega(itemcode:string, bodega:string): Promise<any>{
    const inventariosItemBodega$ = this.pedidosService.getInventarioItenBodega();
    const inventariosItemBodega = await lastValueFrom(inventariosItemBodega$);
    
    ////////////////////////////// ////////////// ////console.log(inventarioItemBodega);
    const arrayInventariosItemBodega = await this.objectToArray(inventariosItemBodega);
    

    const inventarioItemBodega:any[] = arrayInventariosItemBodega.filter((inventario: { ItemCode: string; 
                                                                                  WhsCode: string; 
                                                                                }) => inventario.ItemCode == itemcode && 
                                                                                      inventario.WhsCode == bodega);
    //////////////////////////// ////////////// ////console.log(inventarioItemBodega);                                                                                  

    let cantidadInventarioItenBodega:number = 0;
    
     inventarioItemBodega.forEach(function(a){cantidadInventarioItenBodega += parseFloat(a.OnHand);});

    //////////////////////////// ////////////// ////console.log(cantidadInventarioItenBodega);    
  
    return cantidadInventarioItenBodega;
  }

  async obtenerDiasNoAtencion(horarios:any[]):Promise<any[]>{
    let diasNoAtencion:any[] = this.functionsService.dias;
      
      for(let horario of horarios){
        let diasNot:any[] = [];
        let diasAtencionLocacion:any[] = horario.dias_atencion.split(',');
        ////////////////// ////////////// ////console.log(diasAtencionLocacion);
        for(let dia of diasNoAtencion){
          ////////////////// ////////////// ////console.log(diasAtencionLocacion.includes(dia.fullname));
  
          if(!diasAtencionLocacion.includes(dia.fullname)){
              diasNot.push(dia);
          }
          ////////////////// ////////////// ////console.log(dia.fullname,JSON.stringify(diasNot));
        }
        
        diasNoAtencion = diasNot;
      }
  
     // //////////////// ////////////// ////console.log(diasNoAtencion.map((dia)=>{ return dia.id}));
  
    return diasNoAtencion.map((dia)=>{ return dia.id});
  }

  async seleccionarFechaCita():Promise<void>{
  
    let diasSemana = this.functionsService.dias;
    let diaSeleccionado = diasSemana.find(diaSemana => diaSemana.id === this.fechacargue.getUTCDay());
    let horariosSeleccionados = this.horariosLocacion.filter(horario=>horario.dias_atencion.includes(diaSeleccionado.fullname));
    //let horarioSeleccionados:any[] = [];
    this.horariosSeleccionados = horariosSeleccionados;
  
    /*for(let horario of this.horariosLocacion){
      //////////////// ////////////// ////console.log(horario.dias_atencion.includes(diaSeleccionado.fullname));
    }*/
    //////////////// ////////////// ////console.log(this.fechacargue.getUTCDay(), diasSemana,diaSeleccionado,this.horariosLocacion,horariosSeleccionados);
    await this.cambioHoraCita();
  }

  configTablePedidosAlmacenCliente(){
    
    let headersTable:any= this.configHeadersPedidos();
    let dataTable:any = this.configDataTablePedidos(this.pedidosTurno);
    
    this.tablaPedidosTurno = {
      header: headersTable,
      data: dataTable
    }

    this.loadingPedidosTurno = false;
  }



   configHeadersPedidos(){
    let headersTable:any[] = [
      {
        'index': { label:'',type:'', sizeCol:'0rem', align:'center', editable:false},
        'CardName': { label:'Cliente',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'CardName'},
        'docnum': { label:'Número pedido',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'docnum'},
        
        //'docdate': {label:'Fecha de contabilización',type:'date', sizeCol:'6rem',  align:'center', editable:false},
        //'duedate': {label:'Fecha de vencimiento',type:'date', sizeCol:'6rem', align:'center', editable:false},
        //'estado_doc': {label:'Estado pedido',type:'text', sizeCol:'6rem', align:'center'},
        //'estado_linea': {label:'Estado Linea',type:'text', sizeCol:'6rem', align:'center', visible:false,},
        
        //'dias': {label:'Dias',type:'number', sizeCol:'6rem', align:'center',visible:false,},
        'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',field:'itemcode'},
        'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'itemname'},
        'almacen': {label:'Almacen.',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'almacen'},
        'cantidad_pedido': {label:'Cantidad pedido',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,field:'cantidad_pedido'},
        'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:this.editCantidad,field:'cantidad'},
        'comprometida': {label:'Cantidad comprometida',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,field:'comprometida'},
        'cantidadbodega': {label:'Cantidad en bodega',type:'number', sizeCol:'6rem', align:'center',currency:"TON", side:"rigth", editable:false,field:'cantidadbodega'},
        'disponible': {label:'Disponible para cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON", side:"rigth", editable:false,field:'disponible'},
        'lugarentrega':{label:'Lugar entrega',type:'text', sizeCol:'8rem', align:'left', editable:false,field:'lugarentrega'},
        

        //'remision':{label:'# Remision',type:'text', sizeCol:'8rem', align:'left', editable:false}, 
        
        
      }];

      if(this.estado === this.estadosTurno.PESADOF || this.estado === this.estadosTurno.DESPACHADO){
        
        headersTable[0].remision = {label:'# Remision',type:'number', sizeCol:'8rem', align:'left', editable:(this.estado === this.estadosTurno.PESADOF?true:false),field:'remision'}
      }


      
      return headersTable;
  }

 
  
  configDataTablePedidos(arregloPedido:any){

      ////// ////////////// ////console.log('arregloPedido',arregloPedido);
      let totalCarga:number=0;
      let dataTable:any[] = [];
      let index:number = 0;
      for (let pedido of arregloPedido){
        
        if(pedido.estado === 'A'){
          let lineaPedido:any = {
            index:pedido.id,
            CardName:pedido.CardName,
            docnum:pedido.pedidonum,
            
            itemcode:pedido.itemcode,
            itemname:pedido.itemname,
            almacen:pedido.bodega,
            //cantidad_pedido:(pedido.cantidad_pedido-pedido.cantidad)<=0?pedido.cantidad_pedido:(pedido.cantidad_pedido-pedido.cantidad),
            cantidad_pedido:(pedido.cantidad_pedido),
            cantidad:pedido.cantidad,
            comprometida:pedido.comprometida,
            cantidadbodega:pedido.cantidadbodega,
            disponible:pedido.disponible,
            lugarentrega:`${pedido.municipioentrega} - ${pedido.lugarentrega}`,
          }
  
          if(this.estado === this.estadosTurno.PESADOF || this.estado === this.estadosTurno.DESPACHADO){
            lineaPedido.remision =  pedido.remision;
          }
  
          dataTable.push(lineaPedido);
  
          
          index++;
          if(!pedido.itemcode.toLowerCase().startsWith("sf")){
            totalCarga+=parseFloat(pedido.cantidad); 
          }
          this.cantidad = totalCarga;
          //
          //this.totalCarga = totalCarga;
          //this.cantidad =totalCarga;
        }
      } 
      
      return dataTable;
  }

  configTableCambioPedidosBodega(){
    
    let headersTable:any= this.configHeadersPedidos();
    let dataTable:any = this.configDataTablePedidos(this.pedidosCambioBodegaTurno);
    
    this.tablaCambioBodegaPedidosTurno = {
      header: headersTable,
      data: dataTable
    }

    this.loadingCambioBodegaPedidosTurno = false;
  }

  async configSplitButton(estadoActual:string, permisosModulo:any){
    //////////////////////// ////////////// ////console.log(estadoActual,permisosModulo);

    this.arrayBtnTurnos = [];

    switch(estadoActual){
      case this.estadosTurno.SOLICITADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Aprobar turno').valor){
          this.arrayBtnTurnos.push(this.btnAprobar);
        }

        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Solicitar inventario').valor){
          this.arrayBtnTurnos.push(this.btnSolRevInv);
        }
        
        if(this.updateModulo){
         // this.arrayBtnTurnos.push(this.btnUpdateInfo);
          this.arrayBtnTurnos.push(this.btnCambioBodega);
        }

        if(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.PLANIFICADOR) && this.updateModulo){
          this.arrayBtnTurnos.push(this.btnUpdateInfo);
        }
        
      break;

      case this.estadosTurno.SOLINVENTARIO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Validar inventario').valor){
          this.arrayBtnTurnos.push(this.btnValidInv);
        }
      break;

      case this.estadosTurno.PAUSADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Activar turno').valor){
          this.arrayBtnTurnos.push(this.btnActivar);
        }

        //////console.log(this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; }) => historial.estado == EstadosDealleSolicitud.AUTORIZADO).length);
        //////console.log(this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; }) => historial.estado == EstadosDealleSolicitud.ARRIBO ).length);

        if(this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; }) => historial.estado == EstadosDealleSolicitud.AUTORIZADO).length >0 &&
           this.turno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; }) => historial.estado == EstadosDealleSolicitud.ARRIBO ).length == 0){
            if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Activar turno APNI').valor){
              this.arrayBtnTurnos.push(this.btnActivar);
            }
        }
      break;

      case this.estadosTurno.AUTORIZADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Ingresar turno').valor){
          this.arrayBtnTurnos.push(this.btnIngreso);
        }
        
        if(this.updateModulo){
          //this.arrayBtnTurnos.push(this.btnUpdateInfo);
          this.arrayBtnTurnos.push(this.btnCambioBodega);
        }

        if(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.PLANIFICADOR) && this.updateModulo){
          this.arrayBtnTurnos.push(this.btnUpdateInfo);
        }
        
      break;

      case this.estadosTurno.ARRIBO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Pesar en bascula').valor){
          this.arrayBtnTurnos.push(this.btnPeso);
        }

        if(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.PLANIFICADOR) && this.updateModulo){
          this.arrayBtnTurnos.push(this.btnUpdateInfo);
        }
      break;

      case this.estadosTurno.PESADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Inicio cargue').valor){
          this.arrayBtnTurnos.push(this.btnCargue);
        }

        if(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.PLANIFICADOR) && this.updateModulo){
          this.arrayBtnTurnos.push(this.btnUpdateInfo);
        }
      break;

      case this.estadosTurno.CARGANDO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Fin cargue').valor){
          this.arrayBtnTurnos.push(this.btnFinCargue);
        }

        if(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.PLANIFICADOR) && this.updateModulo){
          this.arrayBtnTurnos.push(this.btnUpdateInfo);
        }
      break;
      
      case this.estadosTurno.CARGADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Pesaje final').valor){
            this.arrayBtnTurnos.push(this.btnPesoFinal);
        }

        if(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.PLANIFICADOR) && this.updateModulo){
          this.arrayBtnTurnos.push(this.btnUpdateInfo);
        }
      break;

      case this.estadosTurno.PESADOF:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Despachar').valor){
            this.arrayBtnTurnos.push(this.btnDespachar);
        }

        if(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.PLANIFICADOR) && this.updateModulo){
          this.arrayBtnTurnos.push(this.btnUpdateInfo);
        }
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


  
  async cambioHoraCita():Promise<void>{
    //////////////// ////////////// ////console.log(this.horacargue.toLocaleTimeString());
    if(await this.validarHoraCargue()){
      //////////////// ////////////// ////console.log('hora valida en horario ');
    }else{
      //////////////// ////////////// ////console.log('hora invalida en horario');
    }
  }

  
async validarHoraCargue():Promise<boolean>{
  let horarioValido:boolean = true;

  for(let horario of this.horariosSeleccionados){
    //////////////// ////////////// ////console.log(new Date(new Date().setHours(horario.horainicio.split(':')[0],horario.horainicio.split(':')[1],horario.horainicio.split(':')[2])));
    //////////////// ////////////// ////console.log(new Date(new Date().setHours(horario.horafin.split(':')[0],horario.horafin.split(':')[1],horario.horafin.split(':')[2])));
    
    //////////////// ////////////// ////console.log(parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[0]));

    //////////////// ////////////// ////console.log(new Date(new Date().setHours(parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[2]))));

    let horainicio = new Date(new Date().setHours(horario.horainicio.split(':')[0],horario.horainicio.split(':')[1],horario.horainicio.split(':')[2]));
    let horafin = new Date(new Date().setHours(horario.horafin.split(':')[0],horario.horafin.split(':')[1],horario.horafin.split(':')[2]));
    let horacargue = new Date(new Date().setHours(parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[2])));

    if(horainicio<= horacargue && horafin >= horacargue){
      //////////////// ////////////// ////console.log('hora valida en horario id '+horario.id);
    }else{
      //////////////// ////////////// ////console.log('hora invalida en horario id '+horario.id);
      horarioValido = false;
    }
  }

  return horarioValido;
}




  filtrarVehiculo(event:any){
    //TODO: quitar del listado de vehiculos los vehiculos que ya esten asociados a la solicitud en curso
    
    let vehiculosAfiltrar:any[] = [];
    for(let vehiculo of this.vehiculos){
      if(vehiculo.code !== this.placa){
        vehiculosAfiltrar.push(vehiculo);
      }
    }
    this.vehiculosFiltrados = this.filter(event,vehiculosAfiltrar);
    this.vehiculosFiltrados.unshift({
      id:0, code: "Nuevo", name: "Nuevo", label:"+ Nuevo vehículo"
    });
    ////////////////////////////// ////////////// ////console.log(this.vehiculosFiltrados);
  }
  
  filtrarConductor(event:any){
    let conductoresAfiltrar:any[] = [];
    for(let conductor of this.conductores){
      if(conductor.label!= this.conductor ){
        conductoresAfiltrar.push(conductor);
      }
    }
    this.conductoresFiltrados = this.filter(event,conductoresAfiltrar);
    this.conductoresFiltrados.unshift({
      id:0, code: "Nuevo", name: "Nuevo", label:"+ Nuevo conductor"
    });
  }
  
  filtrarTransportadora(event:any){
    let transportadorasAfiltrar:any[] = [];
    for(let transportadora of this.transportadoras){
     // if(transportadora.label!= this.transportadora ){
        transportadorasAfiltrar.push(transportadora);
     // }
        
    }
    this.transportadorasFiltrados = this.filter(event,transportadorasAfiltrar);
    this.transportadorasFiltrados.unshift({
      id:0, code: "Nuevo", name: "Nuevo", label:"+ Nueva transportadora"
    });
  }
  
  seleccionarTransportadora(transportadoraSeleccionada:any){
    if(transportadoraSeleccionada.id == 0){
      //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
      this.nuevaTransportadora();
    }else{
    }
  }
  
  async seleccionarVehiculo(vehiculoSeleccionado:any){

    // ////console.log(vehiculoSeleccionado);
  
    if(vehiculoSeleccionado.id == 0){
        //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
        this.nuevoVehiculo();
    }else{
        //////////////////// ////////////// ////console.log(vehiculoSeleccionado)
        if(vehiculoSeleccionado.tipo_vehiculo.capacidad < this.cantidad ){
          //error cantidad a cargar mayor a la capacidad del vehiculo
          this.messageService.add({severity:'error', summary: '!Error¡', detail:`La cantidad a cargar es mayor a la capacidad del vehículo`});
        }

        this.peso_bruto = vehiculoSeleccionado.pesovacio;
        if(vehiculoSeleccionado.tipo_vehiculo.pesomax < (this.cantidad+this.peso_bruto)){
          //error cantidad a cargar mayor a la capacidad del vehiculo
          this.messageService.add({severity:'error', summary: '!Error¡', detail:`El peso neto a cargar es mayor al peso neto permitido`});
        }

         //seleccionar vehiculo
         this.tipo = vehiculoSeleccionado.clase.tipo;
         this.capacidadvh = vehiculoSeleccionado.capacidad;
         this.pesomax = vehiculoSeleccionado.pesomax;

        

    }
  
  }

  /*async asignarVehiculo(code:string):Promise<any>{
    let vehiculoSeleccionado:any =this.vehiculos.find(vehiculo=>vehiculo.code == code);
    ////////////////// ////////////// ////console.log(this.vehiculos,vehiculoSeleccionado,code);

    return vehiculoSeleccionado;
  }*/

  seleccionarConductor(conductorSeleccionado:any){
    //////////////// ////////////// ////console.log(conductorSeleccionado)
    if(conductorSeleccionado.id == 0){
      //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
      this.nuevoConductor();
    }else{
      //////////////////////// ////////////// ////console.log(conductorSeleccionado);

      this.telefono = conductorSeleccionado.numerotelefono;
      this.celular = conductorSeleccionado.numerocelular;
      this.email = conductorSeleccionado.email;

    }
  }
  
  nuevaTransportadora(){
    const ref = this.dialogService.open(FormTransportadoraComponent, {
      data: {
          id: parseInt('0')
      },
      header: `Nueva transportadora` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async () => {
      await this.getTransportadoras();
      ////////////////////////////// ////////////// ////console.log("Refresh calendar");
    });
  }
  
  nuevoVehiculo(){
    const ref = this.dialogService.open(FormVehiculoComponent, {
      data: {
          id: parseInt('0')
      },
      header: `Nuevo Vehículo` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async () => {
      await this.getVehiculos();
      ////////////////////////////// ////////////// ////console.log("Refresh calendar");
    });
  }
  
  nuevoConductor(){
    const ref = this.dialogService.open(FormConductorComponent, {
      data: {
          id: parseInt('0')
      },
      header: `Nuevo Conductor` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async () => {
      await this.getConductores();
      ////////////////////////////// ////////////// ////console.log("Refresh calendar");
    });
  }

 

 

  editarComentario(){
    this.formComentarioTurno = true;
  }

  async agregarComentario(){
    let comentarios:string = this.observacionesCargue.join(";")+`;${this.nuevoComentario}`;
    this.observacionesCargue = await this.setObservacionesCargue(comentarios);
    this.nuevoComentario = "";
   


  }

  async borrarComentario(event:any){
    let index = this.observacionesCargue.indexOf(event);
    this.observacionesCargue.splice(index,1);
  }

  actualizarComentario(){

  }

  
  async objectToArray(object:any): Promise<any>{
      let array:any[] = [];

      //Object.keys(object).map((key) => { //////////////////////////// ////////////// ////console.log(object[key])});
      //array = Object.keys(object).map((key) => [Number(key), object[key]]);

      array = Object.keys(object).map((key) => object[key]);

      return array;
    
  }

  filtrarEstado(event:any){
    let estadosAfiltrar:any[] = [];
    for(let conductor of this.estados){
      estadosAfiltrar.push(conductor);
    }
    this.estadosFiltrados = this.filter(event,estadosAfiltrar);
    
  }

  seleccionarEstado(estado:any){

  }

  filter(event: any, arrayFiltrar:any[]) {

    //////////////////////////////// ////////////// ////console.log(arrayFiltrar);
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < arrayFiltrar.length; i++) {
        const linea = arrayFiltrar[i];
        if (linea.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            filtered.push(linea);
        }
    }
    return filtered;
    }
    
  setTimer(){
      if(this.completeCargue){
        this.displayModal = false;
      }
      this.completeTimer = true;
  }
/*
 async grabar(){



    this.grabarCambios =true;

    ////////////////////// ////////////// ////console.log(this.transportadoraSeleccionada, this.vehiculoSeleccionado, this.conductorSeleccionado);


    if(await this.validarFormulario()){
      

      this.confirmationService.confirm({
        message: 'Esta seguro de grabar los cambios realizados en la orden de cargue No. '+this.turnoId+'?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          this.displayModal = true;
          this.loadingCargue = true;
          this.completeCargue=false;
          this.completeTimer = false;
          //setTimeout(()=>{this.setTimer()},2500);
          const data:any = {
            fechacita:new Date(this.fechacargue),
            horacita:new Date(this.horacargue),
            estado: this.estado,
            transportadora:this.transportadoraSeleccionada.id,
            vehiculo: this.vehiculoSeleccionado.id,
            conductor:this.conductorSeleccionado.id,
            peso_vacio:this.peso_bruto
          }

          //////////////////////////// ////////////// ////console.log(data);
          this.solicitudTurnoService.updateInfoTruno(this.turnoId,data)
          .subscribe({
                next:(reuslt)=>{
                  //if(this.completeTimer){
                    this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha actualizado correctamente los cambios efectuados a la orden de cargue ${this.turnoId}.`});
                    this.displayModal = false;
                    this.loadingCargue = false;
                    
                  //}
                  this.completeCargue = true;
                  this.messageComplete = `Se ha actualizado correctamente los cambios efectuados a la orden de cargue ${this.turnoId}.`;
                
                },
                error:(err)=> {
                  this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                    console.error(err);
                    this.displayModal = false;
                    this.loadingCargue = false;
                    
                },
          });


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

  */

  cerrar(){
    this.ref.close();
  }


 
  
  
  historialTurno(idTutno?:any){
    //this.formHistorialTurno= true;

    const ref = this.dialogService.open(ListaHistorialTurnoComponent, {
      data: {
          id: (idTutno)
      },
      header: `Historial Orden de cargue: ${idTutno}` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });

    ref.onClose.subscribe(() => {
      //this.getTurnosPorLocalidad(this.localidadSeleccionada.code)
      //this.getCalendar();
      //////////////////// ////////////// ////console.log(("Refresh calendar");
    });


  }

  async aprobarTurno(){
    if(await this.validarFormulario()){
      this.accion = 'aprobar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Aprobar turno "+this.turnoId;
    }
  }

  async pausarTurno(){
    if(await this.validarFormulario()){
      this.accion = 'pausar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Pausar turno "+this.turnoId;
      this.novedad = true;
    }
  }
  async activarTurno(){
    if(await this.validarFormulario()){
      this.accion = 'activar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Activar turno "+this.turnoId;
    }
  }
  async cancelarTurno(){
    
      this.accion = 'cancelar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Cancelar turno "+this.turnoId;
      this.novedad = true;
    
  }
  async ingresarTurno(){
    if(await this.validarFormulario()){
      this.accion = 'ingresar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Ingresar turno "+this.turnoId;
    }
  }
  async pesarTurno(){
    if(await this.validarFormulario()){
      this.accion = 'pesar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Pesar turno "+this.turnoId;
    }
  }
  async inicioCargueTurno(){
    if(await this.validarFormulario()){
      this.accion = 'cargar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Cargar turno "+this.turnoId;
    }
  }
  async finalizarCargueTurno(){
    if(await this.validarFormulario()){
      this.accion = 'finalizar cargue de'
      this.formEstadoTurno = true;
      this.tituloEstado = "Finalizar cargue turno "+this.turnoId;
    }
  }
  async pesarTurno2(){
    if(await this.validarFormulario()){
      this.accion = 'realizar pesaje final a'
      this.formEstadoTurno = true;
      this.tituloEstado = "Pesar turno "+this.turnoId;
    }
  }

  async despacharTurno(){
    if(await this.validarFormulario()){
      this.accion = 'despachar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Despachar turno "+this.turnoId;
    }
  }

  async solicitarInventarioTurno(){
    if(await this.validarFormulario()){
      this.accion = 'solicitud produccion'
      this.formEstadoTurno = true;
      this.tituloEstado = "Solicitud producción items turno "+this.turnoId;
    }
  }

  async validarInventarioTurno(){
    if(await this.validarFormulario()){
      this.accion = 'validar revision inventario'
      this.formEstadoTurno = true;
      this.tituloEstado = "Validar revisión de inventario items turno "+this.turnoId;
    }
  }

  async updateInfoTurno(){
    if(await this.validarFormulario()){
      this.accion = 'actualizar la información del turno y reestablecer el estado  de '
      //this.formEstadoTurno = true;
      this.tituloEstado = "actualizar la información del turno y reestablecer el estado  de ";
      
      this.cambiarEstadoTurno();
    }
  }

  
  cambioDisponibilidad(){
 
  }

  seleccionarTS(){
    // ////////////// ////console.log(this.solictudProduccionSeleccionada)
  }

  cambiarEstadoTurno(){

    if((this.accion == 'pausar' ||  this.accion == 'cancelar' ) && ( this.novedadesSeleccionadas.length==0)){
      this.messageService.add({severity:'error', summary: '!Error¡', detail: `Para ${this.accion} el turno, debe seleccionar una novedad.` });
    }else if((this.accion == 'solicitud produccion' ) && ( this.solictudProduccionSeleccionada.length==0)){
      this.messageService.add({severity:'error', summary: '!Error¡', detail: `Para la accion de ${this.accion}, debe seleccionar el tipo de solicitud.` });
    }else if((this.accion == 'validar revision inventario' ) && ( !this.comentario)){
      this.messageService.add({severity:'error', summary: '!Error¡', detail: `Para la accion de ${this.accion}, debe ingesar un comentario.` });
    }else{
      this.confirmationService.confirm({
        message: 'Esta seguro de '+this.accion+' la orden de cargue No. '+this.turnoId+'?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
  
            let data:any = await this.configDataTurno();
            //////// ////console.log(data);
            this.updateTurno(data);
  
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

  async configDataTurno():Promise<any> {
    

    let nuevoEstado = "";
            let mensaje ="";
  
              switch(this.accion){
                  case 'aprobar':
                    nuevoEstado = this.estadosTurno.AUTORIZADO;
                    mensaje = `fue aprobado`;
                  break;

                  case 'solicitud produccion':
                    nuevoEstado = this.estadosTurno.SOLINVENTARIO;
                    mensaje = `fue solicitado validacion a producción`;
                  break;

                  case 'validar revision inventario':
                    nuevoEstado = this.estadosTurno.VALINVENTARIO;
                    mensaje = `fue validado el inventario`;
                  break;
  
                  case 'pausar':
                    nuevoEstado = this.estadosTurno.PAUSADO;
                    mensaje = `ha sido pausado debido a ${this.novedadesSeleccionadas.length>1?'las sguientes novedades':'la siguiente novedad'}: ${this.novedadesSeleccionadas.map((novedad)=>{return novedad.label }).toString()}`;
                  break;
  
                  case 'activar':
                    nuevoEstado =  this.estadosTurno.ACTIVADO;
                    mensaje = `fue activado`;
                  break;
                
                  case 'ingresar':
                    nuevoEstado = this.estadosTurno.ARRIBO;
                    mensaje = `ingreso a las instalaciones: ${this.localidad}`;
                  break;
  
                  case 'pesar':
                    nuevoEstado = this.estadosTurno.PESADO;
                    mensaje = `ha sido pesado. El peso vacio del  vehiculo ${this.vehiculoSeleccionado.placa} fue de  ${this.peso_bruto} TON`;
                  break;
  
                  case 'cargar':
                    nuevoEstado = this.estadosTurno.CARGANDO;
                    mensaje = `ha iniciado el cargue`;
                  break;
  
                  case 'finalizar cargue de':
                    nuevoEstado = this.estadosTurno.CARGADO;
                    mensaje = `ha sido cargado`;
                  break;

                  case 'realizar pesaje final a':
                    nuevoEstado = this.estadosTurno.PESADOF;
                    mensaje = `ha sido pesado`;
                  break;
  
                  case 'despachar':
                    nuevoEstado = this.estadosTurno.DESPACHADO;
                    mensaje = `ha sido despachado`;
                  break;
  
                  case 'cancelar':
                    nuevoEstado = this.estadosTurno.CANCELADO;
                    mensaje = `ha sido cancelado`;
                  break;

                  case 'actualizar la información del turno y reestablecer el estado  de ':
                    nuevoEstado = this.estadosTurno.SOLICITADO;
                    mensaje = `ha sido actualizado y se reestablecio su estado`;
                    this.comentario = mensaje;
                  break;
              }
  
           
  
            this.displayModal = true;
            this.loadingCargue = true;

            let data:any = {
              historial : {
                            estado:nuevoEstado,
                            fechaaccion:this.fechaaccion,
                            horaaccion:this.horaaccion,
                            comentario:this.comentario
                          }
            };

            if(this.estado===this.estadosTurno.SOLINVENTARIO){
              //////// ////////////// ////console.log(this.existeInventario);
              data.historial.disponibilidad = this.existeInventario;
              data.historial.fechadisponibilidad = this.fechadisponibilidad;
            }

            if(nuevoEstado == this.estadosTurno.SOLINVENTARIO){
              data.historial.tipo_solicitud = this.solictudProduccionSeleccionada.code
            }

            if(this.novedadesSeleccionadas.length>0){
              data.historial.novedades = this.novedadesSeleccionadas;
            }
            
            if(this.updateModulo){
                let horacargue = `${this.fechacargue.toISOString().split("T")[0]}T${this.horacargue.toISOString().split("T")[1]}`;
                data.fechacita = new Date(this.fechacargue);
                data.horacita = new Date(horacargue);
                //data.estado = this.estado;
                data.transportadora = this.transportadoraSeleccionada.id;
                data.vehiculo = this.vehiculoSeleccionado.id;
                data.conductor = this.conductorSeleccionado.id;
                data.peso_vacio = this.peso_bruto;
                data.peso_neto = this.peso_neto;
                data.adicional = this.adicional;
                
                //data.pedidos_detalle_solicitud = this.tablaPedidosTurno.data;
                data.pedidos_detalle_solicitud = this.pedidosTurno;
                
                //if(this.remision){
                //  data.remision = this.remision;
                //}

                if(this.observacionesCargue.length > 0){
                  data.observacion = this.observacionesCargue.join(';');
                }
              
            }
            
           // ////console.log('Data update turno',data);

    return data;
  }

  updateTurno(data:any){
    this.solicitudTurnoService.updateInfoTruno(this.turnoId,data)
              .subscribe({
                    next:async (turno)=>{
                        //////console.log("turno actualizado",turno);
                        this.pedidosTurno.map((pedido)=>{
                          pedido.lineaUpdate = {update:false, create:false};
                          
                        });

                        if(this.updateModulo){
                          this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha actualizado correctamente los cambios efectuados a la orden de cargue ${turno.id}.`});
                        }

                        this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el cambio del estado.`});
                        this.displayModal = false;
                        this.loadingCargue = false;
                        this.formEstadoTurno = false;
                        this.estado = turno.estado

                        if(turno.estado===this.estadosTurno.VALINVENTARIO){
                            

                            let newEstado:any = {
                              historial : {
                                            estado:this.estadosTurno.SOLICITADO,
                                            fechaaccion:this.fechaaccion,
                                            horaaccion:this.horaaccion,
                                            comentario:`Se realizo validación del inventario de los items del turno, dispnibilidad:${data.historial.disponibilidad.toLowerCase()}, Fecha:${data.historial.fechadisponibilidad.toLocaleDateString()}`
                                          }
                            };

                            this.solicitudTurnoService.updateInfoTruno(this.turnoId,newEstado)
                            .subscribe({
                                  next:async (turno)=>{
                                    this.estado = turno.estado
                                   
                                  },  
                                  error:(err)=> {
                                    this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                                      console.error(err);
                                      this.displayModal = false;
                                      this.loadingCargue = false;
                                      
                                  }
                            });
                        }
      
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
                      

                    },
                    error:(err)=> {
                      this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});
                        console.error(err);
                        this.displayModal = false;
                        this.loadingCargue = false;
                        
                    }
              });
              
  }



  async emailsClientes(turno:any,mensaje:string):Promise<void> {
    if(turno.estado === EstadosDealleSolicitud.AUTORIZADO || turno.estado === EstadosDealleSolicitud.PAUSADO || turno.estado === EstadosDealleSolicitud.DESPACHADO){
      let turnosCliente:any[] = []; 

      turno.detalle_solicitud_turnos_pedido.forEach((pedido: { CardCode: any; itemcode: string; cantidad: any; CardName: any; })=>{
          ////////////////// ////////////// ////console.log(turno.id, pedido.CardCode);
            let email_cliente = this.turno.solicitud.clientes.find((cliente: { CardCode: any; })=>cliente.CardCode === pedido.CardCode).EmailAddress;
            if(turnosCliente.filter(cliente=>cliente.codigo===pedido.CardCode).length === 0){
    
                let turnoCliente:any;
    
                turnoCliente ={
                  id:turno.id,
                  estado:turno.estado,
                  fechacita:new Date(turno.fechacita).toLocaleDateString(),
                  horacita:new Date(turno.horacita).toLocaleTimeString(),
                  locacion:turno.locacion,
                  nombreLocacion:turno.nombreLocacion,
                  direccionLocacion: turno.direccionLocacion,
                  ubicacionLocacion:turno.ubicacionLocacion,
                  horariosLocacion:turno.horariosLocacion,
                  lugarentrega:turno.lugarentrega,
                  municipioentrega:turno.municipioentrega,
                  observacion:turno.observacion,
                  detalle_solicitud_turnos_pedido:[pedido],
                  toneladas_turno: !pedido.itemcode.toLowerCase().startsWith("sf")?pedido.cantidad:0,
                  transportadora:turno.transportadora,
                  vehiculo:turno.vehiculo,
                  conductor:turno.conductor,
                }
    
                turnosCliente.push({
                  codigo:pedido.CardCode,
                  nombre:pedido.CardName,
                  email:email_cliente,
                  tipo:'cliente',
    
                  turnos:[turnoCliente]
                });
            }else{
                
                let indexCliente = turnosCliente.findIndex(cliente=>cliente.codigo === pedido.CardCode);
                ////////////////// ////////////// ////console.log(turnosCliente[indexCliente]);
    
                if(turnosCliente[indexCliente].turnos.filter((turnoCliente: { id: number; })=>turnoCliente.id === turno.id).length ==0){
                  let turnoCliente:any;
                  turnoCliente ={
                    id:turno.id,
                    estado:turno.estado,
                    fechacita:new Date(turno.fechacita).toLocaleDateString(),
                    horacita:new Date(turno.horacita).toLocaleTimeString(),
                    locacion:turno.locacion,
                    nombreLocacion:turno.nombreLocacion,
                    direccionLocacion: turno.direccionLocacion,
                    ubicacionLocacion:turno.ubicacionLocacion,
                    horariosLocacion:turno.horariosLocacion,
                    lugarentrega:turno.lugarentrega,
                    municipioentrega:turno.municipioentrega,
                    observacion:turno.observacion,
                    detalle_solicitud_turnos_pedido:[pedido],
                    toneladas_turno: !pedido.itemcode.toLowerCase().startsWith("sf")?pedido.cantidad:0,
                    transportadora:turno.transportadora,
                    vehiculo:turno.vehiculo,
                    conductor:turno.conductor,
                  }
                  
                  turnosCliente[indexCliente].turnos.push(turnoCliente);
                }else{
                  let indexTurno = turnosCliente[indexCliente].turnos.findIndex((turnoCliente: { id: number; })=>turnoCliente.id === turno.id)
                  ////////////////// ////////////// ////console.log(turnosCliente[indexCliente].turnos[indexTurno]);
                  turnosCliente[indexCliente].turnos[indexTurno].detalle_solicitud_turnos_pedido.push(pedido);
                  if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                    turnosCliente[indexCliente].turnos[indexTurno].toneladas_turno+=pedido.cantidad;
                  }
                  
                }
                
            }
        });

        turnosCliente.forEach(async (cliente)=>{
          ////////////// ////////////// ////console.log('email cliente', cliente.email);
          //if(cliente.email!='' && cliente.email!=null){
      
            cliente.turnos.forEach(async (turnoCliente: any)=>{

              let objectMail = {
                //to:this.domain=='localhost'?'ralbor@nitrofert.com.co':cliente.email,
                to:'ralbor@nitrofert.com.co',
                subject:`Turno de cargue # ${turno.id}`,
                template:'./notificacion_cambio_turno',
                context:{
                            name:cliente.nombre,
                            turno_num:turno.id,
                            mensaje,
                            turno:turnoCliente
                            
                }         
              };
              //////// ////////////// ////console.log('objectMail Cliente',objectMail);
              ////////// ////////////// ////console.log(await this.functionsService.sendMail(objectMail));
              await this.functionsService.sendMail(objectMail)

            });
            
          //}
        });
        
    }
    
    
  }

  async emailsVendedores(turno:any, mensaje:string): Promise<void>{
    let turnosVendedor:any[] = []; 
   
      
      turno.detalle_solicitud_turnos_pedido.forEach((pedido: { email_vendedor: any; itemcode: string; cantidad: any; })=>{
        ////////////////// ////////////// ////console.log(turno.id, pedido.CardCode);
          if(turnosVendedor.filter(vendedor=>vendedor.codigo===pedido.email_vendedor).length === 0){
  
              let turnoVendedor:any;
              
  
              turnoVendedor ={
                id:turno.id,
                estado:turno.estado,
                fechacita:new Date(turno.fechacita).toLocaleDateString(),
                horacita:new Date(turno.horacita).toLocaleTimeString(),
                locacion:turno.locacion,
                nombreLocacion:turno.nombreLocacion,
                direccionLocaion: turno.direccionLocaion,
                ubicacionLocaion:turno.ubicacionLocaion,
                horariosLocacion:turno.horariosLocacion,
                lugarentrega:turno.lugarentrega,
                municipioentrega:turno.municipioentrega,
                observacion:turno.observacion,
                detalle_solicitud_turnos_pedido:[pedido],
                toneladas_turno: !pedido.itemcode.toLowerCase().startsWith("sf")?pedido.cantidad:0,
                transportadora:turno.transportadora,
                vehiculo:turno.vehiculo,
                conductor:turno.conductor,
              }
  
              turnosVendedor.push({
                codigo:pedido.email_vendedor,
                nombre:pedido.email_vendedor,
                email:pedido.email_vendedor,
                tipo:'vendedor',
                turnos:[turnoVendedor]
              });
          }else{
              
              let indexVendedor = turnosVendedor.findIndex(vendedor=>vendedor.codigo === pedido.email_vendedor);
              ////////////////// ////////////// ////console.log(turnosCliente[indexCliente]);
  
              if(turnosVendedor[indexVendedor].turnos.filter((turnoVendedor: { id: number; })=>turnoVendedor.id === turno.id).length ==0){
                let turnoVendedor:any;
                turnoVendedor ={
                  id:turno.id,
                  estado:turno.estado,
                  fechacita:new Date(turno.fechacita).toLocaleDateString(),
                  horacita:new Date(turno.horacita).toLocaleTimeString(),
                  locacion:turno.locacion,
                  nombreLocacion:turno.nombreLocacion,
                  direccionLocaion: turno.direccionLocaion,
                  ubicacionLocaion:turno.ubicacionLocaion,
                  horariosLocacion:turno.horariosLocacion,
                  lugarentrega:turno.lugarentrega,
                  municipioentrega:turno.municipioentrega,
                  observacion:turno.observacion,
                  detalle_solicitud_turnos_pedido:[pedido],
                  toneladas_turno: !pedido.itemcode.toLowerCase().startsWith("sf")?pedido.cantidad:0,
                  transportadora:turno.transportadora,
                  vehiculo:turno.vehiculo,
                  conductor:turno.conductor,
                }
                
                turnosVendedor[indexVendedor].turnos.push(turnoVendedor);
              }else{
                let indexTurno = turnosVendedor[indexVendedor].turnos.findIndex((turnoVendedor: { id: number; })=>turnoVendedor.id === turno.id)
                ////////////////// ////////////// ////console.log(turnosCliente[indexCliente].turnos[indexTurno]);
                turnosVendedor[indexVendedor].turnos[indexTurno].detalle_solicitud_turnos_pedido.push(pedido);
                if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                  turnosVendedor[indexVendedor].turnos[indexTurno].toneladas_turno+=pedido.cantidad;
                }
              }
              
          }
      })
      
    
  
    //////////////// ////////////// ////console.log(turnosVendedor);
  
    turnosVendedor.forEach(async (vendedor)=>{
      if(vendedor.email!='' && vendedor.email!=null){
        
        vendedor.turnos.forEach(async (turnoVendedor: any)=>{

          let objectMail = {
            to:this.domain=='localhost'?'ralbor@nitrofert.com.co':vendedor.email,
            //to:'ralbor@nitrofert.com.co',
            subject:`Turno de cargue # ${turno.id}`,
            template:'./notificacion_cambio_turno',
            context:{
                        name:vendedor.nombre,
                        turno_num:turno.id,
                        mensaje,
                        turno:turnoVendedor
                        
            }         
          };
          //////// ////////////// ////console.log('objectMail vendedor',objectMail);
          ////////////// ////////////// ////console.log(await this.functionsService.sendMail(objectMail));
          await this.functionsService.sendMail(objectMail)
        });


        
      }
    });
  }

  async emailBodegaEstado(turno:any,mensaje:string): Promise<void>{
   
    let emailBodega!:string;
    let locacion:any = turno.locacion;
  
    let emailsTurno = (await this.solicitudTurnoService.emailsTurno({estado_turno:turno.estado,locacion}))
                      .map((email: { email_responsable: any; }) => {return email.email_responsable});
  
    ////////////// ////////////// ////console.log('emailsTurno',emailsTurno.join());
  
    if(emailsTurno.join()!=''){
      emailBodega = emailsTurno.join();
    }
  
  
    if(emailBodega){
      
  
      let objectMail = {
        to:this.domain=='localhost'?'ralbor@nitrofert.com.co':emailBodega,
        //to:'ralbor@nitrofert.com.co',
        subject:`Turno de cargue # ${turno.id}`,
        template:'./notificacion_cambio_turno',
        context:{
                    name:emailBodega,
                    turno_num:turno.id,
                    mensaje,
                    turno:turno
                    
        }         
      };
      //////// ////////////// ////console.log('objectMail Bodega',objectMail);
      ////////////// ////////////// ////console.log(await this.functionsService.sendMail(objectMail));
      await this.functionsService.sendMail(objectMail)
  
    }
  }

  async emailTransp(turno:any, mensaje:string): Promise<void>{
    let objectMail = {
      to:this.domain=='localhost'?'ralbor@nitrofert.com.co':'turnostransporte@nitrofert.com.co',
      //to:'ralbor@nitrofert.com.co',
      subject:`Turno de cargue # ${turno.id}`,
      template:'./notificacion_cambio_turno',
      context:{
                  name:'Transporta sociedades',
                  turno_num:turno.id,
                  mensaje,
                  turno:turno
                  
      }         
    };
    ////////////// ////////////// ////console.log('objectMail Transporta sociedada',objectMail);
    ////////////// ////////////// ////console.log(await this.functionsService.sendMail(objectMail));
    await this.functionsService.sendMail(objectMail)
  }

  async emailCreador(turno:any,mensaje:string): Promise<void>{
    let infoUsuario = this.turno.solicitud.usuario;

    let objectMail = {
      //to:emailBodega,
      to:infoUsuario.email,
      subject:`Turno de cargue # ${turno.id}`,
      template:'./notificacion_cambio_turno',
      context:{
                  name:infoUsuario.nombrecompleto,
                  turno_num:turno.id,
                  mensaje,
                  turno:turno
                  
      }         
    };
    ////////////// ////////////// ////console.log('objectMail usuario creado',objectMail);
    ////////////// ////////////// ////console.log(await this.functionsService.sendMail(objectMail));
    await this.functionsService.sendMail(objectMail)

  }


  async configEmails(dataTurno:any, mensaje:string): Promise<void>{

    //////// ////////////// ////console.log(dataTurno,mensaje);

    //await this.emailsClientes(dataTurno,mensaje);
    //await this.emailsVendedores(dataTurno,mensaje);
    //await this.emailBodegaEstado(dataTurno,mensaje);
    if(this.condicion_tpt==="TRANSP"){
      //await this.emailTransp(dataTurno,mensaje);
    }
    //await this.emailCreador(dataTurno,mensaje);
    
   

  }

  cambioPesoBruto(event:any, peso:number){

    if(event.target.value ===''){
      event.target.value =0;
    }
    ////////////////// ////////////// ////console.log(peso, this.peso_bruto);
    this.peso_neto = this.cantidad+parseFloat(event.target.value)
    if(this.pesomax < (this.peso_neto)){
      //error cantidad a cargar mayor a la capacidad del vehiculo
      this.messageService.add({severity:'warn', summary: '!Error¡', detail:`El peso neto a cargar es mayor al peso neto permitido`});
    }

  }

  presionarEnterPesoBruto(event:any, peso:number){
    if (event.key === "Enter") {
      this.cambioPesoBruto(event,peso);
    }

  }

  async cambioPesoNeto(event:any, peso:number){

    if(event.target.value ===''){
      event.target.value =0;
    }
    ////////////// ////////////// ////console.log(peso, this.peso_bruto, parseFloat(event.target.value));
    this.cantidad = parseFloat(event.target.value)-this.peso_bruto;
    if(this.pesomax < (parseFloat(event.target.value))){
      //error cantidad a cargar mayor a la capacidad del vehiculo
      this.messageService.add({severity:'warn', summary: '!Error¡', detail:`El peso neto a cargar es mayor al peso neto permitido`});
    }
    let totalesTabla = await this.functionsService.sumColArray(this.pedidosTurno.filter(pedido=>!pedido.itemcode.startsWith('SF')),[{cantidad:0, comprometida:0, cantidadbodega:0, disponible:0 }]);
    if(totalesTabla[0].cantidad < (parseFloat(event.target.value)-this.peso_bruto)){
      this.messageService.add({severity:'warn', summary: '!Error¡', detail:`El peso de la carga es mayor al peso total de los pedidos`});
    }

  }

  presionarEnterPesoNeto(event:any, peso:number){
    if (event.key === "Enter") {
      this.cambioPesoNeto(event,peso);
    }

  }

  async validarFormulario():Promise<boolean> {
      let valido:boolean = false;

      //////// ////////////// ////console.log(this.tablaPedidosTurno.data.filter((linea: { remision: null; })=>linea.remision != null).length);

      if(!this.fechacargue || 
         !this.horacargue  || 
         this.transportadoraSeleccionada.id==0 || 
         this.vehiculoSeleccionado.id==0 || 
         this.conductorSeleccionado.id==0 ){
        this.messageService.add({severity:'error', summary: '!Error¡', detail:  "Debe deiligenciar los campos resaltados en rojo"});
      }else if(this.capacidadvh<this.cantidad){
        this.messageService.add({severity:'warn', summary: '!Error¡', detail:`La cantidad a cargar es mayor a la capacidad del vehículo`});
        valido = true;
      }else if(this.pesomax<this.cantidad+this.peso_bruto){
        this.messageService.add({severity:'warn', summary: '!Error¡', detail:`El peso neto a cargar es mayor al peso neto permitido`});
        valido = true;
      }else if(!(await this.validarHoraCargue())){
        this.messageService.add({severity:'warn', summary: '!Error¡', detail: 'La fecha y hora de cargue seleccionada esta fuera del horario de atención de la locación.'});
        valido = true;
      }else if((this.tablaPedidosTurno.data.filter((linea: { remision: null; })=>linea.remision != null).length==0 && this.estado === this.estadosTurno.PESADOF)){
        this.messageService.add({severity:'warn', summary: '!Error¡', detail: 'Debe ingresar el numero de remisión para cada linea de producto-destino.'});
        //valido = true;
      }else{
        valido = await this.validarCantidadesCarga();
      }

      this.fechaaccion= new Date();
      this.horaaccion = new Date();
      this.comentario = "";

      ////////////////// ////////////// ////console.log(valido);

      return valido;
  }

  async validarCantidadesCarga():Promise<boolean>{
    let result = true;

    for(let lineaPedido of this.tablaPedidosTurno.data){
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

  borrarLineaPedido(event:any){

    this.confirmationService.confirm({
      message: `Esta seguro de eliminar ${event.length>1?'los items seleccionados':'el item seleccionado'} del turno No ${this.turnoId}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
        event.map((linea:any)=>{
          // ////////////// ////console.log(linea);
          this.pedidosTurno.find(item=>item.id === linea.index && item.itemcode == linea.itemcode && item.pedidonum == linea.docnum).estado = 'I';
          this.pedidosTurno.find(item=>item.id === linea.index && item.itemcode == linea.itemcode && item.pedidonum == linea.docnum).lineaUpdate.update = true;
          this.pedidosTurno.find(item=>item.id === linea.index && item.itemcode == linea.itemcode && item.pedidonum == linea.docnum).cantidadOld = parseFloat(this.pedidosTurno.find(item=>item.id === linea.index).cantidadOld);
          this.pedidosTurno.find(item=>item.id === linea.index && item.itemcode == linea.itemcode && item.pedidonum == linea.docnum).cantidad  =0;
        });
        // ////////////// ////console.log(this.pedidosTurno);
        this.configTablePedidosAlmacenCliente();
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

  cambioValorCampo(arregloCambioCampo:any){
   // ////////////// ////console.log(arregloCambioCampo,arregloCambioCampo.itemData.docnum,arregloCambioCampo.itemData.itemcode,this.pedidosTurno,);

   
   let indexLineaPedido = this.pedidosTurno.findIndex(item=>item.id === arregloCambioCampo.index 
                                                            //&& item.pedidonum == arregloCambioCampo.itemData.docnum 
                                                            //&& item.itemcode == arregloCambioCampo.itemData.itemcode
                                                            //&& `${item.municipioentrega} - ${item.lugarentrega}` == arregloCambioCampo.itemData.lugarentrega
                                                            );

  // ////////////// ////console.log(indexLineaPedido);
   //this.pedidosTurno[indexLineaPedido].lineaUpdate.update = arregloCambioCampo.index==0?false:true;
   this.pedidosTurno[indexLineaPedido].lineaUpdate.update = true;



    switch(arregloCambioCampo.campo){
      case 'remision':
        this.pedidosTurno[indexLineaPedido].remision = parseFloat(arregloCambioCampo.itemData.remision);
      break;

      case 'cantidad':
        if(arregloCambioCampo.itemData.cantidad > arregloCambioCampo.itemData.cantidad_pedido){
          this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar (${arregloCambioCampo.itemData.cantidad} TON) es mayor a la cantidad del pedido (${arregloCambioCampo.itemData.cantidad_pedido} TON)`});
          
        }else{
          //this.pedidosTurno[indexLineaPedido].cantidadOld = parseFloat(this.pedidosTurno[indexLineaPedido].cantidad);
          this.pedidosTurno[indexLineaPedido].cantidad = parseFloat(arregloCambioCampo.itemData.cantidad);
          
        }
        if(arregloCambioCampo.itemData.cantidad > arregloCambioCampo.itemData.disponible){
          this.messageService.add({severity:'warn', summary: '!Advertencia¡', detail:  `La cantidad a cargar (${arregloCambioCampo.itemData.cantidad} TON) es mayor a la cantidad disponible (${arregloCambioCampo.itemData.disponible} TON)`});
        }
      break;

    }

    //// ////////////// ////console.log(this.pedidosTurno);

  }

  adicionarLinea(event:any){  

    this.dialogPedidosCliente = true;
    this.loadingPedidosAlmacenCliente = true
    this.getSaldosPedidos();
  }

  filtrarCliente(event: any) {
    this.clientesFiltrados = this.filter(event,this.clienteSeleccionado);
  }

  seleccionarCliente(clienteSeleccionado:any){

  }

  filtrarMunicipio(event:any){
    this.municipiosFiltrados = this.filter(event,this.municipios);
  }
  
  seleccionarMunicipio(){
   ////// ////////////// ////console.log(this.municipioSeleccionado);
    this.municipioentrega = this.municipioSeleccionado.label;
  }

  getSaldosPedidos(){

    let CardCode = this.clienteSeleccionado.CardCode;
    let locacion = this.localidad;


    

    this.pedidosService.getSaldosPedidos(CardCode,locacion)
        .subscribe({
            next:async (saldosPedidos)=>{
             //////console.log('saldosPedidos',saldosPedidos);
             
             let pedidosClientes:any[] = [];
             for(let indexPedido in saldosPedidos){
              
                //////console.log(saldosPedidos[indexPedido]);
  
                  
                  pedidosClientes.push({
                    cantidad:saldosPedidos[indexPedido].Quantity,
                    cantidad_suministrada:saldosPedidos[indexPedido].DelivrdQty,
                    //cantidad_suministrada:saldosPedidos[indexPedido].Quantity-saldosPedidos[indexPedido].SALDO,
                    cardcode:saldosPedidos[indexPedido].CardCode,
                    cardname:this.clienteSeleccionado.CardName,
                    ciudad_ea:'',
                    codigo_almacen:saldosPedidos[indexPedido].WhsCode_Code,
                    nombre_almacen:saldosPedidos[indexPedido].WhsName,
                    codigo_cuenta:'',
                    comentarios:saldosPedidos[indexPedido].Comments,
                    condicion_pago:saldosPedidos[indexPedido].PymntGroup,
                    condicion_tpt:saldosPedidos[indexPedido].U_NF_CONDTRANS,
                    dependencia:saldosPedidos[indexPedido].DEPENDENCIA,
                    descuento:0,
                    dias:0,
                    direccion_ea:'',
                    docdate:saldosPedidos[indexPedido].DocDate,
                    docentry:saldosPedidos[indexPedido].DocEntry,
                    docnum:saldosPedidos[indexPedido].DocNum,
                    duedate:saldosPedidos[indexPedido].DocDueDate,
                    estado_doc:saldosPedidos[indexPedido].ESTADO,
                    estado_linea:'',
                    linenum:saldosPedidos[indexPedido].LineNum,
                    funcionario_ventas:'',
                    impuesto:'',
                    itemcode:saldosPedidos[indexPedido].ItemCode,
                    itemname:saldosPedidos[indexPedido].Dscription,
                    iva:'',
                    //locacion:saldosPedidos[indexPedido].Location,
                    locacioncode: saldosPedidos[indexPedido].locacion_codigo2,
                    locacion:saldosPedidos[indexPedido].locacion2,
                    localidad:saldosPedidos[indexPedido].LOCALIDAD,
                    moneda:'',
                    nit:'',
                    nombre_referencia:'',
                    pedido_contingencia:'',
                    pendiente:saldosPedidos[indexPedido].SALDO,
                    precio_coniva:saldosPedidos[indexPedido].PRECIOU_CONIVA,
                    precio_siniva:0,
                    remision_contingencia:'',
                    serie:'',
                    telefono_ea:'',
                    tipo_producto:saldosPedidos[indexPedido].TIPOPEDIDO,
                    tipo_pedido:saldosPedidos[indexPedido].TIPOPEDIDO,
                    total_documento:saldosPedidos[indexPedido].LineTotal,
                    total_impuesto:0,
                    total_linea_siniva:0,
                    vicepresidencia:saldosPedidos[indexPedido].DEPENDENCIA,
                    email_vendedor:saldosPedidos[indexPedido].Email,
                    tipoprod:saldosPedidos[indexPedido].TIPOPROD
                    
                  })
  
                 
                
  
             }

             this.pedidosCliente = await this.calcularCantidadesComprometidas(pedidosClientes);

             //// ////////////// ////console.log('pedidosCliente',this.pedidosCliente);
             this.configNewTablePedidosAlmacenCliente();
             
            },
            error:(err)=>{
              console.error(err);
            }
        });
  }

  async calcularCantidadesComprometidas(pedidos:any):Promise<any[]>{
  
    for(let pedido of pedidos){
     ////// ////////////// ////console.log(pedido);
      let cantidadComprometida=0; 
      cantidadComprometida += await this.getCantidadComprometidaItemPedidoBodega(pedido.docnum,pedido.itemcode,pedido.codigo_almacen);
      //cantidadComprometida += await this.getCantidadComprometidaItemPedidoInSolicitud(pedido.docnum,pedido.itemcode,pedido.codigo_almacen);
      pedido.comprometida = cantidadComprometida;
      //pedido.pendiente 
    }
  
    return pedidos;
  }

  async getCantidadComprometidaItemPedidoBodega(pedido:any, itemcode:string, bodega:string):Promise<number>{
  
    const cantidadComprometida$ = this.pedidosService.getCantidadesComprometidas(pedido,itemcode,bodega,0);
    const cantidadComprometida = await lastValueFrom(cantidadComprometida$);
  
    return cantidadComprometida;
  
  
  }
  
 
  
  async getCantidadComprometidaItemPedidoInSolicitud(pedido:any, itemcode:string, bodega:string): Promise<number>{
    ////////////////////// ////////////// ////console.log(pedido, itemcode, bodega);
      let cantidadComprometida =0;
      /*for(let vehiculo of this.vehiculosEnSolicitud){
          for(let lineaPedido of vehiculo.pedidos){
           //////////////////////// ////////////// ////console.log(lineaPedido.pedido, lineaPedido.itemcode, lineaPedido.bodega);
              if(lineaPedido.pedido == pedido && lineaPedido.itemcode == itemcode && lineaPedido.bodega == bodega){
                
                cantidadComprometida+=lineaPedido.cantidad;
              }
          }
      }*/
  
      return cantidadComprometida;
  }

  configNewTablePedidosAlmacenCliente(){
    let headersTable:any= this.configHeadersNewPedidos();
    let dataTable:any = this.configDataTableNewPedidos(this.pedidosCliente);
    
    this.tablaPedidosAlmacenCliente = {
      header: headersTable,
      data: dataTable
    }
    this.loadingPedidosAlmacenCliente = false;
  }
  
  configHeadersNewPedidos(){
    let headersTable:any[] = [
      {
        'index': { label:'',type:'', sizeCol:'0rem', align:'center', editable:false},
        'docnum': { label:'Número pedido',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'docnum'},
        //'cardname':{label:'Cliente',type:'text', sizeCol:'8rem', align:'left', editable:false}, 
        //'docdate': {label:'Fecha de contabilización',type:'date', sizeCol:'6rem',  align:'center', editable:false},
        //'duedate': {label:'Fecha de vencimiento',type:'date', sizeCol:'6rem', align:'center', editable:false},
        //'estado_doc': {label:'Estado pedido',type:'text', sizeCol:'6rem', align:'center'},
        //'estado_linea': {label:'Estado Linea',type:'text', sizeCol:'6rem', align:'center', visible:false,},
        
        //'dias': {label:'Dias',type:'number', sizeCol:'6rem', align:'center',visible:false,},
        'linenum': {label:'Linea',type:'text', sizeCol:'6rem', align:'center',field:'linenum'},
        'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',field:'itemcode'},
        'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'itemname'},
        'almacen': {label:'Almacen.',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'almacen'},
        'cantidad': {label:'Cantidad pedido',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false,field:'cantidad'},
        
        'pendiente': {label:'Cantidad pendiente',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false,field:'pendiente'},
        'comprometida': {label:'Cantidad comprometida',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false,field:'comprometida'},
        'disponible': {label:'Cantidad disponible',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false,field:'disponible'},
        'cargada': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:true,field:'cargada'},
        
      }];
      
      return headersTable;
  }
  
  configDataTableNewPedidos(arregloPedido:any){
      let dataTable:any[] = [];
      let index:number = 0;
      for (let pedido of arregloPedido){
        let cantidadComprometida= 0;
        dataTable.push({
          index,
          docnum:pedido.docnum,
          //cardname:pedido.cardname,
          //docdate:pedido.docdate,
          //duedate:pedido.duedate,
          //estado_doc:pedido.estado_doc,
          //estado_linea:pedido.estado_linea,
          //dias:pedido.dias,
          linenum:pedido.linenum,
          itemcode:pedido.itemcode,
          itemname:pedido.itemname,
          almacen:pedido.codigo_almacen,
          cantidad:pedido.cantidad,
          pendiente:pedido.pendiente,
          comprometida:pedido.comprometida,
          disponible:(pedido.pendiente-pedido.comprometida),
          cargada:0,
          
        });
        index++;
      } 
      
      return dataTable;
  }


  async seleccionarPedidosAlmacenCliente(event:any){
 
    
    this.envioLineaCarguePedido =true;
  
  
    if(this.sitioentrega=="" || this.municipioentrega==""){
        this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los campos resaltados en rojo son obligatorios'});
        this.showItemsSelectedPedidosAlmacenCliente=false;
    }else{
      const pedidosSeleccionados = await event.filter((pedido: { cargada: any; }) =>parseFloat(pedido.cargada)> 0);
      //// ////////////// ////console.log('pedidos seleccionados',pedidosSeleccionados);
    
      if(pedidosSeleccionados.length > 0){
          
          let totalCarga = 0;
          let error:boolean = false;
          for(let pedido of pedidosSeleccionados){
    
            //TODO Validar solo las lineas diferentes a flete   
    
            if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                totalCarga+=parseFloat(pedido.cargada);
    
                ////////////// ////////////// ////console.log(pedido);
       
                if(parseFloat(parseFloat(pedido.cargada).toFixed(2))> parseFloat(parseFloat(pedido.disponible).toFixed(2)) ){
                  //this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar de la linea ${pedido.index+1} supera la cantidad disponible del pedio - item`});
                  this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar (${pedido.cargada} TON) de la linea ${pedido.index+1} supera la cantidad disponible (${parseFloat(pedido.disponible).toFixed(2)} TON) del pedio - item`}); 
                  error = true;
                }
               
                if(parseFloat(parseFloat(pedido.cargada).toFixed(2))> parseFloat(parseFloat(pedido.pendiente).toFixed(2)) ){
                  //this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar de la linea ${pedido.index+1} supera la cantidad pendiente del pedio - item`});
                  this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar (${pedido.cargada} TON) de la linea ${pedido.index+1} supera la cantidad pendiente (${parseFloat(pedido.pendiente).toFixed(2)} TON) del pedio - item`});
                  error = true;
                }
       
                if(parseFloat(pedido.cargada)> this.capacidadDisponibleVehiculo ){
                  //this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar de la linea ${pedido.index+1} supera la capacidad disponible del vehículo seleccionado`});
                  this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `La cantidad a cargar (${pedido.cargada} TON) de la linea ${pedido.index+1} supera la capacidad disponible del vehículo seleccionado (${this.capacidadDisponibleVehiculo} TON)`});
                  //error = true;
                }
    
                if(parseFloat(pedido.cargada)+this.peso_bruto> this.pesomax ){
                  //this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar de la linea ${pedido.index+1} mas el peso bruto supera la capacidad máxima del vehículo seleccionado`});
                  this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `La cantidad a cargar (${pedido.cargada} TON) de la linea ${pedido.index+1} mas el peso bruto (${this.peso_bruto} TON) (${parseFloat(pedido.cargada)+this.peso_bruto} TON) supera la capacidad máxima del vehículo seleccionado (${this.pesomax} TON)`});
                  //error = true;
                }
            }
                  
          }
    
          if(!error && totalCarga> this.capacidadDisponibleVehiculo){
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  `El total a cargar de los pedidos seleccionados, supera la capacidad disponible del vehículo seleccionado`});
              error = true;
          }
    
          // TODO:: Si es transporta sociedad validar si exite linea de flete en seleccion
          if(!error && this.condicion_tpt=="TRANSP" && pedidosSeleccionados.filter((pedidoSeleccionado: { itemcode: string; }) =>pedidoSeleccionado.itemcode.toLowerCase().startsWith('sf')).length ===0){
            this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `No se ha seleccionado linea de flete para este item`});
            error = false;
    
          }
    
    
    
          if(!error){
              //Asignar pedidos al vehiculo
              //Obtener index del vehiculo en la solicitud
              //let indexVehiculo = this.vehiculosEnSolicitud.findIndex(vehiculo => vehiculo.placa == this.vehiculoSeleccionado.code);
              //Obtener pedidos asociados al vehiculo en la solicitud
              //let pdidosVehiculo:any[] = this.vehiculosEnSolicitud[indexVehiculo].pedidos;
              let pedidosTurno:any[] = this.pedidosTurno;

              ////console.log('pedidosTurno',pedidosTurno);
              this.loadingPedidosTurno = true;
              
              for(let pedido of pedidosSeleccionados){
                
                ////console.log('pedido seleccionado',pedido,this.municipioentrega, this.sitioentrega);
                


                
                if(pedidosTurno.find((linea: { pedidonum: any, itemcode:any, municipioentrega:any, lugarentrega:any, linea:any }) => linea.pedidonum == pedido.docnum && 
                                                                                                                            linea.itemcode == pedido.itemcode && 
                                                                                                                            linea.municipioentrega == this.municipioentrega &&
                                                                                                                            linea.linea == pedido.linenum &&
                                                                                                                          linea.lugarentrega == this.sitioentrega)!=undefined){
                                                                                                                            
                  if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                    let indexPedido = pedidosTurno.findIndex((linea: { pedidonum: any, itemcode:any, municipioentrega:any, lugarentrega:any, linea:any }) => linea.pedidonum == pedido.docnum && 
                                                                                                                                                      linea.itemcode == pedido.itemcode && 
                                                                                                                                                      linea.municipioentrega == this.municipioentrega &&
                                                                                                                                                      linea.linea == pedido.linenum &&
                                                                                                                                                      linea.lugarentrega == this.sitioentrega);
                    pedidosTurno[indexPedido].cantidad += parseFloat(pedido.cargada);
                    
                    pedidosTurno[indexPedido].lineaUpdate = {update:true,create:false}
                    //// ////////////// ////console.log(pedidosTurno[indexPedido].lineaUpdate);
                  }
                 
                }else{

                  let email_vendedor = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.docnum && pedidoCliente.itemcode === pedido.itemcode)[0].email_vendedor;

                        ////console.log(this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.docnum && pedidoCliente.itemcode === pedido.itemcode)[0].dependencia)

                  let dependencia = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.docnum && pedidoCliente.itemcode === pedido.itemcode)[0].dependencia;
        
                  let localidad = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.docnum && pedidoCliente.itemcode === pedido.itemcode)[0].localidad;

                  ////console.log('pedido a adicionar',pedido);

                  ////console.log('this.pedidosCliente',this.pedidosCliente);

                  let tipoproducto = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.docnum && pedidoCliente.itemcode === pedido.itemcode)[0].tipoprod;
                  
                      pedidosTurno.push({
                            id:`${pedido.docnum}${pedido.itemcode}${this.municipioentrega}${this.sitioentrega}`,
                            pedidonum:pedido.docnum,
                            docentry:this.pedidosCliente.find(pedidoCliente=>pedidoCliente.docnum==pedido.docnum ).docentry,
                            itemcode:pedido.itemcode,
                            linea:pedido.linenum,
                            itemname:pedido.itemname,
                            cantidad_pedido:parseFloat(pedido.pendiente),
                            cantidad:parseFloat(pedido.cargada),
                            bodega:pedido.almacen,
                            CardCode:this.clienteSeleccionado.CardCode,
                            CardName:this.clienteSeleccionado.CardName,
                            lugarentrega:this.sitioentrega,
                            municipioentrega:this.municipioentrega,
                            email_vendedor:email_vendedor,
                            remision:null,
                            estado:"A",
                            createdAt:'',
                            updaeteAt:'',
                            comprometida:0,
                            cantidadbodega:0,
                            disponible:0,
                            lineaUpdate:{update:false,create:true},
                            cantidadOld:0,
                            dependencia,
                            localidad,
                            tipoproducto
                            //cliente:this.clienteSeleccionado.CardName,
                      });
                      
                      ////console.log('adicion pedidosTurno',pedidosTurno);

                }
    
              }

              this.envioLineaCarguePedido =false;
              this.dialogPedidosCliente = false;
              //// ////////////// ////console.log(pedidosTurno);

              this.pedidosTurno = await this.calcularDisponibilidadPedido(pedidosTurno);
              //// ////////////// ////console.log(this.pedidosTurno);
              this.configTablePedidosAlmacenCliente();
              /*
              this.vehiculosEnSolicitud[indexVehiculo].cantidad = await this.cantidadCargaVehiculo(this.vehiculoSeleccionado.code);
              this.vehiculosEnSolicitud[indexVehiculo].pedidos = pdidosVehiculo;
              
              this.pedidosAlmacenCliente = await this.calcularCantidadesComprometidas(this.pedidosAlmacenCliente);
              //////////// ////////////// ////console.log(this.vehiculosEnSolicitud);
              this.configTablePedidosAlmacenCliente();
              this.generarTreeTable();
              */
          }
        
    
    
      }else{
          this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe seleccionar al menos un pedido - Item'});
          
      }
    
      this.showItemsSelectedPedidosAlmacenCliente=false;
    
    }
    
  }

  confirmarSeleccionPedidosAlmacenCliente(){
    this.showItemsSelectedPedidosAlmacenCliente=true;
  }


  async cambioBodega(){
    this.dialogCambioBodega = true

    
    
    const inventariosItemBodega$ = this.pedidosService.getInventarioItenBodega();
    const inventariosItemBodega = await lastValueFrom(inventariosItemBodega$);
    
     ////////////// ////console.log(inventariosItemBodega);
    const arrayInventariosItemBodega = await this.objectToArray(inventariosItemBodega);

    ////console.log(arrayInventariosItemBodega);

    //let almacenesConStockItem:any[] = [];

    let almacenesConStockItem:any[] = arrayInventariosItemBodega;

    /*for(let pedido of this.pedidosTurno){
      //////////// ////console.log(pedido);
      // ////////////// ////console.log(arrayInventariosItemBodega.filter((item: { ItemCode: any; })=>item.ItemCode === pedido.itemcode));
      almacenesConStockItem = almacenesConStockItem.concat(arrayInventariosItemBodega.filter((item: { ItemCode: any; })=>item.ItemCode === pedido.itemcode));
    }*/

    almacenesConStockItem.map((item)=>{
      item.label = `${item.Localidad_} - ${item.WhsCode} - ${item.WhsName}`
    });

    //////////// ////console.log(almacenesConStockItem);

    almacenesConStockItem = await this.functionsService.groupArray(almacenesConStockItem,'label');

    //////////// ////console.log(almacenesConStockItem);

    let bodegas:any[] =[];

    for(let almacen of almacenesConStockItem){
      ////////////// ////console.log(this.locaciones.find(item=>item.code == almacen.locacion_codigo2 ));
      if(this.locaciones.find(item=>item.code == almacen.locacion_codigo2 )){
        bodegas.push(almacen);
      }
    }

    //////////// ////console.log(bodegas);

    //this.bodegas = almacenesConStockItem;


    this.bodegas = bodegas;

    

/*
    this.pedidosCambioBodegaTurno = this.pedidosTurno;
    this.configTableCambioPedidosBodega();
    // ////////////// ////console.log(this.pedidosCambioBodegaTurno);
*/

  }



  filtrarBodega(event:any){
    this.bodegasFiltradas = this.filter(event,this.bodegas);
  }
  
  async seleccionarBodega(bodegaSeleccionada:any){

    if(this.locaciones.filter(locacion=>locacion.code === bodegaSeleccionada.locacion_codigo2).length>0){

      this.diasNoAtencionCambioBodega = await this.obtenerDiasNoAtencion(this.locaciones.filter(locacion=>locacion.code === bodegaSeleccionada.locacion_codigo2)[0].horarios_locacion);
      this.horariosLocacionCambioBodega = this.locaciones.filter(locacion=>locacion.code === bodegaSeleccionada.locacion_codigo2)[0].horarios_locacion;
      if(this.fechacargueCambioBodega){
        await this.seleccionarFechaCitaCambioBodega();
      }
      
    }else{
      //Establecer horarios locacion
      this.diasNoAtencionCambioBodega = [];
      this.horariosLocacionCambioBodega = [];
      this.horariosSeleccionadosCambioBodega =[];
    }


    this.loadingCambioBodegaPedidosTurno = true;
    //////////// ////console.log(bodegaSeleccionada);
    //this.pedidosCambioBodegaTurno = new Array() ;

    //this.pedidosCambioBodegaTurno= this.pedidosTurno;
 
    ////////// ////console.log(this.pedidosTurno);

    let pedidosTurnoCambioBodegaTurno:any[] = [];

    for(let pedido of this.pedidosTurno){
      pedidosTurnoCambioBodegaTurno.push({
        CardCode:pedido.CardCode,
        CardName:pedido.CardName,
        bodega:bodegaSeleccionada.WhsCode,
        cantidad:pedido.cantidad,
        cantidadOld:pedido.cantidadOld,
        cantidad_pedido:pedido.cantidad_pedido,
        cantidadbodega:pedido.cantidadbodega,
        comprometida:pedido.comprometida,
        createdAt:pedido.createdAt,
        dependencia:pedido.dependencia,
        disponible:pedido.disponible,
        docentry:pedido.docentry,
        email_vendedor:pedido.email_vendedor,
        estado:pedido.estado,
        id:pedido.id,
        itemcode:pedido.itemcode,
        itemname:pedido.itemname,
        linea:pedido.linea,
        lineaUpdate:{create:false,update:false},
        localidad:pedido.localidad,
        lugarentrega:pedido.lugarentrega,
        municipioentrega:pedido.municipioentrega,
        pedidonum:pedido.pedidonum,
        remision:pedido.remision,
        tipoproducto:pedido.tipoproducto,
        updaeteAt:pedido.updaeteAt,

      });
    }
    
    this.pedidosCambioBodegaTurno = pedidosTurnoCambioBodegaTurno;

    ////////// ////console.log(this.pedidosCambioBodegaTurno);

    /*this.pedidosCambioBodegaTurno.map((item)=>{
      
        item.bodega = bodegaSeleccionada.WhsCode;

    });*/

    this.pedidosCambioBodegaTurno = await this.calcularDisponibilidadPedido(this.pedidosCambioBodegaTurno);

    // ////////////// ////console.log(this.pedidosCambioBodegaTurno);
    this.configTableCambioPedidosBodega();
    this.loadingCambioBodegaPedidosTurno = false;
  }

 async seleccionarFechaCitaCambioBodega():Promise<void>{

    let diasSemana = this.functionsService.dias;
    let diaSeleccionado = diasSemana.find(diaSemana => diaSemana.id === this.fechacargueCambioBodega.getUTCDay());
    let horariosSeleccionados = this.horariosLocacionCambioBodega.filter(horario=>horario.dias_atencion.includes(diaSeleccionado.fullname));
    //let horarioSeleccionados:any[] = [];
    this.horariosSeleccionadosCambioBodega = horariosSeleccionados;

    /*for(let horario of this.horariosLocacion){
      //////////////// ////////////// ////console.log(horario.dias_atencion.includes(diaSeleccionado.fullname));
    }*/
    //////////////// ////////////// ////console.log(this.fechacargue.getUTCDay(), diasSemana,diaSeleccionado,this.horariosLocacion,horariosSeleccionados);
    if(this.horacargueCambioBodega){
      await this.cambioHoraCitaCambioBodega();
    }
    
  }


 async cambioHoraCitaCambioBodega():Promise<void>{
     //////////////// ////////////// ////console.log(this.horacargue.toLocaleTimeString());
     if(await this.validarHoraCargueCambioBodega()){
      //////////// ////console.log('hora valida en horario ');
    }else{
      //////////// ////console.log('hora invalida en horario');
    }
  }

  async validarHoraCargueCambioBodega():Promise<boolean>{
    let horarioValido:boolean = true;
  
    for(let horario of this.horariosSeleccionadosCambioBodega){
     
      let horainicio = new Date(new Date().setHours(horario.horainicio.split(':')[0],horario.horainicio.split(':')[1],horario.horainicio.split(':')[2]));
      let horafin = new Date(new Date().setHours(horario.horafin.split(':')[0],horario.horafin.split(':')[1],horario.horafin.split(':')[2]));
      let horacargue = new Date(new Date().setHours(parseInt(this.horacargueCambioBodega.toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(this.horacargueCambioBodega.toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(this.horacargueCambioBodega.toLocaleTimeString("en-US", { hour12: false }).split(":")[2])));
  
      if(horainicio<= horacargue && horafin >= horacargue){
       //////////// ////console.log('hora valida en horario id '+horario.id);
      }else{
        //////////// ////console.log('hora invalida en horario id '+horario.id);
        horarioValido = false;
      }
    }
  
    return horarioValido;
  }
  

 

  borrarLineaCambioBodega(event:any){
    this.confirmationService.confirm({
      message: `Esta seguro de eliminar ${event.length>1?'los items seleccionados':'el item seleccionado'} ?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
       
        event.map((linea:any)=>{
          // ////////////// ////console.log(linea);
          let indexLineaCambioBodega = this.pedidosCambioBodegaTurno.findIndex(item=> item.id === linea.index);
          this.pedidosCambioBodegaTurno.splice(indexLineaCambioBodega,1);
          // ////////////// ////console.log(this.pedidosCambioBodegaTurno.splice(indexLineaCambioBodega,1));
          ////////// ////console.log(this.pedidosTurno);
          this.configTableCambioPedidosBodega();
       
        });
        // ////////////// ////console.log(this.pedidosTurno);
       
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

  cambioValorCampoCambioBodega(arregloCambioCampo:any){

    ////////// ////console.log(arregloCambioCampo);

    let indexLineaPedido = this.pedidosCambioBodegaTurno.findIndex(item=>item.id === arregloCambioCampo.index 
                                                             //&& item.pedidonum == arregloCambioCampo.itemData.docnum 
                                                             //&& item.itemcode == arregloCambioCampo.itemData.itemcode
                                                             //&& `${item.municipioentrega} - ${item.lugarentrega}` == arregloCambioCampo.itemData.lugarentrega
                                                             );
 
    this.pedidosCambioBodegaTurno[indexLineaPedido].lineaUpdate.update = true;
     switch(arregloCambioCampo.campo){
       case 'cantidad':
        if(arregloCambioCampo.itemData.cantidad > arregloCambioCampo.itemData.cantidad_pedido){
          this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar (${arregloCambioCampo.itemData.cantidad} TON) es mayor a la cantidad del pedido (${arregloCambioCampo.itemData.cantidad_pedido} TON)`});
          
          }else{
            //this.pedidosTurno[indexLineaPedido].cantidadOld = parseFloat(this.pedidosTurno[indexLineaPedido].cantidad);
            this.pedidosCambioBodegaTurno[indexLineaPedido].cantidad = parseFloat(arregloCambioCampo.itemData.cantidad);
            
          }
          if(arregloCambioCampo.itemData.cantidad > arregloCambioCampo.itemData.disponible){
            this.messageService.add({severity:'warn', summary: '!Advertencia¡', detail:  `La cantidad a cargar (${arregloCambioCampo.itemData.cantidad} TON) es mayor a la cantidad disponible (${arregloCambioCampo.itemData.disponible} TON)`});
          }
       break;
 
     }

     ////////// ////console.log(this.pedidosCambioBodegaTurno);
 
   }

   async confirmarCambioBodega(){

    this.envioCambioBodega = true;
    let totoalCargaCambio = (await this.functionsService.sumColArray(this.pedidosCambioBodegaTurno,[{canridad:0}]))[0].cantidad;

    if(this.bodegaSeleccionada.length ==0 || !this.fechacargueCambioBodega || !this.horacargueCambioBodega){
      this.messageService.add({severity:'error', summary:'Error', detail:'Debe seleccionar los campos resaltados en rojo'});
    }else if(this.pedidosCambioBodegaTurno.length ==0){
      this.messageService.add({severity:'error', summary:'Error', detail:'Debe existir al menos una linea para realizar el cambio de bodega'});
    }else if(this.capacidadvh< totoalCargaCambio || this.pesomax < totoalCargaCambio){
      this.messageService.add({severity:'error', summary:'Error', detail:'La canidad a cargar supera la capacidad y/o peso pemitido del vehiculo'});
    }else{
      this.confirmationService.confirm({
        message: `¿Esta seguro de realizar el cambio de bodega para los ítems seleccionados? Si confirma el cambio, se realizará actualización de los pedidos seleccionados en el turno actual y se creará un nuevo turno a la Locación/Bodega seleccionada`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
  
          //////// ////console.log(this.turno.solicitud.clientes);

          this.displayModal= true;
          this.loadingCargue = true;
          this.completeCargue = true;
          this.messageComplete =`Creando nueva solicitud de cargue por cambio de Locación/Bodega`;
      
          let clientesTurnoActual:any[] = this.turno.solicitud.clientes;
          let clientesNuevoTurno:any[] = [];
          let pedidosVehiculo:any[] = [];
  
          for(let item of this.pedidosCambioBodegaTurno){

            //Llenar array de cliente para nueva solicitud
            //////// ////console.log(clientesTurnoActual.filter(cliente=>cliente.CardCode == item.CardCode))
            if(clientesNuevoTurno.filter(cliente=>cliente.CardCode == item.CardCode).length === 0){
              clientesNuevoTurno.push(clientesTurnoActual.filter(cliente=>cliente.CardCode == item.CardCode)[0]);
            }

            //Llenar array de pedidos nuevo turno vehiculo
            
            pedidosVehiculo.push({
              pedidonum:item.pedidonum,
              docentry:item.docentry,
              itemcode:item.itemcode,
              itemname:item.itemname,
              cantidad_pedido:item.cantidad_pedido,
              cantidad:item.cantidad,
              bodega: item.bodega,
              CardCode: item.CardCode,
              CardName: item.CardName,
              email_vendedor: item.email_vendedor,
              linea:item.linea,
              municipioentrega:item.municipioentrega,
              lugarentrega:item.lugarentrega,
              dependencia:item.dependencia,
              localidad:item.localidad,
              tipoproducto:item.tipoproducto,
            });
            

            //Buscar por linea de la cantidad a cargar en la nueva bodega y restarle la cantidad a la linea correspondiente del turno alctual
            let indexPedidoTurno = this.pedidosTurno.findIndex(linea => linea.id === item.id );
            this.pedidosTurno[indexPedidoTurno].cantidad =  parseFloat(this.pedidosTurno[indexPedidoTurno].cantidad)-parseFloat(item.cantidad);
            this.pedidosTurno[indexPedidoTurno].lineaUpdate.update = true;
            if(this.pedidosTurno[indexPedidoTurno].cantidad<=0){
              this.pedidosTurno[indexPedidoTurno].cantidad =0;
              this.pedidosTurno[indexPedidoTurno].estado = 'I';
            }
            this.observacionesCargue.push(`Se realizará retiro de ${item.cantidad} TON por la bodega ${this.bodegaSeleccionada.WhsCode}`)
          }

          //////// ////console.log(this.pedidosTurno);
          //////// ////console.log(this.pedidosCambioBodegaTurno);
          ////// ////console.log(clientesNuevoTurno);

          //Crear nuevo turno,
          let horacargueCambioBodega = `${this.fechacargueCambioBodega.toISOString().split("T")[0]}T${this.horacargueCambioBodega.toISOString().split("T")[1]}`;
          let detalle_solicitud:any[] = [{
            
              fechacita:new Date(this.fechacargueCambioBodega),
              horacita:new Date(horacargueCambioBodega),
              lugarentrega:'',
              municipioentrega:'',
              observacion:`Turno generado automaticamente por cambio de bodega. basado en turno ${this.turnoId}`,
              condiciontpt: this.condicion_tpt,
              transportadora:this.transportadoraSeleccionada.id,
              vehiculo:this.vehiculoSeleccionado.id,
              conductor:this.conductorSeleccionado.id,
              locacion:this.bodegaSeleccionada.locacion_codigo2 ,
              pedidos_detalle_solicitud:pedidosVehiculo
          }];

          const newSolicitud:any = {
            clientes: clientesNuevoTurno.map((cliente)=>{ return cliente.id}),
            detalle_solicitud
          }
           ////console.log('newSolicitud',newSolicitud);
          
          this.solicitudTurnoService.create(newSolicitud)
              .subscribe({
                  next:async (result)=>{
                    ////// ////console.log('nueva solicitud',result);
                    this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el registro de la solicitud ${result.id}. y el turno ${result.detalle_solicitud_turnos[0].id}`});
                    this.messageComplete =`Actualizando información de pedidos del turno ${this.turnoId}`;
                    
                    this.accion = 'actualizar la información del turno y reestablecer el estado  de '
                    this.tituloEstado = "actualizar la información del turno y reestablecer el estado  de ";

                    if(this.pedidosTurno.length == this.pedidosTurno.filter(pedido =>pedido.estado === 'I').length){

                      this.accion = 'cancelar'
                      this.tituloEstado = "ha sido cancelado";
                      this.fechaaccion = new Date();
                      this.horaaccion = new Date();
                      this.comentario = "Cancelación automatica del turno por cambio de bodega";
                      //this.novedadesSeleccionadas = this.novedades.filter(novedad => novedad.id === 11);
                      this.novedadesSeleccionadas = this.novedades.filter(novedad => novedad.novedad === 'TURNO CANCELADO X CAMBIO BODEGA');


                    }

                    let data:any = await this.configDataTurno();
                    //////// ////console.log(data);
                    this.updateTurno(data);
                  },
                  error:(err)=>{
                    this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});
                    console.error(err);
                    this.displayModal = false;
                    this.loadingCargue = false;
                  } 
              });
          //Actualizar el turno actual

              

          


          this.configTablePedidosAlmacenCliente();

          //this.updateInfoTurno();

          
  
          this.dialogCambioBodega = false
       
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

}
