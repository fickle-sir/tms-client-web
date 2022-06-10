import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { VERSION as VERSION_ZORRO } from 'ng-zorro-antd/version';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TitleService } from './core';

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    iconSrv: NzIconService,
    private router: Router,
    private titleSrv: TitleService,
    private modalSrv: NzModalService,
  ) {
    // iconSrv.changeAssetsSource('/f/icons');
    renderer.setAttribute(
      el.nativeElement,
      'ng-zorro-version',
      VERSION_ZORRO.full,
    );
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => {
        this.titleSrv.setTitle();
        this.modalSrv.closeAll();
      });
  }
}
