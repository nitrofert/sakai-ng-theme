import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { BasicChartComponent } from './basic-chart/basic-chart.component';



@NgModule({
  declarations: [
    PieChartComponent,
    DoughnutChartComponent,
    BasicChartComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    ApplicationPipesModule,
    FormsModule
  ],
  exports:[PieChartComponent,DoughnutChartComponent,BasicChartComponent]
})
export class DynamicChartsModule { }
