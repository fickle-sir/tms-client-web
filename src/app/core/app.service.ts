import { Injectable, Injector, EventEmitter } from '@angular/core';
import { Router, Route } from '@angular/router';
import { NjMenu, NjTableRoutableComponent } from 'ng-jx';

@Injectable({ providedIn: 'root' })
export class AppService {
  initialized: boolean = false;

  userName: string;

  entName: string;

  readonly onUserInfoChange = new EventEmitter<any>();

  constructor(private injector: Injector) {
    this.onUserInfoChange.subscribe(data => {
      if (data.userName)
        this.userName = data.userName;
      if (data.entName)
        this.entName = data.entName;
    });
  }

  private _localRoutes: any;
  private getLocalRoutes(router: Router): Route[] {
    const localRoutes = this._localRoutes || (this._localRoutes = router.config);

    const cloneRoutes = (source: Route[], target: Route[]) => {
      source.forEach(route => {
        const children = route.children ? [] : undefined;
        const newRoute = Object.assign({}, route, { children: children });

        if (children)
          cloneRoutes(route.children!, children);

        target.push(newRoute);
      });
    }

    const newRoutes = [];
    cloneRoutes(localRoutes, newRoutes);

    return newRoutes;
  }

  private applyMenusToRoutes(menus: NjMenu[], routes: Route[]): void {
    for (const menu of menus) {
      if (menu.children && menu.children.length > 0) {
        this.applyMenusToRoutes(menu.children, routes);
      } else {
        const { model } =menu;
        if (model) {
          routes.push({
            path: menu.url,
            component: NjTableRoutableComponent,
            data: {
              reuse: true,
              title: menu.text,
              model
            }
          });
        }
      }
    }
  }

  resetRouterConfig(menus: NjMenu[]) {
    const router = this.injector.get(Router);
    const routes = this.getLocalRoutes(router);

    const menuRoutes = routes.find(p => p.path === '')!.children!;
    this.applyMenusToRoutes(menus, menuRoutes);

    const index = routes.findIndex(p => p.path === '**');
    routes.splice(index, 1);

    router.resetConfig(routes);
  }
}
