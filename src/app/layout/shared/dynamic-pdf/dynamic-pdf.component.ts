import { Component, Input, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FunctionsService } from 'src/app/demo/service/functions.service';
//import  htmlToPdfmake  from "html-to-pdfmake"
import { MessageService } from 'primeng/api';
//(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

const htmlToPdfmake = require('html-to-pdfmake')

@Component({
  selector: 'app-dynamic-pdf',
  providers:[MessageService],
  templateUrl: './dynamic-pdf.component.html',
})
export class DynamicPdfComponent implements OnInit {

  @Input() pdfDefinition:any;
  @Input() disabled:boolean = false;
  @Input() html:any;
  @Input() pTooltip:any;
  @Input() class:any;

  
 
  

 

  constructor(private functionsService: FunctionsService,
             private messageService: MessageService) { }

  ngOnInit() {
    //Cargar informacion del usuario
    
    if(this.html){
        let htmlDefinition = htmlToPdfmake(this.html);     

        console.log(htmlDefinition[0]);
        this.pdfDefinition = {
            content:htmlDefinition[0]
        }
    }
    
  }

 

  createPDF(){
    console.log(this.pdfDefinition);

    if(!this.pdfDefinition){
        this.messageService.add({severity:'error', summary:'Error', detail:'no se ha definido el contenido del PDF'});
    }else{
        const pdf = pdfMake.createPdf(this.pdfDefinition);
        pdf.open();
    }

    
  }

}
