import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { SB1XEService } from 'src/app/demo/service/sb1xe.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { MenuService } from 'src/app/layout/shared/menu/app.menu.service';

import { ClientesService } from 'src/app/demo/service/clientes.service';
import { FormFacturaComponent } from '../../reportes/form-factura/form-factura.component';
import { FileUpload } from 'primeng/fileupload';

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
  selector: 'app-listado-facturas',
  providers:[ConfirmationService,MessageService],
  templateUrl: './cargue-soportes-facturas.component.html',
  styleUrls: ['./cargue-soportes-facturas.component.scss']
})
export class CargueSoporteFacturasComponent  implements  OnInit{

  
  
  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:true, delete_accion:false}];
  permisosModulo!:any[];

  headersTable!:any;
  dataTable!:any;
  dataTypeTable!:any;
  dataKey:string='DocNum';
  rows:number=10;
  rowsPerPageOptions!:number[];
  
  paginator:boolean= true;
  selectionMode:string='multiple';
  titleTable!:string;
  nameExport!:string;
  viewCheckselectedItem:boolean = true;
  viewCheckAllItem:boolean = false;
  showBtnNew:boolean = false;
  toolTipShowBtnNew:string = "Nuevo";
  showBtnEdit:boolean = false;
  toolTipShowBtnEdit:string = "Editar";
  showBtnExp:boolean = false;
  toolTipShowBtnView:string = "Consultar";
  showBtnView:boolean = false;
  toolTipShowBtnExp:string = "Exportar";
  showBtnDelete:boolean = false;
  toolTipShowBtnDelete:string = "Anular";
  loading:boolean = true;
  globalFilterFields:any[]= ['DocNum','NumAtCard','PEDIDO','TIPOFAC','DocDate','DocDueDate','Dias de vencimiento','PymntGroup','DocTotal','creditCompany'];
  selectedItem:any[] = []; 
  columnsTable:number=this.globalFilterFields.length+2; 
  hoy:Date = new Date();

  info_usuario!:any;
  clientes:any[] = [];
  clienteSeleccionado:any = []; 
  clientesFiltrados:any[] = [];
  facturasCliente:any[] = [];
  facturasClienteAgrupada:any[] =[];

  empresasCredito!:any[];

  filtros!:any ;


  cntFacturas:number =0;
  totalFacturas:number =0;

  totalSoportes:number =0;


  filesToUpload:any[] = []

  cargueSoporte:boolean = true;
  uploadedFiles:any[] =[];

  rangoFechas:Date[] = [];
  @ViewChild('dateFilter') dateFilter!: any;
  

  @ViewChild('filter') filterTable!: ElementRef;
  @ViewChild('dt') dt1!:Table;

  constructor(private router:Router,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private menuService:MenuService,
              private usuariosService:UsuarioService,
              private usuarioService: UsuarioService,
              private sb1XEService:SB1XEService,
              private functionsService:FunctionsService,
              private clientesService:ClientesService,
              private messageService: MessageService,
              private rutaActiva: ActivatedRoute){}


  async ngOnInit() {
    this.getPermisosModulo(); 

    //this.getListadoMenu();
    //Obtener info usuario
    this.info_usuario = await this.usuarioService.infoUsuario();
    this.rangoFechas = [await this.functionsService.dateAdd(new Date(),-3,'months'),new Date() ];
    //this.getClientesUsuario();
    ////////////////console.log(await this.functionsService.dateAdd(new Date(),3,'months'));

    this.empresasCredito = [{name:'Nitrofert', image: 'https://nitrofert.com.co/wp-content/uploads/2022/09/NITROFERT.png'},
                            {name:'Nitrocredit', image: 'https://nitrofert.com.co/wp-content/uploads/2023/07/NITROCRE.png'}];

    await this.getFilter();
    this.getClientesUsuario();

   
  }

  getPermisosModulo(){
    const modulo = this.router.url;
    
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: (permisos)=>{
             // //////////////console.log(permisos);
              if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                this.router.navigate(['/auth/access']);
              }

              if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                this.router.navigate(['/auth/access']);
              }
              this.permisosModulo = permisos;
              this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
              this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
              this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
              this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
              this.showBtnView = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='leer').valor;

              
            },
            error:(err)=>{
                console.error(err);
            }
        });
        
}

async getFilter():Promise<void>{
  
  ////////////console.log(this.rutaActiva);
  this.filtros =  this.rutaActiva.snapshot.queryParams;

  
  
}

async getClientesUsuario(){
  /*if(this.info_usuario.clientes.length>0){
    let clientes:any =[];
    for(let cliente of this.info_usuario.clientes){
      cliente.label = `${cliente.CardName} - ${cliente.FederalTaxID}`;
      clientes.push(cliente);
    }

    this.clientes = clientes;
    this.clienteSeleccionado = this.clientes[0];
    

    this.getFacturasCliente();

  }*/

  let clientes:any[];
        /**
         * Buscar permiso de multiples clientes
         */

        if(await this.usuarioService.permisoModuloAccion('/dashboard-cliente','Seleccionar multiples clientes')){
            /**
             * Obtener array de clientes
             */
            clientes= await this.clientesService.infoClientes();
        }else{
            /**
             * Obtener clientes asociados a usuario
             */
            clientes = this.info_usuario.clientes;
        }
        /**
         * Si existen clientes configurar dropdoen de clientes y mostrar dashboard de cliente
         */

        if(clientes.length > 0){
            for(let cliente of clientes){
                //cliente.code = cliente.CardCode;
                //cliente.name =  cliente.CardName;
                cliente.label =  `${cliente.CardName} - ${cliente.FederalTaxID}`;
            }
            this.clientes = clientes;

            /**
             * Validar si la variable filtros esta vacia, seleccionar el primer cliente de la lista, si no tomar el cliente contenido en la varible .
             */

            if(this.filtros.cliente){
              this.clienteSeleccionado = this.clientes.find(cliente=>cliente.CardCode === this.filtros.cliente);
            }else{
              this.clienteSeleccionado = this.clientes[0];
            }
            
            this.getFacturasCliente();
        }

}

async seleccionarCliente(clienteSeleccionado:any){
  ////////////////console.log(clienteSeleccionado);
  //let saldosClienteSeleccionado = await this.sb1XEService.saldosCupoSocioNegocio(this.clienteSeleccionado.CardCode);
  //this.setDashboardCliente(saldosClienteSeleccionado);
  this.loading = true;
  this.selectedItem = [];
  await this.getFacturasCliente();
}

async getFacturasCliente(){
  let facturasCliente = await this.sb1XEService.facturasSocioNegocio({
    compania:'NITROFERT_PRD',
    cliente:this.clienteSeleccionado.CardCode,
    fechaini:this.rangoFechas[0].toISOString().split('T')[0],
    fechafin:this.rangoFechas[1].toISOString().split('T')[0],
  });

  console.log('facturasCliente',facturasCliente);
  facturasCliente =(await this.functionsService.objectToArray(facturasCliente));
  this.facturasCliente = facturasCliente;
  ////////////console.log('facturasCliente',facturasCliente);

  let facturasClienteAgrupada = await  this.functionsService.groupArray(facturasCliente,'DocNum');

  console.log('facturasClienteAgrupada',facturasClienteAgrupada);

  ////////////////console.log(Math.ceil(await this.functionsService.dateDif(new Date(), new Date('2023-06-15'), 'days')));

  for(let linea of facturasClienteAgrupada){
    ////////////console.log(linea.DocDueDate);
    ////////////console.log(new Date(linea.DocDueDate));
    linea.diasvencimiento = Math.ceil(await this.functionsService.dateDif(new Date(), new Date(linea.DocDueDate), 'days'));
    linea.creditCompany = linea.LIQUITECH=='NO'?'Nitrofert':'Nitrocredit';
    linea.valorPago =0
    ////////////console.log(linea.diasvencimiento);
  }

 ////////////console.log('facturasClienteAgrupada',facturasClienteAgrupada);



  this.facturasClienteAgrupada = await this.functionsService.sortArrayObject(facturasClienteAgrupada,'DocNum','DESC');

  //await this.setFiltros();

  this.loading = false;
}

async setFiltros(table: Table):Promise<void>{

  ////////////console.log(table.filters);
  if(this.filtros.tipo){
      switch(this.filtros.tipo){
        case 'cartera_vencida':
          table.filter(0,'diasvencimiento','gt');
          table.filter('NO','PAGADA','is');
          table.filter('Nota Credito','TIPOFAC','isNot');
          
         
        break;
        case 'cartera_corriente':
          table.filter(0,'diasvencimiento','lt');
          table.filter('NO','PAGADA','is');
          table.filter('Nota Credito','TIPOFAC','isNot');
        break;

        case 'notas_credito':
          
          table.filter('Nota Credito','TIPOFAC','is');
          table.filter('NO','PAGADA','is');
        break;

        case 'Nitrocredit':
          
        table.filter('Nitrocredit','creditCompany','is');
        table.filter('NO','PAGADA','is');
        
      break;

      }
  }
}

async resetFiltros(table: Table):Promise<void>{

  table.clear()

  ////////////console.log(table.filters);
  if(this.filtros.tipo){
      switch(this.filtros.tipo){
        case 'cartera_vencida':
          table.filter(null,'diasvencimiento','equals');
          table.filter(null,'PAGADA','startsWith');
          table.filter(null,'TIPOFAC','startsWith');
          
         
        break;
        case 'cartera_corriente':
          table.filter(null,'diasvencimiento','equals');
          table.filter(null,'PAGADA','startsWith');
          table.filter(null,'TIPOFAC','startsWith');
        break;

        case 'notas_credito':
          
          table.filter(null,'TIPOFAC','startsWith');
          table.filter(null,'PAGADA','startsWith');
        break;

        case 'Nitrocredit':
          
        table.filter(null,'creditCompany','i"equals"s');
        table.filter(null,'PAGADA','startsWith');
        
      break;

      }
  }
}

filtrarCliente(event:any){
  let clientesAfiltrar:any = this.clientes;
  /*for(let cliente of this.clientes){
      cliente.label = `${cliente.CardName} - ${cliente.FederalTaxID}`;
      clientesAfiltrar.push(cliente);
  }*/
  this.clientesFiltrados = this.filter2(event,clientesAfiltrar);
 
}

filter2(event: any, arrayFiltrar:any[]) {

  //////////////////////console.log(arrayFiltrar);
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





cambioFecha(){
  

  if (this.rangoFechas[1]) { // If second date is selected
    this.loading = true;
    this.dateFilter.hideOverlay();
    //////////////console.log(this.rangoFechas);
    this.getFacturasCliente();
    this.dateFilter.hideOverlay()
  };
}

verFactura(event:any){
  //////////////console.log(event);
}

newAccion(){

}

editAccion(){

}

viewAccion(){
  ////////////////console.log(this.selectedItem);
  let detalleFactura = this.facturasCliente.filter(factura => factura.DocNum === this.selectedItem[0].DocNum);
  //////////////console.log(this.rangoFechas);

  const ref = this.dialogService.open(FormFacturaComponent, {
    data: {
        id: parseInt(this.selectedItem[0].DocNum),
        detalleFactura
    },
    header: `${this.selectedItem[0].TIPOFAC} - ${this.selectedItem[0].DocNum}` ,
    width: '70%',
    height:'auto',
    contentStyle: {"overflow": "auto"},
    maximizable:true, 
  });

  ref.onClose.subscribe(() => {
    //this.getVehiculos();
    ////////////////////console.log("Refresh calendar");
  });
}

deleteAccion(){}


  async exportExcel() {

    let fields = {
    DocNum:'Número Documento',	
    TIPOFAC:'Tipo Documento',	
    PEDIDO:'Pedido de Venta',	
    DocDate:'Fecha',	
    DocDueDate:'Fecha de Vencimiento',	
    diasvencimiento:'Dias de Vencimiento',	
    PymntGroup:'Condición de pago',	
    PAGADA:'¿Pagada?',	
    DocTotal:'Total Documento',	
    PAGADOAFECHA:'Pagado a la Fecha',	
    creditCompany:'Empresa de Crédito'
  };

  let newData = await this.functionsService.extraerCampos(this.facturasClienteAgrupada,fields);

  await this.functionsService.exportarXLS(newData,'Facturas-Notas');

  /*import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.facturasClienteAgrupada);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, `facturas`);
  });*/
}  

/*saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}*/


formatCurrency(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    
}

clear(table: Table) {
  table.clear();
  this.filterTable.nativeElement.value = '';
  //this.filtros = {}
}

async restore(table: Table){

  
  //////////console.log(window.location);

  let path = `${window.location.protocol}//${window.location.host}/#/portal/reportes/facturas`;
  //////////console.log(path);

  window.location.href= (path);
  window.location.reload();


  
  //window.location.href = '/portal/reportes/facturas/';
}

PresionaEnter(event:any, linea?:any){
    
    if (event.key === "Enter") {
      console.log(linea);
      ////////////////////console.log('ENTER PRESS');
      if(event.target.value.length ===0 || !event.target.value){
        event.target.value =0;
      }

      let saldoLinea = (linea.LIQUITECH=='NO'?(linea.DocTotal-linea.PAGADOAFECHA):(linea.SALDOLIQUITECH))

      if(event.target.value> saldoLinea){
        this.messageService.add({severity:'warn', summary: '¡Advertencia!', detail:  `El valor a pagar ingresado ${event.target.value} es mayor al saldo pendiente de la factura`});
        event.target.value =0;
      }else{
        this.seleccionLinea();
      }
      
      
      
    }
  }

   cambio(event:any,linea?:any){
    console.log(linea);console.log('event.target.value',event.target);
    if(event.target.value.length ===0 || !event.target.value){
      event.target.value =0;
    }

     
      let saldoLinea = (linea.LIQUITECH=='NO'?(linea.DocTotal-linea.PAGADOAFECHA):(linea.SALDOLIQUITECH))

      if(event.target.value> saldoLinea){
        this.messageService.add({severity:'warn', summary: '¡Advertencia!', detail:  `El valor a pagar ingresado ${event.target.value} es mayor al saldo pendiente de la factura`});
        event.target.value =0;
      }else{
        this.seleccionLinea();
      }
  }

  seleccionLinea(){
    // console.log('Lineas seleccionadas',this.selectedItem)
    // this.cntFacturas = this.selectedItem.length

    

    let lineasSeleccionadas = this.facturasClienteAgrupada.filter(linea=>linea.valorPago!=0 && linea.valorPago!=null);

    console.log('Lineas seleccionadas',lineasSeleccionadas)

     this.cntFacturas = lineasSeleccionadas.length

    let totalPago = 0;

    for(let factura of lineasSeleccionadas){
      totalPago = totalPago+factura.valorPago
    }

    this.totalFacturas = totalPago;

    this.selectedItem = lineasSeleccionadas;
  }

   async clearUploader(uploaderFiles: FileUpload){
       ////console.log(uploaderFiles,this.filesToUpload);
       uploaderFiles.onClear;
    }
  
    removeFile($event:any,uploaderFiles: FileUpload){
        //////console.log('remove',$event,)
        this.filesToUpload = [];
        let currentFiles = uploaderFiles.files.filter((file: any)=>file != $event.file);
        //uploaderFiles.files = currentFiles;
        this.loadFiles(currentFiles);
    }
  
    loadFiles(uploaderFiles: any ){
      //////console.log('filesToUpload',uploaderFiles, this.uploadedFiles);
      let currentFiles = uploaderFiles;
      for(let currentFile of currentFiles){
        //////console.log('currentFile',currentFile);
        //const [file] = currentFile;
        this.filesToUpload.push({
          file:currentFile,
          //name:file.name
        })
      }
  
      //////console.log('this.filesToUpload',this.filesToUpload);
    }

    uploadSoportes(event:any){
      
      this.cargueSoporte = true;
      if(this.totalFacturas==0){
        this.messageService.add({severity:'error', summary: '¡Error!', detail:  `Debe ingresar el valor a pagar al menos de una factura`});
      }else if(this.totalFacturas!=this.totalSoportes){
        this.messageService.add({severity:'error', summary: '¡Error!', detail:  `El valor total a pagar en las facturas seleccionadas es diferente al valor a pagar del soporte `});
      }else if(this.filesToUpload.length ===0){
        this.messageService.add({severity:'error', summary: '¡Error!', detail:  `Debe adicionar al menos un soporte a cargar`});
      }else{
          let data = {
            cliente:this.clienteSeleccionado,
            facturas:this.selectedItem
          }

          this.functionsService.uploadSoportesPago(data)
              .subscribe({
                  next:(result)=>{
                    //////console.log('Upload ok',result);
                    //this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha cargado correctamente el anexo ${anexo.file.name}`});
                    // if(this.filesToUpload.length > 0){
                    //     for(let anexo of this.filesToUpload){
                    //       let body = new FormData();
                    //       body.append('file', anexo.file, anexo.file.name);
                    //       body.append('entidad', 'turnos');
                    //       body.append('id_relacion', turno.detalle_solicitud_turnos_historial[turno.detalle_solicitud_turnos_historial.length-1].id);
                    //       body.append('proceso', turno.estado);
                    //       body.append('nombre', anexo.file.name);

                    //       this.functionsService.uploadFile(body)
                    //           .subscribe({
                    //             next:(result)=>{
                    //               //////console.log('Upload ok',result);
                    //               this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha cargado correctamente el anexo ${anexo.file.name}`});
                    //             },
                    //             error:(err)=>{
                    //               this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo :'+err});
                    //             }
                    //           })
                    //     }
                  
                    // }
                  },
                  error:(err)=>{
                    this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo :'+err});
                  }
          })
      }
    }

    onUpload(event:UploadEvent) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
  

}
