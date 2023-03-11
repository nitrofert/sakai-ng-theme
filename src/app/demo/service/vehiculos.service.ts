import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApiService } from './url-api.service';



@Injectable()
export class VehiculosService {

    private api_url:string = "";

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    
    getVehiculos2():Promise<any[]> {
        return this.http.get<any>('assets/demo/data/vehiculos.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

    getVehiculos():Observable<any>{

        //const requestOptions = this.urlApiService.getHeadersAPI();
         
      
        const url:string = `${this.api_url}/api/vehiculos`;
        return this.http.get<any>(url);
        //return this.http.get<any>(url, requestOptions);

    }

    create(nuevoVehiculo:any):Observable<any>{
      
        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/vehiculos`;
        return this.http.post<any>(url, nuevoVehiculo);
        //return this.http.post<any>(url, nuevoVehiculo, requestOptions);

    }

    

   

    
}
