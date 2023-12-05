import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UsuarioService } from '../../service/usuario.service';
import { FunctionsService } from '../../service/functions.service';
import { FormClienteComponent } from './form-cliente/form-cliente.component';
import { ClientesService } from '../../service/clientes.service';

@Component({
  selector: 'app-clientes',
  providers:[ConfirmationService,MessageService],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements  OnInit{

  permisosModulo!:any[];

  showBtnNew:boolean =false;
  showBtnEdit:boolean = false;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = false;
  infoUsuario!:any;


  dataTable:any[] = [];
  headersTable:any[] = [
                          {
                              'CardCode':{ 
                                    label:'Código', 
                                    type:'text',
                                    sizeCol:'6rem',
                                    align:'center',
                                    field:'CardCode'
                                  }, 
                              'CardName': {
                                    label:'Nombre',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center',
                                    field:'CardName'
                                  }, 
                              'FederalTaxID': {
                                        label:'NIT',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'center',
                                        field:'FederalTaxID'
                                      }, 
                              'EmailAddress': {
                                          label:'E-mail',
                                          type:'text', 
                                          sizeCol:'6rem', 
                                          align:'center',
                                          field:'EmailAddress'
                                        }
                          }
                        ];
  
  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];

  constructor(private router:Router,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private  messageService: MessageService,
    private usuariosService:UsuarioService,
    private clientesService:ClientesService,
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

            
            this.infoUsuario = await this.usuariosService.infoUsuario();
            ////////console.log(this.infoUsuario);
            this.getClientes();

          },
          error:(err)=>{
              console.error(err);
          }
      });
        
}

getClientes(){
    this.clientesService.getClientes()
        .subscribe({
            next:(clientes)=>{
              console.log(clientes)

              let dataClientes:any[] = [];
                  for(let cliente of clientes){
                    
                    dataClientes.push({
                      CardCode:cliente.CardCode,
                      CardName:cliente.CardName,
                      FederalTaxID:cliente.FederalTaxID,
                      EmailAddress:cliente.EmailAddress
                    });
                  }
                  this.dataTable = dataClientes;
            },
            error:(err)=>{
              console.error(err); 
            },
        });
}

editCliente(event: any){
  ////////console.log(event);
   const ref = this.dialogService.open(FormClienteComponent, {
     data: {
         id: event
     },
     header: `Editar Cliente` ,
     width: '70%',
     height:'auto',
     contentStyle: {"overflow": "auto"},
     maximizable:true, 
   });
 
   ref.onClose.subscribe(async (infoVehiculo) => {
     this.getClientes();
     
   });
 }

 deleteCliente(event: any){}

 nuevoCliente(event: any){
   const ref = this.dialogService.open(FormClienteComponent, {
     data: {
         id: parseInt('0')
     },
     header: `Nuevo cliente` ,
     width: '70%',
     height:'auto',
     contentStyle: {"overflow": "auto"},
     maximizable:true, 
   });
 
   ref.onClose.subscribe(async (infoVehiculo) => {
    this.getClientes();
     
   });

 }

}
