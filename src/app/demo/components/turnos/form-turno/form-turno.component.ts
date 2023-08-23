import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdenesCargueService } from 'src/app/demo/service/ordenes-cargue.service';
import { PedidosService } from 'src/app/demo/service/pedidos.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { lastValueFrom } from 'rxjs';
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

@Component({
  selector: 'app-form-turno',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-turno.component.html',
  styleUrls: ['./form-turno.component.scss'],
  /*styles:[`:host ::ng-deep {
    .speeddial-linear-demo {
        .p-speeddial-direction-up {
            left: calc(50% - 2rem);
            bottom: 0;
        }

        .p-speeddial-direction-down {
            left: calc(50% - 2rem);
            top: 0;
        }

        .p-speeddial-direction-left {
            right: 0;
            top: calc(50% - 2rem);
        }

        .p-speeddial-direction-right {
            left: 0;
            top: calc(50% - 2rem);
        }
    }

    .speeddial-circle-demo {
        .p-speeddial-circle {
            top: calc(50% - 2rem);
            left: calc(50% - 2rem);
        }

        .p-speeddial-semi-circle {
            &.p-speeddial-direction-up {
                left: calc(50% - 2rem);
                bottom: 0;
            }

            &.p-speeddial-direction-down {
                left: calc(50% - 2rem);
                top: 0;
            }

            &.p-speeddial-direction-left {
                right: 0;
                top: calc(50% - 2rem);
            }

            &.p-speeddial-direction-right {
                left: 0;
                top: calc(50% - 2rem);
            }
        }

        .p-speeddial-quarter-circle {
            &.p-speeddial-direction-up-left {
                right: 0;
                bottom: 0;
            }

            &.p-speeddial-direction-up-right {
                left: 0;
                bottom: 0;
            }

            &.p-speeddial-direction-down-left {
                right: 0;
                top: 0;
            }

            &.p-speeddial-direction-down-right {
                left: 0;
                top: 0;
            }
        }
    }

    .speeddial-tooltip-demo {
        .p-speeddial-direction-up {
            &.speeddial-left {
                left: 0;
                bottom: 0;
            }

            &.speeddial-right {
                right: 0;
                bottom: 0;
            }
        }
    }

    .speeddial-delay-demo {
        .p-speeddial-direction-up {
            left: calc(50% - 2rem);
            bottom: 0;
        }
    }

    .speeddial-mask-demo {
        .p-speeddial-direction-up {
            right: 0;
            bottom: 0;
        }
    }

}`]*/
})
export class FormTurnoComponent implements  OnInit {

  turnoId!:number;
  ordenCargue: any;
  hoy:Date = new Date();

  cliente:string = '';
  localidad:string = '';
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

  arrayBtnTurnos!: MenuItem[];
  btnAprobar: MenuItem =   {label: 'Aprobar', icon: 'pi pi-check', command: () => { this.aprobarTurno();}};
  btnPausar: MenuItem =   {label: 'Pausar', icon: 'pi pi-pause', command: () => { this.pausarTurno();}};
  btnActivar: MenuItem =   {label: 'Activar', icon: 'pi pi-play', command: () => { this.activarTurno();}};
  btnCancel: MenuItem =   {label: 'Cancelar', icon: 'pi pi-times', command: () => { this.cancelarTurno();}};
  btnIngreso: MenuItem =   {label: 'Ingresar', icon: 'pi pi-sign-in', command: () => { this.ingresarTurno();}};
  btnPeso: MenuItem =   {label: 'Pesar', icon: 'pi pi-compass', command: () => { this.pesarTurno();}};
  btnCargue: MenuItem =   {label: 'Cargar', icon: 'pi pi-upload', command: () => { this.inicioCargueTurno();}};
  btnFinCargue: MenuItem =   {label: 'Fin cargue', icon: 'pi pi-box', command: () => { this.finalizarCargueTurno();}};
  btnDespachar: MenuItem =   {label: 'Despachar', icon: 'pi pi-sign-out', command: () => { this.despacharTurno();}};
  

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
formHistorialTurno:boolean = false;

domain:string = window.location.hostname;


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
              private novedadesService:NovedadesService) { }

  ngOnInit() {

    
    //this.condicion_tpt="RETIRA";
    this.turnoId = this.config.data.id;
    this.getPermisosModulo();


    ////////////////console.log(this.config.data.id);
    this.configTablePedidosAlmacenCliente();
    //this.getTurno(this.turnoId);
    this.getLocaciones();
    this.getNovedades();
    
  }

  getPermisosModulo(){
  
    const modulo = this.router.url;
    //////console.log(modulo);
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              ////////////console.log(permisos);
              if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                this.router.navigate(['/auth/access']);
              }
  
              if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                this.router.navigate(['/auth/access']);
              }
              this.permisosModulo = permisos;
              //this.multiplesClientes = await this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Seleccionar multiples clientes').valor;
              ////////////////console.log(this.multiplesClientes);
              /*
              this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
              this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
              this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
              this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
              */

              const infoUsuario = await this.usuariosService.infoUsuario();
              this.rolesUsuario = infoUsuario.roles;
              ////console.log(await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.CLIENTE));
              await this.getVehiculos();
              await this.getConductores();
              await this.getTransportadoras();
              
             this.updateModulo = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
             this.updatePesoBruto = await this.functionsService.validRoll(this.rolesUsuario,this.tiposRol.BASCULA);
             ////console.log(this.updateModulo ,this.updatePesoBruto); 
             ////console.log(!(this.updateModulo && this.updatePesoBruto)?true:false); 
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

  async getNovedades():Promise<void>{
    this.novedadesService.getNovedades()
        .subscribe({
              next:(novedades)=>{
                  novedades.forEach(novedad=>{
                    novedad.code = novedad.id;
                    novedad.name = novedad.novedad;
                    novedad.label = novedad.novedad;
                  });

                  console.log(novedades);
                  this.novedades = novedades;
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
              ////////////////console.log(vehiculos);
              for(let vehiculo of vehiculos){
                vehiculo.code = vehiculo.placa;
                vehiculo.name = vehiculo.placa;
                vehiculo.label = vehiculo.placa;
                vehiculo.clase = vehiculo.tipo_vehiculo;
              }
              ////////////////console.log(conductores);
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
    //console.log('vehiculos',vehiculos);
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
            ////////////////console.log(conductores);
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
    //console.log(transportadoras);
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
                ////////////////console.log(conductores);
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
      //console.log(conductores);
      this.conductores = conductores;
  }

  async getLocaciones(){
    this.almacenesService.getLocaciones()
        .subscribe({
            next:(locaciones)=>{
                ////console.log('locaciones',locaciones);
                this.locaciones = locaciones;
            },
            error:(err)=>{
              console.error(err);
            }
        });
  }

  async obtenerDiasNoAtencion(horarios:any[]):Promise<any[]>{
    let diasNoAtencion:any[] = this.functionsService.dias;
      
      for(let horario of horarios){
        let diasNot:any[] = [];
        let diasAtencionLocacion:any[] = horario.dias_atencion.split(',');
        ////console.log(diasAtencionLocacion);
        for(let dia of diasNoAtencion){
          ////console.log(diasAtencionLocacion.includes(dia.fullname));
  
          if(!diasAtencionLocacion.includes(dia.fullname)){
              diasNot.push(dia);
          }
          ////console.log(dia.fullname,JSON.stringify(diasNot));
        }
        
        diasNoAtencion = diasNot;
      }
  
     // //console.log(diasNoAtencion.map((dia)=>{ return dia.id}));
  
    return diasNoAtencion.map((dia)=>{ return dia.id});
  }

  async seleccionarFechaCita():Promise<void>{
  
    let diasSemana = this.functionsService.dias;
    let diaSeleccionado = diasSemana.find(diaSemana => diaSemana.id === this.fechacargue.getUTCDay());
    let horariosSeleccionados = this.horariosLocacion.filter(horario=>horario.dias_atencion.includes(diaSeleccionado.fullname));
    //let horarioSeleccionados:any[] = [];
    this.horariosSeleccionados = horariosSeleccionados;
  
    /*for(let horario of this.horariosLocacion){
      //console.log(horario.dias_atencion.includes(diaSeleccionado.fullname));
    }*/
    //console.log(this.fechacargue.getUTCDay(), diasSemana,diaSeleccionado,this.horariosLocacion,horariosSeleccionados);
    await this.cambioHoraCita();
  }
  
  async cambioHoraCita():Promise<void>{
    //console.log(this.horacargue.toLocaleTimeString());
    if(await this.validarHoraCargue()){
      //console.log('hora valida en horario ');
    }else{
      //console.log('hora invalida en horario');
    }
  }

  
async validarHoraCargue():Promise<boolean>{
  let horarioValido:boolean = true;

  for(let horario of this.horariosSeleccionados){
    //console.log(new Date(new Date().setHours(horario.horainicio.split(':')[0],horario.horainicio.split(':')[1],horario.horainicio.split(':')[2])));
    //console.log(new Date(new Date().setHours(horario.horafin.split(':')[0],horario.horafin.split(':')[1],horario.horafin.split(':')[2])));
    
    //console.log(parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[0]));

    //console.log(new Date(new Date().setHours(parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[2]))));

    let horainicio = new Date(new Date().setHours(horario.horainicio.split(':')[0],horario.horainicio.split(':')[1],horario.horainicio.split(':')[2]));
    let horafin = new Date(new Date().setHours(horario.horafin.split(':')[0],horario.horafin.split(':')[1],horario.horafin.split(':')[2]));
    let horacargue = new Date(new Date().setHours(parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(this.horacargue.toLocaleTimeString("en-US", { hour12: false }).split(":")[2])));

    if(horainicio<= horacargue && horafin >= horacargue){
      //console.log('hora valida en horario id '+horario.id);
    }else{
      //console.log('hora invalida en horario id '+horario.id);
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
    ////////////////console.log(this.vehiculosFiltrados);
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

    //////console.log(vehiculoSeleccionado);
  
    if(vehiculoSeleccionado.id == 0){
        //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
        this.nuevoVehiculo();
    }else{
        //////console.log(vehiculoSeleccionado)
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
    ////console.log(this.vehiculos,vehiculoSeleccionado,code);

    return vehiculoSeleccionado;
  }*/

  seleccionarConductor(conductorSeleccionado:any){
    //console.log(conductorSeleccionado)
    if(conductorSeleccionado.id == 0){
      //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
      this.nuevoConductor();
    }else{
      //////////console.log(conductorSeleccionado);

      this.telefono = conductorSeleccionado.numerotelefono;
      this.celular = conductorSeleccionado.numerocelular;
      this.email = conductorSeleccionado.email;

    }
  }
  
  nuevaTransportadora(){
    const ref = this.dialogService.open(FormTransportadoraComponent, {
      data: {
          id: parseInt('1')
      },
      header: `Nueva transportadora` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async () => {
      await this.getTransportadoras();
      ////////////////console.log("Refresh calendar");
    });
  }
  
  nuevoVehiculo(){
    const ref = this.dialogService.open(FormVehiculoComponent, {
      data: {
          id: parseInt('1')
      },
      header: `Nuevo Vehículo` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async () => {
      await this.getVehiculos();
      ////////////////console.log("Refresh calendar");
    });
  }
  
  nuevoConductor(){
    const ref = this.dialogService.open(FormConductorComponent, {
      data: {
          id: parseInt('1')
      },
      header: `Nuevo Conductor` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async () => {
      await this.getConductores();
      ////////////////console.log("Refresh calendar");
    });
  }

  async getTurno(id: number){
    this.displayModal = true;
    this.loadingCargue = true;
    //let orden = await this.ordenesCargueService.getOrdenesByID(id);
    this.solicitudTurnoService.getTurnosByID(id)
        .subscribe({
              next:async (turno)=>{
                  console.log('turno',turno);
                  this.turno = turno;
                  this.cliente = turno.detalle_solicitud_turnos_pedido[0].CardCode+' - '+turno.detalle_solicitud_turnos_pedido[0].CardName;
                  this.localidad = turno.locacion;
                  this.fechacargue = new Date(turno.fechacita);
                  let hora = 60 * 60000;

                  let fechacargue = new Date (new Date(turno.fechacita).getTime()+(hora*5))
                  this.fechacargue = fechacargue;
                  
                  //console.log(fechacargue.toLocaleDateString());
                  //console.log(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }));
                  //console.log(parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[2]));
                  //console.log(new Date(fechacargue).setHours(parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[2])));
                  //console.log(new Date(new Date(fechacargue).setHours(parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[2]))))
                  let horacargue = new Date(new Date(fechacargue).setHours(parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[0]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[1]),parseInt(new Date(turno.horacita).toLocaleTimeString("en-US", { hour12: false }).split(":")[2])));
                  //this.horacargue = new Date(turno.horacita);
                  this.horacargue = horacargue;
                  this.condicion_tpt = turno.condiciontpt;
                  //this.horacargue = new Date();
                  this.placa = turno.vehiculo.placa;
                  this.tipo = turno.vehiculo.tipo_vehiculo.tipo;
                  this.vehiculoSeleccionado =  this.vehiculos.find(vehiculo=>vehiculo.code == this.placa);
                  //this.vehiculoSeleccionado = await this.asignarVehiculo(this.placa);
                  ////console.log(this.vehiculoSeleccionado);
                  this.pesomax = this.vehiculoSeleccionado.pesomax;
                  this.peso_bruto = turno.peso_vacio==0?this.vehiculoSeleccionado.pesovacio:turno.peso_vacio;
                 
                  
                  this.capacidadvh = this.vehiculoSeleccionado.capacidad;
                  this.transportadora = turno.transportadora.nit+' - '+turno.transportadora.nombre;
                  ////////console.log('transportadoras',this.transportadoras);
                  //this.transportadoraSeleccionada = this.transportadoras.find(tpt =>tpt.label === this.transportadora);
                  this.transportadoraSeleccionada = this.transportadoras.find(tpt =>tpt.code === turno.transportadora.nit);
                  this.conductor = turno.conductor.cedula+' - '+turno.conductor.nombre;
                  this.conductorSeleccionado = this.conductores.find(conductor=>conductor.label == this.conductor);
                  //his.estadoSeleccionado = this.estados.find(estado => estado.code == turno.estado);
                  ////////////console.log(this.estadoSeleccionado);
                  this.pedidosTurno = await this.calcularDisponibilidadPedido(turno.detalle_solicitud_turnos_pedido);
                  this.telefono = turno.conductor.numerotelefono;
                  this.celular = turno.conductor.numerocelular;
                  this.email = turno.conductor.email;
                  let totalesTabla = await this.functionsService.sumColArray(this.pedidosTurno.filter(pedido=>pedido.itemcode.startsWith('SF')),[{cantidad:0, comprometida:0, cantidadbodega:0, disponible:0 }]);
                  this.cantidad = totalesTabla[0].cantidad;
                  this.peso_neto = this.peso_bruto+this.cantidad;
                  this.totalCarga = totalesTabla[0].cantidad;
                  this.displayModal = false;
                  this.loadingCargue = false;
                  this.estado = turno.estado;

                  if(this.locaciones.filter(locacion=>locacion.code === this.localidad).length>0){
                    ////console.log(this.locaciones.filter(locacion=>locacion.code === almacenSeleccionado.code)[0].horarios_locacion);
                    ////console.log(this.horainicio, this.horafin);
                    this.diasNoAtencion = await this.obtenerDiasNoAtencion(this.locaciones.filter(locacion=>locacion.code === this.localidad)[0].horarios_locacion);
                    this.horariosLocacion = this.locaciones.filter(locacion=>locacion.code === this.localidad)[0].horarios_locacion;
                
                    //console.log('horariosLocacion',this.horariosLocacion);
                    await this.seleccionarFechaCita();
                  }else{
                    //Establecer horarios locacion
                    this.diasNoAtencion = [];
                    this.horariosLocacion = [];
                    this.horariosSeleccionados =[];
                  }
                

                  ////console.log(this.estado);
                  /*
                  let pedidosTurno:any[] = turno.detalle_solicitud_turnos_pedido;
                  let clientesTurno:any[] = [];
                  pedidosTurno.forEach(async pedido=>{
                    if(clientesTurno.filter(cliente=>cliente.CardCode === pedido.CardCode).length==0){
                      let EmailAddress = "";
                      let usuarioCliente = await this.usuariosService.infoUsuarioByCardCode(pedido.CardCode);
                      ////console.log('usuarioCliente',usuarioCliente);
                      if(usuarioCliente!=false){
                        EmailAddress = usuarioCliente.email;
                        //console.log('usuarioCliente.email',usuarioCliente.email);
                      }
                      
                      clientesTurno.push({
                          CardCode:pedido.CardCode,
                          CardName:pedido.CardName,
                          EmailAddress
                        });
                    }
                  });

                  //console.log('clientesTurno',clientesTurno);
                  
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

                  //console.log('turno2',turno2);*/
                  
                  this.configTablePedidosAlmacenCliente();
                  this.configSplitButton(this.estado,this.permisosModulo);
              },
              error:(err)=>{
                console.error(err);
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});

              }
        });


  }



  async calcularDisponibilidadPedido(pedidosTurno:any):Promise<any[]>{
    
    for(let pedido of pedidosTurno){
      //////////////console.log(pedido);
      let cantidadComprometida = 0;
      cantidadComprometida = await this.getCantidadComprometidaItemPedido(pedido.pedidonum,pedido.itemcode,pedido.bodega, pedido.id);
      //////////console.log('cantidadComprometida',cantidadComprometida , new Date());
      pedido.comprometida= cantidadComprometida;
      pedido.cantidadbodega = await this.getInventarioItenBodega(pedido.itemcode,pedido.bodega);
      //////////console.log('pedido.cantidadbodega',pedido.cantidadbodega , new Date());
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
    
    ////////////////console.log(inventarioItemBodega);
    const arrayInventariosItemBodega = await this.objectToArray(inventariosItemBodega);
    

    const inventarioItemBodega:any[] = arrayInventariosItemBodega.filter((inventario: { ItemCode: string; 
                                                                                  WhsCode: string; 
                                                                                }) => inventario.ItemCode == itemcode && 
                                                                                      inventario.WhsCode == bodega);
    //////////////console.log(inventarioItemBodega);                                                                                  

    let cantidadInventarioItenBodega:number = 0;
    
     inventarioItemBodega.forEach(function(a){cantidadInventarioItenBodega += parseFloat(a.OnHand);});

    //////////////console.log(cantidadInventarioItenBodega);    
  
    return cantidadInventarioItenBodega;
  }
  
  async objectToArray(object:any): Promise<any>{
      let array:any[] = [];

      //Object.keys(object).map((key) => { //////////////console.log(object[key])});
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

    //////////////////console.log(arrayFiltrar);
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

 async grabar(){



    this.grabarCambios =true;

    ////////console.log(this.transportadoraSeleccionada, this.vehiculoSeleccionado, this.conductorSeleccionado);


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

          //////////////console.log(data);
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

    

    /*if(!this.fechacargue || !this.horacargue || !this.estado){
      this.messageService.add({severity:'error', summary: '!Error¡', detail:  "Debe deiligenciar los campos resaltados en rojo"});
    }else{
      this.displayModal = true;
      this.loadingCargue = true;
      this.completeCargue=false;
      this.completeTimer = false;
      setTimeout(()=>{this.setTimer()},2500);
      const data:any = {
        fechacita:new Date(this.fechacargue),
        horacita:new Date(this.horacargue),
        estado: this.estadoSeleccionado.code
      }

      //////////////console.log(data);
      this.solicitudTurnoService.updateInfoTruno(this.turnoId,data)
          .subscribe({
                next:(reuslt)=>{
                  if(this.completeTimer){
                    this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el cargue de los turnos de la localidad.`});
                    this.displayModal = false;
                    this.loadingCargue = false;
                    
                  }
                  this.completeCargue = true;
                  this.messageComplete = `Se completo correctamente el porceso de cargue de los turnos de la localidad.`;
                 
                },
                error:(err)=> {
                  this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                    console.error(err);
                    this.displayModal = false;
                    this.loadingCargue = false;
                    
                },
          });
    }*/

   
    
  }

  cerrar(){
    this.ref.close();
  }


  configTablePedidosAlmacenCliente(){
    let headersTable:any= this.configHeadersPedidos();
    let dataTable:any = this.configDataTablePedidos(this.pedidosTurno);
    
    this.tablaPedidosTurno = {
      header: headersTable,
      data: dataTable
    }
  }

  configHeadersPedidos(){
    let headersTable:any[] = [
      {
        'index': { label:'',type:'', sizeCol:'0rem', align:'center', editable:false},
        'CardName': { label:'Cliente',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'docnum': { label:'Número pedido',type:'text', sizeCol:'6rem', align:'center', editable:false},
        //'cardname':{label:'Cliente',type:'text', sizeCol:'8rem', align:'left', editable:false}, 
        //'docdate': {label:'Fecha de contabilización',type:'date', sizeCol:'6rem',  align:'center', editable:false},
        //'duedate': {label:'Fecha de vencimiento',type:'date', sizeCol:'6rem', align:'center', editable:false},
        //'estado_doc': {label:'Estado pedido',type:'text', sizeCol:'6rem', align:'center'},
        //'estado_linea': {label:'Estado Linea',type:'text', sizeCol:'6rem', align:'center', visible:false,},
        
        //'dias': {label:'Dias',type:'number', sizeCol:'6rem', align:'center',visible:false,},
        'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',},
        'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'almacen': {label:'Almacen.',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false},
        'comprometida': {label:'Cantidad comprometida',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false},
        'cantidadbodega': {label:'Cantidad en bodega',type:'number', sizeCol:'6rem', align:'center',currency:"TON", side:"rigth", editable:false},
        'disponible': {label:'Disponible para cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON", side:"rigth", editable:false},
        
        
      }];
      
      return headersTable;
  }
  
  configDataTablePedidos(arregloPedido:any){

      //////////////console.log(arregloPedido);
      let totalCarga:number=0;
      let dataTable:any[] = [];
      let index:number = 0;
      for (let pedido of arregloPedido){
        let cantidadComprometida= 0;
        dataTable.push({
          index:pedido.id,
          CardName:pedido.CardName,
          docnum:pedido.pedidonum,
          itemcode:pedido.itemcode,
          itemname:pedido.itemname,
          almacen:pedido.bodega,
          cantidad:pedido.cantidad,
          comprometida:pedido.comprometida,
          cantidadbodega:pedido.cantidadbodega,
          disponible:pedido.disponible,
         
        });
        index++;
        //totalCarga+=parseFloat(pedido.cantidad); 
        //this.totalCarga = totalCarga;
        //this.cantidad =totalCarga;
      } 
      
      return dataTable;
  }

  configSplitButton(estadoActual:string, permisosModulo:any){
    //////////console.log(estadoActual,permisosModulo);

    this.arrayBtnTurnos = [];

    switch(estadoActual){
      case this.estadosTurno.SOLICITADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Aprobar turno').valor){
          this.arrayBtnTurnos.push(this.btnAprobar);
        }
      break;

      case this.estadosTurno.PAUSADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Activar turno').valor){
          this.arrayBtnTurnos.push(this.btnActivar);
        }
      break;

      case this.estadosTurno.AUTORIZADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Ingresar turno').valor){
          this.arrayBtnTurnos.push(this.btnIngreso);
        }
      break;

      case this.estadosTurno.ARRIBO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Pesar en bascula').valor){
          this.arrayBtnTurnos.push(this.btnPeso);
        }
      break;

      case this.estadosTurno.PESADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Inicio cargue').valor){
          this.arrayBtnTurnos.push(this.btnCargue);
        }
      break;

      case this.estadosTurno.CARGANDO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Fin cargue').valor){
          this.arrayBtnTurnos.push(this.btnFinCargue);
        }
      break;
      
      case this.estadosTurno.CARGADO:
        if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Despachar').valor){
          this.arrayBtnTurnos.push(this.btnDespachar);
        }
      break;

    }

    if(estadoActual!= this.estadosTurno.PAUSADO && estadoActual!= this.estadosTurno.CANCELADO){
      if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Pausar turno').valor){
        this.arrayBtnTurnos.push(this.btnPausar);
      }
    }

    if(estadoActual!=this.estadosTurno.CANCELADO){
      if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Cancelar turno').valor){
        this.arrayBtnTurnos.push(this.btnCancel);
      }
    }



  }
  
  
  historialTurno(){
    this.formHistorialTurno= true;

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
      this.accion = 'finalizar cargue'
      this.formEstadoTurno = true;
      this.tituloEstado = "Finalizar cargue turno "+this.turnoId;
    }
  }
  async despacharTurno(){
    if(await this.validarFormulario()){
      this.accion = 'despachar'
      this.formEstadoTurno = true;
      this.tituloEstado = "Despachar turno "+this.turnoId;
    }
  }

  cambiarEstadoTurno(){

    if((this.accion == 'pausar' ||  this.accion == 'cancelar' ) && ( this.novedadesSeleccionadas.length==0)){
      this.messageService.add({severity:'error', summary: '!Error¡', detail: `Para ${this.accion} el turno, debe seleccionar una novedad.` });
    }else{
      this.confirmationService.confirm({
        message: 'Esta seguro de '+this.accion+' la orden de cargue No. '+this.turnoId+'?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
  
            let nuevoEstado = "";
            let mensaje ="";
  
              switch(this.accion){
                  case 'aprobar':
                    nuevoEstado = this.estadosTurno.AUTORIZADO;
                    mensaje = `fue aprobado`;
                  break;
  
                  case 'pausar':
                    nuevoEstado = this.estadosTurno.PAUSADO;
                    mensaje = `ha sido pausado debido a: ${this.comentario}`;
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
  
                  case 'finalizar cargue':
                    nuevoEstado = this.estadosTurno.CARGADO;
                    mensaje = `ha sido cargado`;
                  break;
  
                  case 'despachar':
                    nuevoEstado = this.estadosTurno.DESPACHADO;
                    mensaje = `ha sido despachado`;
                  break;
  
                  case 'cancelar':
                    nuevoEstado = this.estadosTurno.CANCELADO;
                    mensaje = `ha sido cancelado`;
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

            if(this.novedadesSeleccionadas.length>0){
              data.historial.novedades = this.novedadesSeleccionadas;
            }
            
            if(this.updateModulo){
             
                data.fechacita = new Date(this.fechacargue);
                data.horacita = new Date(this.horacargue);
                //data.estado = this.estado;
                data.transportadora = this.transportadoraSeleccionada.id;
                data.vehiculo = this.vehiculoSeleccionado.id;
                data.conductor = this.conductorSeleccionado.id;
                data.peso_vacio = this.peso_bruto;
              
            }

            this.solicitudTurnoService.updateInfoTruno(this.turnoId,data)
              .subscribe({
                    next:async (turno)=>{
                        console.log(turno);
                        if(this.updateModulo){
                          this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha actualizado correctamente los cambios efectuados a la orden de cargue ${turno.id}.`});
                        }

                        this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el cambio del estado.`});
                        this.displayModal = false;
                        this.loadingCargue = false;
                        this.formEstadoTurno = false;
                        this.estado = turno.estado
      
                        this.configSplitButton(this.estado,this.permisosModulo);

                        let turnoMail:any = {
                          conductor:this.conductorSeleccionado,
                          estado:nuevoEstado,
                          fechacita:new Date(this.fechacargue).toLocaleDateString(),
                          horacita: new Date(this.horacargue).toLocaleTimeString(),
                          id:turno.id,
                          locacion:this.localidad,
                          lugarentrega:'',
                          municipioentrega:'',
                          observacion:'',
                          peso_vacio:this.peso_bruto,
                          transportadora:this.transportadoraSeleccionada,
                          vehiculo:this.vehiculoSeleccionado,
                          detalle_solicitud_turnos_pedido:this.pedidosTurno
                        }
                    
                        await this.configEmails(turnoMail,mensaje);

                    },
                    error:(err)=> {
                      this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                        console.error(err);
                        this.displayModal = false;
                        this.loadingCargue = false;
                        
                    }
              });

              /* 
            if(this.updateModulo){
                data = {
                fechacita:new Date(this.fechacargue),
                horacita:new Date(this.horacargue),
                estado: this.estado,
                transportadora:this.transportadoraSeleccionada.id,
                vehiculo: this.vehiculoSeleccionado.id,
                conductor:this.conductorSeleccionado.id,
                peso_vacio:this.peso_bruto
              }
    
              //console.log(data);
              this.solicitudTurnoService.updateInfoTruno(this.turnoId,data)
              .subscribe({
                    next:(reuslt)=>{
                      //if(this.completeTimer){
                        this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha actualizado correctamente los cambios efectuados a la orden de cargue ${this.turnoId}.`});
                        //this.displayModal = false;
                        //this.loadingCargue = false;
                        
                      //}
                      this.completeCargue = true;
                      this.messageComplete = `Se ha actualizado correctamente los cambios efectuados a la orden de cargue ${this.turnoId}.`;
  
                      data = {
                        estado:nuevoEstado,
                        fechaaccion:this.fechaaccion,
                        horaaccion:this.horaaccion,
                        comentario:this.comentario
                      }
            
                      this.solicitudTurnoService.updateEstadoTruno(this.turnoId,data)
                      .subscribe({
                            next:async (result)=>{
                             //////////console.log(result);
            
                              this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el cambio del estado.`});
                              this.displayModal = false;
                              this.loadingCargue = false;
                              this.formEstadoTurno = false;
                              this.estado = result.estado
            
                              this.configSplitButton(this.estado,this.permisosModulo);
  
                              let turno:any = {
                                conductor:this.conductorSeleccionado,
                                estado:nuevoEstado,
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
                          
                              await this.configEmails(turno,mensaje);
                          
                             
                            },
                            error:(err)=> {
                              this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                                console.error(err);
                                this.displayModal = false;
                                this.loadingCargue = false;
                                
                            },
                      });
  
                    
                    },
                    error:(err)=> {
                      this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                        console.error(err);
                        this.displayModal = false;
                        this.loadingCargue = false;
                        
                    },
              });
            }else{
              data = {
                estado:nuevoEstado,
                fechaaccion:this.fechaaccion,
                horaaccion:this.horaaccion,
                comentario:this.comentario
              }
    
              this.solicitudTurnoService.updateEstadoTruno(this.turnoId,data)
              .subscribe({
                    next:async (result)=>{
                     //////////console.log(result);
    
                      this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el cambio del estado.`});
                      this.displayModal = false;
                      this.loadingCargue = false;
                      this.formEstadoTurno = false;
                      this.estado = result.estado
    
                      this.configSplitButton(this.estado,this.permisosModulo);
  
                      let turno:any = {
                        conductor:this.conductorSeleccionado,
                        estado:nuevoEstado,
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
                  
                      await this.configEmails(turno,mensaje);
                    },
                    error:(err)=> {
                      this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                        console.error(err);
                        this.displayModal = false;
                        this.loadingCargue = false;
                        
                    },
              });
            }*/
  
            
  
  
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

  async emailsClientes(turno:any,mensaje:string):Promise<void> {
    if(turno.estado === EstadosDealleSolicitud.PAUSADO || turno.estado === EstadosDealleSolicitud.DESPACHADO){
      let turnosCliente:any[] = []; 
     
        
        turno.detalle_solicitud_turnos_pedido.forEach((pedido: { CardCode: any; itemcode: string; cantidad: any; CardName: any; })=>{
          ////console.log(turno.id, pedido.CardCode);
            let email_cliente = this.turno.solicitud.clientes.find((cliente: { CardCode: any; })=>cliente.CardCode === pedido.CardCode).EmailAddress;
            if(turnosCliente.filter(cliente=>cliente.codigo===pedido.CardCode).length === 0){
    
                let turnoCliente:any;
    
                turnoCliente ={
                  id:turno.id,
                  estado:turno.estado,
                  fechacita:new Date(turno.fechacita).toLocaleDateString(),
                  horacita:new Date(turno.horacita).toLocaleTimeString(),
                  locacion:turno.locacion,
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
                ////console.log(turnosCliente[indexCliente]);
    
                if(turnosCliente[indexCliente].turnos.filter((turnoCliente: { id: number; })=>turnoCliente.id === turno.id).length ==0){
                  let turnoCliente:any;
                  turnoCliente ={
                    id:turno.id,
                    estado:turno.estado,
                    fechacita:new Date(turno.fechacita).toLocaleDateString(),
                    horacita:new Date(turno.horacita).toLocaleTimeString(),
                    locacion:turno.locacion,
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
                  ////console.log(turnosCliente[indexCliente].turnos[indexTurno]);
                  turnosCliente[indexCliente].turnos[indexTurno].detalle_solicitud_turnos_pedido.push(pedido);
                  if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                    turnosCliente[indexCliente].turnos[indexTurno].toneladas_turno+=pedido.cantidad;
                  }
                  
                }
                
            }
        });

        turnosCliente.forEach(async (cliente)=>{
          console.log('email cliente', cliente.email);
          if(cliente.email!='' && cliente.email!=null){
      
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
              console.log('objectMail Cliente',objectMail);
              console.log(await this.functionsService.sendMail(objectMail));

            });
            
          }
        });
        
    }
    
    
  }

  async emailsVendedores(turno:any, mensaje:string): Promise<void>{
    let turnosVendedor:any[] = []; 
   
      
      turno.detalle_solicitud_turnos_pedido.forEach((pedido: { email_vendedor: any; itemcode: string; cantidad: any; })=>{
        ////console.log(turno.id, pedido.CardCode);
          if(turnosVendedor.filter(vendedor=>vendedor.codigo===pedido.email_vendedor).length === 0){
  
              let turnoVendedor:any;
              
  
              turnoVendedor ={
                id:turno.id,
                estado:turno.estado,
                fechacita:new Date(turno.fechacita).toLocaleDateString(),
                horacita:new Date(turno.horacita).toLocaleTimeString(),
                locacion:turno.locacion,
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
              ////console.log(turnosCliente[indexCliente]);
  
              if(turnosVendedor[indexVendedor].turnos.filter((turnoVendedor: { id: number; })=>turnoVendedor.id === turno.id).length ==0){
                let turnoVendedor:any;
                turnoVendedor ={
                  id:turno.id,
                  estado:turno.estado,
                  fechacita:new Date(turno.fechacita).toLocaleDateString(),
                  horacita:new Date(turno.horacita).toLocaleTimeString(),
                  locacion:turno.locacion,
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
                ////console.log(turnosCliente[indexCliente].turnos[indexTurno]);
                turnosVendedor[indexVendedor].turnos[indexTurno].detalle_solicitud_turnos_pedido.push(pedido);
                if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                  turnosVendedor[indexVendedor].turnos[indexTurno].toneladas_turno+=pedido.cantidad;
                }
              }
              
          }
      })
      
    
  
    //console.log(turnosVendedor);
  
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
          console.log('objectMail vendedor',objectMail);
          console.log(await this.functionsService.sendMail(objectMail));

        });


        
      }
    });
  }

  async emailBodegaEstado(turno:any,mensaje:string): Promise<void>{
   
    let emailBodega!:string;
    let locacion:any = turno.locacion;
  
    let emailsTurno = (await this.solicitudTurnoService.emailsTurno({estado_turno:turno.estado,locacion}))
                      .map((email: { email_responsable: any; }) => {return email.email_responsable});
  
    console.log('emailsTurno',emailsTurno.join());
  
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
      console.log('objectMail Bodega',objectMail);
      console.log(await this.functionsService.sendMail(objectMail));
  
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
    console.log('objectMail Transporta sociedada',objectMail);
    console.log(await this.functionsService.sendMail(objectMail));
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
    console.log('objectMail usuario creado',objectMail);
    console.log(await this.functionsService.sendMail(objectMail));

  }


  async configEmails(dataTurno:any, mensaje:string): Promise<void>{

    await this.emailsClientes(dataTurno,mensaje);
    await this.emailsVendedores(dataTurno,mensaje);
    await this.emailBodegaEstado(dataTurno,mensaje);
    if(this.condicion_tpt==="TRANSP"){
      await this.emailTransp(dataTurno,mensaje);
    }
    await this.emailCreador(dataTurno,mensaje);
    /*
    //Obtener información del turno 
    let turno:any = dataTurno;
    //Obtener el detalle de pedidos asociados al turno
    let pedidosTurno:any[] = turno.detalle_solicitud_turnos_pedido;
    let clientesTurno:any[] = [];

    let objectMail!:any;

    // Envio de email a los clientes asociados al turno
    //Recorrer el array de pedidos asociados al turno y obtener obtener la infción asociadas a cada cliente en pedidos del turno y enviar correo
    pedidosTurno.forEach(async pedido=>{
      if(clientesTurno.filter(cliente=>cliente.CardCode === pedido.CardCode).length==0){
        let EmailAddress = "";
        let usuarioCliente = await this.usuariosService.infoUsuarioByCardCode(pedido.CardCode);
        ////console.log('usuarioCliente',usuarioCliente);
        if(usuarioCliente!=false){
          EmailAddress = usuarioCliente.email;
          //console.log('usuarioCliente.email',usuarioCliente.email);
          let newTurno:any = {
            conductor:turno.conductor,
            estado:turno.estado,
            fechacita:turno.fechacita,
            horacita: turno.horacita,
            id:turno.id,
            locacion:turno.locacion,
            lugarentrega:turno.lugarentrega,
            municipioentrega:turno.municipioentrega,
            observacion:turno.observacion,
            peso_vacio:turno.peso_vacio,
            transportadora:turno.transportadora,
            vehiculo:turno.vehiculo,
            detalle_solicitud_turnos_pedido: turno.detalle_solicitud_turnos_pedido.filter((pedido_turno: { CardCode: any; })=>pedido_turno.CardCode === pedido.CardCode)
    
          }

          //Configuracion email para cliente
  
          objectMail = {
            to:EmailAddress,
            //to:usuarioCreador.email,
            subject:`Turno de cargue # ${turno.id}`,
            template:'./notificacion_cambio_turno',
            context:{
                        name:pedido.CardName,
                        turno_num:turno.id,
                        mensaje,
                        turno:newTurno
                        
            }         
          };
          //console.log('objectMail',objectMail);
          //console.log(await this.functionsService.sendMail(objectMail));

          // Configuracion de email para jefe de zona o vendedor

          // Obtener los pedidos asociados al jefe de zona o vendedor y sustituir la variable "detalle_solicitud_turnos_pedido" de "newTurno"
          // newTurno.detalle_solicitud_turnos_pedido = turno.detalle_solicitud_turnos_pedido.filter((pedido_turno: { CodeJefeZona: any; })=>pedido_turno.CodeJefeZona === pedido.CodeJefeZona);
          
        }
        
        clientesTurno.push({
            CardCode:pedido.CardCode,
            CardName:pedido.CardName,
            EmailAddress
          });
      }
    });



    

    //Envio de correo para el siguiente actor en el flujo del proceso del turno segun el estado del mismo.

    let emailBodega:string ="ralbor@nitrofert.com.co";
    
  

    objectMail = {
      to:emailBodega,
      //to:usuarioCreador.email,
      subject:`Turno de cargue # ${turno.id}`,
      template:'./notificacion_cambio_turno',
      context:{
                  name:emailBodega,
                  turno_num:turno.id,
                  mensaje,
                  turno
                  
      }         
    };
    //console.log('objectMail',objectMail);
    //console.log(await this.functionsService.sendMail(objectMail));

    //Email para lista de distribución TRANSPORTA SOCIEDAD
    */
   

  }

  cambioPesoBruto(event:any, peso:number){

    if(event.target.value ===''){
      event.target.value =0;
    }
    ////console.log(peso, this.peso_bruto);
    if(this.pesomax < (this.cantidad+this.peso_bruto)){
      //error cantidad a cargar mayor a la capacidad del vehiculo
      this.messageService.add({severity:'error', summary: '!Error¡', detail:`El peso neto a cargar es mayor al peso neto permitido`});
    }

  }

  presionarEnterPesoBruto(event:any, peso:number){
    if (event.key === "Enter") {
      this.cambioPesoBruto(event,peso);
    }

  }

  async validarFormulario():Promise<boolean> {
      let valido:boolean = false;

      if(!this.fechacargue || !this.horacargue || this.transportadoraSeleccionada.id==0 || this.vehiculoSeleccionado.id==0 || this.conductorSeleccionado.id==0){
        this.messageService.add({severity:'error', summary: '!Error¡', detail:  "Debe deiligenciar los campos resaltados en rojo"});
      }else if(this.capacidadvh<this.cantidad){
        this.messageService.add({severity:'error', summary: '!Error¡', detail:`La cantidad a cargar es mayor a la capacidad del vehículo`});
      }else if(this.pesomax<this.cantidad+this.peso_bruto){
        this.messageService.add({severity:'error', summary: '!Error¡', detail:`El peso neto a cargar es mayor al peso neto permitid`});
      }else if(!(await this.validarHoraCargue())){
        this.messageService.add({severity:'error', summary: '!Error¡', detail: 'La fecha y hora de cargue seleccionada esta fuera del horario de atención de la locación.'});
      }else{
        valido = true;
      }

      ////console.log(valido);

      return valido;
  }


}
