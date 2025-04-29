import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CostadoBuqueComponent } from './costado-buque.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CostadoBuqueComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class CostadoBuqueRoutingModule { }