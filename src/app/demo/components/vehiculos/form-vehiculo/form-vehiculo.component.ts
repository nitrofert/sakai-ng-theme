import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConductoresService } from 'src/app/demo/service/conductores.service';
import { TipoVehiculosService } from 'src/app/demo/service/tipo-vehiculo.service';
import { VehiculosService } from 'src/app/demo/service/vehiculos.service';
import { FormConductorComponent } from '../../conductores/form-conductor/form-conductor.component';
import { LeerTipoVehiculoInterface } from '../form-tipo-vehiculo/interfaces/leer-tipoVehiculo.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { FormTipoVehiculoComponent } from '../form-tipo-vehiculo/form-tipo-vehiculo.component';

@Component({
  selector: 'app-form-vehiculo',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-vehiculo.component.html',
  styleUrls: ['./form-vehiculo.component.scss']
})
export class FormVehiculoComponent implements  OnInit {

  placa:string = '';
  tipoVehiculos!:LeerTipoVehiculoInterface[];
  tipoSeleccionado:any = [];
  tiposFiltrados:any[] = [];

  conductores!:[];
  conductorSeleccionado:any = [];
  conductoresFiltrados:any[] = [];

  envioLineaVehiculo:boolean = false;

  capacidad:number = 0;
  pesovacio:number = 0;
  pesomax:number = 0;
  volumen:number = 0;
  updateMode:boolean = false;

  constructor(
    public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig,
    private tipoVehiculosService: TipoVehiculosService,
    private conductoresService: ConductoresService,
    private vehiculosService:VehiculosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public dialogService: DialogService

    ){}

    ngOnInit() {
     ////console.log(this.config.data.id);
      this.getTipoVehiculos();
      this.getConductores();
      if(this.config.data.id!=0){
        this.getInfoVehiculo(this.config.data.id);
        this.updateMode = true;
      }
    }

    getConductores(){
        this.conductoresService.getConductores2()
            .subscribe({
                next: (conductores)=>{
                    //Adicionar campos requeridos para autocmplete y dropdwons
                    for(let conductor of conductores){
                      conductor.code = conductor.cedula;
                      conductor.name = conductor.nombre;
                      conductor.label = conductor.cedula+' - '+conductor.nombre;
                    }
                   ////console.log(conductores);
                    this.conductores = conductores;
                },
                error: (err)=>{
                  console.error(err);
                }
            });
    }

    getInfoVehiculo(id:any){
      this.vehiculosService.getVehiculoById(id)
          .subscribe({
              next:(infoVehiculo)=>{
                 ////console.log(infoVehiculo);
                  this.placa = infoVehiculo.placa;
                  this.capacidad = infoVehiculo.capacidad;
                  this.pesovacio = infoVehiculo.pesovacio;
                  this.pesomax = infoVehiculo.pesomax;
                  this.volumen = infoVehiculo.volumen;
                  this.tipoSeleccionado = this.tipoVehiculos.find(tipo => tipo.code === infoVehiculo.tipo_vehiculo.id);
                 
              },
              error:(err)=>{
                console.error(err);
              }
          });
  }

    getTipoVehiculos(){
      this.tipoVehiculosService.getTipoVehiculos()
          .subscribe({
              next: (tipoVehiculos)=>{
                
                //Adicionar campos requeridos para autocmplete y dropdwons
                for(let tipoVehiculo of tipoVehiculos){
                  tipoVehiculo.code = tipoVehiculo.id;
                  tipoVehiculo.name = tipoVehiculo.tipo;
                  tipoVehiculo.label = tipoVehiculo.tipo;
                }
               //////console.log(tipoVehiculos);
                this.tipoVehiculos = tipoVehiculos;
              },
              error: (err)=>{
                console.error(err);
              }
          });
    }

    filtrarTipo(event:any){
        this.tiposFiltrados = this.filter(event,this.tipoVehiculos);
        /*this.tiposFiltrados.unshift({
          id:0, code: "Nuevo", name: "Nuevo", label:"+ Nuevo tipo"
        });*/
    }

    filtrarConductor(event:any){
      this.conductoresFiltrados = this.filter(event,this.conductores);
        this.conductoresFiltrados.unshift({
          id:0, code: "Nuevo", name: "Nuevo", label:"+ Nuevo conductor"
        });
    }

    filter(event: any, arrayFiltrar:any[]) {

      //////console.log(arrayFiltrar);
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

    seleccionarTipo(tipo:any){
     ////console.log(tipo);
      if(tipo.id ===0){ 
        //TODO: LLamar al formulario de creacion de tipo vehiculo
        this.nuevoTipo();
      }else{
        this.capacidad = tipo.capacidad;
        this.pesovacio = tipo.pesovacio;
        this.pesomax = tipo.pesomax;
        this.volumen = tipo.volumen;
      }

    }

    seleccionarConductor(conductor:any){
     ////console.log(conductor);
      if(conductor.id ===0){ 
        //TODO: LLamar al formulario de creacion de tipo vehiculo
        this.nuevoConductor();
      }else{
        
      }
    }

    nuevoTipo(){
      const refTipo = this.dialogService.open(FormTipoVehiculoComponent, {
        data: {
            id: parseInt('1')
        },
        header: `Nuevo Tipo de vehiculo` ,
        width: '70%',
        height:'auto',
        contentStyle: {"overflow": "auto"},
        maximizable:true, 
      });
    
      refTipo.onClose.subscribe(() => {
        
       ////console.log("Refresh calendar");
      });
    }

    nuevoConductor(){
      const refConductor = this.dialogService.open(FormConductorComponent, {
        data: {
            id: parseInt('1')
        },
        header: `Nuevo Conductor` ,
        width: '70%',
        height:'auto',
        contentStyle: {"overflow": "auto"},
        maximizable:true, 
      });
    
      refConductor.onClose.subscribe(() => {
        
        this.getConductores();
      });
    }

    grabar(){
      this.envioLineaVehiculo= true;
      if(this.placa=='' || this.tipoSeleccionado.length ==0 || 
         this.capacidad==0 || !this.capacidad || 
         this.pesovacio==0 || !this.pesovacio ||
         this.pesomax == 0 || !this.pesomax   ||
         this.volumen==0 || !this.volumen 
         //|| this.conductorSeleccionado.length==0
         ){

          this.messageService.add({severity:'error', summary:'Error', detail:'Los campos resaltados en rojo deben ser diligenciados'});
      }else{
        //Registrar vehiculo
        
        let nuevoVehiculo = {
          placa:this.placa,
          tipo_vehiculo:this.tipoSeleccionado.id,
          capacidad:this.capacidad,
          pesovacio:this.pesovacio,
          pesomax:this.pesomax,
          volumen:this.volumen,
          //conductor:this.conductorSeleccionado.id
        }

        if(this.updateMode){
          //Actualiza información del vehículo seleccionado
          this.vehiculosService.update(nuevoVehiculo,this.config.data.id)
          .subscribe({
              next: (vehiculo)=>{
                this.messageService.add({severity:'success', summary:'información', detail:`El vehículo ${vehiculo.placa} fue actualizado correctamente`});
              },
              error:(err)=>{
                console.error(err);
                this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
              }
          });
        }else{
          //Registrar vehiculo
          this.vehiculosService.create(nuevoVehiculo)
          .subscribe({
              next: (vehiculo)=>{
                this.messageService.add({severity:'success', summary:'información', detail:`El vehículo ${vehiculo.placa} fue registrado correctamente`});
              },
              error:(err)=>{
                console.error(err);
                this.messageService.add({severity:'error', summary:'Error:'+err.error.statusCode, detail:err.error.message});
              }
          });
        }
       
      }
    }
  
    cancelar(){
      let infoVehiculo = {
        placa:this.placa,
        capacidad:this.capacidad,
        pesovacio:this.pesovacio,
        pesomax:this.pesomax,
        volumen:this.volumen,
        tipo_vehiculo:this.tipoSeleccionado,
        update:this.updateMode
      }
      this.ref.close(infoVehiculo);
    }

    keyPress(event:any){
     ////console.log(event);
      
      var key =  event.keyCode;
      let teclasFuncionales:any[] =[8,46,9,13];

      //Numeros y letras
      if((parseInt(key)>=48 && parseInt(key)<=57 && !event.shiftKey) || (parseInt(key)>=65 && parseInt(key)<=90) || (parseInt(key)>=96 && parseInt(key)<=105) || teclasFuncionales.includes(key)){
        
      }else{
       ////console.log(key);
        event.preventDefault();
      }
  }
}
