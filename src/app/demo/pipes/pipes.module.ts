// application-pipes.module.ts
// other imports
import { NgModule } from '@angular/core';
import { DynamicTablePipe } from './dynamic-table.pipe';
import { EstadosPipe } from './estados.pipe';
import { ObjectStringPipe } from './object-string.pipe';
import { SeriesPipe } from './series.pipe';
import { TooltipsPipe } from './tooltips.pipe';
import { ObjectTypesPipe } from './objectTypesSap.pipe';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [ 
    EstadosPipe,
    SeriesPipe,
    TooltipsPipe,
    DynamicTablePipe,
    ObjectStringPipe,
    ObjectTypesPipe
  ],
  exports: [
    EstadosPipe,
    SeriesPipe,
    TooltipsPipe,
    DynamicTablePipe,
    ObjectStringPipe,
    ObjectTypesPipe

  ]
})
export class ApplicationPipesModule {}