import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListadoReportesComponent } from './listado-reportes/listado-reportes.component';
import { ListadoFacturasComponent } from './listado-facturas/listado-facturas.component';
import { MatrizNotificacionComponent } from './matriz-notificacion/matriz-notificacion.component';
import { PlacasCompartidasComponent } from './placas-compartidas/placas-compartidas.component';
import { ProgramacionBodegaComponent } from './programacion-bodega/programacion-bodega.component';
import { ProgramacionGerenciasComponent } from './programacion-gerencias/programacion-gerencias.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListadoReportesComponent },
        { path: 'facturas', component: ListadoFacturasComponent },
        { path: 'matriz-notificaciones', component: MatrizNotificacionComponent },
        { path: 'placas-compartidas', component: PlacasCompartidasComponent },
        { path: 'programacion-bodega', component: ProgramacionBodegaComponent },
        { path: 'programacion-gerencias', component: ProgramacionGerenciasComponent },
        //{ path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ReportesRoutingModule { }