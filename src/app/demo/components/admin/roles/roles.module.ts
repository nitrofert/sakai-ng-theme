import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles.component';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { RolesRoutingModule } from './roles-routing.module';
import { DialogService } from 'primeng/dynamicdialog';
import { FormRolesComponent } from './form-roles/form-roles.component';


@NgModule({
  declarations: [
    RolesComponent,
    FormRolesComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationPipesModule,
    DynamicTableModule,
  ],
  providers: [DialogService]
})
export class RolesModule { }
