import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { NovedadesService } from 'src/app/demo/service/novedades.service';
import { PedidosService } from 'src/app/demo/service/pedidos.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-novedades',
  providers:[ConfirmationService,MessageService],
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss']
})
export class NovedadesComponent implements  OnInit, OnChanges {

  @Input() rangoFechas!:any;

  hoy = new Date();
  primerDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  ultimoDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
  filtroRnagoFechas:Date[] = [this.primerDiaMes,this.ultimoDiaMes];

  tablaNovedades:any = {
    header:[{"novedad":{"label":"Novedad","type":"text","sizeCol":"6rem","align":"center","editable":false}}],
    data:[],
    colsSum:[]
  };

  loading:boolean = false;
  novedades:any[] = [];
  clasificaciones:any[] = [];
  locaciones:any[] = [];
  novedadesTurnos:any[] = [];
  verEncabezado:boolean = true;
  //selectedNovedad!:any;

  /*@ViewChild('filter') filter!: ElementRef;

  
  objectKeys = Object.keys;
  objectValues = Object.values;

  globalFilterFields!:string[];*/
  

  constructor(private pedidosService: PedidosService,
    private almacenesService: AlmacenesService,
    private messageService: MessageService,
    //private nodeService: NodeService,
    //private vehiculosService:VehiculosService,
    //private conductoresService:ConductoresService,
    private confirmationService: ConfirmationService,
    private novedadesService:NovedadesService,
    //private ordenesCargueService: OrdenesCargueService,
    //private transportadorasService:TransportadorasService,
    private solicitudTurnoService:SolicitudTurnoService,
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
    if(this.rangoFechas){
      this.filtroRnagoFechas = this.rangoFechas;
      this.verEncabezado = false;
    }
    this.getNovedades();
  }

  ngOnChanges(changes: SimpleChanges){
    //console.log('changes',changes['rangoFechas'].currentValue)
    this.filtroRnagoFechas = changes['rangoFechas'].currentValue
    this.getNovedaesTurno();
  }

  cambioFecha(event:any){
    
    
    if(event[1]){
      //console.log(this.filtroRnagoFechas);
      //this.filtroRnagoFechas = event;
      this.getNovedaesTurno();
  
    }
  }

  getNovedades(){
    this.novedadesService.getNovedades()
        .subscribe({
            next:async (novedades)=>{
              //console.log(novedades);
              this.novedades = novedades;
              this.clasificaciones = (await this.functionsService.groupArray(await this.functionsService.clonObject(novedades),'clase')).map((novedad)=>{
                return {code: novedad.clase, name: novedad.clase, label: novedad.clase}
              });
              //console.log(this.clasificaciones);
              this.getNovedaesTurno();
            },
            error:(err)=> {
                console.error(err);
            },
        })
  }

  async getNovedaesTurno(): Promise<void>{
    let params:any = {
      fechainicio:this.filtroRnagoFechas[0],
      fechafin:this.filtroRnagoFechas[1],
    }

    this.solicitudTurnoService.getNovedadesTurnoExtendido(params)
        .subscribe({
            next:async (novedadesTurnos)=>{
              ////console.log(novedadesTurnos.raw.filter((novedad: { detalle_solicitudes_turnos_id: number; })=>novedad.detalle_solicitudes_turnos_id === 2449))
              console.log(novedadesTurnos.raw)
              this.novedadesTurnos = novedadesTurnos.raw;
              this.locaciones = (await this.functionsService.groupArray(await this.functionsService.clonObject(novedadesTurnos.raw),'locacion_label')).map((locacion)=>{
                return {id: locacion.locacion_id,code:locacion.locacion_code,label: locacion.locacion_label}
              })
              //console.log(this.locaciones)
              await this.setReporte();
            },
            error:(err)=> {
              console.error(err);
            },
        })


  }


  async setReporte():Promise<void>{
    let headerTable = await this.configHeaderTablaNovedades();
    //console.log(headerTable);
    let dataTable = await this.configDataTablaNovedades();
    //console.log(dataTable);
    /*let tmpKeysHeader:any[]=[];
    for(let key in headerTable){
      
      tmpKeysHeader.push(key);
    }
    this.globalFilterFields = tmpKeysHeader;*/

    this.tablaNovedades.header = headerTable;
    this.tablaNovedades.data = dataTable;
  }

  async configHeaderTablaNovedades():Promise<any>{
    let headersTable:any[] = [];

    let objString:string =`[{"novedad":{"label":"Novedad","type":"text","sizeCol":"6rem","align":"center","editable":false,"field":"novedad"}`;
    let idLocacion:number = 1;

    if(this.locaciones.length > 0) {
      this.locaciones.forEach((locacion)=>{
        objString += `,"locacion${locacion.id}":{"label":"${locacion.label}","type":"numeric","sizeCol":"6rem","align":"center","editable":false,"sum":true,"field":"locacion${locacion.id}"}`;
      });
    }

    objString +=',"bgcolor":{"label":"","type":"","sizeCol":"0rem","align":"center","editable":false,"field":"bgcolor"}}]';

    headersTable = JSON.parse(objString);

    return headersTable;
  }

  async configDataTablaNovedades():Promise<any>{
    let dataTable:any[] = [];
    
    /*let objString:string = "";
    let objString2:string = "";
    for(let clase of this.clasificaciones){
      objString = `{"novedad":"${clase.code}"`;
      for(let locacion of this.locaciones){
        let lineasClaseNovedadLocacion:any[] = this.novedadesTurnos.filter(novedadTurno => novedadTurno.novedades_historial_clase === clase.code && novedadTurno.locacion_code === locacion.code);
        //console.log('lineasClaseNovedadLocacion',clase.code,locacion.code,lineasClaseNovedadLocacion);
        let novedadesClaseLocacion = (await this.functionsService.groupArray(await this.functionsService.clonObject(lineasClaseNovedadLocacion),'novedades_historial_novedad')).map((linea)=>{
          return {id: linea.novedades_historial_id,code:linea.novedades_historial_novedad,label: linea.novedades_historial_novedad}
        });
        //console.log('novedadesClaseLocacion',clase.code,locacion.code,novedadesClaseLocacion);
        for(let novedaClaseLocacion of novedadesClaseLocacion){
          objString2 = `{"novedad":"${novedaClaseLocacion.code}"`;
        }
        objString+=`,"locacion${locacion.id}":${lineasClaseNovedadLocacion.length}`;
      }
      objString+=`}`;
      dataTable.push(JSON.parse(objString));
    }*/

    /*let lineaClase:string ="";
    let lineaNovedad:string ="";
    let indexData:number = 0;
    for(let clase of this.clasificaciones){
      let novedadesClase:any = this.novedades.filter(novedad=>novedad.clase === clase.code);
      let totalClase:number = 0;
      for(let novedad of novedadesClase){
        lineaNovedad = `{"index":${indexData+1},"novedad":"${novedad.novedad}"`
        for(let locacion of this.locaciones){
          let lineasNovedadLocacion = this.novedadesTurnos.filter(novedadTurno => novedadTurno.novedades_historial_novedad === novedad.novedad && novedadTurno.locacion_code === locacion.code);
          lineaNovedad+=`,"locacion${locacion.id}":${lineasNovedadLocacion.length}`;
          totalClase = totalClase+lineasNovedadLocacion.length;
        }
        lineaNovedad+='}';
        indexData++;
      }

      lineaClase = `{"index":${indexData},"novedad":"${clase.code}"`;
      
    }*/

    let lineaClase:string ="";
    let lineaNovedad:string ="";
    for(let clase of this.clasificaciones){
      lineaClase = `{"novedad":"${clase.code}"`;
      for(let locacion of this.locaciones){
        let lineasClaseNovedadLocacion:any[] = this.novedadesTurnos.filter(novedadTurno => novedadTurno.novedades_historial_clase === clase.code && novedadTurno.locacion_code === locacion.code);
        lineaClase+=`,"locacion${locacion.id}":${lineasClaseNovedadLocacion.length}`;
      }
      lineaClase+=`,"bgcolor":"bg-bluegray-200 font-bold"}`;
      dataTable.push(JSON.parse(lineaClase));
      let novedadesClase:any = this.novedades.filter(novedad=>novedad.clase === clase.code);
      for(let novedad of novedadesClase){
        lineaNovedad = `{"novedad":"${novedad.novedad}"`;
        for(let locacion of this.locaciones){
          let lineasNovedadLocacion = this.novedadesTurnos.filter(novedadTurno => novedadTurno.novedades_historial_novedad === novedad.novedad && novedadTurno.locacion_code === locacion.code);
          lineaNovedad+=`,"locacion${locacion.id}":${lineasNovedadLocacion.length}`;
        }
        lineaNovedad+=',"bgcolor":"bg-white font-normal"}';
        dataTable.push(JSON.parse(lineaNovedad));
      }

    }

   

    return dataTable;
  }

  /*
  async exportExcel() {
    await this.functionsService.exportarXLS(this.tablaNovedades,'rpt_novedades')
  }

  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
*/

}
