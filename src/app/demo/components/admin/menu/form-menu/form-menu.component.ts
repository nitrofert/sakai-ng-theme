import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { MenuService } from 'src/app/layout/shared/menu/app.menu.service';

@Component({
  selector: 'app-form-menu',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-menu.component.html',
  styleUrls: ['./form-menu.component.scss']
})
export class FormMenuComponent implements  OnInit {

  title:string = "";
  description:string = "";
  url:string = "";
  icon:string = "";
  hierarchys:any[] =[{code:'', name:''},{code:'P', name:'Padre'}, {code:'H', name:'Hijo'}];
  hierarchy:any=[];
  hierarchyDisabled:boolean=true;
  opcionesVisible:any[] = [{code: 1, name:'SI'}, {code:0, name:'NO'}];
  visible:any= [];
  envioLineaMenu:boolean = false;
  nivel:number = 0;



  opcionesPadres!:any[];
  opcionPadre:any = [];
  opcionesPadresFiltrados:any[] = [];

  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private menuService: MenuService
    ){}

  async ngOnInit() {
    
    this.getOpcionesMenuPadre();
    if(this.config.data.id!=0){
      //Buscar información  del menu seleccionado
      this.getInfoMenu(this.config.data.id);
    }
  }

  async getInfoMenu(idmenu:number){
    const menu$ = this.menuService.getMenuByID(this.config.data.id);
    const menu = await lastValueFrom(menu$);
    
    this.title = menu.title;
    this.description = menu.description;
    this.url = menu.url;
    this.icon = menu.icon;
    this.hierarchy = this.hierarchys.find(item => item.code===menu.hierarchy);
    this.visible = this.opcionesVisible.find(item => item.code === menu.visible);
    this.nivel = menu.ordernum;
    this.opcionPadre = [];
    if(menu.hierarchy==='H'){
        const opcionesMenu$ = this.menuService.getListadoMenu();
        const opcionesMenu = await lastValueFrom(opcionesMenu$);
       
        this.opcionesPadres = await this.getMenuPadres(opcionesMenu);
        ////console.log( this.opcionesPadres);
        this.opcionPadre = this.opcionesPadres.find(opcion => opcion.id === menu.iddad);
        ////console.log( this.opcionPadre);

    }

  }

  async getMenuPadres(menu:any){
    let menuPadres = menu.filter((item: { hierarchy: string; })=>item.hierarchy==='P');
    
    return  menuPadres;
  } 

  getOpcionesMenuPadre(){
    this.menuService.getListadoMenu()
        .subscribe({
            next: async (menu)=>{
              this.opcionesPadres = await this.getMenuPadres(menu);
            },
            error:(err)=>{
                console.error(err);
            }
        });
  }

  filtrarOpcionPadre(event:any){
    this.opcionesPadresFiltrados = this.filter(event,this.opcionesPadres);
    
  }

  seleccionarOpcionPadre(opcionPadre:any){

  }

  filter(event: any, arrayFiltrar:any[]) {

    //////console.log(arrayFiltrar);
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < arrayFiltrar.length; i++) {
        const linea = arrayFiltrar[i];
        if (linea.title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            filtered.push(linea);
        }
    }
    return filtered;
  }

  seleccionarJerarquia(hierarchy:any){
    ////console.log(this.hierarchy)
    if(hierarchy.code ==='H'){
     
      this.hierarchyDisabled = false;
    }else{
      this.opcionPadre =[];
      this.hierarchyDisabled = true;
    }
  }

  grabar(){
    this.envioLineaMenu= true;
    if(this.title=='' || this.url=='' || this.hierarchy.code=='' ){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else{
      ////console.log(this.hierarchy,this.visible, this.opcionPadre);
        let nuevoMenu:any ={
          title:this.title,
          description:this.description,
          url:this.url,
          icon:this.icon,
          hierarchy:this.hierarchy.code,
          visible:this.visible.code,
          iddad:this.hierarchy.code==='P'?0:this.opcionPadre.id
        }

       
        this.menuService.create(nuevoMenu)
            .subscribe({
                next: (menu)=>{
                  ////console.log(menu);
                  this.messageService.add({severity:'success', summary:'información', detail:`La opción ${menu.title} fue registrado correctamente al menú`});
                },
                error:(err)=> {
                    console.error(err);

                    this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                },
            });
    }
  }

  editar(){
    this.envioLineaMenu= true;
    if(this.title=='' || this.url=='' || this.hierarchy.code=='' || this.nivel==0 || !this.nivel ){

        this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
    }else{
      
        let nuevoMenu ={
          title:this.title,
          description:this.description,
          url:this.url,
          icon:this.icon,
          hierarchy:this.hierarchy.code,
          visible:this.visible.code,
          iddad:this.hierarchy.code==='P'?0:this.opcionPadre.id,
          ordernum:this.nivel
        }

        this.menuService.update(nuevoMenu,this.config.data.id)
            .subscribe({
                next: (menu)=>{
                  ////console.log(menu);
                  this.messageService.add({severity:'success', summary:'información', detail:`La opción ${this.title} fue actualizada correctamente al menú`});
                  //this.ref.close();
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
