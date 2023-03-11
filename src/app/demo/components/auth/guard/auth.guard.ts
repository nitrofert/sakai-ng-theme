import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { AuthService } from "src/app/demo/service/auth.service";

@Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate{
 
    constructor(private authService: AuthService,
                private router: Router) {}
  
    async canActivate():  Promise<boolean> {
  
      if(!this.authService.isAuth()){
        console.log('No existe token');
        this.router.navigate(['/']);
        return false;
      }

           
      this.authService.validateToken()
          .subscribe({
                next: (result)=>{
                    return result;
                },
                error: (err)=>{
                    localStorage.removeItem('token');
                    this.router.navigate(['/auth/access']);
                    return false;
                }
          })

      return true;
    }
  
   
   
    
    
  }