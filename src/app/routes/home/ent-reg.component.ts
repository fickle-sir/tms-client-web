import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NjAuthService } from 'ng-jx/auth/core';
import { EntComponent } from './ent.component';

@Component({
  selector: 'div.form-box.ent',
  templateUrl: './ent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntRegComponent extends EntComponent implements OnInit {
  btnText: string = '立即注册';
  url: string = 'enterprise/reg';

  constructor(
    cdr: ChangeDetectorRef,
    fb: FormBuilder,
    http: HttpClient,
    msgSvc: NzMessageService,
    private router: Router,
    private authSvc: NjAuthService,
  ) {
    super(cdr, fb, http, msgSvc);
  }

  onSuccess(token: string) {
    this.authSvc.setToken(token);
    this.router.navigateByUrl('');
  }
}
