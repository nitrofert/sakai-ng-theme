import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { NovedadesService } from 'src/app/demo/service/novedades.service';
import { OrdenesCargueService } from 'src/app/demo/service/ordenes-cargue.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { EstadosDealleSolicitud } from '../../turnos/estados-turno.enum';


@Component({
  selector: 'app-lista-historial-turno',
  providers:[ConfirmationService,MessageService],
  templateUrl: './lista-historial-turno.component.html',
  styleUrls: ['./lista-historial-turno.component.scss']
})
export class ListaHistorialTurnoComponent implements OnInit {

  turnoId!:number;
  turno!:any;
  hoy:Date = new Date();

  permisosModulo!:any[];
  estadosTurno:any = EstadosDealleSolicitud;
  rolesUsuario:any[]=[];

  novedades:any[] = [];
  novedadesSeleccionadas:any[] = [];
  novedad:boolean = false;
  formHistorialTurno:boolean = false;

  domain:string = window.location.hostname;

  displayModal:boolean = false;
  loadingCargue:boolean =true;


  estadosTurno2!:any;


  historialTurno:any = {
    header: [{
      'index': { label:'',type:'', sizeCol:'0rem', align:'center', editable:false},
        'estado': { label:'Estado',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'fecha': { label:'Fecha',type:'date', sizeCol:'6rem', align:'center', editable:false},
        'hora': {label:'Hora',type:'text', sizeCol:'6rem', align:'center',},
        'usuario': {label:'Usuario',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'comentario': {label:'Comentario',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'novedades': {label:'Novedades',type:'list', sizeCol:'6rem', align:'center', editable:false},
    }],
      data: []
  };

  events!: any[];

  constructor( private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private solicitudTurnoService:SolicitudTurnoService,
    public ref: DynamicDialogRef,
    private router:Router,
    public usuariosService:UsuarioService, 
    public dialogService: DialogService,
    public config: DynamicDialogConfig,
    public functionsService:FunctionsService,
    private novedadesService:NovedadesService) { }

ngOnInit() {
  this.turnoId = this.config.data.id;
  this.estadosTurno2  = this.solicitudTurnoService.estadosTurno;
  this.getTurno(this.turnoId);
  
  
}

getPermisosModulo(){
  
  const modulo = this.router.url;
  ////////////console.log(modulo);
  this.usuariosService.getPermisosModulo(modulo)
      .subscribe({
          next: async (permisos)=>{
            //////////////////console.log(permisos);
            if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
              this.router.navigate(['/auth/access']);
            }

            if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
              this.router.navigate(['/auth/access']);
            }
            this.permisosModulo = permisos;

            const infoUsuario = await this.usuariosService.infoUsuario();
            this.rolesUsuario = infoUsuario.roles;

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

               ////////console.log(novedades);
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
               ////////console.log('turno',turno);

               

                this.turno = turno;
                let historial = turno.detalle_solicitud_turnos_historial.map(  (linea: {
                  novedades: any;
                  usuario: any;
                  comentario: any;
                  hora_accion: any;
                  fecha_accion: any; id: any; estado: any; 
                  //disponibilidad:any, fechadisponibilidad:any
                  //tipo_solicitud:any
})=>{
                  let novedades =  linea.novedades.map((novedad: { novedad: any; })=>{return novedad.novedad});
                  let comentario ="";
                  //let disponibilidad ="";
                  //let fechadisponibilidad = "";
                  //let tipo_solicitud = ""

                  if(linea.comentario!=null){
                    
                    comentario =  this.functionsService.bufferToString(linea.comentario)           
                  }

                 /* if(linea.disponibilidad!=null){
                    
                    disponibilidad =  linea.disponibilidad;
                    fechadisponibilidad = linea.fechadisponibilidad;
                    
                  }

                  if(linea.tipo_solicitud){
                    tipo_solicitud = linea.tipo_solicitud
                  }*/
                 
                
                  return {
                    index:linea.id,
                    estado: linea.estado,
                    fecha: linea.fecha_accion,
                    hora:new Date(linea.fecha_accion+' '+linea.hora_accion).toLocaleTimeString("en-US", { hour12: true, timeZone:'America/Bogota' }),
                    usuario:linea.usuario.nombrecompleto,
                    comentario,
                    novedades,
                    //disponibilidad,
                    //fechadisponibilidad,
                    //tipo_solicitud
                  }
                });

                

                await this.setEventsTimeLine(historial);

                this.historialTurno.data = historial;
                this.loadingCargue = false;
            },
            error:(err)=>{
              console.error(err);
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});

            }
      });


}

async setEventsTimeLine(data:any):Promise<void>{

  ////////console.log(data, this.estadosTurno2);

  let events:any[] =[];
  for(let event of data){
   ////////console.log(event);
    //let dateEvent = new Date(new Date(event.fecha).getTime()+(60*60000*5));
    let dateEventTime = new Date(event.fecha+' '+event.hora);
    ////////console.log(event.fecha,dateEvent, dateEventTime);
    events.push({ status: event.estado, 
                  date: `${dateEventTime.toLocaleDateString()} ${dateEventTime.toLocaleTimeString("en-US", { hour12: true, timeZone:'America/Bogota' })}`,
                  usuario:event.usuario,
                  comentario:event.comentario,
                  novedades:event.novedades, 
                  disponibilidad:this.turno.detalle_solicitud_turnos_historial.find((linea:any) =>linea.id === event.index).disponibilidad,
                  fechadisponibilidad:this.turno.detalle_solicitud_turnos_historial.find((linea:any) =>linea.id === event.index).fechadisponibilidad,
                  tipo_solicitud:this.turno.detalle_solicitud_turnos_historial.find((linea:any) =>linea.id === event.index).tipo_solicitud,
                  icon: this.estadosTurno2.find((estado: { name: any; })=>estado.name === event.estado).icon, 
                  textColor: this.estadosTurno2.find((estado: { name: any; })=>estado.name === event.estado).textColor, 
                  backgroundColor:this.estadosTurno2.find((estado: { name: any; })=>estado.name === event.estado).backgroundColor,
                  image: 'game-controller.jpg' })
      
                
  }
  /*this.events = [
    { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
    { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
    { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
    { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
];*/

  this.events = events;

  //////console.log(this.events);
}

}
