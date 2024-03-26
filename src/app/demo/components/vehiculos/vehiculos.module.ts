import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculosComponent } from './vehiculos.component';
import { FormVehiculoComponent } from './form-vehiculo/form-vehiculo.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { ApplicationPipesModule } from '../../pipes/pipes.module';
import { FormTipoVehiculoComponent } from './form-tipo-vehiculo/form-tipo-vehiculo.component';
import { VehiculosRoutingModule } from './vehiculos-routing.module';
import { TipoVehiculosService } from '../../service/tipo-vehiculo.service';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VehiculosService } from '../../service/vehiculos.service';
import { ConductoresService } from '../../service/conductores.service';



@NgModule({
  declarations: [
    VehiculosComponent,
    FormVehiculoComponent,
    FormTipoVehiculoComponent
  ],
  imports: [
    CommonModule,
    VehiculosRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationPipesModule,
    DynamicTableModule
  ],
  providers:[TipoVehiculosService,DialogService,ConfirmationService,MessageService,VehiculosService,ConductoresService]
})
export class VehiculosModule { }
