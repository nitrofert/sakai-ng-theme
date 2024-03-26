import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-form-locacion',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-locacion.component.html',
  styleUrls: ['./form-locacion.component.scss']
})
export class FormLocacionComponent implements  OnInit {

  locacionId!:number;
  locacion:string = "";
  locacion2:string = "";
  locacionesSAP:any[] = [];
  locacionesMySQL:any[] = [];
  locacionCode:string = "";

  email_bodega:string = '';
  direccion:any = '';
  ubicacion:string = '';
  horarios:any[] = [];

  locacionSeleccionada!:any;
  locacionesFiltrados:any[] = [];

  showBtnNew:boolean =true;
  showBtnEdit:boolean = true;
  showBtnExp:boolean = false;
  showBtnDelete:boolean = true;
  infoUsuario!:any;

  diasAtencion:any[] = [];
  diasSeleccionados:any[] =[];

  horainicio:Date = new Date();
  horafin:Date = new Date();

  formHorarios:boolean = false;

  tituloFormHorario:string = "";

  submitHorario:boolean = false;
  submitLocacion:boolean = false;

  editLocacion:boolean = false;
  editHorarios:boolean = false;
  editIndexHorario:number = 0;
  horarioSelecionado!:number;

  dataTable:any[] = [];
  headersTable:any[] = [
                          {
                            'id':{ 
                              label:'Id', 
                              type:'text',
                              sizeCol:'6rem',
                              align:'center'
                            }, 
                              'dias_atencion': {
                                    label:'Diás de atención',
                                    type:'text', 
                                    sizeCol:'6rem', 
                                    align:'center'
                                  }, 
                              'horainicio': {
                                        label:'Hora inicio de atención',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'center'
                                      },
                              'horafin': {
                                        label:'Hora fin de atención',
                                        type:'text', 
                                        sizeCol:'6rem', 
                                        align:'center'
                                      }

                          }
                        ];
  
  constructor( private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public ref: DynamicDialogRef,
    private router:Router,
    public usuariosService:UsuarioService,
    private almacenesService:AlmacenesService, 
    public dialogService: DialogService,
    public config: DynamicDialogConfig,
    public functionsService:FunctionsService) { }

ngOnInit() {

  this.locacionId = this.config.data.id;
  this.diasAtencion = this.functionsService.dias;
  this.horainicio =new Date(new Date().setHours(8,0,0));
  this.horafin =new Date(new Date().setHours(16,30,0));

 //////////console.log(this.horainicio.toLocaleTimeString('en-US',{ hour12: false }));
 //////////console.log(this.horafin.toLocaleTimeString('en-US',{ hour12: false }));

  this.getLocacionesMySQL();

 

}

getLocacionesMySQL(){
  this.almacenesService.getLocaciones()
  .subscribe({
      next:(locaciones)=>{
         //////////console.log('locacionesMySQL',locaciones);
          this.locacionesMySQL = locaciones;
          if(this.locacionId!=0){
            this.editLocacion = true;
            this.getLocacionByCode(locaciones.find((locacion: { id: number; })=>locacion.id === this.locacionId).code);
          }
          this.getLocacionesSAP();
      },
      error:(err)=>{
        console.error(err);
      }
  });
}

 getLocacionesSAP(){
  this.almacenesService.getAlmacenes()
  .subscribe({
      next:async (almacenes:any[])=>{
       console.log('getLocacionesSAP',almacenes);
        let almacenesTMP:any[] = await this.functionsService.objectToArray(almacenes);
        almacenesTMP = almacenesTMP.filter((almacen: { CorreoNoti: string | null; }) => almacen.CorreoNoti!=null && almacen.CorreoNoti!="");
        
        let locacionesSAP:any[] = [];
        for(let almacen of almacenesTMP){
          if(this.locacionesMySQL.filter(locacionMysql => locacionMysql.code == almacen.locacion_codigo2).length ==0 ){
              if(locacionesSAP.filter(locacionSAP=> locacionSAP.code == almacen.locacion_codigo2).length ==0){
                almacen.code = almacen.locacion_codigo2;
                almacen.name = almacen.locacion2;
                almacen.label = almacen.locacion2;

                locacionesSAP.push(almacen);
              }
          }
        }

        this.locacionesSAP=  await this.functionsService.sortArrayObject(locacionesSAP,'name','DESC')

        //////////console.log('getLocacionesSAP',this.locacionesSAP);
      },
      error:(err)=>{
          console.error(err);
      }

}); 
}

getLocacionByCode(code:any){
  this.almacenesService.getLocacionByCode(code)
      .subscribe({
            next:async (locacion)=>{
             //console.log(locacion);
              let datatable = await (this.functionsService.clonObject(locacion.horarios_locacion));
              datatable.map((horario:any)=>{
                let horaInicio = new Date();
                horaInicio.setHours(horario.horainicio.split(":")[0],horario.horainicio.split(":")[1],horario.horainicio.split(":")[2]);
                let horaFin = new Date();
                horaFin.setHours(horario.horafin.split(":")[0],horario.horafin.split(":")[1],horario.horafin.split(":")[2]);
                horario.horainicio = horaInicio.toLocaleTimeString();
                horario.horafin = horaFin.toLocaleTimeString();
              });
              this.locacion = locacion.locacion;
              this.email_bodega = locacion.email;
              this.direccion = locacion.direccion;
              this.ubicacion = locacion.ubicacion;
              this.locacion2 = locacion.locacion2;
              this.dataTable = datatable;
              this.horarios = await this.functionsService.clonObject(locacion.horarios_locacion);
              this.locacionCode = locacion.code;

              //console.log(this.dataTable,this.horarios);
            },
            error:(err)=>{
              console.error(err);
            }
      });
}

async filtrarLocacion(event: any){
  
    this.locacionesFiltrados = await this.functionsService.filter(event,this.locacionesSAP);
  
}

seleccionarLocacion(locacionSeleccionada:any){
//////console.log(locacionSeleccionada);
this.email_bodega = locacionSeleccionada.CorreoNoti;
}

cambioLocacion(){

}

editHorario(event:any){
 //console.log(event);
  
  
  this.tituloFormHorario ="Editar horario";
  this.formHorarios = true;
  let indexHorario = this.horarios.findIndex(horario=>horario.id === event);
  this.editIndexHorario = indexHorario;
  this.horarioSelecionado = indexHorario;
  let diasSeleccionados = this.dataTable[indexHorario].dias_atencion.split(",");
  let dias:any = [];
  for(let dia of this.diasAtencion){
      if(diasSeleccionados.includes(dia.fullname)){
          dias.push(dia);
      }
  }

  let horaInicio = new Date();
  horaInicio.setHours(this.horarios[indexHorario].horainicio.split(":")[0],this.horarios[indexHorario].horainicio.split(":")[1],this.horarios[indexHorario].horainicio.split(":")[2]);
  this.horainicio = horaInicio

  let horaFin = new Date();
  horaFin.setHours(this.horarios[indexHorario].horafin.split(":")[0],this.horarios[indexHorario].horafin.split(":")[1],this.horarios[indexHorario].horafin.split(":")[2]);
  this.horafin = horaFin;

  this.diasSeleccionados = dias;
  this.editHorarios = true

}

deleteHorario(event:any){
  console.log(event);
  this.confirmationService.confirm({
    message: 'Esta seguro de eliminar las lineas de horario sele4cionadas. ¿Desea continuar?',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
       for(let horario of event ){
          let indexHorario = this.horarios.findIndex(item=>item.id === horario.id)
          this.horarios.splice(indexHorario,1);
          this.dataTable.splice(indexHorario,1);
       }

    },
    reject: async (type: any) => {
        switch(type) {
            case ConfirmEventType.REJECT:
                //this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
                
            break;
            case ConfirmEventType.CANCEL:
                //this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
                
            break;
        }
        
        
    }
});
}

nuevoHorario(event:any){
  this.tituloFormHorario ="Adicionar horario";
  this.formHorarios = true;
  this.editHorarios = false;
}

grabarHorario(){
 //////////console.log(this.diasSeleccionados, this.horainicio, this.horafin)
  this.submitHorario = true;
  if(this.diasSeleccionados.length ==0){
      this.messageService.add({severity:'error', summary: '!Error¡', detail:  "Debe seleccionar al menos un dia para la atención"});
  }else if((new Date(this.horainicio)) >= (new Date(this.horafin))){
      this.messageService.add({severity:'error', summary: '!Error¡', detail:  "La fecha de inicio de la atención no puede ser mayor o igual a la fecha  de finalización"});
  }else{

    ////console.log(this.editIndexHorario,this.dataTable[this.editIndexHorario].id);
    //let id = this.dataTable[this.editIndexHorario].id;

      if(this.editHorarios){

        this.horarios[this.editIndexHorario].dias_atencion = this.diasSeleccionados.map((dia)=>{ return dia.fullname}).join(',');
        this.horarios[this.editIndexHorario].horainicio = this.horainicio.toLocaleTimeString('en-US',{ hour12: false });
        this.horarios[this.editIndexHorario].horafin = this.horafin.toLocaleTimeString('en-US',{ hour12: false });

        this.dataTable[this.editIndexHorario].dias_atencion = this.diasSeleccionados.map((dia)=>{ return dia.fullname}).join(',');
        this.dataTable[this.editIndexHorario].horainicio = this.horainicio.toLocaleTimeString();
        this.dataTable[this.editIndexHorario].horafin =this.horafin.toLocaleTimeString();
    
      }else{

        this.horarios.push({
          id:this.horarios.length,
          dias_atencion:this.diasSeleccionados.map((dia)=>{ return dia.fullname}).join(','),
          horainicio:this.horainicio.toLocaleTimeString('en-US',{ hour12: false }),
          horafin:this.horafin.toLocaleTimeString('en-US',{ hour12: false })
        });
        
        this.dataTable.push({
          id:this.dataTable.length,
          dias_atencion:this.diasSeleccionados.map((dia)=>{ return dia.fullname}).join(','),
          horainicio:this.horainicio.toLocaleTimeString(),
          horafin:this.horafin.toLocaleTimeString()
        });

      }


      //console.log(this.dataTable,this.horarios);

      this.diasSeleccionados = [];
      this.formHorarios = false;
  }
}

grabarLocacion(){
  this.submitLocacion = true;
    if( (!this.editLocacion && (!this.locacionSeleccionada || this.locacionSeleccionada.length ==0)) || !this.email_bodega){
      this.messageService.add({severity:'error', summary: '!Error¡', detail:  "Los campos resaltados en rojo deben ser diligenciados"});
    }else if(this.dataTable.length==0){
      this.messageService.add({severity:'error', summary: '!Error¡', detail:  "Debe adicionar por lo menos un horario de atención para la locación"});
    }else{
        let data = {
          code: this.editLocacion? this.locacionCode :this.locacionSeleccionada.code,
          locacion: this.editLocacion?this.locacion :this.locacionSeleccionada.name,
          locacion2: this.locacion2,
          email: this.email_bodega,
          direccion:this.direccion,
          ubicacion:this.ubicacion,
          horarios:this.horarios
          ///horarios:this.dataTable
        }

       //console.log(data);
       if(!this.editLocacion){
        //Registro de locacion
        this.almacenesService.setLocacion(data)
        .subscribe({
            next:(locacion)=>{
             //////////console.log(locacion);
              this.messageService.add({severity:'success', summary: '!Error¡', detail: `Se ha realizado correctamente el registro de la locación ${locacion.locacion}.`});
              this.cerrar();                
            },
            error:(error)=>{
              console.error(error.error);
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  error.error.message});
            }
        });
       }else{
          //Actualización de locacion
          this.almacenesService.updateLocacion(data,this.locacionId)
        .subscribe({
            next:(locacion)=>{
             //////////console.log(locacion);
              this.messageService.add({severity:'success', summary: '!Error¡', detail: `Se ha actualizado correctamente el registro de la locación ${locacion.locacion}.`});
              this.cerrar();                
            },
            error:(error)=>{
              console.error(error.error);
              this.messageService.add({severity:'error', summary: '!Error¡', detail:  error.error.message});
            }
        });
       }

        
    }
}

cerrar(){
  this.ref.close();
}

}
