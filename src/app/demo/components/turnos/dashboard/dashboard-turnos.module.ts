import { NgModule } from '@angular/core';

import { AlmacenesService } from 'src/app/demo/service/almacenes.service';
import { DashboardComponentTurno } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { DynamicChartsModule } from 'src/app/layout/shared/dynamic-charts/dynamic-charts.module';



@NgModule({
  declarations: [
  
    DashboardComponentTurno
  ],
  imports: [
    CommonModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    DynamicTableModule,
    DynamicChartsModule
    
  ],
  providers:[AlmacenesService,SolicitudTurnoService],
  exports:[DashboardComponentTurno]
})
export class DashboardTurnosModule { }
