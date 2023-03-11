import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
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

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private almacenesService: AlmacenesService,
    private changeDetector: ChangeDetectorRef,
    public dialogService: DialogService
    ){}


  ngOnInit(): void {
    this.getAlmacenes();
    
  }

  getCalendar(){

    this.calendarOptions = {
      initialDate: new Date(),
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: '  timeGridWeek,timeGridDay'
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventDragStop:this.handleEventsDragStop.bind(this),
      /*eventContent:function(arg) {
         return { html: arg.event.title};
      },*/
      events:this.getEvents()
    };
  

  }


  
  getEvents(){
    this.ordenesdecargue = [{
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
        
    }]

    return this.ordenesdecargue;
  }

  getAlmacenes(){
    this.almacenesService.getAlmacenes().then(almacenes => {
      this.almacenes = almacenes;
      
      this.getLocalidades(this.almacenes);
    }); 
  }

  getLocalidades(almacenes:any){
    
    let localidadesAlmacenes: any[] = [];
    for(let almacen of almacenes){
      
      if(localidadesAlmacenes.filter(localidadAlmacen => localidadAlmacen.code == almacen.location_code).length===0){
        //TODO: Buscar datos del almacen en array de almacenes
        let data = {
                      code:almacen.location_code, 
                      name:almacen.tipo,
                      label:almacen.tipo
                   }
        localidadesAlmacenes.push(data);
      }
    }
    this.localidades = localidadesAlmacenes;
  }

  seleccionarLocalidad(localidad:any){
    //console.log(localidad);
    this.getCalendar();
    this.showCalendar = true;
  }

  filtrarLocalidad(event:any){
    this.localidadesFiltradas = this.filter(event,this.localidades);
  }

  filter(event: any, arrayFiltrar:any[]) {

    ////console.log(arrayFiltrar);
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

  handleEventClick(clickInfo: EventClickArg) {
   /*if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }*/
    //alert(clickInfo.event.title);
    let objectEvent = JSON.parse(clickInfo.event.title);
    let orden = clickInfo.event.id;
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
      this.getCalendar();
      console.log("Refresh calendar");
    });


  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  handleEventsDragStop(event:any){
    console.log(event);
  }

  createEventId(){
    return String(this.eventGuid++);
  }
    
}
