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
    ApplicationPipesModule

  ],
  providers:[TipoVehiculosService]
})
export class VehiculosModule { }
