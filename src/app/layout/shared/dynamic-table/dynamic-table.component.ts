import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Checkbox } from 'primeng/checkbox';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html'
})
export class DynamicTableComponent implements OnInit {

  
  @Input() headersTable!:any;
  @Input() dataTable!:any;
  @Input() dataTypeTable!:any;
  @Input() dataKey!:string;
  @Input() rows!:number;
  @Input() rowsPerPageOptions!:number[];
  //@Input() 
  @Input() paginator!:boolean;
  @Input() selectionMode!:string;
  @Input() titleTable!:string;
  @Input() nameExport!:string;
  @Input() viewCheckselectedItem:boolean = true;
  @Input() viewCheckAllItem:boolean = false;
  @Input() showBtnNew:boolean = false;
  @Input() toolTipShowBtnNew:string = "Nuevo";
  @Input() permisosUsuarioPagina!:any[];
  @Input() showSelectedItems:boolean = false;

  @Output() onNewAccion: EventEmitter<any> = new EventEmitter();
  @Output() onSelectedItems: EventEmitter<any> = new EventEmitter();

  loading:boolean = false;
  selectedItem:any[] = [];
  columnsTable!:number;
  globalFilterFields!:string[];

  @ViewChild('filter') filter!: ElementRef;

  objectKeys = Object.keys;
  
  constructor(){}

  ngOnInit(): void {
   

   this.columnsTable = Object.keys(this.headersTable[0]).length+1;

    //console.log(this.columnsTable);
    let tmpKeysHeader:any[]=[];
    for(let key in this.headersTable[0]){
      
      tmpKeysHeader.push(key);
    }
    this.globalFilterFields = tmpKeysHeader;
    //console.log( this.globalFilterFields);

  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes['showSelectedItems']==undefined ? 'undefined sdsaj' : changes['showSelectedItems']);

    if(changes['showSelectedItems']!=undefined){
      if(changes['showSelectedItems'].currentValue ==true){
        //console.log('emit items selected');
        this.onSelectedItems.emit(this.selectedItem);
      }else{
        this.selectedItem = [];
      }
      
    }
}

  newAccion(){
    this.onNewAccion.emit(true);
  }

  emitSelectedItems(){
    this.onSelectedItems.emit(this.selectedItem);
  }

  selectLine(filaSeleccionada:any,valor:any, itemData:any){
   
    let fila = `selectRow${filaSeleccionada}`;
    console.log(fila, valor);
    /*let checkbox: HTMLElement;
    checkbox= document.getElementById(`selectRow${filaSeleccionada}`)!;
    console.log(checkbox.closest("tr"));
    let tr: any = checkbox.closest("tr");
    tr.pSelectableRow = itemData;
    if(valor == 0 || valor ==''){
      checkbox.ariaValueNow = "";
    }else{
      checkbox.ariaValueNow = itemData;
    }*/

  }




  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.dataTable);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `${this.nameExport}`);
    });
  }  

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}
