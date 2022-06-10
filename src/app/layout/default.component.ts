import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, RouteConfigLoadStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NjAuthService } from 'ng-jx/auth/core';
import { AppService } from '../core/app.service';

@Component({
    selector: 'layout',
    templateUrl: './default.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultLayoutComponent implements OnDestroy {
    private sub$ = new Subject<void>();

    collapsed = false;

    isFetching = false;

    get userName(): string { return this.appSrv.userName; };

    get entName(): string { return this.appSrv.entName; };

    constructor(
        private router: Router,
        cdr: ChangeDetectorRef,
        msgSrv: NzMessageService,
        private authSrv: NjAuthService,
        private appSrv: AppService) {

        appSrv.onUserInfoChange
            .pipe(takeUntil(this.sub$))
            .subscribe(data => {
                cdr.markForCheck();
            });

        router.events
            .pipe(takeUntil(this.sub$))
            .subscribe(evt => {
                if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
                    this.isFetching = true;
                }

                if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
                    this.isFetching = false;
                    if (evt instanceof NavigationError) {
                        msgSrv.error(`${evt.error} ${evt.url}`, { nzDuration: 1000 * 3 });
                    }
                    return;
                }

                if (!(evt instanceof NavigationEnd)) {
                    return;
                }

                setTimeout(() => { this.isFetching = false; }, 100);
            });
    }

    logout() {
        this.authSrv.removeToken();
        this.router.navigateByUrl('/login');
    }

    ngOnDestroy() {
        this.sub$.next();
        this.sub$.complete();
    }
}
