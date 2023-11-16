import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { RolesService } from 'src/app/demo/service/roles.service';

@Component({
  selector: 'app-form-roles',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-roles.component.html',
  styleUrls: ['./form-roles.component.scss']
})
export class FormRolesComponent {
  rol:string = "";
  descripcion:string = "";
  envioLineaForm:boolean = false;

  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private rolesService:RolesService
    ){}

  async ngOnInit() {
  
    
    if(this.config.data.id!=0){
      //Buscar información  del rol seleccionado
     ////console.log(this.config.data.id);
      this.getInfoRol(this.config.data.id);
    }
  }

  async getInfoRol(idrol:number){
    const rol$ = this.rolesService.getRolByID(idrol);
    
    const rol = await lastValueFrom(rol$);
    
    this.rol = rol.nombre;
    this.descripcion = rol.descripcion;
  }


  grabar(){
    this.envioLineaForm= true;
    if(this.rol=='' ){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else{
      ////console.log(this.hierarchy,this.visible, this.opcionPadre);
        let nuevaRol ={
          nombre:this.rol,
          descripcion:this.descripcion,
        }

        this.rolesService.create(nuevaRol)
            .subscribe({
                next: (rol)=>{
                 ////console.log(rol);
                  this.messageService.add({severity:'success', summary:'información', detail:`La opción ${rol.nombre} fue registrado correctamente al menú`});
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
    if(this.rol=='' ){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else{
      
        let nuevaRol ={
          nombre:this.rol,
          descripcion:this.descripcion,
        }

        this.rolesService.update(nuevaRol,this.config.data.id)
            .subscribe({
                next: (rol)=>{
                  ////console.log(menu);
                  this.messageService.add({severity:'success', summary:'información', detail:`La opción ${this.rol} fue actualizada correctamente al menú`});
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
