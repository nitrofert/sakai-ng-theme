import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleAccesGuard } from '../../auth/guard/rol-acces.guard';
import { InputDemoComponent } from './inputdemo.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: InputDemoComponent,  }
	])],
	exports: [RouterModule]
})
export class InputDemoRoutingModule { }
