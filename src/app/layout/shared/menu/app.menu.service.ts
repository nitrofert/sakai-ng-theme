import {  HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UrlApiService } from 'src/app/demo/service/url-api.service';
import { MenuChangeEvent } from '../../api/menuchangeevent';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    api_url:string="";

    constructor(private http: HttpClient,
        private urlApiService:UrlApiService,
        ) { 
            this.api_url = this.urlApiService.getUrlAPI();
        }


    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    create(formMenu:any):Observable<any>{
        const url:string = `${this.api_url}/api/menu`;
        return  this.http.post<any>(url,formMenu);
    }

    update(formMenu:any, id:number):Observable<any>{
        const url:string = `${this.api_url}/api/menu/${id}`;
        return  this.http.patch<any>(url,formMenu);
    }

    getListadoMenu():Observable<any>{
        const url:string = `${this.api_url}/api/menu`;
        return  this.http.get<any>(url);
    }

    getMenuByID(id:number):Observable<any>{
        const url:string = `${this.api_url}/api/menu/${id}`;
        return  this.http.get<any>(url);
    }
    

}
