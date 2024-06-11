import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { FletesTptComponent } from '../fletes-tpt/fletes-tpt.component';
import { PedidosService } from 'src/app/demo/service/pedidos.service';

@Component({
  selector: 'app-listado-fletes',
  providers:[ConfirmationService,MessageService],
  templateUrl: './listado-fletes.component.html',
  styleUrls: ['./listiado-fletes.component.scss']
})
export class ListadoFletesComponent implements OnInit,  OnChanges {


  @Input() rangoFechas!:any;

  hoy = new Date();
  primerDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  ultimoDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
  filtroRnagoFechas:Date[] = [this.primerDiaMes,this.ultimoDiaMes];
  

  infousuario!:any;

  locaciones:any[] = [];
  locacionSeleccionada:any = [];
  locacionesFiltradas:any[] = [];

  allbodegas:any[] = [];
  bodegas:any[] = [];
  bodegaSeleccionada:any = [];
  bodegasFiltradas:any[] = [];

  verEncabezado:boolean = true;

  permisosModulo!:any;
  
 

  dependencias:any[] = [];  
  lineasProgramacionDiariaGerencia:any[] = [];
  loadingPDG:boolean = true;


  localidades:any;
  dependencias_all:any;




  @ViewChild('filter') filter!: ElementRef;
  
 

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

  verFletes:boolean = false;

  turnosConFletes:any[] = [];
  

  selectedItemFletes:any[] = [];

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


tablaFletesTurnos:any[] = [];

turnos:any[] = [];
turnosEntites:any[] = [];


  constructor(private almacenesService:AlmacenesService,
              private messageService: MessageService,
              public dialogService: DialogService,
              public usuariosService:UsuarioService,
              private solicitudTurnoService:SolicitudTurnoService,
              private functionsService:FunctionsService,
              private router:Router,
              private localidadesService:LocalidadesService,
              private dependenciasService:DependenciasService,
              private confirmationService: ConfirmationService,
              private pedidosService: PedidosService,){}


  async ngOnInit() {
    
    this.infousuario = await this.usuariosService.infoUsuario();

    if(this.rangoFechas){
      this.filtroRnagoFechas = this.rangoFechas;
      this.verEncabezado = false;
    }

    this.getPermisosModulo();
    
   
   //////////////////console.log(this.infousuario);
    //this.configTablaProgramacionDiaria();

    
    //this.configTablaConsolidadoProgramacionDiaria();
    


  }

  ngOnChanges(changes: SimpleChanges){
    //////////console.log('changes',changes['rangoFechas'].currentValue)
    this.filtroRnagoFechas = changes['rangoFechas'].currentValue
    this.getPermisosModulo();
   
  }

  async getPermisosModulo(){
    const modulo = this.router.url;
    ////////console.log(modulo);
    

    this.showBtnNew =  await this.usuariosService.permisoModuloAccion('/portal/solicitudes-de-cargue','crear');
    this.showBtnEdit = await this.usuariosService.permisoModuloAccion('/portal/solicitudes-de-cargue','actualizar');
    this.showBtnExp = await this.usuariosService.permisoModuloAccion('/portal/solicitudes-de-cargue','exportar');
    this.showBtnDelete = await this.usuariosService.permisoModuloAccion('/portal/solicitudes-de-cargue','borrar');
    this.showBtnAdmin = await this.usuariosService.permisoModuloAccion('/portal/turnos','Aprobar turno');


    this.verFletes = await this.usuariosService.permisoModuloAccion('/dashboard-logistica','ver fletes');
    //////console.log(this.verFletes);

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
            // //////////////////////////////////////////console.log(locaciones);
              this.locaciones = await this.setLocaciones(locaciones,this.infousuario.locaciones);
              //this.locacionSeleccionada = this.locaciones[0];
              //this.seleccionarLocacion(this.locacionSeleccionada);
              ////////console.log('aqui va');
              ////////////////////////////////////////////console.log();
              await this.setDashboard();
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
    //////////////////////console.log(locacion);
    let bodegas_locacion = this.allbodegas.filter(bodega=> bodega.locacion2 === locacion.locacion);
    //////////////////////console.log(bodegas_locacion);
    if(bodegas_locacion.length==0){
      //this.messageService.add({severity:'error', summary: '!Error¡', detail:  `La locación ${locacion.label} no tiene bodegas asociadas`});
      ////////////////console.log(`La locación ${locacion.label} no tiene bodegas asociadas`);
    }else{
      //////////////////////console.log(bodegas_locacion);
      this.bodegas = bodegas_locacion;
      this.bodegaSeleccionada = this.bodegas[0];
      this.seleccionarBodega(this.bodegaSeleccionada);
    }

    this.setDashboard();
    
  }

  seleccionarBodega(bodega:any){
    //////////////////console.log(bodega);
   
  }

  async setDashboard():Promise<void>{
   
    this.getSolicitudesTurno();
    
}

async getSolicitudesTurno(){

   
  let params:any = {
    fechainicio:this.filtroRnagoFechas[0],
    fechafin:this.filtroRnagoFechas[1],
  }

  this.solicitudTurnoService.getSolicitudesTurnoExtendido(params)
  .subscribe({
    next: async (solicitudesTurnos)=>{
       //////console.log(solicitudesTurnos);
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
                                                            ////////////////console.log(solicitud.detalle_solicitudes_turnos_estado);
                                                            if(this.estadosTurno.find(estado =>estado.name === solicitud.detalle_solicitudes_turnos_estado)){
                                                              solicitud.bgColor = this.estadosTurno.find(estado =>estado.name === solicitud.detalle_solicitudes_turnos_estado).backgroundColor;
                                                              solicitud.txtColor = this.estadosTurno.find(estado =>estado.name === solicitud.detalle_solicitudes_turnos_estado).textColor;
                                                            }else{
                                                              //////////console.log('Estado sin color',solicitud.detalle_solicitudes_turnos_estado, 'Se le asigna color bg-indigo-50');
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
                                                            ////////////console.log(solicitud);
                                                            

        //return solicitud
      })

      //await this.configPieChart(dataPieChart);
      //await this.configBarSatckChart(dataBarStackChart);

       ////////////////////////console.log(dataBarStackChart,dataPieChart,solicitudesTurnos.raw);

       this.turnos = solicitudesTurnos.raw.filter((item: { detalle_solicitudes_turnos_condiciontpt: string; })=>item.detalle_solicitudes_turnos_condiciontpt==='TRANSP');
       let turnosFletes:any  = solicitudesTurnos.raw.filter((data: { detalle_solicitudes_turnos_pedidos_itemcode: string; })=>data.detalle_solicitudes_turnos_pedidos_itemcode.startsWith('SF'));
       this.turnosEntites = await this.setTurnosEntites(solicitudesTurnos.entities);
       ////console.log(this.turnosEntites); 
       
      
        await this.setTableFletes(turnosFletes);
             
       ////////console.log('this.solicitudesExtendida',this.solicitudesExtendida);
       this.loading = false;
    },
    error:(err)=>{
      
      this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});
      console.error(err);
    }
  });

 
  
}

async setTurnosEntites(solicitudes:any): Promise<any>{

  let turnos:any[] = [];
  for(let solicitud of solicitudes){
    for(let turno of solicitud.detalle_solicitud_turnos){
        if(turno.condiciontpt==='TRANSP'){
          turnos.push(turno);
        }
    }
  }

  return turnos;

}

async setTableFletes(turnos:any[]):Promise<void>{

  //////console.log(turnos);



 let tablaFletesTurnos = await turnos.map((item)=>{
    item.dataKey = item.dataKey+'-'+item.detalle_solicitudes_turnos_pedidos_pedidonum+'-'+item.detalle_solicitudes_turnos_pedidos_linea; 
 })
 //this.tablaFletesTurnos = tablaFletesTurnos;
 this.tablaFletesTurnos = turnos;
 console.log('this.tablaFletesTurnos',this.tablaFletesTurnos);
 this.loading = false;


}


  cambioFecha(event:any){
    
    
    if(event[1]){
      //////////console.log(this.filtroRnagoFechas);
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
   ////////////////////////console.log(index);

   filtro[index].value = value;*/
   ////////////////////////console.log(field,value, filtro,other,other2 );
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
    ////////////////////////////console.log(event);
    //this.router.navigate(['/portal/solicitudes-de-cargue/nueva'],);
    

    const host: string =  location.origin;
    const url: string = host + '/#/' + String(this.router.createUrlTree(['/portal/solicitudes-de-cargue/nueva']));
    window.open(url, '_blank')

  }

  gestionarSolicitud(){
    ////////console.log(this.selectedItem);
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
          //////////// ////////////////console.log(("Refresh calendar");
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

  gestionarFletes(){
   ////console.log(this.selectedItemFletes);
    
    this.confirmationService.confirm({
      message: `Esta seguro de gestionar el flete del turno No. ${this.selectedItemFletes[0].detalle_solicitudes_turnos_id}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        const ref = this.dialogService.open(FletesTptComponent, {
          data: {
              id: parseInt(this.selectedItemFletes[0].detalle_solicitudes_turnos_id),
              dataKey: this.selectedItemFletes[0].dataKey
          },
          header: `Orden de cargue: ${this.selectedItemFletes[0].detalle_solicitudes_turnos_id}` ,
          width: '70%',
          height:'auto',
          contentStyle: {"overflow": "auto"},
          maximizable:true, 
        });
    
        ref.onClose.subscribe(() => {
          //this.getTurnosPorLocalidad(this.localidadSeleccionada.code)
          //this.getCalendar();
          //////////// ////////////////console.log(("Refresh calendar");
          this.getSolicitudesTurno();
          this.selectedItemFletes=[];
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

 

  sincronizarFletes(){
    this.confirmationService.confirm({
      message: `Esta seguro sincronizar la tabla de fletes?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {

        let turnosSinFletes:any[] = await this.getTurnosSinFletes();
        //////console.log('turnosSinFletes',turnosSinFletes);
        this.matchTurnosFletes(turnosSinFletes);

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

  async getTurnosSinFletes(): Promise<any[]>{

    let turnosSinFletes:any[] = [];

    for(let turno of this.turnos){
      //////console.log(turno.detalle_solicitudes_turnos_id);
      //////console.log(this.turnos.filter(item=>item.detalle_solicitudes_turnos_condiciontpt==='TRANSP' && item.detalle_solicitudes_turnos_id===turno.detalle_solicitudes_turnos_id && item.detalle_solicitudes_turnos_pedidos_itemcode.startsWith('SF')))
      if(this.turnos.filter(item=>item.detalle_solicitudes_turnos_condiciontpt==='TRANSP' && item.detalle_solicitudes_turnos_id===turno.detalle_solicitudes_turnos_id && item.detalle_solicitudes_turnos_pedidos_itemcode.startsWith('SF')).length ===0){
        if(turnosSinFletes.filter(item=>item.detalle_solicitudes_turnos_id=== turno.detalle_solicitudes_turnos_id).length ===0){
          turnosSinFletes.push(turno);
        }
      }

    }


    return turnosSinFletes;
  }

  matchTurnosFletes(turnos:any){
      this.pedidosService.getSaldosPedidosFletes()
          .subscribe({
              next:async (saldos)=>{
                  console.log(saldos);
                  let fletes = (await this.functionsService.objectToArray(saldos)).filter((saldo: {ItemCode: any; TIPOPROD: string;Turno_Portal:any})=>saldo.TIPOPROD=='Flete' && saldo.ItemCode.startsWith('SF') && saldo.Turno_Portal!=null); 
                  //////console.log(fletes);
                  let flete:any = [];

                  for await (let turno of turnos){
                    //////console.log(turno.detalle_solicitudes_turnos_id);
                    if(fletes.filter((flete: { Turno_Portal: any; })=>flete.Turno_Portal == turno.detalle_solicitudes_turnos_id).length>0){
                        flete = fletes.find((flete: { Turno_Portal: any; })=>flete.Turno_Portal == turno.detalle_solicitudes_turnos_id);
                        await this.asignarFleteTurno(turno.detalle_solicitudes_turnos_id,flete);
                    }
                  }

                  this.setDashboard();
              },
              error:(err)=>{
                  console.error(err);
              }
          })
  }

  async asignarFleteTurno(turnoid:any, flete:any):Promise<void>{

    ////console.log('turno',turnoid);
    
    let turno:any= this.turnosEntites.find(turnoEntitie=>turnoEntitie.id === turnoid);
    console.log('turno',turno);
    console.log('flete',flete);
    
    let detalle_solicitud_turnos_pedido:any[]=turno.detalle_solicitud_turnos_pedido;
    for await(let pedido of detalle_solicitud_turnos_pedido){
      pedido.lineaUpdate = {update:false, create:false};
      pedido.cantidadOld =pedido.cantidad;
    }
    /*let detalle_solicitud_turnos_pedido:any[] = await turno.detalle_solicitud_turnos_pedido.map((pedido: { lineaUpdate: { update: boolean; create: boolean; }; cantidadOld: any; cantidad: any; })=>{
                                                  pedido.lineaUpdate = {update:false, create:false};
                                                  pedido.cantidadOld =pedido.cantidad;
                                                });*/
    //console.log(detalle_solicitud_turnos_pedido);              
    let lineaFlete:any = {
      CardCode:flete.CardCode,
      CardName:flete.CardName,
      bodega:flete.WhsCode_Code,
      cantidad:flete.Quantity,
      cantidad_pedido:flete.SALDO,
      cantidad_sacos:0,
      dependencia:flete.DEPENDENCIA,
      docentry:flete.DocEntry,
      email_asistente:flete.Correo_Asistente,
      email_vendedor:flete.Email,
      estado:'A',
      factura_tpt:null,
      fecha_factura_tpt:null,
      flete_tonelada:0,
      hoja_entrada:null,
      itemcode:flete.ItemCode,
      itemname:flete.Dscription,
      linea:flete.LineNum,
      localidad:flete.LOCALIDAD,
      lote_produccion:null,
      lugarentrega:turno.lugarentrega,
      municipioentrega:turno.municipioentrega,
      nombre_asistente:flete.Nombre_Asistente,
      observacion_flete:null,
      orden_compra:null,
      pedidonum:flete.DocNum,
      remision:turno.remision,
      tarifa_tonelada:flete.PRECIOU_CONIVA,
      tipoproducto:flete.TIPOPROD,
      toneladas_metircas:flete.Quantity,
      vendedor:flete.SlpName,
      lineaUpdate:{update:false, create:true},
      cantidadOld:flete.Quantity,
      id:0
    }

    detalle_solicitud_turnos_pedido.push(lineaFlete);

    //console.log(detalle_solicitud_turnos_pedido);

    let data:any = {
      historial : {
                    estado:turno.estado,
                    fechaaccion:new Date(),
                    horaaccion:new Date(),
                    comentario:`Se genero la linea de felte para el turno bajo el pedido ${flete.DocNum}`
                  },
                  pedidos_detalle_solicitud:detalle_solicitud_turnos_pedido
    };

    console.log('data',data);
    
    this.solicitudTurnoService.updateInfoTruno(turno.id,data)
        .subscribe({
          next:async (turno)=>{
            console.log('turno actualizado',turno);
            this.messageService.add({severity:'success', summary:'!Información!', detail:`Se adiciono correctamente la linea de felete para el turno ${turno.id} asociada al pedido ${flete.DocNum}`});


          },
          error:(err)=>{
            console.error(err);
            this.messageService.add({severity:'error', summary:'Rejected', detail:err});
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

  

 

}
