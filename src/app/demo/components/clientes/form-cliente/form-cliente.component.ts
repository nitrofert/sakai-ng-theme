import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClientesService } from 'src/app/demo/service/clientes.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-form-cliente',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss']
})
export class FormClienteComponent  implements  OnInit {

  CardCode:string ="";
  CardName:string ="";
  FederalTaxID:string ="";
  EmailAddress:string ="";

  editCliente:boolean =false;
  clientesMysql!:any[];
  clientesSAP:any[] = [];
  clienteSeleccionado!:any;
  clientessFiltrados:any[] = [];
  submitCliente:boolean =false;


  constructor( private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public ref: DynamicDialogRef,
    private router:Router,
    public usuariosService:UsuarioService,
    private clientesService:ClientesService,
    public dialogService: DialogService,
    public config: DynamicDialogConfig,
    public functionsService:FunctionsService) { }

  async ngOnInit() {
    this.CardCode = this.config.data.CardCode;
    if(this.CardCode!=''){
      this.editCliente =true;
    }else{
      await this.getClientesSAP();
    }
  }

  getClientesSAP(){
      this.clientesService.getClientesSAP()
          .subscribe({
              next:async (clientesSAP)=>{

                this.clientesSAP = await this.functionsService.objectToArray(clientesSAP)

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
        next:async (clientes)=>{
            await this.setClientes(clientes, this.clientesSAP)
        },
        error:(err)=>{
          console.error(err);
        }
    });
  }
  async setClientes(clientesMysql:any[], clientesSAP:any[]):Promise<void>{

  }

  async filtrarCliente(event:any){
    this.clientessFiltrados = await this.functionsService.filter(event,this.clientesSAP);
  }

  seleccionarCliente(clienteSeleccionado:any){

  }
}
