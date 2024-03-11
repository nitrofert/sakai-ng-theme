import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlApiService } from './url-api.service';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class DependenciasService {

    api_url:string ="";

    constructor(private http: HttpClient,
        private urlApiService:UrlApiService) { 
            this.api_url = this.urlApiService.getUrlAPI();
        }

   
    

    
    getAllDependencias():Observable<any> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/dependencias`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<any>(url);
    }

    
    async getDependencias():Promise<any[]> {
       
        const dependencias$ =  this.getAllDependencias();
        const dependencias = await lastValueFrom(dependencias$)

        return dependencias;
    }

    getDependenciasJSOn():Promise<any[]> {
        return this.http.get<any>('assets/demo/data/dependencias.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }


    import(dependencias:any):Observable<any>{
        //let dependencias = await this.getDependenciasJSOn();

        const url:string = `${this.api_url}/api/dependencias/import`;
        //return this.http.post<any>(url, nuevaTransportadora, requestOptions);
        return this.http.post<any>(url, dependencias);
    }

    create(data:any):Observable<any>{
      
        //const requestOptions = this.urlApiService.getHeadersAPI();
        const url:string = `${this.api_url}/api/dependencias`;
        //return this.http.post<any>(url, nuevaTransportadora, requestOptions);
        return this.http.post<any>(url, data);

    }


   
    
}
