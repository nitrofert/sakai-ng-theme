import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { FunctionsService } from 'src/app/demo/service/functions.service';

@Component({
  providers:[ConfirmationService,MessageService], 
  selector: 'app-dynamic-draw',
  templateUrl: './dynamic-upload.component.html'
})
export class DynamicUploadComponent implements OnInit, AfterViewInit {

    

    
  @ViewChild('uploaderFiles',{ static:false}) uploaderFiles!:ElementRef;

  filesToUpload!:FileUpload;
  uploadedFiles:any[] = [];

  dataUpload!:any;

  loading:boolean = false;
 
  
  constructor(public functionsService: FunctionsService,
              public config: DynamicDialogConfig,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              //public ref: DynamicDialogRef,
              ){}

  ngOnInit(): void {
   //////console.log(this.anchoVentana,this.alturaVentana);
   this.dataUpload = this.config.data;
  }

  ngAfterViewInit(): void {
    ////console.log(this.turno);
    this.render();
    
  }

 private render() {
    const uploadEl = this.uploaderFiles.nativeElement;
    this.filesToUpload = uploadEl;

    //this.filesToUpload.url = 
  }




  

  cerrar(){}
 

  async clearUploader(uploaderFiles: FileUpload){
    ////console.log(uploaderFiles,this.filesToUpload);
    //uploaderFiles.onClear;
    
 }

 removeFile($event:any,uploaderFiles: FileUpload){
     //////console.log('remove',$event,)
     //this.filesToUpload = [];
     //let currentFiles = uploaderFiles.files.filter((file: any)=>file != $event.file);
     //uploaderFiles.files = currentFiles;
     //this.loadFiles(currentFiles);
 }

 loadFiles(uploaderFiles: any ){
   //////console.log('filesToUpload',uploaderFiles, this.uploadedFiles);
   //let currentFiles = uploaderFiles;
   //for(let currentFile of currentFiles){
     //////console.log('currentFile',currentFile);
     //const [file] = currentFile;
     //this.filesToUpload.push({
     //  file:currentFile,
       //name:file.name
    // })
  // }

   //////console.log('this.filesToUpload',this.filesToUpload);
 }

 UploadFiles(event:any,uploaderFiles: FileUpload){
  
 ////console.log(event)
  for(let file of uploaderFiles.files){
     ////console.log(file);

      let body = new FormData();
      body.append('file', file, file.name);
      body.append('entidad', this.dataUpload.entidad);
      body.append('id_relacion', this.dataUpload.id_relacion);
      body.append('proceso', this.dataUpload.proceso);
      body.append('nombre', file.name);

     ////console.log(body)

      this.functionsService.uploadFile(body)
          .subscribe({
            next:(result)=>{
              //////console.log('Upload ok',result);
              
              this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha cargado correctamente el anexo ${file.name}`});
              
            },
            error:(err)=>{
              this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo :'+err});
            }
      });

       uploaderFiles.clear(); 

 }
 }

 progressUpload(event :any){
 ////console.log('progress ',event)
 }

 guardarFoto(file:any){
    
    let body = new FormData();
    body.append('file', file, `capture_${Date.now()}.png`);
    body.append('entidad', this.dataUpload.entidad);
    body.append('id_relacion', this.dataUpload.id_relacion);
    body.append('proceso', this.dataUpload.proceso);
    body.append('nombre', `capture_${Date.now()}.png`);

   ////console.log('guardarFoto',body)

    

    this.functionsService.uploadFile(body)
          .subscribe({
            next:(result)=>{
             ////console.log('Upload ok',result);
              
              this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha cargado correctamente el anexo capture_${Date.now()}.png`});
              this.loading = false;
            },
            error:(err)=>{
              this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo :'+err});
              this.loading = false;
            }
      });

       

 }

}
