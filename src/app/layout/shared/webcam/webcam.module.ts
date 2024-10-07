import { NgModule } from '@angular/core';
import { PrimengModule } from '../primeng/primeng.module';
import {  WebCamComponent } from './webcam.component';




@NgModule({
    declarations:[
        WebCamComponent
    ],
    exports:[
        WebCamComponent
    ],
    imports:[
        PrimengModule
    ]
})
export class WebCamModule { }
