import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { FormMenuComponent } from './form-menu/form-menu.component';
import { MenuService } from 'src/app/layout/shared/menu/app.menu.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-menu',
  providers:[ConfirmationService,MessageService],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements  OnInit{

  dataTable:any[] = [];
  headersTable:any[] = [
                          {
                              'id':{ 
                                    label:'Id menú', 
                                    type:'text',
                                    sizeCol:'6rem',
                                    align:'center',
                                    field:'id'
                                  }, 
                              'title': {
                                    label:'Título',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center',
                                    field:'title'
                                  }, 
                              'description': {
                                        label:'Descripción',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'justify',
                                        field:'description',
                                      },
                              'ordernum':{
                                label:'Nivel',
                                type:'number', 
                                sizeCol:'6rem', 
                                align:'center',
                                field:'ordernum'
                              },
                              'hierarchy':{
                                label:'Jerarquia',
                                type:'text', 
                                sizeCol:'6rem', 
                                align:'center',
                                field:'hierarchy'
                              },         
                              'estado': {
                                
                                  label:'Estado',
                                  type:'text', 
                                  sizeCol:'6rem', 
                                  align:'center',
                                  field:'estado'
                              },
                              'visible': {
                                    label:'Visible',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center',
                                    field:'visible'
                               }           
                          }
                        ];
  
  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:true, delete_accion:false}];
  permisosModulo!:any[];

  showBtnNew:boolean =false;
  showBtnEdit:boolean = false;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = false;

  constructor(private router:Router,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private menuService:MenuService,
              private usuariosService:UsuarioService){}


  ngOnInit() {
    this.getPermisosModulo(); 
    this.getListadoMenu();
    

  }

  getPermisosModulo(){
      const modulo = this.router.url;
      this.usuariosService.getPermisosModulo(modulo)
          .subscribe({
              next: (permisos)=>{
               //////console.log(permisos);
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

  getListadoMenu(){
    this.menuService.getListadoMenu()
        .subscribe({
            next: (menu)=>{
             //////console.log(menu);
              let menuTmp:any[] = [];
              for(let item of menu){
                  menuTmp.push({
                      id:item.id,
                      title:item.title,
                      description:item.description,
                      ordernum:item.ordernum,
                      hierarchy:item.hierarchy=='P'?'Padre':'Hijo',
                      estado:item.estado,
                      visible:item.visible?'SI':'NO'
                  });
              }

              this.dataTable = menuTmp;
            },
            error:(err)=>{
                console.error(err);
            }
        });
    
  }

  nuevoMenu(event: any){
   //////console.log(event);
    //this.router.navigate(['/portal/solicitudes-de-cargue/nueva']);
   
      const ref = this.dialogService.open(FormMenuComponent, {
        data: {
            id: parseInt('0')
        },
        header: `Nueva opción de menú` ,
        width: '70%',
        height:'auto',
        contentStyle: {"overflow": "auto"},
        maximizable:true, 
      });
    
      ref.onClose.subscribe(() => {
        this.getListadoMenu();
        //////console.log("Refresh calendar");
      });
  }


  editMenu(event: any){

    
      const ref = this.dialogService.open(FormMenuComponent, {
        data: {
            id: parseInt(event)
        },
        header: `Editar opción de menú` ,
        width: '70%',
        height:'auto',
        contentStyle: {"overflow": "auto"},
        maximizable:true, 
      });
    
      ref.onClose.subscribe(() => {
        this.getListadoMenu();
        //////console.log("Refresh calendar");
      });
  }
 
  deleteMenu(event: any){
     //////console.log(event);
  }

}
