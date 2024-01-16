import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { DependenciasService } from 'src/app/demo/service/dependencias.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { LocalidadesService } from 'src/app/demo/service/localidades.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { TipoRol } from '../../admin/roles/roles.enum';
import { EstadosDealleSolicitud } from '../../turnos/estados-turno.enum';

@Component({
  selector: 'app-programacion-gerencias',
  providers:[ConfirmationService,MessageService],
  templateUrl: './programacion-gerencias.component.html',
  styleUrls: ['./programacion-gerencias.component.scss']
})
export class ProgramacionGerenciasComponent implements OnInit {

  infousuario!:any;

  locaciones:any[] = [];
  locacionSeleccionada:any = [];
  locacionesFiltradas:any[] = [];

  allbodegas:any[] = [];
  bodegas:any[] = [];
  bodegaSeleccionada:any = [];
  bodegasFiltradas:any[] = [];

  permisosModulo!:any;

  localidades:any;
  dependencias_all:any;

  
  fechaProgramacion:Date = new Date((new Date()).setHours(0, 0, 0, 0));

  turnosFehaSeleccionada!:any[];

  dependencias:any[] = [];  
  lineasProgramacionDiariaGerencia!:any;
  loadingPDG:boolean = true;

  tablaProgramacionDiariaGerencia:any = {
    header:this.configHeaderTablaProgramacionDiariaGerencia(),
    data:[],
    colsSum:[]
  };

  tablaToneladasZona:any = {
    header:this.configHeaderTablaToneladasZona(),
    data:[],
    colsSum:[]
  };

  tablaToneladasGerencias:any = {
    header:this.configHeaderTablaToneladasGerencias(),
    data:[],
    colsSum:[]
  };

  chartDataConsolidadoZona!:any;

  chartDataConsolidadoGerencias!:any;

  tablaConsolidadoTipoProducto:any = {
    header:this.configHeaderTablaConsolidadoTipoProducto(),

  };

  tablaConsolidadoModTPT:any = {
    header:this.configHeaderTablaConsolidadoModTPT(),

  };

  gerencias:any[] = [];
  gerenciaSeleccionada:any = [];
  gerenciasFiltradas:any[] = [];


  lineasNovedadesProgramacionDiariaGerencia!:any;

  tablaConsolidadoNovedadesGerencia:any = {
    header:this.configHeaderConsolidadoNovedades(),

  };

  constructor(private almacenesService:AlmacenesService,
    private messageService: MessageService,
    public dialogService: DialogService,
    public usuariosService:UsuarioService,
    private solicitudTurnoService:SolicitudTurnoService,
    private functionsService:FunctionsService,
    private router:Router,
    private localidadesService:LocalidadesService,
    private dependenciasService:DependenciasService){}

  async ngOnInit() {
    this.infousuario = await this.usuariosService.infoUsuario();
    this.getLocalidades();
  }

  async getLocalidades(){
    this.localidades =  await this.localidadesService.getLocalidades();
    this.getDependencias(); 
  }

  async getDependencias(){
    this.dependencias_all =  await this.dependenciasService.getDependencias();
    
    this.seleccionarFecha();
    
  }

  async getInfoTablaProgramacionDiaria():Promise<any> {

    let params:any = {
      fechacita:this.fechaProgramacion,
      //locacion:this.locacionSeleccionada.code,
      //bodega:this.bodegaSeleccionada.code
    }

    if(this.infousuario.roles.find((rol: { nombre: any; })=>rol.nombre === TipoRol.CLIENTELOGISTICA)){
      let clientes:any = this.infousuario.clientes.map((cliente: { id: any; })=>{return cliente.id;});
      params.clientes = JSON.stringify(clientes);
    }

    let programacionBodega = await this.solicitudTurnoService.turnosExtendido(params);

    programacionBodega.raw.forEach((solicitud: {
     
          pedidos_turno_dependencia:string;
          pedidos_turno_dependencia_label:string;
          pedidos_turno_localidad:string;
          pedidos_turno_localidad_label:string;
    })=>{

          solicitud.pedidos_turno_dependencia_label = this.dependencias_all.find((denpendencia: { id: any; })=>denpendencia.id === solicitud.pedidos_turno_dependencia)?this.dependencias_all.find((denpendencia: { id: any; })=>denpendencia.id === solicitud.pedidos_turno_dependencia).name:'';
          solicitud.pedidos_turno_localidad_label = this.localidades.find((localidad: { id: any; })=>localidad.id === solicitud.pedidos_turno_localidad)?this.localidades.find((localidad: { id: any; })=>localidad.id === solicitud.pedidos_turno_localidad).name:'';
    });
    // //////console.log(programacionBodega.raw);
    // //////console.log(programacionBodega.raw.filter((item: { pedidos_turno_itemcode: { toString: () => string; }; })=>item.pedidos_turno_itemcode.toString().startsWith('SF')==false));
    let programacionBodegaSinFlete:any = programacionBodega.raw.filter((item: { pedidos_turno_itemcode: { toString: () => string; }; })=>item.pedidos_turno_itemcode.toString().startsWith('SF')==false);
    //return programacionBodega.raw;
    return programacionBodegaSinFlete;
  }

  async seleccionarFecha(){
    ////////////////////////////////////// //////console.log(this.fechaProgramacion)
    this.turnosFehaSeleccionada = await this.getInfoTablaProgramacionDiaria();
    ////console.log('turnosFehaSeleccionada',this.turnosFehaSeleccionada);
    this.setReporte();
  }

  async setReporte(){
    let turnosFehaSeleccionada = await this.functionsService.clonObject(this.turnosFehaSeleccionada);
    
    this.lineasNovedadesProgramacionDiariaGerencia = await turnosFehaSeleccionada.filter((linea: { turnos_estado: EstadosDealleSolicitud; }) => linea.turnos_estado == EstadosDealleSolicitud.PAUSADO);
   

    this.lineasProgramacionDiariaGerencia = await turnosFehaSeleccionada.filter((linea: { turnos_estado: EstadosDealleSolicitud; }) => linea.turnos_estado != EstadosDealleSolicitud.SOLICITADO && 
                                                                                        linea.turnos_estado != EstadosDealleSolicitud.PAUSADO && 
                                                                                        linea.turnos_estado != EstadosDealleSolicitud.CANCELADO &&
                                                                                        linea.turnos_estado != EstadosDealleSolicitud.SOLINVENTARIO );

    console.log('lineasProgramacionDiariaGerencia',this.lineasProgramacionDiariaGerencia);

   
    

    this.gerencias =  (await this.functionsService.groupArray(this.lineasProgramacionDiariaGerencia,'pedidos_turno_dependencia')).map(gerencia=>{
      return {code:gerencia.pedidos_turno_dependencia, name:gerencia.pedidos_turno_dependencia_label, label:gerencia.pedidos_turno_dependencia_label}
    });
    
    //// //////console.log('gerencias',this.gerencias);
    


    this.gerenciaSeleccionada = this.gerencias[0];

    //// //////console.log('gerenciaSeleccionada',this.gerenciaSeleccionada);

    this.seleccionarGerencia(this.gerenciaSeleccionada);


   
    this.configTablaConsolidadoZona();

    this.configTablaConsolidadoGerencias();

   

   

   

  }

  seleccionarGerencia(gerencia:any){
    //// //////console.log('Gerencia seleccionada',gerencia);
    this.configTablaProgramacionGerencia();
    
   }

 

  async configTablaProgramacionGerencia(){

    this.dependencias = [];

    let headerTabla =   this.configHeaderTablaProgramacionDiariaGerencia();
   
    //let dependencias = await this.functionsService.groupArray(this.lineasProgramacionDiariaGerencia,'pedidos_turno_dependencia');

    let dependencias = this.gerenciaSeleccionada?[this.gerenciaSeleccionada]:[];

   // //////console.log('dependencias',dependencias);

    for(let dependencia of dependencias ){


      let lineasProgramacionDiariaGerencia =  await this.functionsService.clonObject(this.lineasProgramacionDiariaGerencia);
      let lineasProgramacionDiariaDependencia = lineasProgramacionDiariaGerencia.filter((linea: { pedidos_turno_dependencia: any; })=>linea.pedidos_turno_dependencia === dependencia.code);
      console.log('lineasProgramacionDiariaDependencia',lineasProgramacionDiariaDependencia);

      
      let lineasNovedadesProgramacionDiariaGerencia =  await this.functionsService.clonObject(this.lineasNovedadesProgramacionDiariaGerencia);
      let lineasNovedadesProgramacionDiariaDependencia = (lineasNovedadesProgramacionDiariaGerencia.filter((linea: { pedidos_turno_dependencia: any; })=>linea.pedidos_turno_dependencia === dependencia.code)).map((linea: { codegroup: string; turnos_id: any; vehiculos_placa: any; pedidos_turno_pedidonum: any; pedidos_turno_CardCode: any; pedidos_turno_bodega: any; })=>{
        linea.codegroup = `${linea.turnos_id}${linea.vehiculos_placa}${linea.pedidos_turno_pedidonum}${linea.pedidos_turno_CardCode}${linea.pedidos_turno_bodega}`;
        return linea
      });
     
      
     //console.log('lineasNovedadesProgramacionDiariaDependencia',lineasNovedadesProgramacionDiariaDependencia);

      
      let dataDependencia =  await this.configDataTablaProgramacionDiariaaGerencia(lineasProgramacionDiariaDependencia);
      //// //////console.log('dataDependencia',dataDependencia);

      
      let colsSumDependencia = await this.configSumTabla(headerTabla,dataDependencia)
      //// //////console.log('colsSumDependencia',colsSumDependencia);
      
      let lineasProgramacionDiariaDependenciaTipoProducto = await this.functionsService.groupArray(await this.functionsService.clonObject(lineasProgramacionDiariaDependencia),'pedidos_turno_tipoproducto',[{pedidos_turno_cantidad:0}]);
      //// //////console.log('lineasProgramacionDiariaDependenciaTipoProducto',lineasProgramacionDiariaDependenciaTipoProducto);
     
      let consolidadoTipoProductoDependencia = await this.configDataTablaConsolidadoTipoProducto(lineasProgramacionDiariaDependenciaTipoProducto);
      //// //////console.log('consolidadoTipoProductoDependencia',consolidadoTipoProductoDependencia);
      
      let colSumConsolidadoTipoProductoDependencia = await this.configSumTabla(this.tablaConsolidadoTipoProducto.header,consolidadoTipoProductoDependencia)
      //// //////console.log('colSumConsolidadoTipoProductoDependencia',colSumConsolidadoTipoProductoDependencia);
     
      let chartDataConsolidadoTipoProducto = await this.functionsService.setDataBasicChart(consolidadoTipoProductoDependencia,{label:'tipo',value:'cantidad'});


      let lineasProgramacionDiariaDependenciaModTPT = await this.functionsService.groupArray(await this.functionsService.clonObject(lineasProgramacionDiariaDependencia),'turnos_condiciontpt',[{pedidos_turno_cantidad:0}]);
      //// //////console.log('lineasProgramacionDiariaDependenciaTipoProducto',lineasProgramacionDiariaDependenciaTipoProducto);
      

      let consolidadoModTPT = await this.configDataTablaConsolidadooModTPT(lineasProgramacionDiariaDependenciaModTPT);
      //// //////console.log('consolidadoModTPT',consolidadoModTPT);

      
      let colSumConsolidadoModTPT = await this.configSumTabla(this.tablaConsolidadoModTPT.header,consolidadoModTPT)
      //// //////console.log('colSumConsolidadoTipoProductoDependencia',colSumConsolidadoTipoProductoDependencia);

      let chartDataConsolidadoModTPT = await this.functionsService.setDataBasicChart(consolidadoModTPT,{label:'tipo',value:'cantidad'});

      let consolidadoNovedadesProgramacionDiariaDependencia = await this.configDataTablaConsolidadoNovedades(await this.functionsService.groupArray(await this.functionsService.clonObject(lineasNovedadesProgramacionDiariaDependencia),'codegroup',[{pedidos_turno_cantidad:0}]))
      //console.log('consolidadoNovedadesProgramacionDiariaDependencia',consolidadoNovedadesProgramacionDiariaDependencia);

      let colSumConsolidadoNovedades = await this.configSumTabla(this.tablaConsolidadoNovedadesGerencia.header,consolidadoNovedadesProgramacionDiariaDependencia)
      
      this.dependencias.push({
        dependencia: dependencia.label,
        programacionDiaria:dataDependencia,
        colsSumProgramacionDiaria:colsSumDependencia,
        consolidadoTipoProductoDependencia,
        colSumConsolidadoTipoProductoDependencia,
        chartDataConsolidadoTipoProducto,
        consolidadoModTPT,
        colSumConsolidadoModTPT,
        chartDataConsolidadoModTPT,
        consolidadoNovedadesProgramacionDiariaDependencia,
        colSumConsolidadoNovedades

      })
      
      
    }

    this.loadingPDG = false;
  }

  configHeaderTablaProgramacionDiariaGerencia(){
    let headersTable:any[] =  [{
      
      'dependencia': {label:'Dependencia',type:'text', sizeCol:'6rem', align:'center',field:"dependencia"},
      'bodega': {label:'Bodega',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"bodega"},
      'estado': {label:'Estado',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"estado"},
      'cliente': {label:'Cliente',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"cliente"},
      'tipo': {label:'Tipo',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"tipo"},
      'pedido': {label:'Pedido venta',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"pedido"},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true,field:"cantidad"},
      
    }];

    return headersTable;
  }

  async configDataTablaProgramacionDiariaaGerencia(data:any[]){

    ////// //////console.log('data',data);

    /*data.map((linea)=>{
      linea.groupcode = linea.
    });*/
    

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          dependencia:linea.pedidos_turno_dependencia_label,
          bodega:linea.pedidos_turno_bodega,
          estado:linea.turnos_estado,
          cliente:linea.pedidos_turno_CardName,
          tipo:linea.turnos_condiciontpt,
          pedido:linea.pedidos_turno_pedidonum,
          cantidad:linea.pedidos_turno_cantidad,
          //groupcode:linea.pedidos_turno_pedidonum+linea.pedidos_turno_bodega
        });
    }
    ////////////// //////console.log(dataTable);
    //Agrupar por pedido
    //dataTable = await this.functionsService.groupArray(dataTable,'pedido',[{cantidad:0}]);
    //Ordenar por Dependencia - bodega 
    //dataTable = await this.functionsService.sortArrayObject(dataTable,'bodega','ASC')
    //////////// //////console.log(dataTable.filter(line=>line.dependencia === null));
    if(dataTable.filter(line=>line.dependencia === null).length==0){
      dataTable.sort((a,b)=> (a.dependencia.localeCompare(b.dependencia) || a.bodega.localeCompare(b.bodega)));
    }
    
    


    return dataTable;

  }

  async configDataTablaConsolidadoTipoProducto(data:any[]):Promise<any>{

    //////////////////////// //////console.log(data);
    

    let dataTable:any[] = [];
    let total = (await this.functionsService.sumColArray(data,[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;    

    for(let linea of data){
        dataTable.push({
          tipo:linea.pedidos_turno_tipoproducto,
          cantidad:linea.pedidos_turno_cantidad,
          porcentaje:(linea.pedidos_turno_cantidad*100)/total
        });
    }
    

    return dataTable;

  }

  async configDataTablaConsolidadooModTPT(data:any[]):Promise<any> {

    //////////////////////// //////console.log(data);
    

    let dataTable:any[] = [];
    let total = (await this.functionsService.sumColArray(data,[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;   

    for(let linea of data){
        dataTable.push({
          tipo:linea.turnos_condiciontpt,
          cantidad:linea.pedidos_turno_cantidad,
          porcentaje:(linea.pedidos_turno_cantidad*100)/total
        });
    }
    

    return dataTable;

  }

  async configDataTablaConsolidadoNovedades(data:any[]):Promise<any>{
    let dataTable:any[] = [];

    //console.log(data);

    for(let linea of data){

      let infoTruno = await this.solicitudTurnoService.infoTurno(linea.turnos_id);

      let ultimaPausa = (await this.functionsService.sortArrayObject(infoTruno.detalle_solicitud_turnos_historial.filter((historial: { estado: EstadosDealleSolicitud; })=>historial.estado === EstadosDealleSolicitud.PAUSADO),'id', 'DESC'))[0];
      //console.log(ultimaPausa);
      let novedades = (ultimaPausa.novedades.map((linea: { novedad: any; })=>{ return linea.novedad})).join();
      //Convierte de blob a texto
      ////console.log(String.fromCharCode(...ultimaPausa.comentario.data));
      let observacion = String.fromCharCode(...ultimaPausa.comentario.data)

      dataTable.push({
        turno:linea.turnos_id,
        bodega:linea.pedidos_turno_bodega,
        cliente:linea.pedidos_turno_CardName,
        tipo:linea.turnos_condiciontpt,
        novedades,
        observacion,
        placa:linea.vehiculos_placa,
        pedido:linea.pedidos_turno_pedidonum,
        cantidad:linea.pedidos_turno_cantidad
      });
  }

    return dataTable;
  }

  configHeaderConsolidadoNovedades(){
    let headersTable:any[] =  [{
      'turno': {label:'Turno',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"turno"},
      'bodega': {label:'Bodega',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"bodega"},
      'cliente': {label:'Cliente',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"cliente"},
      'tipo': {label:'Tipo',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"tipo"},
      'novedades': {label:'Novedades',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"novedades"},
      'observacion': {label:'Observacion',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"observacion"},
      'placa': {label:'Placa',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"placa"},
      'pedido': {label:'Pedido venta',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"pedido"},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true,field:"cantidad"},
      
    }];

    return headersTable;
  }


  async configTablaConsolidadoZona(){
    let toneladasZonaPedido = await this.functionsService.groupArray(await this.functionsService.clonObject(this.lineasProgramacionDiariaGerencia),'pedidos_turno_localidad',[{pedidos_turno_cantidad:0}]);

    //// //////console.log(toneladasZonaPedido);
   

    let tablaToneladasZonaPedido:any = {
      header:  this.configHeaderTablaToneladasZona(),
      data:  await this.configDataTablaToneladasZona(toneladasZonaPedido)
    };

    let colsSum = await this.configSumTabla(tablaToneladasZonaPedido.header,tablaToneladasZonaPedido.data);
    this.tablaToneladasZona = tablaToneladasZonaPedido;
    this.tablaToneladasZona.colsSum = colsSum;

    this.chartDataConsolidadoZona = await this.functionsService.setDataPieDoughnutChart(this.tablaToneladasZona.data,{label:'zona',value:'cantidad'});

    //this.loadingPDG = false;
  }


  configHeaderTablaToneladasZona(){
    let headersTable:any[] =  [{
      
      'zona': {label:'Zona',type:'text', sizeCol:'6rem', align:'center',field:"zona"},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true,field:"cantidad"},
      'porcentaje': {label:'%',type:'number', sizeCol:'6rem', align:'center',currency:"%",side:"rigth", editable:false,"sum":true,},

      
    }];

    return headersTable;
  }

   async configDataTablaToneladasZona(data:any[]):Promise<any>{

    let dataTable:any[] = [];
    let total = (await this.functionsService.sumColArray(data,[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;    
    //////console.log('total',total)

    for(let linea of data){
        dataTable.push({
          zona:linea.pedidos_turno_localidad==null?'SIN ZONA':linea.pedidos_turno_localidad_label,
          cantidad:linea.pedidos_turno_cantidad,
          porcentaje:(linea.pedidos_turno_cantidad*100)/total
        });
    }

    return dataTable;

  }


  async configTablaConsolidadoGerencias(){
    
    let toneladasGerenciasPedido = await this.functionsService.groupArray(await this.functionsService.clonObject(this.lineasProgramacionDiariaGerencia),'pedidos_turno_dependencia',[{pedidos_turno_cantidad:0}]);

    // //////console.log('toneladasGerenciasPedido',toneladasGerenciasPedido);
   

    let tablaToneladasGerenciasPedido:any = {
      header:  this.configHeaderTablaToneladasGerencias(),
      data:  await this.configDataTablaToneladasGerencias(toneladasGerenciasPedido)
      //data:[]
    };

    let colsSum = await this.configSumTabla(tablaToneladasGerenciasPedido.header,tablaToneladasGerenciasPedido.data);
    this.tablaToneladasGerencias = tablaToneladasGerenciasPedido;
    this.tablaToneladasGerencias.colsSum = colsSum;

    this.chartDataConsolidadoGerencias = await this.functionsService.setDataPieDoughnutChart(this.tablaToneladasGerencias.data,{label:'gerencia',value:'cantidad'});

    
  }


  configHeaderTablaToneladasGerencias(){
    let headersTable:any[] =  [{
      
      'gerencia': {label:'Gerencia',type:'text', sizeCol:'6rem', align:'center',field:"gerencia"},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true,field:"cantidad"},
      'porcentaje': {label:'%',type:'number', sizeCol:'6rem', align:'center',currency:"%",side:"rigth", editable:false,"sum":true,},
      
    }];

    return headersTable;
  }

  async configDataTablaToneladasGerencias(data:any[]):Promise<any>{

    let dataTable:any[] = [];
    let total = (await this.functionsService.sumColArray(data,[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;   

    for(let linea of data){
        dataTable.push({
          gerencia:linea.pedidos_turno_dependencia==null?'SIN GERENCIA':linea.pedidos_turno_dependencia_label,
          cantidad:linea.pedidos_turno_cantidad,
          porcentaje:(linea.pedidos_turno_cantidad*100)/total
        });
    }

    return dataTable;

  }



  async configSumTabla(headersTable:any[],dataTable:any[]):Promise<any>{
    let colsSum:any[] = [];
    ////////////////////////////// //////console.log(dataTable);
    ////////////////////////////////// //////console.log(Object.keys(headersTable[0]));
    let objString:string = "";
    let colsSumSwitch:boolean = false;
    for(let key of Object.keys(headersTable[0])){
      objString+=`"${key}":`
      if(headersTable[0][key].sum){
        ////////////////////////////////// //////console.log(key);
        colsSumSwitch = true;
        let total = await this.functionsService.sumColArray(dataTable,JSON.parse(`[{"${key}":0}]`));
        ////////////////////////////////// //////console.log(total[0][key]);
        objString+=`${parseFloat(total[0][key])},`
      }else{
        objString+=`"",`
      }
    }
    objString = `{${objString.substring(0,objString.length-1)}}`;
    ////////////////////////////////// //////console.log(objString);
    if(colsSumSwitch){
      colsSum.push(JSON.parse(objString));
    }
    

    ////////////////////////////////// //////console.log(colsSum);

    return colsSum;

  }

  configHeaderTablaConsolidadoTipoProducto(){
    let headersTable:any[] =  [{
      
      'tipo': {label:'Tipo Producto',type:'text', sizeCol:'6rem', align:'center',},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      'porcentaje': {label:'%',type:'number', sizeCol:'6rem', align:'center',currency:"%",side:"rigth", editable:false,"sum":true,},
    }];

    return headersTable;
  }

  configHeaderTablaConsolidadoModTPT(){
    let headersTable:any[] =  [{
      
      'tipo': {label:'Modo transporte',type:'text', sizeCol:'6rem', align:'center',field:"tipo"},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true,field:"cantidad"},
      'porcentaje': {label:'%',type:'number', sizeCol:'6rem', align:'center',currency:"%",side:"rigth", editable:false,"sum":true,},
      
    }];

    return headersTable;
  }

 
  filtrarGerencia(event:any){
    this.gerenciasFiltradas = this.filter(event,this.gerencias);
  }

  

  filter(event: any, arrayFiltrar:any[]) {

    ////////////////////////////////////////////////////// //////console.log((arrayFiltrar);
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

 
}
