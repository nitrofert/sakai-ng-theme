import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';
import { UsuariosComponent } from './usuarios.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: UsuariosComponent },
        { path: 'nuevo', component: FormUsuarioComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UsuariosRoutingModule { }