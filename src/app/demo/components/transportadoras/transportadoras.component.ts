import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UsuarioService } from '../../service/usuario.service';
import { FunctionsService } from '../../service/functions.service';
import { TransportadorasService } from '../../service/transportadoras.service';
import { FormTransportadoraComponent } from './form-transportadora/form-transportadora.component';

@Component({
  selector: 'app-transportadoras',
  providers:[ConfirmationService,MessageService],
  templateUrl: './transportadoras.component.html',
  styleUrls: ['./transportadoras.component.scss']
})
export class TransportadorasComponent implements  OnInit{
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
                              'nombre': {
                                    label:'Nombre',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center',
                                    field:'nombre'
                                  }, 
                              'nit': {
                                        label:'NIT',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'center',
                                        field:'nit'
                                      }, 
                              'email': {
                                          label:'E-mail',
                                          type:'text', 
                                          sizeCol:'6rem', 
                                          align:'center',
                                          field:'email'
                                        },
                              'contacto': {
                                label:'Nombre contacto',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center',
                                field:'contacto'
                              },
                              'telefono': {
                                label:'Télefono contacto',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center',
                                field:'telefono'
                              },
                              'notificaciones': {
                                                label:'Notificaciones',
                                                type:'text', 
                                                sizeCol:'6rem', 
                                                align:'center',
                                                field:'notificaciones'
                                              },
                                              'estado': {
                                                                label:'Etado',
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
    private transportadorasService:TransportadorasService,
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
    this.transportadorasService.getTransportadoras()
    .subscribe({
        next:(transportadoras)=>{
          //console.log(clientes)

          let dataTransportadoras:any[] = [];
              for(let transportadora of transportadoras){
                
                dataTransportadoras.push({
                  id:transportadora.id,
                  nombre:transportadora.nombre,
                  nit:transportadora.nit,
                  email:transportadora.email,
                  contacto:transportadora.nombre_contacto,
                  telefono:transportadora.telefono_contacto,
                  notificaciones:transportadora.notificaciones?'Si':'No',
                  estado:transportadora.estado

                });
              }
              this.dataTable = dataTransportadoras;
        },
        error:(err)=>{
          console.error(err); 
        },
    });
  }

  nuevo(event:any){
    const ref = this.dialogService.open(FormTransportadoraComponent, {
      data: {
       id: ''
      },
      header: `Nueva transportadora` ,
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
    const ref = this.dialogService.open(FormTransportadoraComponent, {
      data: {
       id: event
      },
      header: `Editar Transportadora` ,
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
      message: 'Esta seguro de proceder con la inactivación de las transportadoras seleccionadas?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        console.log(event);
        let idsInactivar = event.map((item: { id: any; })=>{
          return item.id;
        })
        this.transportadorasService.inactivar(idsInactivar)
            .subscribe({
              next:(results)=>{
                if(results){
                    for(let result of results){
                      this.messageService.add({severity:result.severity, summary:result.summary, detail:`La transportadora ${event.filter((item: { id: any; })=>item.id === result.id)[0].nombre} ${result.detail}`});
                      if(result.severity==='success'){
                        let indexTransportadora = this.dataTable.findIndex(item=>item.id === result.id);
                        this.dataTable[indexTransportadora].estado = 'INACTIVO';
                      }
                    }
                }
              },
              error:(err)=>{
                  console.error(err);
                  this.messageService.add({severity:'danger', summary:'Error', detail:`Ocurrio un error al inactivar las transportadoras seleccionadas ${err}`});
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
      message: 'Esta seguro de proceder con la activación de las transportadoras seleccionadas?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(event);
        let idsActivar = event.map((item: { id: any; })=>{
          return item.id;
        })
        this.transportadorasService.activar(idsActivar)
            .subscribe({
              next:(results)=>{
                if(results){
                    for(let result of results){
                      this.messageService.add({severity:result.severity, summary:result.summary, detail:`La transportadora ${event.filter((item: { id: any; })=>item.id === result.id)[0].nombre} ${result.detail}`});
                      if(result.severity==='success'){
                        let indexTransportadora = this.dataTable.findIndex(item=>item.id === result.id);
                        this.dataTable[indexTransportadora].estado = 'ACTIVO';
                      }
                    }
                }
              },
              error:(err)=>{
                  console.error(err);
                  this.messageService.add({severity:'danger', summary:'Error', detail:`Ocurrio un error al activar las transportadoras seleccionadas ${err}`});
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
