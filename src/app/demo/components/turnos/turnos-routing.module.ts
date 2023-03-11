import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarioTurnosComponent } from './calendario-turnos/calendario-turnos.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CalendarioTurnosComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class TurnosRoutingModule { }