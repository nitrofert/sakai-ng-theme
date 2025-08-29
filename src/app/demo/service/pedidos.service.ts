import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TreeNode } from 'primeng/api';
import { lastValueFrom, Observable } from 'rxjs';
import { UrlApiService } from './url-api.service';

@Injectable()
export class PedidosService {

    private api_url:string = "";

    constructor(private http: HttpClient,
        private urlApiService:UrlApiService) { 
            this.api_url = this.urlApiService.getUrlAPI();
        }

    
    /*getPedidos() {
        return this.http.get<any>('assets/demo/data/pedidos.json')
            .toPromise()
            .then(res => res.data as any[])
            .then(data => data);
    }*/

    getSaldosPedidos(cliente?:string,locacion2?:string):Observable<any> {
        let options:string = "";
        if(cliente){
            options+=`&cliente=${cliente}`;
        }
        if(locacion2){
            options+=`&locacion2=${locacion2}`;
        }
        const url:string = `${this.api_url}/api/sb1xe/saldos-pedidos?compania=${this.urlApiService.companySAP}${options}`;
        return this.http.get<any>(url);
    }

    
    getSaldosPedidosClienteObs(cliente?:string,condicionTpt?:string,locacion2?:string):Observable<any> {
        let options:string = "";
        if(cliente){
            options+=`&cod_clie=${cliente}`;
        }
         if(condicionTpt){
            options+=`&condtpt=${condicionTpt}`;
        }
        if(locacion2){
            options+=`&locacion2=${locacion2}`;
        }
        const url:string = `${this.api_url}/api/sb1xe/saldos-pedidos-v2?compania=${this.urlApiService.companySAP}${options}`;
        return this.http.get<any>(url);
    }

    async getSaldosPedidosCliente(cliente?:string,condicionTpt?:string,locacion2?:string):Promise<any>{
        let pedidosCliente$ =  this.getSaldosPedidosClienteObs(cliente,condicionTpt);
        let pedidosCliente = await lastValueFrom(pedidosCliente$);

        return pedidosCliente;
    }
    
    getSaldosPedidosFletes(cliente?:string,locacion2?:string):Observable<any> {
        let options:string = "";
        if(cliente){
            options+=`&cliente=${cliente}`;
        }
        if(locacion2){
            options+=`&locacion2=${locacion2}`;
        }
        const url:string = `${this.api_url}/api/sb1xe/saldos-pedidos-fletes?compania=${this.urlApiService.companySAP}${options}`;
        return this.http.get<any>(url);
    }

    async getPedidosPorCliente(clientesSeleccionados: any, condicion_tpt:string, pedidos:any[]){
        //let pedidos = await this.getPedidos();

        ////////////////console.log(pedidos);
        let pedidosClientes:any[] = [];
        ////////////////console.log(typeof clientesSeleccionados, Object.prototype.toString.call(clientesSeleccionados));
        let pedidosPorCliente!:any[];
        if(Object.prototype.toString.call(clientesSeleccionados) === '[object Array]'){
            for(let cliente of clientesSeleccionados){
                //////////////console.log(pedidos.filter(pedido => pedido.cardcode === cliente.code),condicion_tpt);
                pedidosPorCliente = pedidos.filter(pedido => pedido.cardcode === cliente.code && pedido.condicion_tpt === condicion_tpt);
                for(let pedido of pedidosPorCliente){
                    pedidosClientes.push(pedido)
                }   
            }
        }else{

            pedidosClientes = pedidos.filter(pedido => pedido.cardcode === clientesSeleccionados.code && pedido.condicion_tpt === condicion_tpt);
            //////////////console.log(pedidos.filter(pedido => pedido.cardcode === clientesSeleccionados.code));
        }
        

        //////////////console.log(pedidosClientes);
        return pedidosClientes;
    }

    getCantidadesComprometidas(pedidonum:string,itemcode:string, bodega:string,idPedido:number, tipoTurno:string ='RETIRO'):Observable<number> {
        const url:string = `${this.api_url}/api/solicitud-turnos/cantidades-comprometidas`;
        return this.http.get<number>(url,{params:{pedidonum,itemcode,bodega,idPedido,tipoTurno}});
    }

    getCantidadesComprometidasItemBodega(itemcode:string, bodega:string,idPedido:number):Observable<number> {
        const url:string = `${this.api_url}/api/solicitud-turnos/cantidades-comprometidas-item-bodega`;
        return this.http.get<number>(url,{params:{itemcode,bodega,idPedido}});
    }

    getCantidadesComprometidasBodegaItem(itemcode:string, bodega:string):Observable<number> {
        const url:string = `${this.api_url}/api/solicitud-turnos/cantidades-comprometidas-bodega-item`;
        return this.http.get<number>(url,{params:{itemcode,bodega}});
    }

    getInventarioItenBodega(item?:string,bodega?:string):Observable<any> {
        let optianalParams:string ="";
        if(item) optianalParams+=`&item=${item}`;
        if(bodega) optianalParams+=`&bodega=${bodega}`;
        const url:string = `${this.api_url}/api/sb1xe/inventario?compania=${this.urlApiService.companySAP}${optianalParams}`;
        return this.http.get<number>(url);
    }

    getInventarioItenBodega2(item?:string,bodega?:string):Observable<any> {
        let optianalParams:string ="";
        if(item) optianalParams+=`&item=${item}`;
        if(bodega) optianalParams+=`&bodega=${bodega}`;
        const url:string = `${this.api_url}/api/sb1xe/inventario2?compania=${this.urlApiService.companySAP}${optianalParams}`;
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


    getCantidadesComprometidasItemPedidoOtrasBodega(pedidonum:string,itemcode:string, bodega:string,idPedido:number, linea:number):Observable<number> {
        const url:string = `${this.api_url}/api/solicitud-turnos/cantidades-comprometidas-otras-bodegas`;
        return this.http.get<number>(url,{params:{pedidonum,itemcode,bodega,idPedido,linea}});
    }

    getInventarioLotesItemBodega(item?:string,bodega?:string):Observable<any> {
        let optianalParams:string ="";
        if(item) optianalParams+=`&item=${item}`;
        if(bodega) optianalParams+=`&bodega=${bodega}`;
        const url:string = `${this.api_url}/api/sb1xe/inventario-lotes?compania=${this.urlApiService.companySAP}${optianalParams}`;
        return this.http.get<number>(url);
    }


    getSaldosOrdenesCompra(cliente?:string,locacion2?:string):Observable<any> {
        let options:string = "";
        if(cliente){
            options+=`&cliente=${cliente}`;
        }
        if(locacion2){
            options+=`&locacion2=${locacion2}`;
        }
        const url:string = `${this.api_url}/api/sb1xe/saldos-ordenes?compania=${this.urlApiService.companySAP}${options}`;
        return this.http.get<any>(url);
    }



    getLotesItemDocnum(itemcode:string,linenum:string,docnum:any):Observable<any> {
        
        //const url:string = `${this.api_url}/api/sb1xe/lotes-item-doc?compania=${this.urlApiService.companySAP}&item=${itemcode}&linea=${linenum}&documento=${docnum}`;
        const url:string = `${this.api_url}/api/sb1xe/lotes-item-doc?compania=${this.urlApiService.companySAP}&item=${itemcode}&documento=${docnum}`;
        return this.http.get<any>(url);
    }

    async lotesItemDocnum(itemcode:string,linenum:string,docnum:any):Promise<any>{
        let lotesItemDoc$ =  this.getLotesItemDocnum(itemcode,linenum,docnum);
        let lotesItemDoc = await lastValueFrom(lotesItemDoc$);

        return lotesItemDoc;
    }

    getTurnosQuery(params:any):Observable<any[]> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        const url:string = `${this.api_url}/api/solicitud-turnos/turnos-query`;
        //return this.http.get<any>(url, requestOptions);
        return this.http.get<any>(url,{params:{where:JSON.stringify(params)}});
    }

    
    async getTurnosByQuery(params?:any):Promise<any[]> {
        const turnos$ = this.getTurnosQuery(params);
        const turnos = await lastValueFrom(turnos$);
        return turnos;
    }
   

   
    getQuery2(ruote:string,where?:any,relations?:any):Observable<any[]> {

        //const requestOptions = this.urlApiService.getHeadersAPI();

        let params:any ={};
        if(where){ params.where = JSON.stringify(where)};
        //if(relations){ params.relations = JSON.stringify(relations)};
        if(relations){ params.relations = relations};

        const url:string = `${this.api_url}/api/query/${ruote}`;
        //return this.http.get<any>(url, requestOptions);
        //return this.http.get<any>(url,{params:{where:JSON.stringify(where)}});
        return this.http.get<any>(url,{params});
        //return this.http.get<any>(url,{params:{where:params}});
    }

    
    async getAsyncQuery2(ruote:string,where?:any,relations?:any):Promise<any[]> {
        ////console.log('where',where)
        const query$ = this.getQuery2(ruote,where,relations);
        const query = await lastValueFrom(query$);
        return query;
    }
   


    
}
