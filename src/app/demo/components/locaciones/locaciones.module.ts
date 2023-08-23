import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocacionesComponent } from './locaciones.component';
import { FormLocacionComponent } from './form-locacion/form-locacion.component';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationPipesModule } from '../../pipes/pipes.module';
import { LocacionesRoutingModule } from './locaciones-routing.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlmacenesService } from '../../service/almacenes.service';
import { DialogService } from 'primeng/dynamicdialog';



@NgModule({
  declarations: [
    LocacionesComponent,
    FormLocacionComponent
  ],
  imports: [
    CommonModule,
    LocacionesRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationPipesModule,
    DynamicTableModule,
  ],
  providers:[DialogService,ConfirmationService,MessageService, AlmacenesService]
})
export class LocacionesModule { }
