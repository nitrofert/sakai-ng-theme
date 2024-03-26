import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConductoresComponent } from './conductores.component';
import { FormConductorComponent } from './form-conductor/form-conductor.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimengModule } from '../../../layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from '../../../layout/shared/breadcrumb/app.breadcrumb.module';
import { ApplicationPipesModule } from '../../pipes/pipes.module';
import { ConductoresRoutingModule } from './conductores-routing.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConductoresService } from '../../service/conductores.service';




@NgModule({
  declarations: [
    ConductoresComponent,
    FormConductorComponent
  ],
  imports: [
    CommonModule,
    ConductoresRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationPipesModule,
    DynamicTableModule
  ],
  providers:[DialogService,ConfirmationService,MessageService,ConductoresService]
    
})
export class ConductoresModule { }
