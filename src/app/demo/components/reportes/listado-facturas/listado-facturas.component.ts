import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { SB1XEService } from 'src/app/demo/service/sb1xe.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { MenuService } from 'src/app/layout/shared/menu/app.menu.service';
import { FormFacturaComponent } from '../form-factura/form-factura.component';

@Component({
  selector: 'app-listado-facturas',
  providers:[ConfirmationService,MessageService],
  templateUrl: './listado-facturas.component.html',
  styleUrls: ['./listado-facturas.component.scss']
})
export class ListadoFacturasComponent  implements  OnInit{

  
  
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
  globalFilterFields:any[]= ['DocNum','NumAtCard','PEDIDO','DocDate','DocDueDate','Dias de vencimiento','PymntGroup','DocTotal'];
  selectedItem:any[] = []; 
  columnsTable:number=this.globalFilterFields.length+2; 
  hoy:Date = new Date();

  info_usuario!:any;
  clientes:any[] = [];
  clienteSeleccionado:any = []; 
  clientesFiltrados:any[] = [];
  facturasCliente:any[] = [];
  facturasClienteAgrupada:any[] =[];

  rangoFechas:Date[] = [];
  @ViewChild('dateFilter') dateFilter!: any;
  

  @ViewChild('filter') filterTable!: ElementRef;

  constructor(private router:Router,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private menuService:MenuService,
              private usuariosService:UsuarioService,
              private usuarioService: UsuarioService,
              private sb1XEService:SB1XEService,
              private functionsService:FunctionsService){}


  async ngOnInit() {
    this.getPermisosModulo(); 

    //this.getListadoMenu();
    //Obtener info usuario
    this.info_usuario = await this.usuarioService.infoUsuario();
    this.rangoFechas = [await this.functionsService.dateAdd(new Date(),-3,'months'),new Date() ];
    this.getClientesUsuario();
    ////console.log(await this.functionsService.dateAdd(new Date(),3,'months'));

    
  }

  getPermisosModulo(){
    const modulo = this.router.url;
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: (permisos)=>{
             // //console.log(permisos);
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

async getClientesUsuario(){
  if(this.info_usuario.clientes.length>0){
    let clientes:any =[];
    for(let cliente of this.info_usuario.clientes){
      cliente.label = `${cliente.CardName} - ${cliente.FederalTaxID}`;
      clientes.push(cliente);
    }

    this.clientes = clientes;
    this.clienteSeleccionado = this.clientes[0];

    this.getFacturasCliente();

  }
}

async seleccionarCliente(clienteSeleccionado:any){
  ////console.log(clienteSeleccionado);
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

  facturasCliente =(await this.functionsService.objectToArray(facturasCliente));
  this.facturasCliente = facturasCliente;
  console.log('facturasCliente',facturasCliente);

  let facturasClienteAgrupada = await  this.functionsService.groupArray(facturasCliente,'DocNum');

  ////console.log(facturasPorPagarAgrupada);

  ////console.log(Math.ceil(await this.functionsService.dateDif(new Date(), new Date('2023-06-15'), 'days')));

  for(let linea of facturasClienteAgrupada){
      linea.diasvencimiento = Math.ceil(await this.functionsService.dateDif(new Date(), new Date(linea.DocDueDate), 'days'));
  }

  console.log('facturasClienteAgrupada',facturasClienteAgrupada);



  this.facturasClienteAgrupada = await this.functionsService.sortArrayObject(facturasClienteAgrupada,'DocNum','DESC');



  this.loading = false;
}


filtrarCliente(event:any){
  let clientesAfiltrar:any = this.clientes;
  /*for(let cliente of this.clientes){
      cliente.label = `${cliente.CardName} - ${cliente.FederalTaxID}`;
      clientesAfiltrar.push(cliente);
  }*/
  this.clientesFiltrados = this.filter(event,clientesAfiltrar);
 
}

filter(event: any, arrayFiltrar:any[]) {

  //////////console.log(arrayFiltrar);
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
    //console.log(this.rangoFechas);
    this.getFacturasCliente();
    this.dateFilter.hideOverlay()
  };
}

verFactura(event:any){
  //console.log(event);
}

newAccion(){

}

editAccion(){

}

viewAccion(){
  ////console.log(this.selectedItem);
  let detalleFactura = this.facturasCliente.filter(factura => factura.DocNum === this.selectedItem[0].DocNum);
  //console.log(this.rangoFechas);

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
    ////////console.log("Refresh calendar");
  });
}

deleteAccion(){}


exportExcel() {
  import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataTable);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, `${this.nameExport}`);
  });
}  

saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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

}
