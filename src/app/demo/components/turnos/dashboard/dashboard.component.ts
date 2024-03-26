import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { EstadosDealleSolicitud } from '../estados-turno.enum';
import { TipoRol } from '../../admin/roles/roles.enum';
import { LocalidadesService } from 'src/app/demo/service/localidades.service';
import { DependenciasService } from 'src/app/demo/service/dependencias.service';
import { Table } from 'primeng/table';
import { FormTurnoComponent } from '../form-turno/form-turno.component';
import * as Handlebars from 'handlebars';

@Component({
  selector: 'app-dashboard-turnos',
  providers:[ConfirmationService,MessageService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponentTurno implements OnInit {

  infousuario!:any;

  locaciones:any[] = [];
  locacionSeleccionada:any = [];
  locacionesFiltradas:any[] = [];

  allbodegas:any[] = [];
  bodegas:any[] = [];
  bodegaSeleccionada:any = [];
  bodegasFiltradas:any[] = [];

  permisosModulo!:any;
  /*
  tablaProgramacionDiariaBodega:any = {
    header: this.configHeaderTablaProgramacionDiaria(),
    data:[]
  };
  lineasProgramacionDiariaBodega:any[] = [];
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

  
  tablaPlacasCompartidasBodegas:any = {
    header:[{"placas":{"label":"Placa","type":"text","sizeCol":"6rem","align":"center","editable":false}}],
    data:[],
    colsSum:[]
  };
*/
  loadingPC:boolean = true;

  dependencias:any[] = [];  
  lineasProgramacionDiariaGerencia:any[] = [];
  loadingPDG:boolean = true;
/*
  tablaProgramacionDiariaGerencia:any = {
    header:this.configHeaderTablaProgramacionDiariaGerencia(),
    data:[],
    colsSum:[]
  };


  tablaToneladasZona:any = {
    header:this.configHeaderTablaToneladasZona(),
    data:[],
    colsSum:[]
  };

  chartDataConsolidadoZona!:any;

  tablaConsolidadoTipoProducto:any = {
    header:this.configHeaderTablaConsolidadoTipoProducto(),

  };

  tablaConsolidadoModTPT:any = {
    header:this.configHeaderTablaConsolidadoModTPT(),

  };
  */

  localidades:any;
  dependencias_all:any;




  /******
   * Nuevo datos Dashboard logistica
   */

  @ViewChild('filter') filter!: ElementRef;
  
  hoy = new Date();
  primerDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  ultimoDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
  filtroRnagoFechas:Date[] = [this.primerDiaMes,this.ultimoDiaMes];

  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];

  columnsTable:number = 19;
  dataKey:string = "dataKey";
  loading:boolean = true;
  globalFilterFields:any[]=['solicitudes_turno_id',
                            'label_cliente',
                            'detalle_solicitudes_turnos_id',
                            'detalle_solicitudes_turnos_estado',
                            'locacion_label',
                            'transportadoras_nombre',
                            'vehiculos_placa',
                            'tipovehiculos_tipo',
                            'label_conductor',
                            'telefonos_conductor',
                            'detalle_solicitudes_turnos_pedidos_pedidonum',
                            'material',
                            'detalle_solicitudes_turnos_pedidos_cantidad',
                            'detalle_solicitudes_turnos_pedidos_bodega',
                            'remision',
                            'lugarentrega'
                          ];
  selectionMode:string = "multiple";
  selectedItem:any[] = [];
  estadosTurno:any[] = [];

  solicitudesExtendida:any[] = [];

  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--text-color');
  textColorSecondary = this.documentStyle.getPropertyValue('--text-color-secondary');
  surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

  filtroLocaciones:any[]=[];

  showBtnNew:boolean =false;
  showBtnEdit:boolean = false;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = false;
  showBtnAdmin:boolean = false;
  infoUsuario!:any;
  

  pdfDefinition:any =  {
    content: [
      'First paragraph',
      'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
    ]
  };

  htmlDoc:any = `<div>
  <h1>My title</h1>
  <p>
    This is a sentence with a <strong>bold word</strong>, <em>one in italic</em>,
    and <u>one with underline</u>. And finally <a href="https://www.somewhere.com">a link</a>.
  </p>
</div>`;




  constructor(private almacenesService:AlmacenesService,
              private messageService: MessageService,
              public dialogService: DialogService,
              public usuariosService:UsuarioService,
              private solicitudTurnoService:SolicitudTurnoService,
              private functionsService:FunctionsService,
              private router:Router,
              private localidadesService:LocalidadesService,
              private dependenciasService:DependenciasService,
              private confirmationService: ConfirmationService,){}


  async ngOnInit() {
    this.infousuario = await this.usuariosService.infoUsuario();
    this.getPermisosModulo();
    
   
   //////////console.log(this.infousuario);
    //this.configTablaProgramacionDiaria();

    
    //this.configTablaConsolidadoProgramacionDiaria();
    


  }

  async getPermisosModulo(){
    const modulo = this.router.url;
    console.log(modulo);
    

    this.showBtnNew =  await this.usuariosService.permisoModuloAccion('/portal/solicitudes-de-cargue','crear');
    this.showBtnEdit = await this.usuariosService.permisoModuloAccion('/portal/solicitudes-de-cargue','actualizar');
    this.showBtnExp = await this.usuariosService.permisoModuloAccion('/portal/solicitudes-de-cargue','exportar');
    this.showBtnDelete = await this.usuariosService.permisoModuloAccion('/portal/solicitudes-de-cargue','borrar');
    this.showBtnAdmin = await this.usuariosService.permisoModuloAccion('/portal/turnos','Aprobar turno');

    this.getLocalidades();
    
        
}

  async getLocalidades(){
    this.localidades =  await this.localidadesService.getLocalidades();
    
    this.getDependencias(); 
  }

  async getDependencias(){
    this.dependencias_all =  await this.dependenciasService.getDependencias();
   // this.turnosFehaSeleccionada = await this.getInfoTablaProgramacionDiaria();
   
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
            // //////////////////////////////////console.log(locaciones);
              this.locaciones = await this.setLocaciones(locaciones,this.infousuario.locaciones);
              this.locacionSeleccionada = this.locaciones[0];
              this.seleccionarLocacion(this.locacionSeleccionada);
              console.log('aqui va');
              ////////////////////////////////////console.log();
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
    //////////////console.log(locacion);
    let bodegas_locacion = this.allbodegas.filter(bodega=> bodega.locacion2 === locacion.locacion);
    //////////////console.log(bodegas_locacion);
    if(bodegas_locacion.length==0){
      //this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La locación ${locacion.label} no tiene bodegas asociadas`});
      ////////console.log(`La locación ${locacion.label} no tiene bodegas asociadas`);
    }else{
      //////////////console.log(bodegas_locacion);
      this.bodegas = bodegas_locacion;
      this.bodegaSeleccionada = this.bodegas[0];
      this.seleccionarBodega(this.bodegaSeleccionada);
    }

    this.setDashboard();
    
  }

  seleccionarBodega(bodega:any){
    //////////console.log(bodega);
   
  }

  async setDashboard():Promise<void>{
   
    this.getSolicitudesTurno();

    /**
     * COnfigurar tabla de programacion diaria bodega
     */
    
    /*this.loadingPDB = true;
    //this.lineasProgramacionDiariaBodega = this.turnosFehaSeleccionada.filter(linea => linea.pedidos_turno_bodega=== this.bodegaSeleccionada.code && linea.turnos_estado === EstadosDealleSolicitud.AUTORIZADO);
    this.lineasProgramacionDiariaBodega = this.turnosFehaSeleccionada.filter(linea => linea.pedidos_turno_bodega=== this.bodegaSeleccionada.code);
    //////////console.log(this.lineasProgramacionDiariaBodega);
    this.configTablaProgramacionDiaria();
    this.lineasConsolidadoProgramacionDiariaBodega = (await this.getInfoTablaConsolidadoProgramacionDiaria()).consolidadoItems;
    this.configTablaConsolidadoProgramacionDiaria();
    this.getPlacasCompartidas();
    this.lineasProgramacionDiariaGerencia = this.turnosFehaSeleccionada.filter(linea => linea.turnos_estado != EstadosDealleSolicitud.SOLICITADO && 
                                                                                        linea.turnos_estado != EstadosDealleSolicitud.PAUSADO && 
                                                                                        linea.turnos_estado != EstadosDealleSolicitud.CANCELADO &&
                                                                                        linea.turnos_estado != EstadosDealleSolicitud.SOLINVENTARIO );
    
    //////////console.log(this.lineasProgramacionDiariaGerencia);
    this.configTablaProgramacionGerencia();*/
}

async getSolicitudesTurno(){

   
  let params:any = {
    fechainicio:this.filtroRnagoFechas[0],
    fechafin:this.filtroRnagoFechas[1],
  }

  this.solicitudTurnoService.getSolicitudesTurnoExtendido(params)
  .subscribe({
    next: async (solicitudesTurnos)=>{
   
       let dataPieChart:any[] = [];
       let dataBarStackChart:any[any] = [];
      
       
       solicitudesTurnos.raw.forEach((solicitud: {
                                                            locacion_label: any;
                                                            filtroLocacion: { name: any; };
                                                            detalle_solicitudes_turnos_fechacita: Date; 
                                                            solicitudes_turno_created_at: Date;
                                                            detalle_solicitudes_turnos_horacita: Date; 
                                                            detalle_solicitudes_turnos_horacita2:Date;
                                                            detalle_solicitudes_turnos_estado:string;
                                                            bgColor:string;
                                                            txtColor:string;
                                                            detalle_solicitudes_turnos_pedidos_cantidad:number;
                                                            detalle_solicitudes_turnos_pedidos_dependencia:string;
                                                            detalle_solicitudes_turnos_pedidos_dependencia_label:string;
                                                            detalle_solicitudes_turnos_pedidos_localidad:string;
                                                            detalle_solicitudes_turnos_pedidos_localidad_label:string;
                                                  })=>{
                                                            


                                                            solicitud.solicitudes_turno_created_at = new Date(solicitud.solicitudes_turno_created_at);
                                                            solicitud.detalle_solicitudes_turnos_fechacita = new Date(solicitud.detalle_solicitudes_turnos_fechacita);
                                                            solicitud.detalle_solicitudes_turnos_horacita = new Date(solicitud.detalle_solicitudes_turnos_horacita);
                                                            let horacita = new Date(solicitud.detalle_solicitudes_turnos_horacita).toLocaleTimeString("en-US", { hour12: false });
                                                            let hoy = new Date();
                                                            hoy.setHours(parseInt(horacita.split(":")[0]),parseInt(horacita.split(":")[1]),parseInt(horacita.split(":")[2]));
                                                            solicitud.detalle_solicitudes_turnos_horacita2 =hoy;
                                                            ////////console.log(solicitud.detalle_solicitudes_turnos_estado);
                                                            if(this.estadosTurno.find(estado =>estado.name === solicitud.detalle_solicitudes_turnos_estado)){
                                                              solicitud.bgColor = this.estadosTurno.find(estado =>estado.name === solicitud.detalle_solicitudes_turnos_estado).backgroundColor;
                                                              solicitud.txtColor = this.estadosTurno.find(estado =>estado.name === solicitud.detalle_solicitudes_turnos_estado).textColor;
                                                            }else{
                                                              //console.log('Estado sin color',solicitud.detalle_solicitudes_turnos_estado, 'Se le asigna color bg-indigo-50');
                                                              solicitud.bgColor = 'indigo-50';
                                                              solicitud.txtColor = 'primary-900';
                                                            }
                                                           
                                                           
                                                           
                                                            solicitud.filtroLocacion = { name:solicitud.locacion_label}
                                                            if(this.filtroLocaciones.filter(filtro=>filtro.name === solicitud.locacion_label).length===0){
                                                              this.filtroLocaciones.push({name:solicitud.locacion_label})
                                                            }
                                                                                                                        

                                                            if(dataPieChart.filter(label=>label.name === solicitud.detalle_solicitudes_turnos_estado).length===0){
                                                              dataPieChart.push({name:solicitud.detalle_solicitudes_turnos_estado, 
                                                                                value:solicitud.detalle_solicitudes_turnos_pedidos_cantidad,
                                                                                backgroundColor:this.documentStyle.getPropertyValue(`--${solicitud.bgColor}`),
                                                                              })
                                                            }else{
                                                              let index = dataPieChart.findIndex(label=>label.name === solicitud.detalle_solicitudes_turnos_estado);
                                                              dataPieChart[index].value+=solicitud.detalle_solicitudes_turnos_pedidos_cantidad;
                                                            } 

                                                            if(dataBarStackChart.filter((label: { label: string; })=>label.label === solicitud.detalle_solicitudes_turnos_estado).length===0){
                                                              dataBarStackChart.push({
                                                                  //type: 'bar',
                                                                  label:solicitud.detalle_solicitudes_turnos_estado,
                                                                  backgroundColor:this.documentStyle.getPropertyValue(`--${solicitud.bgColor}`),
                                                                  borderColor:this.documentStyle.getPropertyValue(`--${solicitud.bgColor}`),
                                                                  //data:[solicitud.detalle_solicitudes_turnos_pedidos_cantidad]
                                                                  data:solicitud.detalle_solicitudes_turnos_pedidos_cantidad
                                                              });
                                                            }else{
                                                            
                                                              let index = dataBarStackChart.findIndex((label: { label: string; })=>label.label === solicitud.detalle_solicitudes_turnos_estado);
                                                              //dataBarStackChart[index].data.push(solicitud.detalle_solicitudes_turnos_pedidos_cantidad);
                                                              //dataBarStackChart[index].data[0]+=solicitud.detalle_solicitudes_turnos_pedidos_cantidad;
                                                              dataBarStackChart[index].data+=solicitud.detalle_solicitudes_turnos_pedidos_cantidad;
                                                              
                                                            }

                                                            solicitud.detalle_solicitudes_turnos_pedidos_dependencia_label = this.dependencias.find((denpendencia: { id: any; })=>denpendencia.id === solicitud.detalle_solicitudes_turnos_pedidos_dependencia)?this.dependencias.find((denpendencia: { id: any; })=>denpendencia.id === solicitud.detalle_solicitudes_turnos_pedidos_dependencia).name:'';
                                                            solicitud.detalle_solicitudes_turnos_pedidos_localidad_label = this.localidades.find((localidad: { id: any; })=>localidad.id === solicitud.detalle_solicitudes_turnos_pedidos_localidad)?this.localidades.find((localidad: { id: any; })=>localidad.id === solicitud.detalle_solicitudes_turnos_pedidos_localidad).name:'';
                                                            ////console.log(solicitud);
                                                            

        //return solicitud
      })

      //await this.configPieChart(dataPieChart);
      //await this.configBarSatckChart(dataBarStackChart);

       ////////////////console.log(dataBarStackChart,dataPieChart,solicitudesTurnos.raw);
       this.solicitudesExtendida = solicitudesTurnos.raw.filter((data: { detalle_solicitudes_turnos_estado: EstadosDealleSolicitud; })=>data.detalle_solicitudes_turnos_estado===EstadosDealleSolicitud.SOLICITADO);
       
       
       console.log('this.solicitudesExtendida',this.solicitudesExtendida);
       this.loading = false;
    },
    error:(err)=>{
      
      this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});
      console.error(err);
    }
  });

  /*this.solicitudTurnoService.getSolicitudesTurnoById(99)
      .subscribe({
          next:(solicitud)=>{
            //////////console.log(solicitud);

           

            
          },
          error:(error)=>{
              console.error(error);
          }
  });*/
  
}


  cambioFecha(event:any){
    
    
    if(event[1]){
      //console.log(this.filtroRnagoFechas);
      //this.filtroRnagoFechas = event;
      this.getSolicitudesTurno();
  
    }
  }

  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  filterTime(table: Table,value: any, field:string, other:any, other2:any){

   
   let filtro:any = table.filters[field];
  
   /*let index = 0;
  
   if(filtro.filter((item: { value: any | null ; })=>item.value === value).length>0){
      index = filtro.findIndex((item: { value: any; })=>item.value === value);
   }
   if(index>0){
    index+=1;
   }
   ////////////////console.log(index);

   filtro[index].value = value;*/
   ////////////////console.log(field,value, filtro,other,other2 );
   //table.filter(value,field,filtro[0].matchMode);
 
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }


 

  async filtrarLocacion(event:any){
    this.locacionesFiltradas = await this.functionsService.filter(event,this.locaciones);
  }

  
  async filtrarBodega(event:any){
    this.bodegasFiltradas = await this.functionsService.filter(event,this.bodegas);
  }

  nuevaSolicitud(event: any){
    ////////////////////console.log(event);
    //this.router.navigate(['/portal/solicitudes-de-cargue/nueva'],);
    

    const host: string =  location.origin;
    const url: string = host + '/#/' + String(this.router.createUrlTree(['/portal/solicitudes-de-cargue/nueva']));
    window.open(url, '_blank')

  }

  gestionarSolicitud(){
    console.log(this.selectedItem);
    this.confirmationService.confirm({
      message: `Esta seguro de gestionar la solicitud No. ${this.selectedItem[0].solicitudes_turno_id} turno de cargue No. ${this.selectedItem[0].detalle_solicitudes_turnos_id}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        const ref = this.dialogService.open(FormTurnoComponent, {
          data: {
              id: parseInt(this.selectedItem[0].detalle_solicitudes_turnos_id)
          },
          header: `Orden de cargue: ${this.selectedItem[0].detalle_solicitudes_turnos_id}` ,
          width: '70%',
          height:'auto',
          contentStyle: {"overflow": "auto"},
          maximizable:true, 
        });
    
        ref.onClose.subscribe(() => {
          //this.getTurnosPorLocalidad(this.localidadSeleccionada.code)
          //this.getCalendar();
          //////////// ////////console.log(("Refresh calendar");
          this.getSolicitudesTurno();
          this.selectedItem=[];
        });

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

  async exportExcel() {
    
    let fields = {
      detalle_solicitudes_turnos_estado:'Estado Turno',	
      locacion_locacion:'Locacion',	
      detalle_solicitudes_turnos_fechacita:'Fecha Turno',	
      detalle_solicitudes_turnos_horacita:'Hora Turno',	
      detalle_solicitudes_turnos_id:'Turno',	
      detalle_solicitudes_turnos_pedidos_pedidonum:'Pedido',	
      cliente_CardCode:'Código Cliente',	
      cliente_CardName:'Cliente',	
      cliente_FederalTaxID:'Nit',	
      detalle_solicitudes_turnos_pedidos_itemcode:'Código Item',	
      detalle_solicitudes_turnos_pedidos_itemname:'Descripción Item',	
      detalle_solicitudes_turnos_pedidos_tipoproducto:'Tipo Item',	
      detalle_solicitudes_turnos_pedidos_cantidad:'Cantidad',	
      detalle_solicitudes_turnos_pedidos_dependencia_label:'Dependencia',	
      detalle_solicitudes_turnos_pedidos_localidad_label:'Localidad',	
      detalle_solicitudes_turnos_pedidos_bodega:'Bodega',	
      transportadoras_nombre:'Transportadora',	
      vehiculos_placa:'Placa',	
      conductores_nombre:'Conductor',	
      conductores_numerocelular:'Télefono Conductor',	
      detalle_solicitudes_turnos_condiciontpt:'Condición de transporte',	
      lugarentrega:'Lugar Entrega',	
      remision:'Remisión'
    };

    let newData = await this.functionsService.extraerCampos(this.solicitudesExtendida,fields);

    await this.functionsService.exportarXLS(newData,'Solicitudes de cargue');

    /*import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.solicitudesExtendida);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Solicitudes de cargue`);
    });*/
  }  

  

  /*filter(event: any, arrayFiltrar:any[]) {

    ////////////////////////////////////////////////console.log((arrayFiltrar);
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < arrayFiltrar.length; i++) {
        const linea = arrayFiltrar[i];
        if (linea.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            filtered.push(linea);
        }
    }
    return filtered;
  }*/



  /*

 async seleccionarFecha(){
    ////////////////////////////////console.log(this.fechaProgramacion)
    this.turnosFehaSeleccionada = await this.getInfoTablaProgramacionDiaria();
    this.setDashboard();
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
    ////////////////////////////////console.log(this.fechaProgramacion);

    let programacionBodega = await this.solicitudTurnoService.turnosExtendido(params);
    console.log(programacionBodega);

    programacionBodega.raw.forEach((solicitud: {
     
          pedidos_turno_dependencia:string;
          pedidos_turno_dependencia_label:string;
          pedidos_turno_localidad:string;
          pedidos_turno_localidad_label:string;
    })=>{

          solicitud.pedidos_turno_dependencia_label = this.dependencias_all.find((denpendencia: { id: any; })=>denpendencia.id === solicitud.pedidos_turno_dependencia)?this.dependencias_all.find((denpendencia: { id: any; })=>denpendencia.id === solicitud.pedidos_turno_dependencia).name:'';
          solicitud.pedidos_turno_localidad_label = this.localidades.find((localidad: { id: any; })=>localidad.id === solicitud.pedidos_turno_localidad)?this.localidades.find((localidad: { id: any; })=>localidad.id === solicitud.pedidos_turno_localidad).name:'';
         ////////console.log(solicitud.pedidos_turno_dependencia);
         ////////console.log(solicitud.pedidos_turno_localidad);
          

    //return solicitud
    });

    //////console.log(programacionBodega.raw);
    return programacionBodega.raw;
  }

   configTablaProgramacionDiaria(){
    
    let tabla:any = {
      header:  this.configHeaderTablaProgramacionDiaria(),
      data:  this.configDataTablaProgramacionDiaria(this.lineasProgramacionDiariaBodega)
    };

    this.tablaProgramacionDiariaBodega = tabla;
    this.loadingPDB = false;

  }

   configHeaderTablaProgramacionDiaria(){
    let headersTable:any[] =  [{
      'hora': { label:'Hora',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'id': { label:'Turno',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'estado': { label:'Estado',type:'text', sizeCol:'6rem', align:'center', editable:false, backgroundColor:{arrayColor:this.solicitudTurnoService.estadosTurno}},
      'docnum': { label:'Número pedido',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'CardName': { label:'Cliente',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',},
      'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false},
      'placa': { label:'Placa',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'conductor': { label:'Conductor',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'cedula': { label:'Cedula',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'telefono': { label:'Teléfono',type:'text', sizeCol:'6rem', align:'center', editable:false},

    }];

    return headersTable;
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

    let consolidadoItems:any = await this.functionsService.groupArray(this.lineasProgramacionDiariaBodega,'pedidos_turno_itemcode');
    let totalToneladas:number = (await this.functionsService.sumColArray(this.lineasProgramacionDiariaBodega,[{pedidos_turno_cantidad:0}]))[0].pedidos_turno_cantidad;
    //////////////////////////////////console.log('consolidadoItems',consolidadoItems);
    
    await consolidadoItems.map(async (linea:any)=>{
        
        let prcItemBodega = linea.pedidos_turno_cantidad / totalToneladas;
        linea.totalToneladas = totalToneladas;
        linea.prcItemBodega = prcItemBodega;

        ////////////////////////////////////console.log('itemcode',linea.pedidos_turno_itemcode);
        ////////////////////////////////////console.log(this.lineasProgramacionDiariaBodega.filter(item=>item.pedidos_turno_itemcode === linea.pedidos_turno_itemcode));
    });

    let consolidadoProgramacionBodega:any = {
      totalToneladas,
      consolidadoItems

    };

    //////////////////////////////////console.log(consolidadoProgramacionBodega);
    
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
    
   
    //////////////////////////////console.log(this.tablaConsolidadoProgramacionDiariaBodega.data.length);

  }

   configHeaderTablaConsolidadoProgramacionDiaria(){
    let headersTable:any[] =  [{
      
      'itemcode': {label:'Número de artículo',type:'text', sizeCol:'6rem', align:'center',},
      'itemname': {label:'Descripción artículo/serv.',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      
    }];

    return headersTable;
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
  

  async getPlacasCompartidas(){
    this.tablaPlacasCompartidasBodegas.data = [];
    let turnosFehaSeleccionadaConfirmados = this.turnosFehaSeleccionada.filter(turno=>turno.turnos_estado === EstadosDealleSolicitud.AUTORIZADO);
    //console.log(turnosFehaSeleccionadaConfirmados)
    let configPlacasCompartidas = await this.configHeaderTablaPlacasCompartidasBodegas(turnosFehaSeleccionadaConfirmados);
    this.tablaPlacasCompartidasBodegas.header = configPlacasCompartidas.headersTable;
    ////////////////////////////console.log(turnosFehaSeleccionadaConfirmados,configPlacasCompartidas);

    
    this.tablaPlacasCompartidasBodegas.data = await this.configDataTablaPlacasCompartidasBodegas(configPlacasCompartidas,turnosFehaSeleccionadaConfirmados);

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


  async configTablaProgramacionGerencia(){

    this.dependencias = [];

    let headerTabla =   this.configHeaderTablaProgramacionDiariaGerencia();
    ////////////////console.log(this.lineasProgramacionDiariaGerencia);
    let dependencias = await this.functionsService.groupArray(this.lineasProgramacionDiariaGerencia,'pedidos_turno_dependencia');
    //////////console.log(dependencias);

    for(let dependencia of dependencias ){

      let lineasProgramacionDiariaDependencia = this.lineasProgramacionDiariaGerencia.filter(linea=>linea.pedidos_turno_dependencia === dependencia.pedidos_turno_dependencia);
      
      //////console.log(lineasProgramacionDiariaDependencia);
      let dataDependencia =  await this.configDataTablaProgramacionDiariaaGerencia(lineasProgramacionDiariaDependencia);
      //////////////////console.log(dataDependencia);
      let colsSumDependencia = await this.configSumTabla(headerTabla,dataDependencia)
      //////////////////console.log(colsSumDependencia);
      
      let lineasProgramacionDiariaDependenciaTipoProducto = await this.functionsService.groupArray(lineasProgramacionDiariaDependencia,'pedidos_turno_tipoproducto',[{pedidos_turno_cantidad:0}]);
      //////////////////console.log(lineasProgramacionDiariaDependenciaTipoProducto);
      let consolidadoTipoProductoDependencia = await this.configDataTablaConsolidadoTipoProducto(lineasProgramacionDiariaDependenciaTipoProducto);
      //////////////////console.log(consolidadoTipoProductoDependencia);
      let colSumConsolidadoTipoProductoDependencia = await this.configSumTabla(this.tablaConsolidadoTipoProducto.header,consolidadoTipoProductoDependencia)
      //////////////////console.log(colSumConsolidadoTipoProductoDependencia);

      let chartDataConsolidadoTipoProducto = await this.functionsService.setDataBasicChart(consolidadoTipoProductoDependencia,{label:'tipo',value:'cantidad'});


      let lineasProgramacionDiariaDependenciaModTPT = await this.functionsService.groupArray(lineasProgramacionDiariaDependencia,'turnos_condiciontpt',[{pedidos_turno_cantidad:0}]);
      //////////////////console.log(lineasProgramacionDiariaDependenciaTipoProducto);
      let consolidadoModTPT = await this.configDataTablaConsolidadooModTPT(lineasProgramacionDiariaDependenciaModTPT);
      //////////////////console.log(consolidadoTipoProductoDependencia);
      let colSumConsolidadoModTPT = await this.configSumTabla(this.tablaConsolidadoModTPT.header,consolidadoModTPT)
      //////////////////console.log(colSumConsolidadoTipoProductoDependencia);

      let chartDataConsolidadoModTPT = await this.functionsService.setDataBasicChart(consolidadoModTPT,{label:'tipo',value:'cantidad'});
      
      
      this.dependencias.push({
        dependencia: dependencia.pedidos_turno_dependencia_label,
        programacionDiaria:dataDependencia,
        colsSumProgramacionDiaria:colsSumDependencia,
        consolidadoTipoProductoDependencia,
        colSumConsolidadoTipoProductoDependencia,
        chartDataConsolidadoTipoProducto,
        consolidadoModTPT,
        colSumConsolidadoModTPT,
        chartDataConsolidadoModTPT

      })
    }
    
    let toneladasZonaPedido = await this.functionsService.groupArray(this.lineasProgramacionDiariaGerencia,'pedidos_turno_localidad',[{pedidos_turno_cantidad:0}]);

    ////////console.log(toneladasZonaPedido);
   
    let tablaToneladasZonaPedido:any = {
      header:  this.configHeaderTablaToneladasZona(),
      data:  this.configDataTablaTablaToneladasZona(toneladasZonaPedido)
    };

    let colsSum = await this.configSumTabla(tablaToneladasZonaPedido.header,tablaToneladasZonaPedido.data);
    this.tablaToneladasZona = tablaToneladasZonaPedido;
    this.tablaToneladasZona.colsSum = colsSum;

    //////////////////console.log(this.tablaToneladasZona);

    //this.chartDataConsolidadoZona = await this.setConsolidadoZonaDataChart(this.tablaToneladasZona.data)

    this.chartDataConsolidadoZona = await this.functionsService.setDataPieDoughnutChart(this.tablaToneladasZona.data,{label:'zona',value:'cantidad'});

    

    this.loadingPDG = false;

  }

  configHeaderTablaProgramacionDiariaGerencia(){
    let headersTable:any[] =  [{
      
      'dependencia': {label:'Dependencia',type:'text', sizeCol:'6rem', align:'center',},
      'bodega': {label:'Bodega',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'estado': {label:'Estado',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'cliente': {label:'Cliente',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'tipo': {label:'Tipo',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'pedido': {label:'Pedido venta',type:'text', sizeCol:'6rem', align:'center', editable:false},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      
    }];

    return headersTable;
  }

  async configDataTablaProgramacionDiariaaGerencia(data:any[]){

    //////////console.log(data);
    

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          dependencia:linea.pedidos_turno_dependencia_label,
          bodega:linea.pedidos_turno_bodega,
          estado:linea.turnos_estado,
          cliente:linea.pedidos_turno_CardName,
          tipo:linea.turnos_condiciontpt,
          pedido:linea.pedidos_turno_pedidonum,
          cantidad:linea.pedidos_turno_cantidad
          
        });
    }
    ////////console.log(dataTable);
    //Agrupar por pedido
    dataTable = await this.functionsService.groupArray(dataTable,'pedido',[{cantidad:0}]);
    //Ordenar por Dependencia - bodega 
    //dataTable = await this.functionsService.sortArrayObject(dataTable,'bodega','ASC')
    //////console.log(dataTable.filter(line=>line.dependencia === null));
    if(dataTable.filter(line=>line.dependencia === null).length==0){
      dataTable.sort((a,b)=> (a.dependencia.localeCompare(b.dependencia) || a.bodega.localeCompare(b.bodega)));
    }
    
    


    return dataTable;

  }

  configHeaderTablaToneladasZona(){
    let headersTable:any[] =  [{
      
      'zona': {label:'Zona',type:'text', sizeCol:'6rem', align:'center',},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      
    }];

    return headersTable;
  }

  configDataTablaTablaToneladasZona(data:any[]){

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          zona:linea.pedidos_turno_localidad==null?'SIN ZONA':linea.pedidos_turno_localidad_label,
          cantidad:linea.pedidos_turno_cantidad
        });
    }

    return dataTable;

  }
  

  configHeaderTablaConsolidadoTipoProducto(){
    let headersTable:any[] =  [{
      
      'tipo': {label:'Tipo Producto',type:'text', sizeCol:'6rem', align:'center',},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      
    }];

    return headersTable;
  }

  async configDataTablaConsolidadoTipoProducto(data:any[]){

    //////////////////console.log(data);
    

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          tipo:linea.pedidos_turno_tipoproducto,
          cantidad:linea.pedidos_turno_cantidad
          
        });
    }
    

    return dataTable;

  }

  configHeaderTablaConsolidadoModTPT(){
    let headersTable:any[] =  [{
      
      'tipo': {label:'Modo transporte',type:'text', sizeCol:'6rem', align:'center',},
      'cantidad': {label:'Cantidad a cargar',type:'number', sizeCol:'6rem', align:'center',currency:"TON",side:"rigth", editable:false,"sum":true},
      
    }];

    return headersTable;
  }

  async configDataTablaConsolidadooModTPT(data:any[]){

    //////////////////console.log(data);
    

    let dataTable:any[] = [];

    for(let linea of data){
        dataTable.push({
          tipo:linea.turnos_condiciontpt,
          cantidad:linea.pedidos_turno_cantidad
          
        });
    }
    

    return dataTable;

  }
  */

}
