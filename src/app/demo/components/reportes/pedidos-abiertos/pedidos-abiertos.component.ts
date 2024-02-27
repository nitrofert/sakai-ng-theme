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
  selector: 'app-pedidos-abiertos',
   providers:[ConfirmationService,MessageService],
  templateUrl: './pedidos-abiertos.component.html',
  styleUrls: ['./pedidos-abiertos.component.scss']
})
export class PedidosAbiertosComponent implements  OnInit{

   
  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:true, delete_accion:false}];
  permisosModulo!:any[];

  tablaPedidos:any = {
    header:this.configHeaderTablaPedidos(),
    data:[],
    colsSum:[]
  };

  loading:boolean = false;

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
    this.getPedidos();

 
  }

  getPedidos(){
    this.loading = true;
    this.pedidosService.getSaldosPedidos()
        .subscribe({
            next:async (pedidos)=>{
              let pedidosAbiertos = await this.functionsService.objectToArray(pedidos);
              console.log('pedidosAbiertos',pedidosAbiertos);
              let headersTabla = this.configHeaderTablaPedidos();
              let dataTable = await this.configDataTablaPedidos(pedidosAbiertos);
              this.tablaPedidos= {
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

   configHeaderTablaPedidos() {
    let headersTable:any[] =  [{
      
      'TIPOPEDIDO': {label:'Tipo Pedido',type:'text', sizeCol:'6rem', align:'center',field:"TIPOPEDIDO"},
      'DocNum': {label:'Número Documento',type:'text', sizeCol:'6rem', align:'center',field:"DocNum"},
      'DocDate': {label:'Fecha Documento',type:'date', sizeCol:'6rem', align:'center',field:"DocDate"},
      'CardCode': {label:'Código Cliente',type:'text', sizeCol:'6rem', align:'center',field:"CardCode"},
      'CardName': {label:'Nombre Cliente',type:'text', sizeCol:'6rem', align:'center',field:"CardName"},
      'ItemCode': {label:'Código Item',type:'text', sizeCol:'6rem', align:'center',field:"ItemCode"},
      'Dscription': {label:'Descripción Item',type:'text', sizeCol:'6rem', align:'center',field:"Dscription"},
      'TIPOPROD': {label:'Tipo producto',type:'text', sizeCol:'6rem', align:'center',field:"TIPOPROD"},
      
      'Quantity': {label:'Cantidad pedido',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth",field:"Quantity"},
      'SALDO': {label:'Cantidad pendiente',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth",field:"SALDO"},
      'locacion2': {label:'Locación',type:'text', sizeCol:'6rem', align:'center',field:"locacion2"},
      'WhsName': {label:'Bodega',type:'text', sizeCol:'6rem', align:'center',field:"WhsName"},
      'DEPENDENCIA': {label:'Dependencia',type:'text', sizeCol:'6rem', align:'center',field:"DEPENDENCIA"},
      'LOCALIDAD': {label:'Localidad',type:'text', sizeCol:'6rem', align:'center',field:"LOCALIDAD"},
      'U_NF_CONDTRANS': {label:'Condición tpt',type:'text', sizeCol:'6rem', align:'center',field:"U_NF_CONDTRANS"},
      'SlpName': {label:'Agente Comercial',type:'text', sizeCol:'6rem', align:'center',field:"SlpName"},
      
      
      
      

      
      
      
      //'bgcolor': {label:'',type:'', sizeCol:'6rem', align:'center'}
      
    }];
   // // //console.log('headersTable',headersTable);

    return headersTable;
  }

  async configDataTablaPedidos(pedidos:any[]):Promise<any>{
    let dataTable:any[] = [];
    for(let linea of pedidos){
      dataTable.push({
    
        TIPOPEDIDO:linea.TIPOPEDIDO,
        DocNum:linea.DocNum,
        DocDate:new Date(linea.DocDate),
        CardCode:linea.CardCode,
        CardName:linea.CardName,
        ItemCode:linea.ItemCode,
        Dscription:linea.Dscription,
        TIPOPROD:linea.TIPOPROD,
        Quantity:linea.Quantity,
        SALDO:linea.SALDO,
        locacion2:linea.locacion2,
        WhsName:linea.WhsName,
        DEPENDENCIA:linea.DEPENDENCIA,
        LOCALIDAD:linea.LOCALIDAD,
        U_NF_CONDTRANS:linea.U_NF_CONDTRANS,
        SlpName:linea.SlpName,







        //bgcolor:this.estadosTurno.find((estado: { name: any; })=>estado.name === linea.turnos_estado).backgroundColor
      });
    }

    return dataTable;

  }

}
