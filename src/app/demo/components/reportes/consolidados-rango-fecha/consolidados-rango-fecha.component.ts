import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { DialogService } from 'primeng/dynamicdialog';
import { DependenciasService } from 'src/app/demo/service/dependencias.service';
import { FunctionsService } from 'src/app/demo/service/functions.service';
import { LocalidadesService } from 'src/app/demo/service/localidades.service';
import { SolicitudTurnoService } from 'src/app/demo/service/solicitudes-turno.service';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-consolidados-rango-fecha',
  providers:[ConfirmationService,MessageService],
  templateUrl: './consolidados-rango-fecha.component.html',
  styleUrls: ['./consolidados-rango-fecha.component.scss']
})
export class ConsolidadosRangoFechaComponent implements  OnInit{


  hoy = new Date();
  primerDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), 1);
  ultimoDiaMes:Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth() + 1, 0);
  filtroRnagoFechas:Date[] = [this.primerDiaMes,this.ultimoDiaMes];

  rangoFechas:Date[] = this.filtroRnagoFechas;

  constructor(private router:Router,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private  messageService: MessageService,
    private usuariosService:UsuarioService,
    private solicitudTurnoService:SolicitudTurnoService,
    public functionsService:FunctionsService,
    //rivate sB1SLService:SB1SLService,
    private localidadesService:LocalidadesService,
    private dependenciasService:DependenciasService){}

    ngOnInit() {

      Calendar.prototype.getDateFormat = () => 'dd/mm/yy';


    }

    async setReporte():Promise<void> {

    }

    async cambioFecha(event:any){
    
    
      if(event[1]){
        console.log(this.filtroRnagoFechas,this.rangoFechas);
        //this.filtroRnagoFechas = event;
        this.rangoFechas = this.filtroRnagoFechas;
        await this.setReporte();
    
      }
    }

   
  
}
