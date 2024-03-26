import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoSolicitudesComponent } from './listado-solicitudes/listado-solicitudes.component';
import { NuevaSolicitudComponent } from './nueva-solicitud/nueva-solicitud.component';
import { SolicitudescargueRoutingModule } from './solicitudescargue-routing.module';
import { BreadCrumbModule } from '../../../layout/shared/breadcrumb/app.breadcrumb.module';
import { DynamicTableModule } from '../../../layout/shared/dynamic-table/dynamic-table.module';
import { PrimengModule } from '../../../layout/shared/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlmacenesService } from '../../service/almacenes.service';
import { PedidosService } from '../../service/pedidos.service';
import { VehiculosService } from '../../service/vehiculos.service';
import { ConductoresService } from '../../service/conductores.service';
import { OrdenesCargueService } from '../../service/ordenes-cargue.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TipoVehiculosService } from '../../service/tipo-vehiculo.service';
import { TransportadorasService } from '../../service/transportadoras.service';
import { PermisosFunction } from 'src/app/layout/shared/functions/permisos.functions';
import { SolicitudTurnoService } from '../../service/solicitudes-turno.service';
import { FunctionsService } from '../../service/functions.service';
import { NovedadesService } from '../../service/novedades.service';
import { ListaHistorialTurnoComponent } from './lista-historial-turno/lista-historial-turno.component';
import { CiudadesService } from '../../service/ciudades.service';
import { LocalidadesService } from '../../service/localidades.service';
import { DependenciasService } from '../../service/dependencias.service';
import { DynamicPdfModule } from 'src/app/layout/shared/dynamic-pdf/dynamic-pdf.module';



@NgModule({
  declarations: [
    ListadoSolicitudesComponent,
    NuevaSolicitudComponent,
    ListaHistorialTurnoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SolicitudescargueRoutingModule,
    BreadCrumbModule,
    DynamicTableModule,
    PrimengModule,
    ReactiveFormsModule,
    DynamicPdfModule
  ],
  providers:[ AlmacenesService,
              PedidosService,
              VehiculosService,
              ConductoresService,
              OrdenesCargueService,
              DialogService,
              TipoVehiculosService,
              TransportadorasService,
              PermisosFunction,
              SolicitudTurnoService,
              FunctionsService,
              NovedadesService,
              CiudadesService,
              LocalidadesService,
              DependenciasService
   ]
})
export class SolicitudescargueModule { }
