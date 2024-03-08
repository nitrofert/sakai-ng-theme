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
  templateUrl: './incumplimientos-turnos.component.html',
  styleUrls: ['./incumplimientos-turnos.component.scss']
})
export class IncumplimientosTurnosComponent implements  OnInit, OnChanges {

  @Input() rangoFechas!:any;

  hoy = new Date();
  primerDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  ultimoDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
  filtroRnagoFechas:Date[] = [this.primerDiaMes,this.ultimoDiaMes];

  

  dataTableIncumplimientoZonas:any = {
    header:[{"zona":{"label":"Zona","type":"text","sizeCol":"6rem","align":"center","editable":false},
             "prcTonCUMP":{"label":"% Turnos cumplidas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,currency:"%",side:"rigth"},
             "prcTonINCU":{"label":"% Turnos incumplidas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,currency:"%",side:"rigth"},
           }],
    data:[],
    colsSum:[]
  };

  dataTableIncumplimientoClientes:any = {
    header:[{"cliente":{"label":"Cliente","type":"text","sizeCol":"6rem","align":"center","editable":false},
             "tonCUMP":{"label":"Toneladas cumplidas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             "prcTonCUMP":{"label":"% Turnos cumplidas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,currency:"%",side:"rigth"},
             "tonINCU":{"label":"Toneladas incumplidas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
             "prcTonINCU":{"label":"% Turnos incumplidas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,currency:"%",side:"rigth"},
           }
          ],
    data:[],
    colsSum:[]
  };

 
  loading:boolean = false;
  

  
  
  verEncabezado:boolean = true;

 

  locaciones:any[] = [];
  locacionSeleccionada:any = [];
  locacionesFiltradas:any[] = [];

  infoTurnos:any[] = [];

  toneladasAdicionalLocaciones:any[] = [];

  localidades:any;
  dependencias_all:any;


 




  

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

    await this.getLocalidades();
    await this.getDependencias();

    if(this.rangoFechas){
      this.filtroRnagoFechas = this.rangoFechas;
      this.verEncabezado = false;
    }

    //////console.log('this.filtroRnagoFechas[0]',this.filtroRnagoFechas[0]);
    //////console.log('this.filtroRnagoFechas[1]',this.filtroRnagoFechas[1]);

    await this.setReporte();
   

  }

  ngOnChanges(changes: SimpleChanges){
    ////////console.log('changes',changes['rangoFechas'].currentValue)
    this.filtroRnagoFechas = changes['rangoFechas'].currentValue
    this.setReporte();
  }

  cambioFecha(event:any){
    
    
    if(event[1]){
      ////////console.log(this.filtroRnagoFechas);
      //this.filtroRnagoFechas = event;
      //this.setReporte();
  
    }
  }

  async getLocalidades():Promise<void>{
    this.localidades =  await this.localidadesService.getLocalidades();
    
  }

  async getDependencias():Promise<void>{
    this.dependencias_all =  await this.dependenciasService.getDependencias();
   
  }


  async getInfoTurnos():Promise<any>{

    let params:any = {
      fechaInicio:this.filtroRnagoFechas[0],
      fechaFin:this.filtroRnagoFechas[1],
      historial:true
    }

    //let infoTurnos = (await this.solicitudTurnoService.turnosExtendido(params)).raw;

    let infoTurnos = await this.solicitudTurnoService.allInfoTurnos(params);
    
    //console.log('infoTurnos',infoTurnos);

    //return infoTurnos.filter((turno: { turnos_estado: EstadosDealleSolicitud; })=>turno.turnos_estado === EstadosDealleSolicitud.DESPACHADO)

    return infoTurnos;  
  }

 

  async setReporte():Promise<void>{

    let infoTurnos = await this.getInfoTurnos();
    this.infoTurnos = infoTurnos;


    let turnosApCn = infoTurnos.filter((turno: { detalle_solicitud_turnos_historial: any[]; }) => 
                                        (turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO).length>0 
                                        && (turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO))[0].novedades.filter((novedad: { novedad: string; })=>
                                                                                                                                                                                      novedad.novedad ==='VEHÍCULO NO SE PRESENTA').length>0)
                                        ||
                                        (turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO).length==0
                                        && turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.AUTORIZADO).length>0 )
                                      )
    //console.log('turnosApCn',turnosApCn);

    

    let zonas:any[] = [];
    let clientes:any[] = [];
    await turnosApCn.map((turno:any)=>{
        turno.detalle_solicitud_turnos_pedido.map((pedido:any)=>{
          if(zonas.filter(zona=>zona.code === pedido.localidad).length==0){
            zonas.push({
                code:pedido.localidad,
                label: this.localidades.filter((localidad: { id: any; })=>localidad.id === pedido.localidad).length ==0?'SIN ZONA':this.localidades.filter((localidad: { id: any; })=>localidad.id === pedido.localidad)[0].name
            })
          }

          if(clientes.filter(cliente=>cliente.code === pedido.CardCode).length==0){
            clientes.push({
              code:pedido.CardCode,
              label: pedido.CardName,
          })
          }
        })
    });

    let objString:string = "";

    let dataTable:any[] = [];

    for(let zona of zonas){
        let turnosIncumplidosZona = turnosApCn.filter((turno: { detalle_solicitud_turnos_historial: any[]; detalle_solicitud_turnos_pedido:any[] }) => 
                                                      (turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO).length>0 
                                                       && (turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO))[0].novedades.filter((novedad: { novedad: string; })=> novedad.novedad ==='VEHÍCULO NO SE PRESENTA').length>0)
                                                       && turno.detalle_solicitud_turnos_pedido.filter(pedido=>pedido.localidad === zona.code).length>0
                                                     );
        let turnosCumplidosZona = turnosApCn.filter((turno: { detalle_solicitud_turnos_historial: any[]; detalle_solicitud_turnos_pedido:any[] }) => 
                                                    (turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO).length==0 && turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.AUTORIZADO).length>0 )
                                                     && turno.detalle_solicitud_turnos_pedido.filter(pedido=>pedido.localidad === zona.code).length>0
                                                  );
        zona.incumplidos=turnosIncumplidosZona.length;
        zona.cumplidos=turnosCumplidosZona.length;

        let totalTurnosZona= turnosIncumplidosZona.length+turnosCumplidosZona.length;
        let prcTonINCU = totalTurnosZona==0?0:(turnosIncumplidosZona.length/totalTurnosZona*100);
        let prcTonCUMP = totalTurnosZona==0?0:(turnosCumplidosZona.length/totalTurnosZona*100);

        

        objString=`{"zona":"${zona.label}","prcTonCUMP":${prcTonCUMP},"prcTonINCU":${prcTonINCU}}`;
        dataTable.push(JSON.parse(objString));

    }

    dataTable = await this.functionsService.sortArrayObject(dataTable,'prcTonINCU','DESC');

    this.dataTableIncumplimientoZonas.data=dataTable;


    objString = "";

    dataTable = [];

    for(let cliente of clientes){
      let turnosIncumplidosCliente = turnosApCn.filter((turno: { detalle_solicitud_turnos_historial: any[]; detalle_solicitud_turnos_pedido:any[] }) => 
                                                    (turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO).length>0 
                                                     && (turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO))[0].novedades.filter((novedad: { novedad: string; })=> novedad.novedad ==='VEHÍCULO NO SE PRESENTA').length>0)
                                                     && turno.detalle_solicitud_turnos_pedido.filter(pedido=>pedido.CardCode === cliente.code).length>0
                                                   );
       

      console.log('turnosIncumplidosCliente',turnosIncumplidosCliente);
      let toneladasIncumplidasCliente = 0;
      await turnosIncumplidosCliente.map((turno:any)=>{
          //turno.detalle_solicitud_turnos_pedido.filter((pedido: { CardCode: any; })=>pedido.CardCode === cliente.code)
          turno.detalle_solicitud_turnos_pedido.map((pedido: { CardCode: any; cantidad: number; })=>{
            if(pedido.CardCode === cliente.code){
              toneladasIncumplidasCliente+=pedido.cantidad;
            }
          })
      })

      console.log('toneladasIncumplidasCliente',toneladasIncumplidasCliente);

      let turnosCumplidosCliente = turnosApCn.filter((turno: { detalle_solicitud_turnos_historial: any[]; detalle_solicitud_turnos_pedido:any[] }) => 
                                                  (turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO).length==0 && turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.AUTORIZADO).length>0 )
                                                   && turno.detalle_solicitud_turnos_pedido.filter(pedido=>pedido.CardCode === cliente.code).length>0
                                                );

      //console.log('turnosCumplidosCliente',turnosCumplidosCliente);

      let toneladasCumplidasCliente = 0;
      await turnosCumplidosCliente.map((turno:any)=>{
          //turno.detalle_solicitud_turnos_pedido.filter((pedido: { CardCode: any; })=>pedido.CardCode === cliente.code)
          turno.detalle_solicitud_turnos_pedido.map((pedido: { CardCode: any; cantidad: number; })=>{
            if(pedido.CardCode === cliente.code){
              toneladasCumplidasCliente+=pedido.cantidad;
            }
          })
      })

      cliente.incumplidos=turnosIncumplidosCliente.length;
      cliente.cumplidos=turnosCumplidosCliente.length;

      let totalTurnosCliente= turnosIncumplidosCliente.length+turnosCumplidosCliente.length;
      let prcTonINCU = totalTurnosCliente==0?0:(turnosIncumplidosCliente.length/totalTurnosCliente*100);
      let prcTonCUMP = totalTurnosCliente==0?0:(turnosCumplidosCliente.length/totalTurnosCliente*100);

      

      objString=`{"cliente":"${cliente.label}","tonCUMP":${toneladasCumplidasCliente},"prcTonCUMP":${prcTonCUMP},"tonINCU":${toneladasIncumplidasCliente},"prcTonINCU":${prcTonINCU}}`;
      dataTable.push(JSON.parse(objString));

  }

  dataTable = await this.functionsService.sortArrayObject(dataTable,'prcTonINCU','DESC');

  this.dataTableIncumplimientoClientes.data=dataTable;



    /*
    let turnosCanceladosXincumplimiento= infoTurnos.filter((turno: { detalle_solicitud_turnos_historial: any[]; }) => 
                                                            turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO).length>0 
                                                            && (turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO))[0].novedades.filter((novedad: { novedad: string; })=>
                                                                                                                                                                                                          novedad.novedad ==='VEHÍCULO NO SE PRESENTA').length>0
                                                          )
    
    //console.log('turnosCanceladosXincumplimiento',turnosCanceladosXincumplimiento);
    let zonas:any[] = [];
    await turnosCanceladosXincumplimiento.map((turno:any)=>{
        turno.detalle_solicitud_turnos_pedido.map((pedido:any)=>{
          if(zonas.filter(zona=>zona.code === pedido.localidad).length==0){
            zonas.push({
                code:pedido.localidad,
                label: this.localidades.filter((localidad: { id: any; })=>localidad.id === pedido.localidad).length ==0?'SIN ZONA':this.localidades.filter((localidad: { id: any; })=>localidad.id === pedido.localidad)[0].name,              
            })
          }
        })
    });


    let turnosAprobados= infoTurnos.filter((turno: { detalle_solicitud_turnos_historial: any[]; }) => 
                                            turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.CANCELADO).length==0
                                            && turno.detalle_solicitud_turnos_historial.filter(historial=>historial.estado === EstadosDealleSolicitud.AUTORIZADO).length>0 
                                          )
    //console.log('turnosAprobados',turnosAprobados);

    await turnosAprobados.map((turno:any)=>{
      turno.detalle_solicitud_turnos_pedido.map((pedido:any)=>{
        if(zonas.filter(zona=>zona.code === pedido.localidad).length==0){
          zonas.push({
              code:pedido.localidad,
              label: this.localidades.filter((localidad: { id: any; })=>localidad.id === pedido.localidad).length ==0?'SIN ZONA':this.localidades.filter((localidad: { id: any; })=>localidad.id === pedido.localidad)[0].name,              
          })
        }
      })
  });*/

  //console.log('zonas',zonas);

  //console.log('clientes',clientes);


    /*
   
    let turnosCanceladosXincumplimiento = infoTurnos.filter((turno: { historial_turno_estado: EstadosDealleSolicitud; })=>turno.historial_turno_estado === EstadosDealleSolicitud.CANCELADO);
    //console.log('turnosCanceladosXincumplimiento',turnosCanceladosXincumplimiento);

    let turnosAprobados = infoTurnos.filter((turno: { historial_turno_estado: EstadosDealleSolicitud; })=>turno.historial_turno_estado === EstadosDealleSolicitud.AUTORIZADO);
    //console.log('turnosAprobados',turnosAprobados)




    
    let dataTable = await this.configDataTablaIncumplimientoZonas(infoTurnos);
    ////console.log(dataTable);
    
    this.dataTableIncumplimientoZonas.data = dataTable;

    */ 

  }



  async configDataTablaIncumplimientoZonas(infoTurnos:any):Promise<any>{
    let dataTable:any[] = [];

  
   
   

    return dataTable;
  }

  async configDataTablaIncumplimientoClientes(infoTurnos:any):Promise<any>{
    let dataTable:any[] = [];

   
   
   

    return dataTable;
  }



 

  
/*

  async setTablasGerenciasZona(infoTurnos:any):Promise<void>{

      let lineasGerencias =  await this.functionsService.groupArray( await this.functionsService.clonObject(infoTurnos),'pedidos_turno_dependencia',[{pedidos_turno_cantidad:0}]);
      let gerencias = lineasGerencias.map( (gerencia)=>{
        return {
                  code:gerencia.pedidos_turno_dependencia,
                  label: this.dependencias_all.filter((dependencia: { id: any; })=>dependencia.id === gerencia.pedidos_turno_dependencia).length ==0?'SIN GERENCIA':this.dependencias_all.filter((dependencia: { id: any; })=>dependencia.id === gerencia.pedidos_turno_dependencia)[0].name, 
                  totalToneladas:gerencia.pedidos_turno_cantidad,
              }
      });

      let objString:string = "";

      for await(let gerencia of gerencias){
          let lineasTonProgGerencia = (await this.functionsService.clonObject(infoTurnos)).filter((turno: { pedidos_turno_dependencia: any; turnos_adicional:number })=>turno.pedidos_turno_dependencia === gerencia.code &&  turno.turnos_adicional==0);
          let toneladasProggerencia = lineasTonProgGerencia.length === 0?0:(await this.functionsService.groupArray(lineasTonProgGerencia,'pedidos_turno_dependencia',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;

          let lineasTonAddGerencia = (await this.functionsService.clonObject(infoTurnos)).filter((turno: { pedidos_turno_dependencia: any; turnos_adicional:number })=>turno.pedidos_turno_dependencia === gerencia.code &&  turno.turnos_adicional==1);
          let toneladasAddggerencia = lineasTonAddGerencia.length === 0?0:(await this.functionsService.groupArray(lineasTonAddGerencia,'pedidos_turno_dependencia',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;

          objString=`{"gerencia":"${gerencia.label}","totalTon":${gerencia.totalToneladas},"tonProg":${toneladasProggerencia},"prcTonProg":${gerencia.totalToneladas==0?0:(toneladasProggerencia/gerencia.totalToneladas)*100},"tonAdd":${toneladasAddggerencia},"prcTonAdd":${gerencia.totalToneladas==0?0:(toneladasAddggerencia/gerencia.totalToneladas)*100}}`;
          this.dataTableGerencias.data.push(JSON.parse(objString));

          let zonasGerencia = (await this.functionsService.groupArray((await this.functionsService.clonObject(infoTurnos)).filter((turno: { pedidos_turno_dependencia: any; turnos_adicional:number })=>turno.pedidos_turno_dependencia === gerencia.code),'pedidos_turno_localidad',[{pedidos_turno_cantidad:0}])).map((zona)=>{
            return {
                      code: zona.pedidos_turno_localidad,
                      label: this.localidades.filter((localidad: { id: any; })=>localidad.id === zona.pedidos_turno_localidad).length ==0?'SIN ZONA':this.localidades.filter((localidad: { id: any; })=>localidad.id === zona.pedidos_turno_localidad)[0].name, 
                      totalToneladasZona: zona.pedidos_turno_cantidad 
      
            }
          });

          this.toneladasAdicionalGerencias.push({
            label:gerencia.label,
            header: this.headerToneladasAdicionalGerenciaZona,
            data: await this.configDataTablaGerenciaZonas(gerencia,zonasGerencia,infoTurnos)
          })
      }

      //console.log('gerencias', gerencias);

      
  }

  async configDataTablaGerenciaZonas(gerencia:any,zonasGerencia:any,infoTurnos:any ):Promise<any>{
    let dataTable:any[] = [];

    let objString:string = "";

    for(let zona of zonasGerencia){
      let lineasTnProgZona = (await this.functionsService.clonObject(infoTurnos)).filter((turno: { pedidos_turno_dependencia:any; pedidos_turno_localidad: any; turnos_adicional:number })=>turno.pedidos_turno_dependencia === gerencia.code && turno.pedidos_turno_localidad === zona.code &&  turno.turnos_adicional==0);
      let totalTnProgZona = lineasTnProgZona.length === 0?0:(await this.functionsService.groupArray(lineasTnProgZona,'pedidos_turno_localidad',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;

      let lineasTnAddZona =  (await this.functionsService.clonObject(infoTurnos)).filter((turno: { pedidos_turno_dependencia:any; pedidos_turno_localidad: any; turnos_adicional:number })=>turno.pedidos_turno_dependencia === gerencia.code && turno.pedidos_turno_localidad === zona.code &&  turno.turnos_adicional==1);
      let totalTnAddZona = lineasTnAddZona.length === 0?0:(await this.functionsService.groupArray(lineasTnProgZona,'pedidos_turno_localidad',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;

      objString=`{"zona":"${zona.label}","totalTon":${zona.totalToneladasZona},"tonProg":${totalTnProgZona},"prcTonProg":${zona.totalToneladasZona==0?0:(totalTnProgZona/zona.totalToneladasZona)*100},"tonAdd":${totalTnAddZona},"prcTonAdd":${zona.totalToneladasZona==0?0:(totalTnAddZona/zona.totalToneladasZona*100)}}`;

      dataTable.push(JSON.parse(objString));
    }


    return dataTable;
  }
*/
}
