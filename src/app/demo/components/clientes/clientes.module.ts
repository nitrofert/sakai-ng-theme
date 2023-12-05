import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from './clientes.component';
import { FormClienteComponent } from './form-cliente/form-cliente.component';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationPipesModule } from '../../pipes/pipes.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClientesService } from '../../service/clientes.service';
import { ClientesRoutingModule } from './clientes-routing.module';



@NgModule({
  declarations: [
    ClientesComponent,
    FormClienteComponent
  ],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationPipesModule,
    DynamicTableModule,
  ],
  providers:[DialogService,ConfirmationService,MessageService,ClientesService]
})
export class ClientesModule { }
