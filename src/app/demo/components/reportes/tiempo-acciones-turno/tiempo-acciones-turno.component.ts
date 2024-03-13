import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { NovedadesService } from 'src/app/demo/service/novedades.service';
import { PedidosService } from 'src/app/demo/service/pedidos.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { EstadosDealleSolicitud } from '../../turnos/estados-turno.enum';
import { LocalidadesService } from 'src/app/demo/service/localidades.service';
import { DependenciasService } from 'src/app/demo/service/dependencias.service';

@Component({
  selector: 'app-tiempo-acciones-turno',
  providers:[ConfirmationService,MessageService],
  templateUrl: './tiempo-acciones-turno.component.html',
  styleUrls: ['./tiempo-acciones-turno.component.scss']
})
export class TiempoAccionesTurnoComponent implements  OnInit, OnChanges {

  @Input() rangoFechas!:any;

  hoy = new Date();
  primerDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  ultimoDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
  filtroRnagoFechas:Date[] = [this.primerDiaMes,this.ultimoDiaMes];
  

  estados:any[] = [];
  
  estadoSeleccionadoInicial:any = [];
  estadosFiltradasInicial:any[] = [];
  
  estadoSeleccionadoFinal:any = [];
  estadosFiltradasFinal:any[] = [];
  
  locaciones:any[] = [];
  

  dataTableComprtamientoBodegas:any = {
    header:[{"locacion":{"label":"","type":"text","sizeCol":"6rem","align":"center","editable":false},
             "totalTurnos":{"label":"Turnos evaluados","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             "totalHoras":{"label":"Horas evaluadas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             "tiempo":{"label":"Tiempo promedio","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             
           }],
    data:[],
    colsSum:[]
  };

  


 
  loading:boolean = true;
  

  
  
  verEncabezado:boolean = true;

 


  infoTurnos:any[] = [];

  toneladasAdicionalLocaciones:any[] = [];

  localidades:any;
  dependencias_all:any;

  dataChart!:any;
  optionsDataChart!:any;

  

  constructor(private pedidosService: PedidosService,
    private almacenesService: AlmacenesService,
    private messageService: MessageService,

    private confirmationService: ConfirmationService,
    private novedadesService:NovedadesService,

    private solicitudTurnoService:SolicitudTurnoService,
    public dialogService: DialogService,
    private router:Router,
    public usuariosService:UsuarioService,
    public functionsService:FunctionsService,
    private localidadesService:LocalidadesService,
    private dependenciasService:DependenciasService


    ){
      
       
    }

  async ngOnInit() {

    this.estados =  (await this.functionsService.sortArrayObject( (await this.functionsService.clonObject(this.solicitudTurnoService.estadosTurno.filter(estado=>estado.name != EstadosDealleSolicitud.CANCELADO 
                                                                                                                                                                 && estado.name != EstadosDealleSolicitud.PAUSADO
                                                                                                                                                                 && estado.name != EstadosDealleSolicitud.ACTIVADO
                                                                                                                                                        ))),'order', 'ASC')).map((estado)=>{
                                                                                                                                                          estado.label = estado.name;
                                                                                                                                                          return estado;
                                                                                                                                                        });
    
    
    this.estadoSeleccionadoInicial = this.estados[0]; 
    //console.log('estadose',this.estados);
    
    if(this.rangoFechas){
      this.filtroRnagoFechas = this.rangoFechas;
      this.verEncabezado = false;
    }else{
      this.getLocaciones();

    }

   

   

  }

  ngOnChanges(changes: SimpleChanges){
    //////////////console.log('changes',changes['rangoFechas'].currentValue)
    this.filtroRnagoFechas = changes['rangoFechas'].currentValue
    this.getLocaciones();
    //this.setReporte();
  }

  cambioFecha(event:any){
    
    
    if(event[1]){
      //console.log(this.filtroRnagoFechas);
      //this.filtroRnagoFechas = event;
      //this.setReporte();
      //this.getLocaciones();
      this.seleccionarEstadoFinal();
  
    }
  }

  getLocaciones(){
    this.almacenesService.getLocaciones()
        .subscribe({
            next:async (locaciones)=>{

              //////console.log(locaciones);
              await locaciones.map((locacion:any)=>{
                locacion.label = locacion.locacion
              })
              this.locaciones = locaciones;
              
              //await this.setReporte();
              this.seleccionarEstadoInicial();
            },
            error:(err)=>{
              console.error(err);
            }
        })
  }


  async getInfoTurnos():Promise<any>{

    let params:any = {
      fechaInicio:this.filtroRnagoFechas[0],
      fechaFin:new Date(this.filtroRnagoFechas[1].setHours(23,59,59)),
      historial:true
    }

    //let infoTurnos = (await this.solicitudTurnoService.turnosExtendido(params)).raw;

    let infoTurnos = await this.solicitudTurnoService.allInfoTurnos(params);
    
    //////console.log('infoTurnos',infoTurnos);

    //return infoTurnos.filter((turno: { turnos_estado: EstadosDealleSolicitud; })=>turno.turnos_estado === EstadosDealleSolicitud.DESPACHADO)

    return infoTurnos;  
  }

  async filtrarEstadoInicial(event:any){
    ////console.log('filtrarEstadoInicial');
    this.estadosFiltradasInicial = await this.functionsService.filter(event,this.estados);
  }

  async filtrarEstadoFinal(event:any){
    ////console.log('filtrarEstadoFinal');
    this.estadosFiltradasFinal = await this.functionsService.filter(event,this.estadosFiltradasFinal);
  }

  async seleccionarEstadoInicial(){
    
    //console.log(this.estadoSeleccionadoInicial.name);
    //this.toneladasAdicionalLocaciones =[];
    //await this.setTablaLocacion(this.infoTurnos)
    //this.dataTableComprtamientoBodegas.data = [];
    //await this.setReporte();
    this.estadosFiltradasFinal = [];

    ////console.log('order estado inicial',this.estados.find(estado=>estado.name == this.estadoSeleccionadoInicial.name).order);
    let estadosFiltradasFinal = this.estados.filter(estado=>estado.order > (this.estados.find(estado=>estado.name == this.estadoSeleccionadoInicial.name).order));
    this.estadosFiltradasFinal = await this.functionsService.clonObject(estadosFiltradasFinal);
    ////console.log(this.estadosFiltradasFinal);

    this.estadoSeleccionadoFinal = this.estadosFiltradasFinal[0];
    ////console.log(this.estadoSeleccionadoFinal);
    this.seleccionarEstadoFinal();

  }

  async seleccionarEstadoFinal(){
    
    ////////console.log(this.locacionSeleccionada);
    //this.toneladasAdicionalLocaciones =[];
    //await this.setTablaLocacion(this.infoTurnos)
    this.dataTableComprtamientoBodegas.data = [];
    
   await this.setReporte();

  }

  async setReporte():Promise<void>{

    let infoTurnos = await this.getInfoTurnos();
    this.infoTurnos = infoTurnos;

    console.log('infoTurnos',infoTurnos);

    let fechaInicio = new Date(this.filtroRnagoFechas[0].toISOString());
    let fechaFinal = new Date(this.filtroRnagoFechas[1].toISOString());
    console.log('fecha inicio filtro',fechaInicio);
    console.log('fecha fin filtro',fechaFinal);

    //console.log(this.infoTurnos.filter(turno=>turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=> historial.estado === this.estadoSeleccionadoInicial.name ).length>0                                              && turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=> historial.estado  === this.estadoSeleccionadoFinal.name).length>0 ));

    let infoTurnosEstadosSeleccionados = this.infoTurnos.filter(turno=>turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=> historial.estado === this.estadoSeleccionadoInicial.name ).length>0
                                                                      && turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=> historial.estado  === this.estadoSeleccionadoFinal.name).length>0                                              
                                                              );
    console.log('infoTurnosEstadosSeleccionados',infoTurnosEstadosSeleccionados);

    let locacionesTurnos =(await this.functionsService.groupArray( (await this.functionsService.clonObject(infoTurnosEstadosSeleccionados.map((turno)=>{
                                                                                                  //////console.log(turno.locacion, turno)
                                                                                                  return {
                                                                                                    id: this.locaciones.filter(locacion=>locacion.code === turno.locacion).length==0?'':this.locaciones.filter(locacion=>locacion.code === turno.locacion)[0].id,
                                                                                                    code: turno.locacion,
                                                                                                    label: this.locaciones.filter(locacion=>locacion.code === turno.locacion).length==0?'':this.locaciones.filter(locacion=>locacion.code === turno.locacion)[0].locacion
                                                                                                  }
                                                                                                })
                                                                  )),'id')).filter(locacion=>locacion.id!='');

   ////console.log('locacionesTurnos',locacionesTurnos);
   
    let obectString:string ="";

    


    for(let locacion of locacionesTurnos){

      //console.log('locacion',locacion.label);
      obectString = `{"locacion":"${locacion.label}"`;
      let objectDiasLocion:any[] = [];
      let  turnosLocacionEstado = infoTurnosEstadosSeleccionados.filter((turno: {detalle_solicitud_turnos_historial: any; locacion: any; })=>turno.locacion === locacion.code 
                                                  && turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=>
                                                                                                      historial.estado === this.estadoSeleccionadoInicial.name
                                                                                                      || historial.estado === this.estadoSeleccionadoFinal.name
                                                                                                      //&& new Date(historial.fecha_accion).getDay() == dia.id
                                                                                                      //&& new Date(historial.fecha_accion).getMonth() == new Date(this.filtroRnagoFechas[0].toISOString()).getMonth()
                                                                                                      //&& new Date(historial.fecha_accion).getFullYear() == new Date(this.filtroRnagoFechas[1].toISOString()).getFullYear()
                                                                                                      ));
      ////console.log('turnosLocacionEstado',turnosLocacionEstado);
      let turnosValidados = 0; 
      let turnosNoValidados = 0; 
      let horas = 0 

      for await(let turnoLocacionEstado of turnosLocacionEstado){
        

        let lineasHistorialEstadoTurno = turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado  === this.estadoSeleccionadoInicial.name || historial.estado === this.estadoSeleccionadoFinal.name);
        ////console.log('turnoLocacionEstado',turnoLocacionEstado);
        ////console.log('lineasHistorialEstadoTurno',lineasHistorialEstadoTurno);

        let historialEstadoInicial = await this.functionsService.sortArrayObject(turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado  === this.estadoSeleccionadoInicial.name ),'id', 'ASC');

        //console.log('historialEstadoInicial',historialEstadoInicial);
        let historialEstadoFinal = await this.functionsService.sortArrayObject(turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado  ===  this.estadoSeleccionadoFinal.name),'id', 'DESC');
        //console.log('historialEstadoFinal',historialEstadoFinal);

        if(historialEstadoInicial.length>0 && historialEstadoFinal.length>0) {
          //////console.log(turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado === this.estadoSeleccionado.name));

          //let historialEstadoTurno = await this.functionsService.groupArray(await this.functionsService.sortArrayObject(lineasHistorialEstadoTurno,'id','DESC'),'estado');

          //if(historialEstadoTurno.length>=2){
            ////console.log('historialEstadoTurno',historialEstadoTurno);
            ////console.log('historialEstadoTurno[1].fecha_accion',historialEstadoTurno[1].fecha_accion);
            ////console.log('historialEstadoTurno[1].hora_acion',historialEstadoTurno[1].hora_accion.split(':'));
            ////console.log(new Date(new Date(`${historialEstadoInicial[0].fecha_accion}T00:00:00`).setHours(historialEstadoInicial[0].hora_accion.split(':')[0],historialEstadoInicial[0].hora_accion.split(':')[1],historialEstadoInicial[0].hora_accion.split(':')[2])));
            //console.log('historialEstadoInicial[0].hora_accion',historialEstadoInicial[0].hora_accion);
            //console.log('historialEstadoFinal[0].hora_accion',historialEstadoFinal[0].hora_accion);
            if(historialEstadoInicial[0].hora_accion==null){
              historialEstadoInicial[0].hora_accion = "00:00:00";
            }

            if(historialEstadoFinal[0].hora_accion==null){
              historialEstadoFinal[0].hora_accion = "00:00:00";
            }

            let fechaInicialAccion = new Date(new Date(`${historialEstadoInicial[0].fecha_accion}T00:00:00`).setHours(historialEstadoInicial[0].hora_accion.split(':')[0],historialEstadoInicial[0].hora_accion.split(':')[1],historialEstadoInicial[0].hora_accion.split(':')[2]));
            ////console.log('fechaInicialAccion',fechaInicialAccion);
            let fechaFinalAccion = new Date(new Date(`${historialEstadoFinal[0].fecha_accion}T00:00:00`).setHours(historialEstadoFinal[0].hora_accion.split(':')[0],historialEstadoFinal[0].hora_accion.split(':')[1],historialEstadoFinal[0].hora_accion.split(':')[2]));
            ////console.log('fechaFinalAccion',fechaFinalAccion);

            let diferenciaFechas = fechaFinalAccion.getTime() - fechaInicialAccion.getTime();
            let diferenciaFechaHoras = Math.round(diferenciaFechas/(1000*60*60));
            horas = horas+diferenciaFechaHoras;
            turnosValidados++;
            //console.log('diferenciaFechaHoras',diferenciaFechaHoras);
          //}
          
         
          //let fechaAccion = new Date(`${historialEstadoTurno.fecha_accion}T00:00:00`);
          //let diaAccion =fechaAccion.getDay();

          /*
          if(dia.id === diaAccion && fechaAccion >= fechaInicio && fechaAccion <= fechaFinal ){
            turnosDia=turnosDia+1;
          }
          */
        }else{
          turnosNoValidados++;
        }
      }
      //console.log('turnosNoValidados',turnosNoValidados);
      obectString+= `,"totalTurnos":"${turnosValidados}","totalHoras":"${horas}","tiempo":"${horas/turnosValidados}"}`;
      this.dataTableComprtamientoBodegas.data.push(JSON.parse(obectString));
    }
    this.loading = false;
  }

}
