import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListadoSolicitudesComponent } from './listado-solicitudes/listado-solicitudes.component';
import { NuevaSolicitudComponent } from './nueva-solicitud/nueva-solicitud.component';
import { NuevaSolicitudEntregaComponent } from './nueva-solicitud-entrega/nueva-solicitud-entrega.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListadoSolicitudesComponent },
        { path: 'nuevo-retiro', component: NuevaSolicitudComponent },
        { path: 'nueva-entrega', component: NuevaSolicitudEntregaComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class SolicitudescargueRoutingModule { }