import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { AuthService } from "src/app/demo/service/auth.service";
import { UsuarioService } from "src/app/demo/service/usuario.service";

@Injectable({
  providedIn: 'root'
})
export class RoleAccesGuard implements CanActivate {

  constructor(private authService: AuthService,
              private usuarioService: UsuarioService,
    private router: Router){}

  async canActivate(route:ActivatedRouteSnapshot):Promise<boolean>  {
    const expectedRole = route.data['expectedRole'];
    ////////console.log(expectedRole);

    const roles$ = this.usuarioService.getRolesUsuario();
    const roles = await lastValueFrom(roles$);

    //const roles = await this.usuarioService.getRolesUsuario2();
   ////////console.log(roles,expectedRole, roles.find((rol: any) => rol.nombre === expectedRole));

    if( roles === undefined || ! roles.find((rol: any) => rol.nombre === expectedRole)){
       ////////console.log('rol no definido')
        return false;
    }

    return true;
    }
}