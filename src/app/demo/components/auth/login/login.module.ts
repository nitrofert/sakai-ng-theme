import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { PrimengModule } from 'src/app/layout/primeng.module';

@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        //ButtonModule,
        //CheckboxModule,
        //InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        //PasswordModule,
        PrimengModule,

    ],
    declarations: [LoginComponent]
})
export class LoginModule { }
