import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListadoOrdenesComponent } from './listado-ordenes/listado-ordenes.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ListadoOrdenesComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class OrdenescargueRoutingModule { }