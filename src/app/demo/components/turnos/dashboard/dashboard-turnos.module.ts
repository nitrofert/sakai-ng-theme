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
import { DependenciasService } from 'src/app/demo/service/dependencias.service';
import { LocalidadesService } from 'src/app/demo/service/localidades.service';
import { OrdenesCargueService } from 'src/app/demo/service/ordenes-cargue.service';
import { PedidosService } from 'src/app/demo/service/pedidos.service';
import { VehiculosService } from 'src/app/demo/service/vehiculos.service';
import { TipoVehiculosService } from 'src/app/demo/service/tipo-vehiculo.service';
import { ConductoresService } from 'src/app/demo/service/conductores.service';
import { TransportadorasService } from 'src/app/demo/service/transportadoras.service';
import { NovedadesService } from 'src/app/demo/service/novedades.service';
import { DynamicPdfModule } from 'src/app/layout/shared/dynamic-pdf/dynamic-pdf.module';



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
    DynamicChartsModule,
    DynamicPdfModule
    
  ],
  providers:[AlmacenesService,
             SolicitudTurnoService,
             LocalidadesService,
             DependenciasService,
             OrdenesCargueService, 
             PedidosService,
             VehiculosService,
             TipoVehiculosService, 
             ConductoresService,
             TransportadorasService,
             NovedadesService ],
  exports:[DashboardComponentTurno]
})
export class DashboardTurnosModule { }
