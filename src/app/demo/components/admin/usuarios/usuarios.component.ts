import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent {
  dataTable:any[] = [];
  headersTable:any[] = [
                          {
                              'id':{ 
                                    label:'Id', 
                                    type:'text',
                                    sizeCol:'6rem',
                                    align:'center'
                                  }, 
                              'username': {
                                    label:'Usuario portal',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center'
                                  }, 
                              'email': {
                                        label:'Email',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'justify'
                                      },
                              
                              'nombrecompleto':{
                                label:'Nombre usuario',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center'
                              },
                              'numerotelefonico':{
                                label:'Número telefonico',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center'
                              },         
                              'estado': {
                                                label:'Estado',
                                                type:'text', 
                                                sizeCol:'6rem', 
                                                align:'center'
                                              }
                          }
                        ];
  
  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];

  constructor(private router:Router){}

  nuevoUsuario(event: any){
    console.log(event);
    this.router.navigate(['/portal/solicitudes-de-cargue/nueva']);
  }

}
