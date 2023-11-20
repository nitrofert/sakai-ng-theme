import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TransportadorasService } from 'src/app/demo/service/transportadoras.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

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
  updateMode:boolean = false;
  permisosModulo!:any[];


  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router:Router,
    public usuariosService:UsuarioService,
    private transportadorasService: TransportadorasService
    ){}

    ngOnInit() {
      this.getPermisosModulo();
     //////console.log(this.config.data.id);
      if(this.config.data.id!=0){
          this.getInfoTransportadora(this.config.data.id);
          this.updateMode = true;
      }
    }

    getPermisosModulo(){
  
      const modulo = this.router.url;
      
      this.usuariosService.getPermisosModulo(modulo)
          .subscribe({
              next: async (permisos)=>{
               //////console.log(modulo,permisos);
                this.permisosModulo = permisos;
               
                /*
                this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
              
                */
                
    
              },
              error:(err)=>{
                  console.error(err);
              }
          });
          
    }


    getInfoTransportadora(id:any){
        this.transportadorasService.getTransportadoraById(id)
            .subscribe({
                next:(infoTransportadora)=>{
                   //////console.log(infoTransportadora);
                    this.nit = infoTransportadora.nit;
                    this.nombre = infoTransportadora.nombre;
                    this.email  = infoTransportadora.email;
                    this.nombre_contacto  = infoTransportadora.nombre_contacto;
                    this.telefono_contacto = infoTransportadora.telefono_contacto;
                    this.email_contacto = infoTransportadora.email_contacto;
                },
                error:(err)=>{
                  console.error(err);
                }
            });
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

          if(this.updateMode){
            //Actualiza info transportadora en bd
            this.transportadorasService.update(nuevoTransportadora,this.config.data.id)
              .subscribe({
                  next: (Transportadora)=>{
                   //////console.log(Transportadora);
                    this.messageService.add({severity:'success', summary:'información', detail:`La Transportadora ${nuevoTransportadora.nombre} fue actualizada correctamente`});
                  },
                  error:(err)=> {
                      console.error(err);

                      this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                  },
            });

          }else{
            //Crea la transportadora eb bd
            this.transportadorasService.create(nuevoTransportadora)
              .subscribe({
                  next: (Transportadora)=>{
                   //////console.log(Transportadora);
                    this.messageService.add({severity:'success', summary:'información', detail:`El Transportadora ${Transportadora.nombre} fue registrado correctamente`});
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
      let infoTransportadora = {
        nit:this.nit,
        nombre:this.nombre,
        email:this.email,
        nombre_contacto:this.nombre_contacto,
        telefono_contacto:this.telefono_contacto,
        email_contacto:this.email_contacto,
        update:this.updateMode
      }
      this.ref.close(infoTransportadora);
    }

    keyPress(event:any){
     //////console.log(event);
      
      var key =  event.keyCode;
      let teclasFuncionales:any[] =[8,46,9,13];

      //Numeros
      if((parseInt(key)>=48 && parseInt(key)<=57 && !event.shiftKey) || 
         //(parseInt(key)>=65 && parseInt(key)<=90) || 
         (parseInt(key)>=96 && parseInt(key)<=105) || 
         teclasFuncionales.includes(key)){
        
      }else{
       //////console.log(key);
        event.preventDefault();
      }
  }

}
