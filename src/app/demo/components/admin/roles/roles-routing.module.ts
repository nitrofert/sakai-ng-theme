import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormRolesComponent } from './form-roles/form-roles.component';
import { RolesComponent } from './roles.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RolesComponent },
        { path: 'nuevo', component: FormRolesComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class RolesRoutingModule { }