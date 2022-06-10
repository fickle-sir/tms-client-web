import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NjAuthService } from 'ng-jx/auth/core';
import { NjReuseService } from 'ng-jx/reuse-tab';

@Component({
  selector: 'div.form-box.login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;

  error: string | undefined = '';

  loading: boolean = false;

  constructor(
    fb: FormBuilder,
    modalSrv: NzModalService,
    private router: Router,
    private http: HttpClient,
    public msgSrv: NzMessageService,
    private authSrv: NjAuthService,
    private reuseTabSrv: NjReuseService
  ) {
    this.form = fb.group({
      username: ['admin'],
      password: ['admin8'],
      remember: [true],
    });

    // 使用setTimeout，防止http请求时，modal还未初始化完成，导致无法关闭
    setTimeout(() => modalSrv.closeAll(), 500);
  }

  submit() {
    this.error = '';
    this.loading = true;

    const data = {
      username: this.form.controls.username.value,
      password: this.form.controls.password.value,
    };

    this.http
      .post<any>('user/login', data)
      .subscribe(
        data => {
          this.loading = false;
          //this.reuseTabSrv.getProvider().clear();
          this.authSrv.setToken(data);
          const returnUrl = this.router.routerState.snapshot.root.queryParams['return_url'];
          this.router.navigateByUrl(returnUrl || '');
        },
        (err: HttpError) => {
          this.loading = false;
          this.error = err.msg;
        }
      );
  }
}
