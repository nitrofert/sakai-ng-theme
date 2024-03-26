import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

    lang: string = "en";
    subscription: Subscription;
    
    constructor(private primengConfig: PrimeNGConfig,
                @Inject(TranslateService)
                public translate: TranslateService,
                private router: Router) { 
        
                translate.addLangs(['es', 'en']);
                translate.setDefaultLang('es');

                const browserLang = translate.getBrowserLang() || 'es';
                let lang = browserLang.match(/es|en/) ? browserLang : 'en';
                this.changeLang(lang);

                this.subscription = this.translate.stream('primeng').subscribe(data => {
                    this.primengConfig.setTranslation(data);
                });
                
                
    }

    ngOnInit() {
        this.primengConfig.ripple = true;
        
    }

    changeLang(lang: string) {
        this.translate.use(lang);
    }
}
