import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-login',
    providers:[MessageService],
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
        
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    password!: string;
    username!:string;
    wellcomeMessage:string="";
    submit:boolean =  false;
    verifycode:number = 0;
    verifycodeStatus:boolean = false;
    loading:boolean = false;
    usuario!:any;

    constructor(public layoutService: LayoutService,
                private messageService: MessageService,
                private authService: AuthService,
                private router: Router,
                //public dialogService: DialogService
                ) {}
    
    login(){
        this.submit = true;
        this.loading = true;
        this.messageService.clear();
        if(!this.password || !this.username ){
            this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Los campos resaltados en rojo son obligatorios'});
            this.loading = false;
        }else{
            const dataLogin = {
                username:this.username,
                password:this.password
            }
            
            this.authService.login(dataLogin)
                .subscribe({
                    next: (data)=>{
                        //////console.log(data);
                        
                            
                            this.verifycodeStatus = true;
                            this.loading = false;
                            this.messageService.add({severity:'warn', summary: `Notificación:`, detail: `Se ha enviado un codigo de verificación a su cuenta de correo. Por favor ingrese el codigo para comprobar su identidad.`});     

                        
                    },
                    error: (err)=>{
                        this.loading = false;
                        this.messageService.add({severity:'error', summary: `Error:${err.error.statusCode}`, detail: err.error.message});
                        console.error(err);
                    }
                })
        }
    }

    verifyCode(){
        this.submit = true;
        this.loading = true;
        this.messageService.clear();
        if(!this.verifycode ){
            this.messageService.add({severity:'error', summary: '!Error¡', detail: 'Debe ingresar el código de verificación'});
            this.loading = false;
        }else if(this.verifycode.toString.length > 9 ){
            this.messageService.add({severity:'error', summary: '!Error¡', detail: 'El código de verificación debe contener 9 numeros'});
            this.loading = false;
        }else{
            const dataVerifyCode = {
                username:this.username,
                password:this.password,
                codigoverificacion:this.verifycode
            }
            
            this.authService.verifyCode(dataVerifyCode)
                .subscribe({
                    next: (data)=>{
                        //////console.log(data);

                        if(data.token){
                            this.usuario = data.usuario;
                            //////console.log(this.usuario);
                            //TODO: Registrar token
                            localStorage.setItem('token', data.token);
                            this.messageService.add({severity:'success', summary: `Notificación`, detail: `Bienvenid@ ${this.usuario.nombrecompleto}`});    
                            setTimeout(()=>{this.router.navigate(['/portal'])}, 1000)
                        }
                    },
                    error: (err)=>{
                        this.loading = false;
                        this.messageService.add({severity:'error', summary: `Error:${err.error.statusCode}`, detail: err.error.message});
                        console.error(err);
                    }
                })
        }
    }

    
      
}
