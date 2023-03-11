import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdenescargueRoutingModule } from './ordenescargue-routing.module';
import { ListadoOrdenesComponent } from './listado-ordenes/listado-ordenes.component';
import { AppLayoutModule } from 'src/app/layout/app.layout.module';
import { AppBreadcrumbComponent } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.component';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { OrdenesCargueService } from '../../service/ordenes-cargue.service';
import { ApplicationPipesModule } from '../../pipes/pipes.module';



@NgModule({
  declarations: [
    ListadoOrdenesComponent
  ],
  imports: [
    CommonModule,
    OrdenescargueRoutingModule,
    BreadCrumbModule,
    DynamicTableModule,
    ApplicationPipesModule
    
  ],
  providers:[OrdenesCargueService]
})
export class OrdenescargueModule { }
