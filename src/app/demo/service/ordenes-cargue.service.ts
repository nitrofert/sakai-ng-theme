import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApiService } from './url-api.service';



@Injectable()
export class OrdenesCargueService {

    private api_url:string = "";

    constructor(private http: HttpClient,
        private urlApiService:UrlApiService) { 
            this.api_url = this.urlApiService.getUrlAPI();
        }

    
    getOrdenes():Promise<any[]> {
        return this.http.get<any>('assets/demo/data/ordenes-cargue.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

    async getOrdenesPedidoItem(pedido:any, itemcode:string):Promise<any[]> {
        let ordenes = await this.getOrdenes();
        let ordenesPedidoItem = ordenes.filter(orden => orden.pedido == pedido && orden.itemcode == itemcode && orden.estado !='cerrada' && orden.estado !='inactiva' );

        return ordenesPedidoItem;
    }


    async getOrdenesByID(id:number):Promise<any[]> {
        let ordenes = await this.getOrdenes();
        let ordenCargue = ordenes.filter(orden => orden.id == id );

        return ordenCargue;
    }


    

   

    
}
