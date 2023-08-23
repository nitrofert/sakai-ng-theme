import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApiService } from './url-api.service';



@Injectable()
export class ConductoresService {

    private api_url:string = "";

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    
    getConductores():Promise<any[]> {
        return this.http.get<any>('assets/demo/data/conductores.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

    getConductores2():Observable<any>{

        const url:string = `${this.api_url}/api/conductores`;
        return this.http.get<any>(url);

    }

    create(nuevoConductor:any):Observable<any>{
      
        const url:string = `${this.api_url}/api/conductores`;
        return this.http.post<any>(url, nuevoConductor);

    }

    getConductorById(id:any):Observable<any>{

        const url:string = `${this.api_url}/api/conductores/${id}`;
        return this.http.get<any>(url);

    }

    update(nuevoConductor:any,id:any):Observable<any>{
      
        const url:string = `${this.api_url}/api/conductores/${id}`;
        return this.http.patch<any>(url, nuevoConductor);

    }

    

    

   

    
}
