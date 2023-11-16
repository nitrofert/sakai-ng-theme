import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { ChangePasswordComponent } from '../auth/change-password/change-password.component';
import { ChangePasswordModule } from '../auth/change-password/change-password.module';
import { DialogService } from 'primeng/dynamicdialog';
import { DashboardComponentTurno } from '../turnos/dashboard/dashboard.component';
import { TurnosModule } from '../turnos/turnos.module';
import { DashboardTurnosModule } from '../turnos/dashboard/dashboard-turnos.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        DashboardsRoutingModule,
        PrimengModule,
        ChangePasswordModule,
        DashboardTurnosModule
    ],
    declarations: [DashboardComponent],
    providers: [DialogService]
})
export class DashboardModule { }
