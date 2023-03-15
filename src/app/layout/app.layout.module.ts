import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { AppMenuComponent } from './shared/menu/app.menu.component';
import { AppMenuitemComponent } from './shared/menuitem/app.menuitem.component';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from './shared/topbar/app.topbar.component';
import { AppFooterComponent } from './shared/footer/app.footer.component';
import { AppConfigModule } from './config/config.module';
import { AppSidebarComponent } from "./shared/sidebar/app.sidebar.component";
import { AppLayoutComponent } from "./app.layout.component";
import { PrimengModule } from './shared/primeng/primeng.module';
import { AppBreadcrumbComponent } from './shared/breadcrumb/app.breadcrumb.component';

@NgModule({
    declarations: [
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppLayoutComponent,
        
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        //InputTextModule,
        //SidebarModule,
        //BadgeModule,
        //RadioButtonModule,
        //InputSwitchModule,
        //RippleModule,
        RouterModule,
        AppConfigModule,
        PrimengModule
    ],
    exports: [AppLayoutComponent]
})
export class AppLayoutModule { }
