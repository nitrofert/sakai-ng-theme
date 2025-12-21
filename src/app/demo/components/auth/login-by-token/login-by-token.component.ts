import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-login-by-token',
  providers:[MessageService],
  templateUrl: './login-by-token.component.html',
  styleUrls: ['./login-by-token.component.scss'],
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginByTokenComponent implements OnInit{

  wellcomeMessage:string="";
  errorMessage:string="";
  submit:boolean =  false;
  email:string="";
  loading:boolean = false;



  constructor(public layoutService: LayoutService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
    ) {}

  async ngOnInit(): Promise<void> {
      let obj_parseUrl:any = this.router.parseUrl(this.router.url)
      //////console.log('obj_parseUrl',obj_parseUrl);
      if(obj_parseUrl.queryParams.token){
        localStorage.setItem('token',obj_parseUrl.queryParams.token)
        this.loading = true;
        this.authService.validateTokenToLogin(obj_parseUrl.queryParams.token)
            .subscribe({
                next:(result)=>{
                    //////console.log('result',result)
                    localStorage.clear();
                    localStorage.setItem('token',result.token)
                    this.wellcomeMessage = `Hola ${result.user.fullname} bienvenido al portal de autogestión`;
                    this.loading = false;
                    setTimeout(()=>{
                      //window.location.replace('/');
                    },2000)
                },
                error:(err)=>{
                    //////console.log('error',err);
                    this.loading = false;
                    this.errorMessage = `Acceso denegado. <br>Consulte con el administrador del sistema.`;
                    localStorage.clear();
                }
            })
      }
  }

  goHome(){
      this.router.navigateByUrl('/portal')
  }
}
