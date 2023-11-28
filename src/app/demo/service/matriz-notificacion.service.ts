import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApiService } from './url-api.service';

@Injectable()
export class MatrizNotificacionService {

    private api_url:string = "";

    constructor(private http: HttpClient,
        private urlApiService:UrlApiService) { 
            this.api_url = this.urlApiService.getUrlAPI();
        }


 

    getMatrizNotificacion():Observable<any>{
         
        const url:string = `${this.api_url}/api/solicitud-turnos/matriz-notificacion`;
        return this.http.get<any>(url);

    }

   
   
    
}
