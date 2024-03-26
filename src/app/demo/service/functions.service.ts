
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UrlApiService } from './url-api.service';
import { Buffer } from 'buffer';
import * as FileSaver from 'file-saver';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as Handlebars from "handlebars";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

//import { readFileSync } from 'fs'
//const fs = require('fs-extra')

const htmlToPdfmake = require('html-to-pdfmake');



@Injectable({
    providedIn: 'root'
  })
export class FunctionsService {

 public meses:any[] = [
    {id:1,fullname:'ENERO', shortName:'ENE', fullnameEN:'JANUARY', shortNameEN:'JAN'},
    {id:2,fullname:'FEBRERO', shortName:'FEB',fullnameEN:'FEBRUARY', shortNameEN:'FEB'},
    {id:3,fullname:'MARZO', shortName:'MAR',fullnameEN:'MARCH', shortNameEN:'MAR'},
    {id:4,fullname:'ABRIL', shortName:'ABR',fullnameEN:'APRIL', shortNameEN:'APR'},
    {id:5,fullname:'MAYO', shortName:'MAY',fullnameEN:'MAY', shortNameEN:'MAY'},
    {id:6,fullname:'JUNIO', shortName:'JUN',fullnameEN:'JUNE', shortNameEN:'JUN'},
    {id:7,fullname:'JULIO', shortName:'JUL',fullnameEN:'JULY', shortNameEN:'JUL'},
    {id:8,fullname:'AGOSTO', shortName:'AGO',fullnameEN:'AUGUST', shortNameEN:'AUG'},
    {id:9,fullname:'SEPTIEMBRE', shortName:'SEP',fullnameEN:'SEPTEMBER', shortNameEN:'SEP'},
    {id:10,fullname:'OCTUBRE', shortName:'OCT',fullnameEN:'OCTOBER', shortNameEN:'OCT'},
    {id:11,fullname:'NOVIEMBRE', shortName:'NOV',fullnameEN:'NOVEMBER', shortNameEN:'NOV'},
    {id:12,fullname:'DICIEMBRE', shortName:'DIC',fullnameEN:'DECEMBER', shortNameEN:'DEC'},
 ];

 public windowScreen:any = window.screen;

 public dias:any[] = [
    {id:1,fullname:'LUNES', shortName:'LUN',fullnameEN:'MONDAY', shortNameEN:'MON'},
    {id:2,fullname:'MARTES', shortName:'MAR',fullnameEN:'TUESDAY', shortNameEN:'TUE'},
    {id:3,fullname:'MIERCOLES', shortName:'MIE',fullnameEN:'WEDNESDAY', shortNameEN:'WED'},
    {id:4,fullname:'JUEVES', shortName:'JUE',fullnameEN:'THURSDAY', shortNameEN:'THU'},
    {id:5,fullname:'VIERNES', shortName:'VIE',fullnameEN:'FRIDAY', shortNameEN:'FRI'},
    {id:6,fullname:'SABADO', shortName:'SAB',fullnameEN:'SATURDAY', shortNameEN:'SAT'},
    {id:0,fullname:'DOMINGO', shortName:'DOM',fullnameEN:'SUNDAY', shortNameEN:'SUN'}
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

async groupArray(array:any[], field:any,colsSum?:any[]):Promise<any[]>{
    let arrayGroup:any[]   = [];
   


    for(let item of array){
        if(arrayGroup.filter(itemTMP =>itemTMP[field] == item[field]).length==0){
          let lineasField = array.filter(linea=>linea[field] ==  item[field]);

            if(colsSum){

              Object.keys(colsSum[0]).map((col)=>{
                ////////////console.log(col);
                colsSum[0][col] = 0;
              })
              ////////////console.log('colsSum groupArray',colsSum);
              ////////////console.log('lineasField groupArray',lineasField);
              let colsTotal = await this.sumColArray(lineasField,colsSum);
              ////////////console.log('colsTotal groupArray',colsTotal);
              Object.keys(colsTotal[0]).map((col)=>{
                ////////////console.log(col);
                item[col] = colsTotal[0][col];
              })
            }
            arrayGroup.push(item)

            ////////////console.log(arrayGroup);
        }
    }

    return arrayGroup;
}

async dateDif(date1:Date, date2:Date, format:string = 'days'):Promise<any>{
    let dif:any=0;

    //dif = date2.getTime() - date1.getTime();
    dif = date1.getTime() - date2.getTime();

    //////////////////console.log(dif)

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

    return dif-1;

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
    //////console.log(itemData.pedidos_turno_cantidad);
      for(let itemKey of arrayKeys){
        //////console.log(itemKey,itemData[itemKey]);
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
  ////////////////console.log(infoClientes)
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
  /////////////////console.log(bufferOriginal.toString('utf8'));
  result = bufferOriginal.toString('utf8')

  return result;

}

async formatDate(date:Date,format:string, lan:string='ES'): Promise<string>{
  let dateFormat:string ='';

 ////////////////console.log(date.toLocaleDateString('en-us',{weekday:"long"})); 
 ////////////////console.log(date.toLocaleDateString('en-us',{month:"long"})); 


  switch(format){
    case 'DDDD, dd MMMMM YYYY':
          let daylong = date.toLocaleDateString('en-us',{weekday:"long"});
          let day = date.toLocaleDateString('en-us',{day:"2-digit"});
          let monthlong = date.toLocaleDateString('en-us',{month:"long"});
          let year = date.toLocaleDateString('en-us',{year:"numeric"});
          if(lan === 'ES'){
            dateFormat = `${this.dias.find(dia=>dia.fullnameEN===daylong.toUpperCase()).fullname.toLowerCase()}, ${day} - ${this.meses.find(mes=>mes.fullnameEN===monthlong.toUpperCase()).fullname.toLowerCase()} - ${year}`;
          }
          if(lan === 'EN'){
            dateFormat = `${daylong}, ${monthlong}  ${day} ${year}`;
          }

          
          
    break;
  }

  return dateFormat;
}

async generarColorHex():Promise<string>{
	var simbolos, color;
	simbolos = "0123456789ABCDEF";
	color = "#";

	for(var i = 0; i < 6; i++){
		color = color + simbolos[Math.floor(Math.random() * 16)];
	}

	return color;
}


async setDataPieDoughnutChart(data:any[],fields:any):Promise<any>{
  let dataChart:any;
  let labelsChart:any[] = [];
  let valuesChart:any[] = [];
  let backgroundColor:any[] = [];

  for(let item of data){
    let color = await this.generarColorHex();
    backgroundColor.push(color)
  }
  //////////console.log(backgroundColor);
  let hoverBackgroundColor:any[] = backgroundColor;


  for(let linea of data){
     labelsChart.push(linea[fields.label]);
     valuesChart.push(linea[fields.value]);
  }

  dataChart ={
    labels: labelsChart,

    datasets: [
        {
            //label: 'First Dataset',
            data: valuesChart,
            //fill: false,
            //backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
            //borderColor: documentStyle.getPropertyValue('--bluegray-700'),
            //tension: .4

            backgroundColor: backgroundColor,
            hoverBackgroundColor: hoverBackgroundColor
        },
      
    ]
};

  return dataChart;
}

async setDataBasicChart(data:any[],fields:any):Promise<any>{
  let dataChart:any;
  let labelsChart:any[] = [];
  let valuesChart:any[] = [];
  let backgroundColor:any[] = [];
  ////console.log(data);
  for(let item of data){
    ////console.log(item);
    let color = await this.generarColorHex();
    backgroundColor.push(color)
  }
  //////////console.log(backgroundColor);
  let hoverBackgroundColor:any[] = backgroundColor;


  for(let linea of data){
     labelsChart.push(linea[fields.label]);
     valuesChart.push(linea[fields.value]);
  }

  dataChart ={
    labels: labelsChart,

    datasets: [
        {
            label: 'Toneladas',
            data: valuesChart,
            //fill: false,
            //backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
            //borderColor: documentStyle.getPropertyValue('--bluegray-700'),
            //tension: .4

            backgroundColor: backgroundColor,
            hoverBackgroundColor: hoverBackgroundColor
        },
      
    ]
};
////console.log(dataChart);
  return dataChart;
}

async clonObject(object:any): Promise<any>{
  const newObject:any = JSON.parse(JSON.stringify(object));
  return newObject;
}


async extraerCampos(data:any[], fields:any): Promise<any>{

 //console.log(data);
  let dataExport:any =   data.map((linea)=>{

    let newLine:any = "{";

    for(let field in fields){
      //console.log(linea[field]);
      let key = fields[field];
      let value = linea[field]?linea[field].toString().trim().replace(/"/g,'').replace(/(\r\n|\n|\r|\t)/gm, ""):linea[field];
      newLine+=`"${key}":"${value}",`;
    }

    newLine = newLine.substring(0,newLine.length-1)+"}"
    console.log(newLine);
    //console.log(JSON.parse(newLine));
    return JSON.parse(newLine);

  });

  //console.log(dataExport);

  return dataExport;

}

async exportarXLS(data:any, docName:string):Promise<void> {

  import("xlsx").then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, docName);
});

}

  async saveAsExcelFile(buffer: any, fileName: string): Promise<void> {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  await this.log(` ha exportado el archivo ${fileName}`)
      
}

setLog(mensaje:string):Observable<any> {
  console.log(mensaje);
  let boody:any = {mensaje} 
  //const requestOptions = this.urlApiService.getHeadersAPI();

  const url:string = `${this.api_url}/api/log`;
  //return this.http.get<any>(url, requestOptions);
  return this.http.post<any>(url, boody);
}

async log(mensaje:string):Promise<any> {
  const log$ = this.setLog(mensaje);
  const log = await lastValueFrom(log$);
  return log;
}




getTamplateHTML(path:string):Observable<string>  {
    let template =  this.http.get('assets/demo/templates/'+path+'.template.html',{responseType:'text'})
    return template;
}

async compileHandlebarTemplate(templateHTML:string,data:any):Promise<any> {
  
  let compilarTemplate = Handlebars.compile(templateHTML);
  let templateHTMLCompilado =  compilarTemplate(data);

  return templateHTMLCompilado;
 
}

async getImgsTemplate(templateHTML:string):Promise<any[]> {

  let findTag:boolean = true;
    let imgs:any[] = [];
    let textoBusqueda:string = templateHTML;
    let pathSrc:string = "";
    let idImg =0;
    while(findTag){
      let indexImg = textoBusqueda.indexOf(`<img src="`);
      if(indexImg<0){
        findTag=false;
        
      }else{
        pathSrc = textoBusqueda.substring((indexImg+`<img src="`.length),textoBusqueda.indexOf(`"`,(indexImg+`<img src="`.length)));
        //console.log(`{"img${idImg}":"${pathSrc}"}`);
        imgs.push(JSON.parse(`{"img${idImg}":"${pathSrc}"}`));
        idImg++;
        textoBusqueda = textoBusqueda.substring(textoBusqueda.indexOf(`"`,(indexImg+`<img src="`.length)),textoBusqueda.length);
      }
    }

    //console.log('imgs',imgs);

  return imgs;
}

async replaceImgPathIdImg(imgsTemplate:any[],html:string):Promise<any>{

  let newHTML = html;
  
  for await (let img of imgsTemplate){
    //console.log(Object.keys(img)[0]);
    //console.log(img[Object.keys(img)[0]]);
    //console.log(html.indexOf(`"${img[Object.keys(img)[0]]}"`));
    let regex = new RegExp('"' + img[Object.keys(img)[0]] + '"', 'g');
    //console.log('regex',regex);
    newHTML = newHTML.replace(regex,`"${Object.keys(img)[0]}"`);
  }

  //let newHtml = html.replace(/nitrofert/g,"intefert");
  
  return newHTML;

}

async convertHTMLtoPDF(html:any,propertiesPDF?:any):Promise<any> {
  let pdfDefinition:any ={};
  if(propertiesPDF){
    pdfDefinition = propertiesPDF;
  }
  let imgsTemplate = await this.getImgsTemplate(html);
  if(imgsTemplate.length > 0){  
    html = await this.replaceImgPathIdImg(imgsTemplate,html);
    let images:any = {}
    for(let img of imgsTemplate){
      //console.log('img',img);   
    

      //let image = await this.convertImagenLocalToBase64(img[Object.keys(img)[0]]) // Cambiar en el src el  path a ruta local !!!!work¡¡¡

      let image = await this.convertImagenLocalToBase64(img[Object.keys(img)[0]]);
      //console.log('image',image);
      let newKey:any = `{"${Object.keys(img)[0]}":"${image}"}`; 
      //console.log('newKey',newKey);
      Object.assign(images,JSON.parse(newKey));
      
      //let image = await this.getBase64ImageFromURL(img[Object.keys(img)[0]]); //Error canvas no exported

      //let image = await this.convertImageToBase64(img[Object.keys(img)[0]],console.log()) //Error 

      
      //Object.assign(images,img);
    }
    //console.log('images',images);
    pdfDefinition.images = images;
  }
  let htmlDefinition = htmlToPdfmake(html,{tableAutoSize:true});     
  //console.log(htmlDefinition[0]);
  

 

  pdfDefinition.content = htmlDefinition[0];



  /*pdfDefinition = {
    content:htmlDefinition[0]
  }*/

  return pdfDefinition;
}


async createPDF(pdfDefinition:any):Promise<void>{
  const pdf = pdfMake.createPdf(pdfDefinition);
  pdf.open();
}





convertImagenLocalToBase64(url:any) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();       
    xhr.open("GET", url, true); 
    xhr.responseType = "blob";

    xhr.onload = function (e) {
      //console.log(this.response);
      var reader = new FileReader();
      reader.onload = function(event:any) {
         var res = event.target.result;
         //console.log(res)
         resolve(res)
      }
      var file = this.response;
      reader.readAsDataURL(file)
    };
    xhr.send();
    xhr.onerror = error => {
      reject(error);
    };
    //img.src = url;
  });
}

getBase64ImageFromURL(url:any) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    //img.setAttribute("crossOrigin", "anonymous");
    img.crossOrigin='anonymous';    
    //img.setAttribute('crossorigin', 'anonymous');
    img.setAttribute("Access-Control-Allow-Origin", "*");
    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx:any = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = error => {
      reject(error);
    };
    img.src = url;
  });
}
  

}