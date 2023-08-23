import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ApplicationPipesModule } from '../../pipes/pipes.module';
import { TurnosRoutingModule } from './turnos-routing.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';

import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenesService } from '../../service/almacenes.service';
import { OrdenesCargueService } from '../../service/ordenes-cargue.service';

import { FormTurnoComponent } from './form-turno/form-turno.component';
import { CalendarioTurnosComponent } from './calendario-turnos/calendario-turnos.component';
import { SolicitudTurnoService } from '../../service/solicitudes-turno.service';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { PedidosService } from '../../service/pedidos.service';
import { VehiculosService } from '../../service/vehiculos.service';
import { ConductoresService } from '../../service/conductores.service';
import { TransportadorasService } from '../../service/transportadoras.service';
import { TipoVehiculosService } from '../../service/tipo-vehiculo.service';
import { NovedadesService } from '../../service/novedades.service';



@NgModule({
  declarations: [
    CalendarioTurnosComponent,
    FormTurnoComponent
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
    ApplicationPipesModule,
    DynamicTableModule,
    
  ],
  providers:[AlmacenesService, 
             DialogService,
             OrdenesCargueService, 
             SolicitudTurnoService, 
             PedidosService, 
             VehiculosService,
             TipoVehiculosService, 
             ConductoresService,
             TransportadorasService,
             NovedadesService]
})
export class TurnosModule { }
