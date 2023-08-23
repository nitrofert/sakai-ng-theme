import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-listado-reportes',
  templateUrl: './listado-reportes.component.html',
 styleUrls: ['./listado-reportes.component.scss']
 
})
export class ListadoReportesComponent implements OnInit {

  name = 'Set iframe source';
  url: string = 'https://nitrofert.com.co';
  urlSafe!: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
