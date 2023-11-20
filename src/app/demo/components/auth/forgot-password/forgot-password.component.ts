import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-forgot-password',
  providers:[MessageService],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class ForgotPasswordComponent {

  wellcomeMessage:string="";
  submit:boolean =  false;
  email:string="";
  loading:boolean = false;


  constructor(public layoutService: LayoutService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
    ) {}



    resetPassword(){
      this.submit = true;
        this.loading = true;
        this.messageService.clear();
        if(!this.email){
            this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los campos resaltados en rojo son obligatorios'});
            this.loading = false;
            this.submit = false;
        }else{
          const dataRestore = { email:this.email}
          
          this.authService.resetPassword(dataRestore)
          .subscribe({
              next: (data)=>{
                  //////console.log(data);
                  
                      
                     
                      this.loading = false;
                      this.messageService.add({severity:'warn', summary: `Notificación:`, detail: `Se ha enviado un link al email ${this.email} para que pueda reestablecer su password.`});     
                      setTimeout(()=>{this.router.navigate(['/'])}, 1000)
                  
              },
              error: (err)=>{
                  this.loading = false;
                  this.messageService.add({severity:'error', summary: `Error:${err.error.statusCode}`, detail: err.error.message});
                  this.submit = false;
                  console.error(err);

              }
          })
        }
    }

}
