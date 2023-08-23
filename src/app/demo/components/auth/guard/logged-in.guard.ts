import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "src/app/demo/service/auth.service";

@Injectable({
    providedIn: 'root'
  })
  export class LoggedInGuard implements  CanActivate {
  
    constructor(private authService: AuthService,
                private router: Router){}
    
    canActivate(): boolean {

          console.log(this.authService.isAuth());
        
          if(this.authService.isAuth()){

            this.authService.validateToken()
                .subscribe({
                        next: (result)=>{
                            this.router.navigate(['/portal']);
                            return false;
                        },
                        error: (err)=>{
                            console.error(err);
                            localStorage.removeItem('token');
                            //this.router.navigate(['/']);
                            return false;
                        }
                })

           
          }
          
          return true;    
      
    }
    
  }
  