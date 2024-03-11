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
  selector: 'app-incumplimientos-turnos',
  providers:[ConfirmationService,MessageService],
  templateUrl: './comportamiento-bodegas.component.html',
  styleUrls: ['./comportamiento-bodegas.component.scss']
})
export class ComportamientoBodegasComponent implements  OnInit, OnChanges {

  @Input() rangoFechas!:any;

  hoy = new Date();
  primerDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  ultimoDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
  filtroRnagoFechas:Date[] = [this.primerDiaMes,this.ultimoDiaMes];
  

  estados:any[] = [];
  estadoSeleccionado:any = [];
  estadosFiltradas:any[] = [];
  locaciones:any[] = [];
  

  dataTableComprtamientoBodegas:any = {
    header:[{"locacion":{"label":"","type":"text","sizeCol":"6rem","align":"center","editable":false},
             "lunes":{"label":"Lunes","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             "martes":{"label":"Martes","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             "miercoles":{"label":"Miercoles","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             "jueves":{"label":"Jueves","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             "viernes":{"label":"Viernes","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             "sabado":{"label":"Sabado","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             "domingo":{"label":"Domingo","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
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

    this.estados =  (await this.functionsService.sortArrayObject( (await this.functionsService.clonObject(this.solicitudTurnoService.estadosTurno)),'order', 'ASC')).map((estado)=>{
      estado.label = estado.name;
      return estado;
    });
    
    
    this.estadoSeleccionado = this.estados[0]; 
   ////console.log('this.estadoSeleccionado.name',this.estadoSeleccionado.name);

    if(this.rangoFechas){
      this.filtroRnagoFechas = this.rangoFechas;
      this.verEncabezado = false;
    }

    this.getLocaciones();

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  
    this.optionsDataChart = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
          legend: {
              labels: {
                  color: textColor
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          y: {
              ticks: {
                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
      }
    };


  }

  ngOnChanges(changes: SimpleChanges){
    ////////////console.log('changes',changes['rangoFechas'].currentValue)
    this.filtroRnagoFechas = changes['rangoFechas'].currentValue
    this.setReporte();
  }

  cambioFecha(event:any){
    
    
    if(event[1]){
      ////////////console.log(this.filtroRnagoFechas);
      //this.filtroRnagoFechas = event;
      //this.setReporte();
  
    }
  }

  getLocaciones(){
    this.almacenesService.getLocaciones()
        .subscribe({
            next:async (locaciones)=>{

              ////console.log(locaciones);
              await locaciones.map((locacion:any)=>{
                locacion.label = locacion.locacion
              })
              this.locaciones = locaciones;
              
              await this.setReporte();
            },
            error:(err)=>{
              console.error(err);
            }
        })
  }


  async getInfoTurnos():Promise<any>{

    let params:any = {
      fechaInicio:this.filtroRnagoFechas[0],
      fechaFin:this.filtroRnagoFechas[1],
      historial:true
    }

    //let infoTurnos = (await this.solicitudTurnoService.turnosExtendido(params)).raw;

    let infoTurnos = await this.solicitudTurnoService.allInfoTurnos(params);
    
    ////console.log('infoTurnos',infoTurnos);

    //return infoTurnos.filter((turno: { turnos_estado: EstadosDealleSolicitud; })=>turno.turnos_estado === EstadosDealleSolicitud.DESPACHADO)

    return infoTurnos;  
  }

  async filtrarEstado(event:any){
    this.estadosFiltradas = await this.functionsService.filter(event,this.estados);
  }

  async seleccionarEstado(){
    
    //////console.log(this.locacionSeleccionada);
    //this.toneladasAdicionalLocaciones =[];
    //await this.setTablaLocacion(this.infoTurnos)
    this.dataTableComprtamientoBodegas.data = [];
    await this.setReporte();

  }

  async setReporte():Promise<void>{

    let infoTurnos = await this.getInfoTurnos();
    this.infoTurnos = infoTurnos;

    let fechaInicio = new Date(this.filtroRnagoFechas[0].toISOString());
    let fechaFinal = new Date(this.filtroRnagoFechas[1].toISOString());
   ////console.log('fecha inicio filtro',fechaInicio);
   ////console.log('fecha fin filtro',fechaFinal);

    let locacionesTurnos =(await this.functionsService.groupArray( (await this.functionsService.clonObject(this.infoTurnos.map((turno)=>{
                                                                                                  ////console.log(turno.locacion, turno)
                                                                                                  return {
                                                                                                    id: this.locaciones.filter(locacion=>locacion.code === turno.locacion).length==0?'':this.locaciones.filter(locacion=>locacion.code === turno.locacion)[0].id,
                                                                                                    code: turno.locacion,
                                                                                                    label: this.locaciones.filter(locacion=>locacion.code === turno.locacion).length==0?'':this.locaciones.filter(locacion=>locacion.code === turno.locacion)[0].locacion
                                                                                                  }
                                                                                                })
                                                                  )),'id')).filter(locacion=>locacion.id!='');

   //console.log('locacionesTurnos',locacionesTurnos);
   
    let obectString:string ="";

    let dataChart:any = {
      labels: this.functionsService.dias.map((dia)=>{ return dia.fullname}),
      datasets: []
    }


    for(let locacion of locacionesTurnos){

     ////console.log('locacion',locacion.label);
    
      obectString = `{"locacion":"${locacion.label}"`;
      
     
  
      let objectDiasLocion:any[] = [];

      let  turnosLocacionEstado = infoTurnos.filter((turno: {detalle_solicitud_turnos_historial: any; locacion: any; })=>turno.locacion === locacion.code 
                                                  && turno.detalle_solicitud_turnos_historial.filter((historial: { estado: any; fecha_accion:any })=>
                                                                                                      historial.estado === this.estadoSeleccionado.name
                                                                                                      //&& new Date(historial.fecha_accion).getDay() == dia.id
                                                                                                      //&& new Date(historial.fecha_accion).getMonth() == new Date(this.filtroRnagoFechas[0].toISOString()).getMonth()
                                                                                                      //&& new Date(historial.fecha_accion).getFullYear() == new Date(this.filtroRnagoFechas[1].toISOString()).getFullYear()
                                                                                                      ));
      ////console.log('turnosLocacionEstado',turnosLocacionEstado);
      let dataChartLocacion:any[] =[];

      for await(let dia of this.functionsService.dias){
       ////console.log('dia',dia.id,dia.fullname);
       
        let turnosDia = 0;  
        for await(let turnoLocacionEstado of turnosLocacionEstado){
          

          let lineasHistorialEstadoTurno = turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado === this.estadoSeleccionado.name);
          if(lineasHistorialEstadoTurno.length>0){
            ////console.log(turnoLocacionEstado.detalle_solicitud_turnos_historial.filter((historial: { estado: any; })=>historial.estado === this.estadoSeleccionado.name));
            let historialEstadoTurno = (await this.functionsService.sortArrayObject(lineasHistorialEstadoTurno,'id','DESC'))[0];
            let fechaAccion = new Date(`${historialEstadoTurno.fecha_accion}T00:00:00`);
            let diaAccion =fechaAccion.getDay();

            if(dia.id === diaAccion && fechaAccion >= fechaInicio && fechaAccion <= fechaFinal ){
             ////console.log('historialEstadoTurno',historialEstadoTurno);
             ////console.log('fecha-accion',fechaAccion);
             ////console.log('dia-fecha-accion',diaAccion);
             ////console.log('dia-ciclo',dia.id)
             ////console.log('coincidencia',dia.id,'=',diaAccion,fechaAccion, '>=', fechaInicio ,fechaAccion, '<=', fechaFinal);
              turnosDia=turnosDia+1;
            }
          }
        }
       ////console.log('turnosDia',turnosDia);

        obectString+= `,"${(dia.fullname).toLowerCase()}":"${turnosDia}"`;
        dataChartLocacion.push(turnosDia);
        /*objectDiasLocion.push({
          id:dia.id,
          label:dia.fullname,
          totalTurnos:turnosDia
        });*/

       ////console.log('objectDiasLocion',await this.functionsService.clonObject(objectDiasLocion));

      }

      obectString+='}';

      /*obectString+= `,"lunes":"${objectDiasLocion.find(dia=>dia.id===1).totalTurnos}"`;
      obectString+= `,"martes":"${objectDiasLocion.find(dia=>dia.id===2).totalTurnos}"`;
      obectString+= `,"miercoles":"${objectDiasLocion.find(dia=>dia.id===3).totalTurnos}"`;
      obectString+= `,"jueves":"${objectDiasLocion.find(dia=>dia.id===4).totalTurnos}"`;
      obectString+= `,"viernes":"${objectDiasLocion.find(dia=>dia.id===5).totalTurnos}"`;
      obectString+= `,"sabado":"${objectDiasLocion.find(dia=>dia.id===6).totalTurnos}"`;
      obectString+= `,"domingo":"${objectDiasLocion.find(dia=>dia.id===0).totalTurnos}"}`;*/
      
      this.dataTableComprtamientoBodegas.data.push(JSON.parse(obectString));

      let dataset = {
        label:locacion.label,
        data:dataChartLocacion,
        fill: false,
        borderColor: await  this.functionsService.generarColorHex(),
        tension: 0.4
      }

      dataChart.datasets.push(dataset);
      


   
  
    }

    console.log(dataChart);
    this.dataChart = dataChart;
    this.loading = false;
  }

}
