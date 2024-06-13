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

    flag = false; 
    prevX = 0; 
    currX = 0; 
    prevY = 0; 
    currY = 0; 
    dot_flag = false;
    x = "black"; 
    y = 2;

    private isDrawing = false;
    private lastX = 0;
    private lastY = 0;

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

    /*

    @HostListener('document:mousedown', ['$event'])
      onMouseDown(e: any) { //MouseEvent on any
        // Tu lógica aquí
        if (e.target.id === 'canvasDraw' && e.target.getAttribute("draggable")) {
          this.messageService.add({severity:'success', summary: 'Confirmación', detail:  `Toque start ${e.type}`});
          console.log('Clic down detectado', e);
          this.isAvailabe = true;
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

    
    @HostListener('document:mouseup', ['$event'])
    onMouseUp(e: any) { // MouseEvent on any
      // Tu lógica aquí
      if (e.target.id === 'canvasDraw' ) {
        console.log('Clic up detectado', e);
        this.messageService.add({severity:'info', summary: 'Confirmación', detail:  `Toque end ${e.type}`});
        this.isAvailabe = false;
        this.pointsValidate = JSON.parse(JSON.stringify(this.points));
        this.points = [];
      }
  }*/

   

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

    /*@HostListener("document:mousemove", ["$event"])
    onMouseMove(event: MouseEvent) {
      if (this.cx && this.isAvailabe) {
        const x = event.clientX - this.canvasRef.nativeElement.getBoundingClientRect().left;
        const y = event.clientY - this.canvasRef.nativeElement.getBoundingClientRect().top;
        this.cx.lineTo(x, y);
        this.cx.stroke();
      }
    }
  
    @HostListener("document:mousedown", ["$event"])
    onMouseDown(event: MouseEvent) {
      if (this.cx) {
        this.cx.beginPath();
        this.cx.moveTo(
          event.clientX - this.canvasRef.nativeElement.getBoundingClientRect().left,
          event.clientY - this.canvasRef.nativeElement.getBoundingClientRect().top
        );
        this.isAvailabe = true;
      }
    }*/

    /*


    @HostListener("document:mousemove", ["$event"])
    onMouseMove(event: MouseEvent) {
      if (this.cx) {
          this.findxy('move',event)
      }
    }
  
    @HostListener("document:mousedown", ["$event"])
    onMouseDown(event: MouseEvent) {
      if (this.cx) {
        this.findxy('down',event)
      }
    }

    @HostListener("document:mouseup", ["$event"])
    onMouseUp(event: MouseEvent) {
      if (this.cx) {
        this.findxy('up',event)
      }
    }

    
    @HostListener("document:mouseout", ["$event"])
    onMouseOut(event: MouseEvent) {
      if (this.cx) {
        this.findxy('out',event)
      }
    }

    @HostListener('touchmove', ['$event'])
    onTouchMove(event: TouchEvent) { //TouchEvent on any
        // Tu lógica aquí
       // console.log('Movimiento de toque detectado', event);
       //event.preventDefault();
       event.preventDefault();
      
       
        
    }
*/
    

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
  /*
    canvasEl.addEventListener("mousemove",  (e:any)=> { this.findxy('move', e) }, false);
    canvasEl.addEventListener("mousedown",  (e:any)=> { this.findxy('down', e) }, false);
    canvasEl.addEventListener("mouseup", (e:any)=> { this.findxy('up', e) }, false);
    canvasEl.addEventListener("mouseout", (e:any)=> { this.findxy('out', e) }, false);
    */
  }

  /*
  private  draw() {
    this.cx.beginPath();
    this.cx.moveTo(this.prevX, this.prevY);
    this.cx.lineTo(this.currX, this.currY);
    //console.log(this.currX, this.currY);
    //this.cx.strokeStyle = this.x;
    //this.cx.lineWidth = this.y;
    this.cx.stroke();
    this.cx.closePath();
}

private findxy(res:string, e:MouseEvent) {
    const canvasEl = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    if (res == 'down') {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = e.clientX - rect.left;
      this.currY = e.clientY - rect.top;
      this.flag = true;
      this.dot_flag = true;
        if (this.dot_flag) {
          this.cx.beginPath();
          //this.cx.fillStyle = this.x;
          this.cx.fillRect(this.currX, this.currY, 2, 2);
          this.cx.closePath();
          this.dot_flag = false;
        }
    }
    if (res == 'up' || res == "out") {
      this.flag = false;
    }
    if (res == 'move') {
        if (this.flag) {
          this.prevX = this.currX;
          this.prevY = this.currY;
          this.currX = e.clientX - rect.left;
          this.currY = e.clientY - rect.top;
          
          this.draw();
        }
    }
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


  */

  handleMouseDown(e: any) {
    const canvasEl = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    this.isDrawing = true;
    this.lastX = e.clientX - rect.left;
    this.lastY = e.clientY - rect.top;
  }

  handleMouseMove(e: any) {
    const canvasEl = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    if (!this.isDrawing) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.draw(x, y);
  }

  handleMouseUp(e:any) {
    this.isDrawing = false;
  }

  handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    this.handleMouseDown(touch);
  }

  handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    this.handleMouseMove(touch);
  }

  handleTouchEnd(e:any) {
    this.isDrawing = false;
  }

  draw(x: number, y: number) {
    this.cx.beginPath();
    this.cx.moveTo(this.lastX, this.lastY);
    this.cx.lineTo(x, y);
    this.cx.stroke();
    this.lastX = x;
    this.lastY = y;
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
    /*if(this.pointsValidate.length < 10  ){
      this.messageService.add({severity:'error', summary:'Error', detail:'Debe dibujar una figura de mas de 10 puntos'});
    }else{
      
    }*/

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
    

    /**/

  }

  cerrar(){}
 

 

}
