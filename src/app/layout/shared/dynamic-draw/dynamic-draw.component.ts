import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { FunctionsService } from 'src/app/demo/service/functions.service';

@Component({
  providers:[ConfirmationService,MessageService], 
  selector: 'app-dynamic-draw',
  templateUrl: './dynamic-draw.component.html'
})
export class DynamicDrawComponent implements OnInit, AfterViewInit {

    

    public isAvailabe: boolean = false;

    @ViewChild('canvasRef',{ static:false}) canvasRef!:any;

    public width = 600;
    public height = 300;

    private cx!:CanvasRenderingContext2D;
    private points:Array<any> = [];
    private pointsValidate:Array<any> = [];

    public anchoVentana = window.innerWidth;
    public alturaVentana = window.innerHeight;

    /*

    @HostListener('touchstart', ['$event'])
    onTouchStart(e: any) { //TouchEvent on any
        // Tu lógica aquí
        if (e.target.id === 'canvasDraw' ) {
          console.log('Toque detectado', e);
          this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Toque start ${e.type}`});
          this.isAvailabe = true;
        }
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(e: any) { // TouchEvent on any
        // Tu lógica aquí
        if (e.target.id === 'canvasDraw' ) {
          console.log('Toque levantado', e);
          this.messageService.add({severity:'info', summary: 'Confirmación', detail:  `Toque end ${e.type}`});
          this.isAvailabe = false;
          this.pointsValidate = JSON.parse(JSON.stringify(this.points));
          this.points = [];
        }
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(e: any) { //TouchEvent on any
        // Tu lógica aquí
       // console.log('Movimiento de toque detectado', event);
       
        if (e.target.id === 'canvasDraw' && (this.isAvailabe)) {
          this.messageService.add({severity:'warn', summary: 'Confirmación', detail:  `move :${JSON.stringify(e)}`} );
          this.write(e);
          //console.log(e);
          //this.coordenadasMouseMove = e;
        }
    }

    */

    @HostListener('mousedown', ['$event'])
      onMouseDown(event: any) { //MouseEvent on any
        // Tu lógica aquí
        if (event.target.id === 'canvasDraw' ) {
          console.log('Clic down detectado', event);
          this.isAvailabe = true;
        }
        
    }

    
    @HostListener('mouseup', ['$event'])
    onMouseUp(event: any) { // MouseEvent on any
      // Tu lógica aquí
      if (event.target.id === 'canvasDraw' ) {
        console.log('Clic up detectado', event);
        this.isAvailabe = false;
        this.pointsValidate = JSON.parse(JSON.stringify(this.points));
        this.points = [];
      }
  }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove = (e: any) => {
      //console.log(e);
      if (e.target.id === 'canvasDraw' && (this.isAvailabe)) {
        this.write(e);
        //console.log(e);
        //this.coordenadasMouseMove = e;
      }
    }

    /*@HostListener('click', ['$event'])
    onClick = (e: any) => {
      if (e.target.id === 'canvasDraw') {
        this.isAvailabe = !this.isAvailabe;
        if(!this.isAvailabe){
          this.pointsValidate = JSON.parse(JSON.stringify(this.points));
          this.points = [];
        }
      }
    }*/

  dataCanvas!:any;
  
  constructor(public functionsService: FunctionsService,
              public config: DynamicDialogConfig,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              ){}

  ngOnInit(): void {
   // console.log(this.anchoVentana,this.alturaVentana);
   this.dataCanvas = this.config.data;
  }

  ngAfterViewInit(): void {
    //console.log(this.turno);
    this.render();
    
  }

 private render() {
    const canvasEl = this.canvasRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
  }

  private write(res:any) {
    const canvasEl = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top,
    }
    //console.log(prevPos);
    this.writeSingle(prevPos);
  }

  private writeSingle(prevPos:any, emit: boolean = true) {
    this.points.push(prevPos);
    if (this.points.length > 3) {
      const prevPost = this.points[this.points.length - 1];
      const currentPost = this.points[this.points.length - 2];
      //console.log(prevPost,currentPost);
      this.drawOnCanvas(prevPost, currentPost);
      //if (emit) {
        //this.socketWebService.emitEvent({ prevPost })
      //}

    }
  }

  private drawOnCanvas(prevPos: any, currentPost: any) {
    if (!this.cx) return;
    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPost.x, currentPost.y);
      this.cx.stroke();
    }
  }

  public clearZone = () => {
    this.isAvailabe = false;
    this.points = [];
    this.cx.clearRect(0, 0, this.width, this.height);
  }



  async grabar(){
    const canvasEl = this.canvasRef.nativeElement;
    console.log(canvasEl.toDataURL());
    let fileCanvas = await this.functionsService.base64ToBlob(canvasEl.toDataURL());
    console.log(fileCanvas);
    if(this.pointsValidate.length < 10  ){
      this.messageService.add({severity:'error', summary:'Error', detail:'Debe dibujar una figura de mas de 10 puntos'});
    }else{
      this.confirmationService.confirm({
        message: `¿Esta seguro de ${this.dataCanvas.accion=='create'?'grabar':'actualizar'} el dibujo?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          if(this.dataCanvas.accion=='update'){
             //Borrar firma del usuario
             let deleteFile$ = this.functionsService.deleteFiles({'entidad': this.dataCanvas.entidad,'id_relacion': this.dataCanvas.id_relacion,'proceso': this.dataCanvas.proceso});
             let deleteFile = await lastValueFrom(deleteFile$);
          }
          let body = new FormData();
          body.append('file', fileCanvas, this.dataCanvas.filename);
          body.append('entidad', this.dataCanvas.entidad);
          body.append('id_relacion', this.dataCanvas.id_relacion);
          body.append('proceso', this.dataCanvas.proceso);
          body.append('nombre',this.dataCanvas.filename);
  
          this.functionsService.uploadFile(body)
          .subscribe({
            next:(result)=>{
              ////console.log('Upload ok',result);
            
              this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Se ha cargado correctamente el anexo ${this.dataCanvas.filename}`});
              
            },
            error:(err)=>{
              this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrio un error al momento de subir el archivo :'+err});
            }
          })
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
    

    /**/

  }

  cerrar(){}
 

 

}
