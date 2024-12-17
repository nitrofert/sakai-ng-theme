import { NgModule } from '@angular/core';
import { PrimengModule } from '../primeng/primeng.module';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { USBPortComponent } from './usb-port.component';




@NgModule({
    declarations:[
        USBPortComponent
    ],
    exports:[
        USBPortComponent
    ],
    imports:[
         CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        PrimengModule
    ]
})
export class UsbPortModule { }
