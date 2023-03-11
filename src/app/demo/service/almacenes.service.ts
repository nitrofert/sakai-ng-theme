import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AlmacenesService {

    constructor(private http: HttpClient) { }

    
    getAlmacenes():Promise<any[]> {
        return this.http.get<any>('assets/demo/data/almacenes.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

   
    
}
