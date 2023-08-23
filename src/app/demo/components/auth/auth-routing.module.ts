import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoggedInGuard } from './guard/logged-in.guard';
import { AuthGuard } from './guard/auth.guard';
import { AppLayoutComponent } from 'src/app/layout/app.layout.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
        { path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule) },
        { path: 'login',canActivate:[LoggedInGuard] , loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
        { path: 'forgot-password', canActivate:[LoggedInGuard] , loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
        { path: 'change-password', canActivate:[LoggedInGuard] , loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule) },
        { path: 'logout',component: AppLayoutComponent,canActivate:[AuthGuard] , loadChildren: () => import('./logout/logout.module').then(m => m.LogoutModule) },
        { path: 'perfil',component: AppLayoutComponent, canActivate:[AuthGuard] , loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule) },

        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
