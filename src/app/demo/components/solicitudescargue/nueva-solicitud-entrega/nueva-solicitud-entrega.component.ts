import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService, ConfirmEventType, MessageService, TreeNode } from 'primeng/api';
import { DialogService } from "primeng/dynamicdialog";
import { AlmacenesService } from "src/app/demo/service/almacenes.service";
import { CiudadesService } from "src/app/demo/service/ciudades.service";
import { ClientesService } from "src/app/demo/service/clientes.service";
import { ConductoresService } from "src/app/demo/service/conductores.service";
import { FunctionsService } from "src/app/demo/service/functions.service";

import { OrdenesCargueService } from "src/app/demo/service/ordenes-cargue.service";
import { PedidosService } from "src/app/demo/service/pedidos.service";
import { SB1SLService } from "src/app/demo/service/sb1sl.service";
import { SolicitudTurnoService } from "src/app/demo/service/solicitudes-turno.service";
import { TransportadorasService } from "src/app/demo/service/transportadoras.service";
import { UsuarioService } from "src/app/demo/service/usuario.service";
import { VehiculosService } from "src/app/demo/service/vehiculos.service";
import { TipoRol } from "../../admin/roles/roles.enum";
import { FormTransportadoraComponent } from "../../transportadoras/form-transportadora/form-transportadora.component";
import { FormVehiculoComponent } from "../../vehiculos/form-vehiculo/form-vehiculo.component";
import { FormConductorComponent } from "../../conductores/form-conductor/form-conductor.component";
import { lastValueFrom } from "rxjs";
import { EstadosDealleSolicitud } from "../../turnos/estados-turno.enum";
import { Table } from "primeng/table";
import { TipoVehiculosService } from "src/app/demo/service/tipo-vehiculo.service";

@Component({
    selector: 'app-nueva-solicitud-entrega',
    providers:[ConfirmationService,MessageService],
    templateUrl: './nueva-solicitud-entrega.component.html',
    styleUrls: ['./nueva-solicitud-entrega.component.scss']
    })
    
    export class NuevaSolicitudEntregaComponent  implements OnInit  {  


        activeStateTabs:boolean[] = [true, false, false];

        clientes:any[] = [];
        clienteSeleccionado: any = [];
        clientesFiltrados : any[] = [];

        permisosModulo!:any[];

        //Esta condicion viene dada por el rol/permiso del usuario   Cliente:RETIRA  Transporta Sociedad: TRANSP
        condicion_tpt!:string;
        multiplesClientes:boolean = false;
        verCondTPT:boolean = false;

        condicionesTPT:any[] = [{code:'RETIRA',label:'Entrega cliente'},{code:'TRANSP',label:'Transporta sociedades'}];

        tipoOperaciones:any[] = [{code:'VENTAS',label:'Ventas'},{code:'TRASLADO',label:'Traslado'}];

        tiposCompra:any[] = [{code:'NACIONAL',label:'NACIONAL'},{code:'INTERNACIONAL',label:'INTERNACIONAL'}];
        tiposCompraFiltrada:any[] = [];
        tipoCompra!:any;
        tipoCompraSeleccionada!:any;

        municipios!:any[];
        municipioSeleccionado:any = [];
        municipiosFiltrados:any[] = [];

        tiposRol:any = TipoRol;

        pedidos:any[] = [];

        almacenes: any[] = [];
        almacenSeleccionado:any = [];
        almacenesFiltrados :any[]=[];

        vehiculos:any[] = [];
        vehiculoSeleccionado:any = [];
        vehiculosFiltrados:any[] = [];

        transportadoras:any[] = [];
        transportadoraSeleccionada:any = [];
        transportadorasFiltrados:any[] = [];

        conductores:any[] = [];
        conductorSeleccionado:any = [];
        conductoresFiltrados:any[] = [];

        cols: any[] = [];
        vehiculosPedidos:TreeNode[] =[];
        vehiculosSeleccionados:TreeNode[] = [];

        vehiculosEnSolicitud:any[] = [];

        
        pedidosCliente: any[] = [];
        almacenesPedidosCliente: any[] = [];
        pedidosAlmacenCliente : any[] =[];

        pedidosEnSolicitud: any[] = []; 

        locaciones:any[] = [];
        diasNoAtencion:any[] = [];
        today:Date = new Date();

        invalidDates:any[] =[];

        horainicio:Date = new Date(new Date().setHours(0,0,0));
        horafin:Date = new Date(new Date().setHours(23,59,0));
        horariosLocacion:any[] = [];
        horariosSeleccionados:any[] = [];

        fechacargue:Date = new Date();
        hoy:Date = new Date();
        horacargue:Date = new Date();
        inicioDia:Date = new Date();


        dialogPedidosCliente:boolean = false;
        dialogCargueVehiculoPedido:boolean = false;

        
        envioAdicionVehiculo:boolean = false;

        cantidadCargue:number =0;
        capacidadVehiculo:number =0;
        capacidadDisponibleVehiculo:number =0;

        pesobruto:number = 0;
        pesoneto:number = 0;

        sitioentrega:string="";
        municipioentrega:string="";
        observacion:string="";

        clienteSeleccionado2: any = [];
        clientesFiltrados2 : any[] = [];

        tablaPedidosAlmacenCliente!: any;
        tablaPedidosEnSolicitud!: any;
        showItemsSelectedPedidosAlmacenCliente:boolean=false;


        envioLineaCarguePedido:boolean = false;
        permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];

        domain:string = window.location.hostname;


        displayModal:boolean = false;
        loadingCargue:boolean = false;
        completeCargue:boolean = false;
        completeTimer:boolean = false;
        messageComplete:string = "";

        vehiculosSeleccionadoPedidos:any[] = [];


        vehiculosSolicitud:any[] = [];
        loadingTablevehiculosSolicitud:boolean = false;
        vehiculosSolicitudSelected:any[] = [];

        @ViewChild('filterTable') filterTable!: ElementRef;

        checkall:boolean = false;
        fileTmp:any;
        errorFile:boolean = false;
        uploadedFiles: any[] = [];
        importeVehiculosSolicitud:any[] = [];
        erroresImportacionVehiculos:any[] = [];
        loadingTableerroresImportacionVehiculos:boolean = false;

        tipoVehiculos:any[] = [];

        loadingCargueCSV:boolean = false;

        constructor(private pedidosService: PedidosService,
            private almacenesService: AlmacenesService,
            private messageService: MessageService,
            private vehiculosService:VehiculosService,
            private conductoresService:ConductoresService,
            private confirmationService: ConfirmationService,
            private ordenesCargueService: OrdenesCargueService,
            private transportadorasService:TransportadorasService,
            private solicitudTurnoService:SolicitudTurnoService,
            public dialogService: DialogService,
            private router:Router,
            public usuariosService:UsuarioService,
            public functionsService:FunctionsService,
            private clientesService:ClientesService,
            private sB1SLService:SB1SLService,
            private ciudadesService:CiudadesService,
            private tipoVehiculosService: TipoVehiculosService,
            ){
              
               
            }

        async  ngOnInit(){
            this.getPermisosModulo();

            this.getCiudades();
            this.getClientes();
            this.getAlmacenes(); 
            this.getLocaciones();
            // //this.getPedidos();
            this.getVehiculos();
            this.getConductores();
            this.getTransportadoras();
            this.configTablePedidosAlmacenCliente();
            this.configTablaPedidosEnSolicitud();
            this.getTipoVehiculos();

            this.inicioDia.setHours(0,0,0);

            //Esta condicion viene dada por el rol/permiso del usuario   Cliente:RETIRA  Transporta Sociedad: TRANSP
            this.condicion_tpt="TRANSP";
            //this.multiplesClientes = true; // true o false depende si es TRANSP o RETIRA

            //this.pedidosService.getVehiculosPedido().then(vehiculos => this.vehiculosPedidos = vehiculos);
            //this.vehiculosPedidos = await this.pedidosService.getVehiculosPedido();
            this.cols = [
                { field: 'vehiculo', header: 'Vehiculo' },
                { field: 'conductor', header: 'Conductor/Pedido' },
                { field: 'fechacargue', header: 'Fecha - Hora Cargue/Item' },
                { field: 'cantidadcrg', header: 'Toneladas cargadas' }
            ];
            
        }


        getPermisosModulo(){
  
            const modulo = this.router.url;
            
            ////console.log('modulo',modulo);
            this.usuariosService.getPermisosModulo(modulo)
                .subscribe({
                    next: async (permisos)=>{
                      //////////////// //// ////////////console.log(permisos);
                      if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                        this.router.navigate(['/auth/access']);
                      }
          
                      if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                        this.router.navigate(['/auth/access']);
                      }
                      this.permisosModulo = permisos;
                      this.multiplesClientes = await this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='Seleccionar multiples clientes').valor;
                      //////////////////////////// //// ////////////console.log(this.multiplesClientes);
          
                     
                      /*
                      this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
                      this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
                      this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
                      this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
                      */
          
                      ////////console.log(this.permisosModulo);
                      if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='RETIRA').valor){
                        this.condicion_tpt="RETIRA";
                      }
          
                      if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='TRANSP').valor){
                        this.condicion_tpt="TRANSP";
                      }
          
                      if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='TRANSP').valor && this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='RETIRA').valor){
                        //this.condicion_tpt="ALL";
                        this.verCondTPT = true;
                      }
          
                    //   if(this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='TRANSP').valor && this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='ver fletes').valor){
                    //     this.verFletes = true;
                    //   }
          
                      //this.verFletes = await this.setVerFletes(this.condicion_tpt,this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='ver fletes').valor);
          
                     
                      //////////////// //// ////////////console.log(this.condicion_tpt);
                      
          
                    },
                    error:(err)=>{
                        console.error(err);
                    }
                });
                
        }

        async getCiudades(){
            this.ciudadesService.getCiudades()
                .subscribe({
                    next:(ciudades)=>{
                     //////// //// ////////////console.log(ciudades);
                      ciudades.map((ciudad:any)=>{
                        ciudad.label = `${ciudad.code} - ${ciudad.nombre}`;
                      });
        
                      this.municipios = ciudades;
                    },
                    error:(err)=>{
                      console.error(err);
                    }
        
                });
        }

        async getClientes(){
            this.clientes = [];
            this.usuariosService.getInfoUsuario()
                .subscribe({
                    next: async (infoUsuario)=>{
                      ////////////////////// //// ////////////console.log(infoUsuario);
                      let clientesUsuario!:any;
            
                      if(await this.functionsService.validRoll(infoUsuario.roles,this.tiposRol.TRANSPORTASOCIEDAD) || await this.functionsService.validRoll(infoUsuario.roles,this.tiposRol.ADMIN)){
                        //Listar todos los clientes
                        clientesUsuario = await this.clientesService.infoProveedores();
            
                      }else{
                        //Mostrar clientes asociados al usuario
                        clientesUsuario = infoUsuario.clientes;
                        ////////////////// //// ////////////console.log(clientesUsuario[0].CardCode,await this.usuariosService.infoUsuarioByCardCode(clientesUsuario[0].CardCode));
                      }
            
                      ////////////////// //// ////////////console.log('clientesUsuario',clientesUsuario);
            
                      for(let clienteUsuario of clientesUsuario){
                        clienteUsuario.code = clienteUsuario.CardCode;
                        clienteUsuario.name =  clienteUsuario.CardName;
                        clienteUsuario.label = clienteUsuario.CardCode+' - '+clienteUsuario.CardName;
                      }
                      this.clientes = clientesUsuario;
            
                      ////console.log(this.clientes);
                      
                      
                      this.getSaldosPedidos();
                      
                      
                    },
                    error: (err)=>{
                      console.error(err);
                    }
                });
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
                    this.almacenes = almacenesTMP.filter(almacen=>almacen.CorreoNoti !=null && almacen.CorreoNoti!='');
                    ////////console.log('this.almacenes',this.almacenes);
                    
                    },
                    error:(err)=>{
                        console.error(err);
                    }
            
            }); 
        }

        async getLocaciones(){
            this.almacenesService.getLocaciones()
                .subscribe({
                    next:(locaciones)=>{
                        //////// //// ////////////console.log('locaciones',locaciones);
                        this.locaciones = locaciones;
                    },
                    error:(err)=>{
                      console.error(err);
                    }
                });
        }

        getTipoVehiculos(){
          this.tipoVehiculosService.getTipoVehiculos()
              .subscribe({
                  next: (tipoVehiculos)=>{
                    
                    //Adicionar campos requeridos para autocmplete y dropdwons
                    for(let tipoVehiculo of tipoVehiculos){
                      tipoVehiculo.code = tipoVehiculo.id;
                      tipoVehiculo.name = tipoVehiculo.tipo;
                      tipoVehiculo.label = tipoVehiculo.tipo;
                    }
                   
                    this.tipoVehiculos = tipoVehiculos;
                    //console.log(tipoVehiculos);
                    
                  },
                  error: (err)=>{
                    console.error(err);
                  }
              });
        }

        getVehiculos(){
            this.vehiculosService.getVehiculos()
                .subscribe({
                  next: (vehiculos)=>{
                      //////console.log(vehiculos);
                      for(let vehiculo of vehiculos){
                        vehiculo.code = vehiculo.placa;
                        vehiculo.name = vehiculo.placa;
                        vehiculo.label = vehiculo.placa+' ('+vehiculo.tipo_vehiculo.capacidad+' TON)';
                        vehiculo.clase = vehiculo.tipo_vehiculo;
                      }
                      //////////////////////////// //// ////////////console.log(conductores);
                      this.vehiculos = vehiculos;
                      //console.log('vehiculos',vehiculos);
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
                        //////////////////////////// //// ////////////console.log(conductores);
                        this.conductores = conductores;

                        //console.log('this.conductores',this.conductores);
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
                      transportadora.code = transportadora.nit;
                      transportadora.name = transportadora.nombre;
                      transportadora.label = transportadora.nit+' - '+transportadora.nombre;
                    }
                    //////////////////////////// //// ////////////console.log(conductores);
                    this.transportadoras = transportadoras;
                    ////console.log('this.transportadoras',this.transportadoras);
                },
                error: (err)=>{
                  console.error(err);
                }
            }); 
        }

        getSaldosPedidos(){
            this.pedidosService.getSaldosOrdenesCompra()
                .subscribe({
                    next:async (saldosPedidos)=>{
                        //console.log('saldosPedidos',saldosPedidos);
                        let pedidosClientes:any[] = [];
                        for(let indexPedido in saldosPedidos){
                        
            
                            // if(saldosPedidos[indexPedido].DocNum == '121011980'){
                            //   ////////console.log('pedido 121011980',saldosPedidos[indexPedido]);
                            // }
                        
                            if(this.clientes.find(cliente =>cliente.CardCode == saldosPedidos[indexPedido].CardCode)){
            
                            // if(saldosPedidos[indexPedido].locacion_codigo2=='LADORADA'){
                            //   ////////console.log(saldosPedidos[indexPedido])
                            // }
                            
                            pedidosClientes.push({
                                index:saldosPedidos[indexPedido].DocNum+''+saldosPedidos[indexPedido].LineNum,
                                cantidad:saldosPedidos[indexPedido].Quantity,
                                cantidad_suministrada:saldosPedidos[indexPedido].DelivrdQty,
                                //cantidad_suministrada:saldosPedidos[indexPedido].Quantity-saldosPedidos[indexPedido].SALDO,
                                cardcode:saldosPedidos[indexPedido].CardCode,
                                cardname:this.clientes.find(cliente =>cliente.CardCode === saldosPedidos[indexPedido].CardCode).CardName,
                                ciudad_ea:'',
                                codigo_almacen:saldosPedidos[indexPedido].WhsCode_Code,
                                nombre_almacen:saldosPedidos[indexPedido].WhsName,
                                codigo_cuenta:'',
                                comentarios:saldosPedidos[indexPedido].Comments,
                                condicion_pago:saldosPedidos[indexPedido].PymntGroup,
                                condicion_tpt:saldosPedidos[indexPedido].U_NF_CONDTRANS==null?'TRANSP':saldosPedidos[indexPedido].U_NF_CONDTRANS,
                                
                                descuento:0,
                                dias:0,
                                direccion_ea:'',
                                docdate:saldosPedidos[indexPedido].DocDate,
                                docentry:saldosPedidos[indexPedido].DocEntry,
                                docnum:saldosPedidos[indexPedido].DocNum,
                                duedate:saldosPedidos[indexPedido].DocDueDate,
                                estado_doc:saldosPedidos[indexPedido].ESTADO,
                                estado_linea:'',
                                linenum:saldosPedidos[indexPedido].LineNum,
                                funcionario_ventas:'',
                                impuesto:'',
                                itemcode:saldosPedidos[indexPedido].ItemCode,
                                itemname:saldosPedidos[indexPedido].Dscription,
                                iva:'',
                                //locacion:saldosPedidos[indexPedido].Location,
                                locacioncode: saldosPedidos[indexPedido].locacion_codigo2,
                                locacion:saldosPedidos[indexPedido].locacion2,
                            
                                moneda:'',
                                nit:'',
                                nombre_referencia:'',
                                pedido_contingencia:'',
                                pendiente:saldosPedidos[indexPedido].SALDO,
                                precio_coniva:saldosPedidos[indexPedido].PRECIOU_CONIVA,
                                precio_siniva:0,
                                remision_contingencia:'',
                                serie:'',
                                telefono_ea:'',
                                tipo_producto:saldosPedidos[indexPedido].TIPOPEDIDO,
                                tipo_pedido:saldosPedidos[indexPedido].TIPOPEDIDO,
                                total_documento:saldosPedidos[indexPedido].LineTotal,
                                total_impuesto:0,
                                total_linea_siniva:0,
                                email_vendedor:saldosPedidos[indexPedido].Email,
                                vendedor:saldosPedidos[indexPedido].SlpName,
                                dependencia:saldosPedidos[indexPedido].DEPENDENCIA,
                                localidad:saldosPedidos[indexPedido].LOCALIDAD,
                                tipoprod:saldosPedidos[indexPedido].TIPOPROD,
                                email_asistente:saldosPedidos[indexPedido].Correo_Asistente,
                                nombre_asistente:saldosPedidos[indexPedido].Nombre_Asistente,
                                Maneja_Lote:saldosPedidos[indexPedido].Maneja_Lote,
                                ObjType:saldosPedidos[indexPedido].ObjType,
                                vicepresidencia:saldosPedidos[indexPedido].VICEPRESIDENCIA,
                                ivacode:saldosPedidos[indexPedido].IvaCode,
                                precio_lista:saldosPedidos[indexPedido].ListaPrecio,
                                precio_vendedor:saldosPedidos[indexPedido].PrecioVendedor,
                                precio_gerente:saldosPedidos[indexPedido].PrecioGerente,
                                categoria_item:saldosPedidos[indexPedido].Categoria_Item,
                                subcategoria_item:saldosPedidos[indexPedido].Subcategoria_Item,
                                almacen_fpp:saldosPedidos[indexPedido].AlmacenFPP,
                                bodega_destino:saldosPedidos[indexPedido].Bodega_Destino,
                                ubicacion:saldosPedidos[indexPedido].Bodega_Destino==='CONSIGNA'?`CONSIGNA-${saldosPedidos[indexPedido].CardCode}`:'',
                                codigo_vendedor:saldosPedidos[indexPedido].Codigo_Vendedor,
                                precio_unitario:saldosPedidos[indexPedido].Precio_Unitario,
                                tipo_operacion:saldosPedidos[indexPedido].Tipo_Movimiento,
                                bodega_final:saldosPedidos[indexPedido].Bodega_Fin,
                                motonave:saldosPedidos[indexPedido].U_NF_MOTONAVE,
                                
                            })
            
                            
                            }
            
                        }
            
                        // ////////////console.log(pedidosClientes.filter(pedido =>pedido.docnum ===290000003));
                        // //// ////////////console.log(pedidosClientes.filter(pedido=>pedido.condicion_tpt==='TRANSP' && !pedido.itemcode.startsWith('SF')));


                        this.pedidos = await this.functionsService.sortArrayObject(pedidosClientes,'index','ASC') ;
                        ////console.log(this.pedidos);
                    },
                    error:(err)=>{
                      console.error(err);
                    }
                });
        }


        async filtrarCliente(event: any) {
            this.clientesFiltrados =  this.filter(event,this.clientes);
        }

        async seleccionarCliente(clienteSeleccionado:any){
            //////////////////////// //// ////////////console.log(clienteSeleccionado);
            
            ////console.log(clienteSeleccionado);
          
            // if(this.verCondTPT && this.condicionSeleccionada.length == 0){
            //   this.messageService.add({severity:'error', summary:'Error', detail:'Debe seleccionar primero una condición de transporte'});
            // }else{
            //   this.getPedidosPorCliente(clienteSeleccionado);
            //   this.almacenSeleccionado = [];
            //   this.vehiculosEnSolicitud = [];
            //   this.generarTreeTable();
            //   this.toggle(1);
            // }

            this.getPedidosPorCliente(clienteSeleccionado);
            this.almacenSeleccionado = [];
            this.vehiculosEnSolicitud = [];
            this.generarTreeTable();
            this.toggle(1);
        
          
           
          
            
        }

        filtrarTipoCompra(event: any) {
            this.tiposCompraFiltrada = this.filter(event,this.tiposCompra);
        }

        async seleccionarTipoCompra(tipoCompraSeleccionada:any){
  
            //////console.log(this.verCondTPT,this.condicionSeleccionada,this.pedidos);
            
        
            
            //this.verFletes = await this.setVerFletes(this.condicion_tpt,this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='ver fletes').valor);
            
            this.almacenSeleccionado = [];
            this.vehiculosEnSolicitud = [];
        }

        generarTreeTable(){

            let vehiculos :any[] = [];
           //////// //// ////////////console.log(this.condicion_tpt);
          
            for(let solicitud of this.vehiculosEnSolicitud){
              //////////////////////////// //// ////////////console.log(solicitud);
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
                              vehiculo:`${pedido.municipioentrega} - ${pedido.lugarentrega}`,
                              conductor:`${pedido.pedido} - ${pedido.cliente}`,
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
            ////console.log('this.vehiculosPedidos',this.vehiculosPedidos);
            
        }

        toggle(index: number) {
            this.activeStateTabs[index] = !this.activeStateTabs[index]?true:true;
          
        }
          

        async getPedidosPorCliente(clientesSeleccionados:any){
            ////////console.log(this.condicion_tpt);
           // //////console.log(this.pedidos.filter(pedido=>pedido.condicion_tpt===this.condicion_tpt));
          
            this.pedidosCliente = await this.pedidosService.getPedidosPorCliente(clientesSeleccionados, this.condicion_tpt, this.pedidos);
            ////console.log('pedidosCliente',this.pedidosCliente);
            this.getAlmacenesEnPedidos();
        }

        getAlmacenesEnPedidos(){
            let almacenesPedidosCliente: any[] = [];
            ////////console.log('almacenesPedidosCliente',this.almacenes,this.pedidosCliente);
            for(let pedido of this.pedidosCliente){
              
              if(almacenesPedidosCliente.filter(almacenPedido => almacenPedido.code == pedido.locacioncode).length===0){
                //TODO: Buscar datos del almacen en array de almacenes
                
                //if(this.almacenes.filter(almacen => almacen.Location == pedido.locacion).length>0){
                if(this.almacenes.filter(almacen => almacen.locacion_codigo2 == pedido.locacioncode).length>0){
                  //let informacionAlmacen:any = this.almacenes.filter(almacen => almacen.Location == pedido.locacion)[0];
                  let informacionAlmacen:any = this.almacenes.filter(almacen => almacen.locacion_codigo2 == pedido.locacioncode)[0];
                  ////////////////////////// //// ////////////console.log(informacionAlmacen);
                  //informacionAlmacen.label = informacionAlmacen.Location+' - '+informacionAlmacen.Name_State+ ' ('+informacionAlmacen.State_Code+')';
                  informacionAlmacen.label = informacionAlmacen.locacion2+' - '+informacionAlmacen.Name_State+ ' ('+informacionAlmacen.State_Code+')';
                  //almacenesPedidosCliente.push(informacionAlmacen);
                  almacenesPedidosCliente.push({
                    code:informacionAlmacen.locacion_codigo2,
                    name:informacionAlmacen.locacion2,
                    label: informacionAlmacen.label,
                    email: informacionAlmacen.CorreoNoti
                  });
                }
              }
            }
            this.almacenesPedidosCliente = almacenesPedidosCliente;
            //////// //// ////////////console.log('almacenesPedidosCliente',this.almacenesPedidosCliente);
          
        }

        async filtrarAlmacen(event:any){
            this.almacenesFiltrados =  this.filter(event,this.almacenesPedidosCliente);
        }

        async seleccionarAlmacen(almacenSeleccionado:any){
            ////////console.log(almacenSeleccionado);
            //this.getPedidosClientePorAlmacen(almacenSeleccionado.code);
           
            if(this.locaciones.filter(locacion=>locacion.code === almacenSeleccionado.code).length>0){
              ////////////////// //// ////////////console.log(this.locaciones.filter(locacion=>locacion.code === almacenSeleccionado.code)[0].horarios_locacion);
              ////////////////// //// ////////////console.log(this.horainicio, this.horafin);
              this.diasNoAtencion = await this.obtenerDiasNoAtencion(this.locaciones.filter(locacion=>locacion.code === almacenSeleccionado.code)[0].horarios_locacion);
              this.horariosLocacion = this.locaciones.filter(locacion=>locacion.code === almacenSeleccionado.code)[0].horarios_locacion;
          
              //////////////// //// ////////////console.log('horariosLocacion',this.horariosLocacion);
              await this.seleccionarFechaCita();
            }else{
              //Establecer horarios locacion
              this.diasNoAtencion = [];
              this.horariosLocacion = [];
              this.horariosSeleccionados =[];
            }
          
        }

        async obtenerDiasNoAtencion(horarios:any[]):Promise<any[]>{
            let diasNoAtencion:any[] = this.functionsService.dias;
              
              for(let horario of horarios){
                let diasNot:any[] = [];
                let diasAtencionLocacion:any[] = horario.dias_atencion.split(',');
                ////////////////// //// ////////////console.log(diasAtencionLocacion);
                for(let dia of diasNoAtencion){
                  ////////////////// //// ////////////console.log(diasAtencionLocacion.includes(dia.fullname));
          
                  if(!diasAtencionLocacion.includes(dia.fullname)){
                      diasNot.push(dia);
                  }
                  ////////////////// //// ////////////console.log(dia.fullname,JSON.stringify(diasNot));
                }
                
                diasNoAtencion = diasNot;
              }
          
             // //////////////// //// ////////////console.log(diasNoAtencion.map((dia)=>{ return dia.id}));
          
            return diasNoAtencion.map((dia)=>{ return dia.id});
        }
          
        async seleccionarFechaCita():Promise<void>{
          
            
            
            let diasSemana = this.functionsService.dias;
            let diaSeleccionado = diasSemana.find(diaSemana => diaSemana.id === this.fechacargue.getUTCDay());
            let horariosSeleccionados = this.horariosLocacion.filter(horario=>horario.dias_atencion.includes(diaSeleccionado.fullname));
            //let horarioSeleccionados:any[] = [];
            this.horariosSeleccionados = horariosSeleccionados;
          
            /*for(let horario of this.horariosLocacion){
              //////////////// //// ////////////console.log(horario.dias_atencion.includes(diaSeleccionado.fullname));
            }*/
            //////////////// //// ////////////console.log(this.fechacargue.getUTCDay(), diasSemana,diaSeleccionado,this.horariosLocacion,horariosSeleccionados);
            await this.cambioHoraCita();
        }
          
        async cambioHoraCita():Promise<void>{
            //////////////// //// ////////////console.log(this.horacargue.toLocaleTimeString());
            /*for(let horario of this.horariosSeleccionados){
              //////////////// //// ////////////console.log(new Date(new Date().setHours(horario.horainicio.split(':')[0],horario.horainicio.split(':')[1],horario.horainicio.split(':')[2])));
              //////////////// //// ////////////console.log(new Date(new Date().setHours(horario.horafin.split(':')[0],horario.horafin.split(':')[1],horario.horafin.split(':')[2])));
              //////////////// //// ////////////console.log(new Date(this.horacargue));
          
              let horainicio = new Date(new Date().setHours(horario.horainicio.split(':')[0],horario.horainicio.split(':')[1],horario.horainicio.split(':')[2]));
              let horafin = new Date(new Date().setHours(horario.horafin.split(':')[0],horario.horafin.split(':')[1],horario.horafin.split(':')[2]));
              let horacargue = new Date(this.horacargue);
          
              if(horainicio<= horacargue && horafin >= horacargue){
                //////////////// //// ////////////console.log('hora valida en horario id '+horario.id);
              }else{
                //////////////// //// ////////////console.log('hora invalida en horario id '+horario.id);
              }
            }*/
            ////////////////// //// ////////////console.log(this.horariosSeleccionados.filter(horario=>new Date(horario.horainicio)< new Date(this.horacargue) && new Date(horario.horafin)> new Date(this.horacargue)));
          
            if(await this.validarHoraCargue()){
              //////////////// //// ////////////console.log('hora valida en horario ');
            }else{
              //////////////// //// ////////////console.log('hora invalida en horario');
            }
        }

        async validarHoraCargue():Promise<boolean>{
            let horarioValido:boolean = true;
          
            for(let horario of this.horariosSeleccionados){
              //////////////// //// ////////////console.log(new Date(new Date().setHours(horario.horainicio.split(':')[0],horario.horainicio.split(':')[1],horario.horainicio.split(':')[2])));
              //////////////// //// ////////////console.log(new Date(new Date().setHours(horario.horafin.split(':')[0],horario.horafin.split(':')[1],horario.horafin.split(':')[2])));
              //////////////// //// ////////////console.log(new Date(this.horacargue));
          
              let horainicio = new Date(new Date().setHours(horario.horainicio.split(':')[0],horario.horainicio.split(':')[1],horario.horainicio.split(':')[2]));
              let horafin = new Date(new Date().setHours(horario.horafin.split(':')[0],horario.horafin.split(':')[1],horario.horafin.split(':')[2]));
              let horacargue = new Date(this.horacargue);
          
              if(horainicio<= horacargue && horafin >= horacargue){
                //////////////// //// ////////////console.log('hora valida en horario id '+horario.id);
              }else{
                //////////////// //// ////////////console.log('hora invalida en horario id '+horario.id);
                horarioValido = false;
              }
            }
          
            return horarioValido;
        }

        cambioAlmacen(){
            this.vehiculosEnSolicitud = [];
            this.generarTreeTable();
        }

        adicionarVehiculo(){

            
  
            if(Object.keys(this.almacenSeleccionado).length >0){
              this.dialogCargueVehiculoPedido = true;
              this.resetearForm();
            }else{
              this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Primero debe seleccionar el almacen de donde realizará la entrega de los productos'});
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
            this.fileTmp = undefined;
            this.erroresImportacionVehiculos=[];
            this.importeVehiculosSolicitud= [];
        }

        async filtrarVehiculo(event:any){
            //TODO: quitar del listado de vehiculos los vehiculos que ya esten asociados a la solicitud en curso
            
            let vehiculosAfiltrar:any[] = [];
            for(let vehiculo of this.vehiculos){
              if(this.vehiculosEnSolicitud.filter(vehiculoSolicitud =>vehiculoSolicitud.placa == vehiculo.code).length == 0){
                vehiculosAfiltrar.push(vehiculo);
              }
            }
            this.vehiculosFiltrados =  this.filter(event,vehiculosAfiltrar);
            this.vehiculosFiltrados.unshift({
              id:0, code: "Nuevo", name: "Nuevo", label:"+ Nuevo vehículo"
            });
            //////////////////////////// //// ////////////console.log(this.vehiculosFiltrados);
        }
          
        async filtrarConductor(event:any){
            let conductoresAfiltrar:any[] = [];
            for(let conductor of this.conductores){
              if(this.vehiculosEnSolicitud.filter(vehiculoSolicitud =>vehiculoSolicitud.conductor == conductor.code).length == 0){
                conductoresAfiltrar.push(conductor);
              }
            }
            this.conductoresFiltrados =  this.filter(event,conductoresAfiltrar);
            this.conductoresFiltrados.unshift({
              id:0, code: "Nuevo", name: "Nuevo", label:"+ Nuevo conductor"
            });
        }
          
        async filtrarTransportadora(event:any){
            let transportadorasAfiltrar:any[] = [];
            for(let transportadora of this.transportadoras){
                transportadorasAfiltrar.push(transportadora);
            }
            this.transportadorasFiltrados =  this.filter(event,transportadorasAfiltrar);
            this.transportadorasFiltrados.unshift({
              id:0, code: "Nuevo", name: "Nuevo", label:"+ Nueva transportadora"
            });
        }

        seleccionarTransportadora(transportadoraSeleccionada:any){
            //////////////////// //// ////////////console.log(transportadoraSeleccionada)
            if(transportadoraSeleccionada.id == 0){
              //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
              this.nuevaTransportadora();
            }else{
            }
        }
          
        async seleccionarVehiculo(vehiculoSeleccionado:any){
            //////////// //// ////////////console.log(vehiculoSeleccionado)
            if(vehiculoSeleccionado.id == 0){
                //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
                this.nuevoVehiculo();
            }else{
                ////////////////////////// //// ////////////console.log(vehiculoSeleccionado)
                this.capacidadVehiculo = vehiculoSeleccionado.capacidad;
                //Verificar si el vehiculo esta asociado a la solicitud actual y calcula la capacidad disponible
                let capacidaVh = await this.cacluarCapacidadDisponibleVH(vehiculoSeleccionado.code); 
          
                this.pesobruto = vehiculoSeleccionado.pesovacio;
                this.pesoneto = vehiculoSeleccionado.pesomax;
                //////////////////////////// //// ////////////console.log(this.capacidadVehiculo,capacidaVh);
                this.capacidadDisponibleVehiculo = this.capacidadVehiculo - capacidaVh;
                
          
                //Verificar si el conductor asociado al vehiculo seleccionado existe en conductores
                //let conductor = this.conductores.find(conductor => conductor.code === vehiculoSeleccionado.conductor);
                //if(conductor != undefined) this.conductorSeleccionado = conductor;
            }
          
        }
          
        nuevaTransportadora(){
            
            const ref = this.dialogService.open(FormTransportadoraComponent, {
              data: {
                  id: parseInt(this.transportadoraSeleccionada.id)
              },
              header: this.transportadoraSeleccionada.id==0?`Nueva transportadora`:`Editar transportadora` ,
              width: '70%',
              height:'auto',
              contentStyle: {"overflow": "auto"},
              maximizable:true, 
            });
          
            ref.onClose.subscribe((infoTransportadora) => {
              this.getTransportadoras();
              //////////////////// //// ////////////console.log(infoTransportadora)
              
              if(infoTransportadora.update){
                this.transportadoraSeleccionada.code = infoTransportadora.nit;
                this.transportadoraSeleccionada.nit = infoTransportadora.nit;
                this.transportadoraSeleccionada.nombre = infoTransportadora.nombre;
                this.transportadoraSeleccionada.name = infoTransportadora.nombre;
                this.transportadoraSeleccionada.label  = infoTransportadora.nit+' - '+infoTransportadora.nombre;
          
                //////////////////// //// ////////////console.log(this.transportadoraSeleccionada)
              }
              //////////////////////////// //// ////////////console.log("Refresh calendar");
            });
        }
          
        nuevoVehiculo(){
            const ref = this.dialogService.open(FormVehiculoComponent, {
              data: {
                  id: parseInt(this.vehiculoSeleccionado.id)
              },
              header: this.vehiculoSeleccionado.id==0?`Nuevo Vehículo`:`Editar vehículo ${this.vehiculoSeleccionado.code}` ,
              width: '70%',
              height:'auto',
              contentStyle: {"overflow": "auto"},
              maximizable:true, 
            });
          
            ref.onClose.subscribe(async (infoVehiculo) => {
              this.getVehiculos();
              //////////////////// //// ////////////console.log(infoVehiculo)
              if(infoVehiculo.update){
                this.capacidadVehiculo = infoVehiculo.capacidad;
                let capacidaVh = await this.cacluarCapacidadDisponibleVH(infoVehiculo.placa); 
                this.capacidadDisponibleVehiculo = this.capacidadVehiculo - capacidaVh;
                this.vehiculoSeleccionado.code = infoVehiculo.placa;
                this.vehiculoSeleccionado.placa = infoVehiculo.placa;
                this.vehiculoSeleccionado.capacidad = infoVehiculo.capacidad;
                this.vehiculoSeleccionado.label = infoVehiculo.placa;
              }
              //////////////////////////// //// ////////////console.log("Refresh calendar");
            });
        }
          
        nuevoConductor(){
            const ref = this.dialogService.open(FormConductorComponent, {
              data: {
                  id: parseInt(this.conductorSeleccionado.id)
              },
              header: this.conductorSeleccionado.id==0?`Nuevo Conductor`:`Editar conductor` ,
              width: '70%',
              height:'auto',
              contentStyle: {"overflow": "auto"},
              maximizable:true, 
            });
          
            ref.onClose.subscribe((infoConductor) => {
              this.getConductores();
              //////////////////// //// ////////////console.log(infoConductor)
              if(infoConductor.update){
                this.conductorSeleccionado.code = infoConductor.cedula;
                this.conductorSeleccionado.cedula = infoConductor.cedula;
                this.conductorSeleccionado.name = infoConductor.nombre;
                this.conductorSeleccionado.nombre = infoConductor.nombre;
                this.conductorSeleccionado.label = infoConductor.cedula+' - '+infoConductor.nombre;
                this.conductorSeleccionado.numerotelefono = infoConductor.numerotelefono;
                this.conductorSeleccionado.numerocelular = infoConductor.numerocelular;
                this.conductorSeleccionado.email = infoConductor.email;
              }
            });
        }
          
        seleccionarConductor(conductorSeleccionado:any){
            //////////////////// //// ////////////console.log(conductorSeleccionado)
            if(conductorSeleccionado.id == 0){
              //TODO: LLamar al dialogDynamic para cargar component de creación de vehiculo
              this.nuevoConductor();
            }
        }
          
        async adicionVehiculoSolicitud(){
            //this.envioLineaCarguePedido =true;
            this.envioAdicionVehiculo = true;

            if(!this.fileTmp){
               ////////////////////////// //// ////////////console.log(this.sitioentrega,Object.keys(this.vehiculoSeleccionado).length,Object.keys(this.conductorSeleccionado).length, Object.keys(this.transportadoraSeleccionada).length);
                if(Object.keys(this.vehiculoSeleccionado).length ==0 || 
                Object.keys(this.conductorSeleccionado).length ==0 ||
                Object.keys(this.transportadoraSeleccionada).length ==0 //||
                //this.sitioentrega=="" ||
                //this.municipioentrega==""
                ){
                this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los campos resaltados en rojo son obligatorios'});
                }else if(!(await this.validarHoraCargue())){
                  this.messageService.add({severity:'error', summary: '!Error¡', detail: 'La fecha y hora de cargue seleccionada esta fuera del horario de atención de la locación.'});
                }else{
              
                  this.confirmationService.confirm({
                    message: 'Por favor verifique que la información, fecha y hora estimada del cargue  son correctas',
                    header: 'Confirmación',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
              
                        ////////console.log(this.fechacargue.toISOString());
                    
                        ////////console.log(this.horacargue.toISOString());
                        let horacargue = `${this.fechacargue.toISOString().split("T")[0]}T${this.horacargue.toISOString().split("T")[1]}`;
                        ////////console.log(new Date(horacargue));
              
              
                        
                        this.vehiculosEnSolicitud.push({
                            fechacargue:this.fechacargue,
                            //horacargue:this.horacargue,
                            horacargue:new Date(horacargue),
                            //cliente: this.clienteSeleccionado.code,
                            estado: "pendiente",
                            placa:this.vehiculoSeleccionado.code,
                            capacidadvh:this.vehiculoSeleccionado.capacidad,
                            conductor:this.conductorSeleccionado.code,
                            conductor_nombre:this.conductorSeleccionado.name,
                            cantidad:this.vehiculoSeleccionado.capacidad,
                            transportadora:this.transportadoraSeleccionada.code,
                            
                            sitioentrega:this.sitioentrega,
                            municipioentrega:this.municipioentrega,
                            observacion:this.observacion,
                            
                            pedidos:[]
                        });

                        this.vehiculosSolicitud.push({ 
                            fechacargue:this.fechacargue,
                            //horacargue:this.horacargue,
                            horacargue:new Date(horacargue),
                            //cliente: this.clienteSeleccionado.code,
                            estado: "pendiente",
                            placa:this.vehiculoSeleccionado.code,
                            capacidadvh:this.vehiculoSeleccionado.capacidad,
                            cedula:this.conductorSeleccionado.code,
                            conductor:this.conductorSeleccionado.name,
                            
                            transportadora:this.transportadoraSeleccionada.code,
                            nombre_transportadora:this.transportadoraSeleccionada.name,
                            itemCode:'',
                            itemName:'',
                            cantidad:this.vehiculoSeleccionado.capacidad,
                            sitioentrega:this.sitioentrega,
                            municipioentrega:this.municipioentrega,
                            observacion:this.observacion,
                            key:`${this.vehiculoSeleccionado.code}`,
                            pedidos:[]


                        })
              
                        ////////console.log( this.vehiculosEnSolicitud);
                        //this.envioLineaCarguePedido =false;
                        
                        this.envioAdicionVehiculo = false;
                        this.dialogCargueVehiculoPedido= false;
                        this.resetearForm();
                        
                        
                        //this.pedidosAlmacenCliente = await this.calcularCantidadesComprometidas(this.pedidosAlmacenCliente);
                        //this.configTablePedidosAlmacenCliente();


                        this.generarTreeTable();
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
            }else{
              if(this.erroresImportacionVehiculos.filter(error=>error.severity==='error').length===0){
                this.vehiculosSolicitud= this.importeVehiculosSolicitud;
                this.envioAdicionVehiculo = false;
                this.dialogCargueVehiculoPedido= false;
                this.resetearForm();
              }else{
                for(let error of this.erroresImportacionVehiculos){
                  this.messageService.add({severity:error.severity, summary:error.summary, detail:error.detail});
                }
              }
              
            }
           
        }

        async cacluarCapacidadDisponibleVH(placa:string):Promise<number>{
            let capacidadDisponibleVH = 0;
            let vehiculo:any = this.vehiculosEnSolicitud.filter(pedido =>pedido.placa == placa);
            //////////////////////////// //// ////////////console.log(vehiculo.length);
            if(vehiculo.length >0){
              capacidadDisponibleVH =vehiculo[0].cantidad
            }
           
            /*for(let pedido of pedidosVehiculo){
              capacidadDisponibleVH+=pedido.cantidad;
            }*/
            //////////////////////////// //// ////////////console.log(capacidadDisponibleVH);
            return capacidadDisponibleVH;
        }

        async adicionarItemsPedidoVehiculo(vehiculos:any[]){  
            console.log('vehiculos seleccionados para adicion de items',vehiculos);  
            if(vehiculos.length === 0){
                this.messageService.add({severity:'error', summary:'!Error', detail:'Debe seleccionar al menos un vehiculo para adicionar items'});
            }else{

                
                this.vehiculosSeleccionadoPedidos = [];
                // for(let vehiculo of vehiculos){
                //     //console.log('vehiculo seleccionado',vehiculo);
                //     let lineaVehiculo = this.vehiculos.find(vh => vh.code === vehiculo.placa);
                //     lineaVehiculo.cantidad = vehiculo.cantidad;
                //     lineaVehiculo.id_despacho = vehiculo.id_despacho;
                //     lineaVehiculo.key = vehiculo.key;
                //     this.vehiculosSeleccionadoPedidos.push(lineaVehiculo);
                // }

                //console.log(this.vehiculosSeleccionadoPedidos);

                this.vehiculosSeleccionadoPedidos = vehiculos;
                

                let clienteSeleccionado:any;
                if(Object.prototype.toString.call(this.clienteSeleccionado) === '[object Array]'){
                  clienteSeleccionado = this.clienteSeleccionado[0];
                }else{
                  clienteSeleccionado = this.clienteSeleccionado;
                }

                this.clienteSeleccionado2 = await clienteSeleccionado;

                this.getPedidosClientePorAlmacen(this.almacenSeleccionado.code,clienteSeleccionado.code);
                this.showItemsSelectedPedidosAlmacenCliente=false;
                this.dialogPedidosCliente = true;
                

            }
        }

        async quitarVehiculos(vehiculos:any[]){
            if(vehiculos.length === 0){
                this.messageService.add({severity:'error', summary:'!Error', detail:'Debe seleccionar al menos un vehiculo para desvincular de la solicitud'});
            }else{
                console.log('vehiculos seleccionados',vehiculos);
                
                for(let vehiculo of vehiculos){
                  let index = this.vehiculosSolicitud.findIndex(vh=>vh.index === vehiculo.index);
                  this.vehiculosSolicitud.splice(index,1);
                }

                this.messageService.add({severity:'success', summary:'OK', detail:'Las placas seleccionadas fueron removidaas correctamente.'});


            }

        }

        async adicionarItemPedido(placa:string){

            
            ////////////////////////////// //// ////////////console.log(placa);
            let vehiculo = await this.vehiculos.find(vehiculo =>vehiculo.code === placa);
            this.vehiculoSeleccionado = vehiculo;
            let clienteSeleccionado:any;
            if(Object.prototype.toString.call(this.clienteSeleccionado) === '[object Array]'){
              clienteSeleccionado = this.clienteSeleccionado[0];
            }else{
              clienteSeleccionado = this.clienteSeleccionado;
            }
            ////////////////////////// //// ////////////console.log(this.clienteSeleccionado[0])
            this.clienteSeleccionado2 = await clienteSeleccionado;
          
            await this.seleccionarVehiculo(this.vehiculoSeleccionado);
            //this.envioLineaCarguePedido = true;
            
            //let capacidadDisponibleVh = await this.cacluarCapacidadDisponibleVH(placa);
            //this.capacidadDisponibleVehiculo = this.capacidadVehiculo- capacidadDisponibleVh;
            
          
            this.getPedidosClientePorAlmacen(this.almacenSeleccionado.code,clienteSeleccionado.code);
          
            /*let pedidosVehiculo = await this.vehiculosEnSolicitud.find(vehiculo =>vehiculo.placa == placa).pedidos;
            //////////////////////////// //// ////////////console.log(pedidosVehiculo);
            //Modificar pedidos del cliente x almacen adicionando las cantidades cargadas de los pedidos asociadas al vehiculo 
          
            for(let pedidoVehiculo of pedidosVehiculo){
              let index = this.tablaPedidosAlmacenCliente.data.findIndex((pedido: {itemcode: any; docnum: any; }) => pedido.docnum == pedidoVehiculo.pedido && pedido.itemcode == pedidoVehiculo.itemcode);
              //////////////////////////// //// ////////////console.log(this.tablaPedidosAlmacenCliente.data[index].cargada,pedidoVehiculo.cantidad);
              this.tablaPedidosAlmacenCliente.data[index].cargada = pedidoVehiculo.cantidad;
            }*/
            
            this.dialogPedidosCliente = true;
        }

        quitarVehiculo(placa:string){
            //////console.log(placa);
            this.confirmRemoveVehiculo(placa);
        }
          
        quitarRegistro(placa:string,pedido:string,item:string, other?:any){
          
            let placaNode = other.parent.data.vehiculo;
            let pedidoNode = other.node.data.conductor.split('-')[0].trim()
            let itemNode = other.node.data.fechacargue.split('-')[0].trim();
            //////console.log(other,placaNode,pedidoNode,itemNode);
            this.confirmRemovePedidoItem(placaNode,pedidoNode,itemNode);
        }
          
        confirmRemoveVehiculo(placa:string) {
            this.confirmationService.confirm({
              message: 'Esta seguro de proceder con la eliminación del vehículo '+placa+', recuerde que los pedidos y productos asociados, tmabien seran elimnados de la lista?',
              header: 'Confirmación',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                  let index = this.vehiculosEnSolicitud.findIndex(vehiculo => vehiculo.placa == placa);
                  this.vehiculosEnSolicitud.splice(index,1);
                  this.messageService.add({severity:'info', summary:'Confirmado', detail:'El vhículo '+placa+' fue eliminado de la lista'});
                  //////////////////////////// //// ////////////console.log(this.vehiculosEnSolicitud);
                  this.generarTreeTable();
                  //////////////////////////// //// ////////////console.log(this.tablaPedidosAlmacenCliente);
          
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
                header: 'Confirmación',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
          
                    //this.mostrarLogs?//////console.log('Accion para remover linea de pedido asociado a un vehiculo'):null;
                    //this.mostrarLogs?//////console.log('Vehiculos en solicitud',this.vehiculosEnSolicitud):null;
                    
                    let index = this.vehiculosEnSolicitud.findIndex(vehiculo => vehiculo.placa == placa);
          
                    //this.mostrarLogs?//////console.log(`Index array vehiculos de la placa ${placa}`,index):null;
                    
                    let pedidos = this.vehiculosEnSolicitud[index].pedidos;
          
                    //this.mostrarLogs?//////console.log(`pedidos asociados al vehiculos de placa ${placa}`,pedidos):null;
                    
                    //let indexPedido = pedidos.findIndex((pedidovh: { pedido: string; itemcode: string; itemname: string; }) => pedidovh.pedido==pedido && pedidovh.itemcode+' - '+pedidovh.itemname == item);
                    let indexPedido = pedidos.findIndex((pedidovh: { pedido: string; itemcode: string; itemname: string; }) => pedidovh.pedido==pedido && pedidovh.itemcode == item);
          
                    //this.mostrarLogs?//////console.log(`Index array pedidos del pedido ${pedido} item ${item}`,indexPedido):null;
          
                    ////////////////////////// //// ////////////console.log(this.vehiculosEnSolicitud[index].pedidos,indexPedido);
                    this.vehiculosEnSolicitud[index].cantidad =this.vehiculosEnSolicitud[index].cantidad-eval(this.vehiculosEnSolicitud[index].pedidos[indexPedido].cantidad);
                    this.vehiculosEnSolicitud[index].pedidos.splice(indexPedido,1);
                    this.messageService.add({severity:'info', summary:'Confirmado', detail:'El item '+item+' fue eliminado de la lista'});
                    //////////////////////////// //// ////////////console.log(this.vehiculosEnSolicitud);
                    this.generarTreeTable();
                    //////////////////////////// //// ////////////console.log(this.tablaPedidosAlmacenCliente);
          
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

        async getPedidosClientePorAlmacen(almacen:string,cliente?:string){
            //this.pedidosAlmacenCliente = await this.pedidosService.getPedidosClientePorAlmacen(this.clienteSeleccionado, almacen);
            //let pedidosAlmacenCliente = this.pedidosCliente.filter(pedido => pedido.locacion === almacen && pedido.cardcode === cliente)
            let pedidosAlmacenCliente = this.pedidosCliente.filter(pedido => pedido.locacioncode === almacen && pedido.cardcode === cliente)
            //////////////// //// ////////////console.log('pedidosAlmacenCliente',pedidosAlmacenCliente);
            let pedidosAlmacenClienteCalcudada = await this.calcularCantidadesComprometidas(pedidosAlmacenCliente);
          
            
          
            this.pedidosAlmacenCliente = pedidosAlmacenClienteCalcudada;
          
            //////// //// ////////////console.log('pedidosAlmacenCliente',this.pedidosAlmacenCliente);
            
            this.configTablePedidosAlmacenCliente();
        }

        async calcularCantidadesComprometidas(pedidos:any):Promise<any[]>{
  
            for(let pedido of pedidos){
            //////console.log(pedido);
              let cantidadComprometida=0; 
              cantidadComprometida += await this.getCantidadComprometidaItemPedido(pedido.docnum,pedido.itemcode,pedido.codigo_almacen);
              cantidadComprometida += await this.getCantidadComprometidaItemPedidoInSolicitud(pedido.docnum,pedido.itemcode,pedido.codigo_almacen);
              
              pedido.comprometida = cantidadComprometida;
              //pedido.pendiente 
            }
          
            return pedidos;
        }
        
        async getCantidadComprometidaItemPedido(pedido:any, itemcode:string, bodega:string):Promise<number>{
  
            const cantidadComprometida$ = this.pedidosService.getCantidadesComprometidas(pedido,itemcode,bodega,0,'ENTREGA');
            const cantidadComprometida = await lastValueFrom(cantidadComprometida$);
          
            return cantidadComprometida;
          
          
        }

        async getCantidadComprometidaItemPedidoInSolicitud(pedido:any, itemcode:string, bodega:string): Promise<number>{
            //////////////////////// //// ////////////console.log(pedido, itemcode, bodega);
              let cantidadComprometida =0;
              for(let vehiculo of this.vehiculosEnSolicitud){
                  for(let lineaPedido of vehiculo.pedidos){
                   ////////////////////////// //// ////////////console.log(lineaPedido.pedido, lineaPedido.itemcode, lineaPedido.bodega);
                      if(lineaPedido.pedido == pedido && lineaPedido.itemcode == itemcode && lineaPedido.bodega == bodega){
                        
                        cantidadComprometida+=lineaPedido.cantidad;
                      }
                  }
              }
          
              return cantidadComprometida;
        }

        configTablePedidosAlmacenCliente(){
            ////console.log('this.pedidosAlmacenCliente',this.pedidosAlmacenCliente);
            let headersTable:any= this.configHeadersPedidos();
            let dataTable:any = this.configDataTablePedidos(this.pedidosAlmacenCliente);
             
            this.tablaPedidosAlmacenCliente = {
              header: headersTable,
              data: dataTable
            }
            
        }

        configHeadersPedidos(){
            let headersTable:any[] = [
              {
                'index': { label:'',type:'', sizeCol:'0rem', align:'center', editable:false},
                'motonave': { label:'Motonave',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'motonave'},
                'docnum': { label:'Número pedido',type:'text', sizeCol:'6rem', align:'center', editable:false,field:'docnum'},
                //'cardname':{label:'Cliente',type:'text', sizeCol:'8rem', align:'left', editable:false}, 
                //'docdate': {label:'Fecha de contabilización',type:'date', sizeCol:'6rem',  align:'center', editable:false},
                //'duedate': {label:'Fecha de vencimiento',type:'date', sizeCol:'6rem', align:'center', editable:false},
                //'estado_doc': {label:'Estado pedido',type:'text', sizeCol:'6rem', align:'center'},
                //'estado_linea': {label:'Estado Linea',type:'text', sizeCol:'6rem', align:'center', visible:false,},
                
                //'dias': {label:'Dias',type:'number', sizeCol:'6rem', align:'center',visible:false,},
                'linenum': {label:'Linea',type:'text', sizeCol:'6rem', align:'center',field:'linenum'},
                'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',field:'itemcode'},
                'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false, field:'itemname'},
                'almacen': {label:'Almacen.',type:'text', sizeCol:'6rem', align:'center', editable:false, field:'almacen'},
                'cantidad': {label:'Cantidad pedido',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false, field:'cantidad'},
                
                'pendiente': {label:'Cantidad pendiente',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false,field:'pendiente'},
                'comprometida': {label:'Cantidad comprometida',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false, field:'comprometida'},
                'disponible': {label:'Cantidad disponible',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false, field:'disponible'},
                //'cargada': {label:'Cantidad a descargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON", editable:false, field:'cargada'},
                
              }];
          
            //   if(this.verFletes){
            //     headersTable[0].tarifa =  {label:'Tarifa',type:'number', sizeCol:'6rem', align:'center',currency:"$", editable:false, field:'tarifa'}
            //     headersTable[0].flete =  {label:'Flete',type:'number', sizeCol:'6rem', align:'center',currency:"$", editable:true, field:'flete'}
            //   }
              
              return headersTable;
        }
          
        configDataTablePedidos(arregloPedido:any){
          
           //////console.log(arregloPedido);
          
              
             
              let dataTable:any[] = [];
              let index:number = 0;
              for (let pedido of arregloPedido){
                let cantidadComprometida= 0;
                dataTable.push({
                  index,
                  motonave:pedido.motonave,
                  docnum:pedido.docnum,
                  //cardname:pedido.cardname,
                  //docdate:pedido.docdate,
                  //duedate:pedido.duedate,
                  //estado_doc:pedido.estado_doc,
                  //estado_linea:pedido.estado_linea,
                  //dias:pedido.dias,
                  linenum:pedido.linenum,
                  itemcode:pedido.itemcode,
                  itemname:pedido.itemname,
                  almacen:pedido.codigo_almacen,
                  cantidad:pedido.cantidad,
                  pendiente:pedido.pendiente,
                  comprometida:pedido.comprometida,
                  disponible:(pedido.pendiente-pedido.comprometida)<0?0:(pedido.pendiente-pedido.comprometida),
                  //cargada:0,
                  //flete:0
                  
                });
          
                // if(this.verFletes){
                //   dataTable[dataTable.length-1].tarifa =pedido.itemcode.startsWith('SF')?pedido.precio_coniva:0;
                //   dataTable[dataTable.length-1].flete =0;
                  
                // }
                index++;
              } 
              
              return dataTable;
        }


        async filtrarCliente2(event: any) {
            this.clientesFiltrados2 =  this.filter(event,this.clienteSeleccionado);
        }
          
        seleccionarCliente2(clienteSeleccionado2:any){
               //////// //// ////////////console.log(clienteSeleccionado2, this.almacenSeleccionado)
                this.getPedidosClientePorAlmacen(this.almacenSeleccionado.code, clienteSeleccionado2.code);
        }   
          
        async filtrarMunicipio(event:any){
            this.municipiosFiltrados =  this.filter(event,this.municipios);
        }
          
        seleccionarMunicipio(){
           //////// //// ////////////console.log(this.municipioSeleccionado);
            this.municipioentrega = this.municipioSeleccionado.label;
        }

        async seleccionarPedidosAlmacenCliente(event:any){
 
             ////console.log('pedidos seleccionados',event);
             this.envioLineaCarguePedido =true;

             let toneladasVehiculos = 0;

             for(let vehiculo of this.vehiculosSeleccionadoPedidos){
                ////console.log('vehiculo seleccionado',vehiculo);
                toneladasVehiculos+=vehiculo.cantidad;     
             }
             ////console.log('toneladasVehiculos', toneladasVehiculos);
             //await this.vehiculosSeleccionadoPedidos.forEach((vehiculo=>{ toneladasVehiculos+=vehiculo.tipo_vehiculo.capacidad}));

             if(this.sitioentrega=="" || this.municipioentrega==""){
                 this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los campos resaltados en rojo son obligatorios'});
                 this.showItemsSelectedPedidosAlmacenCliente=false;
             }else{

                // const pedidosSeleccionados = await event.filter((pedido: { cargada: any; }) =>parseFloat(pedido.cargada)> 0);
                //////console.log('pedidos seleccionados',pedidosSeleccionados);
                //  if(pedidosSeleccionados.length > 0){
                    
                //      let totalCarga = 0;
                //      let error:boolean = false;
                //      for(let pedido of pedidosSeleccionados){
              
                //        //TODO Validar solo las lineas diferentes a flete   
              
                //        if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                //            totalCarga+=parseFloat(pedido.cargada);
              
                //            //this.mostrarLogs?//////console.log('Linea pedido',pedido):null;
            
                //            ////////console.log('pedido.cargada',parseFloat(pedido.cargada).toFixed(2))
                //            ////////console.log('pedido.disponible',parseFloat(pedido.disponible.toFixed(2)))            
                  
                //            if(parseFloat(parseFloat(pedido.cargada).toFixed(2))> parseFloat(parseFloat(pedido.disponible).toFixed(2)) ){
                            
                //              this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar (${pedido.cargada} TON) de la linea ${pedido.index+1} supera la cantidad disponible (${parseFloat(pedido.disponible).toFixed(2)} TON) del pedio - item`});
                //              error = true;
                //            }
                          
                //            if(parseFloat(parseFloat(pedido.cargada).toFixed(2))> parseFloat(parseFloat(pedido.pendiente).toFixed(2)) ){
                            
                //              this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La cantidad a cargar (${pedido.cargada} TON) de la linea ${pedido.index+1} supera la cantidad pendiente (${parseFloat(pedido.pendiente).toFixed(2)} TON) del pedio - item`});
                //              error = true;
                //            }
                  
                //            if(parseFloat(pedido.cargada)> this.capacidadDisponibleVehiculo ){
                //              this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `La cantidad a cargar (${pedido.cargada} TON) de la linea ${pedido.index+1} supera la capacidad disponible del vehículo seleccionado (${this.capacidadDisponibleVehiculo} TON)`});
                //              //error = true;
                //            }
              
                //            if(parseFloat(pedido.cargada)+this.pesobruto> this.pesoneto ){
                //              this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `La cantidad a cargar (${pedido.cargada} TON) de la linea ${pedido.index+1} mas el peso bruto (${this.pesobruto} TON) (${parseFloat(pedido.cargada)+this.pesobruto} TON) supera la capacidad máxima del vehículo seleccionado (${this.pesoneto} TON)`});
                //              //error = true;
                //            }
                //        }
                            
                //      }
              
                //      if(!error && totalCarga> this.capacidadDisponibleVehiculo){
                //          this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `El total a cargar (${totalCarga} TON) de los pedidos seleccionados, supera la capacidad disponible del vehículo seleccionado (${this.capacidadDisponibleVehiculo} TON)`});
                //          //error = true;
                //      }
              
                //      // TODO:: Si es transporta sociedad validar si exite linea de flete en seleccion
                //      if(!error && this.condicion_tpt=="TRANSP" && pedidosSeleccionados.filter((pedidoSeleccionado: { itemcode: string; }) =>pedidoSeleccionado.itemcode.toLowerCase().startsWith('sf')).length ===0){
                //        this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `No se ha seleccionado linea de flete para este item`});
                //        error = false;
              
                //      }
            
                //   //    if(!error && this.verFletes && pedidosSeleccionados.filter((pedidoSeleccionado: { itemcode: string; flete:number }) =>pedidoSeleccionado.itemcode.toLowerCase().startsWith('sf') && pedidoSeleccionado.flete ===0).length > 0){
                      
                //   //      this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `No ha ingresado el valor del flete en una linea de flete`});
                //   //      error = false;
                //   //    }
              
              
              
                //      if(!error){
                //          //Asignar pedidos al vehiculo
                //          //Obtener index del vehiculo en la solicitud
                //          let indexVehiculo = this.vehiculosEnSolicitud.findIndex(vehiculo => vehiculo.placa == this.vehiculoSeleccionado.code);
                //          //Obtener pedidos asociados al vehiculo en la solicitud
                //          let pdidosVehiculo:any[] = this.vehiculosEnSolicitud[indexVehiculo].pedidos;
                //          //////console.log(pdidosVehiculo)
                //          for(let pedido of pedidosSeleccionados){
              
                //          //////console.log('pedido seleccionado',pedido);
              
                //            if(pdidosVehiculo.length >0 && pdidosVehiculo.find((pedidovh: { pedido: any, itemcode:any, municipioentrega:any, lugarentrega:any, linenum:any }) => pedidovh.pedido == pedido.docnum && 
                //                                                                                                                                                                  pedidovh.itemcode == pedido.itemcode && 
                //                                                                                                                                                                  pedidovh.municipioentrega == this.municipioentrega &&
                //                                                                                                                                                                  pedidovh.linenum == pedido.linenum &&
                //                                                                                                                                                                  pedidovh.lugarentrega == this.sitioentrega)!=undefined){
                //              if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                //                let indexPedido = pdidosVehiculo.findIndex((pedidovh: { pedido: any, itemcode:any, municipioentrega:any, lugarentrega:any, linenum:any }) => pedidovh.pedido == pedido.docnum && 
                //                                                                                                                                                              pedidovh.itemcode == pedido.itemcode && 
                //                                                                                                                                                              pedidovh.municipioentrega == this.municipioentrega &&
                //                                                                                                                                                              pedidovh.linenum == pedido.linenum &&
                //                                                                                                                                                              pedidovh.lugarentrega == this.sitioentrega);
                //                pdidosVehiculo[indexPedido].cantidad += parseFloat(pedido.cargada);
                //              }
                            
                //            }else{
                //                  pdidosVehiculo.push({
                  
                //                        pedido:pedido.docnum,
                //                        docentry:this.pedidosAlmacenCliente.find(pedidoCliente=>pedidoCliente.docnum==pedido.docnum ).docentry,
                //                        itemcode:pedido.itemcode,
                //                        itemname:pedido.itemname,
                //                        cantidad_pedido:parseFloat(pedido.pendiente),
                //                        cantidad:parseFloat(pedido.cargada),
                //                        bodega:pedido.almacen,
                //                        CardCode:this.clienteSeleccionado2.CardCode,
                //                        CardName:this.clienteSeleccionado2.CardName,
                //                        linenum:pedido.linenum,
                //                        municipioentrega:this.municipioentrega,
                //                        lugarentrega:this.sitioentrega,
                //                        cliente:this.clienteSeleccionado2.CardName,
                //                        //flete:this.verFletes?pedido.flete:0,
                //                        flete:0,
                //                        Maneja_lote:pedido.Maneja_Lote
              
                //                  });
            
                                
                //            }
                          
                //          }
            
                //          //////console.log(pdidosVehiculo,this.pedidosCliente);
              
                //          this.vehiculosEnSolicitud[indexVehiculo].cantidad = await this.cantidadCargaVehiculo(this.vehiculoSeleccionado.code);
                //          this.vehiculosEnSolicitud[indexVehiculo].pedidos = pdidosVehiculo;
                //          this.envioLineaCarguePedido =false;
                //          this.dialogPedidosCliente = false;
                //          this.pedidosAlmacenCliente = await this.calcularCantidadesComprometidas(this.pedidosAlmacenCliente);
                //          ////////////// //// ////////////console.log(this.vehiculosEnSolicitud);
                //          this.configTablePedidosAlmacenCliente();
                //          this.generarTreeTable();
                //      }
                  
              
              
                //  }else{
                //      this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe seleccionar al menos un pedido - Item'});
                //  }
                // this.showItemsSelectedPedidosAlmacenCliente=false;
                

                if(event.length===0 ){
                  this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe seleccionar al menos un pedido - Item'});
                }else if( event.length>1){
                  this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe seleccionar solo un pedido - Item'});
                }else if( event[0].disponible < toneladasVehiculos){
                  this.messageService.add({severity:'error', summary: '!Error¡', detail: `La cantidad a cargar de las placas seleccionadas (${toneladasVehiculos} TON) es mayor a la cantidad disponible del pedido/item seleccionado (${event[0].disponible} TON)`});
                }else{
                    //console.log('linea item seleccionado',event)

                    //Recorrer array de placas seleccinadas
                    for(let vehiculo of this.vehiculosSeleccionadoPedidos){
                      //Buscar placa de vehiculo seleccionado en array de vehiculos en solicitud
                      
                      
                      let index = this.vehiculosSolicitud.findIndex(vehiculoSolicitud=>vehiculoSolicitud.key === vehiculo.key) ;
                      // //console.log('index',index);
                      // //console.log('this.vehiculosSolicitud[index]',this.vehiculosSolicitud[index])


                      this.vehiculosSolicitud[index].itemName = event[0].itemname;
                      this.vehiculosSolicitud[index].pedido = event[0].docnum;
                      this.vehiculosSolicitud[index].motonave = event[0].motonave;
                      this.vehiculosSolicitud[index].itemCode = event[0].itemcode;
                      this.vehiculosSolicitud[index].sitioentrega =this.sitioentrega;
                      this.vehiculosSolicitud[index].municipioentrega=this.municipioentrega;
                      this.vehiculosSolicitud[index].pedidos = [{
                                              pedido:event[0].docnum,
                                              docentry:this.pedidosAlmacenCliente.find(pedidoCliente=>pedidoCliente.docnum==event[0].docnum ).docentry,
                                              itemcode:event[0].itemcode,
                                              itemname:event[0].itemname,
                                              cantidad_pedido:parseFloat(event[0].pendiente),
                                              cantidad:parseFloat(vehiculo.cantidad),
                                              bodega:event[0].almacen,
                                              CardCode:this.clienteSeleccionado2.CardCode,
                                              CardName:this.clienteSeleccionado2.CardName,
                                              linenum:event[0].linenum,
                                              municipioentrega:this.municipioentrega,
                                              lugarentrega:this.sitioentrega,
                                              cliente:this.clienteSeleccionado2.CardName,
                                              //flete:this.verFletes?pedido.flete:0,
                                              flete:0,
                                              Maneja_lote:event[0].Maneja_Lote
                                        }]
                    }

                    // for(let vehiculo of this.vehiculosSolicitud ){
                    //   vehiculo.itemName = event[0].itemname;
                    //   vehiculo.itemCode = event[0].itemcode;
                    //   vehiculo.sitioentrega =this.sitioentrega;
                    //   vehiculo.municipioentrega=this.municipioentrega;
                    //   vehiculo.pedidos = [{
                    //                           pedido:event[0].docnum,
                    //                           docentry:this.pedidosAlmacenCliente.find(pedidoCliente=>pedidoCliente.docnum==event[0].docnum ).docentry,
                    //                           itemcode:event[0].itemcode,
                    //                           itemname:event[0].itemname,
                    //                           cantidad_pedido:parseFloat(event[0].pendiente),
                    //                           cantidad:parseFloat(vehiculo.cantidad),
                    //                           bodega:event[0].almacen,
                    //                           CardCode:this.clienteSeleccionado2.CardCode,
                    //                           CardName:this.clienteSeleccionado2.CardName,
                    //                           linenum:event[0].linenum,
                    //                           municipioentrega:this.municipioentrega,
                    //                           lugarentrega:this.sitioentrega,
                    //                           cliente:this.clienteSeleccionado2.CardName,
                    //                           //flete:this.verFletes?pedido.flete:0,
                    //                           flete:0,
                    //                           Maneja_lote:event[0].Maneja_Lote
                    //                     }]
                    // }

                    ////console.log('this.vehiculosSolicitud',this.vehiculosSolicitud)

                    this.envioLineaCarguePedido =false;
                    this.dialogPedidosCliente = false;
                }

                this.showItemsSelectedPedidosAlmacenCliente=false;
             
             }
             
        }

        async cantidadCargaVehiculo(placa:string):Promise<number>{
            let cantidadCargada =0;
            let vehiculo = this.vehiculosEnSolicitud.find(vehiculo =>vehiculo.placa == placa);
            for(let pedidoVehiculo of vehiculo.pedidos){
              ////////////////// //// ////////////console.log(pedidoVehiculo)
              if(!pedidoVehiculo.itemcode.toLowerCase().startsWith("sf")){
                cantidadCargada+=eval(pedidoVehiculo.cantidad);
              }
            }
            return cantidadCargada;
        }

        confirmarSeleccionPedidosAlmacenCliente(){
            this.showItemsSelectedPedidosAlmacenCliente=true;
            
            //this.dialogPedidosCliente = false;
        }

        setTimer(){
            if(this.completeCargue){
              this.displayModal = false;
            }
            this.completeTimer = true;
            
        }

        grabarSolicitud2(){

            //////////////////////////// //// ////////////console.log(this.vehiculosEnSolicitud);
            this.displayModal = true;
            this.loadingCargue = true;
            this.completeCargue=false;
            this.completeTimer = false;
          
            //setTimeout(this.setTimer,2500);
            setTimeout(()=>{this.setTimer()},2500);
           
            //Validar existencia de pedidos en vehiculos
            let error = false;
            let detalle_solicitud:any[] = [];
          
            
            
            for(let vehiculo of this.vehiculosEnSolicitud){
          
              if(vehiculo.pedidos.filter((pedidoVh: { itemcode: string; }) =>pedidoVh.itemcode.toLowerCase().startsWith("sf")).length ==0 && this.condicion_tpt=='TRANSP'){
                this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} no se le ha asignado el item de flete`});
                //error = false;
                //this.displayModal = false;
              }
          
              if(vehiculo.pedidos.filter((pedidoVh: { itemcode: string; }) =>pedidoVh.itemcode.toLowerCase().startsWith("sf")).length == vehiculo.pedidos.length && this.condicion_tpt=='TRANSP'){
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} no se le han asignado items de materialies`});
                //error = false;
                //this.displayModal = false;
              }
          
              if(vehiculo.pedidos.length == 0){
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} no se le han asignado pedidos`});
                error = true;
                this.displayModal = false;
              }else/* if(vehiculo.pedidos.filter((pedidoVh: { itemcode: string; }) =>pedidoVh.itemcode.toLowerCase().startsWith("sf")).length ==0 && this.condicion_tpt=='TRANSP'){
                this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} no se le ha asignado el item de flete`});
                error = false;
                this.displayModal = false;
              }else if(vehiculo.pedidos.filter((pedidoVh: { itemcode: string; }) =>pedidoVh.itemcode.toLowerCase().startsWith("sf")).length >1 && this.condicion_tpt=='TRANSP'){
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} solo se le puede asignar un solo item de flete`});
                error = true;
                this.displayModal = false;
              }else if(vehiculo.pedidos.filter((pedidoVh: { itemcode: string; }) =>pedidoVh.itemcode.toLowerCase().startsWith("sf")).length == vehiculo.pedidos.length && this.condicion_tpt=='TRANSP'){
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} no se le han asignado items de materialies`});
                error = false;
                this.displayModal = false;
              }else*/{
                let pedidosVehiculo:any[] = [];
                // ////////////console.log(this.pedidosCliente);
                for(let pedido of vehiculo.pedidos){
                  //////console.log('this.pedidosCliente',this.pedidosCliente);
                 ////// //// ////////////console.log(this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode));
                  let infoPedido = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode);
                 ////console.log('infoPedido',infoPedido);
                  /*
                  let email_vendedor = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode)[0].email_vendedor;
                  let vendedor = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode)[0].vendedor;
                  let dependencia = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode)[0].dependencia;
                  
                  let localidad = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode)[0].localidad;
          
                  let tipoproducto = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode)[0].tipoprod;
                  */
          
                  let email_vendedor = infoPedido[0].email_vendedor;
                  let vendedor = infoPedido[0].vendedor;
                  let dependencia = infoPedido[0].dependencia;
                  let localidad = infoPedido[0].localidad;
                  let tipoproducto = infoPedido[0].tipoprod;
                  let tarifa_tonelada = this.condicion_tpt=='TRANSP' && pedido.itemcode.startsWith('SF')?infoPedido[0].precio_coniva:0; 
                  let nombre_asistente = infoPedido[0].nombre_asistente;
                  let email_asistente = infoPedido[0].email_asistente;
                  let Maneja_lote = infoPedido[0].Maneja_Lote;
                  let tipo_documento = infoPedido[0].tipo_pedido;
                  let objectType = infoPedido[0].ObjType;
                  let vicepresidencia = infoPedido[0].vicepresidencia;
                  let ivacode = infoPedido[0].ivacode;
                  let precio_lista = infoPedido[0].precio_lista;
                  let precio_vendedor = infoPedido[0].precio_vendedor;
                  let precio_gerente = infoPedido[0].precio_gerente;
                  let categoria_item = infoPedido[0].categoria_item;
                  let subcategoria_item = infoPedido[0].subcategoria_item;
                  let almacen_fpp = infoPedido[0].almacen_fpp;
                  let bodega_destino = infoPedido[0].bodega_destino;
                  let bodega_final = infoPedido[0].bodega_final;
                  let ubicacion = infoPedido[0].ubicacion;
                  let codigo_vendedor = infoPedido[0].codigo_vendedor;
                  let precio_unitario = infoPedido[0].precio_unitario;
                  let tipo_operacion = infoPedido[0].tipo_operacion;
                  
                  
          
          
                 // let flete_tonelada = this.verFletes?pedido.flete:0;
                 let flete_tonelada = 0;
          
          
                  pedidosVehiculo.push({
                    pedidonum:pedido.pedido,
                    docentry:pedido.docentry,
                    itemcode:pedido.itemcode,
                    itemname:pedido.itemname,
                    cantidad_pedido:pedido.cantidad_pedido,
                    cantidad:pedido.cantidad,
                    bodega: pedido.bodega,
                    CardCode: pedido.CardCode,
                    CardName: pedido.CardName,
                    email_vendedor: email_vendedor,
                    linea:pedido.linenum,
                    municipioentrega:pedido.municipioentrega,
                    lugarentrega:pedido.lugarentrega,
                    dependencia,
                    localidad,
                    tipoproducto,
                    vendedor,
                    tarifa_tonelada,
                    flete_tonelada,
                    nombre_asistente,
                    email_asistente,
                    Maneja_lote,
                    tipo_documento,
                    objectType,
                    vicepresidencia,
                    ivacode,
                    precio_lista,
                    precio_vendedor,
                    precio_gerente,
                    categoria_item,
                    subcategoria_item,
                    almacen_fpp,
                    bodega_destino,
                    ubicacion,
                    codigo_vendedor,
                    precio_unitario,
                    tipo_operacion,
                    bodega_final
          
                  });
                  
                  
          
                }
          
          
                detalle_solicitud.push({
                  fechacita:vehiculo.fechacargue,
                  horacita:vehiculo.horacargue,
                  lugarentrega:vehiculo.sitioentrega,
                  municipioentrega:vehiculo.municipioentrega,
                  observacion:vehiculo.observacion!=''?`${vehiculo.observacion};`:'',
                  condiciontpt: this.condicion_tpt,
                  transportadora:this.transportadoras.find(transportadora => transportadora.code === vehiculo.transportadora).id,
                  vehiculo:this.vehiculos.find(vehiculoo => vehiculoo.code === vehiculo.placa).id,
                  conductor:this.conductores.find(conductor=>conductor.code === vehiculo.conductor).id,
                  locacion:this.almacenSeleccionado.code,
                  pedidos_detalle_solicitud:pedidosVehiculo,
                  tipo:'ENTREGA'
                });
              }
            }
          
            if (!error) {
          
                let clientesSolicitud:any[] = this.multiplesClientes?
                                                  this.clienteSeleccionado.map((cliente: { id: any; }) =>{return cliente.id}):
                                                  [this.clienteSeleccionado].map((cliente: { id: any; }) =>{return cliente.id});
                const newSolicitud:any = {
                  clientes: clientesSolicitud,
                  detalle_solicitud
                }
               
               ////console.log('newSolicitud',newSolicitud);
                
                
               this.solicitudTurnoService.create(newSolicitud)
                    .subscribe({
                          next:async (result)=>{
                           
                            if(this.completeTimer){
                              this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el registro de la solicitud.`});
                              this.displayModal = false;
                              this.loadingCargue = false;
                              
                            }
                            this.completeCargue = true;
                            this.messageComplete = `Se completo correctamente el porceso de registro de la solicitud.`;
                            
                            
                            this.solicitudTurnoService.getSolicitudesTurnoById(result.id)
                                .subscribe({
                                      next:async (solicitud)=>{
                                        //await this.bloqueoPedidosSolicitud(solicitud);
                                        await this.configEmails(solicitud);
                                      },
                                      error:(err)=>{
                                        console.error(err);
                                        this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});            
                                      }
                            });
          
                            
                            
                          },
                          error:(err)=>{
                            this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});
                            console.error(err);
                            this.displayModal = false;
                            this.loadingCargue = false;
                          }
                });
                
                  
            }
        }

        grabarSolicitud(){

          //////////////////////////// //// ////////////console.log(this.vehiculosEnSolicitud);
          this.displayModal = true;
          this.loadingCargue = true;
          this.completeCargue=false;
          this.completeTimer = false;
        
          //setTimeout(this.setTimer,2500);
          setTimeout(()=>{this.setTimer()},2500);
         
          //Validar existencia de pedidos en vehiculos
          let error = false;
          let detalle_solicitud:any[] = [];
        
          
          
          for(let vehiculo of this.vehiculosSolicitud){
        
            // if(vehiculo.pedidos.filter((pedidoVh: { itemcode: string; }) =>pedidoVh.itemcode.toLowerCase().startsWith("sf")).length ==0 && this.condicion_tpt=='TRANSP'){
            //   this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} no se le ha asignado el item de flete`});
            //   //error = false;
            //   //this.displayModal = false;
            // }
        
            // if(vehiculo.pedidos.filter((pedidoVh: { itemcode: string; }) =>pedidoVh.itemcode.toLowerCase().startsWith("sf")).length == vehiculo.pedidos.length && this.condicion_tpt=='TRANSP'){
            //   this.messageService.add({severity:'error', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} no se le han asignado items de materialies`});
            //   //error = false;
            //   //this.displayModal = false;
            // }
        
            if(vehiculo.pedidos.length == 0){
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} no se le han asignado pedidos`});
              error = true;
              this.displayModal = false;
            }else/* if(vehiculo.pedidos.filter((pedidoVh: { itemcode: string; }) =>pedidoVh.itemcode.toLowerCase().startsWith("sf")).length ==0 && this.condicion_tpt=='TRANSP'){
              this.messageService.add({severity:'warn', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} no se le ha asignado el item de flete`});
              error = false;
              this.displayModal = false;
            }else if(vehiculo.pedidos.filter((pedidoVh: { itemcode: string; }) =>pedidoVh.itemcode.toLowerCase().startsWith("sf")).length >1 && this.condicion_tpt=='TRANSP'){
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} solo se le puede asignar un solo item de flete`});
              error = true;
              this.displayModal = false;
            }else if(vehiculo.pedidos.filter((pedidoVh: { itemcode: string; }) =>pedidoVh.itemcode.toLowerCase().startsWith("sf")).length == vehiculo.pedidos.length && this.condicion_tpt=='TRANSP'){
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  `Al vehículo ${vehiculo.placa} no se le han asignado items de materialies`});
              error = false;
              this.displayModal = false;
            }else*/{
              let pedidosVehiculo:any[] = [];
              // ////////////console.log(this.pedidosCliente);
              for(let pedido of vehiculo.pedidos){
                //////console.log('this.pedidosCliente',this.pedidosCliente);
               ////// //// ////////////console.log(this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode));
                let infoPedido = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode);
               ////console.log('infoPedido',infoPedido);
                /*
                let email_vendedor = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode)[0].email_vendedor;
                let vendedor = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode)[0].vendedor;
                let dependencia = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode)[0].dependencia;
                
                let localidad = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode)[0].localidad;
        
                let tipoproducto = this.pedidosCliente.filter(pedidoCliente=>pedidoCliente.docnum === pedido.pedido && pedidoCliente.itemcode === pedido.itemcode)[0].tipoprod;
                */
        
                let email_vendedor = infoPedido[0].email_vendedor;
                let vendedor = infoPedido[0].vendedor;
                let dependencia = infoPedido[0].dependencia;
                let localidad = infoPedido[0].localidad;
                let tipoproducto = infoPedido[0].tipoprod;
                let tarifa_tonelada = this.condicion_tpt=='TRANSP' && pedido.itemcode.startsWith('SF')?infoPedido[0].precio_coniva:0; 
                let nombre_asistente = infoPedido[0].nombre_asistente;
                let email_asistente = infoPedido[0].email_asistente;
                let Maneja_lote = infoPedido[0].Maneja_Lote;
                let tipo_documento = infoPedido[0].tipo_pedido;
                let objectType = infoPedido[0].ObjType;
                let vicepresidencia = infoPedido[0].vicepresidencia;
                let ivacode = infoPedido[0].ivacode;
                let precio_lista = infoPedido[0].precio_lista;
                let precio_vendedor = infoPedido[0].precio_vendedor;
                let precio_gerente = infoPedido[0].precio_gerente;
                let categoria_item = infoPedido[0].categoria_item;
                let subcategoria_item = infoPedido[0].subcategoria_item;
                let almacen_fpp = infoPedido[0].almacen_fpp;
                let bodega_destino = infoPedido[0].bodega_destino;
                let bodega_final = infoPedido[0].bodega_final;
                let ubicacion = infoPedido[0].ubicacion;
                let codigo_vendedor = infoPedido[0].codigo_vendedor;
                let precio_unitario = infoPedido[0].precio_unitario;
                let tipo_operacion = infoPedido[0].tipo_operacion;
                let motonave = infoPedido[0].motonave;
                
                
        
        
               // let flete_tonelada = this.verFletes?pedido.flete:0;
               let flete_tonelada = 0;
        
        
                pedidosVehiculo.push({
                  pedidonum:pedido.pedido,
                  docentry:pedido.docentry,
                  itemcode:pedido.itemcode,
                  itemname:pedido.itemname,
                  cantidad_pedido:pedido.cantidad_pedido,
                  cantidad:pedido.cantidad,
                  bodega: pedido.bodega,
                  CardCode: pedido.CardCode,
                  CardName: pedido.CardName,
                  email_vendedor: email_vendedor,
                  linea:pedido.linenum,
                  municipioentrega:pedido.municipioentrega,
                  lugarentrega:pedido.lugarentrega,
                  dependencia,
                  localidad,
                  tipoproducto,
                  vendedor,
                  tarifa_tonelada,
                  flete_tonelada,
                  nombre_asistente,
                  email_asistente,
                  Maneja_lote,
                  tipo_documento,
                  objectType,
                  vicepresidencia,
                  ivacode,
                  precio_lista,
                  precio_vendedor,
                  precio_gerente,
                  categoria_item,
                  subcategoria_item,
                  almacen_fpp,
                  bodega_destino,
                  ubicacion,
                  codigo_vendedor,
                  precio_unitario,
                  tipo_operacion,
                  bodega_final,
                  motonave
        
                });
                
                
        
              }
        
              let linea_detalle:any = {
                fechacita:vehiculo.fechacargue,
                horacita:vehiculo.horacargue,
                lugarentrega:vehiculo.sitioentrega,
                municipioentrega:vehiculo.municipioentrega,
                observacion:vehiculo.observacion!=''?`${vehiculo.observacion};`:'',
                condiciontpt: this.condicion_tpt,
                transportadora:this.transportadoras.find(transportadora => transportadora.code === vehiculo.transportadora).id,
                vehiculo:this.vehiculos.find(vehiculoo => vehiculoo.code === vehiculo.placa).id,
                conductor:this.conductores.find(conductor=>conductor.code === vehiculo.cedula).id,
                locacion:this.almacenSeleccionado.code,
                pedidos_detalle_solicitud:pedidosVehiculo,
                tipo:'ENTREGA'
              }

              if(vehiculo.id_despacho){
                linea_detalle.id_despacho_puerto = vehiculo.id_despacho;
              }
        
              detalle_solicitud.push(linea_detalle);

              
            }
          }
        
          if (!error) {
        
              let clientesSolicitud:any[] = this.multiplesClientes?
                                                this.clienteSeleccionado.map((cliente: { id: any; }) =>{return cliente.id}):
                                                [this.clienteSeleccionado].map((cliente: { id: any; }) =>{return cliente.id});
              const newSolicitud:any = {
                clientes: clientesSolicitud,
                detalle_solicitud
              }
             
             ////console.log('newSolicitud',newSolicitud);
              
              
             this.solicitudTurnoService.create(newSolicitud)
                  .subscribe({
                        next:async (result)=>{
                         
                          if(this.completeTimer){
                            this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha realizado correctamente el registro de la solicitud.`});
                            this.displayModal = false;
                            this.loadingCargue = false;
                            
                          }
                          this.completeCargue = true;
                          this.messageComplete = `Se completo correctamente el porceso de registro de la solicitud.`;
                          
                          
                          this.solicitudTurnoService.getSolicitudesTurnoById(result.id)
                              .subscribe({
                                    next:async (solicitud)=>{
                                      //await this.bloqueoPedidosSolicitud(solicitud);
                                      await this.configEmails(solicitud);
                                    },
                                    error:(err)=>{
                                      console.error(err);
                                      this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});            
                                    }
                          });
        
                          
                          
                        },
                        error:(err)=>{
                          this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});
                          console.error(err);
                          this.displayModal = false;
                          this.loadingCargue = false;
                        }
              });
              
                
          }
      }

        async configEmails(dataSolicitud:any): Promise<void>{
    
            ////////////// //// ////////////console.log(JSON.stringify(dataSolicitud));
            //////// //// ////////////console.log(dataSolicitud);
        
            await this.emailsClientes(dataSolicitud);
            await this.emailsVendedores(dataSolicitud);
            await this.emailBodegaEstado(dataSolicitud);
            if(this.condicion_tpt==="TRANSP"){
              await this.emailTransp(dataSolicitud);
            }
            await this.emailCreador(dataSolicitud);
            /*
            let clientesSolicitud:any[] = dataSolicitud.clientes;
            let turnosSolicitud:any[] = dataSolicitud.detalle_solicitud_turnos;
            let idSolicitud:number = dataSolicitud.id;
            let locacion:any = this.almacenSeleccionado.label;
            let emailBodega:string = 'ralbor@nitrofert.com.co'
            //let emailBodega:string = this.almacenSeleccionado.email;
            let objectMail:any;
            let usuarioCreador:any = await this.usuariosService.infoUsuario();
            ////////////////// //// ////////////console.log(usuarioCreador);
            let totalvehiculos:number =0;
            let totaltoneladas:number = 0;
        
            // Envio de email a los clientes asociados al turno
            
          //Configuracion y envio de correo para los clientes en la solicitud
            for(let cliente of clientesSolicitud){
              let turnosCliente:any[] = [];
              totalvehiculos =0;
              totaltoneladas = 0;
                for(let turnoSolicitud of turnosSolicitud){
                    let pedidosTurnoCliente:any[] = [];
                    
                    for(let pedidoCliente of turnoSolicitud.detalle_solicitud_turnos_pedido){
                        if(pedidoCliente.CardCode === cliente.CardCode){
                          pedidosTurnoCliente.push(pedidoCliente);
                          if(!pedidoCliente.itemcode.toLowerCase().startsWith("sf")){
                            totaltoneladas+=pedidoCliente.cantidad;
                          }
                          
                        }
                    }
                    if(pedidosTurnoCliente.length >0){
                      
                      turnosCliente.push({
                       
                        estado:turnoSolicitud.estado,
                        fechacita:new Date(turnoSolicitud.fechacita).toLocaleDateString(),
                        horacita:new Date(turnoSolicitud.horacita).toLocaleTimeString(),
                        id:turnoSolicitud.id,
                        locacion:turnoSolicitud.locacion,
                        lugarentrega:turnoSolicitud.lugarentrega,
                        municipioentrega:turnoSolicitud.municipioentrega,
                        observacion:turnoSolicitud.observacion,
                        transportadora:turnoSolicitud.transportadora,
                        vehiculo:turnoSolicitud.vehiculo,
                        conductor:turnoSolicitud.conductor,
                        detalle_solicitud_turnos_pedido:pedidosTurnoCliente
                      });
                      totalvehiculos++;
                    }
        
                } 
                cliente.turnos =  turnosCliente;
                cliente.telefono =0;
        
                  
                
                if(cliente.EmailAddress==null || cliente.EmailAddress==undefined){
                  //Obtenert email del cliente del usuario segun el cardcode 
                  let usuarioCliente = await this.usuariosService.infoUsuarioByCardCode(cliente.CardCode);
                  ////////////////// //// ////////////console.log('usuarioCliente',usuarioCliente);
                  if(usuarioCliente!=false){
                    cliente.EmailAddress = usuarioCliente.email;
                    //////////////// //// ////////////console.log('usuarioCliente.email',usuarioCliente.email);
                  }
                  
                }
                
                
                //Enviar Correo al cliente
                if(cliente.EmailAddress!=null || cliente.EmailAddress!=undefined){
        
                  objectMail = {
                      //to:cliente.EmailAddress,
                      to:usuarioCreador.email,
                      subject:`Solicitud de cargue # ${dataSolicitud.id}`,
                      template:'./notificacion_solicitud',
                      context:{
                                  name:cliente.CardName,
                                  solicitud_num:dataSolicitud.id,
                                  fechasolicitud: new Date(dataSolicitud.createdAt).toLocaleDateString(),
                                  locacion,
                                  totalvehiculos,
                                  totaltoneladas,
                                  cliente
                      }         
                    };
                    //////////////// //// ////////////console.log('objectMail Cliente',objectMail);
                    //////////////// //// ////////////console.log(await this.functionsService.sendMail(objectMail));
                }
        
                // Configuracion de email para jefe de zona o vendedor
                
            }
        
           
        
            if(emailBodega){
        
              totaltoneladas =0;
        
              turnosSolicitud.forEach((turno:any)=>{
                turno.fechacita =new Date(turno.fechacita).toLocaleDateString(),
                turno.horacita= new Date(turno.horacita).toLocaleTimeString(),
                turno.detalle_solicitud_turnos_pedido.forEach((pedido:any)=>{
                  if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                    totaltoneladas+= parseFloat(pedido.cantidad);
                  }
                  
                });
              });
        
        
              objectMail = {
                //to:cliente.EmailAddress,
                to:emailBodega,
                subject:`Solicitud de cargue # ${dataSolicitud.id}`,
                template:'./notificacion_solicitud2',
                context:{
                            name:emailBodega,
                            solicitud_num:dataSolicitud.id,
                            fechasolicitud: new Date(dataSolicitud.createdAt).toLocaleDateString(),
                            locacion,
                            totalvehiculos:turnosSolicitud.length,
                            totaltoneladas,
                            turnos:turnosSolicitud
                            
                }         
              };
              //////////////// //// ////////////console.log('objectMail Bodega',objectMail);
              //////////////// //// ////////////console.log(await this.functionsService.sendMail(objectMail));
            }
            */
        
        
        
        }

        async emailsClientes(solicitud:any):Promise<void> {

            let infoUsuario = await this.usuariosService.infoUsuario();
        
            let turnosCliente:any[] = []; 
            solicitud.detalle_solicitud_turnos.forEach((turno: {
            conductor: any;
            vehiculo: any;
            transportadora: any; detalle_solicitud_turnos_pedido: any[]; id: number; estado: any; fechacita: any; horacita: any; locacion: any; lugarentrega: any; municipioentrega: any; observacion: any; })=>{
            
            turno.detalle_solicitud_turnos_pedido.forEach((pedido)=>{
                //////////////// //// ////////////console.log(turno.id, pedido.CardCode);
                let email_cliente = solicitud.clientes.find((cliente: { CardCode: any; })=>cliente.CardCode === pedido.CardCode).EmailAddress;
                if(turnosCliente.filter(cliente=>cliente.codigo===pedido.CardCode).length === 0){
        
                    let turnoCliente:any;
        
                    turnoCliente ={
                        id:turno.id,
                        estado:turno.estado,
                        fechacita:new Date(turno.fechacita).toLocaleDateString(),
                        horacita:new Date(turno.horacita).toLocaleTimeString(),
                        locacion:turno.locacion,
                        lugarentrega:turno.lugarentrega,
                        municipioentrega:turno.municipioentrega,
                        observacion:turno.observacion,
                        detalle_solicitud_turnos_pedido:[pedido],
                        toneladas_turno: !pedido.itemcode.toLowerCase().startsWith("sf")?pedido.cantidad:0,
                        transportadora:turno.transportadora,
                        vehiculo:turno.vehiculo,
                        conductor:turno.conductor,
                    }
        
                    turnosCliente.push({
                        codigo:pedido.CardCode,
                        nombre:pedido.CardName,
                        email:email_cliente,
                        tipo:'cliente',
        
                        turnos:[turnoCliente]
                    });
                }else{
                    
                    let indexCliente = turnosCliente.findIndex(cliente=>cliente.codigo === pedido.CardCode);
                    //////////////// //// ////////////console.log(turnosCliente[indexCliente]);
        
                    if(turnosCliente[indexCliente].turnos.filter((turnoCliente: { id: number; })=>turnoCliente.id === turno.id).length ==0){
                        let turnoCliente:any;
                        turnoCliente ={
                        id:turno.id,
                        estado:turno.estado,
                        fechacita:new Date(turno.fechacita).toLocaleDateString(),
                        horacita:new Date(turno.horacita).toLocaleTimeString(),
                        locacion:turno.locacion,
                        lugarentrega:turno.lugarentrega,
                        municipioentrega:turno.municipioentrega,
                        observacion:turno.observacion,
                        detalle_solicitud_turnos_pedido:[pedido],
                        toneladas_turno: !pedido.itemcode.toLowerCase().startsWith("sf")?pedido.cantidad:0,
                        transportadora:turno.transportadora,
                        vehiculo:turno.vehiculo,
                        conductor:turno.conductor,
                        }
                        
                        turnosCliente[indexCliente].turnos.push(turnoCliente);
                    }else{
                        let indexTurno = turnosCliente[indexCliente].turnos.findIndex((turnoCliente: { id: number; })=>turnoCliente.id === turno.id)
                        //////////////// //// ////////////console.log(turnosCliente[indexCliente].turnos[indexTurno]);
                        turnosCliente[indexCliente].turnos[indexTurno].detalle_solicitud_turnos_pedido.push(pedido);
                        if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                        turnosCliente[indexCliente].turnos[indexTurno].toneladas_turno+=pedido.cantidad;
                        }
                        
                    }
                    
                }
            })
            
            });
        
        
        
            //////// //// ////////////console.log(turnosCliente);
        
            turnosCliente.forEach(async (cliente)=>{
            //////// //// ////////////console.log('cliente', cliente);
            // if(cliente.email!='' && cliente.email!=null){
        
                let clienteTurno:any = solicitud.clientes.find((clienteSolicitud: { CardCode: any; }) => clienteSolicitud.CardCode === cliente.codigo);
                //////// //// ////////////console.log('solicitud.clientes',clienteTurno);
        
                //clienteTurno.turnos = cliente.turnos;
                let objectMail = {
                to:infoUsuario.email,
                //to:this.domain=='localhost'?'ralbor@nitrofert.com.co':cliente.email,
                from:`"Portal de autogestión Nitrofert" <notificacionapp@nitrofert.com.co>`,
                subject:`Solicitud de cargue # ${solicitud.id}`,
                template:'./notificacion_solicitud',
                context:{
                            name:cliente.nombre,
                            solicitud_num:solicitud.id,
                            fechasolicitud: new Date(solicitud.createdAt).toLocaleDateString(),
                            locacion:this.almacenSeleccionado.label,
                            direccion:this.locaciones.filter(locacion=>locacion.code === this.almacenSeleccionado.code).length>0?this.locaciones.filter(locacion=>locacion.code === this.almacenSeleccionado.code)[0].direccion==null?'':this.locaciones.filter(locacion=>locacion.code === this.almacenSeleccionado.code)[0].direccion:'',
                            ubicacion:this.locaciones.filter(locacion=>locacion.code === this.almacenSeleccionado.code).length>0?this.locaciones.filter(locacion=>locacion.code === this.almacenSeleccionado.code)[0].ubicacion==null?'':this.locaciones.filter(locacion=>locacion.code === this.almacenSeleccionado.code)[0].ubicacion:'',
                            totalvehiculos:cliente.turnos.length,
                            totaltoneladas:(await this.functionsService.sumColArray(cliente.turnos,[{toneladas_turno:0}]))[0].toneladas_turno,
                            cliente:{
                                CardCode:clienteTurno.CardCode,
                                CardName:clienteTurno.CardName,
                                EmailAddress:clienteTurno.EmailAddress,
                                FederalTaxID:clienteTurno.FederalTaxID,
                                estado:clienteTurno.estado,
                                id:clienteTurno.id,
                                turnos:cliente.turnos,
                                telefono:''
                            },
                            origen:'mail_cliente'
                }         
                };
                //////// //// ////////////console.log('objectMail Cliente',objectMail);
                ////////// //// ////////////console.log(await this.functionsService.sendMail(objectMail));
                await this.functionsService.sendMail(objectMail)
            //  }
            });
        }
  
        async emailsVendedores(solicitud:any): Promise<void>{
        
            let turnosVendedor:any[] = []; 
            solicitud.detalle_solicitud_turnos.forEach((turno: {
            conductor: any;
            vehiculo: any;
            transportadora: any; detalle_solicitud_turnos_pedido: any[]; id: number; estado: any; fechacita: any; horacita: any; locacion: any; lugarentrega: any; municipioentrega: any; observacion: any; 
        })=>{
            
            turno.detalle_solicitud_turnos_pedido.forEach((pedido)=>{
                //////////////// //// ////////////console.log(turno.id, pedido.CardCode);
                if(turnosVendedor.filter(vendedor=>vendedor.codigo===pedido.email_vendedor).length === 0){
        
                    let turnoVendedor:any;
                    
        
                    turnoVendedor ={
                        id:turno.id,
                        estado:turno.estado,
                        fechacita:new Date(turno.fechacita).toLocaleDateString(),
                        horacita:new Date(turno.horacita).toLocaleTimeString(),
                        locacion:turno.locacion,
                        lugarentrega:turno.lugarentrega,
                        municipioentrega:turno.municipioentrega,
                        observacion:turno.observacion,
                        detalle_solicitud_turnos_pedido:[pedido],
                        toneladas_turno: !pedido.itemcode.toLowerCase().startsWith("sf")?pedido.cantidad:0,
                        transportadora:turno.transportadora,
                        vehiculo:turno.vehiculo,
                        conductor:turno.conductor,
                    }
        
                    turnosVendedor.push({
                        codigo:pedido.email_vendedor,
                        nombre:pedido.vendedor,
                        email:pedido.email_vendedor,
                        tipo:'vendedor',
                        turnos:[turnoVendedor]
                    });
                }else{
                    
                    let indexVendedor = turnosVendedor.findIndex(vendedor=>vendedor.codigo === pedido.email_vendedor);
                    //////////////// //// ////////////console.log(turnosCliente[indexCliente]);
        
                    if(turnosVendedor[indexVendedor].turnos.filter((turnoVendedor: { id: number; })=>turnoVendedor.id === turno.id).length ==0){
                        let turnoVendedor:any;
                        turnoVendedor ={
                        id:turno.id,
                        estado:turno.estado,
                        fechacita:new Date(turno.fechacita).toLocaleDateString(),
                        horacita:new Date(turno.horacita).toLocaleTimeString(),
                        locacion:turno.locacion,
                        lugarentrega:turno.lugarentrega,
                        municipioentrega:turno.municipioentrega,
                        observacion:turno.observacion,
                        detalle_solicitud_turnos_pedido:[pedido],
                        toneladas_turno: !pedido.itemcode.toLowerCase().startsWith("sf")?pedido.cantidad:0,
                        transportadora:turno.transportadora,
                        vehiculo:turno.vehiculo,
                        conductor:turno.conductor,
                        }
                        
                        turnosVendedor[indexVendedor].turnos.push(turnoVendedor);
                    }else{
                        let indexTurno = turnosVendedor[indexVendedor].turnos.findIndex((turnoVendedor: { id: number; })=>turnoVendedor.id === turno.id)
                        //////////////// //// ////////////console.log(turnosCliente[indexCliente].turnos[indexTurno]);
                        turnosVendedor[indexVendedor].turnos[indexTurno].detalle_solicitud_turnos_pedido.push(pedido);
                        if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                        turnosVendedor[indexVendedor].turnos[indexTurno].toneladas_turno+=pedido.cantidad;
                        }
                    }
                    
                }
            })
            
            });
        
            ////////////// //// ////////////console.log(turnosVendedor);
        
            turnosVendedor.forEach(async (vendedor)=>{
            if(vendedor.email!='' && vendedor.email!=null){
                let objectMail = {
                to:this.domain=='localhost'?'ralbor@nitrofert.com.co':vendedor.email,
                //to:'ralbor@nitrofert.com.co',
                from:`"Portal de autogestión Nitrofert" <notificacionapp@nitrofert.com.co>`,
                subject:`Solicitud de cargue # ${solicitud.id}`,
                template:'./notificacion_solicitud2',
                context:{
                            name:vendedor.nombre,
                            solicitud_num:solicitud.id,
                            fechasolicitud: new Date(solicitud.createdAt).toLocaleDateString(),
                            locacion:this.almacenSeleccionado.label,
                            totalvehiculos:vendedor.turnos.length,
                            totaltoneladas:(await this.functionsService.sumColArray(vendedor.turnos,[{toneladas_turno:0}]))[0].toneladas_turno,
                            turnos:vendedor.turnos,
                            origen:this.domain=='localhost'?'mail_vendedor':''
                            //cliente:solicitud.clientes.find((clienteSolicitud: { CardCode: any; }) => clienteSolicitud.CardCode === vendedor.code)
                }         
                };
                //////// //// ////////////console.log('objectMail vendedor',objectMail);
                ////////// //// ////////////console.log(await this.functionsService.sendMail(objectMail));
                await this.functionsService.sendMail(objectMail)
            }
            });
        }
  
  
        async emailBodegaEstado(solicitud:any): Promise<void>{
        
            let infoUsuario = await this.usuariosService.infoUsuario();
        
            let emailBodega!:string;
            let locacion:any = this.almacenSeleccionado.name;
        
            /*let emailsTurno = (await this.solicitudTurnoService.emailsTurno({estado_turno:EstadosDealleSolicitud.SOLICITADO,locacion}))
                            .map((email: { email_responsable: any; }) => {return email.email_responsable});*/
        
            let emailsTurno = (await this.solicitudTurnoService.emailsTurno({estado_turno:EstadosDealleSolicitud.SOLICITADO,locacion}));
        
            emailsTurno.forEach(async (flujoAP:any)=>{
        
            if(infoUsuario.email != flujoAP.email_responsable){
                let totaltoneladas =0;
        
                solicitud.detalle_solicitud_turnos.forEach((turno:any)=>{
                    let fechacita:any = new Date(turno.fechacita).toLocaleDateString(); 
                    let horacita:any = new Date(turno.horacita).toLocaleTimeString();
                    turno.fechacita = fechacita;
                    turno.horacita= horacita;
                    turno.detalle_solicitud_turnos_pedido.forEach((pedido:any)=>{
                    if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                        totaltoneladas+= parseFloat(pedido.cantidad);
                    }
                    
                    });
                    
                });
        
        
                let objectMail = {
                
                    to:this.domain=='localhost'?'ralbor@nitrofert.com.co':flujoAP.email_responsable,
                    //to:'ralbor@nitrofert.com.co',
                    from:`"Portal de autogestión Nitrofert" <notificacionapp@nitrofert.com.co>`,
                    subject:`Solicitud de cargue # ${solicitud.id}`,
                    template:'./notificacion_solicitud2',
                    context:{
                                name:flujoAP.nombre_responsable,
                                solicitud_num:solicitud.id,
                                fechasolicitud: new Date(solicitud.createdAt).toLocaleDateString(),
                                locacion,
                                totalvehiculos:solicitud.detalle_solicitud_turnos.length,
                                totaltoneladas,
                                turnos:solicitud.detalle_solicitud_turnos,
                                origen:this.domain=='localhost'?'mail_estado_locacion':''
                    }         
                };
                //////// //// ////////////console.log('objectMail Bodega',objectMail);
                ////////// //// ////////////console.log(await this.functionsService.sendMail(objectMail));
                await this.functionsService.sendMail(objectMail)
        
        
            }
        
            });
                
        
            //////////// //// ////////////console.log('emailsTurno',emailsTurno.join());
            /*
            if(emailsTurno.join()!=''){
            emailBodega = emailsTurno.join();
            }
        
        
            if(emailBodega){
            let totaltoneladas =0;
        
            solicitud.detalle_solicitud_turnos.forEach((turno:any)=>{
                let fechacita:any = new Date(turno.fechacita).toLocaleDateString(); 
                let horacita:any = new Date(turno.horacita).toLocaleTimeString();
                turno.fechacita = fechacita;
                turno.horacita= horacita;
                turno.detalle_solicitud_turnos_pedido.forEach((pedido:any)=>{
                if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                    totaltoneladas+= parseFloat(pedido.cantidad);
                }
                
                });
            });
        
            let objectMail = {
                
                to:this.domain=='localhost'?'ralbor@nitrofert.com.co':emailBodega,
                //to:'ralbor@nitrofert.com.co',
                subject:`Solicitud de cargue # ${solicitud.id}`,
                template:'./notificacion_solicitud2',
                context:{
                            name:emailBodega,
                            solicitud_num:solicitud.id,
                            fechasolicitud: new Date(solicitud.createdAt).toLocaleDateString(),
                            locacion,
                            totalvehiculos:solicitud.detalle_solicitud_turnos.length,
                            totaltoneladas,
                            turnos:solicitud.detalle_solicitud_turnos
                            
                }         
            };
            //////// //// ////////////console.log('objectMail Bodega',objectMail);
            ////////// //// ////////////console.log(await this.functionsService.sendMail(objectMail));
            await this.functionsService.sendMail(objectMail)
        
            }
            */
        
        }
  
        async emailTransp(solicitud:any): Promise<void>{
        
            let totaltoneladas =0;
        
            solicitud.detalle_solicitud_turnos.forEach((turno:any)=>{
            let fechacita:any = new Date(turno.fechacita).toLocaleDateString(); 
            let horacita:any = new Date(turno.horacita).toLocaleTimeString();
            turno.fechacita = fechacita;
            turno.horacita= horacita;
            turno.detalle_solicitud_turnos_pedido.forEach((pedido:any)=>{
                if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                totaltoneladas+= parseFloat(pedido.cantidad);
                }
                
            });
            });
        
            let objectMail = {
            //to:'ralbor@nitrofert.com.co',
            to:this.domain=='localhost'?'ralbor@nitrofert.com.co':'turnostransporte@nitrofert.com.co',
            from:`"Portal de autogestión Nitrofert" <notificacionapp@nitrofert.com.co>`,
            subject:`Solicitud de cargue # ${solicitud.id}`,
            template:'./notificacion_solicitud2',
            context:{
                        name:'Transporta Sociedades',
                        solicitud_num:solicitud.id,
                        fechasolicitud: new Date(solicitud.createdAt).toLocaleDateString(),
                        locacion:this.almacenSeleccionado.label,
                        totalvehiculos:solicitud.detalle_solicitud_turnos.length,
                        totaltoneladas,
                        turnos:solicitud.detalle_solicitud_turnos,
                        origen:this.domain=='localhost'?'mail_transportasociedad':''
                        
            }         
            };
            //////// //// ////////////console.log('objectMail trasporta sociedad',objectMail);
            ////////// //// ////////////console.log(await this.functionsService.sendMail(objectMail));
            await this.functionsService.sendMail(objectMail)
        }
  
        async emailCreador(solicitud:any): Promise<void>{
            
            let infoUsuario = await this.usuariosService.infoUsuario();
        
        
            
            let totaltoneladas =0;
            
            solicitud.detalle_solicitud_turnos.forEach((turno:any)=>{
            let fechacita:any = new Date(turno.fechacita).toLocaleDateString(); 
            let horacita:any = new Date(turno.horacita).toLocaleTimeString();
            turno.fechacita = fechacita;
            turno.horacita= horacita;
            turno.detalle_solicitud_turnos_pedido.forEach((pedido:any)=>{
                if(!pedido.itemcode.toLowerCase().startsWith("sf")){
                totaltoneladas+= parseFloat(pedido.cantidad);
                }
                
            });
            });
        
            let objectMail = {
            to:infoUsuario.email,
            //to:usuarioCreador.email,
            from:`"Portal de autogestión Nitrofert" <notificacionapp@nitrofert.com.co>`,
            subject:`Solicitud de cargue # ${solicitud.id}`,
            template:'./notificacion_solicitud2',
            context:{
                        name:infoUsuario.nombrecompleto,
                        solicitud_num:solicitud.id,
                        fechasolicitud: new Date(solicitud.createdAt).toLocaleDateString(),
                        locacion:this.almacenSeleccionado.label,
                        totalvehiculos:solicitud.detalle_solicitud_turnos.length,
                        totaltoneladas,
                        turnos:solicitud.detalle_solicitud_turnos,
                        origen:this.domain=='localhost'?'mail_creador':''
                        
            }         
            };
            //////// //// ////////////console.log('objectMail usuario creador',objectMail);
            ////////// //// ////////////console.log(await this.functionsService.sendMail(objectMail));
            await this.functionsService.sendMail(objectMail)
        
        }

        filter(event: any, arrayFiltrar:any[]) {

            ////////////////////////////// //// ////////////console.log(arrayFiltrar);
            const filtered: any[] = [];
            const query = event.query;
            for (let i = 0; i < arrayFiltrar.length; i++) {
                const linea = arrayFiltrar[i];
                if (linea.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                    filtered.push(linea);
                }
            }
            
            return filtered.slice(0,10);
        }

        configTablaPedidosEnSolicitud(){
            let headersTable:any=this.configHeadersPedidos();
            let dataTable:any = this.configDataTablePedidos(this.pedidosEnSolicitud);
              
            this.tablaPedidosEnSolicitud = {
                header: headersTable,
                data: dataTable
            }
            
              //////////////////////////// //// ////////////console.log(this.tablaPedidosEnSolicitud);
            
          }

        goToSolicitudes(){
            this.router.navigate(['/portal/solicitudes-de-cargue'])
        }
          
        formatCurrency(value: number) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
          }
        
        onGlobalFilter(table: Table, event: Event) {
            table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
        }
      
        clear(table: Table) {
          table.clear();
          this.filterTable.nativeElement.value = '';
        }

        onLoad($event:any){


          this.loadingCargueCSV = true;
          const [ file ] = $event.currentFiles;
          this.fileTmp = {
            fileRaw:file,
            fileName:file.name
          }
      
          ////console.log('this.fileTmp2',file);
          this.readDocument(file);
        
        }
      
        readDocument(file:Blob) {
            let fileReader = new FileReader();
            let arrayTexto:any[] =[];
            fileReader.onload = async (e) => {
              let text:any =fileReader.result ;
              var lines = text.split('\n') ;
              for(let line of lines){
                //////console.log(await this.functionsService.reemplazarCaracteresEspeciales(line));
                arrayTexto.push(await this.functionsService.reemplazarCaracteresEspeciales(line));
              }

              

              this.validarArchivoVehiculos(arrayTexto);
            }
            fileReader.readAsText(file, 'ISO-8859-1');
        }

        validarArchivoVehiculos(lineasArchivo:any[]){
          let encabezados:any[] = ['PLACA',
                                    'ID_CONDUCTOR',
                                    'NOMBRE_CONDUCTOR',
                                    'TRANSPORTADORA',
                                    'CANTIDAD_CARGA',
                                    'ID_DESPACHO',
                                    'FECHA_DESPACHO',
                                    'HORA_DESPACHO',
                                    'PRODUCTO_DESPACHO'];
          
          if(this.validarENcabezadoArchivo(encabezados,lineasArchivo[0].split(";"))){
              this.validarDatosArchivo(lineasArchivo,encabezados);
          }else{
            this.loadingCargueCSV = false;
          }
          
        }

        validarENcabezadoArchivo(encabezados:any[],encabezadosArchivo:any[]){

          ////console.log(encabezados, encabezadosArchivo);
          this.erroresImportacionVehiculos = [];
          let valido = false;
          if(encabezadosArchivo.length===0){
            this.messageService.add({severity:'error', summary:'!Error', detail:'El archivo debe estar separado por el simbolo de punto y coma (;)'});
            this.erroresImportacionVehiculos.push({icon:'pi pi-times', classColor:'p-button-rounded p-button-danger p-button-text', severity:'error', summary:'!Error', detail:'El archivo debe estar separado por el simbolo de punto y coma (;)'});
          }else if(encabezadosArchivo.length!=encabezados.length){
            this.messageService.add({severity:'error', summary:'!Error', detail:'Las columnas del archivo cargado no contienen el numero de columnas requeridas'});
            this.erroresImportacionVehiculos.push({icon:'pi pi-times', classColor:'p-button-rounded p-button-danger p-button-text', severity:'error', summary:'!Error', detail:'Las columnas del archivo cargado no contienen el numero de columnas requeridas'});
          }else if(!this.validarDatosEncabezado(encabezados,encabezadosArchivo)){
            this.messageService.add({severity:'error', summary:'!Error', detail:'Una o mas nombres de las columnas del archivo cargado no corresponden a los encabezados requeridos'});
            this.erroresImportacionVehiculos.push({icon:'pi pi-times', classColor:'p-button-rounded p-button-danger p-button-text', severity:'error', summary:'!Error', detail:'Una o mas nombres de las columnas del archivo cargado no corresponden a los encabezados requeridos'});
          }else{
            valido = true;
          }

          return valido;
        }

        validarDatosEncabezado(encabezados:any[],encabezadosArchivo:any[]){
          let valido = true;
          for(let encabezado of encabezadosArchivo){
              if(!encabezados.includes(encabezado)){
                valido = false;
                break;
              }
          }
          return valido;
        }

        async validarDatosArchivo(lineasArchivo:any[],encabezados:any[]){

          ////console.log('lineasDatos',lineasArchivo);

          let valido = false;
          let lineasDatos = await this.functionsService.clonObject(lineasArchivo);
          lineasDatos.shift();

          if(lineasDatos.length===0){
            this.messageService.add({severity:'error', summary:'!Error', detail:'El archivo cargado no contiene información para importar'});
            this.erroresImportacionVehiculos.push({icon:'pi pi-times', classColor:'p-button-rounded p-button-danger p-button-text', severity:'error', summary:'!Error', detail:'El archivo cargado no contiene información para importar'});
          }else{
            let index = 1;
            this.importeVehiculosSolicitud = [];
            for(let linea of lineasDatos){
              let arrayLinea:any[] = linea.split(";");
              ////console.log('arrayLinea',index,arrayLinea.join("").length);
              if(arrayLinea.join("").length>0){
                if(arrayLinea.length===0){
                  this.messageService.add({severity:'error', summary:'!Error', detail: `la línea ${index} del archivo cargado, debe estar separado por el simbolo de punto y coma (;)`});
                  this.erroresImportacionVehiculos.push({icon:'pi pi-times', classColor:'p-button-rounded p-button-danger p-button-text', severity:'error', summary:'!Error', detail:`la línea ${index} del archivo cargado, debe estar separado por el simbolo de punto y coma (;)`});
                }else if(arrayLinea.length!=encabezados.length){
                  this.messageService.add({severity:'error', summary:'!Error', detail: `la linea ${index}  del archivo cargado, no contienen el numero de columnas requeridas`});
                  this.erroresImportacionVehiculos.push({icon:'pi pi-times', classColor:'p-button-rounded p-button-danger p-button-text', severity:'error', summary:'!Error', detail:`la linea ${index}  del archivo cargado, no contienen el numero de columnas requeridas`});
                }else{
                    if(await this.validarContenidoLinea(arrayLinea,index)){
  
                       
                            let placa = arrayLinea[0].trim();
                            let cedula = await this.functionsService.reemplazarCarateres(arrayLinea[1].trim(),['.',','],"") ;
                            let conductor = arrayLinea[2].trim();
                            let transportadora = arrayLinea[3].trim();
                            let cantidad_carga = arrayLinea[4].trim();
                            let id_despacho = arrayLinea[5].trim();
                            let fecha_despacho = arrayLinea[6].trim();
                            let hora_despacho = arrayLinea[7].trim();
                            let item = arrayLinea[8].trim();
  
                            let horacargue = `${this.fechacargue.toISOString().split("T")[0]}T${this.horacargue.toISOString().split("T")[1]}`;
  
                            //Validar el id_despacho si esxite en un turno. si no existe agregar linea de vehiculo a this.vehiculosSolicitud

                            let infoTransportadora:any = this.transportadoras.find(t=>t.nombre_puerto  === transportadora);

                            let turno = await this.solicitudTurnoService.getTurnoByQuery({id_despacho_puerto:id_despacho});

                            ////console.log('turno por id despacho',turno);

                            if(!turno){
                              this.importeVehiculosSolicitud.push({ 
                                fechacargue:this.fechacargue,
                                //horacargue:this.horacargue,
                                horacargue:new Date(horacargue),
                                //cliente: this.clienteSeleccionado.code,
                                estado: "pendiente",
                                placa:placa,
                                capacidadvh:0,
                                cedula,
                                conductor:conductor,
                                
                                transportadora:infoTransportadora.code,
                                nombre_transportadora:infoTransportadora.name,
                                motonave:'',
                                pedido:'',
                                itemCode:'',
                                itemName:'',
                                cantidad:cantidad_carga/1000,
                                id_despacho,
                                sitioentrega:'',
                                municipioentrega:'',
                                observacion:'',
                                key:`${placa}${id_despacho}`,
                                pedidos:[]
    
    
                              })
                            }
  
                            
                        
                        
            
          
                    }
                }
  
              }
              
              index++;

            }

            if(this.erroresImportacionVehiculos.length===0){
              this.messageService.add({severity:'success', summary:'OK', detail:'El archivo cargado fue validado correctamente, puede proceder a cargar los vehiculos.'});
              this.erroresImportacionVehiculos.push({icon:'pi pi-check', classColor:'p-button-rounded p-button-success p-button-text',severity:'success', summary:'OK', detail:`El archivo cargado fue validado correctamente, puede proceder a cargar los vehiculos.`});
            }

            this.loadingCargueCSV = false;
          }
        }

        async validarContenidoLinea(arrayLinea:any[], index:number):Promise<boolean>{
            let placa = arrayLinea[0].trim();
            let cedula = await this.functionsService.reemplazarCarateres(arrayLinea[1].trim(),['.',','],"") ;
            let conductor = arrayLinea[2].trim();
            let transportadora = arrayLinea[3].trim();
            let cantidad_carga = arrayLinea[4].trim();
            let id_despacho = arrayLinea[5].trim();
            let fecha_despacho = arrayLinea[6].trim();
            let hora_despacho = arrayLinea[7].trim();
            let item = arrayLinea[8].trim();

            let valido = true;

            //console.log('cantidad_carga',cantidad_carga);
            if(cantidad_carga === '' || isNaN(cantidad_carga || cantidad_carga<=0)){
              this.messageService.add({severity:'error', summary:'!Error', detail: `El campo cantidad carga debe ser un valor numerico o mayor a cero`});
              this.erroresImportacionVehiculos.push({icon:'pi pi-times', classColor:'p-button-rounded p-button-danger p-button-text', severity:'error', summary:'!Error',detail:`El campo cantidad carga debe ser un valor numerico o mayor a cero`});
              valido = false;
            }
            //////console.log(this.vehiculos.filter(vehiculo=>vehiculo.code === placa));
            if(this.vehiculos.filter(vehiculo=>vehiculo.code === placa).length===0 && placa!=''){
              this.messageService.add({severity:'warn', summary:'!Error', detail: `La placa ${placa} de la línea ${index} del archivo cargado, no existe en el maestro de vehiculos del portal`});
              this.erroresImportacionVehiculos.push({icon:'pi pi-exclamation-circle', classColor:'p-button-rounded p-button-warning p-button-text', severity:'warn', summary:'!Error',detail:`La placa ${placa} de la línea ${index} del archivo cargado, no existe en el maestro de vehiculos del portal`});
              //valido = false;
              ////console.log('cedula',placa);

              let tipoVehiculo = (await this.functionsService.sortArrayObject(this.tipoVehiculos.filter(tipoVehiculo=>tipoVehiculo.pesomax > (cantidad_carga/1000)),'pesomax','ASC'))[0];
              //console.log('tipoVehiculo',tipoVehiculo);

              //registrar vehiculo 

              let nuevoVehiculo = {
                placa,
                tipo_vehiculo:tipoVehiculo.id,
                capacidad:tipoVehiculo.capacidad,
                pesovacio:tipoVehiculo.pesovacio,
                pesomax:tipoVehiculo.pesomax,
                volumen:tipoVehiculo.volumen,
                //conductor:this.conductorSeleccionado.id
              }

              this.vehiculosService.create(nuevoVehiculo)
              .subscribe({
                  next: (vehiculo)=>{
                    //console.log(vehiculo);
                    this.messageService.add({severity:'success', summary:'información', detail:`El vehículo ${placa} fue registrado correctamente`});
                    this.erroresImportacionVehiculos.push({icon:'pi pi-check', classColor:'p-button-rounded p-button-success p-button-text', severity:'success', summary:'!Ok',detail:`El vehículo ${placa} fue registrado correctamente`});
                    vehiculo.code = vehiculo.placa;
                    vehiculo.name = vehiculo.placa;
                    vehiculo.label = vehiculo.placa+' ('+vehiculo.tipo_vehiculo.capacidad+' TON)';
                    vehiculo.clase = vehiculo.tipo_vehiculo;
                    this.vehiculos.push(vehiculo);

                  },
                  error:(err)=>{
                    console.error(err);
                    this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                    this.erroresImportacionVehiculos.push({icon:'pi pi-times', classColor:'p-button-rounded p-button-danger p-button-text', severity:'warn', summary:'!Advertencia',detail:err.error.message});
                  }
              });

            }


            // ////console.log(this.conductores.filter(async conductor=>(await this.functionsService.reemplazarCarateres(conductor.code,['.',','],""))  === (await this.functionsService.reemplazarCarateres(cedula,['.',','],""))))
            if(this.conductores.filter(conductor=>conductor.code  === cedula).length===0 && cedula!=''){
              this.messageService.add({severity:'warn', summary:'!Error', detail: `El conductor ${conductor} de la línea ${index} del archivo cargado, no existe en el maestro de conductores del portal`});
              this.erroresImportacionVehiculos.push({icon:'pi pi-exclamation-circle', classColor:'p-button-rounded p-button-warning p-button-text', severity:'warn', summary:'!Advertencia',detail:`El conductor ${conductor} de la línea ${index} del archivo cargado, no existe en el maestro de conductores del portal`});
              //valido = false;
              ////console.log('cedula',cedula);

              let nuevoConductor ={
                nombre:conductor,
                cedula,
                email:'',
                numerotelefono:'0',
                numerocelular:'0'
                
              }

              //Registro info conductor
            this.conductoresService.create(nuevoConductor)
            .subscribe({
                next: (conductor)=>{
                 ////////////console.log(conductor);
                  this.messageService.add({severity:'success', summary:'información', detail:`El conductor ${conductor.nombre} fue registrado correctamente`});
                  this.erroresImportacionVehiculos.push({icon:'pi pi-check', classColor:'p-button-rounded p-button-success p-button-text', severity:'success', summary:'!Ok',detail:`El conductor ${conductor.nombre} fue registrado correctamente`});

                  conductor.code = conductor.cedula;
                  conductor.name = conductor.nombre;
                  conductor.label = conductor.cedula+' - '+conductor.nombre;

                  this.conductores.push(conductor)
                },
                error:(err)=> {
                    console.error(err);

                    this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                    this.erroresImportacionVehiculos.push({icon:'pi pi-times', classColor:'p-button-rounded p-button-danger p-button-text', severity:'error', summary:'!Advertencia',detail:err.error.message});
                },
            });


            }



            if(this.transportadoras.filter(t=>t.nombre_puerto  === transportadora).length===0 && transportadora!=''){
              this.messageService.add({severity:'error', summary:'!Error', detail: `La transportadora ${transportadora} de la línea ${index} del archivo cargado, no existe en el maestro de transportadoras del portal`});
              this.erroresImportacionVehiculos.push({icon:'pi pi-times', classColor:'p-button-rounded p-button-danger p-button-text', severity:'error', summary:'!Error',detail:`La transportadora ${transportadora} de la línea ${index} del archivo cargado, no existe en el maestro de transportadoras del portal`});
              valido = false;
              ////console.log('transportadora',transportadora);
            }

            let turno = await this.solicitudTurnoService.getTurnoByQuery({id_despacho_puerto:id_despacho});
            ////console.log('turno por id despacho',turno);

            if(turno){
              this.messageService.add({severity:'warn', summary:'!Advertencia', detail: `El vehiculo ${placa} con el id despacho ${id_despacho} de la línea ${index} ya se le asigno el turno ${turno.id} del archivo cargado, no existe en el maestro de transportadoras del portal`});
              this.erroresImportacionVehiculos.push({icon:'pi pi-exclamation-circle', classColor:'p-button-rounded p-button-warning p-button-text', severity:'warn', summary:'!Advertencia',detail:`El vehiculo ${placa} con el id despacho ${id_despacho} de la línea ${index} ya se le asigno el turno ${turno.id} del archivo cargado, no existe en el maestro de transportadoras del portal`});
            }


           

            return valido;


        }
        

    }    