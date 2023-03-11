import { NgModule } from '@angular/core';
import { PrimengModule } from '../../primeng.module';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';




@NgModule({
    declarations:[
        AppBreadcrumbComponent
    ],
    exports:[
        AppBreadcrumbComponent
    ],
    imports:[
        PrimengModule
    ]
})
export class BreadCrumbModule { }
