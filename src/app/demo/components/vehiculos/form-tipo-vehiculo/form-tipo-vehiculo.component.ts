import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-form-tipo-vehiculo',
  templateUrl: './form-tipo-vehiculo.component.html',
  styleUrls: ['./form-tipo-vehiculo.component.scss']
})
export class FormTipoVehiculoComponent implements  OnInit {


  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    
    ){}

    ngOnInit() {
      console.log(this.config.data.id);
    }

    grabar(){

    }
  
    cancelar(){
      this.ref.close();
    }
}