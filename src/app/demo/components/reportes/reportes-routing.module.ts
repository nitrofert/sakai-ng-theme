import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListadoReportesComponent } from './listado-reportes/listado-reportes.component';
import { ListadoFacturasComponent } from './listado-facturas/listado-facturas.component';
import { MatrizNotificacionComponent } from './matriz-notificacion/matriz-notificacion.component';
import { PlacasCompartidasComponent } from './placas-compartidas/placas-compartidas.component';
import { ProgramacionBodegaComponent } from './programacion-bodega/programacion-bodega.component';
import { ProgramacionGerenciasComponent } from './programacion-gerencias/programacion-gerencias.component';
import { PedidosAbiertosComponent } from './pedidos-abiertos/pedidos-abiertos.component';
import { InventarioBodegaComponent } from './inventario-bodega/inventario-bodega.component';
import { NovedadesComponent } from './novedades/novedades.component';
import { ConsolidadosRangoFechaComponent } from './consolidados-rango-fecha/consolidados-rango-fecha.component';
import { ToneladasAdicionalesComponent } from './toneladas-adicionales/toneladas-adicionales.component';
import { IncumplimientosTurnosComponent } from './incumplimientos-turnos/incumplimientos-turnos.component';
import { ComportamientoBodegasComponent } from './comportamiento-bodegas/comportamiento-bodegas.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListadoReportesComponent },
        { path: 'facturas', component: ListadoFacturasComponent },
        { path: 'matriz-notificaciones', component: MatrizNotificacionComponent },
        { path: 'placas-compartidas', component: PlacasCompartidasComponent },
        { path: 'programacion-bodega', component: ProgramacionBodegaComponent },
        { path: 'programacion-gerencias', component: ProgramacionGerenciasComponent },
        { path: 'pedidos-abiertos', component: PedidosAbiertosComponent },
        { path: 'inventario-bodega', component: InventarioBodegaComponent },
       
        { path: 'consolidados-rango-fecha', component: ConsolidadosRangoFechaComponent },
        { path: 'novedades', component: NovedadesComponent },
        { path: 'toneldas-adicionales', component: ToneladasAdicionalesComponent },
        { path: 'incumplimientos-turnos', component: IncumplimientosTurnosComponent },
        { path: 'comportamiento-bodegas', component: ComportamientoBodegasComponent },


        //{ path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ReportesRoutingModule { }