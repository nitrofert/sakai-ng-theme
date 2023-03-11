import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConductoresComponent } from './conductores.component';
import { FormConductorComponent } from './form-conductor/form-conductor.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ConductoresComponent },
        { path: 'nuevo', component: FormConductorComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ConductoresRoutingModule { }