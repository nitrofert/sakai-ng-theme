import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { UrlApiService } from './url-api.service';
import { EstadosDealleSolicitud } from '../components/turnos/estados-turno.enum';



@Injectable()
export class NovedadesService {

    private api_url:string = "";

    public estadosTurno:any[] = [{name:EstadosDealleSolicitud.SOLICITADO, value:EstadosDealleSolicitud.SOLICITADO, backgroundColor:'orange-100', textColor:'gray-900'},
    {name:EstadosDealleSolicitud.PAUSADO, value:EstadosDealleSolicitud.PAUSADO, backgroundColor:'red-500', textColor:'surface-50'},
    {name:EstadosDealleSolicitud.ACTIVADO, value:EstadosDealleSolicitud.ACTIVADO, backgroundColor:'white', textColor:'gray-900'},
    {name:EstadosDealleSolicitud.AUTORIZADO, value:EstadosDealleSolicitud.AUTORIZADO, backgroundColor:'yellow-300', textColor:'gray-900'},
    {name:EstadosDealleSolicitud.ARRIBO, value:EstadosDealleSolicitud.ARRIBO, backgroundColor:'yellow-600', textColor:'surface-50'},
    {name:EstadosDealleSolicitud.PESADO, value:EstadosDealleSolicitud.PESADO, backgroundColor:'primary-100', textColor:'gray-900'},
    {name:EstadosDealleSolicitud.CARGANDO, value:EstadosDealleSolicitud.CARGANDO, backgroundColor:'primary-300', textColor:'gray-900'},
    {name:EstadosDealleSolicitud.CARGADO, value:EstadosDealleSolicitud.CARGADO, backgroundColor:'primary-600', textColor:'surface-50'},
    {name:EstadosDealleSolicitud.PESADOF, value:EstadosDealleSolicitud.PESADOF, backgroundColor:'green-100', textColor:'gray-900'},
    {name:EstadosDealleSolicitud.DESPACHADO, value:EstadosDealleSolicitud.DESPACHADO, backgroundColor:'green-600', textColor:'surface-50'},
    {name:EstadosDealleSolicitud.CANCELADO, value:EstadosDealleSolicitud.CANCELADO, backgroundColor:'bluegray-600', textColor:'surface-50'},
  ];


    constructor(private http: HttpClient,
                private urlApiService:UrlApiService) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    
    getNovedades():Observable<any[]> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/novedades`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<any[]>(url);
    }

   

   

    
}
