import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DependenciasService {

    constructor(private http: HttpClient) { }

    
    getDependencias():Promise<any[]> {
        return this.http.get<any>('assets/demo/data/dependencias.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

   
    
}
