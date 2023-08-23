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

@Component({
  selector: 'app-calendario-turnos',
  providers:[ConfirmationService,MessageService],
  templateUrl: './calendario-turnos.component.html',
  styleUrls: ['./calendario-turnos.component.scss']
})
export class CalendarioTurnosComponent implements OnInit {

  almacenes:any[] = [];

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

  turnosLocalidad:any[]=[];

  estadosTurno:any = EstadosDealleSolicitud;
  estadosTurno2:any;

  documentStyle = getComputedStyle(document.documentElement);

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private almacenesService: AlmacenesService,
    private changeDetector: ChangeDetectorRef,
    private solicitudTurnoService:SolicitudTurnoService,
    public dialogService: DialogService,

    ){}


  ngOnInit(): void {
    this.getAlmacenes();
    this.estadosTurno2  = this.solicitudTurnoService.estadosTurno;
  }

  getCalendar(){

    this.calendarOptions = {
      initialDate: new Date(),
      //plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      plugins: [timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: '  timeGridWeek,timeGridDay'
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
    

    let events:any[] = [];
    for(let turno of this.turnosLocalidad){
     //console.log(turno);
      events.push({
        id:`${turno.id}`,
        title:JSON.stringify({placa:turno.vehiculo.placa,
                              cliente:turno.detalle_solicitud_turnos_pedido[0].CardName,
                              estado:turno.estado
                            }),
          date: new Date(`${turno.fechacita}${turno.horacita.substring(10)}`),
          allDay: false,
          textColor:this.setTextColor(turno.estado),
          backgroundColor:this.setBackgroundColor(turno.estado),
          editable:false,
          
      })
    }

    //////console.log((events);

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
             
              this.getLocalidades(this.almacenes);
            },
            error:(err)=>{
                console.error(err);
            }
      
    }); 
  }

  getLocalidades(almacenes:any){
    
    let localidadesAlmacenes: any[] = [];
    for(let almacen of almacenes){
     
      //if(localidadesAlmacenes.filter(localidadAlmacen => localidadAlmacen.code == almacen.Location).length===0){
      if(localidadesAlmacenes.filter(localidadAlmacen => localidadAlmacen.code == almacen.locacion_codigo2).length===0){
      
        //TODO: Buscar datos del almacen en array de almacenes
       
        if(almacen.CorreoNoti!= null){
          let data = {
            code:almacen.locacion_codigo2, 
            name:almacen.locacion2,
            label:almacen.locacion2
          }
          localidadesAlmacenes.push(data);
        }
        
      }
    }
    this.localidades = localidadesAlmacenes.sort((a,b)=>{ return a.name <b.name ? -1 : 1});
  }

  seleccionarLocalidad(localidad:any){

    this.getTurnosPorLocalidad(localidad.code)
   //////console.log(localidad);
    
    //this.getCalendar();
    //this.showCalendar = true;
  }

  setTimer(){
    if(this.completeCargue){
      this.displayModal = false;
    }
    this.completeTimer = true;
    
  }

  getTurnosPorLocalidad(localidad:string){

    this.displayModal = true;
    this.loadingCargue = true;
    this.completeCargue=false;
    this.completeTimer = false;

    //setTimeout(this.setTimer,2500);
    setTimeout(()=>{this.setTimer()},2500);

    this.solicitudTurnoService.getTurnosPorLocalidad(localidad)
        .subscribe({
              next:(turnosLocalidad)=>{
                  ////console.log(turnosLocalidad);
                  if(this.completeTimer){
                    this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el cargue de los turnos de la localidad.`});
                    this.displayModal = false;
                    this.loadingCargue = false;
                    
                  }
                  this.completeCargue = true;
                  this.messageComplete = `Se completo correctamente el porceso de cargue de los turnos de la localidad.`;
                  this.turnosLocalidad = turnosLocalidad;
                  //this.getCalendar();
              },
              error:(err)=>{
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                console.error(err);
                this.displayModal = false;
                this.loadingCargue = false;
              }
        });
  }

  filtrarLocalidad(event:any){
    this.localidadesFiltradas = this.filter(event,this.localidades);
  }

  filter(event: any, arrayFiltrar:any[]) {

    //////////console.log((arrayFiltrar);
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
    


    
    let objectEvent = JSON.parse(clickInfo.event.title);
    let orden = clickInfo.event.id;

    //////console.log((clickInfo)

    
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
      //////console.log(("Refresh calendar");
    });


  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  handleEventsDragStop(event:any){
    //////console.log((event);
  }

  createEventId(){
    //return String(this.eventGuid++);
  }
    
}
