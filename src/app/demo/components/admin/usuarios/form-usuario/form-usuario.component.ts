import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { RolesService } from 'src/app/demo/service/roles.service';
import { SB1SLService } from 'src/app/demo/service/sb1sl.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';


@Component({
  selector: 'app-form-usuario',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss']
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

  envioLineaUsuario:boolean = false;

  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private usuariosService:UsuarioService,
    private rolService: RolesService,
    private sb1SLService:SB1SLService
    ){}

  async ngOnInit() {
    console.log(this.roles);
    
    this.getRoles();
    this.getClientes();
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
    console.log(usuario);
    let clientesUsuario = await usuario.clientes.map((cliente: { code: any; id: any; name: any; CardName: any; CardCode: any;label: any; })=>{ cliente.code = cliente.id; cliente.name = cliente.CardName; cliente.label=cliente.CardCode+' - '+cliente.CardName; return cliente})
    console.log(clientesUsuario);
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

  getClientes(){
    console.log('clientes');
    this.sb1SLService.getClientesSAP()
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
              console.log( this.clientesSAP);

              /*for(let rol of roles){
                  rol.code = rol.id;
                  rol.name = rol.nombre;
                  rol.label = rol.nombre;
              }*/
              //this.clientesSAP = roles;
            },
            error:(err)=>{
                console.error(err);
            }
        });
  }

  filtrarRoles(event:any){
    this.rolesFiltrados = this.filter(event,this.roles);
    
  }

  seleccionaRrol(opcionPadre:any){

  }

  filtrarClientes(event:any){
    this.clientesSAPFiltrados = this.filter(event,this.clientesSAP);
    
  }
  seleccionarCliente(clientesSAPSeleccionados:any){

  }

  filter(event: any, arrayFiltrar:any[]) {

    ////console.log(arrayFiltrar);
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < arrayFiltrar.length; i++) {
        const linea = arrayFiltrar[i];
        if (linea.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            filtered.push(linea);
        }
    }
    return filtered;
  }

 

   grabar(){
    this.envioLineaUsuario= true;
    if(this.username=='' || this.password=='' || this.email=='' || this.nombrecompleto=='' || this.numerotelefonico=='' || this.clientesSAPSeleccionados.length===0 || this.rolesSeleccionados.length===0){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else if(this.password!= this.password2){
      this.messageService.add({severity:'error', summary:'Error', detail:'Los passwords ingresados no coinciden'});
    }else{
      //console.log(this.hierarchy,this.visible, this.opcionPadre);
        let nuevoUsuario ={
          username:this.username,
          password:this.password,
          email:this.email,
          nombrecompleto:this.nombrecompleto,
          numerotelefonico:this.numerotelefonico,
          roles:  this.rolesSeleccionados.map((rol)=>{return rol.code}),
          clientes: this.clientesSAPSeleccionados.map((cliente)=>{ return {CardCode:cliente.CardCode,CardName:cliente.CardName,FederalTaxID:cliente.FederalTaxID,EmailAddress:cliente.EmailAddress}})
        }
        console.log(nuevoUsuario);
        this.usuariosService.create(nuevoUsuario)
            .subscribe({
                next: (usuario)=>{
                  console.log(usuario);
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
    if(this.username=='' ||  this.email=='' || this.nombrecompleto=='' || this.numerotelefonico=='' || this.clientesSAPSeleccionados.length===0 || this.rolesSeleccionados.length===0 ){

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
        clientes: this.clientesSAPSeleccionados.map((cliente)=>{ return {CardCode:cliente.CardCode,CardName:cliente.CardName,FederalTaxID:cliente.FederalTaxID,EmailAddress:cliente.EmailAddress}})
      }

      if(this.password!=''){
        editarUsuario.password =this.password;
      }

        this.usuariosService.update(editarUsuario,this.config.data.id)
            .subscribe({
                next: (usuario)=>{
                  console.log(usuario);
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
