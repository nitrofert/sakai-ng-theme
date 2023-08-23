import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListadoReportesComponent } from './listado-reportes/listado-reportes.component';
import { ListadoFacturasComponent } from './listado-facturas/listado-facturas.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListadoReportesComponent },
        { path: 'facturas', component: ListadoFacturasComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ReportesRoutingModule { }