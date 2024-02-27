import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { PedidosService } from 'src/app/demo/service/pedidos.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-inventario-bodega',
  providers:[ConfirmationService,MessageService],
  templateUrl: './inventario-bodega.component.html',
  styleUrls: ['./inventario-bodega.component.scss']
})
export class InventarioBodegaComponent implements  OnInit{

  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:true, delete_accion:false}];
  permisosModulo!:any[];

  infousuario!:any;

  tablaInventarioBodega:any = {
    header:this.configHeaderTablaInventarioBodega(),
    data:[],
    colsSum:[]
  };

  loading:boolean = false;

  locaciones:any[] = [];
  locacionSeleccionada:any = [];
  locacionesFiltradas:any[] = [];

  allbodegas:any[] = [];
  bodegas:any[] = [];
  bodegaSeleccionada:any = [];
  bodegasFiltradas:any[] = [];

  constructor(private pedidosService: PedidosService,
    private almacenesService: AlmacenesService,
    private messageService: MessageService,
    //private nodeService: NodeService,
    //private vehiculosService:VehiculosService,
    //private conductoresService:ConductoresService,
    private confirmationService: ConfirmationService,
    //private ordenesCargueService: OrdenesCargueService,
    //private transportadorasService:TransportadorasService,
    //private solicitudTurnoService:SolicitudTurnoService,
    public dialogService: DialogService,
    private router:Router,
    public usuariosService:UsuarioService,
    public functionsService:FunctionsService,
    //private wsMysqlService:WsMysqlService,
    //private clientesService:ClientesService,
    //private sB1SLService:SB1SLService,
    //private ciudadesService:CiudadesService,
    ){
      
       
    }

  async ngOnInit() {

    this.infousuario = await this.usuariosService.infoUsuario();

    //this.getInventario();
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
              //console.log(this.allbodegas);
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
              //console.log(locaciones);
              this.locaciones = await this.setLocaciones(locaciones,this.infousuario.locaciones);
              this.locacionSeleccionada = this.locaciones[0];
              this.seleccionarLocacion(this.locacionSeleccionada);
              //////////////////////////////////////// //console.log();
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

seleccionarLocacion(locacion:any){
  ////// //console.log('allbodegas',this.allbodegas);
  ////// //console.log('locacion',locacion);

  let bodegas_locacion = this.allbodegas.filter(bodega=> bodega.locacion2 === locacion.locacion);
  //console.log(bodegas_locacion);
  if(bodegas_locacion.length==0){
    //this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La locación ${locacion.label} no tiene bodegas asociadas`});
    //////////// //console.log(`La locación ${locacion.label} no tiene bodegas asociadas`);
  }else{
    ////////////////// //console.log(bodegas_locacion);
    this.bodegas = bodegas_locacion;
    this.bodegaSeleccionada = this.bodegas[0];
    this.seleccionarBodega(this.bodegaSeleccionada);
  }
  
}

seleccionarBodega(bodega:any){
  ////////////// //console.log(bodega);
 this.getInventario();
}

getInventario(){
  this.loading = true;
  this.pedidosService.getInventarioItenBodega()
      .subscribe({
          next:async (inventarios)=>{
            let inventariosBodegas = (await this.functionsService.objectToArray(inventarios)).filter((linea: { WhsCode: any; })=> linea.WhsCode === this.bodegaSeleccionada.WhsCode_Code);
            console.log(' this.bodegaSeleccionada', this.bodegaSeleccionada);
            console.log('inventariosBodegas',inventariosBodegas);
            let headersTabla = this.configHeaderTablaInventarioBodega();
            let dataTable = await this.configDataTablaInventarioBodega(inventariosBodegas);
            this.tablaInventarioBodega= {
              header:headersTabla,
              data:dataTable
            };

            this.loading = false;
          },
          error:(error)=>{
              console.error(error);
          }
      })
}

filter(event: any, arrayFiltrar:any[]) {

  //////////////////////////////////////////////////// //console.log((arrayFiltrar);
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

filtrarLocacion(event:any){
  this.locacionesFiltradas = this.filter(event,this.locaciones);
}

filtrarBodega(event:any){
  this.bodegasFiltradas = this.filter(event,this.bodegas);
}

   configHeaderTablaInventarioBodega() {
    let headersTable:any[] =  [{
      'ItemCode': {label:'Código Item',type:'text', sizeCol:'6rem', align:'center',field:"ItemCode"},
      'ItemName': {label:'Descripción Item',type:'text', sizeCol:'6rem', align:'center',field:"ItemName"},
      'TIPOPROD': {label:'Tipo producto',type:'text', sizeCol:'6rem', align:'center',field:"TIPOPROD"},
      'OnHand': {label:'Cantidad Bodega',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth",field:"OnHand"},
      'comprometido': {label:'Cantidad Comprometida',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth",field:"comprometido"},
      'disponible': {label:'Cantidad Disponible',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth",field:"disponible"},
      
      //'bgcolor': {label:'',type:'', sizeCol:'6rem', align:'center'}
      
    }];
   // // //console.log('headersTable',headersTable);

    return headersTable;
  }

  async configDataTablaInventarioBodega(pedidos:any[]):Promise<any>{
    let dataTable:any[] = [];
    for(let linea of pedidos){

      if(linea.ItemCode === 'OR2070000'){
        console.log(linea);

      }

      let comprometida$ =  this.pedidosService.getCantidadesComprometidasBodegaItem(linea.ItemCode,linea.WhsCode);
      let comprometida = await  lastValueFrom(comprometida$);

      dataTable.push({
    
        ItemCode:linea.ItemCode,
        ItemName:linea.ItemName,
        TIPOPROD:linea.TIPOPROD,
        OnHand:linea.OnHand,
        comprometido:comprometida,
        disponible:linea.OnHand-comprometida,

        //bgcolor:this.estadosTurno.find((estado: { name: any; })=>estado.name === linea.turnos_estado).backgroundColor
      });
    }

    return dataTable;

  }



  

}
