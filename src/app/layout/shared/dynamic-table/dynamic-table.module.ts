import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import { PrimengModule } from '../../primeng.module';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { FormsModule } from '@angular/forms';



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
  exports:[DynamicTableComponent]
})
export class DynamicTableModule { }
