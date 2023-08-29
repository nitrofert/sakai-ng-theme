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

  historialTurno:any = {
    header: [{
      'index': { label:'',type:'', sizeCol:'0rem', align:'center', editable:false},
        'estado': { label:'Estao',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'fecha': { label:'Fecha',type:'date', sizeCol:'6rem', align:'center', editable:false},
        'hora': {label:'Hora',type:'text', sizeCol:'6rem', align:'center',},
        'usuario': {label:'Usuario',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'comentario': {label:'Comentario',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'novedades': {label:'Novedades',type:'list', sizeCol:'6rem', align:'center', editable:false},
    }],
      data: []
  };

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
  this.getTurno(this.turnoId);
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

                console.log(novedades);
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
                console.log('turno',turno);
                this.turno = turno;
                let historial = turno.detalle_solicitud_turnos_historial.map(  (linea: {
                  novedades: any;
                  usuario: any;
                  comentario: any;
                  hora_accion: any;
                  fecha_accion: any; id: any; estado: any; 
})=>{
                  let novedades =  linea.novedades.map((novedad: { novedad: any; })=>{return novedad.novedad});
                  let comentario ="";
                  if(linea.comentario!=null){
                    
                    comentario =  this.functionsService.bufferToString(linea.comentario)           
                  }
                 

                  return {
                    index:linea.id,
                    estado: linea.estado,
                    fecha: linea.fecha_accion,
                    hora:linea.hora_accion,
                    usuario:linea.usuario.nombrecompleto,
                    comentario,
                    novedades 
                  }
                });

                console.log(historial);

                this.historialTurno.data = historial;
                this.loadingCargue = false;
            },
            error:(err)=>{
              console.error(err);
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  err});

            }
      });


}



}
