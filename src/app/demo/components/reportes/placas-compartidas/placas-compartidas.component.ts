import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { TipoRol } from '../../admin/roles/roles.enum';
import { EstadosDealleSolicitud } from '../../turnos/estados-turno.enum';

@Component({
  selector: 'app-placas-compartidas',
  providers:[ConfirmationService,MessageService],
  templateUrl: './placas-compartidas.component.html',
  styleUrls: ['./placas-compartidas.component.scss']
})
export class PlacasCompartidasComponent implements OnInit {

  infousuario!:any;
  fechaProgramacion:Date = new Date((new Date()).setHours(0, 0, 0, 0));
  turnosFehaSeleccionada!:any[];

  tablaPlacasCompartidasBodegas:any = {
    header:[{"placas":{"label":"Placa","type":"text","sizeCol":"6rem","align":"center","editable":false}}],
    data:[],
    colsSum:[]
  };

  loadingPC:boolean = true;

  allbodegas:any[] = [];

  constructor(private almacenesService:AlmacenesService,
    private messageService: MessageService,
    public dialogService: DialogService,
    public usuariosService:UsuarioService,
    private solicitudTurnoService:SolicitudTurnoService,
    private functionsService:FunctionsService,
    private router:Router){}


async ngOnInit() {
  this.infousuario = await this.usuariosService.infoUsuario();
  this.seleccionarFecha();
}

async seleccionarFecha(){
  ////////////////////////////////console.log(this.fechaProgramacion)
  this.turnosFehaSeleccionada = await this.getInfoTablaProgramacionDiaria();
  console.log(this.turnosFehaSeleccionada);
  let turnosAutorizados:any = await this.functionsService.clonObject(this.turnosFehaSeleccionada.filter(turno=>turno.turnos_estado === EstadosDealleSolicitud.AUTORIZADO));
  
  await this.setTablaPlacasCompartidas(turnosAutorizados);
  
}

async getInfoTablaProgramacionDiaria():Promise<any> {

  let params:any = {
    fechacita:this.fechaProgramacion,
    //locacion:this.locacionSeleccionada.code,
    //bodega:this.bodegaSeleccionada.code
  }

  if(this.infousuario.roles.find((rol: { nombre: any; })=>rol.nombre === TipoRol.CLIENTELOGISTICA)){
    //////////console.log(this.infousuario.clientes);
    let clientes:any = this.infousuario.clientes.map((cliente: { id: any; })=>{return cliente.id;});
    //////////console.log(clientes);
    params.clientes = JSON.stringify(clientes);
  }

  const programacionBodega = await this.solicitudTurnoService.turnosExtendido(params);
  //console.log(programacionBodega);
  return programacionBodega.raw;
}

async setTablaPlacasCompartidas(turnosAutorizados:any[]):Promise<void> {
  
  console.log(turnosAutorizados);

  let configPlacasCompartidas = await this.configHeaderTablaPlacasCompartidasBodegas(turnosAutorizados);
    this.tablaPlacasCompartidasBodegas.header = configPlacasCompartidas.headersTable;
    ////////////////////////////console.log(turnosFehaSeleccionadaConfirmados,configPlacasCompartidas);

    
    this.tablaPlacasCompartidasBodegas.data = await this.configDataTablaPlacasCompartidasBodegas(configPlacasCompartidas,turnosAutorizados);

    let colsSum = await this.configSumTabla(configPlacasCompartidas.headersTable,this.tablaPlacasCompartidasBodegas.data);

    this.tablaPlacasCompartidasBodegas.colsSum = colsSum;
    ////////////////////////console.log(this.tablaPlacasCompartidasBodegas.colsSum);
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

  ////////////////////////////console.log(objString)

  let headersTable:any[] = JSON.parse(objString);

  let resultConfig = {
    headersTable,
    bodegas,
    placas
  }

  return resultConfig;
}

async configDataTablaPlacasCompartidasBodegas(configPlacasCompartidas:any, turnos:any[]):Promise<any>{

  ////console.log(configPlacasCompartidas);
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

      //////////////////////////////console.log(headersTable[0]['bodega'+idBodega].label);
      let cantidadBodegaPlaca =0;
      let codeBodega = headersTable[0]['bodega'+idBodega].label;
      
      if(bodega.code === codeBodega && turnos.find(turno=>turno.vehiculos_placa === placa.code && turno.pedidos_turno_bodega === bodega.code)){
        let turnosPlacaBodega = turnos.filter(turno=>turno.vehiculos_placa === placa.code && turno.pedidos_turno_bodega === bodega.code);
        console.log('turnosPlacaBodega',turnosPlacaBodega);
        let cantidadTotalTurnosPlacaBodega = await this.functionsService.sumColArray(turnosPlacaBodega,[{'pedidos_turno_cantidad':0}]);
        console.log(cantidadTotalTurnosPlacaBodega);
        cantidadBodegaPlaca = cantidadTotalTurnosPlacaBodega[0].pedidos_turno_cantidad;
      }
     
      objString+= `"bodega${idBodega}":${cantidadBodegaPlaca},`;
      totalPlaca+=cantidadBodegaPlaca;
      idBodega++;
    }
    //objString = objString.substring(0,objString.length-1);

    objString +=`"total":"${totalPlaca}"}`

    ////////////////////////////console.log(objString);
    dataTable.push(JSON.parse(objString));

  }
  
  //////////////////////////console.log(dataTable);


  return dataTable;


}

async configSumTabla(headersTable:any[],dataTable:any[]):Promise<any>{
  let colsSum:any[] = [];
  ////////////////////////console.log(dataTable);
  ////////////////////////////console.log(Object.keys(headersTable[0]));
  let objString:string = "";
  let colsSumSwitch:boolean = false;
  for(let key of Object.keys(headersTable[0])){
    objString+=`"${key}":`
    if(headersTable[0][key].sum){
      ////////////////////////////console.log(key);
      colsSumSwitch = true;
      let total = await this.functionsService.sumColArray(dataTable,JSON.parse(`[{"${key}":0}]`));
      ////////////////////////////console.log(total[0][key]);
      objString+=`${parseFloat(total[0][key])},`
    }else{
      objString+=`"",`
    }
  }
  objString = `{${objString.substring(0,objString.length-1)}}`;
  ////////////////////////////console.log(objString);
  if(colsSumSwitch){
    colsSum.push(JSON.parse(objString));
  }
  

  ////////////////////////////console.log(colsSum);

  return colsSum;

}



}
