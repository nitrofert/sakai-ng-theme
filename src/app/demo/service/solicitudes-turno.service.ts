import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { UrlApiService } from './url-api.service';
import { EstadosDealleSolicitud } from '../components/turnos/estados-turno.enum';
import { SolicitudInterface } from '../components/solicitudescargue/interface/solicitud.interface';
import { Subject } from 'rxjs';



@Injectable()
export class SolicitudTurnoService {

    private api_url:string = "";

    private turnosLocacion$ = new Subject<any[]>();
    private turnosLocacion!: any[];
    

    public estadosTurno:any[] = [{name:EstadosDealleSolicitud.SOLICITADO, value:EstadosDealleSolicitud.SOLICITADO, backgroundColor:'orange-100', textColor:'gray-900', icon:'pi pi-send',order:1},
    {name:EstadosDealleSolicitud.PAUSADO, value:EstadosDealleSolicitud.PAUSADO, backgroundColor:'red-500', textColor:'surface-50',icon:'pi pi-pause',order:2},
    {name:EstadosDealleSolicitud.ACTIVADO, value:EstadosDealleSolicitud.ACTIVADO, backgroundColor:'white', textColor:'gray-900',icon:'pi pi-play',order:3},
    {name:EstadosDealleSolicitud.AUTORIZADO, value:EstadosDealleSolicitud.AUTORIZADO, backgroundColor:'yellow-300', textColor:'gray-900',icon:'pi pi-check',order:4},
    {name:EstadosDealleSolicitud.SOLINVENTARIO, value:EstadosDealleSolicitud.SOLINVENTARIO, backgroundColor:'purple-300', textColor:'surface-50',icon:'pi pi-search',order:5},
    {name:EstadosDealleSolicitud.VALINVENTARIO, value:EstadosDealleSolicitud.VALINVENTARIO, backgroundColor:'purple-300', textColor:'surface-50',icon:'pi pi-search',order:6},

    {name:EstadosDealleSolicitud.ARRIBO, value:EstadosDealleSolicitud.ARRIBO, backgroundColor:'yellow-600', textColor:'surface-50',icon:'pi pi-ticket',order:7},
    {name:EstadosDealleSolicitud.PESADO, value:EstadosDealleSolicitud.PESADO, backgroundColor:'primary-100', textColor:'gray-900',icon:'pi pi-compass',order:8},
    {name:EstadosDealleSolicitud.CARGANDO, value:EstadosDealleSolicitud.CARGANDO, backgroundColor:'primary-300', textColor:'gray-900',icon:'pi pi-download',order:9},
    {name:EstadosDealleSolicitud.CARGADO, value:EstadosDealleSolicitud.CARGADO, backgroundColor:'primary-600', textColor:'surface-50',icon:'pi pi-box',order:10},
    {name:EstadosDealleSolicitud.PESADOF, value:EstadosDealleSolicitud.PESADOF, backgroundColor:'green-100', textColor:'gray-900',icon:'pi pi-compass',order:11},
    {name:EstadosDealleSolicitud.DESPACHADO, value:EstadosDealleSolicitud.DESPACHADO, backgroundColor:'green-600', textColor:'surface-50',icon:'pi pi-truck',order:12},
    {name:EstadosDealleSolicitud.CANCELADO, value:EstadosDealleSolicitud.CANCELADO, backgroundColor:'bluegray-600', textColor:'surface-50',icon:'pi pi-times-circle',order:13},
  ];


    constructor(private http: HttpClient,
                private urlApiService:UrlApiService) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    
    getSolicitudesTurno():Observable<SolicitudInterface[]> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/solicitud-turnos`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<SolicitudInterface[]>(url);
    }

    getSolicitudesTurnoById(id:number):Observable<SolicitudInterface> {
        const url:string = `${this.api_url}/api/solicitud-turnos/${id}`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<SolicitudInterface>(url);
    }
    
    getSolicitudesTurnoExtendido(params?:any):Observable<any> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/solicitud-turnos/extended`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<any>(url,{params:params});
    }

    getTurnosExtendido(params?:any):Observable<any> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/solicitud-turnos/turnos-extended`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<any>(url,{params:params});
    }

    async turnosExtendido(params?:any):Promise<any> {
        const turnosExtendido$ = this.getTurnosExtendido(params);
        const turnosExtendido = await lastValueFrom(turnosExtendido$);
        return turnosExtendido;
    }


    create(nuevaSolicutud:any):Observable<any>{
      
        //const requestOptions = this.urlApiService.getHeadersAPI();
        const url:string = `${this.api_url}/api/solicitud-turnos`;
        //return this.http.post<any>(url, nuevaTransportadora, requestOptions);
        return this.http.post<any>(url, nuevaSolicutud);

    }

    
    getTurnosPorLocalidad(localidad:string,fechaInicio?:any,fechaFin?:any):Observable<any> {
        const url:string = `${this.api_url}/api/solicitud-turnos/localidad`;
        return this.http.get<any>(url, {params:{localidad,fechaInicio,fechaFin}});
    }

    getTurnosLcacion$(localidad:string):Observable<any> {
        
        return this.turnosLocacion$.asObservable();
    }

    async getListaTurnosLocacion(localidad:string):Promise<void>{
        this.turnosLocacion = await lastValueFrom(this.getTurnosPorLocalidad(localidad));
       ////////////console.log(this.turnosLocacion);
        this.turnosLocacion$.next(this.turnosLocacion);
    }


    getTurnosByID(id:number):Observable<any> {
        const url:string = `${this.api_url}/api/solicitud-turnos/turno/${id}`;
        return this.http.get<any>(url);
    }

    async infoTurno(id?:any):Promise<any> {
        const turno$ = this.getTurnosByID(id);
        const turno = await lastValueFrom(turno$);
        return turno;
    }



    updateInfoTruno(id:number,data:any):Observable<any> {
        const url:string = `${this.api_url}/api/solicitud-turnos/turno/${id}`;
        return this.http.patch<any>(url,data);
    }


    updateEstadoTruno(id:number,data:any):Observable<any> {
        const url:string = `${this.api_url}/api/solicitud-turnos/cambiar-estado/turno/${id}`;
        return this.http.patch<any>(url,data);
    }


    getEmailsTurno(data:any):Observable<any> {
        const url:string = `${this.api_url}/api/solicitud-turnos/emails-turno`;
        return this.http.get<any>(url,{params:data});
    }

    async emailsTurno(data:any):Promise<any> {
        const emailsturno$ = this.getEmailsTurno(data);
        const emailsturno = await lastValueFrom(emailsturno$);
        return emailsturno;
    }

    sendNotification(turnoid:number):Observable<any> {
        const url:string = `${this.api_url}/api/solicitud-turnos/envio-notificacion/${turnoid}`;
        return this.http.get<any>(url);
    }


    cancelarTurnosVencidos():Observable<any> {
        const url:string = `${this.api_url}/api/solicitud-turnos/cancelar-turnos-vencidos`;
        return this.http.get<any>(url);
    }


   

    
}
