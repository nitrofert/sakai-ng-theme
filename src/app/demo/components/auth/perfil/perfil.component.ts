import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-perfil',
  providers:[ConfirmationService,MessageService],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements  OnInit{

  permisosModulo!:any[];
  infoUsuario!:any;
  id_usuario:number = 0;
  nombrecompleto:string ="";
  username:string = "";
  password:string = "";
  password2:string = "";
  email:string="";
  numerotelefonico:string ="";
  estado:string = "";

  roles!:any[];
  rolesSeleccionados:any[] = [];
  rolesFiltrados:any[] = [];

  clientesSAP!:any[];
  clientesSAPSeleccionados:any[] = [];
  clientesSAPFiltrados:any[] = [];

  numeroid_responsable:string = "";
  cargo_responsable:string = "";
  nombre_responsable:string = "";
  telefono_responsable:string = "";
  email_responsable:string = "";

  envioLineaUsuario:boolean = false;

  verCamposClientes:boolean = false;

  file!: any ;
  fileTmp:any;
  uploadedFile: any[] = [];
  filesToUpload: any[] = [];

  uploadActivo:boolean = true;

  @ViewChild('uploaderFile') uploaderFile!:ElementRef;

  constructor(private router:Router,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private usuariosService:UsuarioService,
    public functionsService:FunctionsService){}

ngOnInit() {
  this.getPermisosModulo(); 
  
}

getPermisosModulo(){
  const modulo = this.router.url;
  this.usuariosService.getPermisosModulo(modulo)
      .subscribe({
          next: async (permisos)=>{
           ////////////////console.log(permisos);
            if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
              this.router.navigate(['/auth/access']);
            }

            if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
              this.router.navigate(['/auth/access']);
            }
            this.permisosModulo = permisos;
           
           ////////////////console.log(this.permisosModulo);
            this.getInfoUsuario();
          
          },
          error:(err)=>{
              console.error(err);
          }
      });
      
}

async getInfoUsuario():Promise<void> {
  this.infoUsuario = await this.usuariosService.infoUsuario();
////////console.log(this.infoUsuario);

 this.id_usuario = this.infoUsuario.id;

  this.nombrecompleto = this.infoUsuario.nombrecompleto;
  this.email = this.infoUsuario.email;
  this.numerotelefonico = this.infoUsuario.numerotelefonico;
  this.username = this.infoUsuario.username;
  this.cargo_responsable = this.infoUsuario.cargo_responsable;

  this.nombre_responsable = this.infoUsuario.nombre_responsable;

  this.numeroid_responsable = this.infoUsuario.numeroid_responsable;

  this.telefono_responsable = this.infoUsuario.telefono_responsable;

  this.email_responsable = this.infoUsuario.email_responsable;

  this.rolesSeleccionados = this.infoUsuario.roles;


  this.verCamposClientes = this.rolesSeleccionados.filter(role=>role.nombre === 'CLIENTE LOGISTICA').length>0?true:false;


}

editar(){
  this.envioLineaUsuario= true;
  if(this.username=='' ||  this.email=='' || this.nombrecompleto=='' || this.numerotelefonico==''  || 
     (this.rolesSeleccionados.filter(opcion=>opcion.nombre==='CLIENTE LOGISTICA').length>0 && (this.nombre_responsable=='' || this.telefono_responsable=='' || this.email_responsable=='')) ){

      this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
  }else if(this.password!= this.password2){
    this.messageService.add({severity:'error', summary:'Error', detail:'Los passwords ingresados no coinciden'});
  }else{

    //////////console.log(this.clientesSAPSeleccionados);
    
    let editarUsuario:any ={
      username:this.username,
      email:this.email,
      nombrecompleto:this.nombrecompleto,
      numerotelefonico:this.numerotelefonico,
      numeroid_responsable:this.numeroid_responsable,
        cargo_responsable:this.cargo_responsable,
        nombre_responsable:this.nombre_responsable,
        telefono_responsable:this.telefono_responsable,
        email_responsable:this.email_responsable
    }

    if(this.password!=''){
      editarUsuario.password =this.password;
    }

      this.usuariosService.update(editarUsuario,this.id_usuario)
          .subscribe({
              next: async (usuario)=>{
               ////////////////console.log(usuario);
                this.messageService.add({severity:'success', summary:'información', detail:`El usuario ${this.nombrecompleto} fue actualizado correctamente`});
                if(this.filesToUpload.length > 0 && this.uploadActivo){

                  //Borrar firma del usuario
                  let deleteFile$ = this.functionsService.deleteFiles({entidad:'usuario',id_relacion:usuario.id,proceso:'firma'});
                  let deleteFile = await lastValueFrom(deleteFile$);

                 ////////console.log(deleteFile);

                  //registrar nueva firma
                  for(let anexo of this.filesToUpload){
                    let body = new FormData();
                    body.append('file', anexo.file, anexo.file.name);
                    body.append('entidad', 'usuario');
                    body.append('id_relacion', usuario.id);
                    body.append('proceso', 'firma');
                    body.append('nombre', anexo.file.name);

                    this.functionsService.uploadFile(body)
                        .subscribe({
                          next:(result)=>{
                           ////////console.log('Upload ok',result);
                            this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha cargado correctamente la firma del usuario ${anexo.file.name}`});
                          },
                          error:(err)=>{
                            this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo de la firma del usuario :'+err});
                          }
                        })
                  }
                  
                }
              },
              error:(err)=> {
                  console.error(err);

                  this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
              },
          });
 }
}

cancelar(){

}

clearUploader(uploaderFile: FileUpload){
  //uploaderFile.clear();
  this.filesToUpload = [];
}

removeFile($event:any,uploaderFile: FileUpload){
    ////////console.log('remove',$event,)
    this.filesToUpload = [];
    let currentFiles = uploaderFile.files.filter((file: any)=>file != $event.file);
    //uploaderFiles.files = currentFiles;
    this.loadFile(currentFiles);
}

loadFile(uploaderFile: any ){
  ////////console.log('filesToUpload',uploaderFile);
  let currentFiles = uploaderFile;
  for(let currentFile of currentFiles){
    ////////console.log('currentFile',currentFile);
    //const [file] = currentFile;
    this.filesToUpload.push({
      file:currentFile,
      //name:file.name
    })
  }
}
  
}
