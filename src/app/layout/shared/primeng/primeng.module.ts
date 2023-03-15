import { NgModule } from '@angular/core';
import {AccordionModule} from 'primeng/accordion';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge'
import {CardModule} from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import {CaptchaModule} from 'primeng/captcha';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import {FieldsetModule} from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton'
import {SkeletonModule} from 'primeng/skeleton';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import {TabMenuModule} from 'primeng/tabmenu';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {TreeTableModule} from 'primeng/treetable';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {FileUploadModule} from 'primeng/fileupload';
import {InputMaskModule} from 'primeng/inputmask';



@NgModule({
  exports:[
    AccordionModule,
    AutoCompleteModule,
    BadgeModule,
    ButtonModule,
    BreadcrumbModule,
    CardModule,
    CalendarModule,
    CaptchaModule,
    ChartModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    DynamicDialogModule,
    DividerModule,
    DropdownModule,
    FileUploadModule,
    FieldsetModule,
    InputNumberModule,
    InputSwitchModule,
    InputMaskModule,
    InputTextareaModule,
    InputTextModule,

    MenuModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    PasswordModule,
    PanelMenuModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    RatingModule,
    RippleModule,
    SelectButtonModule,
    SidebarModule,
    SkeletonModule,
    SliderModule,
    SplitButtonModule,
    StyleClassModule,
    TableModule,
    TabMenuModule,
    TagModule,
    ToastModule,
    ToggleButtonModule,
    TooltipModule,
    TreeTableModule
  ]
})
export class PrimengModule { }
