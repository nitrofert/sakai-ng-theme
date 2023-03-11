import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportadorasComponent } from './transportadoras.component';
import { FormTransportadoraComponent } from './form-transportadora/form-transportadora.component';
import { TransportadorasRoutingModule } from './transportadoras-routing.module';
import { PrimengModule } from 'src/app/layout/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationPipesModule } from '../../pipes/pipes.module';



@NgModule({
  declarations: [
    TransportadorasComponent,
    FormTransportadoraComponent
  ],
  imports: [
    CommonModule,
    TransportadorasRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationPipesModule
  ]
})
export class TransportadorasModule { }
