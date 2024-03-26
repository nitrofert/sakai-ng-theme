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
  selector: 'app-toneladas-adicionales',
  providers:[ConfirmationService,MessageService],
  templateUrl: './toneladas-adicionales.component.html',
  styleUrls: ['./toneladas-adicionales.component.scss']
})
export class ToneladasAdicionalesComponent implements  OnInit, OnChanges {

  @Input() rangoFechas!:any;

  hoy = new Date();
  primerDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  ultimoDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
  filtroRnagoFechas:Date[] = [this.primerDiaMes,this.ultimoDiaMes];

  

  dataTable:any = {
    header:[{"locacion":{"label":"Locacion","type":"text","sizeCol":"6rem","align":"center","editable":false}}],
    data:[],
    colsSum:[]
  };

  dataTableLocacion:any = {
    header:[{"fechas":{"label":"Fecha","type":"text","sizeCol":"6rem","align":"center","editable":false},
            "tonProg":{"label":"Toneladas programadas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
            "tonAdd":{"label":"Toneladas adicionales","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
            "tonRem":{"label":"Toneladas despachadas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
            "meta":{"label":"Meta","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,currency:"%",side:"rigth"},
            "cumplimiento":{"label":"% cumplimiento","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,currency:"%",side:"rigth"}}
          ],
    data:[],
    colsSum:[]
  };

  dataTableLocacion2:any = {
    header:[{"concepto":{"label":"","type":"text","sizeCol":"6rem","align":"center","editable":false}}],
    data:[],
    colsSum:[]
  };

  loading:boolean = true;
  

  
  
  verEncabezado:boolean = true;

  meta:number = 95;

  locaciones:any[] = [];
  locacionSeleccionada:any = [];
  locacionesFiltradas:any[] = [];

  infoTurnos:any[] = [];

  toneladasAdicionalLocaciones:any[] = [];

  localidades:any;
  dependencias_all:any;


  toneladasAdicionalGerencias:any[] = [];

  dataTableGerencias:any = {
    header:[{
              "gerencia":{"label":"Gerencia","type":"text","sizeCol":"6rem","align":"center","editable":false},
              "totalTon":{"label":"Total toneladas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
              "tonProg":{"label":"Toneladas programadas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
              "prcTonProg":{"label":" % Toneladas programadas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,currency:"%",side:"rigth"},
              "tonAdd":{"label":"Toneladas adicionales","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
              "prcTonAdd":{"label":" % Toneladas adicionales","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,currency:"%",side:"rigth"}
          }],
    data:[],
    colsSum:[]
  };


  headerToneladasAdicionalGerenciaZona:any[] = [{"zona":{"label":"Zona","type":"text","sizeCol":"6rem","align":"center","editable":false},
  "totalTon":{"label":"Total toneladas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
  "tonProg":{"label":"Toneladas programadas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
  "prcTonProg":{"label":" % Toneladas programadas","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,currency:"%",side:"rigth"},
  "tonAdd":{"label":"Toneladas adicionales","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true},
  "prcTonAdd":{"label":" % Toneladas adicionales","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,currency:"%",side:"rigth"}}
]



  //selectedNovedad!:any;

  /*@ViewChild('filter') filter!: ElementRef;

  
  objectKeys = Object.keys;
  objectValues = Object.values;

  globalFilterFields!:string[];*/
  

  constructor(private pedidosService: PedidosService,
    private almacenesService: AlmacenesService,
    private messageService: MessageService,
    //private nodeService: NodeService,
    //private vehiculosService:VehiculosService,
    //private conductoresService:ConductoresService,
    private confirmationService: ConfirmationService,
    private novedadesService:NovedadesService,
    //private ordenesCargueService: OrdenesCargueService,
    //private transportadorasService:TransportadorasService,
    private solicitudTurnoService:SolicitudTurnoService,
    public dialogService: DialogService,
    private router:Router,
    public usuariosService:UsuarioService,
    public functionsService:FunctionsService,
    private localidadesService:LocalidadesService,
    private dependenciasService:DependenciasService

    //private wsMysqlService:WsMysqlService,
    //private clientesService:ClientesService,
    //private sB1SLService:SB1SLService,
    //private ciudadesService:CiudadesService,
    ){
      
       
    }

  async ngOnInit() {
    console.log('ngOnInit');
    

    if(this.rangoFechas){
      this.filtroRnagoFechas = this.rangoFechas;
      this.verEncabezado = false;
    }else{
      console.log('ngOnInit loc-dep');
      await this.getLocalidades();
      await this.getDependencias();

      await this.setReporte();
    }

    //////console.log('this.filtroRnagoFechas[0]',this.filtroRnagoFechas[0]);
    //////console.log('this.filtroRnagoFechas[1]',this.filtroRnagoFechas[1]);

    //
   

  }

  async ngOnChanges(changes: SimpleChanges){
    console.log('ngOnChanges');

    await this.getLocalidades();
    await this.getDependencias();
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
    console.log('this.localidades 0',this.localidades); 
  }

  async getDependencias():Promise<void>{
    this.dependencias_all =  await this.dependenciasService.getDependencias();
    console.log('this.dependencias_all 0',this.dependencias_all); 

   
  }


  async getInfoTurnos():Promise<any>{

    let params:any = {
      fechaInicio:this.filtroRnagoFechas[0],
      fechaFin:this.filtroRnagoFechas[1],
    }

    let infoTurnos = (await this.solicitudTurnoService.turnosExtendido(params)).raw;
    
    ////console.log('infoTurnos',infoTurnos);

    return infoTurnos.filter((turno: { turnos_estado: EstadosDealleSolicitud; })=>turno.turnos_estado === EstadosDealleSolicitud.DESPACHADO)

    //  return infoTurnos;  
  }

 

  async setReporte():Promise<void>{

    let infoTurnos = await this.getInfoTurnos();
    this.infoTurnos = infoTurnos;


    let headerTable = await this.configHeaderTabla();
    ////console.log('headerTable',headerTable);
    let dataTable = await this.configDataTabla(infoTurnos);
    ////console.log(dataTable);
    

    this.dataTable.header = headerTable;
    this.dataTable.data = dataTable;

    await this.setTablaLocacion(infoTurnos);

    //this.dataTable2.header = await this.configHeaderTabla2(infoTurnos);
    //this.dataTable2.data = await this.configDataTabla2(infoTurnos);

    await this.setTablasGerenciasZona(infoTurnos);

    this.loading = false;
  }

  async configHeaderTabla():Promise<any>{
    let headersTable:any[] = [];

    let objString:string =`[{"locacion":{"label":"Locación","type":"text","sizeCol":"6rem","align":"center","editable":false}`;
    
    let idLocacion:number = 1;

    let fechaInicio = new Date(this.filtroRnagoFechas[0].toISOString());
    let fechaFinal = new Date(this.filtroRnagoFechas[1].toISOString());

    for(;fechaInicio<=fechaFinal; fechaInicio.setDate(fechaInicio.getDate()+1)){

        /*////////console.log(fechaInicio.toISOString().split('T')[0].split('-'))
        ////////console.log(fechaInicio.toISOString().split('T')[0].split('-')[2])
        ////////console.log(fechaInicio.getDate());
        ////////console.log(fechaInicio.toISOString().split('T')[0].split('-')[1])
        ////////console.log(fechaInicio.getMonth()+1);
        ////////console.log(fechaInicio.toISOString().split('T')[0].split('-')[0])
        ////////console.log(fechaInicio.getFullYear());*/
        
        let mesStr = this.functionsService.meses.find(mes=>mes.id === fechaInicio.getMonth()+1 ).shortName;
        let labelFecha = `${mesStr} - ${fechaInicio.getDate()} -${fechaInicio.getFullYear()}`;

        objString += `,"fecha${fechaInicio.toISOString().split('T')[0]}":{"label":"${labelFecha}","type":"table","sizeCol":"6rem","align":"center","editable":false,"sum":true}`;
    }

    objString +=',"total":{"label":"Total","type":"table","sizeCol":"6rem","align":"center","editable":false}}]';
    headersTable = JSON.parse(objString);
    return headersTable;
  }

  async configDataTabla(infoTurnos:any):Promise<any>{
    let dataTable:any[] = [];

    let locaciones = (await this.functionsService.groupArray(await this.functionsService.clonObject(infoTurnos),'locacion_code')).map((locacion)=>{
      return {id: locacion.locacion_id,code:locacion.locacion_code,label: locacion.locacion_locacion}
    })

    this.locaciones = locaciones;
    this.locacionSeleccionada = locaciones[0]

    //////console.log('locaciones',locaciones);

    let objString:string = "";
    
  
   for(let locacion of locaciones){
    //////console.log('locacion',locacion.label);
    objString=`{"locacion":"${locacion.label}"`
      
      let fechaInicio = new Date(this.filtroRnagoFechas[0].toISOString());
      ////////console.log('fechaInicio',fechaInicio);
      let fechaFinal = new Date(this.filtroRnagoFechas[1].toISOString());
      ////////console.log('fechaFinal',fechaFinal);
      let totalTNProg:number =0;
      let totalTNAdd:number =0;
      let totalTNRem:number =0;
     

      for(;fechaInicio<=fechaFinal; fechaInicio.setDate(fechaInicio.getDate()+1)){
       

       
          let lineasTurnosLocacionFecha = infoTurnos.filter((turno: { locacion_id: any; turnos_horacita: string | number | Date; })=>turno.locacion_id === locacion.id && new Date(turno.turnos_horacita).toISOString().split('T')[0] === fechaInicio.toISOString().split('T')[0]);
          

          let lineasTurnosLocacionFechaProg = lineasTurnosLocacionFecha.filter((turno: { turnos_adicional: number; })=>turno.turnos_adicional === 0);
          let toneladasProg:number = lineasTurnosLocacionFecha.length==0?0:lineasTurnosLocacionFechaProg.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaProg),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
          

          let lineasTurnosLocacionFechaAdd = lineasTurnosLocacionFecha.filter((turno: { turnos_adicional: number; })=>turno.turnos_adicional === 1);
          let toneladasAdd:number = lineasTurnosLocacionFecha.length==0?0:lineasTurnosLocacionFechaAdd.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaAdd),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
          

          let lineasTurnosLocacionFechaRem = lineasTurnosLocacionFecha.filter((turno: {turnos_estado: string ;})=>turno.turnos_estado === EstadosDealleSolicitud.DESPACHADO);
          let toneladasRem:number =lineasTurnosLocacionFecha.length==0?0: lineasTurnosLocacionFechaRem.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaRem),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
          objString += `,"fecha${fechaInicio.toISOString().split('T')[0]}":[{"label":"Ton. Pr.","value":${toneladasProg}},{"label":"Ton. Ad.","value":${toneladasAdd}},{"label":"Ton. Re.","value":${toneladasRem}}]`;
          //objString += `,"fecha${fechaInicio.toISOString().split('T')[0]}":{"toneladasProg":${toneladasProg},"toneladasAdd":${toneladasAdd},"toneladasRem":${toneladasRem}}`;
          //objString += `,"fecha${fechaInicio.toISOString().split('T')[0]}":${toneladasProg}`;

          if(lineasTurnosLocacionFecha.length>0){
             //////console.log('fechaInicio',fechaInicio.toISOString().split('T')[0]);
             //////console.log('lineasTurnosLocacionFecha',lineasTurnosLocacionFecha);
              //////console.log('toneladasProg',toneladasProg);
              //////console.log('toneladasAdd',toneladasAdd); 
              //////console.log('toneladasRem',toneladasRem);
          }

          totalTNProg=totalTNProg+toneladasProg;
          totalTNAdd=totalTNAdd+toneladasAdd;
          totalTNRem=totalTNRem+totalTNRem;
      }

      objString +=`,"total":[{"label":"","value":${totalTNProg}},{"label":"","value":${totalTNAdd}},{"label":"","value":${totalTNRem}}]}`
      //objString +=`,"total":{"totalTNProg":${totalTNProg},"totalTNAdd":${totalTNAdd},"totalTNRem":${totalTNRem}}}`
      //objString +=`,"total":${totalTNProg}}`
      ////////console.log('objString',JSON.parse(objString))
     dataTable.push(JSON.parse(objString));
   }

   
   

    return dataTable;
  }


  /*
  async configHeaderTabla2(infoTurnos:any):Promise<any>{

    let headersTable:any[] = [];
    let objString:string =`[{"fechas":{"label":"Fecha","type":"text","sizeCol":"6rem","align":"center","editable":false}`;

    let locaciones = (await this.functionsService.groupArray(await this.functionsService.clonObject(infoTurnos),'locacion_code')).map((locacion)=>{
      return {id: locacion.locacion_id,code:locacion.locacion_code,label: locacion.locacion_locacion}
    })

    for(let locacion of locaciones){
      objString += `,"locacion${locacion.id}":{"label":"${locacion.label}","type":"table","sizeCol":"6rem","align":"center","editable":false,"sum":true}`;
    }
  
    objString +=',"total":{"label":"Total","type":"table","sizeCol":"6rem","align":"center","editable":false}}]';
    headersTable = JSON.parse(objString);
    return headersTable;
  }
 
  async configDataTabla2(infoTurnos:any):Promise<any>{
    let dataTable:any[] = [];

    let locaciones = (await this.functionsService.groupArray(await this.functionsService.clonObject(infoTurnos),'locacion_code')).map((locacion)=>{
      return {id: locacion.locacion_id,code:locacion.locacion_code,label: locacion.locacion_locacion}
    })

   

    let objString:string = "";

    let fechaInicio = new Date(this.filtroRnagoFechas[0].toISOString());
    let fechaFinal = new Date(this.filtroRnagoFechas[1].toISOString());

    for(;fechaInicio<=fechaFinal; fechaInicio.setDate(fechaInicio.getDate()+1)){

      let mesStr = this.functionsService.meses.find(mes=>mes.id === fechaInicio.getMonth()+1 ).shortName;
      let labelFecha = `${mesStr} - ${fechaInicio.getDate()} -${fechaInicio.getFullYear()}`;
      objString=`{"fechas":"${labelFecha}"`;
      let totalTNProg:number =0;
      let totalTNAdd:number =0;
      let totalTNRem:number =0;

      for(let locacion of locaciones){

          let lineasTurnosLocacionFecha = infoTurnos.filter((turno: { locacion_id: any; turnos_horacita: string | number | Date; })=>turno.locacion_id === locacion.id && new Date(turno.turnos_horacita).toISOString().split('T')[0] === fechaInicio.toISOString().split('T')[0]);
          let lineasTurnosLocacionFechaProg = lineasTurnosLocacionFecha.filter((turno: { turnos_adicional: number; })=>turno.turnos_adicional === 0);
          let toneladasProg:number = lineasTurnosLocacionFecha.length==0?0:lineasTurnosLocacionFechaProg.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaProg),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
          let lineasTurnosLocacionFechaAdd = lineasTurnosLocacionFecha.filter((turno: { turnos_adicional: number; })=>turno.turnos_adicional === 1);
          let toneladasAdd:number = lineasTurnosLocacionFecha.length==0?0:lineasTurnosLocacionFechaAdd.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaAdd),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
          let lineasTurnosLocacionFechaRem = lineasTurnosLocacionFecha.filter((turno: {turnos_estado: string ;})=>turno.turnos_estado === EstadosDealleSolicitud.DESPACHADO);
          let toneladasRem:number =lineasTurnosLocacionFecha.length==0?0: lineasTurnosLocacionFechaRem.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaRem),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
          objString += `,"locacion${locacion.id}":[{"label":"Ton. Pr.","value":${toneladasProg}},{"label":"Ton. Ad.","value":${toneladasAdd}},{"label":"Ton. Re.","value":${toneladasRem}}]`;

          totalTNProg=totalTNProg+toneladasProg;
          totalTNAdd=totalTNAdd+toneladasAdd;
          totalTNRem=totalTNRem+totalTNRem;

      }

      objString +=`,"total":[{"label":"","value":${totalTNProg}},{"label":"","value":${totalTNAdd}},{"label":"","value":${totalTNRem}}]}`;
      dataTable.push(JSON.parse(objString));
    }

      return dataTable;
  }
  */

  async filtrarLocacion(event:any){
    this.locacionesFiltradas = await this.functionsService.filter(event,this.locaciones);
  }

  async seleccionarLocacion(){
    
    //////console.log(this.locacionSeleccionada);
    this.toneladasAdicionalLocaciones =[];
    await this.setTablaLocacion(this.infoTurnos)
  }

  async setTablaLocacion(infoTurnos:any):Promise<void>{
    //this.dataTableLocacion.data = await this.configDataTablaLocacion(this.locacionSeleccionada,infoTurnos);

    //let header = await this.configHeaderTablaLocacion2();
    //let data =  await this.configDataTablaLocacion2(this.locacionSeleccionada,infoTurnos);

    //this.dataTableLocacion2.header = header;
    //this.dataTableLocacion2.data = data;

      for await(let locacion of this.locaciones){
        this.toneladasAdicionalLocaciones.push({
          label: locacion.label,
          header: await this.configHeaderTablaLocacion2(),
          data: await this.configDataTablaLocacion2(locacion,infoTurnos)
        })
      }

      ////console.log(this.toneladasAdicionalLocaciones);
  }


  async configDataTablaLocacion(locacion:any,infoTurnos:any ):Promise<any>{
    let dataTable:any[] = [];

    let objString:string = "";

    let fechaInicio = new Date(this.filtroRnagoFechas[0].toISOString());
    let fechaFinal = new Date(this.filtroRnagoFechas[1].toISOString());

    for(;fechaInicio<=fechaFinal; fechaInicio.setDate(fechaInicio.getDate()+1)){

        let mesStr = this.functionsService.meses.find(mes=>mes.id === fechaInicio.getMonth()+1 ).shortName;
        let labelFecha = `${mesStr} - ${fechaInicio.getDate()} -${fechaInicio.getFullYear()}`;
        objString=`{"fechas":"${labelFecha}"`;

        let lineasTurnosLocacionFecha = infoTurnos.filter((turno: { locacion_id: any; turnos_horacita: string | number | Date; })=>turno.locacion_id === locacion.id && new Date(turno.turnos_horacita).toISOString().split('T')[0] === fechaInicio.toISOString().split('T')[0]);
        let lineasTurnosLocacionFechaProg = lineasTurnosLocacionFecha.filter((turno: { turnos_adicional: number; })=>turno.turnos_adicional === 0);
        let toneladasProg:number = lineasTurnosLocacionFecha.length==0?0:lineasTurnosLocacionFechaProg.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaProg),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
        let lineasTurnosLocacionFechaAdd = lineasTurnosLocacionFecha.filter((turno: { turnos_adicional: number; })=>turno.turnos_adicional === 1);
        let toneladasAdd:number = lineasTurnosLocacionFecha.length==0?0:lineasTurnosLocacionFechaAdd.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaAdd),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
        let lineasTurnosLocacionFechaRem = lineasTurnosLocacionFecha.filter((turno: {turnos_estado: string ;})=>turno.turnos_estado === EstadosDealleSolicitud.DESPACHADO);
        let toneladasRem:number =lineasTurnosLocacionFecha.length==0?0: lineasTurnosLocacionFechaRem.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaRem),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
        objString += `,"tonProg":${toneladasProg}`;
        objString += `,"tonAdd":${toneladasAdd}`;
        objString += `,"tonRem":${toneladasRem}`;
        objString += `,"meta":${this.meta}`;
        objString += `,"cumplimiento":${(toneladasProg+toneladasAdd)!=0?(toneladasRem/(toneladasProg+toneladasAdd))*100:0}}`;

        ////console.log(objString);

        dataTable.push(JSON.parse(objString));
    }

    return dataTable;

  }

  async configHeaderTablaLocacion2():Promise<any>{
    let headersTable:any[] = [];

    let objString:string =`[{"concepto":{"label":"","type":"text","sizeCol":"6rem","align":"center","editable":false}`;
    
    let idLocacion:number = 1;

    let fechaInicio = new Date(this.filtroRnagoFechas[0].toISOString());
    let fechaFinal = new Date(this.filtroRnagoFechas[1].toISOString());

    for(;fechaInicio<=fechaFinal; fechaInicio.setDate(fechaInicio.getDate()+1)){

        /*////////console.log(fechaInicio.toISOString().split('T')[0].split('-'))
        ////////console.log(fechaInicio.toISOString().split('T')[0].split('-')[2])
        ////////console.log(fechaInicio.getDate());
        ////////console.log(fechaInicio.toISOString().split('T')[0].split('-')[1])
        ////////console.log(fechaInicio.getMonth()+1);
        ////////console.log(fechaInicio.toISOString().split('T')[0].split('-')[0])
        ////////console.log(fechaInicio.getFullYear());*/
        
        let mesStr = this.functionsService.meses.find(mes=>mes.id === fechaInicio.getMonth()+1 ).shortName;
        let labelFecha = `${mesStr} - ${fechaInicio.getDate()} -${fechaInicio.getFullYear()}`;

        objString += `,"fecha${fechaInicio.toISOString().split('T')[0]}":{"label":"${labelFecha}","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true}`;
    }

    objString +=',"total":{"label":"Total","type":"numeric","sizeCol":"6rem","align":"center","editable":false}}]';
    headersTable = JSON.parse(objString);
    return headersTable;
  }

  async configDataTablaLocacion2(locacion:any,infoTurnos:any ):Promise<any>{
    let dataTable:any[] = [];

    
    let fechaInicio = new Date(this.filtroRnagoFechas[0].toISOString());
    let fechaFinal = new Date(this.filtroRnagoFechas[1].toISOString());

    let lineaStrTonProg:string = `{"concepto":"Toneladas programadas"`;
    let lineaStrTonAdd:string = `{"concepto":"Toneladas adicionales"`;
    let lineaStrTonrem:string = `{"concepto":"Toneladas despachadas"`;
    let lineaStrMeta:string = `{"concepto":"Meta"`;
    let lineaStrCumplimiento:string = `{"concepto":"% Cumplido"`;

    let totalTNProg:number =0;
    let totalTNAdd:number =0;
    let totalTNRem:number =0;

    for(;fechaInicio<=fechaFinal; fechaInicio.setDate(fechaInicio.getDate()+1)){

        let mesStr = this.functionsService.meses.find(mes=>mes.id === fechaInicio.getMonth()+1 ).shortName;
        let labelFecha = `${mesStr} - ${fechaInicio.getDate()} -${fechaInicio.getFullYear()}`;
        
        

        let lineasTurnosLocacionFecha = infoTurnos.filter((turno: { locacion_id: any; turnos_horacita: string | number | Date; })=>turno.locacion_id === locacion.id && new Date(turno.turnos_horacita).toISOString().split('T')[0] === fechaInicio.toISOString().split('T')[0]);
        
        let lineasTurnosLocacionFechaProg = lineasTurnosLocacionFecha.filter((turno: { turnos_adicional: number; })=>turno.turnos_adicional === 0);
        
        let toneladasProg:number = lineasTurnosLocacionFecha.length==0?0:lineasTurnosLocacionFechaProg.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaProg),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
        let lineasTurnosLocacionFechaAdd = lineasTurnosLocacionFecha.filter((turno: { turnos_adicional: number; })=>turno.turnos_adicional === 1);
        let toneladasAdd:number = lineasTurnosLocacionFecha.length==0?0:lineasTurnosLocacionFechaAdd.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaAdd),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
        let lineasTurnosLocacionFechaRem = lineasTurnosLocacionFecha.filter((turno: {turnos_estado: string ;})=>turno.turnos_estado === EstadosDealleSolicitud.DESPACHADO);
        let toneladasRem:number =lineasTurnosLocacionFecha.length==0?0: lineasTurnosLocacionFechaRem.length==0?0:(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasTurnosLocacionFechaRem),'locacion_id',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;

        lineaStrTonProg+=`,"fecha${fechaInicio.toISOString().split('T')[0]}":${toneladasProg}`;
        lineaStrTonAdd+=`,"fecha${fechaInicio.toISOString().split('T')[0]}":${toneladasAdd}`;
        lineaStrTonrem+=`,"fecha${fechaInicio.toISOString().split('T')[0]}":${toneladasRem}`;
        lineaStrMeta+=`,"fecha${fechaInicio.toISOString().split('T')[0]}":${this.meta}`;
        //lineaStrCumplimiento+=`,"fecha${fechaInicio.toISOString().split('T')[0]}":${toneladasProg!=0?((toneladasProg+toneladasAdd)/toneladasProg)*100:0}`;
        lineaStrCumplimiento+=`,"fecha${fechaInicio.toISOString().split('T')[0]}":${(toneladasProg)!=0?(toneladasRem/(toneladasProg))*100:0}`;

        totalTNProg=totalTNProg+toneladasProg;
        totalTNAdd=totalTNAdd+toneladasAdd;
        totalTNRem=totalTNRem+toneladasRem;

    }

    lineaStrTonProg+=`,"total":${totalTNProg}}`;
    lineaStrTonAdd+=`,"total":${totalTNAdd}}`;
    lineaStrTonrem+=`,"total":${totalTNRem}}`;
    lineaStrMeta+=`,"total":${this.meta}}`;
    //lineaStrCumplimiento+=`,"total":${totalTNProg!=0?((totalTNProg+totalTNAdd)/totalTNProg)*100:0}}`;
    lineaStrCumplimiento+=`,"total":${totalTNProg!=0?(totalTNRem/totalTNProg)*100:0}}`;

    ////console.log(lineaStrTonProg);
    ////console.log(lineaStrTonAdd);
    ////console.log(lineaStrTonrem);
    ////console.log(lineaStrMeta);
    ////console.log(lineaStrCumplimiento);
    dataTable.push(JSON.parse(lineaStrTonProg));
    dataTable.push(JSON.parse(lineaStrTonAdd)),
    dataTable.push(JSON.parse(lineaStrTonrem));
    dataTable.push(JSON.parse(lineaStrMeta));
    dataTable.push(JSON.parse(lineaStrCumplimiento));

    return dataTable;

  }


  async setTablasGerenciasZona(infoTurnos:any):Promise<void>{

      console.log('this.dependencias_all',this.dependencias_all)

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
      //console.log('lineasTnAddZona',lineasTnAddZona);
      let totalTnAddZona = lineasTnAddZona.length === 0?0:(await this.functionsService.groupArray(lineasTnAddZona,'pedidos_turno_localidad',[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;

      objString=`{"zona":"${zona.label}","totalTon":${zona.totalToneladasZona},"tonProg":${totalTnProgZona},"prcTonProg":${zona.totalToneladasZona==0?0:(totalTnProgZona/zona.totalToneladasZona)*100},"tonAdd":${totalTnAddZona},"prcTonAdd":${zona.totalToneladasZona==0?0:(totalTnAddZona/zona.totalToneladasZona*100)}}`;

      dataTable.push(JSON.parse(objString));
    }


    return dataTable;
  }

}
