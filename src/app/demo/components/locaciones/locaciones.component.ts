import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UsuarioService } from '../../service/usuario.service';
import { FunctionsService } from '../../service/functions.service';
import { AlmacenesService } from '../../service/almacenes.service';
import { FormLocacionComponent } from './form-locacion/form-locacion.component';

@Component({
  selector: 'app-locaciones',
  providers:[ConfirmationService,MessageService],
  templateUrl: './locaciones.component.html',
  styleUrls: ['./locaciones.component.scss']
})
export class LocacionesComponent implements  OnInit{


  permisosModulo!:any[];

  showBtnNew:boolean =false;
  showBtnEdit:boolean = false;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = false;
  infoUsuario!:any;


  dataTable:any[] = [];
  headersTable:any[] = [
                          {
                              'id':{ 
                                    label:'Id', 
                                    type:'text',
                                    sizeCol:'6rem',
                                    align:'center'
                                  }, 
                              'code': {
                                    label:'Código',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center'
                                  }, 
                              'locacion': {
                                        label:'Locación',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'center'
                                      }, 
                              'email': {
                                          label:'E-mail',
                                          type:'text', 
                                          sizeCol:'6rem', 
                                          align:'center'
                                        },
                              'horarios': {
                                                label:'Horarios atención',
                                                type:'text', 
                                                sizeCol:'6rem', 
                                                align:'center'
                                              }
                          }
                        ];
  
  permisosUsuarioPagina:any[] = [{ read_accion:true,create_accion:true, update_accion:false, delete_accion:false}];

  constructor(private router:Router,
              public dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private  messageService: MessageService,
              private usuariosService:UsuarioService,
              private almacenesService:AlmacenesService,
              public functionsService:FunctionsService){}
              
  ngOnInit() {
    this.getPermisosModulo(); 
    
  }
  
  getPermisosModulo(){
    const modulo = this.router.url;
    this.usuariosService.getPermisosModulo(modulo)
        .subscribe({
            next: async (permisos)=>{
              ////////console.log(permisos);
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

              
              this.infoUsuario = await this.usuariosService.infoUsuario();
              //////console.log(this.infoUsuario);
              this.getLocaciones();

            },
            error:(err)=>{
                console.error(err);
            }
        });
          
  }

  getLocaciones(){
      this.almacenesService.getLocaciones()
          .subscribe({
              next:async (locaciones)=>{
                 //////console.log(locaciones);
                  let dataLocaciones:any[] = [];
                  for(let locacion of locaciones){
                    let horarios =await this.formatHorariosLinea(locacion.horarios_locacion);
                    dataLocaciones.push({
                      id:locacion.id,
                      code:locacion.code,
                      locacion:locacion.locacion,
                      email:locacion.email,
                      horarios
                    });
                  }
                  this.dataTable = dataLocaciones;
              },
              error:(err)=>{
                console.error(err);
              }
          });
  }

  async formatHorariosLinea(arrayHorarios:any[]):Promise<any>{
    let horarios:string="";
    arrayHorarios = await this.functionsService.sortArrayObject(arrayHorarios,'id','ASC');
   //////console.log(arrayHorarios);
    
    let horariosStr="";
    for(let horario of arrayHorarios){

      let horainicio = new Date(new Date().setHours(horario.horainicio.split(':')[0],horario.horainicio.split(':')[1],horario.horainicio.split(':')[2])).toLocaleTimeString();
      let horafin = new Date(new Date().setHours(horario.horafin.split(':')[0],horario.horafin.split(':')[1],horario.horafin.split(':')[2])).toLocaleTimeString();
     //////console.log(horainicio);
      //horarios=horarios+`${horario.dias_atencion} de ${horario.horainicio} a ${horario.horafin} `;
      //////console.log(`${horario.dias_atencion} de ${horario.horainicio} a ${horario.horafin} `);
      horariosStr= horarios.concat(horariosStr,`[${horario.dias_atencion} de ${horainicio} - ${horafin}] `)
     
    }

   //////console.log(horariosStr.toLowerCase());
    

    return horariosStr.toLowerCase();
  }

  editlocacion(event: any){
   //////console.log(event);
    const ref = this.dialogService.open(FormLocacionComponent, {
      data: {
          id: event
      },
      header: `Editar locación` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async (infoVehiculo) => {
      this.getLocaciones();
      
    });
  }

  deleteLocacion(event: any){}

  nuevaLocacion(event: any){
    const ref = this.dialogService.open(FormLocacionComponent, {
      data: {
          id: parseInt('0')
      },
      header: `Nueva locación` ,
      width: '70%',
      height:'auto',
      contentStyle: {"overflow": "auto"},
      maximizable:true, 
    });
  
    ref.onClose.subscribe(async (infoVehiculo) => {
      this.getLocaciones();
      
    });

  }
            

}
