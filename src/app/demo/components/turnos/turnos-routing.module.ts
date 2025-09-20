import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CalendarioTurnosComponent } from './calendario-turnos/calendario-turnos.component';
import { TurnosMovilComponent } from './vista-movil-turno/turnos-movil';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CalendarioTurnosComponent },
        { path: 'movil', component: TurnosMovilComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class TurnosRoutingModule { }