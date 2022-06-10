import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NjAuthService } from 'ng-jx/auth/core';

@Component({
  selector: 'div.form-box.reg',
  templateUrl: './reg.component.html'
})
export class RegComponent {
  form: FormGroup;
  loading: boolean;

  constructor(
    fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authSvc: NjAuthService,
    public http: HttpClient,
    public msgSrv: NzMessageService
  ) {
    this.form = fb.group({
      Username: [null, [RegComponent.required('用户名')]],
      Password: [null, [RegComponent.required('密码')]],
      Confirm: [null, [RegComponent.required('确认密码'), RegComponent.confirmPwd]]
    });
  }

  setErrors(errors: any) {
    const { form } = this;
    for (var name in form.controls) {
      const error = errors[name];
      const control = form.controls[name];
      if (error) {
        control.markAsDirty();
        control.setErrors({ error: error });
      } else if (control.dirty) {
        control.setErrors(null);
      }
    }
    this.cdr.detectChanges();
  }

  submit() {
    for (const name in this.form.controls) {
      const ctl = this.form.controls[name];
      ctl.markAsDirty();
      ctl.updateValueAndValidity();
    }

    if (this.form.invalid)
      return;

    this.loading = true;
    this.http
      .post<string>('user/reg', this.form.value)
      .subscribe(
        token => {
          this.loading = false;
          this.authSvc.setToken(token);
          this.router.navigateByUrl('');
        },
        (err: HttpError) => {
          this.loading = false;
          if (err.state)
            this.setErrors(err.state);
          else if (err.msg)
            this.msgSrv.error(err.msg)
          else
            this.msgSrv.error('注册失败')
        }
      );
  }

  static required(name: string) {
    function fn(control: FormControl) {
      if (control.value === null || typeof control.value === 'undefined' || control.value === '')
        return { error: `请填写${name}` };

      return null;
    }

    return fn;
  }

  static confirmPwd(control: FormControl) {
    if (!control || !control.parent) {
      return null;
    }
    if (control.value !== control.parent.get('Password')!.value) {
      return { error: '确认密码与密码不一致' };
    }
    return null;
  }
}
