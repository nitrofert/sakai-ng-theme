import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { ClientesService } from 'src/app/demo/service/clientes.service';
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

  roles!:any[];
  rolesSeleccionados:any[] = [];
  rolesFiltrados:any[] = [];

  clientesSAP!:any[];
  clientesSAPSeleccionados:any[] = [];
  clientesSAPFiltrados:any[] = [];

  locaciones!:any[];
  locacionesSeleccionados:any[] = [];
  locacionesFiltrados:any[] = [];


  envioLineaUsuario:boolean = false;

  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private usuariosService:UsuarioService,
    private rolService: RolesService,
    private sb1SLService:SB1SLService,
    private clientesService:ClientesService,
    private almacenesService:AlmacenesService,
    ){}

  async ngOnInit() {
   //////console.log(this.roles);
    
    this.getRoles();
    this.getClientes();
    this.getLocaciones();

    if(this.config.data.id!=0){
      //Buscar información  del usuario seleccionado
      this.getInfoUsuario(this.config.data.id);
    }
  }

  async getInfoUsuario(idusuario:number){
    const usuario$ = this.usuariosService.getInfoUsuarioByID(idusuario);
    const usuario = await lastValueFrom(usuario$);
    
    this.nombrecompleto = usuario.nombrecompleto;
    this.username = usuario.username;
    this.email = usuario.email;
    this.numerotelefonico = usuario.numerotelefonico;
    this.estado = this.estado;
    let rolesUsuario = await usuario.roles.map((rol: { code: any; id: any; name: any; nombre: any; label: any; })=>{ rol.code = rol.id; rol.name = rol.nombre; rol.label=rol.nombre; return rol})
    
    this.rolesSeleccionados = rolesUsuario;

    let locacionesUsuario = await usuario.locaciones.map((locacion: { code: any; id: any; name: any; locacion: any; label: any; })=>{ locacion.code = locacion.id; locacion.name = locacion.locacion; locacion.label=locacion.locacion; return locacion})

    this.locacionesSeleccionados = locacionesUsuario;

   //////console.log(usuario);
    let clientesUsuario = await usuario.clientes.map((cliente: { code: any; id: any; name: any; CardName: any; CardCode: any;label: any; })=>{ cliente.code = cliente.id; cliente.name = cliente.CardName; cliente.label=cliente.CardCode+' - '+cliente.CardName; return cliente})
   //////console.log(clientesUsuario);
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
            },
            error:(err)=>{
                console.error(err);
            }
        });
  }

  async getClientes(){
   //////console.log('clientes');
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
             //////console.log( this.clientesSAP);

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
  }

  async getLocaciones(){
    this.almacenesService.getLocaciones()
        .subscribe({
            next:async (locaciones)=>{
               //////console.log(locaciones);
                let dataLocaciones:any[] = [];
                for(let locacion of locaciones){
                  locacion.code = locacion.id,
                  locacion.name = locacion.locacion,
                  locacion.label = locacion.code+' - '+locacion.locacion 
                }

                this.locaciones = locaciones;
                
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


  seleccionaRrol(opcionPadre:any){

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

    ////////console.log(arrayFiltrar);
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < arrayFiltrar.length; i++) {
        const linea = arrayFiltrar[i];
        //////console.log(linea)
        if (linea.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          
            filtered.push(linea);
        }
    }
    return filtered;
  }

 

   grabar(){
    this.envioLineaUsuario= true;
    if(this.username=='' || this.password=='' || this.email=='' || this.nombrecompleto=='' || this.numerotelefonico=='' || this.rolesSeleccionados.length===0){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else if(this.password!= this.password2){
      this.messageService.add({severity:'error', summary:'Error', detail:'Los passwords ingresados no coinciden'});
    }else{
      //////console.log(this.hierarchy,this.visible, this.opcionPadre);
        let nuevoUsuario ={
          username:this.username,
          password:this.password,
          email:this.email,
          nombrecompleto:this.nombrecompleto,
          numerotelefonico:this.numerotelefonico,
          roles:  this.rolesSeleccionados.map((rol)=>{return rol.code}),
          clientes: this.clientesSAPSeleccionados.map((cliente)=>{ return {CardCode:cliente.CardCode,CardName:cliente.CardName,FederalTaxID:cliente.FederalTaxID,EmailAddress:cliente.EmailAddress}}),
          locaciones:this.locacionesSeleccionados.map((locacion)=>{ return locacion.id})
        }
       //////console.log(nuevoUsuario);
        this.usuariosService.create(nuevoUsuario)
            .subscribe({
                next: (usuario)=>{
                 //////console.log(usuario);
                  this.messageService.add({severity:'success', summary:'información', detail:`El usuario ${usuario.nombrecompleto} fue registrado correctamente`});
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
    if(this.username=='' ||  this.email=='' || this.nombrecompleto=='' || this.numerotelefonico==''  || this.rolesSeleccionados.length===0 ){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else if(this.password!= this.password2){
      this.messageService.add({severity:'error', summary:'Error', detail:'Los passwords ingresados no coinciden'});
    }else{
      
      let editarUsuario:any ={
        username:this.username,
        email:this.email,
        nombrecompleto:this.nombrecompleto,
        numerotelefonico:this.numerotelefonico,
        roles:  this.rolesSeleccionados.map((rol)=>{return rol.code}),
        clientes: this.clientesSAPSeleccionados.map((cliente)=>{ return {CardCode:cliente.CardCode,CardName:cliente.CardName,FederalTaxID:cliente.FederalTaxID,EmailAddress:cliente.EmailAddress}}),
        locaciones:this.locacionesSeleccionados.map((locacion)=>{ return locacion.id})
      }

      if(this.password!=''){
        editarUsuario.password =this.password;
      }

        this.usuariosService.update(editarUsuario,this.config.data.id)
            .subscribe({
                next: (usuario)=>{
                 //////console.log(usuario);
                  this.messageService.add({severity:'success', summary:'información', detail:`El usuario ${this.nombrecompleto} fue actualizado correctamente`});
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
