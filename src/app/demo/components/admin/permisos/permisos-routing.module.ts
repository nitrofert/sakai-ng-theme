import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormPermisosComponent } from './form-permisos/form-permisos.component';
import { PermisosComponent } from './permisos.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PermisosComponent },
        { path: 'nuevo', component: FormPermisosComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PermisosRoutingModule { }