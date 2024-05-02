import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicUploadComponent } from './dynamic-upload.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { FunctionsService } from 'src/app/demo/service/functions.service';



@NgModule({
  declarations: [
    DynamicUploadComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ApplicationPipesModule,
    FormsModule

  ],
  providers:[FunctionsService],
  exports:[DynamicUploadComponent]
})
export class DynamicUploadModule { }
