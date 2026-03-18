import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { ConsultaMpRoutingModule } from './consulta-mp-routing.module';
import { ConsultaMpComponent } from './consulta-mp.component';

@NgModule({
    imports: [
        CommonModule,
        ConsultaMpRoutingModule,
        DividerModule,
        StyleClassModule,
        ChartModule,
        PanelModule,
        ButtonModule
    ],
    declarations: [ConsultaMpComponent]
})
export class LandingModule { }
