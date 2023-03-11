// application-pipes.module.ts
// other imports
import { NgModule } from '@angular/core';
import { DynamicTablePipe } from './dynamic-table.pipe';
import { EstadosPipe } from './estados.pipe';
import { ObjectStringPipe } from './object-string.pipe';
import { SeriesPipe } from './series.pipe';
import { TooltipsPipe } from './tooltips.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [ 
    EstadosPipe,
    SeriesPipe,
    TooltipsPipe,
    DynamicTablePipe,
    ObjectStringPipe
  ],
  exports: [
    EstadosPipe,
    SeriesPipe,
    TooltipsPipe,
    DynamicTablePipe,
    ObjectStringPipe
  ]
})
export class ApplicationPipesModule {}