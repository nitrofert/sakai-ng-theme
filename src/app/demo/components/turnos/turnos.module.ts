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
import { VistaEstadosTurnoComponent } from './vista-estados-turno/vista-estados-turno.component';
import { DashboardComponentTurno } from './dashboard/dashboard.component';
import { DynamicChartsModule } from 'src/app/layout/shared/dynamic-charts/dynamic-charts.module';
import { DynamicPdfModule } from 'src/app/layout/shared/dynamic-pdf/dynamic-pdf.module';
import { PdfSolicitudCargue } from '../solicitudescargue/config-pdf/solicitud-cargue';
import { InspeccionDespachoComponent } from './inspeccion-despacho/inspeccion-despacho.component';
import { DynamicDrawModule } from 'src/app/layout/shared/dynamic-draw/dynamic-draw.module';
import { DynamicUploadModule } from 'src/app/layout/shared/dynamic-upload/dynamic-upload.module';
import { PdfInspeccionCargue } from '../solicitudescargue/config-pdf/inspeccion-cargue';
import { FletesTptComponent } from './fletes-tpt/fletes-tpt.component';
import { ListadoFletesComponent } from './listado-fletes/listado-fletes.component';
import { DocumentosTurnoComponent } from './documentos-turno/documentos-turno.component';
import { PdfOrdenCargue } from '../solicitudescargue/config-pdf/orden-cargue';
import { WebCamModule } from 'src/app/layout/shared/webcam/webcam.module';
import { RemisionesComponent } from './remisiones/remisiones.component';
import { UsbPortModule } from 'src/app/layout/shared/usb-port/usb-port.module';
import { PdfRemision } from '../solicitudescargue/config-pdf/remision';



@NgModule({
  declarations: [
    CalendarioTurnosComponent,
    FormTurnoComponent,
    VistaEstadosTurnoComponent,
    InspeccionDespachoComponent,
    DocumentosTurnoComponent,
    RemisionesComponent
    
    
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
    DynamicPdfModule,
    DynamicDrawModule,
    DynamicUploadModule,
    UsbPortModule
    
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
             NovedadesService,
             PdfSolicitudCargue,
             PdfInspeccionCargue,
             PdfOrdenCargue,
             PdfRemision],
  
})
export class TurnosModule { }
