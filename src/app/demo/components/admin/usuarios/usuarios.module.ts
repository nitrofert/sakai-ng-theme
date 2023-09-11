import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApplicationPipesModule } from 'src/app/demo/pipes/pipes.module';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { DialogService } from 'primeng/dynamicdialog';
import { AlmacenesService } from 'src/app/demo/service/almacenes.service';



@NgModule({
  declarations: [
    UsuariosComponent,
    FormUsuarioComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    BreadCrumbModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    ApplicationPipesModule,
    DynamicTableModule
  ],
  providers:[DialogService,AlmacenesService],
  
})
export class UsuariosModule { }
