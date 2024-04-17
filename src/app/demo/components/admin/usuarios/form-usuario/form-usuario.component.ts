import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { ClientesService } from 'src/app/demo/service/clientes.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { RolesService } from 'src/app/demo/service/roles.service';
import { SB1SLService } from 'src/app/demo/service/sb1sl.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';


@Component({
  selector: 'app-form-usuario',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss'],
  styles:[`
  
    :host ::ng-deep .p-multiselect {
    min-width: 15rem;
    width: 18rem;
  }

  :host ::ng-deep .multiselect-custom {
    .p-multiselect-label {
        padding-top: .5rem;
        padding-bottom: .5rem;
    }

    .country-item-value {
        padding: .25rem .5rem;
        border-radius: 3px;
        display: inline-flex;
        margin-right: .5rem;
        background-color: var(--primary-color);
        color: var(--primary-color-text);

        img.flag {
            width: 17px;
        }
    }

    .country-placeholder {
        padding: 0.25rem;
    }
}
:host ::ng-deep {
    @media screen and (max-width: 640px) {
        .p-multiselect {
            width: 100%;
        }
    }}`]
})
export class FormUsuarioComponent implements  OnInit {

  nombrecompleto:string ="";
  username:string = "";
  password:string = "";
  password2:string = "";
  email:string="";
  numerotelefonico:string ="";
  estado:string = "";

  numeroid_responsable:string = "";
  cargo_responsable:string = "";
  nombre_responsable:string = "";
  telefono_responsable:string = "";
  email_responsable:string = "";

  roles!:any[];
  rolesSeleccionados:any[] = [];
  rolesFiltrados:any[] = [];

  clientesSAP!:any[];
  clientesSAPSeleccionados:any[] = [];
  clientesSAPFiltrados:any[] = [];

  locaciones!:any[];
  locacionesSeleccionados:any[] = [];
  locacionesFiltrados:any[] = [];

  validarCamposClienteLogistica:boolean = false;


  envioLineaUsuario:boolean = false;

  file!: any ;
  fileTmp:any;
  uploadedFile: any[] = [];
  filesToUpload: any[] = [];

  uploadActivo:boolean = true;

  @ViewChild('uploaderFile') uploaderFile!:ElementRef;

  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private usuariosService:UsuarioService,
    private rolService: RolesService,
    private sb1SLService:SB1SLService,
    private clientesService:ClientesService,
    private almacenesService:AlmacenesService,
    public functionsService:FunctionsService,
    ){}

  async ngOnInit() {
   //////////console.log(this.roles);
    
    this.getRoles();
   
  }

  async getInfoUsuario(idusuario:number){
    const usuario$ = this.usuariosService.getInfoUsuarioByID(idusuario);
    const usuario = await lastValueFrom(usuario$);
    
    this.nombrecompleto = usuario.nombrecompleto;
    this.username = usuario.username;
    this.email = usuario.email;
    this.numerotelefonico = usuario.numerotelefonico;
    this.estado = this.estado;

    this.nombre_responsable = usuario.nombre_responsable;

    this.numeroid_responsable = usuario.numeroid_responsable;

    this.telefono_responsable = usuario.telefono_responsable;

    this.email_responsable = usuario.email_responsable;

    this.cargo_responsable = usuario.cargo_responsable;

    
    let rolesUsuario = await usuario.roles.map((rol: { code: any; id: any; name: any; nombre: any; label: any; })=>{ rol.code = rol.id; rol.name = rol.nombre; rol.label=rol.nombre; return rol})
    
    this.rolesSeleccionados = rolesUsuario;

    let locacionesUsuario = await usuario.locaciones.map((locacion: { code: any; id: any; name: any; locacion: any; label: any; })=>{ locacion.code = locacion.id; locacion.name = locacion.locacion; locacion.label=locacion.locacion; return locacion})

    this.locacionesSeleccionados = locacionesUsuario;

   //////////console.log(usuario);
    let clientesUsuario = await usuario.clientes.map((cliente: { code: any; id: any; name: any; CardName: any; CardCode: any;label: any; })=>{ cliente.code = cliente.id; cliente.name = cliente.CardName; cliente.label=cliente.CardCode+' - '+cliente.CardName; return cliente})
    //console.log(clientesUsuario);
    this.clientesSAPSeleccionados = clientesUsuario;

  }

 

  getRoles(){
    this.rolService.getListadoRoles()
        .subscribe({
            next: async (roles)=>{

              for(let rol of roles){
                  rol.code = rol.id;
                  rol.name = rol.nombre;
                  rol.label = rol.nombre;
              }
              this.roles = roles;
              this.getClientes();
              
            },
            error:(err)=>{
                console.error(err);
            }
        });
  }

  async getClientes(){
   //////////console.log('clientes');
    /*this.sb1SLService.getClientesSAP()
        .subscribe({
            next: async (clientesSAP)=>{

              
              let clientesSAPtmp:any[] = [];
              for(let clienteSAP of clientesSAP.value){
                //clientesSAPtmp.push({
                  clienteSAP.code =  clienteSAP.CardCode;
                  clienteSAP.name =  clienteSAP.CardName;
                  clienteSAP.label = clienteSAP.CardCode+' - '+clienteSAP.CardName;
                //});
              }

              this.clientesSAP = clientesSAP.value;
             //////////console.log( this.clientesSAP);

              //for(let rol of roles){
              //    rol.code = rol.id;
              //    rol.name = rol.nombre;
              //    rol.label = rol.nombre;
              //}
              //this.clientesSAP = roles;
            },
            error:(err)=>{
                console.error(err);
            }
        });*/
    
        let clientes =  await this.clientesService.infoClientes();
        clientes.forEach((cliente: { code: any; CardCode: string; name: any; CardName: string; label: string; })=>{
          cliente.code =  cliente.CardCode;
          cliente.name =  cliente.CardName;
          cliente.label = cliente.CardCode+' - '+cliente.CardName;
        });

        this.clientesSAP = clientes;
        //console.log(this.clientesSAP[0]);
        this.getLocaciones();
          
             
  }

  async getLocaciones(){
    this.almacenesService.getLocaciones()
        .subscribe({
            next:async (locaciones)=>{
               //////////console.log(locaciones);
                let dataLocaciones:any[] = [];
                for(let locacion of locaciones){
                  locacion.code = locacion.id,
                  locacion.name = locacion.locacion,
                  locacion.label = locacion.code+' - '+locacion.locacion 
                }

                this.locaciones = locaciones;
                
                if(this.config.data.id!=0){
                  //Buscar información  del usuario seleccionado
                  this.getInfoUsuario(this.config.data.id);
                }
            },
            error:(err)=>{
              console.error(err);
            }
        });
 }
 
  filtrarRoles(event:any){
    this.rolesFiltrados = this.filter(event,this.roles);
    
  }

  filtrarLocacion(event:any){
    this.locacionesFiltrados = this.filter(event,this.locaciones);
    
  }

  seleccionaLocacion(opcionPadre:any){

  }


  seleccionaRrol(roles:any){
    console.log(roles)

    if(roles.filter((opcion: { nombre: string; }) =>opcion.nombre === 'CLIENTE LOGISTICA').length >0){
        this.validarCamposClienteLogistica = true;
    }else{
      this.validarCamposClienteLogistica = false;
    }
  }

  filtrarClientes(event:any){
    //this.clientesSAPFiltrados = this.filter(event,this.clientesSAP);

    let clientesFiltrados= this.filter(event,this.clientesSAP);
    let clientesFiltrados2:any[] = [];
    for(let clienteFiltrado of clientesFiltrados){
      if(!this.clientesSAPSeleccionados.find(clienteSeleccionado=>clienteSeleccionado.CardCode === clienteFiltrado.CardCode)){
         clientesFiltrados2.push(clienteFiltrado);
      }
    }
                                
    
    this.clientesSAPFiltrados = clientesFiltrados2;
    
  }
  seleccionarCliente(clientesSAPSeleccionados:any){

  }

  filter(event: any, arrayFiltrar:any[]) {

    ////////////console.log(arrayFiltrar);
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < arrayFiltrar.length; i++) {
        const linea = arrayFiltrar[i];
        //////////console.log(linea)
        if (linea.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          
            filtered.push(linea);
        }
    }
    return filtered;
  }

 

   grabar(){
    this.envioLineaUsuario= true;
    if(this.username=='' || this.password=='' || this.email=='' || this.nombrecompleto=='' || this.numerotelefonico=='' || 
       this.rolesSeleccionados.length===0 ||  (this.rolesSeleccionados.filter(opcion=>opcion.nombre==='CLIENTE LOGISTICA').length>0 && (this.nombre_responsable=='' || this.telefono_responsable=='' || this.email_responsable==''))){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else if(this.password!= this.password2){
      this.messageService.add({severity:'error', summary:'Error', detail:'Los passwords ingresados no coinciden'});
    }else{
      //////////console.log(this.hierarchy,this.visible, this.opcionPadre);
        let nuevoUsuario ={
          username:this.username,
          password:this.password,
          email:this.email,
          nombrecompleto:this.nombrecompleto,
          numerotelefonico:this.numerotelefonico,
          numeroid_responsable:this.numeroid_responsable,
          cargo_responsable:this.cargo_responsable,
          nombre_responsable:this.nombre_responsable,
          telefono_responsable:this.telefono_responsable,
          email_responsable:this.email_responsable,


          roles:  this.rolesSeleccionados.map((rol)=>{return rol.code}),
          clientes: this.clientesSAPSeleccionados.map((cliente)=>{ return {CardCode:cliente.CardCode,CardName:cliente.CardName,FederalTaxID:cliente.FederalTaxID,EmailAddress:cliente.EmailAddress}}),
          locaciones:this.locacionesSeleccionados.map((locacion)=>{ return locacion.id})
        }
       //////////console.log(nuevoUsuario);
        this.usuariosService.create(nuevoUsuario)
            .subscribe({
                next: (usuario)=>{
                 //////////console.log(usuario);
                  this.messageService.add({severity:'success', summary:'información', detail:`El usuario ${usuario.nombrecompleto} fue registrado correctamente`});
                  if(this.filesToUpload.length > 0 && this.uploadActivo){
                    for(let anexo of this.filesToUpload){
                      let body = new FormData();
                      body.append('file', anexo.file, anexo.file.name);
                      body.append('entidad', 'usuario');
                      body.append('id_relacion', usuario.id);
                      body.append('proceso', '');
                      body.append('nombre', anexo.file.name);
  
                      this.functionsService.uploadFile(body)
                          .subscribe({
                            next:(result)=>{
                              console.log('Upload ok',result);
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

  editar(){
    this.envioLineaUsuario= true;
    if(this.username=='' ||  this.email=='' || this.nombrecompleto=='' || this.numerotelefonico==''  || 
       this.rolesSeleccionados.length===0 ||  (this.rolesSeleccionados.filter(opcion=>opcion.nombre==='CLIENTE LOGISTICA').length>0 && (this.nombre_responsable=='' || this.telefono_responsable=='' || this.email_responsable=='')) ){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else if(this.password!= this.password2){
      this.messageService.add({severity:'error', summary:'Error', detail:'Los passwords ingresados no coinciden'});
    }else{

      ////console.log(this.clientesSAPSeleccionados);
      
      let editarUsuario:any ={
        username:this.username,
        email:this.email,
        nombrecompleto:this.nombrecompleto,
        numerotelefonico:this.numerotelefonico,
        numeroid_responsable:this.numeroid_responsable,
          cargo_responsable:this.cargo_responsable,
          nombre_responsable:this.nombre_responsable,
          telefono_responsable:this.telefono_responsable,
          email_responsable:this.email_responsable,
        roles:  this.rolesSeleccionados.map((rol)=>{return rol.code}),
        clientes: this.clientesSAPSeleccionados.map((cliente)=>{ return {CardCode:cliente.CardCode,CardName:cliente.CardName,FederalTaxID:cliente.FederalTaxID,EmailAddress:cliente.EmailAddress}}),
        locaciones:this.locacionesSeleccionados.map((locacion)=>{ return locacion.id})
      }

      if(this.password!=''){
        editarUsuario.password =this.password;
      }

        this.usuariosService.update(editarUsuario,this.config.data.id)
            .subscribe({
                next: async (usuario)=>{
                 //////////console.log(usuario);
                  this.messageService.add({severity:'success', summary:'información', detail:`El usuario ${this.nombrecompleto} fue actualizado correctamente`});
                  if(this.filesToUpload.length > 0 && this.uploadActivo){

                    //Borrar firma del usuario
                    let deleteFile$ = this.functionsService.deleteFiles({entidad:'usuario',id_relacion:usuario.id,proceso:'firma'});
                    let deleteFile = await lastValueFrom(deleteFile$);

                    console.log(deleteFile);

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
                              console.log('Upload ok',result);
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
    this.ref.close();
  }


  clearUploader(uploaderFile: FileUpload){
    //uploaderFile.clear();
    this.filesToUpload = [];
  }

  removeFile($event:any,uploaderFile: FileUpload){
      //console.log('remove',$event,)
      this.filesToUpload = [];
      let currentFiles = uploaderFile.files.filter((file: any)=>file != $event.file);
      //uploaderFiles.files = currentFiles;
      this.loadFile(currentFiles);
  }

  loadFile(uploaderFile: any ){
    //console.log('filesToUpload',uploaderFile);
    let currentFiles = uploaderFile;
    for(let currentFile of currentFiles){
      //console.log('currentFile',currentFile);
      //const [file] = currentFile;
      this.filesToUpload.push({
        file:currentFile,
        //name:file.name
      })
    }
  }
}
