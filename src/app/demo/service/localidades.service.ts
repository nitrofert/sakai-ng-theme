import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LocalidadesService {

    constructor(private http: HttpClient) { }

    
    getLocalidades():Promise<any[]> {
        return this.http.get<any>('assets/demo/data/localidades.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

   
    
}
