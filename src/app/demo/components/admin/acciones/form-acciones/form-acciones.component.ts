import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { AccionesService } from 'src/app/demo/service/acciones.service';

@Component({
  selector: 'app-form-acciones',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-acciones.component.html',
  styleUrls: ['./form-acciones.component.scss']
})
export class FormAccionesComponent implements  OnInit {

  accion:string = "";
  descripcion:string = "";
  envioLineaForm:boolean = false;

  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private accionesService:AccionesService
    ){}

  async ngOnInit() {
  
    
    if(this.config.data.id!=0){
      //Buscar información  del accion seleccionado
      this.getInfoAccion(this.config.data.id);
    }
  }

  async getInfoAccion(idaccion:number){
    const accion$ = this.accionesService.getAccionByID(this.config.data.id);
    const accion = await lastValueFrom(accion$);
    
    this.accion = accion.accion;
    this.descripcion = accion.descripcion;
  }


  grabar(){
    this.envioLineaForm= true;
    if(this.accion=='' ){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else{
      ////////console.log(this.hierarchy,this.visible, this.opcionPadre);
        let nuevaAccion ={
          accion:this.accion,
          descripcion:this.descripcion,
        }

        this.accionesService.create(nuevaAccion)
            .subscribe({
                next: (accion)=>{
                  ////////console.log(menu);
                  this.messageService.add({severity:'success', summary:'información', detail:`La opción ${accion.accion} fue registrado correctamente al menú`});
                },
                error:(err)=> {
                    console.error(err);

                    this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                },
            });
    }
  }

  editar(){
    this.envioLineaForm= true;
    if(this.accion=='' ){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else{
      
        let nuevaAccion ={
          accion:this.accion,
          descripcion:this.descripcion,
        }

        this.accionesService.update(nuevaAccion,this.config.data.id)
            .subscribe({
                next: (accion)=>{
                  ////////console.log(menu);
                  this.messageService.add({severity:'success', summary:'información', detail:`La opción ${accion.accion} fue actualizada correctamente al menú`});
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
