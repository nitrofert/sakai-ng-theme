import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccionesComponent } from './acciones.component';
import { FormAccionesComponent } from './form-acciones/form-acciones.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AccionesComponent },
        { path: 'nuevo', component: FormAccionesComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AccionesRoutingModule { }