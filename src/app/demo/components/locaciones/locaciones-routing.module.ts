import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocacionesComponent } from './locaciones.component';
import { FormLocacionComponent } from './form-locacion/form-locacion.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LocacionesComponent },
        { path: 'nueva', component: FormLocacionComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class LocacionesRoutingModule { }