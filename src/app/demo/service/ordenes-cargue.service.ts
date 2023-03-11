import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable()
export class OrdenesCargueService {

    constructor(private http: HttpClient) { }

    
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
