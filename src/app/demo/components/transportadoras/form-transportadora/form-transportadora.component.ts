import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TransportadorasService } from 'src/app/demo/service/transportadoras.service';

@Component({
  selector: 'app-form-transportadora',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-transportadora.component.html',
  styleUrls: ['./form-transportadora.component.scss']
})
export class FormTransportadoraComponent implements  OnInit {

  nit:string ='';
  nombre:string = '';
  email:string = '';
  nombre_contacto:string = '';
  telefono_contacto:string = '';
  email_contacto:string = '';
 
  envioLineaTransportadora:boolean = false;


  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private transportadorasService: TransportadorasService
    ){}

    ngOnInit() {
      //console.log(this.config.data.id);
    }

    grabar(){
      this.envioLineaTransportadora= true;
      if(this.nit=='' || this.nombre==''){

          this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
      }else{
          let nuevoTransportadora ={
            nombre:this.nombre,
            nit:this.nit,
            email:this.email,
            nombre_contacto:this.nombre_contacto,
            telefono_contacto:this.telefono_contacto,
            email_contacto:this.email_contacto
            
          }

          this.transportadorasService.create(nuevoTransportadora)
              .subscribe({
                  next: (Transportadora)=>{
                    console.log(Transportadora);
                    this.messageService.add({severity:'success', summary:'información', detail:`El Transportadora ${Transportadora.nombre} fue registrado correctamente`});
                  },
                  error:(err)=> {
                      console.error(err);

                      this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                  },
              });
      }
    }
  
    cancelar(){
      this.ref.close();
    }

}
