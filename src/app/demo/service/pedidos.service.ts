import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { UrlApiService } from './url-api.service';

@Injectable()
export class PedidosService {

    private api_url:string = "";

    constructor(private http: HttpClient,
        private urlApiService:UrlApiService) { 
            this.api_url = this.urlApiService.getUrlAPI();
        }

    
    getPedidos() {
        return this.http.get<any>('assets/demo/data/pedidos.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

    getSaldosPedidos():Observable<any> {
        const url:string = `${this.api_url}/api/sb1xe/saldos-pedidos?compania=NITROFERT_PRD`;
        return this.http.get<any>(url);
    }

    async getPedidosPorCliente(clientesSeleccionados: any, condicion_tpt:string){
        let pedidos = await this.getPedidos();
        let pedidosClientes:any[] = [];
        //console.log(typeof clientesSeleccionados, Object.prototype.toString.call(clientesSeleccionados));
        let pedidosPorCliente!:any[];
        if(Object.prototype.toString.call(clientesSeleccionados) === '[object Array]'){
            for(let cliente of clientesSeleccionados){
            
                pedidosPorCliente = pedidos.filter(pedido => pedido.cardcode === cliente.code && pedido.condicion_tpt === condicion_tpt);
                for(let pedido of pedidosPorCliente){
                    pedidosClientes.push(pedido)
                }   
            }
        }else{

            pedidosClientes = pedidos.filter(pedido => pedido.cardcode === clientesSeleccionados.code && pedido.condicion_tpt === condicion_tpt);
            
        }
        

        //console.log(pedidosClientes);
        return pedidosClientes;
    }

    getCantidadesComprometidas(pedidonum:string,itemcode:string, bodega:string,idPedido:number):Observable<number> {
        const url:string = `${this.api_url}/api/solicitud-turnos/cantidades-comprometidas`;
        return this.http.get<number>(url,{params:{pedidonum,itemcode,bodega,idPedido}});
    }

    getCantidadesComprometidasItemBodega(itemcode:string, bodega:string,idPedido:number):Observable<number> {
        const url:string = `${this.api_url}/api/solicitud-turnos/cantidades-comprometidas-item-bodega`;
        return this.http.get<number>(url,{params:{itemcode,bodega,idPedido}});
    }

    getInventarioItenBodega():Observable<any> {
        const url:string = `${this.api_url}/api/sb1xe/inventario?compania=NITROFERT_PRD`;
        return this.http.get<number>(url);
    }



   


   async getVehiculosPedido() {
        //return this.http.get<any>('assets/demo/data/filesystem.json')
        return this.http.get<any>('assets/demo/data/pedidos-solicitud.json')
            .toPromise()
            .then(res => res.data as TreeNode[]);

        /*let data = await this.http.get<any>('assets/demo/data/filesystem.json') ; 
        data.subscribe({
            next: (info)=>{
               return  info.data as TreeNode[];
            }
        })*/
        
    }

    
}
