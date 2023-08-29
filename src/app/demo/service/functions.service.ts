
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UrlApiService } from './url-api.service';
import { Buffer } from 'buffer';


@Injectable({
    providedIn: 'root'
  })
export class FunctionsService {

 public meses:any[] = [
    {id:1,fullname:'ENERO', shortName:'ENE'},
    {id:2,fullname:'FEBRERO', shortName:'FEB'},
    {id:3,fullname:'MARZO', shortName:'MAR'},
    {id:4,fullname:'ABRIL', shortName:'ABR'},
    {id:5,fullname:'MAYO', shortName:'MAY'},
    {id:6,fullname:'JUNIO', shortName:'JUN'},
    {id:7,fullname:'JULIO', shortName:'JUL'},
    {id:8,fullname:'AGOSTO', shortName:'AGO'},
    {id:9,fullname:'SEPTIEMBRE', shortName:'SEP'},
    {id:10,fullname:'OCTUBRE', shortName:'OCT'},
    {id:11,fullname:'NOVIEMBRE', shortName:'NOV'},
    {id:12,fullname:'DICIEMBRE', shortName:'DIC'},
 ];

 public dias:any[] = [
    {id:1,fullname:'LUNES', shortName:'LUN'},
    {id:2,fullname:'MARTES', shortName:'MAR'},
    {id:3,fullname:'MIERCOLES', shortName:'MIE'},
    {id:4,fullname:'JUEVES', shortName:'JUE'},
    {id:5,fullname:'VIERNES', shortName:'VIE'},
    {id:6,fullname:'SABADO', shortName:'SAB'},
    {id:0,fullname:'DOMINGO', shortName:'DOM'}
 ];

 private api_url:string = "";

 constructor(private http: HttpClient,
  private urlApiService:UrlApiService,
  ) { 
      this.api_url = this.urlApiService.getUrlAPI();
  }

 async objectToArray(data:any):Promise<any>{
    let NewArray:any[] = [];
    for(let linea in data){
        NewArray.push(data[linea]);
    }
    return NewArray;
}

async groupArray(array:any[], field:any):Promise<any[]>{
    let arrayGroup:any[]   = [];
    let arrayTMP:any[] = [];

    for(let item of array){
        ////console.log(item[field]);
        if(arrayGroup.filter(itemTMP =>itemTMP[field] == item[field]).length==0){
            arrayGroup.push(item)
        }
    }

    return arrayGroup;
}

async dateDif(date1:Date, date2:Date, format:string = 'days'):Promise<any>{
    let dif:any=0;

    dif = date2.getTime() - date1.getTime();

    ////console.log(dif)

    switch(format){
        case 'seconds':
            dif = dif/1000;
        break;

        case 'minutes':
            dif = dif/(1000*60);
        break;

        case 'hours':
            dif = dif/(1000*60*60);
        break;
       
        default:
            dif = dif/(1000*60*60*24);
    }

    return dif;

}

async dateAdd(date:Date,numberAdd:number, format:string='days'): Promise<any>{
    let newDate:Date = date;
    if(format === 'days'){
        newDate.setDate(date.getDate() + numberAdd);    
    }

    if(format === 'months'){
        newDate.setMonth(date.getMonth() + numberAdd);    
    }

    if(format === 'years'){
        newDate.setFullYear(date.getFullYear() + numberAdd);    
    }

    
    return newDate;
}

async sortArrayObject(arrayToSort:any[],field:string,order:string):Promise<any[]>{

    
    arrayToSort.sort(function (a, b) {
        if (a[field] > b[field]) {
          if(order==='ASC'){
            return 1;
          }else{
            return -1;
          }
            

        }
        if (a[field] < b[field]) {
          
          if(order==='ASC'){
            return -1;
          }else{
            return 1;
          }
        }
        // a must be equal to b
        return 0;
      });


    return arrayToSort;
}


async validRoll(arrayRoles:any[], rol:string):Promise<boolean>{
  let existe:boolean = false;

  let arrayRol:any = arrayRoles.filter(role => role.nombre === rol);
  if (arrayRol.length > 0) {
    existe = true;
  }

  return existe;
}

async resolveObservable(observable:Observable<any>):Promise<any>{
  let result:any = await lastValueFrom(observable);
  return result;
}

async sumColArray(arrayData:any[], arrayCols:any[]):Promise<any[]>{
  
  let arrayKeys:any[] = Object.keys(arrayCols[0]);
  for(let itemData of arrayData){
      for(let itemKey of arrayKeys){
          arrayCols[0][itemKey] += parseFloat(itemData[itemKey]);
      }

  }

  return arrayCols;
}

sendMailObservable(objectMail:any):Observable<any>{
  const url:string = `${this.api_url}/api/mail/send`;
  return this.http.post<any>(url,objectMail);
}

async sendMail(objectMail:any): Promise<any>{
  const resultSendMail$ = this.sendMailObservable(objectMail);
  const resultSendMail = await lastValueFrom(resultSendMail$);
  //console.log(infoClientes)
  return resultSendMail;
}

async filter(event: any, arrayFiltrar:any[], limit?:number):Promise<any[]>{ 

    const filtered: any[] = [];
    const query = event.query;
    const limite = limit?limit:arrayFiltrar.length;
    for (let i = 0; i < arrayFiltrar.length; i++) {
        const linea = arrayFiltrar[i];
        if (linea.label.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            filtered.push(linea);
        }
    }
    
    return filtered.slice(0,limite);
}

bufferToString(buffer:any):string{
  let result:string="";

  let json = JSON.stringify(buffer);
  let bufferOriginal = Buffer.from(JSON.parse(json).data);
  ///console.log(bufferOriginal.toString('utf8'));
  result = bufferOriginal.toString('utf8')

  return result;

}


  

}