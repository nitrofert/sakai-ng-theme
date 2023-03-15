import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormMenuComponent } from './form-menu/form-menu.component';
import { MenuComponent } from './menu.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MenuComponent },
        { path: 'nuevo', component: FormMenuComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class MenuRoutingModule { }