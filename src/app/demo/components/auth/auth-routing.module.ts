import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoggedInGuard } from './guard/logged-in.guard';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'error', loadChildren: () => import('./error/error.module').then(m => m.ErrorModule) },
        { path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule) },
        { path: 'login',canActivate:[LoggedInGuard] , loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
        { path: 'forgot-password', canActivate:[LoggedInGuard] , loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
        { path: 'change-password', canActivate:[LoggedInGuard] , loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
