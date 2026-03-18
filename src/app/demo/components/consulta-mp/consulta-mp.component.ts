import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-consulta-mp',
    templateUrl: './consulta-mp.component.html'
})
export class ConsultaMpComponent implements OnInit{

    constructor(public layoutService: LayoutService, public router: Router) { }

    ngOnInit(): void {

        console.log('roter params:', this.router.url);
    }

}
