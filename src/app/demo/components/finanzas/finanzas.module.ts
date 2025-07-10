import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbModule } from 'src/app/layout/shared/breadcrumb/app.breadcrumb.module';
import { DynamicTableModule } from 'src/app/layout/shared/dynamic-table/dynamic-table.module';
import { ApplicationPipesModule } from '../../pipes/pipes.module';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from 'src/app/layout/shared/primeng/primeng.module';
import { FormsModule } from '@angular/forms';
import { MatrizNotificacionService } from '../../service/matriz-notificacion.service';
import { SolicitudTurnoService } from '../../service/solicitudes-turno.service';
import { MessageService } from 'primeng/api';
import { AlmacenesService } from '../../service/almacenes.service';
import { UsuarioService } from '../../service/usuario.service';
import { FunctionsService } from '../../service/functions.service';

import { DynamicChartsModule } from 'src/app/layout/shared/dynamic-charts/dynamic-charts.module';

import { FinanzasRoutingModule } from './finanzas-routing.module';
import { ReportesModule } from '../reportes/reportes.module';
import { CargueSoporteFacturasComponent } from './cargue-soportes-facturas/cargue-soportes-facturas.component';



@NgModule({
  declarations: [
    CargueSoporteFacturasComponent
  ],
  imports: [
    CommonModule,
    FinanzasRoutingModule,
    BreadCrumbModule,
    DynamicTableModule,
    ApplicationPipesModule,
    PrimengModule,
    FormsModule,
    DynamicChartsModule,
    ReportesModule
  ],
  providers:[DialogService,
             MessageService,
             FunctionsService,
             
            ],
  exports:[
   
  ]
})
export class FinanzasModule { }
