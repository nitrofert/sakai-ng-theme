import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { EstadosDealleSolicitud } from '../estados-turno.enum';
import { TipoRol } from '../../admin/roles/roles.enum';

@Component({
  selector: 'app-dashboard-turnos',
  providers:[ConfirmationService,MessageService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponentTurno implements OnInit {

  infousuario!:any;

  locaciones:any[] = [];
  locacionSeleccionada:any = [];
  locacionesFiltradas:any[] = [];

  allbodegas:any[] = [];
  bodegas:any[] = [];
  bodegaSeleccionada:any = [];
  bodegasFiltradas:any[] = [];

  permisosModulo!:any;

  tablaProgramacionDiariaBodega:any = {
    header: this.configHeaderTablaProgramacionDiaria(),
    data:[]
  };
  lineasProgramacionDiariaBodega:any[] = [];
  loadingPDB:boolean = true;

  fechaProgramacion:Date = new Date((new Date()).setHours(0, 0, 0, 0));

  tablaConsolidadoProgramacionDiariaBodega:any = {
    header:this.configHeaderTablaConsolidadoProgramacionDiaria(),
    data:[],
    colsSum:[]
  };

  lineasConsolidadoProgramacionDiariaBodega:any[] = [];
  loadingCPDB:boolean = true;

  turnosFehaSeleccionada!:any[];

  chartPieData!:any;

  
  tablaPlacasCompartidasBodegas:any = {
    header:[{"placas":{"label":"Placa","type":"text","sizeCol":"6rem","align":"center","editable":false}}],
    data:[],
    colsSum:[]
  };

  loadingPC:boolean = true;

  dependencias:any[] = [];  
  lineasProgramacionDiariaGerencia:any[] = [];
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

  chartDataConsolidadoZona!:any;

  tablaConsolidadoTipoProducto:any = {
    header:this.configHeaderTablaConsolidadoTipoProducto(),

  };

  tablaConsolidadoModTPT:any = {
    header:this.configHeaderTablaConsolidadoModTPT(),

  };

  

  constructor(private almacenesService:AlmacenesService,
              private messageService: MessageService,
              public dialogService: DialogService,
              public usuariosService:UsuarioService,
              private solicitudTurnoService:SolicitudTurnoService,
              private functionsService:FunctionsService,
              private router:Router){}


  async ngOnInit() {
    
    this.infousuario = await this.usuariosService.infoUsuario();
   ////console.log(this.infousuario);
    //this.configTablaProgramacionDiaria();

    
    //this.configTablaConsolidadoProgramacionDiaria();
    this.turnosFehaSeleccionada = await this.getInfoTablaProgramacionDiaria();
    //console.log(this.turnosFehaSeleccionada);
    this.getAlmacenes();
   

  }


  getAlmacenes(){
    this.almacenesService.getAlmacenes()
        .subscribe({
            next:(almacenes)=>{

             
              let almacenesTMP:any[] = [];
             
              for(let index in almacenes){
                let linea:any = almacenes[index];
                linea.code = linea.WhsCode_Code;
                linea.name = linea.WhsName;
                linea.label = `${linea.WhsCode_Code} - ${linea.WhsName} - ${linea.Name_State}`;
                almacenesTMP.push(linea);
             
              }
              
              this.allbodegas = almacenesTMP;
              ////////console.log(this.allbodegas);
              this.getLocaciones();
             //// ////////////////////////////console.log(almacenesTMP);
             
            },
            error:(err)=>{
                console.error(err);
            }
      
    }); 
  }

  getLocaciones(){
    this.almacenesService.getLocaciones()
        .subscribe({
            next:async (locaciones)=>{

              
              await locaciones.map((locacion:any)=>{
                locacion.label = locacion.locacion
              })
              //this.locaciones = locaciones;
            // ////////////////////////////console.log(locaciones);
              this.locaciones = await this.setLocaciones(locaciones,this.infousuario.locaciones);
              this.locacionSeleccionada = this.locaciones[0];
              this.seleccionarLocacion(this.locacionSeleccionada);
              //////////////////////////////console.log();
            },
            error:(err)=>{
              console.error(err);
            }
        })
  }

  async setLocaciones(locaciones:any[],locacionesUsuario:any[]):Promise<any[]>{
      
      if(locacionesUsuario.length>0){
        let loccionesUsuarioTMP:any[] = [];
        for(let locacion of locaciones){
            if(locacionesUsuario.find(item=>item.locacion === locacion.locacion)){
              loccionesUsuarioTMP.push(locacion)
            }
        }
        locaciones = loccionesUsuarioTMP;
      }

      return locaciones;
  }


  filtrarLocacion(event:any){
    this.locacionesFiltradas = this.filter(event,this.locaciones);
  }

  seleccionarLocacion(locacion:any){
    ////////console.log(locacion);
    let bodegas_locacion = this.allbodegas.filter(bodega=> bodega.locacion2 === locacion.locacion);
    ////////console.log(bodegas_locacion);
    if(bodegas_locacion.length==0){
      //this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La locación ${locacion.label} no tiene bodegas asociadas`});
      //console.log(`La locación ${locacion.label} no tiene bodegas asociadas`);
    }else{
      ////////console.log(bodegas_locacion);
      this.bodegas = bodegas_locacion;
      this.bodegaSeleccionada = this.bodegas[0];
      this.seleccionarBodega(this.bodegaSeleccionada);
    }
    
  }

  filter(event: any, arrayFiltrar:any[]) {

    //////////////////////////////////////////console.log((arrayFiltrar);
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



  filtrarBodega(event:any){
    this.bodegasFiltradas = this.filter(event,this.bodegas);
  }

  seleccionarBodega(bodega:any){
    ////console.log(bodega);
   this.setDashboard();
  }

 async seleccionarFecha(){
    //////////////////////////console.log(this.fechaProgramacion)
    this.turnosFehaSeleccionada = await this.getInfoTablaProgramacionDiaria();
    this.setDashboard();
  }


  async setDashboard():Promise<void>{
      /**
       * COnfigurar tabla de programacion diaria bodega
       */
      
      this.loadingPDB = true;
      this.lineasProgramacionDiariaBodega = this.turnosFehaSeleccionada.filter(linea => linea.pedidos_turno_bodega=== this.bodegaSeleccionada.code && linea.turnos_estado === EstadosDealleSolicitud.AUTORIZADO);
      ////console.log(this.lineasProgramacionDiariaBodega);
      this.configTablaProgramacionDiaria();
      this.lineasConsolidadoProgramacionDiariaBodega = (await this.getInfoTablaConsolidadoProgramacionDiaria()).consolidadoItems;
      this.configTablaConsolidadoProgramacionDiaria();
      this.getPlacasCompartidas();
      this.lineasProgramacionDiariaGerencia = this.turnosFehaSeleccionada.filter(linea => linea.turnos_estado != EstadosDealleSolicitud.SOLICITADO && 
                                                                                          linea.turnos_estado != EstadosDealleSolicitud.PAUSADO && 
                                                                                          linea.turnos_estado != EstadosDealleSolicitud.CANCELADO &&
                                                                                          linea.turnos_estado != EstadosDealleSolicitud.SOLINVENTARIO );
      
      ////console.log(this.lineasProgramacionDiariaGerencia);
      this.configTablaProgramacionGerencia();
  }

  async getInfoTablaProgramacionDiaria():Promise<any> {

    let params:any = {
      fechacita:this.fechaProgramacion,
      //locacion:this.locacionSeleccionada.code,
      //bodega:this.bodegaSeleccionada.code
    }

    if(this.infousuario.roles.find((rol: { nombre: any; })=>rol.nombre === TipoRol.CLIENTELOGISTICA)){
      ////console.log(this.infousuario.clientes);
      let clientes:any = this.infousuario.clientes.map((cliente: { id: any; })=>{return cliente.id;});
      ////console.log(clientes);
      params.clientes = JSON.stringify(clientes);
    }
    //////////////////////////console.log(this.fechaProgramacion);

    let programacionBodega = await this.solicitudTurnoService.turnosExtendido(params);
    ////console.log(programacionBodega.raw);
    
    return programacionBodega.raw;
  }

   configTablaProgramacionDiaria(){
    
    let tabla:any = {
      header:  this.configHeaderTablaProgramacionDiaria(),
      data:  this.configDataTablaProgramacionDiaria(this.lineasProgramacionDiariaBodega)
    };

    this.tablaProgramacionDiariaBodega = tabla;
    this.loadingPDB = false;

  }

   configHeaderTablaProgramacionDiaria(){
    let headersTable:any[] =  [{
      'hora': { label:'Hora',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'id': { label:'Turno',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'docnum': { label:'Número pedido',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'CardName': { label:'Cliente',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',},
      'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false},
      'placa': { label:'Placa',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'conductor': { label:'Conductor',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'cedula': { label:'Cedula',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'telefono': { label:'Teléfono',type:'text', sizeCol:'6rem', align:'center', editable:false},

    }];

    return headersTable;
  }

   configDataTablaProgramacionDiaria(data:any[]){

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          hora:new Date(linea.turnos_horacita).toLocaleTimeString(),
          id:linea.turnos_id,
          docnum:linea.pedidos_turno_pedidonum,
          CardName:linea.pedidos_turno_CardName,
          itemcode:linea.pedidos_turno_itemcode,
          itemname:linea.pedidos_turno_itemname,
          cantidad:linea.pedidos_turno_cantidad,
          placa:linea.vehiculos_placa,
          conductor:linea.conductores_nombre,
          cedula:linea.conductores_cedula,
          telefono:linea.conductores_numerocelular
        });
    }

    return dataTable;

  }

  async getInfoTablaConsolidadoProgramacionDiaria():Promise<any> {

    let consolidadoItems:any = await this.functionsService.groupArray(this.lineasProgramacionDiariaBodega,'pedidos_turno_itemcode');
    let totalToneladas:number = (await this.functionsService.sumColArray(this.lineasProgramacionDiariaBodega,[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
    ////////////////////////////console.log('consolidadoItems',consolidadoItems);
    
    await consolidadoItems.map(async (linea:any)=>{
        
        let prcItemBodega = linea.pedidos_turno_cantidad / totalToneladas;
        linea.totalToneladas = totalToneladas;
        linea.prcItemBodega = prcItemBodega;

        //////////////////////////////console.log('itemcode',linea.pedidos_turno_itemcode);
        //////////////////////////////console.log(this.lineasProgramacionDiariaBodega.filter(item=>item.pedidos_turno_itemcode === linea.pedidos_turno_itemcode));
    });

    let consolidadoProgramacionBodega:any = {
      totalToneladas,
      consolidadoItems

    };

    ////////////////////////////console.log(consolidadoProgramacionBodega);
    
    return consolidadoProgramacionBodega;
  }

   async configTablaConsolidadoProgramacionDiaria(){
    
    let tabla:any = {
      header:  this.configHeaderTablaConsolidadoProgramacionDiaria(),
      data:  this.configDataTablaConsolidadoProgramacionDiaria(this.lineasConsolidadoProgramacionDiariaBodega)
    };

    this.tablaConsolidadoProgramacionDiariaBodega = tabla;

    let colsSum = await this.configSumTabla(tabla.header,tabla.data);

    this.tablaConsolidadoProgramacionDiariaBodega.colsSum = colsSum;
    
    this.loadingCPDB = false;
    
    //this.chartPieData = await this.setConsolidadoDataPieChart(tabla.data);

    this.chartPieData = await this.functionsService.setDataPieDoughnutChart(tabla.data,{label:'itemname',value:'cantidad'});
    
   
    ////////////////////////console.log(this.tablaConsolidadoProgramacionDiariaBodega.data.length);

  }

   configHeaderTablaConsolidadoProgramacionDiaria(){
    let headersTable:any[] =  [{
      
      'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',},
      'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      
    }];

    return headersTable;
  }

   configDataTablaConsolidadoProgramacionDiaria(data:any[]){

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
      
          itemcode:linea.pedidos_turno_itemcode,
          itemname:linea.pedidos_turno_itemname,
          cantidad:linea.pedidos_turno_cantidad,
        });
    }

    return dataTable;

  }
  /*
  async setConsolidadoDataPieChart(data:any[]):Promise<any>{
    let dataPieChart:any;
    let labelsPieChart:any[] = [];
    let valuesPieChart:any[] = [];
    let backgroundColor:any[] = [];

    for(let item of data){
      let color = await this.functionsService.generarColorHex();
      backgroundColor.push(color)
    }
    ////////////console.log(backgroundColor);
    let hoverBackgroundColor:any[] = backgroundColor;


    for(let linea of data){
       labelsPieChart.push(linea.itemname);
       valuesPieChart.push(linea.cantidad);
    }

    dataPieChart ={
      labels: labelsPieChart,

      datasets: [
          {
              //label: 'First Dataset',
              data: valuesPieChart,
              //fill: false,
              //backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
              //borderColor: documentStyle.getPropertyValue('--bluegray-700'),
              //tension: .4

              backgroundColor: backgroundColor,
              hoverBackgroundColor: hoverBackgroundColor
          },
        
      ]
  };

    return dataPieChart;
  }
  */

  async getPlacasCompartidas(){
    let turnosFehaSeleccionadaConfirmados = this.turnosFehaSeleccionada.filter(turno=>turno.turnos_estado === EstadosDealleSolicitud.AUTORIZADO);
    let configPlacasCompartidas = await this.configHeaderTablaPlacasCompartidasBodegas(turnosFehaSeleccionadaConfirmados);
    this.tablaPlacasCompartidasBodegas.header = configPlacasCompartidas.headersTable;
    //////////////////////console.log(turnosFehaSeleccionadaConfirmados,configPlacasCompartidas);

    
    this.tablaPlacasCompartidasBodegas.data = await this.configDataTablaPlacasCompartidasBodegas(configPlacasCompartidas,turnosFehaSeleccionadaConfirmados);

    let colsSum = await this.configSumTabla(configPlacasCompartidas.headersTable,this.tablaPlacasCompartidasBodegas.data);

    this.tablaPlacasCompartidasBodegas.colsSum = colsSum;
    //////////////////console.log(this.tablaPlacasCompartidasBodegas.colsSum);
    this.loadingPC = false;
  }

  async configHeaderTablaPlacasCompartidasBodegas(arrayTurnos:any[]):Promise<any>{

   
    
    let bodegas:any[] = [];
    let placas:any[] = [];

    let objString:string =`[{"placas":{"label":"Placa","type":"text","sizeCol":"6rem","align":"center","editable":false},`;
    let iterador:number = 1;
    let idBodega:number = 1;
    for(let turno of arrayTurnos){
        
        if(!bodegas.find(bodega=>bodega.code === turno.pedidos_turno_bodega)){

          objString += `"bodega${idBodega}":{"label":"${turno.pedidos_turno_bodega}","type":"number","sizeCol":"6rem","align":"center","currency":"TON","side":"rigth","editable":false,"sum":true},`;
          bodegas.push({code: turno.pedidos_turno_bodega});
          
          idBodega++;
        }
        if(!placas.find(placa=>placa.code === turno.vehiculos_placa)){
          placas.push({code: turno.vehiculos_placa});
        }
        iterador++;
    }
    //objString = objString.substring(0,objString.length-1);
    objString +='"total":{"label":"Total placa","type":"number","sizeCol":"6rem","align":"center","currency":"TON","side":"rigth","editable":false,"sum":true}}]'

    //////////////////////console.log(objString)

    let headersTable:any[] = JSON.parse(objString);

    let resultConfig = {
      headersTable,
      bodegas,
      placas
    }

    return resultConfig;
  }

  async configDataTablaPlacasCompartidasBodegas(configPlacasCompartidas:any, turnos:any[]):Promise<any>{

    ////////////////console.log(turnos);
    this.loadingPC = true;
    let placas:any[] = configPlacasCompartidas.placas;
    let bodegas:any[] = configPlacasCompartidas.bodegas;
    let headersTable:any[] = configPlacasCompartidas.headersTable;

    let dataTable:any[] = [];
    for(let placa of placas){
      let idBodega:number = 1;
      let objString:string = `{"placas":"${placa.code}",`;
      let totalPlaca:number =0;
      for(let bodega of bodegas){

        ////////////////////////console.log(headersTable[0]['bodega'+idBodega].label);
        let cantidadBodegaPlaca =0;
        let codeBodega = headersTable[0]['bodega'+idBodega].label;
        
        if(bodega.code === codeBodega && turnos.find(turno=>turno.vehiculos_placa === placa.code && turno.pedidos_turno_bodega === bodega.code)){
          let turnosPlacaBodega = turnos.filter(turno=>turno.vehiculos_placa === placa.code && turno.pedidos_turno_bodega === bodega.code);
          let cantidadTotalTurnosPlacaBodega = await this.functionsService.sumColArray(turnosPlacaBodega,[{pedidos_turno_cantidad:0}]);
          cantidadBodegaPlaca = cantidadTotalTurnosPlacaBodega[0].pedidos_turno_cantidad;
        }
       
        objString+= `"bodega${idBodega}":${cantidadBodegaPlaca},`;
        totalPlaca+=cantidadBodegaPlaca;
        idBodega++;
      }
      //objString = objString.substring(0,objString.length-1);

      objString +=`"total":"${totalPlaca}"}`

      //////////////////////console.log(objString);
      dataTable.push(JSON.parse(objString));

    }
    
    ////////////////////console.log(dataTable);


    return dataTable;


  }

  async configSumTabla(headersTable:any[],dataTable:any[]):Promise<any>{
    let colsSum:any[] = [];
    //////////////////console.log(dataTable);
    //////////////////////console.log(Object.keys(headersTable[0]));
    let objString:string = "";
    let colsSumSwitch:boolean = false;
    for(let key of Object.keys(headersTable[0])){
      objString+=`"${key}":`
      if(headersTable[0][key].sum){
        //////////////////////console.log(key);
        colsSumSwitch = true;
        let total = await this.functionsService.sumColArray(dataTable,JSON.parse(`[{"${key}":0}]`));
        //////////////////////console.log(total[0][key]);
        objString+=`${parseFloat(total[0][key])},`
      }else{
        objString+=`"",`
      }
    }
    objString = `{${objString.substring(0,objString.length-1)}}`;
    //////////////////////console.log(objString);
    if(colsSumSwitch){
      colsSum.push(JSON.parse(objString));
    }
    

    //////////////////////console.log(colsSum);

    return colsSum;

  }


  async configTablaProgramacionGerencia(){

    let headerTabla =   this.configHeaderTablaProgramacionDiariaGerencia();
    //////////console.log(this.lineasProgramacionDiariaGerencia);
    let dependencias = await this.functionsService.groupArray(this.lineasProgramacionDiariaGerencia,'pedidos_turno_dependencia');
    ////console.log(dependencias);

    for(let dependencia of dependencias ){

      let lineasProgramacionDiariaDependencia = this.lineasProgramacionDiariaGerencia.filter(linea=>linea.pedidos_turno_dependencia === dependencia.pedidos_turno_dependencia);
      
      console.log(lineasProgramacionDiariaDependencia);
      let dataDependencia =  await this.configDataTablaProgramacionDiariaaGerencia(lineasProgramacionDiariaDependencia);
      ////////////console.log(dataDependencia);
      let colsSumDependencia = await this.configSumTabla(headerTabla,dataDependencia)
      ////////////console.log(colsSumDependencia);
      
      let lineasProgramacionDiariaDependenciaTipoProducto = await this.functionsService.groupArray(lineasProgramacionDiariaDependencia,'pedidos_turno_tipoproducto',[{pedidos_turno_cantidad:0}]);
      ////////////console.log(lineasProgramacionDiariaDependenciaTipoProducto);
      let consolidadoTipoProductoDependencia = await this.configDataTablaConsolidadoTipoProducto(lineasProgramacionDiariaDependenciaTipoProducto);
      ////////////console.log(consolidadoTipoProductoDependencia);
      let colSumConsolidadoTipoProductoDependencia = await this.configSumTabla(this.tablaConsolidadoTipoProducto.header,consolidadoTipoProductoDependencia)
      ////////////console.log(colSumConsolidadoTipoProductoDependencia);

      let chartDataConsolidadoTipoProducto = await this.functionsService.setDataBasicChart(consolidadoTipoProductoDependencia,{label:'tipo',value:'cantidad'});


      let lineasProgramacionDiariaDependenciaModTPT = await this.functionsService.groupArray(lineasProgramacionDiariaDependencia,'turnos_condiciontpt',[{pedidos_turno_cantidad:0}]);
      ////////////console.log(lineasProgramacionDiariaDependenciaTipoProducto);
      let consolidadoModTPT = await this.configDataTablaConsolidadooModTPT(lineasProgramacionDiariaDependenciaModTPT);
      ////////////console.log(consolidadoTipoProductoDependencia);
      let colSumConsolidadoModTPT = await this.configSumTabla(this.tablaConsolidadoModTPT.header,consolidadoModTPT)
      ////////////console.log(colSumConsolidadoTipoProductoDependencia);

      let chartDataConsolidadoModTPT = await this.functionsService.setDataBasicChart(consolidadoModTPT,{label:'tipo',value:'cantidad'});
      
      
      this.dependencias.push({
        dependencia: dependencia.pedidos_turno_dependencia,
        programacionDiaria:dataDependencia,
        colsSumProgramacionDiaria:colsSumDependencia,
        consolidadoTipoProductoDependencia,
        colSumConsolidadoTipoProductoDependencia,
        chartDataConsolidadoTipoProducto,
        consolidadoModTPT,
        colSumConsolidadoModTPT,
        chartDataConsolidadoModTPT

      })
    }
    
    let toneladasZonaPedido = await this.functionsService.groupArray(this.lineasProgramacionDiariaGerencia,'pedidos_turno_localidad',[{pedidos_turno_cantidad:0}]);

    //console.log(toneladasZonaPedido);
   
    let tablaToneladasZonaPedido:any = {
      header:  this.configHeaderTablaToneladasZona(),
      data:  this.configDataTablaTablaToneladasZona(toneladasZonaPedido)
    };

    let colsSum = await this.configSumTabla(tablaToneladasZonaPedido.header,tablaToneladasZonaPedido.data);
    this.tablaToneladasZona = tablaToneladasZonaPedido;
    this.tablaToneladasZona.colsSum = colsSum;

    ////////////console.log(this.tablaToneladasZona);

    //this.chartDataConsolidadoZona = await this.setConsolidadoZonaDataChart(this.tablaToneladasZona.data)

    this.chartDataConsolidadoZona = await this.functionsService.setDataPieDoughnutChart(this.tablaToneladasZona.data,{label:'zona',value:'cantidad'});

     /*


    this.dependencias = await dependencias.map(async (dependencia)=>{
      ////////////console.log(dependencia);
      let dataDependencia = await tabla.data.filter((linea: { dependencia: any; })=>linea.dependencia === dependencia.dependencia);
      //////////console.log('dataDependencia',dataDependencia);
      let colsSumDependencia = await this.configSumTabla(tabla.header,dataDependencia)
      //////////console.log('colsSumDependencia',colsSumDependencia);
      return {
                'dependencia':dependencia.dependencia,
                data: dataDependencia,
                colsSum:  colsSumDependencia
             }
    })
    //////////console.log(this.dependencias);

    this.tablaProgramacionDiariaGerencia = tabla;

    let colsSum = await this.configSumTabla(tabla.header,tabla.data);

    this.tablaProgramacionDiariaGerencia.colsSum = colsSum;
    */

    this.loadingPDG = false;

  }

  configHeaderTablaProgramacionDiariaGerencia(){
    let headersTable:any[] =  [{
      
      'dependencia': {label:'Dependencia',type:'text', sizeCol:'6rem', align:'center',},
      'bodega': {label:'Bodega',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'estado': {label:'Estado',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'cliente': {label:'Cliente',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'tipo': {label:'Tipo',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'pedido': {label:'Pedido venta',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      
    }];

    return headersTable;
  }

  async configDataTablaProgramacionDiariaaGerencia(data:any[]){

    ////console.log(data);
    

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          dependencia:linea.pedidos_turno_dependencia,
          bodega:linea.pedidos_turno_bodega,
          estado:linea.turnos_estado,
          cliente:linea.pedidos_turno_CardName,
          tipo:linea.turnos_condiciontpt,
          pedido:linea.pedidos_turno_pedidonum,
          cantidad:linea.pedidos_turno_cantidad
          
        });
    }
    //console.log(dataTable);
    //Agrupar por pedido
    dataTable = await this.functionsService.groupArray(dataTable,'pedido',[{cantidad:0}]);
    //Ordenar por Dependencia - bodega 
    //dataTable = await this.functionsService.sortArrayObject(dataTable,'bodega','ASC')
    console.log(dataTable);
    
    dataTable.sort((a,b)=> (a.dependencia.localeCompare(b.dependencia) || a.bodega.localeCompare(b.bodega)));


    return dataTable;

  }

  configHeaderTablaToneladasZona(){
    let headersTable:any[] =  [{
      
      'zona': {label:'Zona',type:'text', sizeCol:'6rem', align:'center',},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      
    }];

    return headersTable;
  }

  configDataTablaTablaToneladasZona(data:any[]){

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          zona:linea.pedidos_turno_localidad==null?'SIN ZONA':linea.pedidos_turno_localidad,
          cantidad:linea.pedidos_turno_cantidad
        });
    }

    return dataTable;

  }
  /*
  async setConsolidadoZonaDataChart(data:any[]):Promise<any>{
    let dataPieChart:any;
    let labelsPieChart:any[] = [];
    let valuesPieChart:any[] = [];
    //let backgroundColor:any[] =  ["#42A5F5","#FF0000",];

    let backgroundColor:any[] = [];

    for(let item of data){
      let color = await this.functionsService.generarColorHex();
      backgroundColor.push(color)
    }
    ////////////console.log(backgroundColor);
    let hoverBackgroundColor:any[] = backgroundColor;


    for(let linea of data){
       labelsPieChart.push(linea.zona);
       valuesPieChart.push(linea.cantidad);
    }

    dataPieChart ={
      labels: labelsPieChart,

      datasets: [
          {
              //label: 'First Dataset',
              data: valuesPieChart,
              //fill: false,
              //backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
              //borderColor: documentStyle.getPropertyValue('--bluegray-700'),
              //tension: .4

              backgroundColor: backgroundColor,
              hoverBackgroundColor: hoverBackgroundColor
          },
        
      ]
  };

    return dataPieChart;
  }
  */

  configHeaderTablaConsolidadoTipoProducto(){
    let headersTable:any[] =  [{
      
      'tipo': {label:'Tipo Producto',type:'text', sizeCol:'6rem', align:'center',},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      
    }];

    return headersTable;
  }

  async configDataTablaConsolidadoTipoProducto(data:any[]){

    ////////////console.log(data);
    

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          tipo:linea.pedidos_turno_tipoproducto,
          cantidad:linea.pedidos_turno_cantidad
          
        });
    }
    

    return dataTable;

  }

  configHeaderTablaConsolidadoModTPT(){
    let headersTable:any[] =  [{
      
      'tipo': {label:'Modo transporte',type:'text', sizeCol:'6rem', align:'center',},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      
    }];

    return headersTable;
  }

  async configDataTablaConsolidadooModTPT(data:any[]){

    ////////////console.log(data);
    

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          tipo:linea.turnos_condiciontpt,
          cantidad:linea.pedidos_turno_cantidad
          
        });
    }
    

    return dataTable;

  }
}
