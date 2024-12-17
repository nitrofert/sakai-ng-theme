import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  //styleUrls: ['./breadcrumb.component.scss']
})
export class WebCamComponent implements OnInit, OnChanges {

  @ViewChild('video', { static: true }) videoElement!: ElementRef;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef;
  videoWidth = 0;
  videoHeight = 0;

  imagenDataURL:any;

  

  @Input() loading!:boolean;
  @Output() onSavePhoto: EventEmitter<any> = new EventEmitter();

  constructor(private router:Router,) { }

  ngOnInit(): void {
    this.iniciarCamara();
  }

  ngOnChanges(changes: SimpleChanges) {
   //console.log('cambios webcam',changes);
  }

  iniciarCamara() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.videoElement.nativeElement.srcObject = stream;
          this.videoElement.nativeElement.play();
        })
        .catch((error) => {
          console.error('Error al acceder a la cámara: ', error);
        });
    }
  }
   
  capturarFoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const contexto = canvas.getContext('2d');

    // Establecer las dimensiones del canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibujar el contenido del video en el canvas
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir la imagen del canvas a formato base64
    const imagenDataURL = canvas.toDataURL('image/png');
    this.imagenDataURL = imagenDataURL;
   //console.log(imagenDataURL);  // Aquí puedes hacer algo con la imagen capturada
  }

  guadarFoto(){

    const canvas = this.canvasElement.nativeElement;
    this.loading = true;
    canvas.toBlob((blob: any) => {
      this.onSavePhoto.emit(blob);
    });

  }

}
