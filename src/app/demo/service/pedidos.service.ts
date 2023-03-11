import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TreeNode } from 'primeng/api';

@Injectable()
export class PedidosService {

    constructor(private http: HttpClient) { }

    
    getPedidos() {
        return this.http.get<any>('assets/demo/data/pedidos.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }

    async getPedidosPorCliente(clientesSeleccionados: any, condicion_tpt:string){
        let pedidos = await this.getPedidos();
        let pedidosClientes:any[] = [];
        console.log(typeof clientesSeleccionados, Object.prototype.toString.call(clientesSeleccionados));
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
        

        console.log(pedidosClientes);
        return pedidosClientes;
    }

   

    /*async getPedidosClientePorAlmacen(clientesSeleccionados: any, almacen:string){

        let pedidosClientesPorAlmacen:any[]=[];
        for(let cliente of clientesSeleccionados){
            let pedidosPorCliente = await this.getPedidosPorCliente(cliente.code);
            console.log(pedidosPorCliente);
            for(let pedido of pedidosPorCliente){
                let pedidosClientePorAlmacen = pedidosPorCliente.filter(pedido => pedido.cardcode == cliente.code && pedido.locacion == almacen);
                for(let pedidoClientePorAlmacen of pedidosClientePorAlmacen){
                    pedidosClientesPorAlmacen.push(pedidoClientePorAlmacen)
                }
            }
        }
        
        //let pedidosClientePorAlmacen = pedidosPorCliente.filter(pedido => pedido.cardcode == cardcode && pedido.codigo_almacen == almacen);
        
        console.log(pedidosClientesPorAlmacen);
        return pedidosClientesPorAlmacen;
    }*/

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
