import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListadoSolicitudesComponent } from './listado-solicitudes/listado-solicitudes.component';
import { NuevaSolicitudComponent } from './nueva-solicitud/nueva-solicitud.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListadoSolicitudesComponent },
        { path: 'nueva', component: NuevaSolicitudComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class SolicitudescargueRoutingModule { }