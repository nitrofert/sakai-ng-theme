import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { ApplicationPipesModule } from '../../pipes/pipes.module';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ListadoReportesComponent } from './listado-reportes/listado-reportes.component';
import { ListadoFacturasComponent } from './listado-facturas/listado-facturas.component';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { FormFacturaComponent } from './form-factura/form-factura.component';



@NgModule({
  declarations: [
    ListadoReportesComponent,
    ListadoFacturasComponent,
    FormFacturaComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    BreadCrumbModule,
    DynamicTableModule,
    ApplicationPipesModule,
    PrimengModule,
    FormsModule,
  ],
  providers:[DialogService]
})
export class ReportesModule { }
