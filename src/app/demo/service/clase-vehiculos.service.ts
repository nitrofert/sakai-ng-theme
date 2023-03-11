import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable()
export class ClaseVehiculosService {

    constructor(private http: HttpClient) { }

    
    getClaseVehiculos() {
        return this.http.get<any>('assets/demo/data/vehiculos.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

    

   

    
}
