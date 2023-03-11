import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-solicitudes',
  templateUrl: './listado-solicitudes.component.html',
  styleUrls: ['./listado-solicitudes.component.scss']
})



export class ListadoSolicitudesComponent {



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
                                                type:'numeric', 
                                                sizeCol:'6rem', 
                                                align:'center'
                                              },
                              'vehiculos': {
                                                label:'Cantidad vehiculos',
                                                type:'numeric', 
                                                sizeCol:'6rem', 
                                                align:'center'
                                              },
                              'toneladas': {
                                                label:'Cantidad toneladas',
                                                type:'numeric', 
                                                sizeCol:'6rem', 
                                                align:'center',
                                                currency:"TON"
                                           }
                          }
                        ];
  
  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];

  constructor(private router:Router){}

  nuevaSolicitud(event: any){
    console.log(event);
    this.router.navigate(['/portal/solicitudes-de-cargue/nueva']);
  }


}
