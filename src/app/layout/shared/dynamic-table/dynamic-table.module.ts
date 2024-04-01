import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { FunctionsService } from 'src/app/demo/service/functions.service';



@NgModule({
  declarations: [
    DynamicTableComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ApplicationPipesModule,
    FormsModule

  ],
  providers:[FunctionsService],
  exports:[DynamicTableComponent]
})
export class DynamicTableModule { }
