import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { EstadosDealleSolicitud } from '../estados-turno.enum';

@Component({
  selector: 'app-vista-estados-turno',
  providers:[ConfirmationService,MessageService],
  templateUrl: './vista-estados-turno.component.html',
  styleUrls: ['./vista-estados-turno.component.scss']
})
export class VistaEstadosTurnoComponent implements  OnInit{

  @Input() locacion:any;

  enumEstadosTurno:any = EstadosDealleSolicitud;
  estadosTurno!:any[];
  fechaEstados:Date = new Date();
  turnosLocalidad:any;
  turnosPlural: {[k: string]: string} = {'=0': 'turnos', '=1': 'turno', 'other': 'turnos'};

  @Output() onSelect: EventEmitter<any> = new EventEmitter();



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

 

  

  ngOnInit() {

    let estadosTurno:any[]  = this.solicitudTurnoService.estadosTurno;
    this.estadosTurno = estadosTurno.filter(estado=>estado.name !== EstadosDealleSolicitud.ACTIVADO);

    this.getTurnosPorLocalidad(this.locacion);

  }

  getTurnosPorLocalidad(localidad:string){


    this.solicitudTurnoService.getTurnosPorLocalidad(localidad)
        .subscribe({
              next:async (turnosLocalidad)=>{
                 //////console.log(turnosLocalidad);
                  this.turnosLocalidad = turnosLocalidad;
                  let boxEstados =await this.setBoxEstadosDate(this.fechaEstados,this.estadosTurno, turnosLocalidad);
                  this.estadosTurno = boxEstados;
                 //////console.log(boxEstados);
              },
              error:(err)=>{
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});
                console.error(err);
                
              }
        });
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

    return estados;
  }

  async seleccionarFecha(){
   //////console.log(this.fechaEstados);
    /*let boxEstados =await this.setBoxEstadosDate(this.fechaEstados,this.estadosTurno, this.turnosLocalidad);
   //////console.log(boxEstados);
    this.estadosTurno = boxEstados;*/
    this.getTurnosPorLocalidad(this.locacion);
  }

  selectTurno(event:any){
    

    let infoEvent = { 
      event:{
        id:event.id,
        title:JSON.stringify({
          placa:event.vehiculo.placa,
          cliente:event.detalle_solicitud_turnos_pedido[0].CardName,
          estado:event.estado,
          turnoid:event.id
        })
      }
    }

    ////console.log(infoEvent);
    this.onSelect.emit(infoEvent)
  }

}
