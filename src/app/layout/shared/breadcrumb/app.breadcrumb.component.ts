import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './app.breadcrumb.component.html',
  //styleUrls: ['./breadcrumb.component.scss']
})
export class AppBreadcrumbComponent implements OnInit {

//@Input() urlBreadCrumb!:string;
urlBreadCrumb!:string;
breadcrumb:any[]=[];
home:any;

  constructor(private router:Router,) { }

  ngOnInit(): void {
    this.home =  {icon: 'pi pi-home', routerLink: '/'};
    this.urlBreadCrumb = this.router.url;
    if(this.urlBreadCrumb!=''){
      let tmpBreadCrumb = this.urlBreadCrumb.split("/",);
      for(let item of tmpBreadCrumb){
          //console.log(item);
          this.breadcrumb.push({label:item.replace(/-/g,' ')});
      }
       this.breadcrumb.shift();
       this.breadcrumb.shift();
    }
    

  }

}
