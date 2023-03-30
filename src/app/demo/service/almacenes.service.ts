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
        const url:string = `${this.api_url}/api/sb1xe/almacenes-mt?compania=NITROFERT_PRD`;
        return this.http.get<any>(url);
    }

   
    
}
