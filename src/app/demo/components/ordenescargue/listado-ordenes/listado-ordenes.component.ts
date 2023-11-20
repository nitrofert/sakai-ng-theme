import { Component, OnInit } from '@angular/core';
import { OrdenesCargueService } from 'src/app/demo/service/ordenes-cargue.service';

@Component({
  selector: 'app-listado-ordenes',
  templateUrl: './listado-ordenes.component.html',
  styleUrls: ['./listado-ordenes.component.scss']
})
export class ListadoOrdenesComponent implements OnInit {

  tablaListadoOrdenesCargue!:any;
  ordenes:any[] = [];


  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];

  constructor(private ordenesCargueService : OrdenesCargueService){}

  ngOnInit(): void {
    this.configTable();
    this.getOrdenes();
  }

  getOrdenes(){
    this.ordenesCargueService.getOrdenes().then(ordenes => {
      this.ordenes = ordenes;
      //////console.log(this.pedidos);
      this.configTable();
    });
  }

  nuevaSolicitud(event: any){
    //////console.log(event);
  }

  configTable(){

   let headersTable:any[] = [
      {
        'id':{ label:'Orden', type:'',sizeCol:'6rem',align:'center'}, 
        'fechacargue': {label:'Fecha Orden',type:'date', sizeCol:'6rem', align:'center'}, 
        'horacargue': {label:'Hora cita',type:'text', sizeCol:'6rem', align:'center'},
        'cliente': {label:'Cliente',type:'text',sizeCol:'6rem', align:'left'}, 
        'vehiculo': {label:'Vehículo',type:'text', sizeCol:'6rem', align:'center'},
        'conductor': {label:'Conductor',type:'numeric', sizeCol:'6rem', align:'left'},
        'pedido': {label:'Pedido',type:'text', sizeCol:'6rem', align:'center'},
        'item': {label:'Item',type:'text', sizeCol:'6rem', align:'left'},
        'almacen':{label:'Almacen',type:'text', sizeCol:'6rem', align:'center'},
        'toneladas': {label:'Cantidad toneladas',type:'numeric', sizeCol:'6rem', align:'right',currency:"TON"}
      }
    ];
    let dataTable:any[] = [];
    for(let orden of this.ordenes){
      dataTable.push({
        'id':orden.id, 
        'fechacargue':orden.fechacargue , 
        'horacargue': orden.horacargue,
        'cliente':orden.cliente+' - '+orden.cliente_nombre , 
        'vehiculo': orden.placa,
        'conductor':orden.conductor+' - '+orden.conductor_nombre,
        'pedido': orden.pedido,
        'item': orden.itemcode+' - '+orden.itemname,
        'almacen':orden.almacen,
        'toneladas':orden.cantidad 
      });
    }

    this.tablaListadoOrdenesCargue = {
      headers:headersTable,
      data:dataTable
    }

  }

}
