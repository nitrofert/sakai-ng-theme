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
    /*this.ordenesdecargue = [{
        id:'1',
        title:JSON.stringify({placa:'HNQ123',cliente:'MAGDA ROCIO RUIZ MOLANO'}),
        date: new Date('2023-03-03 10:00:00'),
        allDay: false,
        textColor:'white',
        backgroundColor:'red',
        editable:false,
        
    },
    {
      id:'2',
      title:JSON.stringify({placa:'SBL318',cliente:'C.I.TECNICAS BALTIME DE COLOMBIA S.A.'}),
        date: new Date('2023-03-02 10:00:00'),
        allDay: false,
        textColor:'black',
        backgroundColor:'pink',
        editable:false,
        
    },
    {
      id:'3',
      title:JSON.stringify({placa:'SBL318',cliente:'C.I.TECNICAS BALTIME DE COLOMBIA S.A.'}),
        date: new Date('2023-02-28 12:00:00'),
        allDay: false,
        textColor:'white',
        backgroundColor:'green',
        editable:false,
        
    },
    {
      id:'4',
      title:JSON.stringify({placa:'SBL318',cliente:'C.I.TECNICAS BALTIME DE COLOMBIA S.A.'}),
        date: new Date('2023-03-02 12:00:00'),
        allDay: false,
        textColor:'white',
        backgroundColor:'yellow',
        editable:false,
        
    }]*/

    let events:any[] = [];
    for(let turno of this.turnosLocalidad){
      //console.log((turno.fechacita);
      //console.log((turno.horacita);
      //console.log((`${turno.fechacita}${turno.horacita.substring(10)}`);

      events.push({
        id:`${turno.id}`,
        title:JSON.stringify({placa:turno.vehiculo.placa,cliente:turno.detalle_solicitud_turnos_pedido[0].CardName}),
          date: new Date(`${turno.fechacita}${turno.horacita.substring(10)}`),
          allDay: false,
          textColor:this.setTextColor(turno.estado),
          backgroundColor:this.setBackgroundColor(turno.estado),
          editable:false,
          
      })
    }

    //console.log((events);

    this.ordenesdecargue = events;

    return this.ordenesdecargue;
  }

  setBackgroundColor(estado: string){
    let backgroundColor = "";
    switch (estado) {
      case 'Pendiente':
        backgroundColor='red'
        break;
      case 'Autorizado':
        backgroundColor='pink'
        break;
      case 'Arribo a cargue':
        backgroundColor='yellow'
        break;
      
      case 'Fin cargue':
        backgroundColor='green'
        break;
    
    }
    return backgroundColor;
  }

  setTextColor(estado: string){
    let backgroundColor = "";
    switch (estado) {
      case 'Pendiente':
        backgroundColor='white'
        break;
      case 'Autorizado':
        backgroundColor='black'
        break;
      case 'Arribo a cargue':
        backgroundColor='black'
        break;
      
      case 'Fin cargue':
        backgroundColor='white'
        break;
    
    }
    return backgroundColor;
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
              ////console.log((almacenesTMP);
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
      ////console.log((almacen);
      if(localidadesAlmacenes.filter(localidadAlmacen => localidadAlmacen.code == almacen.Location).length===0){
        //TODO: Buscar datos del almacen en array de almacenes
        let data = {
                      code:almacen.Location, 
                      name:almacen.Location,
                      label:almacen.Location
                   }
        localidadesAlmacenes.push(data);
      }
    }
    this.localidades = localidadesAlmacenes.sort((a,b)=>{ return a.code <b.code ? -1 : 1});
  }

  seleccionarLocalidad(localidad:any){

    this.getTurnosPorLocalidad(localidad.code)
    
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
                  //console.log((turnosLocalidad);
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

    //////console.log((arrayFiltrar);
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

    //console.log((clickInfo)

    
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
      //console.log(("Refresh calendar");
    });


  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  handleEventsDragStop(event:any){
    //console.log((event);
  }

  createEventId(){
    //return String(this.eventGuid++);
  }
    
}
