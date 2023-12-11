import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApiService } from './url-api.service';

@Injectable()
export class AlmacenesService {

    private api_url:string = "";

    constructor(private http: HttpClient,
        private urlApiService:UrlApiService) { 
            this.api_url = this.urlApiService.getUrlAPI();
        }


    
    getAlmacenes2():Promise<any[]> {
        return this.http.get<any>('assets/demo/data/almacenes.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

    getAlmacenes():Observable<any> {
        const url:string = `${this.api_url}/api/sb1xe/almacenes-mt?compania=${this.urlApiService.companySAP}`;
        return this.http.get<any>(url);
    }


    getLocaciones():Observable<any>{
         
        const url:string = `${this.api_url}/api/locaciones`;
        return this.http.get<any>(url);

    }

    setLocacion(data:any):Observable<any>{
         
        const url:string = `${this.api_url}/api/locaciones`;
        return this.http.post<any>(url,data);

    }

    updateLocacion
    (data:any,id:number):Observable<any>{
         
        const url:string = `${this.api_url}/api/locaciones/locacion/${id}`;
        return this.http.patch<any>(url,data);

    }

    getLocacionByCode(code:any):Observable<any>{
         
        const url:string = `${this.api_url}/api/locaciones/${code}`;
        return this.http.get<any>(url);

    }

   
    
}
