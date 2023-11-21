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
  @Input() colsSum!:any;
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
  @Input() showBtnEdit:boolean = false;
  @Input() toolTipShowBtnEdit:string = "Editar";
  @Input() showBtnExp:boolean = false;
  @Input() showBtnView:boolean = false;
  @Input() toolTipShowBtnExp:string = "Exportar";
  @Input() showBtnDelete:boolean = false;
  @Input() toolTipShowBtnDelete:string = "Anular";
  
  @Input() permisosUsuarioPagina!:any[];
  @Input() showSelectedItems:boolean = false;
  @Input() loading:boolean = false;

  @Output() onNewAccion: EventEmitter<any> = new EventEmitter();
  @Output() onSelectedItems: EventEmitter<any> = new EventEmitter();
  @Output() onEditAccion: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteAccion: EventEmitter<any> = new EventEmitter();
  @Output() onChangeState: EventEmitter<any> = new EventEmitter();
  @Output() onViewAccion: EventEmitter<any> = new EventEmitter();

  @Output() onChangeValue: EventEmitter<any> = new EventEmitter();

  //loading:boolean = this.showLoading;
  selectedItem:any[] = [];
  columnsTable!:number;
  globalFilterFields!:string[];
  totalCols:any[] = [];

  @ViewChild('filter') filter!: ElementRef;

  objectKeys = Object.keys;
  objectValues = Object.values;
  
  constructor(){}

  ngOnInit(): void {
   
    //////////////console.log(this.loading);

   this.columnsTable = Object.keys(this.headersTable[0]).length+1;

    ////////////////console.log(this.columnsTable);
    let tmpKeysHeader:any[]=[];
    for(let key in this.headersTable[0]){
      
      tmpKeysHeader.push(key);
    }
    this.globalFilterFields = tmpKeysHeader;
    ////////////////console.log( this.globalFilterFields);

    //////////console.log('this.colsSum',this.colsSum);

    if(this.colsSum){
      ////////console.log('this.colsSum',this.colsSum);
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    ////////console.log(changes);

    if(changes['showSelectedItems']!=undefined){
      if(changes['showSelectedItems'].currentValue ==true){
        ////////////////console.log('emit items selected or table', this.dataTable);
        //this.onSelectedItems.emit(this.selectedItem);
        this.onSelectedItems.emit(this.dataTable);
      }else{
        this.selectedItem = [];
      }
      
    }
    if(changes['colsSum']){
      ////////console.log(this.colsSum);
      this.totalCols = this.colsSum;
      //////console.log(this.totalCols);
    }
}

  newAccion(){
    this.onNewAccion.emit(true);
  }

  editAccion(){
   ////////////////console.log(this.selectedItem, this.selectedItem.length);
    this.onEditAccion.emit(this.selectedItem[0].id);
  }

  viewAccion(){
    this.onViewAccion.emit(this.selectedItem[0].id);
  }

  deleteAccion(){
    this.onDeleteAccion.emit(this.selectedItem);
  }

  changeState(key:any, valor:any,id:any){
    this.onChangeState.emit({key,valor,id});
  }
  

  emitSelectedItems(){
    this.onSelectedItems.emit(this.selectedItem);
  }

  cambioValorCampo(index:any,valor:any, itemData:any,campo:any){
   
    let fila = `${index}`;
    ////////////console.log(fila, valor, itemData);
    /*let checkbox: HTMLElement;
    checkbox= document.getElementById(`selectRow${filaSeleccionada}`)!;
    //////////////console.log(checkbox.closest("tr"));
    let tr: any = checkbox.closest("tr");
    tr.pSelectableRow = itemData;
    if(valor == 0 || valor ==''){
      checkbox.ariaValueNow = "";
    }else{
      checkbox.ariaValueNow = itemData;
    }*/
    this.onChangeValue.emit({index,valor,itemData,campo});

  }

  pressEnter(event:any,index:any,valor:any, itemData:any,campo:any){
    ////////////console.log(event);
    this.cambioValorCampo(index,valor,itemData,campo);
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
