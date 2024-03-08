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

  idCliente!:number;
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
  clientesNuevos:any[] = [];
  notificaciones:boolean =false;


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
    this.CardCode = this.config.data.id;
    if(this.CardCode!=''){
      this.editCliente =true;
      this.getInfoCliente(this.CardCode);
    }else{
       this.getClientesSAP();
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
      console.log('clientesMysql',clientesMysql);
      console.log('clientesSAP',clientesSAP);

      let nuevosClientes:any[] = [];

      for(let clienteSAP of clientesSAP){
        clienteSAP.label = `${clienteSAP.CardCode} - ${clienteSAP.CardName}`;
        if(!clientesMysql.find(clienteMysql=>clienteMysql.CardCode === clienteSAP.CardCode)){
          nuevosClientes.push(clienteSAP);
        }
      }

      console.log('nuevosClientes',nuevosClientes);
      this.clientesNuevos = nuevosClientes;
  }

  async filtrarCliente(event:any){
    this.clientessFiltrados = await this.functionsService.filter(event,this.clientesNuevos);
  }

  seleccionarCliente(clienteSeleccionado:any){
      console.log('clienteSeleccionado',clienteSeleccionado);
      this.CardCode = clienteSeleccionado.CardCode;
      this.CardName = clienteSeleccionado.CardName;
      this.FederalTaxID = clienteSeleccionado.ADDID;
      this.EmailAddress = clienteSeleccionado.E_Mail;

  }

  async getInfoCliente(CardCode:any){
    let infoClientes = await this.clientesService.infoClientes();
    let infoCliente = infoClientes.find((cliente: { CardCode: any; })=>cliente.CardCode === CardCode);
    console.log(infoCliente);
    this.idCliente = infoCliente.id;
    this.CardName = infoCliente.CardName;
    this.EmailAddress = infoCliente.EmailAddress;
    this.FederalTaxID = infoCliente.FederalTaxID;
    this.notificaciones = infoCliente.notificaciones;
  }

  grabarCliente(){
    this.submitCliente = true;

    if( (!this.editCliente && (!this.clienteSeleccionado || this.clienteSeleccionado.length ==0)) || !this.EmailAddress){
      this.messageService.add({severity:'error', summary: '!Error¡', detail:  "Los campos resaltados en rojo deben ser diligenciados"});
    }else{

        let data = {
          CardCode: this.CardCode,
          CardName: this.CardName,
          FederalTaxID: this.FederalTaxID,
          EmailAddress: this.EmailAddress,
          notificaciones:this.notificaciones
       
        }

       console.log(data);
       if(!this.editCliente){
        //Registro de locacion
        this.clientesService.setCliente(data)
        .subscribe({
            next:(cliente)=>{
             console.log(cliente);
              this.messageService.add({severity:'success', summary: '!Ok¡', detail: `Se ha realizado correctamente el registro del cliente ${this.CardName}.`});
              //this.cerrar();                
            },
            error:(error)=>{
              console.error(error.error);
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  error.error.message});
            }
        });
       }else{
          //Actualización de locacion
          this.clientesService.updateCliente(data,this.idCliente)
        .subscribe({
            next:(cliente)=>{
             //////////console.log(locacion);
              this.messageService.add({severity:'success', summary: '!Ok¡', detail: `Se ha actualizado correctamente el registro del cliente ${cliente.CardName}.`});
              //this.cerrar();                
            },
            error:(error)=>{
              console.error(error.error);
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  error.error.message});
            }
        });
       }

        
    }

  }

  cerrar(){
    this.ref.close();
  }
}
