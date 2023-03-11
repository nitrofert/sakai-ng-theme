import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConductoresService } from 'src/app/demo/service/conductores.service';

@Component({
  selector: 'app-form-conductor',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-conductor.component.html',
  styleUrls: ['./form-conductor.component.scss']
})
export class FormConductorComponent  implements  OnInit {

  cedula:string ='';
  nombre:string = '';
  numerotelefonico:string = '';
  numerocelular:string = '';
  email:string = '';
  fechacargue:Date = new Date();
  hoy:Date = new Date();

  envioLineaConductor:boolean = false;


  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private conductoresService: ConductoresService
    ){}

    ngOnInit() {
      //console.log(this.config.data.id);
    }

    grabar(){
      this.envioLineaConductor= true;
      if(this.cedula=='' || this.nombre==''){

          this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
      }else{
          let nuevoConductor ={
            nombre:this.nombre,
            cedula:this.cedula,
            email:this.email,
            numerotelefono:this.numerotelefonico,
            numerocelular:this.numerocelular
            
          }

          this.conductoresService.create(nuevoConductor)
              .subscribe({
                  next: (conductor)=>{
                    console.log(conductor);
                    this.messageService.add({severity:'success', summary:'información', detail:`El conductor ${conductor.nombre} fue registrado correctamente`});
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
