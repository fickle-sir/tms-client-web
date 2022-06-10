import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { NjAuthService } from 'ng-jx/auth/core';

@Injectable({ providedIn: 'root' })
export class EntIdGuard implements CanActivate {
  constructor(private router: Router, private authSrv: NjAuthService) { }

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | UrlTree {
    const entId = this.authSrv.getToken().payload.EntId;
    if (entId === '0')
      return this.router.parseUrl('/ent/reg');
    else
      return true;
  }
}
