import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdenesCargueService } from 'src/app/demo/service/ordenes-cargue.service';
import { PedidosService } from 'src/app/demo/service/pedidos.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-turno',
  templateUrl: './form-turno.component.html',
  styleUrls: ['./form-turno.component.scss']
})
export class FormTurnoComponent implements  OnInit {

  ordenCargue: any;
  hoy:Date = new Date();

  cliente:string = '';
  localidad:string = '';
  fechacargue!:Date;
  horacargue!:Date;
  placa:string ='';
  tipo:string = '';
  cantidad:number = 0;
  conductor:string = '';
  telefono:string = '';
  celular:string = '';
  email:string = '';

  tablaPedidosTurno!: any;

  estados: any[] = [{ name: 'Pendiente', code: 'Pendiente' , label:'Pendiente'},
                    { name: 'Autorizado', code: 'Autorizado' , label:'Autorizado'},
                    { name: 'Arribo a cargue', code: 'Arribo a cargue' , label:'Arribo a cargue'},
                    { name: 'Incio cargue', code: 'Incio cargue' , label:'Incio cargue'},
                    { name: 'Fin cargue', code: 'Fin cargue' , label:'Fin cargue'},
                    { name: 'Cancelar', code: 'Canacelar' , label:'Canacelar'},];
  estadoSeleccionado:any = [];
  estadosFiltrados :any[]=[];

  pedidosTurno:any[] = [];

  constructor(private ordenesCargueService: OrdenesCargueService, 
              private solicitudTurnoService:SolicitudTurnoService,
              private pedidosService: PedidosService,
              public ref: DynamicDialogRef, 
              public config: DynamicDialogConfig) { }

  ngOnInit() {
    //let id = this.config.id
    console.log(this.config.data.id);
    this.configTablePedidosAlmacenCliente();
    this.getTurno(this.config.data.id)
  }

  async getTurno(id: number){
    
    //let orden = await this.ordenesCargueService.getOrdenesByID(id);
    this.solicitudTurnoService.getTurnosByID(id)
        .subscribe({
              next:async (turno)=>{
                  console.log(turno);
                  this.cliente = turno.detalle_solicitud_turnos_pedido[0].CardCode+' - '+turno.detalle_solicitud_turnos_pedido[0].CardName;
                  this.localidad = turno.locacion;
                  this.fechacargue = new Date(turno.fechacita);
                  this.horacargue = new Date(turno.horacita);
                  //this.horacargue = new Date();
                  this.placa = turno.vehiculo.placa;
                  this.tipo = turno.vehiculo.tipo_vehiculo.tipo;
                  this.cantidad = 0;
                  this.conductor = turno.conductor.cedula+' - '+turno.conductor.nombre;
                  this.estadoSeleccionado = this.estados.find(estado => estado.code == turno.estado);
                  this.pedidosTurno = await this.calcularDisponibilidadPedido(turno.detalle_solicitud_turnos_pedido);
                  
                  this.configTablePedidosAlmacenCliente();
              },
              error:(err)=>{
                console.error(err);


              }
        });


  }

  async calcularDisponibilidadPedido(pedidosTurno:any):Promise<any[]>{
    
    for(let pedido of pedidosTurno){
      console.log(pedido);
      let cantidadComprometida = 0;
      cantidadComprometida = await this.getCantidadComprometidaItemPedido(pedido.pedidonum,pedido.itemcode,pedido.bodega, pedido.id);
      pedido.comprometida= cantidadComprometida;
      pedido.cantidadbodega =0;
      pedido.disponible = (pedido.cantidadbodega-cantidadComprometida)<0?0:(pedido.cantidadbodega-cantidadComprometida);

    }

    return pedidosTurno
  }

  async getCantidadComprometidaItemPedido(pedido:any, itemcode:string, bodega:string, idPedido:number):Promise<number>{
    
    const cantidadComprometida$ = this.pedidosService.getCantidadesComprometidas(pedido,itemcode,bodega, idPedido);
    const cantidadComprometida = await lastValueFrom(cantidadComprometida$);
  
    return cantidadComprometida;
  
  
  }
  

  filtrarEstado(event:any){
    let estadosAfiltrar:any[] = [];
    for(let conductor of this.estados){
      estadosAfiltrar.push(conductor);
    }
    this.estadosFiltrados = this.filter(event,estadosAfiltrar);
    
  }

  seleccionarEstado(estado:any){

  }

  filter(event: any, arrayFiltrar:any[]) {

    ////console.log(arrayFiltrar);
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
    

  grabar(){
    console.log(this.horacargue);
  }

  cancelar(){
    this.ref.close();
  }


  configTablePedidosAlmacenCliente(){
    let headersTable:any= this.configHeadersPedidos();
    let dataTable:any = this.configDataTablePedidos(this.pedidosTurno);
    
    this.tablaPedidosTurno = {
      header: headersTable,
      data: dataTable
    }
  }

  configHeadersPedidos(){
    let headersTable:any[] = [
      {
        'index': { label:'',type:'', sizeCol:'0rem', align:'center', editable:false},
        'CardName': { label:'Cliente',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'docnum': { label:'Número pedido',type:'text', sizeCol:'6rem', align:'center', editable:false},
        //'cardname':{label:'Cliente',type:'text', sizeCol:'8rem', align:'left', editable:false}, 
        //'docdate': {label:'Fecha de contabilización',type:'date', sizeCol:'6rem',  align:'center', editable:false},
        //'duedate': {label:'Fecha de vencimiento',type:'date', sizeCol:'6rem', align:'center', editable:false},
        //'estado_doc': {label:'Estado pedido',type:'text', sizeCol:'6rem', align:'center'},
        //'estado_linea': {label:'Estado Linea',type:'text', sizeCol:'6rem', align:'center', visible:false,},
        
        //'dias': {label:'Dias',type:'number', sizeCol:'6rem', align:'center',visible:false,},
        'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',},
        'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'almacen': {label:'Almacen.',type:'text', sizeCol:'6rem', align:'center', editable:false},
        'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false},
        'comprometida': {label:'Cantidad comprometida',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false},
        'cantidadbodega': {label:'Cantidad en bodega',type:'number', sizeCol:'6rem', align:'center',currency:"TON", side:"rigth", editable:false},
        'disponible': {label:'Disponible para cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON", side:"rigth", editable:false},
        
        
      }];
      
      return headersTable;
  }
  
  configDataTablePedidos(arregloPedido:any){

      console.log(arregloPedido);

      let dataTable:any[] = [];
      let index:number = 0;
      for (let pedido of arregloPedido){
        let cantidadComprometida= 0;
        dataTable.push({
          index:pedido.id,
          CardName:pedido.CardName,
          docnum:pedido.pedidonum,
          itemcode:pedido.itemcode,
          itemname:pedido.itemname,
          almacen:pedido.bodega,
          cantidad:pedido.cantidad,
          comprometida:pedido.comprometida,
          cantidadbodega:pedido.cantidadbodega,
          disponible:pedido.disponible,
         
        });
        index++;
      } 
      
      return dataTable;
  }
  
  
  
  


}
