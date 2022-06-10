import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { NjMenuService, NjMenu } from 'ng-jx';
import { AppService } from '../core/app.service';

@Component({
  selector: 'app-init',
  template: `<div *ngIf="msg" class="loading-body"><div>{{msg}}</div></div>`
})
export class InitializerComponent implements OnInit {
  msg: string | null | undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    private appSrv: AppService,
    private menuSrv: NjMenuService
  ) { }

  ngOnInit() {
    this.msg = null;

    if (!this.appSrv.initialized) {
      this.msg = '数据加载中...';

      const appData$ = this.http.get<NjMenu[]>('GetMenus');
      const userData$ = this.http.get<any>('user/getinfo');
      forkJoin([appData$, userData$])
        .subscribe(
          ([menus, u]) => {
            menus.push({ url: 'ent/info', text: '企业信息' });
            menus.push({ url: 'waybill_batch', text: '批量运单' });
            this.msg = '';

            this.menuSrv.get('sidebar').set(menus);
            this.appSrv.resetRouterConfig(menus);
            this.appSrv.initialized = true;

            this.appSrv.userName = u.UserName;
            this.appSrv.entName = u.EntName;

            this.router.navigateByUrl(this.router.url);
          },
          error => {
            if (error instanceof HttpErrorResponse)
              this.msg = `${error.status}:${error.statusText}`;
            else if (error instanceof Error)
              this.msg = error.message;
            else
              this.msg = typeof error === 'string' ? error : '数据加载出错';
          }
        );
    }
  }
}
