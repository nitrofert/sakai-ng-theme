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

@Component({
  selector: 'app-programacion-bodega',
  providers:[ConfirmationService,MessageService],
  templateUrl: './programacion-bodega.component.html',
  styleUrls: ['./programacion-bodega.component.scss']
})
export class ProgramacionBodegaComponent implements OnInit {

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
  lineasProgramacionDiariaBodega!:any;
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

  localidades:any;
  dependencias_all:any;

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

  configHeaderTablaProgramacionDiaria(){
    let headersTable:any[] =  [{
      'hora': { label:'Hora',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"hora"},
      'id': { label:'Turno',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"id"},
      'estado': { label:'Estado',type:'text', sizeCol:'6rem', align:'center', editable:false, backgroundColor:{arrayColor:this.solicitudTurnoService.estadosTurno},field:"estado"},
      'docnum': { label:'Número pedido',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"docnum"},
      'CardName': { label:'Cliente',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"CardName"},
      'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',field:"itemcode"},
      'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"itemname"},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,field:"cantidad"},
      'placa': { label:'Placa',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"placa"},
      'conductor': { label:'Conductor',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"conductor"},
      'cedula': { label:'Cedula',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"cedula"},
      'telefono': { label:'Teléfono',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"telefono"},

    }];

    return headersTable;
  }

  configHeaderTablaConsolidadoProgramacionDiaria(){
    let headersTable:any[] =  [{
      
      'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',field:"itemcode"},
      'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false,field:"itemname"},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true,field:"cantidad"},
      
    }];

    return headersTable;
  }

  async getLocalidades(){
    this.localidades =  await this.localidadesService.getLocalidades();
    this.getDependencias(); 
  }

  async getDependencias(){
    this.dependencias_all =  await this.dependenciasService.getDependencias();
    this.turnosFehaSeleccionada = await this.getInfoTablaProgramacionDiaria();
    
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
              this.getLocaciones();
             
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
            // ////////////////////////////////////console.log(locaciones);
              this.locaciones = await this.setLocaciones(locaciones,this.infousuario.locaciones);
              this.locacionSeleccionada = this.locaciones[0];
              this.seleccionarLocacion(this.locacionSeleccionada);
              //////////////////////////////////////console.log();
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
    ////console.log('allbodegas',this.allbodegas);
    ////console.log('locacion',locacion);

    let bodegas_locacion = this.allbodegas.filter(bodega=> bodega.locacion2 === locacion.locacion);
    ////////////////console.log(bodegas_locacion);
    if(bodegas_locacion.length==0){
      //this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La locación ${locacion.label} no tiene bodegas asociadas`});
      //////////console.log(`La locación ${locacion.label} no tiene bodegas asociadas`);
    }else{
      ////////////////console.log(bodegas_locacion);
      this.bodegas = bodegas_locacion;
      this.bodegaSeleccionada = this.bodegas[0];
      this.seleccionarBodega(this.bodegaSeleccionada);
    }
    
  }

  seleccionarBodega(bodega:any){
    ////////////console.log(bodega);
   this.setReporte();
  }

  filter(event: any, arrayFiltrar:any[]) {

    //////////////////////////////////////////////////console.log((arrayFiltrar);
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

  async seleccionarFecha(){
    //////////////////////////////////console.log(this.fechaProgramacion)
    this.turnosFehaSeleccionada = await this.getInfoTablaProgramacionDiaria();
    this.setReporte();
  }

  async getInfoTablaProgramacionDiaria():Promise<any> {

    let params:any = {
      fechacita:this.fechaProgramacion,
      //locacion:this.locacionSeleccionada.code,
      //bodega:this.bodegaSeleccionada.code
    }

    if(this.infousuario.roles.find((rol: { nombre: any; })=>rol.nombre === TipoRol.CLIENTELOGISTICA)){
      ////////////console.log(this.infousuario.clientes);
      let clientes:any = this.infousuario.clientes.map((cliente: { id: any; })=>{return cliente.id;});
      ////////////console.log(clientes);
      params.clientes = JSON.stringify(clientes);
    }
    //////////////////////////////////console.log(this.fechaProgramacion);

    let programacionBodega = await this.solicitudTurnoService.turnosExtendido(params);
    //console.log(programacionBodega);

    programacionBodega.raw.forEach((solicitud: {
     
          pedidos_turno_dependencia:string;
          pedidos_turno_dependencia_label:string;
          pedidos_turno_localidad:string;
          pedidos_turno_localidad_label:string;
    })=>{

          solicitud.pedidos_turno_dependencia_label = this.dependencias_all.find((denpendencia: { id: any; })=>denpendencia.id === solicitud.pedidos_turno_dependencia)?this.dependencias_all.find((denpendencia: { id: any; })=>denpendencia.id === solicitud.pedidos_turno_dependencia).name:'';
          solicitud.pedidos_turno_localidad_label = this.localidades.find((localidad: { id: any; })=>localidad.id === solicitud.pedidos_turno_localidad)?this.localidades.find((localidad: { id: any; })=>localidad.id === solicitud.pedidos_turno_localidad).name:'';

          

    //return solicitud
    });

    console.log(programacionBodega.raw.filter((item: { pedidos_turno_itemcode: { toString: () => string; }; })=>item.pedidos_turno_itemcode.toString().startsWith('SF')==false));
    let programacionBodegaSinFlete:any = programacionBodega.raw.filter((item: { pedidos_turno_itemcode: { toString: () => string; }; })=>item.pedidos_turno_itemcode.toString().startsWith('SF')==false);
    //return programacionBodega.raw;
    return programacionBodegaSinFlete;
  }

  async setReporte(){
    this.loadingPDB = true;
    this.lineasProgramacionDiariaBodega = await this.functionsService.clonObject(this.turnosFehaSeleccionada.filter(linea => linea.pedidos_turno_bodega=== this.bodegaSeleccionada.code));
    this.configTablaProgramacionDiaria();

    this.lineasConsolidadoProgramacionDiariaBodega = (await this.getInfoTablaConsolidadoProgramacionDiaria()).consolidadoItems;
      this.configTablaConsolidadoProgramacionDiaria();
  }

  configTablaProgramacionDiaria(){
    
    let tabla:any = {
      header:  this.configHeaderTablaProgramacionDiaria(),
      data:  this.configDataTablaProgramacionDiaria(this.lineasProgramacionDiariaBodega)
    };

    this.tablaProgramacionDiariaBodega = tabla;
    this.loadingPDB = false;

  }

  configDataTablaProgramacionDiaria(data:any[]){

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          hora:new Date(linea.turnos_horacita).toLocaleTimeString(),
          id:linea.turnos_id,
          estado:linea.turnos_estado,
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

    let consolidadoItems:any = await this.functionsService.groupArray(await this.functionsService.clonObject(this.lineasProgramacionDiariaBodega),'pedidos_turno_itemcode',[{pedidos_turno_cantidad:0}]);
    let totalToneladas:number = (await this.functionsService.sumColArray(await this.functionsService.clonObject(this.lineasProgramacionDiariaBodega),[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
    ////////////////////////////////////console.log('consolidadoItems',consolidadoItems);
    
    await consolidadoItems.map(async (linea:any)=>{
        
        let prcItemBodega = linea.pedidos_turno_cantidad / totalToneladas;
        linea.totalToneladas = totalToneladas;
        linea.prcItemBodega = prcItemBodega;

        //////////////////////////////////////console.log('itemcode',linea.pedidos_turno_itemcode);
        //////////////////////////////////////console.log(this.lineasProgramacionDiariaBodega.filter(item=>item.pedidos_turno_itemcode === linea.pedidos_turno_itemcode));
    });

    let consolidadoProgramacionBodega:any = {
      totalToneladas,
      consolidadoItems

    };

    ////////////////////////////////////console.log(consolidadoProgramacionBodega);
    
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
    
   
    ////////////////////////////////console.log(this.tablaConsolidadoProgramacionDiariaBodega.data.length);

  }

  async configSumTabla(headersTable:any[],dataTable:any[]):Promise<any>{
    let colsSum:any[] = [];
    //////////////////////////console.log(dataTable);
    //////////////////////////////console.log(Object.keys(headersTable[0]));
    let objString:string = "";
    let colsSumSwitch:boolean = false;
    for(let key of Object.keys(headersTable[0])){
      objString+=`"${key}":`
      if(headersTable[0][key].sum){
        //////////////////////////////console.log(key);
        colsSumSwitch = true;
        let total = await this.functionsService.sumColArray(dataTable,JSON.parse(`[{"${key}":0}]`));
        //////////////////////////////console.log(total[0][key]);
        objString+=`${parseFloat(total[0][key])},`
      }else{
        objString+=`"",`
      }
    }
    objString = `{${objString.substring(0,objString.length-1)}}`;
    //////////////////////////////console.log(objString);
    if(colsSumSwitch){
      colsSum.push(JSON.parse(objString));
    }
    

    //////////////////////////////console.log(colsSum);

    return colsSum;

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

}
