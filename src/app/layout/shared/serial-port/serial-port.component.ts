import { Component } from '@angular/core';

@Component({
  selector: 'app-serial-port',
//   template: `
//     <button (click)="connectSerial()">Conectar a Dispositivo Serial</button>
//     <div *ngIf="data">
//       <h3>Datos Recibidos:</h3>
//       <p>{{ data }}</p>
//     </div>
//   `,
templateUrl:'./serial-port.component.html'
})
export class SerialPortComponent {
  port: SerialPort | undefined;
  data: string = '';

  async connectSerial() {
    try {
      // Solicita al usuario que seleccione un dispositivo serial
      this.port = await (navigator as any).serial.requestPort();
      // Configura la conexión (define la velocidad en baudios, etc.)
      await this.port.open({ baudRate: 9600 });
     //////console.log('Conectado al puerto serial');

      // Lee datos en un bucle
      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        this.data += value;
      }
    } catch (error) {
      console.error('Error conectando al puerto serial:', error);
    }
  }
}