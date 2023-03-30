import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-listado-solicitudes',
  providers:[ConfirmationService,MessageService],
  templateUrl: './listado-solicitudes.component.html',
  styleUrls: ['./listado-solicitudes.component.scss']
})



export class ListadoSolicitudesComponent  implements  OnInit{

  permisosModulo!:any[];

  showBtnNew:boolean =false;
  showBtnEdit:boolean = false;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = false;


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
                                                label:'Cantidad pedidos',
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

  constructor(private router:Router,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private  messageService: MessageService,
              private usuariosService:UsuarioService,
              private solicitudTurnoService:SolicitudTurnoService,){}
              


  ngOnInit() {
    this.getPermisosModulo(); 
    this.getSolicitudesTurno();
  }

  getSolicitudesTurno(){
    this.solicitudTurnoService.getSolicitudesTurno()
        .subscribe({
              next: (solicitudesTurnos)=>{
                  //console.log(solicitudesTurnos);
                  let solicitudes:any[] = [];

                  for(let solicitud of solicitudesTurnos){
                     
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

                  //console.log(solicitudes);
                  this.dataTable = solicitudes;
              },
              error:(err)=>{
                console.error(err);
              }
        });
  }
            
  getPermisosModulo(){
      const modulo = this.router.url;
      this.usuariosService.getPermisosModulo(modulo)
          .subscribe({
              next: (permisos)=>{
                //console.log(permisos);
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
              },
              error:(err)=>{
                  console.error(err);
              }
          });
          
  }

  nuevaSolicitud(event: any){
    //console.log(event);
    this.router.navigate(['/portal/solicitudes-de-cargue/nueva']);
  }

  editSolicitud(event:any){

  }

  deleteSoliciturd(event:any){

  }

}
