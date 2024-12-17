import { NgModule } from '@angular/core';
import { PrimengModule } from '../primeng/primeng.module';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SerialPortComponent } from './serial-port.component';




@NgModule({
    declarations:[
        SerialPortComponent
    ],
    exports:[
        SerialPortComponent
    ],
    imports:[
         CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        PrimengModule
    ]
})
export class SerialPortModule { }
