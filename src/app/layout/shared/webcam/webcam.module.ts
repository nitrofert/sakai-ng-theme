import { NgModule } from '@angular/core';
import { PrimengModule } from '../primeng/primeng.module';
import {  WebCamComponent } from './webcam.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
    declarations:[
        WebCamComponent
    ],
    exports:[
        WebCamComponent
    ],
    imports:[
         CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        PrimengModule
    ]
})
export class WebCamModule { }
