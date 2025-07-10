import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListadoFacturasComponent } from '../reportes/listado-facturas/listado-facturas.component';
import { CargueSoporteFacturasComponent } from './cargue-soportes-facturas/cargue-soportes-facturas.component';


@NgModule({
    imports: [RouterModule.forChild([
        //{ path: '', component: ListadoReportesComponent },
        { path: 'facturas', component: ListadoFacturasComponent },
        { path: 'cargar-soportes', component: CargueSoporteFacturasComponent },
        // { path: 'placas-compartidas', component: PlacasCompartidasComponent },
        // { path: 'programacion-bodega', component: ProgramacionBodegaComponent },
        // { path: 'programacion-gerencias', component: ProgramacionGerenciasComponent },
        // { path: 'pedidos-abiertos', component: PedidosAbiertosComponent },
        // { path: 'inventario-bodega', component: InventarioBodegaComponent },
       
        // { path: 'consolidados-rango-fecha', component: ConsolidadosRangoFechaComponent },
        // { path: 'novedades', component: NovedadesComponent },
        // { path: 'toneldas-adicionales', component: ToneladasAdicionalesComponent },
        // { path: 'incumplimientos-turnos', component: IncumplimientosTurnosComponent },
        // { path: 'comportamiento-bodegas', component: ComportamientoBodegasComponent },
        // { path: 'tiempo-acciones-turno', component: TiempoAccionesTurnoComponent },


        //{ path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class FinanzasRoutingModule { }