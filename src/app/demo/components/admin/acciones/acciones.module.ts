import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccionesComponent } from './acciones.component';
import { FormAccionesComponent } from './form-acciones/form-acciones.component';
import { AccionesRoutingModule } from './acciones-routing.module';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { DialogService } from 'primeng/dynamicdialog';



@NgModule({
  declarations: [
    AccionesComponent,
    FormAccionesComponent
  ],
  imports: [
    CommonModule,
    AccionesRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationPipesModule,
    DynamicTableModule,
  ],
  providers:[DialogService]
})
export class AccionesModule { }
