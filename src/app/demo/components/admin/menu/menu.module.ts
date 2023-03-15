import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { FormMenuComponent } from './form-menu/form-menu.component';
import { MenuRoutingModule } from './menu-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { DialogService } from 'primeng/dynamicdialog';



@NgModule({
  declarations: [
    MenuComponent,
    FormMenuComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationPipesModule,
    DynamicTableModule
  ],
  providers:[DialogService]
})
export class MenuModule { }
