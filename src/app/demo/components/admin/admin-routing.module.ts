import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormMenuComponent } from './menu/form-menu/form-menu.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule) },
        { path: 'acciones', loadChildren: () => import('./acciones/acciones.module').then(m => m.AccionesModule) },
        { path: 'permisos', loadChildren: () => import('./permisos/permisos.module').then(m => m.PermisosModule) },
        { path: 'usuarios', loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule) },
    ])],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
