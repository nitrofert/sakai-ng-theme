import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { ApplicationPipesModule } from '../../pipes/pipes.module';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ListadoReportesComponent } from './listado-reportes/listado-reportes.component';
import { ListadoFacturasComponent } from './listado-facturas/listado-facturas.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { FormFacturaComponent } from './form-factura/form-factura.component';
import { MatrizNotificacionComponent } from './matriz-notificacion/matriz-notificacion.component';
import { MatrizNotificacionService } from '../../service/matriz-notificacion.service';
import { SolicitudTurnoService } from '../../service/solicitudes-turno.service';
import { PlacasCompartidasComponent } from './placas-compartidas/placas-compartidas.component';
import { MessageService } from 'primeng/api';
import { AlmacenesService } from '../../service/almacenes.service';
import { UsuarioService } from '../../service/usuario.service';
import { FunctionsService } from '../../service/functions.service';
import { ProgramacionBodegaComponent } from './programacion-bodega/programacion-bodega.component';
import { DynamicChartsModule } from 'src/app/layout/shared/dynamic-charts/dynamic-charts.module';
import { LocalidadesService } from '../../service/localidades.service';
import { DependenciasService } from '../../service/dependencias.service';
import { ProgramacionGerenciasComponent } from './programacion-gerencias/programacion-gerencias.component';
import { PedidosAbiertosComponent } from './pedidos-abiertos/pedidos-abiertos.component';
import { PedidosService } from '../../service/pedidos.service';
import { InventarioBodegaComponent } from './inventario-bodega/inventario-bodega.component';
import { NovedadesComponent } from './novedades/novedades.component';
import { NovedadesService } from '../../service/novedades.service';
import { ConsolidadosRangoFechaComponent } from './consolidados-rango-fecha/consolidados-rango-fecha.component';
import { ToneladasAdicionalesComponent } from './toneladas-adicionales/toneladas-adicionales.component';
import { IncumplimientosTurnosComponent } from './incumplimientos-turnos/incumplimientos-turnos.component';



@NgModule({
  declarations: [
    ListadoReportesComponent,
    ListadoFacturasComponent,
    FormFacturaComponent,
    MatrizNotificacionComponent,
    PlacasCompartidasComponent,
    ProgramacionBodegaComponent,
    ProgramacionGerenciasComponent,
    PedidosAbiertosComponent,
    InventarioBodegaComponent,
    NovedadesComponent,
    ConsolidadosRangoFechaComponent,
    ToneladasAdicionalesComponent,
    IncumplimientosTurnosComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    BreadCrumbModule,
    DynamicTableModule,
    ApplicationPipesModule,
    PrimengModule,
    FormsModule,
    DynamicChartsModule
  ],
  providers:[DialogService,
             MessageService,
             FunctionsService,
             MatrizNotificacionService,
             SolicitudTurnoService, 
             AlmacenesService,
             UsuarioService,
             LocalidadesService,
             DependenciasService,
             PedidosService,
             NovedadesService,
            ],
  exports:[
    NovedadesComponent,
    ToneladasAdicionalesComponent,
    IncumplimientosTurnosComponent
  ]
})
export class ReportesModule { }
