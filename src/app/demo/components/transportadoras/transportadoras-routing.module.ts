import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormTransportadoraComponent } from './form-transportadora/form-transportadora.component';
import { TransportadorasComponent } from './transportadoras.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TransportadorasComponent },
        { path: 'nuevo', component: FormTransportadoraComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class TransportadorasRoutingModule { }