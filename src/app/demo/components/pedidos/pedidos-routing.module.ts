import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListadoPedidosComponent } from './listado-pedidos/listado-pedidos.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListadoPedidosComponent },
        // { path: 'nuevo-retiro', component: NuevaSolicitudComponent },
        // { path: 'nueva-entrega', component: NuevaSolicitudEntregaComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PedidosRoutingModule { }