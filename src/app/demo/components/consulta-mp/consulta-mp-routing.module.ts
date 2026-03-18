import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConsultaMpComponent } from './consulta-mp.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: ':itemcode/:bodega', component: ConsultaMpComponent }
    ])],
    exports: [RouterModule]
})
export class ConsultaMpRoutingModule { }
