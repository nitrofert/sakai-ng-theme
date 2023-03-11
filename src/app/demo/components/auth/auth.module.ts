import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { PrimengModule } from 'src/app/layout/primeng.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        PrimengModule,
        FormsModule
    ],
    declarations: []
})
export class AuthModule { }
