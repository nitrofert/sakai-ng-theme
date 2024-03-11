import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlApiService } from './url-api.service';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class LocalidadesService {

    api_url:string ="";

    constructor(private http: HttpClient,
        private urlApiService:UrlApiService) { 
            this.api_url = this.urlApiService.getUrlAPI();
        }


    
    getLocalidadesJSON():Promise<any[]> {
        return this.http.get<any>('assets/demo/data/localidades.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

    getAllLocalidades():Observable<any> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/localidades`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<any>(url);
    }

    
    async getLocalidades():Promise<any[]> {
       
        const localidades$ =  this.getAllLocalidades();
        const localidades = await lastValueFrom(localidades$)

        return localidades;
    }

    import(localidades:any):Observable<any>{
        //let dependencias = await this.getDependenciasJSOn();

        const url:string = `${this.api_url}/api/localidades/import`;
        //return this.http.post<any>(url, nuevaTransportadora, requestOptions);
        return this.http.post<any>(url, localidades);
    }

    create(data:any):Observable<any>{
      
        //const requestOptions = this.urlApiService.getHeadersAPI();
        const url:string = `${this.api_url}/api/localidades`;
        //return this.http.post<any>(url, nuevaTransportadora, requestOptions);
        return this.http.post<any>(url, data);

    }


    
}
