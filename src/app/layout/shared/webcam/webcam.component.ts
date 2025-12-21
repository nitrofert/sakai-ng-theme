import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
  
})
// export class WebCamComponent implements OnInit, OnChanges {

//   @ViewChild('video', { static: true }) videoElement!: ElementRef;
//   @ViewChild('canvas', { static: true }) canvasElement!: ElementRef;
//   videoWidth = 0;
//   videoHeight = 0;

//   imagenDataURL:any;

  

//   @Input() loading!:boolean;
//   @Output() onSavePhoto: EventEmitter<any> = new EventEmitter();

//   constructor(private router:Router,) { }

//   ngOnInit(): void {
//     this.iniciarCamara();
//   }

//   ngOnChanges(changes: SimpleChanges) {
//    //console.log('cambios webcam',changes);
//    this.loading = changes['loading'].currentValue;
//   }

//   iniciarCamara() {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then((stream) => {
//           this.videoElement.nativeElement.srcObject = stream;
//           this.videoElement.nativeElement.play();
//         })
//         .catch((error) => {
//           console.error('Error al acceder a la cámara: ', error);
//         });
//     }
//   }
   
//   capturarFoto() {
//     const video = this.videoElement.nativeElement;
//     const canvas = this.canvasElement.nativeElement;
//     const contexto = canvas.getContext('2d');

//     // Establecer las dimensiones del canvas
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     // Dibujar el contenido del video en el canvas
//     contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Convertir la imagen del canvas a formato base64
//     const imagenDataURL = canvas.toDataURL('image/png');
//     this.imagenDataURL = imagenDataURL;
//    ////////console.log(imagenDataURL);  // Aquí puedes hacer algo con la imagen capturada
//   }

//   guadarFoto(){

//     const canvas = this.canvasElement.nativeElement;
//     this.loading = true;
//     canvas.toBlob((blob: any) => {
//       this.onSavePhoto.emit(blob);
//     });

//   }

// }

// export class WebCamComponent implements OnInit, 
//                                         //OnChanges, 
//                                         OnDestroy {
//   @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
//   @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;

//   videoWidth = 0;
//   videoHeight = 0;
//   imagenDataURL: string | null = null;

//   @Input() loading = false;
//   @Output() onSavePhoto = new EventEmitter<Blob>();

//   private stream: MediaStream | null = null;

//   ngOnInit(): void {
//     this.iniciarCamara();
//   }

// //   ngOnChanges(changes: SimpleChanges) {
// //   //console.log('cambios webcam', changes);
// //   this.loading = changes['loading'].currentValue;
// // }

//   iniciarCamara() {
//     if (navigator.mediaDevices?.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then((stream) => {
//           this.stream = stream;
//           this.videoElement.nativeElement.srcObject = stream;
//           this.videoElement.nativeElement.play();
//         })
//         .catch((error) => {
//           console.error('Error al acceder a la cámara: ', error);
//         });
//     }
//   }

//   capturarFoto() {
//     const video = this.videoElement.nativeElement;
//     const canvas = this.canvasElement.nativeElement;
//     const ctx = canvas.getContext('2d');

//     if (!ctx) return;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     this.imagenDataURL = canvas.toDataURL('image/png');
//   }

//   guardarFoto() {
//     const canvas = this.canvasElement.nativeElement;
//     canvas.toBlob((blob) => {
//       if (blob) {
//         this.onSavePhoto.emit(blob);
//       }
//     }, 'image/png');
//   }

//   ngOnDestroy(): void {
//     if (this.stream) {
//       this.stream.getTracks().forEach(track => track.stop());
//     }
//   }
// }


//import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

// @Component({
//   selector: 'app-web-cam',
//   template: `
//     <div>
//       <video #video autoplay playsinline></video>
//       <canvas #canvas hidden></canvas>
//     </div>
//     <div>
//       <button (click)="capturarFoto()">Capturar Foto</button>
//       <button (click)="guardarFoto()">Guardar Foto</button>
//       <button (click)="cambiarCamara()">Cambiar Cámara</button>
//     </div>
//     <img *ngIf="imagenDataURL" [src]="imagenDataURL" style="max-width:100%; margin-top:10px;" />
//   `,
//   styles: [`
//     video {
//       width: 100%;
//       border-radius: 8px;
//     }
//   `]
// })
export class WebCamComponent implements OnInit, OnDestroy {
  @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;

  videoWidth = 0;
  videoHeight = 0;
  imagenDataURL: string | null = null;

  @Input() loading = false;
  @Output() onSavePhoto = new EventEmitter<Blob>();

  private stream: MediaStream | null = null;
  private dispositivos: MediaDeviceInfo[] = [];
  private indiceCamara = 0;

 
  async ngOnInit(): Promise<void> {
    await this.obtenerDispositivos();
    this.iniciarCamara();
  }

  private async obtenerDispositivos() {
    const dispositivos = await navigator.mediaDevices.enumerateDevices();
    this.dispositivos = dispositivos.filter(d => d.kind === 'videoinput');
    //console.log('Cámaras detectadas:', this.dispositivos);
  }

  private async iniciarCamara(deviceId?: string) {
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'user' }
        });
        this.videoElement.nativeElement.srcObject = this.stream;
        await this.videoElement.nativeElement.play();
      } catch (error) {
        console.error('Error al acceder a la cámara: ', error);
      }
    }
  }

  async cambiarCamara() {
    if (this.dispositivos.length < 2) {
      console.warn('No hay múltiples cámaras disponibles');
      return;
    }

    // Detener stream actual
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }

    // Seleccionar la siguiente cámara
    this.indiceCamara = (this.indiceCamara + 1) % this.dispositivos.length;
    const nuevoDeviceId = this.dispositivos[this.indiceCamara].deviceId;

    //console.log('Cambiando a cámara:', this.dispositivos[this.indiceCamara].label);
    await this.iniciarCamara(nuevoDeviceId);
  }


  capturarFoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    this.imagenDataURL = canvas.toDataURL('image/png');
  }

  guardarFoto() {
    const canvas = this.canvasElement.nativeElement;
    canvas.toBlob((blob) => {
      if (blob) {
        this.onSavePhoto.emit(blob);
      }
    }, 'image/png');
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}
