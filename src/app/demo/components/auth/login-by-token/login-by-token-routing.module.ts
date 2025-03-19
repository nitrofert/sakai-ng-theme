import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {  LoginByTokenComponent } from './login-by-token.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LoginByTokenComponent }
    ])],
    exports: [RouterModule]
})
export class LoginByTokenRoutingModule { }
