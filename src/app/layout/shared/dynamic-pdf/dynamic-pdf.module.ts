import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../primeng/primeng.module';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { DynamicPdfComponent } from './dynamic-pdf.component';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { MessageService } from 'primeng/api';



@NgModule({
  declarations: [
    DynamicPdfComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ApplicationPipesModule,
    FormsModule

  ],
  providers:[FunctionsService, MessageService],
  exports:[DynamicPdfComponent]
})
export class DynamicPdfModule { }
