import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdenesCargueService } from 'src/app/demo/service/ordenes-cargue.service';

@Component({
  selector: 'app-form-turno',
  templateUrl: './form-turno.component.html',
  styleUrls: ['./form-turno.component.scss']
})
export class FormTurnoComponent implements  OnInit {

  ordenCargue: any;
  hoy:Date = new Date();

  cliente:string = '';
  localidad:string = '';
  fechacargue!:Date;
  horacargue!:Date;
  placa:string ='';
  tipo:string = '';
  cantidad:number = 0;
  conductor:string = '';
  telefono:string = '';
  celular:string = '';
  email:string = '';

  estados: any[] = [{ name: 'Pendiente', code: 'Pendiente' , label:'Pendiente'},
                    { name: 'Autorizado', code: 'Autorizado' , label:'Autorizado'},
                    { name: 'Arribo a cargue', code: 'Arribo a cargue' , label:'Arribo a cargue'},
                    { name: 'Incio cargue', code: 'Incio cargue' , label:'Incio cargue'},
                    { name: 'Fin cargue', code: 'Fin cargue' , label:'Fin cargue'},
                    { name: 'Cancelar', code: 'Canacelar' , label:'Canacelar'},];
  estadoSeleccionado:any = [];
  estadosFiltrados :any[]=[];


  constructor(private ordenesCargueService: OrdenesCargueService, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    //let id = this.config.id
    console.log(this.config.data.id);
    this.getOrdenCargue(this.config.data.id)
  }

  async getOrdenCargue(id: number){
    let orden = await this.ordenesCargueService.getOrdenesByID(id);
    this.ordenCargue = orden[0]
    console.log(this.ordenCargue);
    this.cliente = this.ordenCargue.cliente+' - '+this.ordenCargue.cliente_nombre;
    this.localidad = this.ordenCargue.almacen;
    this.fechacargue = new Date(this.ordenCargue.fechacargue);
    this.horacargue = new Date(this.ordenCargue.horacargue);
    //this.horacargue = new Date();
    this.placa = this.ordenCargue.placa;
    this.tipo = this.ordenCargue.tipo;
    this.cantidad = this.ordenCargue.cantidad;
    this.conductor = this.ordenCargue.conductor+' - '+this.ordenCargue.conductor_nombre;
    this.estadoSeleccionado = this.estados.find(estado => estado.code == this.ordenCargue.estado);
  }

  filtrarEstado(event:any){
    let estadosAfiltrar:any[] = [];
    for(let conductor of this.estados){
      estadosAfiltrar.push(conductor);
    }
    this.estadosFiltrados = this.filter(event,estadosAfiltrar);
    
  }

  seleccionarEstado(estado:any){

  }

  filter(event: any, arrayFiltrar:any[]) {

    ////console.log(arrayFiltrar);
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < arrayFiltrar.length; i++) {
        const linea = arrayFiltrar[i];
        if (linea.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            filtered.push(linea);
        }
    }
    return filtered;
    }
    

  grabar(){
    console.log(this.horacargue);
  }

  cancelar(){
    this.ref.close();
  }



}
