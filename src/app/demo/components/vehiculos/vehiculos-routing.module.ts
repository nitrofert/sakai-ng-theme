import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormConductorComponent } from '../conductores/form-conductor/form-conductor.component';
import { FormTipoVehiculoComponent } from './form-tipo-vehiculo/form-tipo-vehiculo.component';
import { FormVehiculoComponent } from './form-vehiculo/form-vehiculo.component';

import { VehiculosComponent } from './vehiculos.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: VehiculosComponent },
        { path: 'nuevo', component: FormConductorComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class VehiculosRoutingModule { }