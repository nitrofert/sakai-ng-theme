import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UsuarioService } from '../../service/usuario.service';
import { VehiculosService } from '../../service/vehiculos.service';
import { FunctionsService } from '../../service/functions.service';
import { FormVehiculoComponent } from './form-vehiculo/form-vehiculo.component';

@Component({
  selector: 'app-vehiculos',
  providers:[ConfirmationService,MessageService],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent  implements  OnInit{
  permisosModulo!:any[];

  showBtnNew:boolean =false;
  showBtnEdit:boolean = false;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = false;
  showBtnActivate:boolean = false;
  infoUsuario!:any;


  dataTable:any[] = [];
  headersTable:any[] = [
                          {
                                'id':{ 
                                    label:'Código', 
                                    type:'text',
                                    sizeCol:'6rem',
                                    align:'center',
                                    field:'id'
                                  }, 
                              'placa': {
                                    label:'Placa',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center',
                                    field:'placa'
                                  }, 
                              'capacidad': {
                                        label:'Capacidad',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'center',
                                        field:'capacidad'
                                      }, 
                              'pesovacio': {
                                          label:'Pesp vacio',
                                          type:'text', 
                                          sizeCol:'6rem', 
                                          align:'center',
                                          field:'pesovacio'
                                        },
                              'pesomax': {
                                label:'Peso Maximo',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center',
                                field:'pesomax'
                              },
                              'volumen': {
                                label:'Volumen',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center',
                                field:'volumen'
                              },
                              'tipo': {
                                        label:'Tipo',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'center',
                                        field:'tipo'
                                      },
                              'estado': {
                                        label:'Estado',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'center',
                                        field:'estado'
                                      }
                          }
                        ];
  
  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];

  constructor(private router:Router,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private  messageService: MessageService,
    private usuariosService:UsuarioService,
    private vehiculosService:VehiculosService,
    public functionsService:FunctionsService){}
    
  ngOnInit() {
  this.getPermisosModulo(); 

  }

  getPermisosModulo(){
    const modulo = this.router.url;
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              //////////console.log(permisos);
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
              this.showBtnActivate = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='activar').valor;
              
              this.infoUsuario = await this.usuariosService.infoUsuario();
              ////////console.log(this.infoUsuario);
              this.getTransportadoras();
  
            },
            error:(err)=>{
                console.error(err);
            }
        });
          
  }

  getTransportadoras(){
    this.vehiculosService.getVehiculos()
    .subscribe({
        next:(vehiculos)=>{
         // console.log(vehiculos)

          let dataVehiculos:any[] = [];
              for(let vehiculo of vehiculos){
                
                dataVehiculos.push({
                  id:vehiculo.id,
                  placa:vehiculo.placa,
                  capacidad:vehiculo.capacidad,
                  pesovacio:vehiculo.pesovacio,
                  pesomax:vehiculo.pesomax,
                  volumen:vehiculo.volumen,
                 
                  tipo:vehiculo.tipo_vehiculo.tipo,
                  estado:vehiculo.estado

                });
              }
              this.dataTable = dataVehiculos;
        },
        error:(err)=>{
          console.error(err); 
        },
    });
  }

  nuevo(event:any){
    const ref = this.dialogService.open(FormVehiculoComponent, {
      data: {
       id: ''
      },
      header: `Nuevo vehículo` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async (infoVehiculo) => {
     this.getTransportadoras();
      
    });
  }

  editar(event:any){
    console.log(event)
    const ref = this.dialogService.open(FormVehiculoComponent, {
      data: {
       id: event
      },
      header: `Editar vehículo` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async (infoVehiculo) => {
      this.getTransportadoras();
      
    });
  }

  borrar(event:any){

    this.confirmationService.confirm({
      message: 'Esta seguro de proceder con la inactivación de los vehiculos seleccionados?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        console.log(event);
        let idsInactivar = event.map((item: { id: any; })=>{
          return item.id;
        })
        this.vehiculosService.inactivar(idsInactivar)
            .subscribe({
              next:(results)=>{
                if(results){
                    for(let result of results){
                      this.messageService.add({severity:result.severity, summary:result.summary, detail:`El vehiculo ${event.filter((item: { id: any; })=>item.id === result.id)[0].nombre} ${result.detail}`});
                      if(result.severity==='success'){
                        let indexTransportadora = this.dataTable.findIndex(item=>item.id === result.id);
                        this.dataTable[indexTransportadora].estado = 'INACTIVO';
                      }
                    }
                }
              },
              error:(err)=>{
                  console.error(err);
                  this.messageService.add({severity:'danger', summary:'Error', detail:`Ocurrio un error al inactivar los vehiculos seleccionados ${err}`});
              }
        })

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

  activar(event:any){

    this.confirmationService.confirm({
      message: 'Esta seguro de proceder con la activación de los vehiculos seleccionados?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(event);
        let idsActivar = event.map((item: { id: any; })=>{
          return item.id;
        })
        this.vehiculosService.activar(idsActivar)
            .subscribe({
              next:(results)=>{
                if(results){
                    for(let result of results){
                      this.messageService.add({severity:result.severity, summary:result.summary, detail:`El vehiculo ${event.filter((item: { id: any; })=>item.id === result.id)[0].nombre} ${result.detail}`});
                      if(result.severity==='success'){
                        let indexTransportadora = this.dataTable.findIndex(item=>item.id === result.id);
                        this.dataTable[indexTransportadora].estado = 'ACTIVO';
                      }
                    }
                }
              },
              error:(err)=>{
                  console.error(err);
                  this.messageService.add({severity:'danger', summary:'Error', detail:`Ocurrio un error al activar los vehiculos seleccionados ${err}`});
              }
        })
       

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
}
