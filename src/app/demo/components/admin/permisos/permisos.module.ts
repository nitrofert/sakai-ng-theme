import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermisosComponent } from './permisos.component';
import { FormPermisosComponent } from './form-permisos/form-permisos.component';
import { PermisosRoutingModule } from './permisos-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { DialogService } from 'primeng/dynamicdialog';



@NgModule({
  declarations: [
    PermisosComponent,
    FormPermisosComponent
  ],
  imports: [
    CommonModule,
    PermisosRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationPipesModule,
    DynamicTableModule
  ],
  providers:[DialogService]
})
export class PermisosModule { }
