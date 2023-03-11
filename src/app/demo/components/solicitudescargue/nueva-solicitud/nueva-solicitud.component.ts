import { ChangeDetectorRef, Component, OnInit, Pipe } from '@angular/core';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { PedidosService } from 'src/app/demo/service/pedidos.service';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import {TreeNode} from 'primeng/api';
import { NodeService } from 'src/app/demo/service/node.service';
import { VehiculosService } from 'src/app/demo/service/vehiculos.service';
import { ConductoresService } from 'src/app/demo/service/conductores.service';
import { OrdenesCargueService } from 'src/app/demo/service/ordenes-cargue.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FormVehiculoComponent } from '../../vehiculos/form-vehiculo/form-vehiculo.component';
import { FormConductorComponent } from '../../conductores/form-conductor/form-conductor.component';
import { TransportadorasService } from 'src/app/demo/service/transportadoras.service';
import { FormTransportadoraComponent } from '../../transportadoras/form-transportadora/form-transportadora.component';

@Component({
selector: 'app-nueva-solicitud',
providers:[ConfirmationService,MessageService],
templateUrl: './nueva-solicitud.component.html',
styleUrls: ['./nueva-solicitud.component.scss']
})
export class NuevaSolicitudComponent implements OnInit {  


clientes:any[] = [];
clienteSeleccionado: any = [];
clientesFiltrados : any[] = [];


clienteSeleccionado2: any = [];
clientesFiltrados2 : any[] = [];


pedidosCliente: any[] = [];
almacenesPedidosCliente: any[] = [];
pedidosAlmacenCliente : any[] =[];

pedidosEnSolicitud: any[] = []; 

almacenes: any[] = [];
almacenSeleccionado:any = [];
almacenesFiltrados :any[]=[];

tablaPedidosAlmacenCliente!: any;
tablaPedidosEnSolicitud!: any;
showItemsSelectedPedidosAlmacenCliente:boolean=false;

vehiculos:any[] = [];
vehiculoSeleccionado:any = [];
vehiculosFiltrados:any[] = [];

transportadoras:any[] = [];
transportadoraSeleccionada:any = [];
transportadorasFiltrados:any[] = [];

conductores:any[] = [];
conductorSeleccionado:any = [];
conductoresFiltrados:any[] = [];

vehiculosPedidos:TreeNode[] =[];
vehiculosSeleccionados:TreeNode[] = [];

vehiculosEnSolicitud:any[] = [];



pedidos:any[] = [];

dialogPedidosCliente:boolean = false;
dialogCargueVehiculoPedido:boolean = false;

permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];
cols: any[] = [];

comboPedidos:any[] = [];
pedidoSeleccionado: any = [];
pedidosFiltrados:any[] = [];

cantidadCargue:number =0;
capacidadVehiculo:number =0;
capacidadDisponibleVehiculo:number =0;

fechacargue:Date = new Date();
hoy:Date = new Date();
horacargue:Date = new Date();
inicioDia:Date = new Date();

detalleSolictudCargue:any[] = [];

activeStateTabs:boolean[] = [true, false, false];

envioLineaCarguePedido:boolean = false;

//Esta condicion viene dada por el rol/permiso del usuario   Cliente:RETIRA  Transporta Sociedad: TRANSP
condicion_tpt:string = "";
multiplesClientes:boolean = false;

sitioentrega:string="";


constructor(private pedidosService: PedidosService,
            private almacenesService: AlmacenesService,
            private messageService: MessageService,
            private nodeService: NodeService,
            private vehiculosService:VehiculosService,
            private conductoresService:ConductoresService,
            private confirmationService: ConfirmationService,
            private ordenesCargueService: OrdenesCargueService,
            private transportadorasService:TransportadorasService,
            public dialogService: DialogService){}

async  ngOnInit(){

  this.getClientes();
  this.getAlmacenes(); 
  this.getPedidos();
  this.getVehiculos();
  this.getConductores();
  this.getTransportadoras();
  this.configTablePedidosAlmacenCliente();
  this.configTablaPedidosEnSolicitud();

  this.inicioDia.setHours(0,0,0);

  //Esta condicion viene dada por el rol/permiso del usuario   Cliente:RETIRA  Transporta Sociedad: TRANSP
  this.condicion_tpt="RETIRA";
  this.multiplesClientes = true; // true o false depende si es TRANSP o RETIRA

  //this.pedidosService.getVehiculosPedido().then(vehiculos => this.vehiculosPedidos = vehiculos);
  //this.vehiculosPedidos = await this.pedidosService.getVehiculosPedido();
  this.cols = [
    { field: 'vehiculo', header: 'Vehiculo' },
    { field: 'conductor', header: 'Conductor/Pedido' },
    { field: 'fechacargue', header: 'Fecha - Hora Cargue/Item' },
    { field: 'cantidadcrg', header: 'Toneladas cargadas' }
  ];


  

}

getClientes(){
this.clientes = [
  { name: 'C.I.TECNICAS BALTIME DE COLOMBIA S.A.', code: 'CN890918965' , label:'CN890918965 - C.I.TECNICAS BALTIME DE COLOMBIA S.A.'},
  { name: 'COOPERATIVA DE PRODUCTOS LACTEOS NARIÑO LTDA', code: 'CN891201294', label:'CN891201294 - COOPERATIVA DE PRODUCTOS LACTEOS NARIÑO LTDA'},
  { name: 'AGRICO DISTRIBUIDORA Y CONSTRUCTORA SAS', code: 'CN901584196', label:'CN901584196 - AGRICO DISTRIBUIDORA Y CONSTRUCTORA SAS' }
];
}

getPedidos(){
this.pedidosService.getPedidos().then(pedidos => {
  this.pedidos = pedidos;
  ////console.log(this.pedidos);
});
}

getAlmacenes(){
this.almacenesService.getAlmacenes().then(almacenes => {
  this.almacenes = almacenes;
  //console.log(this.almacenes);
}); 
}

getVehiculos(){
  this.vehiculosService.getVehiculos()
      .subscribe({
        next: (vehiculos)=>{
            console.log(vehiculos);
            for(let vehiculo of vehiculos){
              vehiculo.code = vehiculo.placa;
              vehiculo.name = vehiculo.placa;
              vehiculo.label = vehiculo.placa;
              vehiculo.clase = vehiculo.tipo_vehiculo;
            }
            //console.log(conductores);
            this.vehiculos = vehiculos;
        },
        error: (err)=>{
           console.error(err);
        }
    
  });
}

getTransportadoras(){
  this.transportadorasService.getTransportadoras()
  .subscribe({
      next: (transportadoras)=>{
          //Adicionar campos requeridos para autocmplete y dropdwons
          for(let transportadora of transportadoras){
            transportadora.code = transportadora.code;
            transportadora.name = transportadora.nombre;
            transportadora.label = transportadora.nit+' - '+transportadora.nombre;
          }
          //console.log(conductores);
          this.transportadoras = transportadoras;
      },
      error: (err)=>{
        console.error(err);
      }
  }); 
}

getConductores(){
  this.conductoresService.getConductores2()
      .subscribe({
          next: (conductores)=>{
              //Adicionar campos requeridos para autocmplete y dropdwons
              for(let conductor of conductores){
                conductor.code = conductor.cedula;
                conductor.name = conductor.nombre;
                conductor.label = conductor.cedula+' - '+conductor.nombre;
              }
              //console.log(conductores);
              this.conductores = conductores;
          },
          error: (err)=>{
            console.error(err);
          }
      });
}


filtrarCliente(event: any) {
this.clientesFiltrados = this.filter(event,this.clientes);
}

filtrarCliente2(event: any) {
  this.clientesFiltrados2 = this.filter(event,this.clienteSeleccionado);
}

  seleccionarCliente2(clienteSeleccionado2:any){
      console.log(clienteSeleccionado2, this.almacenSeleccionado)
      this.getPedidosClientePorAlmacen(this.almacenSeleccionado.code, clienteSeleccionado2.code)
  }   

seleccionarCliente(clienteSeleccionado:any){
  console.log(clienteSeleccionado);
  //this.getPedidosPorCliente(clienteSeleccionado.code);
  /*console.log(this.almacenSeleccionado);
  if(!this.almacenSeleccionado || this.almacenSeleccionado.length ==0){
    this.getPedidosPorCliente(clienteSeleccionado);
  }else{
    
    this.confirmAdicionCliente(clienteSeleccionado);
  }*/
  this.getPedidosPorCliente(clienteSeleccionado);
  this.almacenSeleccionado = [];
  this.vehiculosEnSolicitud = [];
  this.generarTreeTable();
  this.toggle(1);
}

 confirmAdicionCliente(clienteSeleccionado:any) {
  this.confirmationService.confirm({
      message: 'Esta agregando un nuevo cliente a la solicitud y tiene seleccionad una locación, por lo tanto se modificara la selección de las locaciones y se borraran los vhiculos y pedidos seleccionados previamente. ¿Desea continuar?',
      header: 'Confirmatción',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.getPedidosPorCliente(clienteSeleccionado);
          this.almacenSeleccionado = [];
          this.generarTreeTable();
          //console.log(this.tablaPedidosAlmacenCliente);

      },
      reject: async (type: any) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  //this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
                  
              break;
              case ConfirmEventType.CANCEL:
                  //this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
                  
              break;
          }
          this.clienteSeleccionado.pop();
          console.log(this.clienteSeleccionado);
          this.getPedidosPorCliente(clienteSeleccionado);
      }
  });
}


async getPedidosPorCliente(clientesSeleccionados:any){
    
    this.pedidosCliente = await this.pedidosService.getPedidosPorCliente(clientesSeleccionados, this.condicion_tpt);
    //console.log(this.pedidosCliente);
    this.getAlmacenesEnPedidos();
}

getAlmacenesEnPedidos(){
    let almacenesPedidosCliente: any[] = [];
    for(let pedido of this.pedidosCliente){
      
      if(almacenesPedidosCliente.filter(almacenPedido => almacenPedido.name == pedido.locacion).length===0){
        //TODO: Buscar datos del almacen en array de almacenes
        
        if(this.almacenes.filter(almacen => almacen.tipo == pedido.locacion).length>0){
          let informacionAlmacen:any = this.almacenes.filter(almacen => almacen.tipo == pedido.locacion)[0];
          informacionAlmacen.label = informacionAlmacen.name+' - Zona: '+informacionAlmacen.state_name+ ' ('+informacionAlmacen.code+')';
          //almacenesPedidosCliente.push(informacionAlmacen);
          almacenesPedidosCliente.push({
            code:informacionAlmacen.tipo,
            name:informacionAlmacen.tipo,
            label: informacionAlmacen.tipo+' - Zona: '+informacionAlmacen.state_name+ ' ('+informacionAlmacen.state_code+')'
          });
        }
      }
    }
    this.almacenesPedidosCliente = almacenesPedidosCliente;

}

filtrarAlmacen(event:any){
this.almacenesFiltrados = this.filter(event,this.almacenesPedidosCliente);
}

seleccionarAlmacen(almacenSeleccionado:any){
 
  //this.getPedidosClientePorAlmacen(almacenSeleccionado.code);
}

cambioAlmacen(){
  this.vehiculosEnSolicitud = [];
  this.generarTreeTable();
}

async getPedidosClientePorAlmacen(almacen:string,cliente?:string){
  //this.pedidosAlmacenCliente = await this.pedidosService.getPedidosClientePorAlmacen(this.clienteSeleccionado, almacen);
  this.pedidosAlmacenCliente = await this.pedidosCliente.filter(pedido => pedido.locacion === almacen && pedido.cardcode === cliente)
  ///console.log(this.pedidosAlmacenCliente);
  this.pedidosAlmacenCliente = await this.calcularCantidadesComprometidas(this.pedidosAlmacenCliente);

  console.log(this.pedidosAlmacenCliente);
  
  this.configTablePedidosAlmacenCliente();
}

async calcularCantidadesComprometidas(pedidos:any):Promise<any[]>{
  let cantidadComprometida=0;
  for(let pedido of pedidos){
     
    cantidadComprometida = await this.getCantidadComprometidaItemPedido(pedido.docnum,pedido.itemcode);
    pedido.comprometida = cantidadComprometida;
  }

  return pedidos;
}

async getCantidadComprometidaItemPedido(pedido:any, itemcode:string):Promise<number>{
      
  let ordenesConPedidoItem = await this.ordenesCargueService.getOrdenesPedidoItem(pedido,itemcode);
  //Cantidad comprometida en ordenes
  let cantidadComprometida:number =0;
  for(let orden of ordenesConPedidoItem){
    cantidadComprometida+=eval(orden.cantidad);
  }
  //Cantidad comprometida en esta solicitud
  for(let veiculo of this.vehiculosEnSolicitud){
    
    for(let orden of veiculo.pedidos){
      if(orden.pedido == pedido && orden.itemcode == itemcode){
        cantidadComprometida+= eval(orden.cantidad);
      }
    }
    
    
  }

  return cantidadComprometida;

}

configTablePedidosAlmacenCliente(){
  let headersTable:any= this.configHeadersPedidos();
  let dataTable:any = this.configDataTablePedidos(this.pedidosAlmacenCliente);
  
  this.tablaPedidosAlmacenCliente = {
    header: headersTable,
    data: dataTable
  }

  //console.log(this.tablaPedidosAlmacenCliente);

}

adicionarVehiculo(){
  
  if(Object.keys(this.almacenSeleccionado).length >0){
    this.dialogCargueVehiculoPedido = true;
    this.resetearForm();
  }else{
    this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Primero debe seleccionar el almacen de donde realizará el retiro de los productos'});
  }
}

filtrarVehiculo(event:any){
  //TODO: quitar del listado de vehiculos los vehiculos que ya esten asociados a la solicitud en curso
  
  let vehiculosAfiltrar:any[] = [];
  for(let vehiculo of this.vehiculos){
    if(this.vehiculosEnSolicitud.filter(vehiculoSolicitud =>vehiculoSolicitud.placa == vehiculo.code).length == 0){
      vehiculosAfiltrar.push(vehiculo);
    }
  }
  this.vehiculosFiltrados = this.filter(event,vehiculosAfiltrar);
  this.vehiculosFiltrados.unshift({
    id:0, code: "Nuevo", name: "Nuevo", label:"+ Nuevo vehículo"
  });
  //console.log(this.vehiculosFiltrados);
}

filtrarConductor(event:any){
  let conductoresAfiltrar:any[] = [];
  for(let conductor of this.conductores){
    if(this.vehiculosEnSolicitud.filter(vehiculoSolicitud =>vehiculoSolicitud.conductor == conductor.code).length == 0){
      conductoresAfiltrar.push(conductor);
    }
  }
  this.conductoresFiltrados = this.filter(event,conductoresAfiltrar);
  this.conductoresFiltrados.unshift({
    id:0, code: "Nuevo", name: "Nuevo", label:"+ Nuevo conductor"
  });
}

filtrarTransportadora(event:any){
  let transportadorasAfiltrar:any[] = [];
  for(let transportadora of this.transportadoras){
      transportadorasAfiltrar.push(transportadora);
  }
  this.transportadorasFiltrados = this.filter(event,transportadorasAfiltrar);
  this.transportadorasFiltrados.unshift({
    id:0, code: "Nuevo", name: "Nuevo", label:"+ Nueva transportadora"
  });
}

seleccionarTransportadora(transportadoraSeleccionada:any){
  if(transportadoraSeleccionada.id == 0){
    //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
    this.nuevaTransportadora();
  }else{
  }
}

async seleccionarVehiculo(vehiculoSeleccionado:any){

  if(vehiculoSeleccionado.id == 0){
      //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
      this.nuevoVehiculo();
  }else{
      console.log(vehiculoSeleccionado)
      this.capacidadVehiculo = vehiculoSeleccionado.capacidad;
      //Verificar si el vehiculo esta asociado a la solicitud actual y calcula la capacidad disponible
      let capacidaVh = await this.cacluarCapacidadDisponibleVH(vehiculoSeleccionado.code); 
      //console.log(this.capacidadVehiculo,capacidaVh);
      this.capacidadDisponibleVehiculo = this.capacidadVehiculo - capacidaVh;
      

      //Verificar si el conductor asociado al vehiculo seleccionado existe en conductores
      //let conductor = this.conductores.find(conductor => conductor.code === vehiculoSeleccionado.conductor);
      //if(conductor != undefined) this.conductorSeleccionado = conductor;
  }

}

nuevaTransportadora(){
  const ref = this.dialogService.open(FormTransportadoraComponent, {
    data: {
        id: parseInt('1')
    },
    header: `Nueva transportadora` ,
    width: '70%',
    height:'auto',
    contentStyle: {"overflow": "auto"},
    maximizable:true, 
  });

  ref.onClose.subscribe(() => {
    this.getTransportadoras();
    //console.log("Refresh calendar");
  });
}

nuevoVehiculo(){
  const ref = this.dialogService.open(FormVehiculoComponent, {
    data: {
        id: parseInt('1')
    },
    header: `Nuevo Vehículo` ,
    width: '70%',
    height:'auto',
    contentStyle: {"overflow": "auto"},
    maximizable:true, 
  });

  ref.onClose.subscribe(() => {
    this.getVehiculos();
    //console.log("Refresh calendar");
  });
}

nuevoConductor(){
  const ref = this.dialogService.open(FormConductorComponent, {
    data: {
        id: parseInt('1')
    },
    header: `Nuevo Conductor` ,
    width: '70%',
    height:'auto',
    contentStyle: {"overflow": "auto"},
    maximizable:true, 
  });

  ref.onClose.subscribe(() => {
    this.getConductores();
    //console.log("Refresh calendar");
  });
}

seleccionarConductor(conductorSeleccionado:any){
  console.log(conductorSeleccionado)
  if(conductorSeleccionado.id == 0){
    //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
    this.nuevoConductor();
  }
}

async adicionVehiculoSolicitud(){
  this.envioLineaCarguePedido =true;
  console.log(this.sitioentrega,Object.keys(this.vehiculoSeleccionado).length,Object.keys(this.conductorSeleccionado).length, Object.keys(this.transportadoraSeleccionada).length);
  if(Object.keys(this.vehiculoSeleccionado).length ==0 || 
     Object.keys(this.conductorSeleccionado).length ==0 ||
     Object.keys(this.transportadoraSeleccionada).length ==0 ||
     this.sitioentrega==""){
      this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los campos resaltados en rojo son obligatorios'});
  }else{
    this.vehiculosEnSolicitud.push({
        fechacargue:this.fechacargue,
        horacargue:this.horacargue,
        cliente: this.clienteSeleccionado.code,
        estado: "pendiente",
        placa:this.vehiculoSeleccionado.code,
        capacidadvh:this.vehiculoSeleccionado.capacidad,
        conductor:this.conductorSeleccionado.code,
        conductor_nombre:this.conductorSeleccionado.name,
        cantidad:0,
        transportadora:this.transportadoraSeleccionada.code,
        sitioentrega:this.sitioentrega,
        pedidos:[]
    });
    this.envioLineaCarguePedido =false;
    this.dialogCargueVehiculoPedido= false;
    this.resetearForm();
    //this.pedidosAlmacenCliente = await this.calcularCantidadesComprometidas(this.pedidosAlmacenCliente);
    //this.configTablePedidosAlmacenCliente();
    this.generarTreeTable();
  }
}

resetearForm(){
  this.vehiculoSeleccionado = [];
  this.conductorSeleccionado = [];
  this.transportadoraSeleccionada = [];
  //this.pedidoSeleccionado = [];
  //this.cantidadCargue = 0;
  this.fechacargue = new Date();
  this.horacargue = new Date();
}

generarTreeTable(){

  let vehiculos :any[] = [];
  

  for(let solicitud of this.vehiculosEnSolicitud){
    //console.log(solicitud);
    let fechacargue = new Date(solicitud.fechacargue);
    let horacargue = new Date(solicitud.horacargue);
    let data = {
                    "data":{
                          vehiculo:solicitud.placa,
                          conductor:solicitud.conductor+' - '+solicitud.conductor_nombre,
                          fechacargue:fechacargue.toLocaleDateString()+' '+horacargue.toLocaleTimeString(),
                          cantidadcrg:solicitud.cantidad
                    },
                    "children":[]
            }
    if(solicitud.pedidos.length>0){
      let children:any = [];
      for(let pedido of solicitud.pedidos){
        children.push(
          {
            "data":{
                    vehiculo:solicitud.placa,
                    conductor:pedido.pedido,
                    fechacargue:pedido.itemcode+' - '+pedido.itemname,
                    cantidadcrg:pedido.cantidad
                }
          }
        );
      }
      data.children = children;
    }
    vehiculos.push(data);
  }



  let datatabletree2: any = {
    "data":vehiculos
  }
  
  this.vehiculosPedidos = datatabletree2.data as TreeNode[];
////console.log(this.vehiculosPedidos);
  
}

async adicionarItemPedido(placa:string){
  ////console.log(placa);
  let vehiculo = await this.vehiculos.find(vehiculo =>vehiculo.code === placa);
  this.vehiculoSeleccionado = vehiculo;
  let clienteSeleccionado:any;
  if(Object.prototype.toString.call(this.clienteSeleccionado) === '[object Array]'){
    clienteSeleccionado = this.clienteSeleccionado[0];
  }else{
    clienteSeleccionado = this.clienteSeleccionado;
  }
  console.log(this.clienteSeleccionado[0])
  this.clienteSeleccionado2 = await clienteSeleccionado;

  await this.seleccionarVehiculo(this.vehiculoSeleccionado);
  //this.envioLineaCarguePedido = true;
  
  //let capacidadDisponibleVh = await this.cacluarCapacidadDisponibleVH(placa);
  //this.capacidadDisponibleVehiculo = this.capacidadVehiculo- capacidadDisponibleVh;
  

  this.getPedidosClientePorAlmacen(this.almacenSeleccionado.code,clienteSeleccionado.code);

  /*let pedidosVehiculo = await this.vehiculosEnSolicitud.find(vehiculo =>vehiculo.placa == placa).pedidos;
  //console.log(pedidosVehiculo);
  //Modificar pedidos del cliente x almacen adicionando las cantidades cargadas de los pedidos asociadas al vehiculo 

  for(let pedidoVehiculo of pedidosVehiculo){
    let index = this.tablaPedidosAlmacenCliente.data.findIndex((pedido: {itemcode: any; docnum: any; }) => pedido.docnum == pedidoVehiculo.pedido && pedido.itemcode == pedidoVehiculo.itemcode);
    //console.log(this.tablaPedidosAlmacenCliente.data[index].cargada,pedidoVehiculo.cantidad);
    this.tablaPedidosAlmacenCliente.data[index].cargada = pedidoVehiculo.cantidad;
  }*/
  
  this.dialogPedidosCliente = true;
}

async cacluarCapacidadDisponibleVH(placa:string):Promise<number>{
  let capacidadDisponibleVH = 0;
  let vehiculo:any = this.vehiculosEnSolicitud.filter(pedido =>pedido.placa == placa);
  //console.log(vehiculo.length);
  if(vehiculo.length >0){
    capacidadDisponibleVH =vehiculo[0].cantidad
  }
 
  /*for(let pedido of pedidosVehiculo){
    capacidadDisponibleVH+=pedido.cantidad;
  }*/
  //console.log(capacidadDisponibleVH);
  return capacidadDisponibleVH;
}

confirmarSeleccionPedidosAlmacenCliente(){
  this.showItemsSelectedPedidosAlmacenCliente=true;
  
  //this.dialogPedidosCliente = false;
}


async seleccionarPedidosAlmacenCliente(event:any){
 
  //console.log(event);
  let pedidosSeleccionados = event;
  
  if(pedidosSeleccionados.length==0){
    this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe seleccionar al menos un pedido - Item'});
  }else if(pedidosSeleccionados.some((pedido: { cargada: number; }) => pedido.cargada <= 0)){
    this.messageService.add({severity:'error', summary: '!Error¡', detail: 'De los pedidos seleccionados, al menos uno, en la columna de cantidad a cargar es menor o igual a cero (0)'});
  }else if(await this.validarCantidadesCargadas(pedidosSeleccionados) >this.capacidadDisponibleVehiculo){
    this.messageService.add({severity:'error', summary: '!Error¡', detail: 'La sumatoria total de la cantidad a cargar no puede ser mayor a la cantidad disponible del vehiculo'});
  }else if(await this.validarCantidadesCargadasPorPedido(pedidosSeleccionados)){
    //this.messageService.add({severity:'error', summary: '!Error¡', detail: 'La sumatoria total de la cantidad a cargar no puede ser mayor a la cantidad disponible del vehiculo'});
  }else{
      //Asignar pedidos al vehiculo
      let index = this.vehiculosEnSolicitud.findIndex(vehiculo => vehiculo.placa == this.vehiculoSeleccionado.code);


      let pdidosVehiculo:any = this.vehiculosEnSolicitud[index].pedidos;
      let cantidadCargada =0;
      for(let pedido of pedidosSeleccionados){

        //console.log(pdidosVehiculo,pedido);
        if(pdidosVehiculo.length >0 && pdidosVehiculo.find((pedidovh: { pedido: any, itemcode:any }) => pedidovh.pedido == pedido.docnum && pedidovh.itemcode == pedido.itemcode)!=undefined){
          let indexPedido = pdidosVehiculo.findIndex((pedidovh: { pedido: any, itemcode:any }) => pedidovh.pedido == pedido.docnum && pedidovh.itemcode == pedido.itemcode);
          pdidosVehiculo[indexPedido].cantidad = pedido.cargada;
        }else{
              pdidosVehiculo.push({

                    pedido:pedido.docnum,
                    itemcode:pedido.itemcode,
                    itemname:pedido.itemname,
                    cantidad:pedido.cargada
              });
        }

        
        cantidadCargada+=eval(pedido.cargada);
      }

      
      ////console.log(index);
      this.vehiculosEnSolicitud[index].cantidad = await this.cantidadCargaVehiculo(this.vehiculoSeleccionado.code);
      this.vehiculosEnSolicitud[index].pedidos = pdidosVehiculo;
      this.dialogPedidosCliente = false;
      this.pedidosAlmacenCliente = await this.calcularCantidadesComprometidas(this.pedidosAlmacenCliente);
      this.configTablePedidosAlmacenCliente();
      this.generarTreeTable();
      
  }
  this.showItemsSelectedPedidosAlmacenCliente=false;
  
  
  
  /*this.pedidosEnSolicitud = [];
  this.pedidosEnSolicitud = event;

  this.pedidosEnSolicitud = await this.calcularCantidadesComprometidas(this.pedidosEnSolicitud);

  //console.log(this.pedidosEnSolicitud);

  this.configTablaPedidosEnSolicitud();
  this.showItemsSelectedPedidosAlmacenCliente=false;
  this.configComboSeleccionPedido();
  this.toggle(2);*/
}

async cantidadCargaVehiculo(placa:string):Promise<number>{
  let cantidadCargada =0;
  let vehiculo = this.vehiculosEnSolicitud.find(vehiculo =>vehiculo.placa == placa);
  for(let pedidoVehiculo of vehiculo.pedidos){
    cantidadCargada+=eval(pedidoVehiculo.cantidad);
  }
  return cantidadCargada;
}

async validarCantidadesCargadas(pedidos:any):Promise<number>{
  let cantidadCargada =0;
  console.log(pedidos);
  for(let pedido of pedidos){
    
    cantidadCargada+=eval(pedido.cargada);
    
  }
  //console.log(cantidadCargada);
  return  cantidadCargada;
}

async validarCantidadesCargadasPorPedido(pedidos:any):Promise<boolean>{
  let error = false;
  for(let pedido of pedidos){
    
   
    if(pedido.cargada>pedido.disponible){
      this.messageService.add({severity:'error', summary: '!Error¡', detail: `La cantidad a cargar de la linea ${pedido.index} supera la cantidad disponible del pedido: ${pedido.docnum} - item: ${pedido.itemcode} - ${pedido.itemname} `});
      error = true;
    }
  }
  return  error;
}



quitarVehiculo(placa:string){
  //console.log(placa);
  this.confirmRemoveVehiculo(placa);
}

quitarRegistro(placa:string,pedido:string,item:string){
  //console.log(placa,item);
  this.confirmRemovePedidoItem(placa,pedido,item);
}

confirmRemoveVehiculo(placa:string) {
  this.confirmationService.confirm({
      message: 'Esta seguro de proceder con la eliminación del vehículo '+placa+', recuerde que los pedidos y productos asociados, tmabien seran elimnados de la lista?',
      header: 'Confirmatción',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          let index = this.vehiculosEnSolicitud.findIndex(vehiculo => vehiculo.placa == placa);
          this.vehiculosEnSolicitud.splice(index,1);
          this.messageService.add({severity:'info', summary:'Confirmado', detail:'El vhículo '+placa+' fue eliminado de la lista'});
          //console.log(this.vehiculosEnSolicitud);
          this.generarTreeTable();
          //console.log(this.tablaPedidosAlmacenCliente);

      },
      reject: (type: any) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  //this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                  //this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
  });
}

confirmRemovePedidoItem(placa:string,pedido:string,item:string) {
  this.confirmationService.confirm({
      message: 'Esta seguro de proceder con la eliminación del item '+item+' asociado al vehículo de placas '+placa+'?',
      header: 'Confirmatción',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          let index = this.vehiculosEnSolicitud.findIndex(vehiculo => vehiculo.placa == placa);
          let pedidos = this.vehiculosEnSolicitud[index].pedidos;
          
          let indexPedido = pedidos.findIndex((pedidovh: { pedido: string; itemcode: string; itemname: string; }) => pedidovh.pedido==pedido && pedidovh.itemcode+' - '+pedidovh.itemname == item);
          console.log(this.vehiculosEnSolicitud[index].pedidos,indexPedido);
          this.vehiculosEnSolicitud[index].cantidad =this.vehiculosEnSolicitud[index].cantidad-eval(this.vehiculosEnSolicitud[index].pedidos[indexPedido].cantidad);
          this.vehiculosEnSolicitud[index].pedidos.splice(indexPedido,1);
          this.messageService.add({severity:'info', summary:'Confirmado', detail:'El item '+item+' fue eliminado de la lista'});
          //console.log(this.vehiculosEnSolicitud);
          this.generarTreeTable();
          //console.log(this.tablaPedidosAlmacenCliente);

      },
      reject: (type: any) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  //this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                  //this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
  });
}

grabarSolicitud(){
  ////console.log(event);
}


toggle(index: number) {
  this.activeStateTabs[index] = !this.activeStateTabs[index]?true:true;

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

configHeadersPedidos(){
  let headersTable:any[] = [
    {
      'index': { label:'',type:'', sizeCol:'0rem', align:'center', editable:false},
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
      'cantidad': {label:'Cantidad pedido',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false},
      
      'pendiente': {label:'Cantidad pendiente',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false},
      'comprometida': {label:'Cantidad comprometida',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false},
      'disponible': {label:'Cantidad disponible',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false},
      'cargada': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:true},
      
    }];
    
    return headersTable;
}

configDataTablePedidos(arregloPedido:any){
    let dataTable:any[] = [];
    let index:number = 0;
    for (let pedido of arregloPedido){
      let cantidadComprometida= 0;
      dataTable.push({
        index,
        docnum:pedido.docnum,
        //cardname:pedido.cardname,
        //docdate:pedido.docdate,
        //duedate:pedido.duedate,
        //estado_doc:pedido.estado_doc,
        //estado_linea:pedido.estado_linea,
        //dias:pedido.dias,
        itemcode:pedido.itemcode,
        itemname:pedido.itemname,
        almacen:pedido.codigo_almacen,
        cantidad:pedido.cantidad,
        pendiente:pedido.pendiente,
        comprometida:pedido.comprometida,
        disponible:(pedido.pendiente-pedido.comprometida),
        cargada:0
      });
      index++;
    } 
    
    return dataTable;
}


/****** Deprecated */

configTablaPedidosEnSolicitud(){
  let headersTable:any=this.configHeadersPedidos();
  let dataTable:any = this.configDataTablePedidos(this.pedidosEnSolicitud);
    
  this.tablaPedidosEnSolicitud = {
      header: headersTable,
      data: dataTable
  }
  
    //console.log(this.tablaPedidosEnSolicitud);
  
}

adicionarPedido(event:any){
  //console.log(event);
  if(this.tablaPedidosAlmacenCliente.data.length>0){
    this.dialogPedidosCliente = event;
  }else{
    this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Primero debe seleccionar el almacen de donde se hará el retiro de o los pedidos'});
  }
  
}

configComboSeleccionPedido(){
  let comboPedidos:any[] = [];
  for(let pedidoSolicitud of this.pedidosEnSolicitud){
    
    comboPedidos.push({
      code:pedidoSolicitud.index,
      name:pedidoSolicitud.docnum,
      label:pedidoSolicitud.docnum+' - '+pedidoSolicitud.itemcode+' - '+pedidoSolicitud.itemname+' - Disponible:'+pedidoSolicitud.disponible+' TON', 
      itemcode:pedidoSolicitud.itemcode,
      itemname:pedidoSolicitud.itemname,
      cantidad:pedidoSolicitud.cantidad,
      pendiente:pedidoSolicitud.pendiente,
      comprometida:pedidoSolicitud.comprometida,
      disponible:pedidoSolicitud.disponible
    });
  } 

  this.comboPedidos = comboPedidos;
}


seleccionarPedido(pedidoSeleccionado:any){
  //console.log(pedidoSeleccionado);
}

filtrarPedido(event:any){
  this.pedidosFiltrados = this.filter(event,this.comboPedidos);
}



/*async registroLineaCargueVehiculoPedido(){
  //Validar formulario con cajas rojas con los campos obligatorios placa, counductor, pedido, fecha y hora
  //TODO: Validar que las cantidades a cargar no superen la cantidad disponible para cargar del vehiculo
  this.envioLineaCarguePedido =true;
  if(this.vehiculoSeleccionado.length ==0 || 
     this.conductorSeleccionado.length ==0 ||
     this.pedidoSeleccionado.length ==0 ||
     this.cantidadCargue == 0 ){

      this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los campos resaltados en rojo son obligatorios'});

  }else if(this.cantidadCargue> this.capacidadDisponibleVehiculo){
    this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los cantidad a cargar supera la cantidad disponible de carga del vehiculo'});
  }else if(this.cantidadCargue> this.pedidoSeleccionado.disponible){
    this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los cantidad a cargar supera la cantidad disponible del pedido seleccionado'});
  }else{
    this.detalleSolictudCargue.push({
        fechacargue:this.fechacargue,
        horacargue:this.horacargue,
        cliente: this.clienteSeleccionado.code,
        estado: "pendiente",
        placa:this.vehiculoSeleccionado.code,
        capacidadvh:this.vehiculoSeleccionado.capacidad,
        conductor:this.conductorSeleccionado.code,
        conductor_nombre:this.conductorSeleccionado.name,
        pedido:this.pedidoSeleccionado.name,
        itemcode:this.pedidoSeleccionado.itemcode,
        itemname:this.pedidoSeleccionado.itemname,
        cantidad:this.cantidadCargue,
        almacen:this.almacenSeleccionado.code,
    });
    this.envioLineaCarguePedido =false;
    //console.log(this.detalleSolictudCargue);
    this.dialogCargueVehiculoPedido= false;
    this.resetearForm();
    
    this.pedidosAlmacenCliente = await this.calcularCantidadesComprometidas(this.pedidosAlmacenCliente);
    this.pedidosEnSolicitud = await this.calcularCantidadesComprometidas(this.pedidosEnSolicitud);
    //console.log(this.pedidosAlmacenCliente, this.pedidosEnSolicitud);

    this.configTablaPedidosEnSolicitud();
    this.configTablePedidosAlmacenCliente();
    this.configComboSeleccionPedido();
    this.generarTreeTable();
  }

}*/








}
