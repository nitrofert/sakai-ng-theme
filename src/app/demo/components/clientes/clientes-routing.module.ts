import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { FormClienteComponent } from './form-cliente/form-cliente.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ClientesComponent },
        { path: 'nueva', component: FormClienteComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ClientesRoutingModule { }