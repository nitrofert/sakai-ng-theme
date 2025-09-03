import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { Table } from 'primeng/table';
import { ConductoresService } from 'src/app/demo/service/conductores.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';

@Component({
  selector: 'app-form-conductor',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-conductor.component.html',
  styleUrls: ['./form-conductor.component.scss']
})
export class FormConductorComponent  implements  OnInit {

  cedula:string ='';
  nombre:string = '';
  numerotelefonico:string = '';
  numerocelular:string = '';
  email:string = '';
  fechacargue:Date = new Date();
  hoy:Date = new Date();

  fechainicio:Date = new Date();
  fechafin:Date = new Date();

  nueva_fechainicio_arl:Date = new Date();
  nueva_fechafin_arl:Date = new Date();


  envioLineaConductor:boolean = false;
  updateMode:boolean = false;

  @ViewChild('uploaderFiles',{ static:false}) uploaderFiles!:ElementRef;
  uploadedFiles:any[] = [];
  dataUpload!:any;
  links3:string = "";

  infoConductor:any;

  displayModalHistorialARL:boolean = false;
  displayModal:boolean = false;
  displayModalRegistroARL:boolean = false;

  historialARL:any[] = [];
  loadingTableHistorialARL:boolean = false;

  historialARLLineSelected:any[] = [];
  id:number = 0;

  @ViewChild('filterTable') filterTable!: ElementRef;

  

  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private conductoresService: ConductoresService,
    public functionsService: FunctionsService,
    ){}

    ngOnInit() {
      //////////////console.log(this.config.data.id);
      if(this.config.data.id!=0){
        this.getInfoConductor(this.config.data.id);
        this.updateMode = true;
      }
    }

    getInfoConductor(id:any){
      this.conductoresService.getConductorById(id)
          .subscribe({
              next:(infoConductor)=>{
                  ////console.log('infoConductor',infoConductor);
                  this.infoConductor = infoConductor;
                  this.nombre= infoConductor.nombre;
                  this.cedula=  infoConductor.cedula;
                  this.email= infoConductor.email;
                  this.numerotelefonico= infoConductor.numerotelefono;
                  this.numerocelular = infoConductor.numerocelular;

                  this.historialARL = infoConductor.historial_arl;

                  if(this.historialARL.length > 0){
                    let arl_activa = this.historialARL.filter(arl=>arl.estado === 'ACTIVO');

                    if(arl_activa.length > 0){
                      this.fechainicio = new Date(arl_activa[0].fechainicio+'T05:00:00.000Z');
                      this.fechafin = new Date(arl_activa[0].fechafin+'T05:00:00.000Z');
                      this.links3 = arl_activa[0].path_s3; 
                    }
                  } 
                 
              },
              error:(err)=>{
                console.error(err);
              }
          });
    }

    grabar(){
      this.envioLineaConductor= true;
      if(this.cedula=='' || this.nombre==''){

          this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
      }else{
          let nuevoConductor ={
            nombre:this.nombre,
            cedula:this.cedula,
            email:this.email,
            numerotelefono:this.numerotelefonico,
            numerocelular:this.numerocelular
            
          }

          if(this.updateMode){
            //Actualizar info conductor
            
            this.conductoresService.update(nuevoConductor,this.config.data.id)
              .subscribe({
                  next: (conductor)=>{
                   //////////////console.log(conductor);
                   this.id = conductor.id
                    this.messageService.add({severity:'success', summary:'información', detail:`El conductor ${this.nombre} fue actualizado correctamente`});
                  },
                  error:(err)=> {
                      console.error(err);

                      this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                  },
              });
          }else{
            //Registro info conductor
            this.conductoresService.create(nuevoConductor)
              .subscribe({
                  next: (conductor)=>{
                   //////////////console.log(conductor);
                   this.id = conductor.id
                    this.messageService.add({severity:'success', summary:'información', detail:`El conductor ${conductor.nombre} fue registrado correctamente`});
                  },
                  error:(err)=> {
                      console.error(err);

                      this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                  },
              });
          }

          
      }
    }
  
    cancelar(){
      let infoConductor ={
        cedula:this.cedula,
        code:this.cedula,
        email:this.email,
        id: this.id,
        label:`${this.cedula} - ${this.nombre.toUpperCase()}`,
        name:this.nombre.toUpperCase(),
        nombre:this.nombre.toUpperCase(),
        numerotelefono:this.numerotelefonico,
        numerocelular:this.numerocelular
        
      }
      this.ref.close(infoConductor);
    }

    keyPress(event:any){
       //////////////console.log(event);
        
        var key =  event.keyCode;
        let teclasFuncionales:any[] =[8,46,9,13];

        //Numeros
        if((parseInt(key)>=48 && parseInt(key)<=57 && !event.shiftKey) || 
           //(parseInt(key)>=65 && parseInt(key)<=90) || 
           (parseInt(key)>=96 && parseInt(key)<=105) || 
           teclasFuncionales.includes(key)){
          
        }else{
         //////////////console.log(key);
          event.preventDefault();
        }
    }

    adicionarARL(){
      this.displayModalRegistroARL=true;
    }


    borrarARL(){


      this.confirmationService.confirm({
        message: `Esta seguro de borrar las ARL seleccionadas?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
  
          for(let arl of this.historialARLLineSelected ){

          }
  
  
        },
        
          reject: (type: any) => {
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

    downloadARL(arl:any){
      ////console.log(arl);

      let query:any = {
        id:arl.fileid
      }

      this.functionsService.loadFiles(query)
                 .subscribe({
                   next:(result)=>{
                     ////console.log('loadFiles ok',result);
                     window.open(result[0].linkS3);
                     
                   },
                   error:(err)=>{
                     this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo :'+err});
                   }
             });
      
    }


    UploadFiles(event:any,uploaderFiles: FileUpload){


      if(this.nueva_fechafin_arl< this.nueva_fechainicio_arl){
        this.messageService.add({severity:'error', summary:'Error', detail:'La fecha de fin no puede ser menor a la fecha de inicio vigencia '});
      }else{

        this.dataUpload =  {
          id_relacion: this.infoConductor.id,
          entidad: 'conductor',
          proceso: 'arl',
        }
    
        //////console.log(event)
        for(let file of uploaderFiles.files){
            //////console.log(file);
       
             let body = new FormData();
             body.append('file', file, file.name);
             body.append('entidad', this.dataUpload.entidad);
             body.append('id_relacion', this.dataUpload.id_relacion);
             body.append('proceso', this.dataUpload.proceso);
             body.append('nombre', file.name);
       
            //////console.log(body)
       
             this.functionsService.uploadFile(body)
                 .subscribe({
                   next:(result)=>{
                     ////console.log('Upload ok',result);
                     
                     this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha cargado correctamente el anexo ${file.name}`});

                     let updateArlConductor ={

                        cedula:this.cedula,
                        arl:{
                          fechainicio: this.nueva_fechainicio_arl,
                          fechafin: this.nueva_fechafin_arl,
                          path_s3: result.nombre,
                          links3: result.linkS3,
                          fileid: result.id
                        }                      
                    }

                    this.conductoresService.updateARl(updateArlConductor,this.config.data.id)
                      .subscribe({
                          next: (historialARL)=>{
                            ////console.log(historialARL);
                            //this.messageService.add({severity:'success', summary:'información', detail:`El conductor ${conductor.nombre} fue actualizado correctamente`});
                            this.historialARL = historialARL;
                            this.displayModalRegistroARL=false;

                            let arlActiva:any = historialARL.find((arl: { estado: string; })=>arl.estado==='ACTIVO');
                            this.links3 = arlActiva.path_s3;
                            this.fechainicio = new Date(`${arlActiva.fechainicio}T00:00:00`);
                            this.fechafin = new Date(`${arlActiva.fechafin}T00:00:00`);

                          },
                          error:(err)=> {
                              console.error(err);

                              this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
                          },
                    });


          
                     
                   },
                   error:(err)=>{
                     this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo :'+err});
                   }
             });
       
              uploaderFiles.clear(); 
       
        }
      }
      
    }
     
      progressUpload(event :any){
      //////console.log('progress ',event)
      }


      verARL(url:string){
          this.displayModalHistorialARL = true;
      }

      formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      }
    
      onGlobalFilter(table: Table, event: Event) {
          table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }
    
      clear(table: Table) {
        table.clear();
        this.filterTable.nativeElement.value = '';
      }
}
