import { Component } from '@angular/core';

@Component({
  selector: 'app-usb-port',
//   template: `
//     <button (click)="connectUSB()">Conectar a Dispositivo USB</button>
//     <div *ngIf="data">
//       <h3>Datos Recibidos:</h3>
//       <p>{{ data }}</p>
//     </div>
//   `,
 templateUrl:'./usb-port.component.html'
})
export class USBPortComponent {
  data: string = '';

  async connectUSB() {
    try {
      // Solicita al usuario que seleccione un dispositivo USB
     //console.log(await (navigator as any).usb)
      const device = await (navigator as any).usb.requestDevice({ filters: [{ vendorId: 0x2341 }] });
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

     //console.log('Dispositivo USB conectado:', device.productName);

      // Ejemplo de lectura de datos
      const result = await device.transferIn(5, 64); // Lee desde el endpoint 5
      this.data = new TextDecoder().decode(result.data);
    } catch (error) {
      console.error('Error conectando al dispositivo USB:', error);
    }
  }
}