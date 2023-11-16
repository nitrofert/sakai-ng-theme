import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-change-password',
  providers:[MessageService],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class ChangePasswordComponent implements OnInit {

  wellcomeMessage:string="";
  submit:boolean =  false;
  token!:string;
  loading:boolean = false;
  password:string = "";
  password2:string = "";
  urlTree:any;
  usuario:string = "";

  constructor(public layoutService: LayoutService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    ) {}

    ngOnInit() {
      this.urlTree = this.router.parseUrl(this.router.url);
      if(!this.urlTree.queryParams['token']){
       ////console.log("error");
        this.showErrorToken();
      }else{
          this.token = this.urlTree.queryParams['token'];
          localStorage.setItem('token', this.token);
          if(this.urlTree.queryParams['usuario']){
            this.usuario = this.urlTree.queryParams['usuario'];
           ////console.log(this.usuario);
          }
          
      }
    }

    changePassword(){
      this.submit = true;
      this.loading = true;
      this.messageService.clear();
      if(!this.password || !this.password2 ){
          this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los campos resaltados en rojo son obligatorios'});
          this.loading = false;
      }else  if(this.password !== this.password2 ){
        this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los password ingresados no coinciden'});
        this.loading = false;
      }else{
          const dataChange = {
              
              password:this.password
          }
          
          this.authService.changePassword(dataChange, this.token)
              .subscribe({
                  next: (data)=>{
                     ////console.log(data);
                      
                          this.loading = false;
                          this.messageService.add({severity:'success', summary: `Notificación:`, detail: `Se ha realizado correctamente el cambio del password usuario ${this.usuario}.`});     
                          this.authService.logOut();
                          this.router.navigate(['/']);
                      
                  },
                  error: (err)=>{
                      this.loading = false;
                      if(err.status === 401){
                        this.messageService.add({severity:'error', summary: `Error:${err.error.statusCode}`, detail: `El token proporcionado es invalido o el tiempo ha expirado`});
                      }else{
                        this.messageService.add({severity:'error', summary: `Error:${err.error.statusCode}`, detail: err.error.message});
                      }
                      console.error(err);
                  }
              })
      }
    }

    showErrorToken(){
      this.messageService.add({severity:'error', summary: `Error:401`, detail: 'No se encontro un token valido para reestablecer el password'});
    }
}
