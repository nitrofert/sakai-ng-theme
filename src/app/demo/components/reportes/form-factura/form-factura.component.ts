import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-form-factura',
  providers:[ConfirmationService,MessageService],
  templateUrl: './form-factura.component.html',
  styleUrls: ['./form-factura.component.scss']
})
export class FormFacturaComponent implements  OnInit {

  PEDIDO:string ="";
  DocDate:any ="";
  DocDueDate:any = "";
  PymntGroup:any = "";
  PAGADA:any = "";
  Comments:string ="";

  dataTable:any[] = [];
  headersTable:any[] = [];

  constructor(
    public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    ){}

    ngOnInit() {
      //console.log(this.config.data);
      this.PEDIDO = this.config.data.detalleFactura[0].PEDIDO;
      this.DocDate = new Date(this.config.data.detalleFactura[0].DocDate);
      this.DocDueDate = new Date(this.config.data.detalleFactura[0].DocDueDate);
      this.PymntGroup = this.config.data.detalleFactura[0].PymntGroup;
      this.PAGADA = this.config.data.detalleFactura[0].PAGADA;
      this.Comments = this.config.data.detalleFactura[0].Comments;
      
      this.headersTable = [
        {
            'ItemCode':{ 
              label:'Código material', 
              type:'text',
              sizeCol:'6rem',
              align:'left',
              field:'ItemCode'
            }, 
            'Dscription':{ 
                  label:'Material', 
                  type:'text',
                  sizeCol:'6rem',
                  align:'left',
                  field:'Dscription'
                }, 
            'Quantity': {
                  label:'Cantidad pedido',
                  type:'number', 
                  sizeCol:'6rem', 
                  align:'center',
                  field:'Quantity'
                }, 
            
            'PRECIOU_SINIVA':{
              label:'Precio',
              type:'number', 
              sizeCol:'6rem', 
              align:'center',
              field:'PRECIOU_SINIVA',
              currency:this.config.data.detalleFactura[0].DocCur,
              side:'left'

            },
            'IVA':{
              label:'IVA',
              type:'number', 
              sizeCol:'6rem', 
              align:'center',
              field:'IVA'
            },         
            'PRECIOU_CONIVA': {
              
                label:'Precio con IVA',
                type:'number', 
                sizeCol:'6rem', 
                align:'center',
                field:'PRECIOU_CONIVA',
                currency:this.config.data.detalleFactura[0].DocCur,
                side:'left'
            },
            'TOTAL_LINESINIVA': {
              
              label:'Total',
              type:'number', 
              sizeCol:'6rem', 
              align:'center',
              field:'TOTAL_LINESINIVA',
              currency:this.config.data.detalleFactura[0].DocCur,
              side:'left'
          },
            'WhsName': {
                  label:'Bodega de retiro',
                  type:'text', 
                  sizeCol:'6rem', 
                  align:'center',
                  field:'WhsName'
             }           
        }
      ];

      let detalleFactura:any[] = [];
      for(let linea of this.config.data.detalleFactura){
        detalleFactura.push({
            ItemCode:linea.ItemCode,
            Dscription:linea.Dscription,
            Quantity:linea.Quantity,
            PRECIOU_SINIVA:linea.PRECIOU_SINIVA,
            IVA:linea.IVA,
            PRECIOU_CONIVA:linea.PRECIOU_CONIVA,
            TOTAL_LINESINIVA:linea.TOTAL_LINESINIVA,
            WhsName:linea.WhsName

        })
      }
      this.dataTable = detalleFactura;
    }

    cancelar(){
      this.ref.close();
    }

}
