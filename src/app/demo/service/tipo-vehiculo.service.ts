import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeerTipoVehiculoInterface } from '../components/vehiculos/form-tipo-vehiculo/interfaces/leer-tipoVehiculo.interface';
import { UrlApiService } from './url-api.service';



@Injectable()
export class TipoVehiculosService {

    private api_url:string = "";

    constructor(private http: HttpClient,
                private urlApiService:UrlApiService) { 
                    this.api_url = this.urlApiService.getUrlAPI();
                }

    
   

    getTipoVehiculos():Observable<LeerTipoVehiculoInterface[]>{
      
        const url:string = `${this.api_url}/api/tipo-vehiculos`;
        return this.http.get<LeerTipoVehiculoInterface[]>(url);

    }

    

   

    
}
