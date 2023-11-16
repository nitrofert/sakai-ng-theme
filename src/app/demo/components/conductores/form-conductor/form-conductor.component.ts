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
  updateMode:boolean = false;


  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private conductoresService: ConductoresService
    ){}

    ngOnInit() {
      ////console.log(this.config.data.id);
      if(this.config.data.id!=0){
        this.getInfoConductor(this.config.data.id);
        this.updateMode = true;
      }
    }

    getInfoConductor(id:any){
      this.conductoresService.getConductorById(id)
          .subscribe({
              next:(infoConductor)=>{
                 ////console.log(infoConductor);
                  this.nombre= infoConductor.nombre;
                  this.cedula=  infoConductor.cedula;
                  this.email= infoConductor.email;
                  this.numerotelefonico= infoConductor.numerotelefono;
                  this.numerocelular = infoConductor.numerocelular;
                 
              },
              error:(err)=>{
                console.error(err);
              }
          });
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

          if(this.updateMode){
            //Actualizar info conductor
            this.conductoresService.update(nuevoConductor,this.config.data.id)
              .subscribe({
                  next: (conductor)=>{
                   ////console.log(conductor);
                    this.messageService.add({severity:'success', summary:'información', detail:`El conductor ${conductor.nombre} fue actualizado correctamente`});
                  },
                  error:(err)=> {
                      console.error(err);

                      this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                  },
              });
          }else{
            //Registro info conductor
            this.conductoresService.create(nuevoConductor)
              .subscribe({
                  next: (conductor)=>{
                   ////console.log(conductor);
                    this.messageService.add({severity:'success', summary:'información', detail:`El conductor ${conductor.nombre} fue registrado correctamente`});
                  },
                  error:(err)=> {
                      console.error(err);

                      this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                  },
              });
          }

          
      }
    }
  
    cancelar(){
      let infoConductor ={
        nombre:this.nombre,
        cedula:this.cedula,
        email:this.email,
        numerotelefono:this.numerotelefonico,
        numerocelular:this.numerocelular
        
      }
      this.ref.close(infoConductor);
    }

    keyPress(event:any){
       ////console.log(event);
        
        var key =  event.keyCode;
        let teclasFuncionales:any[] =[8,46,9,13];

        //Numeros
        if((parseInt(key)>=48 && parseInt(key)<=57 && !event.shiftKey) || 
           //(parseInt(key)>=65 && parseInt(key)<=90) || 
           (parseInt(key)>=96 && parseInt(key)<=105) || 
           teclasFuncionales.includes(key)){
          
        }else{
         ////console.log(key);
          event.preventDefault();
        }
    }
}
