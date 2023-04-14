import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApiService } from './url-api.service';



@Injectable()
export class SolicitudTurnoService {

    private api_url:string = "";

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    
    getSolicitudesTurno():Observable<any> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/solicitud-turnos`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<any>(url);
    }

    create(nuevaSolicutud:any):Observable<any>{
      
        //const requestOptions = this.urlApiService.getHeadersAPI();
        const url:string = `${this.api_url}/api/solicitud-turnos`;
        //return this.http.post<any>(url, nuevaTransportadora, requestOptions);
        return this.http.post<any>(url, nuevaSolicutud);

    }

    
    getTurnosPorLocalidad(localidad:string):Observable<any> {
        const url:string = `${this.api_url}/api/solicitud-turnos/localidad`;
        return this.http.get<any>(url, {params:{localidad}});
    }


    getTurnosByID(id:number):Observable<any> {
        const url:string = `${this.api_url}/api/solicitud-turnos/${id}`;
        return this.http.get<any>(url);
    }


    updateInfoTruno(id:number,data:any):Observable<any> {
        const url:string = `${this.api_url}/api/solicitud-turnos/turno/${id}`;
        return this.http.patch<any>(url,data);
    }
    

   

    
}
