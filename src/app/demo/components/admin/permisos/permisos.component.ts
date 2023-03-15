import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/demo/service/usuario.service';
import { PermisosService } from 'src/app/demo/service/permisos.service';
import { FormPermisosComponent } from './form-permisos/form-permisos.component';
import { RolesService } from 'src/app/demo/service/roles.service';


@Component({
  selector: 'app-permisos',
  providers:[ConfirmationService,MessageService],
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss']
})
export class PermisosComponent implements  OnInit{

  dataTable:any[] = [];
  headersTable:any[] = [];
  
  permisosModulo!:any[];

  showBtnNew:boolean =false;
  showBtnEdit:boolean = false;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = false;

  opcionPermisos:any[] =[{code:'', name:''},{code:'rol', name:'Rol'}, {code:'usuario', name:'Usuario'}];
  opcionPermiso:any={code:'', name:''};

  roles!:[];
  rolSeleccionado:any = [];
  rolesFiltrados:any[] = [];

  usuarios!:[];
  usuarioSeleccionado:any = [];
  usuariosFiltrados:any[] = [];

  rolDisabled:boolean = false;
  usuarioDisabled:boolean = false;

  constructor(private router:Router,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private messageService:MessageService,
              private permisosService:PermisosService,
              private usuariosService:UsuarioService,
              private rolesService: RolesService){}

    ngOnInit() {
      this.getPermisosModulo();
      this.getRoles();
      this.getUsuarios();
      
      //this.getListadoPermisos();

      //console.log(this.opcionPermiso);
      
  
    }
  
    getPermisosModulo(){
        const modulo = this.router.url;
        this.usuariosService.getPermisosModulo(modulo)
            .subscribe({
                next: (permisos)=>{
                  //console.log(permisos);
                  if(!permisos.find((permiso: { accion: string; })=>permiso.accion==='leer')){
                    this.router.navigate(['/auth/access']);
                  }
  
                  if(permisos.find((permiso: { accion: string; })=>permiso.accion==='leer').valor===0){
                    this.router.navigate(['/auth/access']);
                  }
                  this.permisosModulo = permisos;
                  this.showBtnNew = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='crear').valor;
                  this.showBtnEdit = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='actualizar').valor;
                  this.showBtnExp = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='exportar').valor;
                  this.showBtnDelete = this.permisosModulo.find((permiso: { accion: string; })=>permiso.accion==='borrar').valor;
                },
                error:(err)=>{
                    console.error(err);
                }
            });
            
    }

    getRoles(){
      this.rolesService.getListadoRoles()
          .subscribe({
              next:(roles)=>{
                //console.log(roles);
                
                for(let rol of roles){
                    rol.code = rol.id,
                    rol.name = rol.nombre,
                    rol.label = rol.nombre  
                }

                this.roles = roles;
              },
              error:(err)=>{
                console.error(err);
              }
          })
    }

    getUsuarios(){
      this.usuariosService.getListadoUsuarios()
          .subscribe({
              next:(usuarios)=>{
                //console.log(usuarios);

                for(let usuario of usuarios){
                  usuario.code = usuario.id,
                  usuario.name = usuario.nombrecompleto,
                  usuario.label = usuario.nombrecompleto  
                }

              this.usuarios = usuarios;
              },
              error:(err)=>{
                console.error(err);
              }
          })
    }


    seleccionarOpcion(opcionPermiso: any){
        //console.log(opcionPermiso);
        this.rolSeleccionado = [];
        this.usuarioSeleccionado=[];
        this.dataTable=[];
        
        if(opcionPermiso.code==="rol"){
            this.setHeaderRol();
            
        }

        if(opcionPermiso.code==="usuario"){
          this.setHeaderUsuario();
          
        }
    }

    filtrarRoles(event: any){
      this.rolesFiltrados = this.filter(event,this.roles);
    }

    filtrarUsuarios(event: any){
      this.usuariosFiltrados = this.filter(event,this.usuarios);
    }

    seleccionarRol(rolSeleccionado:any){
        //console.log(rolSeleccionado);
        this.getListadoPermisos(rolSeleccionado.id);
    }

    seleccionarUsuario(usuarioSeleccionado:any){
      //console.log(usuarioSeleccionado);
      this.getListadoPermisos(usuarioSeleccionado.id);
    }

    getListadoPermisos(idSeleccion:number){
      this.permisosService.getListadoPermisos(this.opcionPermiso.code,idSeleccion)
          .subscribe({
              next: (permisos)=>{
                //console.log(permisos);
                /*let permisosTmp:any[] = [];
                for(let item of permisos){
                  permisosTmp.push({
                        id:item.id,
                        accion:item.accion,
                        descripcion:item.descripcion,
                        estado:item.estado
                    });
                }
  
                this.dataTable = permisosTmp;*/
                this.dataTable = permisos;
              },
              error:(err)=>{
                  console.error(err);
              }
          });
      
    }
  
    nuevaAccion(event: any){
      //console.log(event);
      //this.router.navigate(['/portal/solicitudes-de-cargue/nueva']);
      
        const ref = this.dialogService.open(FormPermisosComponent, {
          data: {
              id: parseInt('0')
          },
          header: `Nueva permiso` ,
          width: '70%',
          height:'auto',
          contentStyle: {"overflow": "auto"},
          maximizable:true, 
        });
      
        ref.onClose.subscribe(() => {
          //this.getListadoPermisos();
          ////console.log("Refresh calendar");
        });
    }
  
    editAccion(event: any){
  
      
        const ref = this.dialogService.open(FormPermisosComponent, {
          data: {
              id: parseInt(event)
          },
          header: `Editar permiso` ,
          width: '70%',
          height:'auto',
          contentStyle: {"overflow": "auto"},
          maximizable:true, 
        });
      
        ref.onClose.subscribe(() => {
          //this.getListadoPermisos();
          ////console.log("Refresh calendar");
        });
    }
    
    deleteAccion(event: any){
        //console.log(event);
    }

    changeState(event:any){
      //console.log(event);
      const {key, valor, id} = event;
      const arregloPermiso = id.toString().split('-');
      //console.log(arregloPermiso);
      let formQuery:any;
      if(this.opcionPermiso.code==='rol'){
        formQuery = {
          rolId:parseInt(arregloPermiso[0]),
          menuId:parseInt(arregloPermiso[1]),
          accionId:parseInt(arregloPermiso[2]),
          valor
        }
        this.updateEstadoPermmisoRol(formQuery);        
      }
      if(this.opcionPermiso.code==='usuario'){
        formQuery = {
          usuarioId:parseInt(arregloPermiso[0]),
          menuId:parseInt(arregloPermiso[1]),
          accionId:parseInt(arregloPermiso[2]),
          valor
        }
        this.updateEstadoPermmisoUsuario(formQuery);
        
      }


    }

    updateEstadoPermmisoRol(formQuery:any,){
      //console.log(formQuery)
      this.permisosService.updateEstadoPermmisoRol(formQuery)
      .subscribe({
          next:(permiso)=>{
              console.log(permiso);
              this.messageService.add({severity:'success', summary:'información', detail:`la actualización del estado del permiso seleccionado se ha realizado correctamente`});
          },
          error:(err)=>{
              console.error(err);
              this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
          }
      });
    }

    updateEstadoPermmisoUsuario(formQuery:any){
      this.permisosService.updateEstadoPermmisoUsuario(formQuery)
            .subscribe({
                next:(permiso)=>{
                    //console.log(permiso);
                    this.messageService.add({severity:'success', summary:'información', detail:`la actualización del estado del permiso seleccionado se ha realizado correctamente`});
                },
                error:(err)=>{
                    console.error(err);
                    this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                }
            });

    }

    setHeaderRol(){
        this.headersTable = [
          {
            'id':{ 
              label:'Id', 
              type:'text',
              sizeCol:'6rem',
              align:'center'
            },  
            'rol':{ 
                    label:'Rol', 
                    type:'text',
                    sizeCol:'6rem',
                    align:'center'
                  }, 
              'title': {
                    label:'Modulo',
                    type:'text', 
                    sizeCol:'6rem', 
                    align:'center'
                  }, 
              'accion': {
                        label:'Acción',
                        type:'text', 
                        sizeCol:'6rem', 
                        align:'justify'
                      },
              
              'valor':{
                label:'¿Activo?',
                type:'boolean', 
                sizeCol:'6rem', 
                align:'center'
              }
          }
        ];
    }

    setHeaderUsuario(){
      this.headersTable = [
        {
          'id':{ 
            label:'Id', 
            type:'text',
            sizeCol:'6rem',
            align:'center'
          },  
          'nombre':{ 
                  label:'Usuario', 
                  type:'text',
                  sizeCol:'6rem',
                  align:'center'
                }, 
            'title': {
                  label:'Modulo',
                  type:'text', 
                  sizeCol:'6rem', 
                  align:'center'
                }, 
            'accion': {
                      label:'Acción',
                      type:'text', 
                      sizeCol:'6rem', 
                      align:'justify'
                    },
            
            'valor':{
              label:'¿Activo?',
              type:'boolean', 
              sizeCol:'6rem', 
              align:'center'
            }
        }
      ];
  }

  filter(event: any, arrayFiltrar:any[]) {

    //////console.log(arrayFiltrar);
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

}
