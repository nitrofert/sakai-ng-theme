import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginByTokenRoutingModule } from './login-by-token-routing.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginByTokenComponent } from './login-by-token.component';



@NgModule({
  
  imports: [
    CommonModule,
    LoginByTokenRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule
  ],
  declarations: [LoginByTokenComponent],
})
export class LoginByTokenModule { }
