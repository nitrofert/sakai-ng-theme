import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { FormTurnoComponent } from '../form-turno/form-turno.component';
import { EstadosDealleSolicitud } from '../estados-turno.enum';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { Router } from '@angular/router';

import esLocale from '@fullcalendar/core/locales/es'
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendario-turnos',
  providers:[ConfirmationService,MessageService],
  templateUrl: './calendario-turnos.component.html',
  styleUrls: ['./calendario-turnos.component.scss']
})
export class CalendarioTurnosComponent implements OnInit {

  almacenes:any[] = [];
  locaciones:any[] = [];
  localidades: any[] = [];
  localidadSeleccionada:any = [];
  localidadesFiltradas :any[]=[];
  ordenesdecargue!:EventSourceInput; 
  currentEvents: EventApi[] = [];
  eventGuid = 0;
  showCalendar = false;

  calendarOptions!:CalendarOptions

  displayModal:boolean = false;
  loadingCargue:boolean = false;
  completeCargue:boolean = false;
  completeTimer:boolean = false;
  messageComplete:string = "";
  //hoy:any = new Date().toLocaleDateString('en-us', { weekday:"long", day:'numeric', year:"numeric", month:"long"})
  hoy:any ='';
  currentDay!:Date[];

  turnosLocalidad:any[]=[];
  turnosLocalidad$!: Observable<any[]>;

  estadosTurno:any = EstadosDealleSolicitud;
  estadosTurno2!:any[];

  documentStyle = getComputedStyle(document.documentElement);
  infousuario!:any;
  boxEstados!:any[];
  permisosModulo!:any;
  


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private almacenesService: AlmacenesService,
    private changeDetector: ChangeDetectorRef,
    private solicitudTurnoService:SolicitudTurnoService,
    public dialogService: DialogService,
    public usuariosService:UsuarioService,
    private router:Router,
    private functionsService:FunctionsService

    ){}


  async ngOnInit(): Promise<void> {
    this.getPermisosModulo();
    
    let estadosTurno2:any[]  = this.solicitudTurnoService.estadosTurno;
    this.estadosTurno2 = estadosTurno2.filter(estado=>estado.name !== EstadosDealleSolicitud.ACTIVADO);
    //// ////////console.log(this.estadosTurno2);

    this.hoy = await this.functionsService.formatDate(new Date(), 'DDDD, dd MMMMM YYYY');
    //this.hoy = new Date()
  }

  getPermisosModulo(){
  
    const modulo = this.router.url;
    
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              ////////////// ////////console.log(permisos);
              if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                this.router.navigate(['/auth/access']);
              }
  
              if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                this.router.navigate(['/auth/access']);
              }
              this.permisosModulo = permisos;
              //this.multiplesClientes = await this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Seleccionar multiples clientes').valor;
              ////////////////////////// ////////console.log(this.multiplesClientes);
  
             
              /*
              this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
              this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
              this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
              this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
              */
         
              ////////////// ////////console.log(this.condicion_tpt);
              this.infousuario = await this.usuariosService.infoUsuario();
              //// ////////console.log(this.infousuario);
              this.getLocaciones();
              
  
            },
            error:(err)=>{
                console.error(err);
            }
        });
        
  }

  getCalendar(){

    this.calendarOptions = {
      initialDate: new Date(),
      //plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      locale:esLocale,
      
      plugins: [timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      editable: false,
      selectable: false,
      selectMirror: true,
      dayMaxEvents: true,
      //select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      //eventDragStop:this.handleEventsDragStop.bind(this),
      /*eventContent:function(arg) {
         return { html: arg.event.title};
      },*/
      events: this.getEvents()
    };
  

  }


  
  getEvents(){
    
    console.log(this.turnosLocalidad);

    let events:any[] = [];
    for(let turno of this.turnosLocalidad.filter(turnotmp=>turnotmp.estado != 'Cancelado')){
    //for(let turno of this.turnosLocalidad){
     //////// ////////console.log(turno);
      events.push({
        id:`${turno.id}`,
        title:JSON.stringify({placa:turno.vehiculo.placa,
                              cliente:turno.detalle_solicitud_turnos_pedido[0].CardName,
                              estado:turno.estado,
                              turnoid:turno.id
                            }),
          //date: new Date(`${turno.fechacita}${turno.horacita.substring(10)}`),
          date: new Date(`${turno.horacita}`),
          allDay: false,
          textColor:this.setTextColor(turno.estado),
          backgroundColor:this.setBackgroundColor(turno.estado),
          editable:false,
          
      })
    }

    //console.log(events);

    this.ordenesdecargue = events;

    return this.ordenesdecargue;
  }

  setBackgroundColor(estado: string){
    let backgroundColor = "";
    switch (estado) {
      case this.estadosTurno.SOLICITADO:

        backgroundColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.SOLICITADO).backgroundColor;
        break;

      case this.estadosTurno.PAUSADO:
          backgroundColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.PAUSADO).backgroundColor;
      break;

      case this.estadosTurno.AUTORIZADO:
        backgroundColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.AUTORIZADO).backgroundColor;
        break;
      case this.estadosTurno.ARRIBO:
        backgroundColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.ARRIBO).backgroundColor;
        break;
      
      case this.estadosTurno.PESADO:
          backgroundColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.PESADO).backgroundColor;
        break;
      
        case this.estadosTurno.CARGANDO:
          backgroundColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.CARGANDO).backgroundColor;
        break;

        case this.estadosTurno.PESADOF:
          backgroundColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.PESADOF).backgroundColor;
        break;

        case this.estadosTurno.CARGADO:
          backgroundColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.CARGADO).backgroundColor;
        break;
      
      case this.estadosTurno.DESPACHADO:
        backgroundColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.DESPACHADO).backgroundColor;
        break;

        case this.estadosTurno.CANCELADO:
          backgroundColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.CANCELADO).backgroundColor;
          break;
    
    }
    return this.documentStyle.getPropertyValue(`--${backgroundColor}`);;
  }

  setTextColor(estado: string){
    let textColor = "";
    switch (estado) {
      case this.estadosTurno.SOLICITADO:

      textColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.SOLICITADO).textColor;
        break;

      case this.estadosTurno.PAUSADO:
        textColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.PAUSADO).textColor;
      break;

      case this.estadosTurno.AUTORIZADO:
        textColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.AUTORIZADO).textColor;
        break;
      case this.estadosTurno.ARRIBO:
        textColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.ARRIBO).textColor;
        break;
      
      case this.estadosTurno.PESADO:
        textColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.PESADO).textColor;
        break;
      
        case this.estadosTurno.CARGANDO:
          textColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.CARGANDO).textColor;
        break;

        case this.estadosTurno.PESADOF:
          textColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.PESADOF).textColor;
        break;

        case this.estadosTurno.CARGADO:
          textColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.CARGADO).textColor;
        break;
      
      case this.estadosTurno.DESPACHADO:
        textColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.DESPACHADO).textColor;
        break;

        case this.estadosTurno.CANCELADO:
          textColor=this.estadosTurno2.find((item: { name: any; })=>item.name ===this.estadosTurno.CANCELADO).textColor;
          break;
      
    
    }
    return this.documentStyle.getPropertyValue(`--${textColor}`);
  }

  getLocaciones(){
    this.almacenesService.getLocaciones()
        .subscribe({
            next:(locaciones)=>{
               ////////console.log(locaciones);
              this.locaciones = locaciones;
              this.getAlmacenes();
            },
            error:(err)=>{
              console.error(err);
            }
        })
  }


  getAlmacenes(){
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
               ////////console.log(this.almacenes);
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
     ////////console.log(this.localidades);
    

    
    ////// ////////console.log('localidades',this.localidades);
  }

  seleccionarLocalidad(localidad:any){

    this.getTurnosPorLocalidad(localidad.code)
   //////////// ////////console.log(localidad);
    
    //this.getCalendar();
    //this.showCalendar = true;
  }

  setTimer(){
    if(this.completeCargue){
      this.displayModal = false;
    }
    this.completeTimer = true;
    
  }

  async getTurnosPorLocalidad(localidad:string){

    this.displayModal = true;
    this.loadingCargue = true;
    this.completeCargue=false;
    this.completeTimer = false;

    //setTimeout(this.setTimer,2500);
    setTimeout(()=>{this.setTimer()},2500);

    this.solicitudTurnoService.getTurnosPorLocalidad(localidad)
        .subscribe({
              next:async (turnosLocalidad)=>{
                  //console.log(turnosLocalidad);
                  if(this.completeTimer){
                    this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el cargue de los turnos de la localidad.`});
                    this.displayModal = false;
                    this.loadingCargue = false;
                  }

                  

                  this.completeCargue = true;
                  this.messageComplete = `Se completo correctamente el porceso de cargue de los turnos de la localidad.`;
                 


                  this.turnosLocalidad = turnosLocalidad;
                  //this.getCalendar();
                  this.boxEstados =await this.setBoxEstadosDate(new Date(),this.estadosTurno2, this.turnosLocalidad);
                  //// ////////console.log(this.boxEstados);
              },
              error:(err)=>{
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                console.error(err);
                this.displayModal = false;
                this.loadingCargue = false;
              }
        });

        /*
        let a:any;
        await this.solicitudTurnoService.getListaTurnosLocacion(localidad);
        this.turnosLocalidad$ = this.solicitudTurnoService.getTurnosLcacion$(localidad);
       //// ////////console.log(this.turnosLocalidad$);
        this.turnosLocalidad$.subscribe(turno=>a = turno);
       //// ////////console.log(a);
        this.turnosLocalidad$.subscribe({
              next:async (turnosLocalidad)=>{
               //// ////////console.log(turnosLocalidad);
                if(this.completeTimer){
                  this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el cargue de los turnos de la localidad.`});
                  this.displayModal = false;
                  this.loadingCargue = false;
                }

                this.turnosLocalidad = turnosLocalidad;
                this.completeCargue = true;
                this.messageComplete = `Se completo correctamente el porceso de cargue de los turnos de la localidad.`;

                this.boxEstados =await this.setBoxEstadosDate(new Date(),this.estadosTurno2, this.turnosLocalidad);
              },
              error:(err)=>{
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                console.error(err);
                this.displayModal = false;
                this.loadingCargue = false;
              }
        });*/
  }

  async setBoxEstadosDate(date:Date, estados:any, turnos:any):Promise<any>{
    let boxEstados:any[] = [];

    let dateString = date.toISOString().split('T')[0];

    for(let estado of estados){
      let boxEstado:any = {
        estado:estado.name,
        total: turnos.filter((turno: { estado: any; fechacita: string; })=>turno.estado === estado.name && turno.fechacita === dateString).length
      }
      boxEstados.push(boxEstado);
      estado.total = turnos.filter((turno: { estado: any; fechacita: string; })=>turno.estado === estado.name && turno.fechacita === dateString).length;
      estado.turnos = turnos.filter((turno: { estado: any; fechacita: string; })=>turno.estado === estado.name && turno.fechacita === dateString)
    }

    return boxEstados;
  }

  filtrarLocalidad(event:any){
    this.localidadesFiltradas = this.filter(event,this.localidades);
  }

  filter(event: any, arrayFiltrar:any[]) {

    //////////////// ////////console.log((arrayFiltrar);
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

  handleDateSelect(selectInfo: DateSelectArg) {
    /*const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: this.createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }*/
  }

  handleEventClick(clickInfo: any) {
   /*if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }*/
    //alert(clickInfo.event.title);
    
    // ////////console.log(clickInfo.event.title);

    
    let objectEvent = JSON.parse(clickInfo.event.title);
    let orden = clickInfo.event.id;

    //////////// ////////console.log((clickInfo)

    
    const ref = this.dialogService.open(FormTurnoComponent, {
      data: {
          id: parseInt(orden)
      },
      header: `Orden de cargue: ${orden}` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });

    ref.onClose.subscribe(() => {
      this.getTurnosPorLocalidad(this.localidadSeleccionada.code)
      this.getCalendar();
      //////////// ////////console.log(("Refresh calendar");
    });


  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  handleEventsDragStop(event:any){
    //////////// ////////console.log((event);
  }

  createEventId(){
    //return String(this.eventGuid++);
  }

 
    
}
