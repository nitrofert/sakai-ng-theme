import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService, FilterMetadata, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import * as FileSaver from 'file-saver';
import { EstadosDealleSolicitud } from '../../turnos/estados-turno.enum';
import { Calendar } from 'primeng/calendar';
import { DetalleSolicitudTurno } from '../interface/solicitud.interface';
import { SB1SLService } from 'src/app/demo/service/sb1sl.service';

@Component({
  selector: 'app-listado-solicitudes',
  providers:[ConfirmationService,MessageService],
  templateUrl: './listado-solicitudes.component.html',
  styleUrls: ['./listado-solicitudes.component.scss'],
  styles: [`
  :host ::ng-deep  .p-frozen-column {
      font-weight: bold;
  }

  :host ::ng-deep .p-datatable-frozen-tbody {
      font-weight: bold;
  }

  :host ::ng-deep .p-progressbar {
      height:.5rem;
  }
`]
})



export class ListadoSolicitudesComponent  implements  OnInit{

  @ViewChild('filter') filter!: ElementRef;

  permisosModulo!:any[];

  showBtnNew:boolean =false;
  showBtnEdit:boolean = false;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = false;
  infoUsuario!:any;



  dataTable:any[] = [{id: 1, docdate:'2023-02-01', clienteid:'CL900123098',pedidos:1, vehiculos:1,toneladas:20},
                     {id: 2, docdate:'2023-02-01', clienteid:'CL800123098',pedidos:2, vehiculos:1,toneladas:30},
                     {id: 3, docdate:'2023-02-01', clienteid:'CL900123098',pedidos:1, vehiculos:2,toneladas:30} ];
  headersTable:any[] = [
                          {
                              'id':{ 
                                    label:'Id Solicitud', 
                                    type:'text',
                                    sizeCol:'6rem',
                                    align:'center'
                                  }, 
                              'docdate': {
                                    label:'Fecha Solicitud',
                                    type:'date', 
                                    sizeCol:'6rem', 
                                    align:'center'
                                  }, 
                              'clienteid': {
                                        label:'Id Cliente',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'center'
                                      }, 
                              'pedidos': {
                                                label:'# artículos',
                                                type:'number', 
                                                sizeCol:'6rem', 
                                                align:'center'
                                              },
                              'vehiculos': {
                                                label:'Cantidad vehiculos',
                                                type:'number', 
                                                sizeCol:'6rem', 
                                                align:'center'
                                              },
                              'toneladas': {
                                                label:'Cantidad toneladas',
                                                type:'number', 
                                                sizeCol:'6rem', 
                                                align:'center',
                                                currency:"TON"
                                           }
                          }
                        ];
  
  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];

  columnsTable:number = 19;
  dataKey:string = "solicitudes_turno_id";
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

  pieChart:any;
  optionsPieChart:any;
  barStackChart:any;
  optionsBarStackChart:any;

  filtroLocaciones:any[]=[];


  constructor(private router:Router,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private  messageService: MessageService,
              private usuariosService:UsuarioService,
              private solicitudTurnoService:SolicitudTurnoService,
              public functionsService:FunctionsService,
              private sB1SLService:SB1SLService){}
              


  ngOnInit() {
    this.getPermisosModulo(); 
    Calendar.prototype.getDateFormat = () => 'dd/mm/yy';
    this.estadosTurno = this.solicitudTurnoService.estadosTurno;
    console.log(this.estadosTurno)
    
  }

  getPermisosModulo(){
    const modulo = this.router.url;
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              ////////////console.log(permisos);
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

              
              this.infoUsuario = await this.usuariosService.infoUsuario();
              //////////console.log(this.infoUsuario);
              this.getSolicitudesTurno();

            },
            error:(err)=>{
                console.error(err);
                this.messageService.add({severity:'error', summary: '!Error¡', detail:  err.error.message});
                
            }
        });
        
}


  async getSolicitudesTurno(){

    /*this.solicitudTurnoService.getSolicitudesTurno()
        .subscribe({
              next: (solicitudesTurnos)=>{
                 //////////console.log(solicitudesTurnos);
                  let solicitudes:any[] = [];

                  for(let solicitud of solicitudesTurnos){
                     
                    //////////console.log(solicitud);
                    let cantidadCarga =0;
                    let cantidadPedidos = 0;
                    let cantidadVehiculos =0;
                    for(let detalle_vehiculos of solicitud.detalle_solicitud_turnos){
                      cantidadVehiculos++;
                      for(let detalle_pedidos_vehiculo of detalle_vehiculos.detalle_solicitud_turnos_pedido){
                        cantidadPedidos++;
                        cantidadCarga += detalle_pedidos_vehiculo.cantidad;
                      }
                    }

                    solicitudes.push({
                      id:solicitud.id,
                      docdate:solicitud.createdAt,
                      clienteid: solicitud.clientes[0].CardCode,
                      pedidos:cantidadPedidos,
                      vehiculos: cantidadVehiculos,
                      toneladas: cantidadCarga
                    })
                  }

                  ////////////console.log(solicitudes);
                  this.dataTable = solicitudes;
              },
              error:(err)=>{
                console.error(err);
              }
        });*/

    this.solicitudTurnoService.getSolicitudesTurnoExtendido()
    .subscribe({
      next: async (solicitudesTurnos)=>{
        console.log(solicitudesTurnos);
         /*let solicitudesTMP = solicitudesTurnos.raw.map((solicitud: {
           detalle_solicitudes_turnos_fechacita: Date; 
           solicitudes_turno_created_at: Date;
           detalle_solicitudes_turnos_horacita: Date; 
           detalle_solicitudes_turnos_horacita2:Date;
           detalle_solicitudes_turnos_estado:string;
           bgColor:string;
           txtColor:string;
})=>{
           solicitud.solicitudes_turno_created_at = new Date(solicitud.solicitudes_turno_created_at);
           solicitud.detalle_solicitudes_turnos_fechacita = new Date(solicitud.detalle_solicitudes_turnos_fechacita);
           solicitud.detalle_solicitudes_turnos_horacita = new Date(solicitud.detalle_solicitudes_turnos_horacita);
           let horacita = new Date(solicitud.detalle_solicitudes_turnos_horacita).toLocaleTimeString("en-US", { hour12: false });
           let hoy = new Date();
           hoy.setHours(parseInt(horacita.split(":")[0]),parseInt(horacita.split(":")[1]),parseInt(horacita.split(":")[2]));
           solicitud.detalle_solicitudes_turnos_horacita2 =hoy;
           solicitud.bgColor = this.estadosTurno.find(estado =>estado.name === solicitud.detalle_solicitudes_turnos_estado).backgroundColor;
           solicitud.txtColor = this.estadosTurno.find(estado =>estado.name === solicitud.detalle_solicitudes_turnos_estado).textColor;

           return solicitud
         })*/

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
                                                    })=>{
                                                              


                                                              solicitud.solicitudes_turno_created_at = new Date(solicitud.solicitudes_turno_created_at);
                                                              solicitud.detalle_solicitudes_turnos_fechacita = new Date(solicitud.detalle_solicitudes_turnos_fechacita);
                                                              solicitud.detalle_solicitudes_turnos_horacita = new Date(solicitud.detalle_solicitudes_turnos_horacita);
                                                              let horacita = new Date(solicitud.detalle_solicitudes_turnos_horacita).toLocaleTimeString("en-US", { hour12: false });
                                                              let hoy = new Date();
                                                              hoy.setHours(parseInt(horacita.split(":")[0]),parseInt(horacita.split(":")[1]),parseInt(horacita.split(":")[2]));
                                                              solicitud.detalle_solicitudes_turnos_horacita2 =hoy;
                                                              console.log(solicitud.detalle_solicitudes_turnos_estado);
                                                              solicitud.bgColor = this.estadosTurno.find(estado =>estado.name === solicitud.detalle_solicitudes_turnos_estado).backgroundColor;
                                                              solicitud.txtColor = this.estadosTurno.find(estado =>estado.name === solicitud.detalle_solicitudes_turnos_estado).textColor;
                                                             
                                                             
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
                                                              

          //return solicitud
        })

        await this.configPieChart(dataPieChart);
        await this.configBarSatckChart(dataBarStackChart);

         ////////console.log(dataBarStackChart,dataPieChart,solicitudesTurnos.raw);
         this.solicitudesExtendida = solicitudesTurnos.raw;
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
              //console.log(solicitud);

             

              
            },
            error:(error)=>{
                console.error(error);
            }
    });*/
    
  }


  async configPieChart(dataPieChart:any):Promise<void>{

    let totalToneladas:number = (await this.functionsService.sumColArray(dataPieChart,[{value:0}]))[0].value;



    ////////console.log(totalToneladas);

    this.pieChart = {
      labels: dataPieChart.map((item: { name: any; })=>item.name),
      datasets:[
        {
          data:dataPieChart.map((item: { value: any; })=>(item.value*100)/totalToneladas),
          backgroundColor:dataPieChart.map((item: { backgroundColor: any; })=>item.backgroundColor),
          hoverBackgroundColor:dataPieChart.map((item: { backgroundColor: any; })=>item.backgroundColor),
        }
      ]
    }

    this.optionsPieChart = {
      plugins: {
        legend: {
            labels: {
                usePointStyle: true,
                color: this.textColor
            }
        }
      }
    }

  } 

  async configBarSatckChart(dataBarStackChart:any):Promise<void>{
    
    let dataBarStackChartOrder:any[] = await this.functionsService.sortArrayObject(dataBarStackChart,'data','ASC');
    
    

    dataBarStackChartOrder.forEach((item)=>{
      item.data = [item.data];
    })

    ////////console.log('ordenado',dataBarStackChartOrder);
    
    this.barStackChart = {
        labels:['Estados'],
        datasets:dataBarStackChart
      }

     
      
      this.optionsBarStackChart = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: this.textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: this.textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: this.surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: this.textColorSecondary
                },
                grid: {
                    color: this.surfaceBorder,
                    drawBorder: false
                }
            }
        }

      }
      
      /*
      this.optionsBarStackChart = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: this.textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: this.textColorSecondary
                },
                grid: {
                    color: this.surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: this.textColorSecondary
                },
                grid: {
                    color: this.surfaceBorder,
                    drawBorder: false
                }
            }
        }
      };*/
}
            


  nuevaSolicitud(event: any){
    ////////////console.log(event);
    this.router.navigate(['/portal/solicitudes-de-cargue/nueva']);
  }

  editSolicitud(event:any){

  }

  deleteSoliciturd(event:any){

  }




  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.solicitudesExtendida);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Solicitudes de cargue`);
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

  filterTime(table: Table,value: any, field:string, other:any, other2:any){

   
   let filtro:any = table.filters[field];
  
   /*let index = 0;
  
   if(filtro.filter((item: { value: any | null ; })=>item.value === value).length>0){
      index = filtro.findIndex((item: { value: any; })=>item.value === value);
   }
   if(index>0){
    index+=1;
   }
   ////////console.log(index);

   filtro[index].value = value;*/
   ////////console.log(field,value, filtro,other,other2 );
   //table.filter(value,field,filtro[0].matchMode);
 
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }



}
