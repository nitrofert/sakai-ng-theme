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

  dataTableComprtamientoBodegasDetallado:any = {
    header:[{"locacion":{"label":"Locacion","type":"text","sizeCol":"6rem","align":"center","editable":false},
             "turno":{"label":"Turno","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "horacita":{"label":"Fecha cita","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "vehiculo":{"label":"Placa","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "conductor":{"label":"Conductor","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "condiciontpt":{"label":"Tipo transporte","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "estado":{"label":"Estado","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "fechaaccion":{"label":"Fecha acción","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "horaaccion":{"label":"Hora acción","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "producto":{"label":"Producto","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "cantidad":{"label":"Cantidad","type":"number","sizeCol":"6rem","align":"center","editable":false}, 
             "comentario":{"label":"Comentario","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "tiempoEstado":{"label":"Tiempo x producto","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             "tiempoAcumuladoProducto":{"label":"Tiempo acumulado x producto","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             
             "horaAcumulada":{"label":"Total tiempo acumulado","type":"text","sizeCol":"6rem","align":"center","editable":false}, 
             

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
    ////////console.log('estadose',this.estados);
    
    if(this.rangoFechas){
      this.filtroRnagoFechas = this.rangoFechas;
      this.verEncabezado = false;
    }else{
      this.getLocaciones();

    }

   

   

  }

  ngOnChanges(changes: SimpleChanges){
    ////////////////////console.log('changes',changes['rangoFechas'].currentValue)
    this.loading = true;
    this.filtroRnagoFechas = changes['rangoFechas'].currentValue
    this.getLocaciones();
    //this.setReporte();
  }

  cambioFecha(event:any){
    
    
    if(event[1]){
      ////////console.log(this.filtroRnagoFechas);
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

              ////////////console.log(locaciones);
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
    
    ////////////console.log('infoTurnos',infoTurnos);

    //return infoTurnos.filter((turno: { turnos_estado: EstadosDealleSolicitud; })=>turno.turnos_estado === EstadosDealleSolicitud.DESPACHADO)

    return infoTurnos;  
  }

  async filtrarEstadoInicial(event:any){
    //////////console.log('filtrarEstadoInicial');
    this.estadosFiltradasInicial = await this.functionsService.filter(event,this.estados);
  }

  async filtrarEstadoFinal(event:any){
    //////////console.log('filtrarEstadoFinal');
    this.estadosFiltradasFinal = await this.functionsService.filter(event,this.estadosFiltradasFinal);
  }

  async seleccionarEstadoInicial(){
    
    ////////console.log(this.estadoSeleccionadoInicial.name);
    //this.toneladasAdicionalLocaciones =[];
    //await this.setTablaLocacion(this.infoTurnos)
    //this.dataTableComprtamientoBodegas.data = [];
    //await this.setReporte();
    this.estadosFiltradasFinal = [];

    //////////console.log('order estado inicial',this.estados.find(estado=>estado.name == this.estadoSeleccionadoInicial.name).order);
    let estadosFiltradasFinal = this.estados.filter(estado=>estado.order > (this.estados.find(estado=>estado.name == this.estadoSeleccionadoInicial.name).order));
    this.estadosFiltradasFinal = await this.functionsService.clonObject(estadosFiltradasFinal);
    //////////console.log(this.estadosFiltradasFinal);

    this.estadoSeleccionadoFinal = this.estadosFiltradasFinal[0];
    //////////console.log(this.estadoSeleccionadoFinal);
    this.seleccionarEstadoFinal();

  }
 
  async seleccionarEstadoFinal(){
    
    //////////////console.log(this.locacionSeleccionada);
    //this.toneladasAdicionalLocaciones =[];
    //await this.setTablaLocacion(this.infoTurnos)
    this.dataTableComprtamientoBodegas.data = [];
    
   await this.setReporte();

  }

  async setReporte2():Promise<void>{


    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365;

    let infoTurnos = await this.getInfoTurnos();
    this.infoTurnos = infoTurnos;

    //console.log('infoTurnos',infoTurnos);

    let fechaInicio = new Date(this.filtroRnagoFechas[0].toISOString());
    let fechaFinal = new Date(this.filtroRnagoFechas[1].toISOString());
    //////console.log('fecha inicio filtro',fechaInicio);
    //////console.log('fecha fin filtro',fechaFinal);

    ////////console.log(this.infoTurnos.filter(turno=>turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=> historial.estado === this.estadoSeleccionadoInicial.name ).length>0                                              && turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=> historial.estado  === this.estadoSeleccionadoFinal.name).length>0 ));

    let infoTurnosEstadosSeleccionados = this.infoTurnos.filter(turno=>turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=> historial.estado === this.estadoSeleccionadoInicial.name ).length>0
                                                                      && turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=> historial.estado  === this.estadoSeleccionadoFinal.name).length>0                                              
                                                              );
    //console.log('infoTurnosEstadosSeleccionados',infoTurnosEstadosSeleccionados);

    let locacionesTurnos =(await this.functionsService.groupArray( (await this.functionsService.clonObject(infoTurnosEstadosSeleccionados.map((turno)=>{
                                                                                                  ////////////console.log(turno.locacion, turno)
                                                                                                  return {
                                                                                                    id: this.locaciones.filter(locacion=>locacion.code === turno.locacion).length==0?'':this.locaciones.filter(locacion=>locacion.code === turno.locacion)[0].id,
                                                                                                    code: turno.locacion,
                                                                                                    label: this.locaciones.filter(locacion=>locacion.code === turno.locacion).length==0?'':this.locaciones.filter(locacion=>locacion.code === turno.locacion)[0].locacion
                                                                                                  }
                                                                                                })
                                                                  )),'id')).filter(locacion=>locacion.id!='');

   //////////console.log('locacionesTurnos',locacionesTurnos);
   
    let obectString:string ="";

    

    let detalle_historial_turnos:any[] = [];

    for(let locacion of locacionesTurnos){

      ////////console.log('locacion',locacion.label);
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
        console.log('turnoLocacionEstado',turnoLocacionEstado.id);
        //////////console.log('lineasHistorialEstadoTurno',lineasHistorialEstadoTurno);

        let historialEstadoInicial = await this.functionsService.sortArrayObject(turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado  === this.estadoSeleccionadoInicial.name ),'id', 'ASC');
        //////console.log('historialEstadoInicial',historialEstadoInicial);
        let historialEstadoFinal = await this.functionsService.sortArrayObject(turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado  ===  this.estadoSeleccionadoFinal.name),'id', 'DESC');
        //////console.log('historialEstadoFinal',historialEstadoFinal);

        if(historialEstadoInicial.length>0 && historialEstadoFinal.length>0) {
          let horaAcumulada = 0;
          let horaAcumuladaProducto = 0;
          //////console.log(`Historial locacion ${locacion.code} turno ${turnoLocacionEstado.id}:`,turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { id: any; })=>historial.id >= historialEstadoInicial[0].id && historial.id <= historialEstadoFinal[0].id ));
          let historialEntreEstados = turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { id: any; })=>historial.id >= historialEstadoInicial[0].id && historial.id <= historialEstadoFinal[0].id );
          //console.log('historialEntreEstados',historialEntreEstados);
          let fechaInicioHistorialTurno = new Date(`${historialEntreEstados[0].fecha_accion}T${historialEntreEstados[0].hora_accion}`);


          historialEntreEstados.map(async (historial:any, index:number, array:any[])=>{

            ////console.log('index',index);
            ////console.log('array',array);
            let tiempoEstado:string ="";

            let diferenciaFechasEstados = 0

            let dif ='00:00:00';

            if(index !=0){
              let horaInicialEstados:any  = array[index-1].hora_accion==null?"00:00:00":array[index-1].hora_accion;
              let horaFinalEstados:any  = array[index].hora_accion==null?"00:00:00":array[index].hora_accion;

              let fechaInicialAccionEstados = new Date(new Date(`${array[index-1].fecha_accion}T00:00:00`).setHours(horaInicialEstados.split(':')[0],horaInicialEstados.split(':')[1],horaInicialEstados.split(':')[2]));
              let fechaFinalAccionEstados = new Date(new Date(`${array[index].fecha_accion}T00:00:00`).setHours(horaFinalEstados.split(':')[0],horaFinalEstados.split(':')[1],horaFinalEstados.split(':')[2]));

              diferenciaFechasEstados = fechaFinalAccionEstados.getTime() - fechaInicialAccionEstados.getTime();
              //console.log('diferenciaFechasEstados',diferenciaFechasEstados)
            
              let diferenciaFechaHorasEstados = Math.round(diferenciaFechasEstados/(1000*60*60));

              dif =  await this.functionsService.dateDifFormatTime(fechaInicialAccionEstados,fechaFinalAccionEstados);


              //tiempoEstado = `${Math.round(diferenciaFechasEstados/(hour))}:${Math.round(diferenciaFechasEstados/(minute))}:${Math.round(diferenciaFechasEstados/(1000))}`;
              
              tiempoEstado = Math.round(diferenciaFechasEstados/(hour))!=0?`${Math.round(diferenciaFechasEstados/(hour))} horas`: Math.round(diferenciaFechasEstados/(minute))!=0?`${Math.round(diferenciaFechasEstados/(minute))} minutos`:`${Math.round(diferenciaFechasEstados/(1000))} segundos`;

              
              //horaAcumulada = horaAcumulada+(Math.round(diferenciaFechasEstados/(hour))+(Math.round(diferenciaFechasEstados/(minute))/60)+(Math.round(diferenciaFechasEstados/(1000))/3600))
              horaAcumulada = horaAcumulada+(Math.round(diferenciaFechasEstados/(hour))!=0?Math.round(diferenciaFechasEstados/(hour)):(Math.round(diferenciaFechasEstados/(minute))/60)+(Math.round(diferenciaFechasEstados/(1000))/3600))
            }

            let productos:any[] = turnoLocacionEstado.detalle_solicitud_turnos_pedido.filter((item: { itemcode: string; })=>!item.itemcode.startsWith("SF"));
            let diferenciaFechasProductoEstados = diferenciaFechasEstados/productos.length;
            console.log('diferenciaFechasProductoEstados',diferenciaFechasProductoEstados)

            //let tiempoEstadoProducto = Math.round(diferenciaFechasProductoEstados/(hour))!=0?`${Math.round(diferenciaFechasProductoEstados/(hour))} horas`: Math.round(diferenciaFechasProductoEstados/(minute))!=0?`${Math.round(diferenciaFechasProductoEstados/(minute))} minutos`:`${Math.round(diferenciaFechasProductoEstados/(1000))} segundos`;
            let acumuladoTiempoProducto =0;
            let i =1;
            productos.forEach(async (item)=>{
              //horaAcumuladaProducto = horaAcumuladaProducto+(Math.round(diferenciaFechasProductoEstados/(hour))!=0?Math.round(diferenciaFechasProductoEstados/(hour)):(Math.round(diferenciaFechasProductoEstados/(minute))/60)+(Math.round(diferenciaFechasProductoEstados/(1000))/3600))
              //acumuladoTiempoProducto+=diferenciaFechasProductoEstados;
              acumuladoTiempoProducto=diferenciaFechasProductoEstados*i;
              console.log('acumuladoTiempoProducto',i,acumuladoTiempoProducto)
            

              //let tiempoAcumuladoProducto = Math.round(acumuladoTiempoProducto/(hour))!=0?`${Math.round(acumuladoTiempoProducto/(hour))} horas`: Math.round(acumuladoTiempoProducto/(minute))!=0?`${Math.round(acumuladoTiempoProducto/(minute))} minutos`:`${Math.round(acumuladoTiempoProducto/(1000))} segundos`;
              let fechaHistorial  = new Date(`${historial.fecha_accion}T${historial.hora_accion}`);
              let tiempoEstadoProducto = await this.functionsService.dateDifFormatTime(fechaHistorial,new Date(fechaHistorial.getTime()+diferenciaFechasProductoEstados))
              let tiempoAcumuladoProducto = await this.functionsService.dateDifFormatTime(fechaHistorial,new Date((fechaHistorial.getTime()+acumuladoTiempoProducto)))

              //horaAcumuladaProducto = horaAcumuladaProducto+(diferenciaFechasProductoEstados/(hour));

              horaAcumuladaProducto = await this.functionsService.dateDifFormatTime(fechaInicioHistorialTurno,fechaHistorial);
              

              detalle_historial_turnos.push({
                locacion:locacion.label,
                turno:turnoLocacionEstado.id,
                horacita:turnoLocacionEstado.fechacita,
                vehiculo:turnoLocacionEstado.vehiculo.placa,
                conductor:turnoLocacionEstado.conductor.nombre,
                condiciontpt:turnoLocacionEstado.condiciontpt,
                estado:historial.estado,
                fechaaccion:historial.fecha_accion,
                horaaccion:historial.hora_accion,
                producto:item.itemname,
                cantidad:item.cantidad,
                comentario:this.functionsService.bufferToString(historial.comentario),
                tiempoEstado:tiempoEstadoProducto,
                tiempoAcumuladoProducto,
                //tiempoEstado,
                horaAcumulada:horaAcumuladaProducto
                //horaAcumulada,
  
              })

              i++;

            });

            



          })
          ////////////console.log(turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado === this.estadoSeleccionado.name));

          //let historialEstadoTurno = await this.functionsService.groupArray(await this.functionsService.sortArrayObject(lineasHistorialEstadoTurno,'id','DESC'),'estado');

          //if(historialEstadoTurno.length>=2){
            //////////console.log('historialEstadoTurno',historialEstadoTurno);
            //////////console.log('historialEstadoTurno[1].fecha_accion',historialEstadoTurno[1].fecha_accion);
            //////////console.log('historialEstadoTurno[1].hora_acion',historialEstadoTurno[1].hora_accion.split(':'));
            //////////console.log(new Date(new Date(`${historialEstadoInicial[0].fecha_accion}T00:00:00`).setHours(historialEstadoInicial[0].hora_accion.split(':')[0],historialEstadoInicial[0].hora_accion.split(':')[1],historialEstadoInicial[0].hora_accion.split(':')[2])));
            ////////console.log('historialEstadoInicial[0].hora_accion',historialEstadoInicial[0].hora_accion);
            ////////console.log('historialEstadoFinal[0].hora_accion',historialEstadoFinal[0].hora_accion);
            if(historialEstadoInicial[0].hora_accion==null){
              historialEstadoInicial[0].hora_accion = "00:00:00";
            }

            if(historialEstadoFinal[0].hora_accion==null){
              historialEstadoFinal[0].hora_accion = "00:00:00";
            }

            let fechaInicialAccion = new Date(new Date(`${historialEstadoInicial[0].fecha_accion}T00:00:00`).setHours(historialEstadoInicial[0].hora_accion.split(':')[0],historialEstadoInicial[0].hora_accion.split(':')[1],historialEstadoInicial[0].hora_accion.split(':')[2]));
            //////////console.log('fechaInicialAccion',fechaInicialAccion);
            let fechaFinalAccion = new Date(new Date(`${historialEstadoFinal[0].fecha_accion}T00:00:00`).setHours(historialEstadoFinal[0].hora_accion.split(':')[0],historialEstadoFinal[0].hora_accion.split(':')[1],historialEstadoFinal[0].hora_accion.split(':')[2]));
            //////////console.log('fechaFinalAccion',fechaFinalAccion);

            let diferenciaFechas = fechaFinalAccion.getTime() - fechaInicialAccion.getTime();
            let diferenciaFechaHoras = Math.round(diferenciaFechas/(1000*60*60));
            horas = horas+diferenciaFechaHoras;
            turnosValidados++;
            ////////console.log('diferenciaFechaHoras',diferenciaFechaHoras);
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
      ////////console.log('turnosNoValidados',turnosNoValidados);
      obectString+= `,"totalTurnos":"${turnosValidados}","totalHoras":"${horas}","tiempo":"${horas/turnosValidados}"}`;
      this.dataTableComprtamientoBodegas.data.push(JSON.parse(obectString));
    }
    ////console.log('detalle_historial_turnos',detalle_historial_turnos);
    this.dataTableComprtamientoBodegasDetallado.data = detalle_historial_turnos;
    this.loading = false;
  }

  async setReporte():Promise<void>{


    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365;

    let infoTurnos = await this.getInfoTurnos();
    this.infoTurnos = infoTurnos;

    //console.log('infoTurnos',infoTurnos);

    let infoTurnosEstadosSeleccionados = this.infoTurnos.filter(turno=>turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=> historial.estado === this.estadoSeleccionadoInicial.name ).length>0
                                                                      && turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=> historial.estado  === this.estadoSeleccionadoFinal.name).length>0                                              
                                                              );
    //console.log('infoTurnosEstadosSeleccionados',infoTurnosEstadosSeleccionados);

    let locacionesTurnos =(await this.functionsService.groupArray( (await this.functionsService.clonObject(infoTurnosEstadosSeleccionados.map((turno)=>{
                                                                                                  ////////////console.log(turno.locacion, turno)
                                                                                                  return {
                                                                                                    id: this.locaciones.filter(locacion=>locacion.code === turno.locacion).length==0?'':this.locaciones.filter(locacion=>locacion.code === turno.locacion)[0].id,
                                                                                                    code: turno.locacion,
                                                                                                    label: this.locaciones.filter(locacion=>locacion.code === turno.locacion).length==0?'':this.locaciones.filter(locacion=>locacion.code === turno.locacion)[0].locacion
                                                                                                  }
                                                                                                })
                                                                  )),'id')).filter(locacion=>locacion.id!='');

   //////////console.log('locacionesTurnos',locacionesTurnos);
   
    let obectString:string ="";
    let detalle_historial_turnos:any[] = [];

    for(let locacion of locacionesTurnos){

      ////////console.log('locacion',locacion.label);
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
        
        let historialEstadoInicial = await this.functionsService.sortArrayObject(turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado  === this.estadoSeleccionadoInicial.name ),'id', 'ASC');
        //////console.log('historialEstadoInicial',historialEstadoInicial);
        let historialEstadoFinal = await this.functionsService.sortArrayObject(turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado  ===  this.estadoSeleccionadoFinal.name),'id', 'DESC');
        //////console.log('historialEstadoFinal',historialEstadoFinal);

        if(historialEstadoInicial.length>0 && historialEstadoFinal.length>0) {
          let horaAcumulada = 0;
          let horaAcumuladaProducto = 0;
          //////console.log(`Historial locacion ${locacion.code} turno ${turnoLocacionEstado.id}:`,turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { id: any; })=>historial.id >= historialEstadoInicial[0].id && historial.id <= historialEstadoFinal[0].id ));
          let historialEntreEstados = turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { id: any; })=>historial.id >= historialEstadoInicial[0].id && historial.id <= historialEstadoFinal[0].id );
          //console.log('historialEntreEstados',historialEntreEstados);
          let fechaInicioHistorialTurno = new Date(`${historialEntreEstados[0].fecha_accion}T${historialEntreEstados[0].hora_accion}`);
          let fechInicioEstadoAnterior:Date = new Date(fechaInicioHistorialTurno);



          let i = 0;
          //Recorrer historial turno
          for(let estadoHistorialTurno of historialEntreEstados){

            //console.log(estadoHistorialTurno);
            //Obtener la fecha de accion estado
            let fechaInicioEstadoActual = new Date(`${estadoHistorialTurno.fecha_accion}T${estadoHistorialTurno.hora_accion}`);
            //Definir fecha inicio estado
             
            //Obtener tiempo en milisegundos entre fecha fechaAccionEstadoHistoarial y fechaInicioEstado
            let tiempoEntreEstados =   fechaInicioEstadoActual.getTime() - fechInicioEstadoAnterior.getTime();

            //Obtener tiempo en milisegundos entre estados x producto
            let productos:any[] = turnoLocacionEstado.detalle_solicitud_turnos_pedido.filter((item: { itemcode: string; })=>!item.itemcode.startsWith("SF"));
            let tiempoEntreEstadosProductos = tiempoEntreEstados/productos.length;

            console.log('Estado',estadoHistorialTurno.estado);
            console.log('fechInicioEstadoAnterior',fechInicioEstadoAnterior.toISOString());
            console.log('fechaInicioEstadoActual',fechaInicioEstadoActual.toISOString());
            //console.log('tiempoEntreEstados',tiempoEntreEstados);
            console.log('Diferencia entre estados',await this.functionsService.dateDifFormatTime(fechInicioEstadoAnterior,fechaInicioEstadoActual));
            
            //console.log('tiempoEntreEstadosProductos',tiempoEntreEstadosProductos);
            console.log('Diferencia entre productos x estado',await this.functionsService.dateDifFormatTime(fechaInicioEstadoActual,new Date(fechaInicioEstadoActual.getTime()+(tiempoEntreEstadosProductos))));
            let item = 1;
            for(let producto of productos){
                
                //Calcular fecha estimada estado producto
                let fechaEstimadaEstadoProducto = new Date(fechInicioEstadoAnterior.getTime()+(tiempoEntreEstadosProductos*item));
                console.log('fechaEstimadaEstadoProducto',item,fechaEstimadaEstadoProducto.toISOString());
                console.log('Diferencia entre fecha accion producto estado - fechaEstimadaEstadoProducto',await this.functionsService.dateDifFormatTime(fechaInicioEstadoActual,fechaEstimadaEstadoProducto));
                console.log('fechaInicioHistorialTurno',item,fechaInicioHistorialTurno.toISOString());
                console.log('fechInicioEstadoAnterior',item,fechaEstimadaEstadoProducto.toISOString());
                console.log('Diferencia entre fecha inicio Historial - fechaEstimadaEstadoProducto',await this.functionsService.dateDifFormatTime(fechaInicioHistorialTurno,fechInicioEstadoAnterior));

                detalle_historial_turnos.push({
                  locacion:locacion.label,
                  turno:turnoLocacionEstado.id,
                  horacita:turnoLocacionEstado.fechacita,
                  vehiculo:turnoLocacionEstado.vehiculo.placa,
                  conductor:turnoLocacionEstado.conductor.nombre,
                  condiciontpt:turnoLocacionEstado.condiciontpt,
                  estado:estadoHistorialTurno.estado,
                  fechaaccion:estadoHistorialTurno.fecha_accion,
                  horaaccion:estadoHistorialTurno.hora_accion,
                  producto:producto.itemname,
                  cantidad:producto.cantidad,
                  comentario:this.functionsService.bufferToString(estadoHistorialTurno.comentario),
                  tiempoEstado:await this.functionsService.dateDifFormatTime(fechaInicioEstadoActual,new Date(fechaInicioEstadoActual.getTime()+(tiempoEntreEstadosProductos))),
                  tiempoAcumuladoProducto:await this.functionsService.dateDifFormatTime(fechInicioEstadoAnterior,fechaEstimadaEstadoProducto),
                  //tiempoEstado,
                  horaAcumulada:await this.functionsService.dateDifFormatTime(fechaInicioHistorialTurno,fechaEstimadaEstadoProducto)
                  //horaAcumulada,
    
                })

                item++;
            }





            fechInicioEstadoAnterior = fechaInicioEstadoActual;

            i++;
          }
        

/*
          historialEntreEstados.map(async (historial:any, index:number, array:any[])=>{

            ////console.log('index',index);
            ////console.log('array',array);
            let tiempoEstado:string ="";

            let diferenciaFechasEstados = 0

            let dif ='00:00:00';

            if(index !=0){
              let horaInicialEstados:any  = array[index-1].hora_accion==null?"00:00:00":array[index-1].hora_accion;
              let horaFinalEstados:any  = array[index].hora_accion==null?"00:00:00":array[index].hora_accion;

              let fechaInicialAccionEstados = new Date(new Date(`${array[index-1].fecha_accion}T00:00:00`).setHours(horaInicialEstados.split(':')[0],horaInicialEstados.split(':')[1],horaInicialEstados.split(':')[2]));
              let fechaFinalAccionEstados = new Date(new Date(`${array[index].fecha_accion}T00:00:00`).setHours(horaFinalEstados.split(':')[0],horaFinalEstados.split(':')[1],horaFinalEstados.split(':')[2]));

              diferenciaFechasEstados = fechaFinalAccionEstados.getTime() - fechaInicialAccionEstados.getTime();
              //console.log('diferenciaFechasEstados',diferenciaFechasEstados)
            
              let diferenciaFechaHorasEstados = Math.round(diferenciaFechasEstados/(1000*60*60));

              dif =  await this.functionsService.dateDifFormatTime(fechaInicialAccionEstados,fechaFinalAccionEstados);


              //tiempoEstado = `${Math.round(diferenciaFechasEstados/(hour))}:${Math.round(diferenciaFechasEstados/(minute))}:${Math.round(diferenciaFechasEstados/(1000))}`;
              
              tiempoEstado = Math.round(diferenciaFechasEstados/(hour))!=0?`${Math.round(diferenciaFechasEstados/(hour))} horas`: Math.round(diferenciaFechasEstados/(minute))!=0?`${Math.round(diferenciaFechasEstados/(minute))} minutos`:`${Math.round(diferenciaFechasEstados/(1000))} segundos`;

              
              //horaAcumulada = horaAcumulada+(Math.round(diferenciaFechasEstados/(hour))+(Math.round(diferenciaFechasEstados/(minute))/60)+(Math.round(diferenciaFechasEstados/(1000))/3600))
              horaAcumulada = horaAcumulada+(Math.round(diferenciaFechasEstados/(hour))!=0?Math.round(diferenciaFechasEstados/(hour)):(Math.round(diferenciaFechasEstados/(minute))/60)+(Math.round(diferenciaFechasEstados/(1000))/3600))
            }

            let productos:any[] = turnoLocacionEstado.detalle_solicitud_turnos_pedido.filter((item: { itemcode: string; })=>!item.itemcode.startsWith("SF"));
            let diferenciaFechasProductoEstados = diferenciaFechasEstados/productos.length;
            console.log('diferenciaFechasProductoEstados',diferenciaFechasProductoEstados)

            //let tiempoEstadoProducto = Math.round(diferenciaFechasProductoEstados/(hour))!=0?`${Math.round(diferenciaFechasProductoEstados/(hour))} horas`: Math.round(diferenciaFechasProductoEstados/(minute))!=0?`${Math.round(diferenciaFechasProductoEstados/(minute))} minutos`:`${Math.round(diferenciaFechasProductoEstados/(1000))} segundos`;
            let acumuladoTiempoProducto =0;
            let i =1;
            productos.forEach(async (item)=>{
              //horaAcumuladaProducto = horaAcumuladaProducto+(Math.round(diferenciaFechasProductoEstados/(hour))!=0?Math.round(diferenciaFechasProductoEstados/(hour)):(Math.round(diferenciaFechasProductoEstados/(minute))/60)+(Math.round(diferenciaFechasProductoEstados/(1000))/3600))
              //acumuladoTiempoProducto+=diferenciaFechasProductoEstados;
              acumuladoTiempoProducto=diferenciaFechasProductoEstados*i;
              console.log('acumuladoTiempoProducto',i,acumuladoTiempoProducto)
            

              //let tiempoAcumuladoProducto = Math.round(acumuladoTiempoProducto/(hour))!=0?`${Math.round(acumuladoTiempoProducto/(hour))} horas`: Math.round(acumuladoTiempoProducto/(minute))!=0?`${Math.round(acumuladoTiempoProducto/(minute))} minutos`:`${Math.round(acumuladoTiempoProducto/(1000))} segundos`;
              let fechaHistorial  = new Date(`${historial.fecha_accion}T${historial.hora_accion}`);
              let tiempoEstadoProducto = await this.functionsService.dateDifFormatTime(fechaHistorial,new Date(fechaHistorial.getTime()+diferenciaFechasProductoEstados))
              let tiempoAcumuladoProducto = await this.functionsService.dateDifFormatTime(fechaHistorial,new Date((fechaHistorial.getTime()+acumuladoTiempoProducto)))

              //horaAcumuladaProducto = horaAcumuladaProducto+(diferenciaFechasProductoEstados/(hour));

              horaAcumuladaProducto = await this.functionsService.dateDifFormatTime(fechaInicioHistorialTurno,fechaHistorial);
              

              detalle_historial_turnos.push({
                locacion:locacion.label,
                turno:turnoLocacionEstado.id,
                horacita:turnoLocacionEstado.fechacita,
                vehiculo:turnoLocacionEstado.vehiculo.placa,
                conductor:turnoLocacionEstado.conductor.nombre,
                condiciontpt:turnoLocacionEstado.condiciontpt,
                estado:historial.estado,
                fechaaccion:historial.fecha_accion,
                horaaccion:historial.hora_accion,
                producto:item.itemname,
                cantidad:item.cantidad,
                comentario:this.functionsService.bufferToString(historial.comentario),
                tiempoEstado:tiempoEstadoProducto,
                tiempoAcumuladoProducto,
                //tiempoEstado,
                horaAcumulada:horaAcumuladaProducto
                //horaAcumulada,
  
              })

              i++;

            });

            



          })
      */

            if(historialEstadoInicial[0].hora_accion==null){
              historialEstadoInicial[0].hora_accion = "00:00:00";
            }

            if(historialEstadoFinal[0].hora_accion==null){
              historialEstadoFinal[0].hora_accion = "00:00:00";
            }

            let fechaInicialAccion = new Date(new Date(`${historialEstadoInicial[0].fecha_accion}T00:00:00`).setHours(historialEstadoInicial[0].hora_accion.split(':')[0],historialEstadoInicial[0].hora_accion.split(':')[1],historialEstadoInicial[0].hora_accion.split(':')[2]));
            //////////console.log('fechaInicialAccion',fechaInicialAccion);
            let fechaFinalAccion = new Date(new Date(`${historialEstadoFinal[0].fecha_accion}T00:00:00`).setHours(historialEstadoFinal[0].hora_accion.split(':')[0],historialEstadoFinal[0].hora_accion.split(':')[1],historialEstadoFinal[0].hora_accion.split(':')[2]));
            //////////console.log('fechaFinalAccion',fechaFinalAccion);

            let diferenciaFechas = fechaFinalAccion.getTime() - fechaInicialAccion.getTime();
            let diferenciaFechaHoras = Math.round(diferenciaFechas/(1000*60*60));
            horas = horas+diferenciaFechaHoras;
            turnosValidados++;
            ////////console.log('diferenciaFechaHoras',diferenciaFechaHoras);
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
      ////////console.log('turnosNoValidados',turnosNoValidados);
      obectString+= `,"totalTurnos":"${turnosValidados}","totalHoras":"${horas}","tiempo":"${horas/turnosValidados}"}`;
      this.dataTableComprtamientoBodegas.data.push(JSON.parse(obectString));
    }
    ////console.log('detalle_historial_turnos',detalle_historial_turnos);
    this.dataTableComprtamientoBodegasDetallado.data = detalle_historial_turnos;
    this.loading = false;
  }

}
